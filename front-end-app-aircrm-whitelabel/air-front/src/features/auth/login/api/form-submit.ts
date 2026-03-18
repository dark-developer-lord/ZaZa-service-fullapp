import { SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import { Api, postQuery } from '@shared/api'
import { storageToken, useProfile } from '@shared/auth'
import { RouterPaths } from '@shared/lib'

import { Dto } from './dto'
import { Response } from './response-type'


const hint = localStorage.getItem("hint")

export const useFormSubmit = () => {
  const mutation = useMutation({
    mutationFn: postQuery<Dto, Response>(Api.login),
  })
  const navigate = useNavigate()
  const authorize = useProfile(({ authorize }) => authorize)

  const submitHandler: SubmitHandler<Dto> = ({ remember, ...dto }) => {
    mutation.mutate(dto, {
      onSuccess({ token, type }) {
        toast.success('Вы успешно вошли в систему')
        authorize(token)
        storageToken(token, !remember, type)
        navigate(hint == 'hide' ? RouterPaths.posTerminal : RouterPaths.onboarding)

        if (hint === null) {
          localStorage.setItem('hint', 'show')
        }
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
