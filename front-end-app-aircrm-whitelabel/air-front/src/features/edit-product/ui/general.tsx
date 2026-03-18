import { Dispatch, SetStateAction } from 'react'
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'

import { Board, FileUploader, FormInput } from '@shared/ui'

import { Dto } from '../model/dto'
import { CategorySelect } from './category-select'
import { SelectRestaurant } from './select-restaurant'
import { VariationsSelect } from './variations-select'

interface Props {
  control: Control<Dto>
  setValue: UseFormSetValue<Dto>
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  watch: UseFormWatch<Dto>
  imageErrorMessage?: string
}

export const General = ({
  control,
  files,
  setFiles,
  setValue,
  watch,
  imageErrorMessage,
}: Props) => {
  return (
    <Board>
      <Typography
        variant="h6"
        mb="24px"
      >
        Общее
      </Typography>
      <Grid
        container
        spacing="24px"
      >
        <Grid
          item
          xs={12}
        >
          <FileUploader
            name="image"
            control={control}
            setValue={setValue}
            files={files}
            setFiles={setFiles}
            errorMessage={imageErrorMessage}
          />
        </Grid>
        <Grid
          item
          xs={4}
        >
          <SelectRestaurant control={control} />
        </Grid>
        <CategorySelect
          control={control}
          categoryId={watch('category_id')}
        />
        <VariationsSelect control={control} />
        <Grid
          item
          xs={4}
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <FormInput
                control={control}
                label="Название продукта"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={4}
        >
          <Controller
            name="veg"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth>
                <InputLabel>Тип продукта</InputLabel>
                <Select
                  label="Тип продукта"
                  size="medium"
                  {...field}
                  error={Boolean(fieldState.error)}
                >
                  <MenuItem value={1}>Вегетарианский</MenuItem>
                  <MenuItem value={0}>Не вегетарианский</MenuItem>
                </Select>
                <FormHelperText error>
                  {fieldState.error?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <FormInput
                control={control}
                label="Краткое описание (необезательно)"
                multiline
                rows={8}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '24px',
                  },
                }}
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>
    </Board>
  )
}
