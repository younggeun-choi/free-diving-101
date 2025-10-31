import { Stack } from 'expo-router';

/**
 * Training Stack Layout
 *
 * Configures navigation options for training screens.
 */
export default function TrainingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
