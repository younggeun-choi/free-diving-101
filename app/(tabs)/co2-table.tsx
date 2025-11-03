import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui/text';

export default function CO2TableScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 justify-center items-center bg-white" style={{ paddingTop: insets.top }}>
      <Text variant="h2">{t('co2Table.title')}</Text>
    </View>
  );
}
