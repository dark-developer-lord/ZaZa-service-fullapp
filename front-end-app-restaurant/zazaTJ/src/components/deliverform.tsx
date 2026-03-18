import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { partnerApi, ApiError } from '@/lib/api'

interface B2BFormData {
  contactName: string
  phone: string
  email: string
  companyName: string
  city: string
  monthlyDeliveries: string
  privacyAccepted: boolean
}

const Deliverform = () => {
  const { t } = useTranslation()
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<B2BFormData>()

  const onSubmit = async (data: B2BFormData) => {
    setSubmitStatus('loading')
    setServerError('')
    try {
      await partnerApi.submitB2B({
        company_name:  data.companyName,
        contact_name:  data.contactName,
        phone:         data.phone,
        email:         data.email,
        city:          data.city,
        description:   `Ежемесячных доставок: ${data.monthlyDeliveries}`,
      })
      setSubmitStatus('success')
      reset()
    } catch (err) {
      setSubmitStatus('error')
      setServerError(err instanceof ApiError ? err.message : 'Ошибка сети. Попробуйте снова.')
    }
  }

  const inputClass = 'w-full rounded-md bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-ring transition-all'

  if (submitStatus === 'success') {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 mt-10 p-8">
        <div className="text-green-500 text-6xl">✓</div>
        <p className="text-xl font-bold">{t('dineout.a37')} — Спасибо!</p>
        <p className="text-gray-500 text-center">Наш менеджер свяжется с вами в течение 24 часов.</p>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto flex flex-col gap-6 mt-10">

        {/* Имя */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            <span className="text-destructive">*</span> {t('dineout.a24')}
          </label>
          <input
            {...register('contactName', { required: true })}
            type="text"
            placeholder={t('dineout.a25')}
            className={inputClass}
          />
          {errors.contactName && <p className="text-red-500 text-xs">Обязательное поле</p>}
        </div>

        {/* Телефон */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            <span className="text-destructive">*</span> {t('dineout.a26')}
          </label>
          <input
            {...register('phone', { required: true })}
            type="tel"
            placeholder={t('dineout.a27')}
            className={inputClass}
          />
          {errors.phone && <p className="text-red-500 text-xs">Обязательное поле</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            <span className="text-destructive">*</span> {t('dineout.a28')}
          </label>
          <input
            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            type="email"
            placeholder={t('dineout.a29')}
            className={inputClass}
          />
          {errors.email && <p className="text-red-500 text-xs">Введите корректный email</p>}
        </div>

        {/* Компания */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            <span className="text-destructive">*</span> {t('dineout.a30')}
          </label>
          <input
            {...register('companyName', { required: true })}
            type="text"
            placeholder={t('dineout.a31')}
            className={inputClass}
          />
          {errors.companyName && <p className="text-red-500 text-xs">Обязательное поле</p>}
        </div>

        {/* Город */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            <span className="text-destructive">*</span> {t('dineout.a32')}
          </label>
          <input
            {...register('city', { required: true })}
            type="text"
            placeholder={t('dineout.a33')}
            className={inputClass}
          />
          {errors.city && <p className="text-red-500 text-xs">Обязательное поле</p>}
        </div>

        {/* Ежемесячное кол-во доставок */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            <span className="text-destructive">*</span> {t('dineout.a34')}
          </label>
          <input
            {...register('monthlyDeliveries', { required: true })}
            type="text"
            placeholder={t('dineout.a35')}
            className={`w-full rounded-md bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border outline-none focus:ring-2 focus:ring-ring transition-all`}
          />
          {errors.monthlyDeliveries && <p className="text-red-500 text-xs">Обязательное поле</p>}
        </div>

        {/* Согласие */}
        <div className="flex items-start gap-3">
          <input
            {...register('privacyAccepted', { required: true })}
            type="checkbox"
            id="privacy"
            className="mt-1 h-4 w-4 rounded border-border accent-primary cursor-pointer"
          />
          <label htmlFor="privacy" className="text-sm text-foreground leading-relaxed cursor-pointer">
            {t('dineout.a36')}
          </label>
        </div>
        {errors.privacyAccepted && <p className="text-red-500 text-xs">Необходимо дать согласие</p>}

        {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={submitStatus === 'loading'}
            className="bg-[#1EA780] rounded-lg px-16 py-3.5 text-base font-bold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer w-60 mb-30 disabled:opacity-60"
          >
            {submitStatus === 'loading' ? 'Отправка...' : t('dineout.a37')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Deliverform
