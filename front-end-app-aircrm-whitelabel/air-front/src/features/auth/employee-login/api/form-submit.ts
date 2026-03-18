import { SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import { VendorApi, postQuery } from '@shared/api'
import { RouterPaths } from '@shared/lib'

import { Dto } from './dto'
import { storageToken, useProfile } from '@shared/auth'
import { Response } from './response-type'

export const useFormSubmit = () => {
  const mutation = useMutation({
    mutationFn: postQuery<Dto, Response>(VendorApi.employeeLogin),
  })
  const navigate = useNavigate()
  const authorize = useProfile(({ authorize }) => authorize)

  const submitHandler: SubmitHandler<Dto> = ({ remember, ...dto }) => {
    mutation.mutate(dto, {
      onSuccess({ token }) {
        toast.success('Вы успешно вошли в систему')
        authorize(token)
        storageToken(token, !remember, "vendor-employee")
        navigate(RouterPaths.posTerminal)
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
