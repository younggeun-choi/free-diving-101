import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Training Stack Layout
 *
 * Creates a Stack navigator for training routes.
 * Configures custom headers for all training screens.
 */
export default function TrainingLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#FFF5E1',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              className="pl-4"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={28} color="#000000" />
            </TouchableOpacity>
          ),
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
