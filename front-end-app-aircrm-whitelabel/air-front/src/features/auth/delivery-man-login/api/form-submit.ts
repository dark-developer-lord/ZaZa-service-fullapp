import { SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import { DeliveryManApi, postQuery } from '@shared/api'
import {RouterPaths } from '@shared/lib'

import { Dto } from './dto'
import { storageToken, useProfile } from '@shared/auth'
import { Response } from './response-type'

export const useFormSubmit = () => {
  const mutation = useMutation({
    mutationFn: postQuery<Dto, Response>(import.meta.env.VITE_APP_API_URL + '/v1' + DeliveryManApi.login),
  })
  const navigate = useNavigate()
    const authorize = useProfile(({ authorize }) => authorize)

  const submitHandler: SubmitHandler<Dto> = ({ remember, ...dto }) => {
    const telegramUserId = (window as any).Telegram.WebApp.initDataUnsafe.user?.id

    const payload: Dto & { telegram_user_id?: number } = {
      ...dto,
      ...(telegramUserId ? { telegram_user_id: telegramUserId } : {}),
    }
    mutation.mutate(payload, {
      onSuccess({token}) {
        toast.success('Вы успешно вошли в систему')
        authorize(token)
        storageToken(token, !remember, "delivery-man")
        window.location.href = RouterPaths.posTerminal
      },
      onError(error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data.message || 'Произошла ошибка при входе',
          )
        }
      },
    })
  }

  return {
    mutating: mutation.isLoading,
    handler: submitHandler,
  }
}
