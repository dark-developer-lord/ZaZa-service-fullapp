import { Dispatch, Fragment, SetStateAction, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormSetValue,
} from 'react-hook-form'
import toast from 'react-hot-toast'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import CloseIcon from '@icons/close.svg?react'
import FolderIcon from '@icons/folder.svg?react'
import UploadIcon from '@icons/upload.svg?react'

import { DropzoneWrapper } from './dropzone-wrapper'

interface FileProp {
  name: string
  type: string
  size: number
}

const defaultAcceptValues = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
}

const defaultAcceptFilesText = '*.jpeg, *.jpg, *.png, *.gif, *.svg'

interface Props {
  title?: string
  name: string
  control: Control<any>
  setValue: UseFormSetValue<any>
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  acceptFiles?: { [key: string]: string[] }
  acceptFilesText?: string
  maxFiles?: number
  maxFileSize?: number //Размер в мегабайтах
  errorMessage?:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined
  compact?: boolean // New prop for compact styling
  sx?: any // Custom styling prop
  disabled?: boolean // New prop for disabled state
}

const FileUploader = ({
  title = 'Перетащите файл или нажмите чтобы загрузить',
  name,
  control,
  setValue,
  files,
  setFiles,
  acceptFiles = defaultAcceptValues,
  errorMessage,
  maxFileSize = 2,
  maxFiles = 1,
  acceptFilesText = defaultAcceptFilesText,
  compact = false,
  sx = {},
  disabled = false,
}: Props) => {
  const theme = useTheme()
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    maxSize: maxFileSize * 10 ** 6,
    accept: acceptFiles,
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: (fileRejections) => {
      if (fileRejections[0]) {
        if (fileRejections[0].errors[0] || fileRejections[0].errors[1]) {
          if (fileRejections[0].errors[0].code === 'file-invalid-type') {
            toast.error('Неправильный тип файла')
          } else {
            toast.error(
              `Вы можете выбирать только ${maxFiles} файл с размером ${maxFileSize}MB`,
              {
                duration: 2000,
              },
            )
          }
          if (fileRejections[0].errors[1].code === 'file-invalid-type') {
            toast.error('Неправильный тип файла')
          }
        }
      } else {
        toast.error(
          `Вы можете выбирать только ${maxFiles} файл с размером ${maxFileSize}MB`,
          {
            duration: 2000,
          },
        )
      }
    },
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return (
        <img
          width={38}
          height={38}
          alt={file.name}
          src={URL.createObjectURL(file as any)}
        />
      )
    }
    return (
      <FolderIcon
        width={20}
        height={20}
      />
    )
  }

  const handleRemoveFile = (file: FileProp) => {
    const filtered = files.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  useEffect(() => {
    if (files[0]) {
      setValue(name, files[0].name)
    } else {
      setValue(name, undefined)
    }
  }, [files])

  return (
    <Box sx={{ mb: compact ? 1 : 5, ...sx }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type="hidden"
            multiple
            {...field}
          />
        )}
      />
      {compact ? (
        // Compact version for customer edit form
        <Box
          {...(disabled ? {} : getRootProps({ className: 'dropzone' }))}
          sx={{
            minHeight: 100,
            display: 'flex',
            flexWrap: 'wrap',
            cursor: disabled ? 'not-allowed' : 'pointer',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 1,
            borderRadius: 1,
            border: `2px dashed ${disabled ? theme.palette.secondary.main : theme.palette.divider}`,
            backgroundColor: disabled ? theme.palette.secondary.main : 'transparent',
            opacity: disabled ? 0.8 : 1,
            '&:focus': {
              outline: 'none',
            },
            ...sx,
          }}
        >
          {!disabled && <input {...getInputProps()} />}
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <UploadIcon
              width={24}
              height={24}
              stroke={disabled ? 'black' : theme.palette.grey[500]}
            />
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                fontSize: '0.75rem',
                color: disabled ? 'black' : 'inherit'
              }}
            >
              {title}
            </Typography>
          </Box>
          {errorMessage && (
            <Typography
              variant="caption"
              color={theme.palette.error.main}
              textAlign="center"
              sx={{
                flexBasis: '100%',
                mt: 1,
                fontSize: '0.75rem',
              }}
            >
              {errorMessage.toString()}
            </Typography>
          )}
        </Box>
      ) : (
        // Original version for existing components
        <DropzoneWrapper {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <UploadIcon
              width={48}
              height={48}
              stroke={theme.palette.grey[500]}
            />
            <Typography
              variant="h5"
              sx={{ mt: 3, mb: 2.5 }}
            >
              {title}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Форматы: {acceptFilesText}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Максимальное кол-во файлов {maxFiles}
              <br />
              Максимальный размер каждого файла {maxFileSize} MB
            </Typography>
          </Box>
          {errorMessage && (
            <Typography
              variant="medium"
              color={theme.palette.error.main}
              textAlign="center"
              sx={{
                flexBasis: '100%',
                mt: '12px',
              }}
            >
              {errorMessage.toString()}
            </Typography>
          )}
        </DropzoneWrapper>
      )}
      {files.length > 0 ? (
        <Fragment>
          <List>
            {files.map((file: FileProp) => (
              <ListItem
                key={file.name}
                sx={{ px: '24px !important' }}
              >
                <div className="file-details">
                  <div className="file-preview">{renderFilePreview(file)}</div>
                  <div>
                    <Typography
                      className="file-name"
                      sx={{
                        wordBreak: 'break-all',
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      className="file-size"
                      variant="body2"
                    >
                      {Math.round(file.size / 100) / 10 > 1000
                        ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                        : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                    </Typography>
                  </div>
                </div>
                <IconButton onClick={() => handleRemoveFile(file)}>
                  <CloseIcon
                    width={20}
                    height={20}
                  />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <div className="buttons">
            <Button
              color="error"
              variant="outlined"
              onClick={handleRemoveAllFiles}
            >
              Очистить
            </Button>
          </div>
        </Fragment>
      ) : null}
    </Box>
  )
}

export { FileUploader }
