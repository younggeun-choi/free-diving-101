import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Text } from '@/shared/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

/**
 * EducationAccordion Component
 *
 * Displays Frenzel equalizing educational content in an expandable accordion format.
 * Contains three sections:
 * 1. Overview - What is Frenzel equalizing?
 * 2. Principle - Three main muscles coordination
 * 3. Comparison - Valsalva vs Frenzel comparison table
 */
export function EducationAccordion() {
  const { t } = useTranslation();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{t('equalizing.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="gap-2">
          {/* Overview Section */}
          <AccordionItem value="overview">
            <AccordionTrigger>
              <Text variant="h4">{t('equalizing.overview.title')}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text variant="p" className="text-muted-foreground">
                {t('equalizing.overview.content')}
              </Text>
            </AccordionContent>
          </AccordionItem>

          {/* Principle Section */}
          <AccordionItem value="principle">
            <AccordionTrigger>
              <Text variant="h4">{t('equalizing.principle.title')}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <View className="gap-4">
                <Text variant="p" className="text-muted-foreground mb-2">
                  {t('equalizing.principle.content')}
                </Text>

                <View className="gap-3">
                  <View>
                    <Text variant="small" className="text-muted-foreground">
                      • {t('equalizing.principle.glottis')}
                    </Text>
                  </View>

                  <View>
                    <Text variant="small" className="text-muted-foreground">
                      • {t('equalizing.principle.softPalate')}
                    </Text>
                  </View>

                  <View>
                    <Text variant="small" className="text-muted-foreground">
                      • {t('equalizing.principle.tongue')}
                    </Text>
                  </View>
                </View>
              </View>
            </AccordionContent>
          </AccordionItem>

          {/* Comparison Section */}
          <AccordionItem value="comparison">
            <AccordionTrigger>
              <Text variant="h4">{t('equalizing.comparison.title')}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <View className="gap-3">
                {/* Air Source */}
                <View className="border-b border-border pb-2">
                  <Text variant="small" className="font-semibold mb-1">
                    {t('equalizing.comparison.airSource')}
                  </Text>
                  <View className="flex-row justify-between ml-4">
                    <View className="flex-1">
                      <Text variant="small" className="text-muted-foreground">
                        {t('equalizing.comparison.valsalva')}:{' '}
                        {t('equalizing.comparison.valsalvaAirSource')}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text variant="small" className="text-muted-foreground">
                        {t('equalizing.comparison.frenzel')}:{' '}
                        {t('equalizing.comparison.frenzelAirSource')}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Glottis State */}
                <View className="border-b border-border pb-2">
                  <Text variant="small" className="font-semibold mb-1">
                    {t('equalizing.comparison.glottisState')}
                  </Text>
                  <View className="flex-row justify-between ml-4">
                    <View className="flex-1">
                      <Text variant="small" className="text-muted-foreground">
                        {t('equalizing.comparison.valsalva')}:{' '}
                        {t('equalizing.comparison.valsalvaGlottis')}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text variant="small" className="text-muted-foreground">
                        {t('equalizing.comparison.frenzel')}:{' '}
                        {t('equalizing.comparison.frenzelGlottis')}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Mechanism */}
                <View className="border-b border-border pb-2">
                  <Text variant="small" className="font-semibold mb-1">
                    {t('equalizing.comparison.mechanism')}
                  </Text>
                  <View className="flex-row justify-between ml-4">
                    <View className="flex-1">
                      <Text variant="small" className="text-muted-foreground">
                        {t('equalizing.comparison.valsalva')}:{' '}
                        {t('equalizing.comparison.valsalvaMechanism')}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text variant="small" className="text-muted-foreground">
                        {t('equalizing.comparison.frenzel')}:{' '}
                        {t('equalizing.comparison.frenzelMechanism')}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Suitable Depth */}
                <View className="border-b border-border pb-2">
                  <Text variant="small" className="font-semibold mb-1">
                    {t('equalizing.comparison.depth')}
                  </Text>
                  <View className="flex-row justify-between ml-4">
                    <View className="flex-1">
                      <Text variant="small" className="text-muted-foreground">
                        {t('equalizing.comparison.valsalva')}:{' '}
                        {t('equalizing.comparison.valsalvaDepth')}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text variant="small" className="text-muted-foreground">
                        {t('equalizing.comparison.frenzel')}:{' '}
                        {t('equalizing.comparison.frenzelDepth')}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Head Position */}
                <View>
                  <Text variant="small" className="font-semibold mb-1">
                    {t('equalizing.comparison.headPosition')}
                  </Text>
                  <View className="flex-row justify-between ml-4">
                    <View className="flex-1">
                      <Text variant="small" className="text-muted-foreground">
                        {t('equalizing.comparison.valsalva')}:{' '}
                        {t('equalizing.comparison.valsalvaHead')}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text variant="small" className="text-muted-foreground">
                        {t('equalizing.comparison.frenzel')}:{' '}
                        {t('equalizing.comparison.frenzelHead')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
