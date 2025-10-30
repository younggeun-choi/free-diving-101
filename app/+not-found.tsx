import { View } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '@/shared/ui/text';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text variant="h2" className="mb-4">
        페이지를 찾을 수 없습니다
      </Text>
      <Link href="/" className="text-blue-500">
        <Text variant="small" className="text-blue-500">
          홈으로 돌아가기
        </Text>
      </Link>
    </View>
  );
}
