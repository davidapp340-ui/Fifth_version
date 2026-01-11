export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      exercises: {
        Row: {
          id: string
          animation_id: string
          icon_id: string
          audio_path_en: string | null
          audio_path_he: string | null
          title_en: string
          title_he: string
          description_en: string | null
          description_he: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          animation_id: string
          icon_id: string
          audio_path_en?: string | null
          audio_path_he?: string | null
          title_en: string
          title_he: string
          description_en?: string | null
          description_he?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          animation_id?: string
          icon_id?: string
          audio_path_en?: string | null
          audio_path_he?: string | null
          title_en?: string
          title_he?: string
          description_en?: string | null
          description_he?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_items_exercise_id_fkey"
            columns: ["id"]
            referencedRelation: "library_items"
            referencedColumns: ["exercise_id"]
          }
        ]
      }
      library_items: {
        Row: {
          id: string
          exercise_id: string
          category_name: string
          category_color: string
          enable_audio: boolean
          enable_animation: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exercise_id: string
          category_name: string
          category_color?: string
          enable_audio?: boolean
          enable_animation?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exercise_id?: string
          category_name?: string
          category_color?: string
          enable_audio?: boolean
          enable_animation?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_items_exercise_id_fkey"
            columns: ["exercise_id"]
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
