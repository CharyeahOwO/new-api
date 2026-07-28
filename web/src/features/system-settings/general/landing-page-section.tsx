/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import * as z from 'zod'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormDirtyIndicator } from '../components/form-dirty-indicator'
import { FormNavigationGuard } from '../components/form-navigation-guard'
import {
  SettingsForm,
  SettingsFormGrid,
  SettingsFormGridItem,
} from '../components/settings-form-layout'
import { SettingsPageFormActions } from '../components/settings-page-context'
import { SettingsSection } from '../components/settings-section'
import { useSettingsForm } from '../hooks/use-settings-form'
import { useUpdateOption } from '../hooks/use-update-option'

const landingPageSchema = z.object({
  LandingPageBrandName: z.string().optional(),
  LandingPageTagline: z.string().optional(),
  LandingPageMicroTagline: z.string().optional(),
  LandingPageEyebrow: z.string().optional(),
  LandingPageBgImageMobile: z.string().optional(),
  LandingPageBgImagePc: z.string().optional(),
  LandingPageTerminalEndpoints: z.string().optional(),
})

type LandingPageFormValues = z.infer<typeof landingPageSchema>

type LandingPageSectionProps = {
  defaultValues: LandingPageFormValues
}

function normalizeValue(value: unknown): string {
  if (value === undefined || value === null) return ''
  return typeof value === 'string' ? value : String(value)
}

export function LandingPageSection({ defaultValues }: LandingPageSectionProps) {
  const { t } = useTranslation()
  const updateOption = useUpdateOption()

  const normalizedDefaults: LandingPageFormValues = {
    LandingPageBrandName: normalizeValue(defaultValues.LandingPageBrandName),
    LandingPageTagline: normalizeValue(defaultValues.LandingPageTagline),
    LandingPageMicroTagline: normalizeValue(
      defaultValues.LandingPageMicroTagline
    ),
    LandingPageEyebrow: normalizeValue(defaultValues.LandingPageEyebrow),
    LandingPageBgImageMobile: normalizeValue(
      defaultValues.LandingPageBgImageMobile
    ),
    LandingPageBgImagePc: normalizeValue(defaultValues.LandingPageBgImagePc),
    LandingPageTerminalEndpoints: normalizeValue(
      defaultValues.LandingPageTerminalEndpoints
    ),
  }

  const { form, handleSubmit, handleReset, isDirty, isSubmitting } =
    useSettingsForm<LandingPageFormValues>({
      resolver: zodResolver(landingPageSchema) as Resolver<
        LandingPageFormValues,
        unknown,
        LandingPageFormValues
      >,
      defaultValues: normalizedDefaults,
      onSubmit: async (_data, changedFields) => {
        for (const [key, value] of Object.entries(changedFields)) {
          await updateOption.mutateAsync({
            key,
            value: normalizeValue(value),
          })
        }
      },
    })

  return (
    <>
      <FormNavigationGuard when={isDirty} />

      <SettingsSection title={t('Landing Page')}>
        <Form {...form}>
          <SettingsForm onSubmit={handleSubmit}>
            <SettingsPageFormActions
              onSave={handleSubmit}
              onReset={handleReset}
              isSaving={isSubmitting || updateOption.isPending}
              isResetDisabled={!isDirty}
            />
            <FormDirtyIndicator isDirty={isDirty} />
            <SettingsFormGrid>
              <FormField
                control={form.control}
                name='LandingPageBrandName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Brand Name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('Brand name shown on the landing page')}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        'The headline brand name on the landing page. Leave empty to use the built-in default.'
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='LandingPageTagline'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Tagline')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('Primary tagline under the brand name')}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('The main tagline displayed under the brand name.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='LandingPageMicroTagline'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Micro Tagline')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('Smaller secondary tagline')}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('A smaller secondary line shown below the tagline.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='LandingPageEyebrow'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Eyebrow Text')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('Small welcome line above the brand name')}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('A small welcome line shown above the brand name.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='LandingPageBgImageMobile'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Background Image (Mobile)')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('https://example.com/bg-mobile.jpg')}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('Background image URL used on mobile devices.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='LandingPageBgImagePc'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Background Image (Desktop)')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('https://example.com/bg-pc.jpg')}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('Background image URL used on desktop devices.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SettingsFormGridItem span='full'>
                <FormField
                  control={form.control}
                  name='LandingPageTerminalEndpoints'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Terminal Demo Endpoints')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            '/v1/chat/completions\n/v1/responses\n/v1/messages'
                          }
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          'API endpoints cycled in the landing page terminal demo, one per line (or comma-separated). The base URL reuses the Server Address setting.'
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </SettingsFormGridItem>
            </SettingsFormGrid>
          </SettingsForm>
        </Form>
      </SettingsSection>
    </>
  )
}
