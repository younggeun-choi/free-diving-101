import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui/text';

export default function EqualizingScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text variant="h2">{t('equalizing.title')}</Text>
    </View>
  );
}
