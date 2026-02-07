/*
  # Add Independent User Infrastructure (Phase 1)
  
  ## Overview
  This migration adds database support for "Independent Users" - adults or teenagers
  who train without parental supervision. Independent users authenticate like parents
  but track progress like children by having a child record linked to their auth.users ID.
  
  ## 1. Schema Changes
  
  ### children table
  - Add `auth_user_id` column (nullable, references auth.users)
    - NULL for regular children (device-paired)
    - Set for independent users (auth-linked)
  - Add unique index on auth_user_id
  
  ## 2. RLS Policy Updates
  
  ### children table
  - Add policy: Independent users can SELECT/UPDATE their own child record
  - Maintains existing parent and public policies
  
  ## 3. Trigger Function Update
  
  ### handle_new_user()
  - Add support for 'independent' role
  - When role='independent':
    - Create profile with role='independent'
    - Create family named 'My Training'
    - Auto-create child record with auth_user_id set to user's ID
  - Maintains existing 'parent' role logic
  
  ## Security Notes
  - Independent users can only access their own child record
  - Parents maintain access to all children in their family
  - Device pairing (public policies) unchanged
  - SECURITY DEFINER ensures trigger executes with admin privileges
*/

-- ============================================================================
-- 1. Add auth_user_id column to children table
-- ============================================================================

-- Add column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE children ADD COLUMN auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create unique index to ensure one child per auth user
CREATE UNIQUE INDEX IF NOT EXISTS idx_children_auth_user_id 
  ON children(auth_user_id) 
  WHERE auth_user_id IS NOT NULL;

-- ============================================================================
-- 2. Add RLS policies for independent users
-- ============================================================================

-- Independent users can view their own child record
CREATE POLICY "Independent users can view own child record"
  ON children FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Independent users can update their own child record
CREATE POLICY "Independent users can update own child record"
  ON children FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- ============================================================================
-- 3. Update handle_new_user trigger function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_family_id uuid;
  user_first_name text;
  user_last_name text;
  user_role text;
  family_name text;
  new_child_id uuid;
BEGIN
  -- Extract metadata from user
  user_first_name := NEW.raw_user_meta_data->>'first_name';
  user_last_name := NEW.raw_user_meta_data->>'last_name';
  user_role := NEW.raw_user_meta_data->>'role';

  -- Default to 'parent' if role not specified
  IF user_role IS NULL OR user_role = '' THEN
    user_role := 'parent';
  END IF;

  -- Handle independent user signup
  IF user_role = 'independent' THEN
    -- Create personal training family
    INSERT INTO public.families (name)
    VALUES ('My Training')
    RETURNING id INTO new_family_id;

    -- Create independent profile
    INSERT INTO public.profiles (id, family_id, email, role, first_name, last_name)
    VALUES (NEW.id, new_family_id, NEW.email, 'independent', user_first_name, user_last_name);

    -- Auto-create child record linked to this auth user
    INSERT INTO public.children (
      family_id,
      name,
      auth_user_id
    ) VALUES (
      new_family_id,
      'My Progress',
      NEW.id
    );

  -- Handle regular parent signup (existing logic)
  ELSE
    -- Create family name based on last_name
    IF user_last_name IS NOT NULL AND user_last_name != '' THEN
      family_name := user_last_name || ' Family';
    ELSE
      family_name := 'My Family';
    END IF;

    -- Create family
    INSERT INTO public.families (name)
    VALUES (family_name)
    RETURNING id INTO new_family_id;

    -- Create parent profile
    INSERT INTO public.profiles (id, family_id, email, role, first_name, last_name)
    VALUES (NEW.id, new_family_id, NEW.email, 'parent', user_first_name, user_last_name);
  END IF;

  RETURN NEW;
END;
$$;

-- Ensure trigger is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
