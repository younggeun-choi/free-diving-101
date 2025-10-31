import { View } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui/text';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text variant="h2" className="mb-4">
        {t('notFound.title')}
      </Text>
      <Link href="/" className="text-blue-500">
        <Text variant="small" className="text-blue-500">
          {t('notFound.goHome')}
        </Text>
      </Link>
    </View>
  );
}
