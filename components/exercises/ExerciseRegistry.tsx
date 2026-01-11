/**
 * Exercise Component Registry
 *
 * This file maps animation_id values from the database to their corresponding
 * React Native animation components. When fetching an exercise from the database,
 * use the animation_id to look up the correct component to render.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Import exercise animation components here as they're created
import PalmingExercise from './palming_exercise';
// import BallTrackingAnimation from './BallTrackingAnimation';

// Placeholder component for exercises not yet implemented
const PlaceholderExercise: React.FC<{ animationId: string }> = ({ animationId }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>
      Exercise Animation: {animationId}
    </Text>
    <Text style={styles.placeholderSubtext}>
      Component not yet implemented
    </Text>
  </View>
);

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

/**
 * Registry mapping animation_id to React Native components
 */
export const ExerciseRegistry: Record<string, React.ComponentType<any>> = {
  // Map animation IDs to their components
  'palming_v1': PalmingExercise,
  // 'ball_tracking_v1': BallTrackingAnimation,
  // Add more as they're created
};

/**
 * Get the animation component for a given animation_id
 */
export function getExerciseComponent(animationId: string): React.ComponentType<any> {
  const Component = ExerciseRegistry[animationId];

  if (!Component) {
    return (props: any) => <PlaceholderExercise animationId={animationId} {...props} />;
  }

  return Component;
}

/**
 * Component that renders an exercise by animation_id
 */
export const ExerciseAnimationRenderer: React.FC<{
  animationId: string;
  [key: string]: any;
}> = ({ animationId, ...props }) => {
  const Component = getExerciseComponent(animationId);
  return <Component {...props} />;
};
