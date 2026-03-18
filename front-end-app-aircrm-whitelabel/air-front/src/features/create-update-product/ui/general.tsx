import { Dispatch, SetStateAction } from 'react'
import { useLocation } from 'react-router-dom'

import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { Grid, Typography } from '@mui/material'

import { Board, FileUploader, FormInput } from '@shared/ui'

import { CreateDto, UpdateDto } from '../model/dto'
import { VariationDetail, VariationType } from '../model/variation-types'
import { CategorySelect } from './category-select'
import { WarehouseSelect } from './warehouse-select'
import { VariationsSelect } from './variations-select'
import { ProductNameSearch } from './product-name-search'

interface Props {
  control: Control<CreateDto> | Control<UpdateDto>
  // control: Control<CreateDto | UpdateDto>
  setValue: UseFormSetValue<CreateDto> | UseFormSetValue<UpdateDto>
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  watch: UseFormWatch<CreateDto> | UseFormWatch<UpdateDto>
  imageErrorMessage?: string
  setVariationTypes?: Dispatch<SetStateAction<VariationType[]>>
  setVariationDetails?: Dispatch<SetStateAction<Record<string, VariationDetail>>>
  setInitialVariationDetails?: Dispatch<SetStateAction<Record<string, VariationDetail>>>
  setVariationName?: Dispatch<SetStateAction<string>>
}

export const General = ({
  control,
  files,
  setFiles,
  setValue,
  watch,
  imageErrorMessage,
  setVariationTypes,
  setVariationDetails,
  setInitialVariationDetails,
  setVariationName,
}: Props) => {
  const location = useLocation()
  const isCreatePage = location.pathname.includes('create')
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
            maxFileSize={1}
          />
        </Grid>
        {
          isCreatePage && (
              <WarehouseSelect
                control={control as Control<CreateDto>}
              />
          )
        }
        <CategorySelect
          control={control}
          categoryId={(watch as any)('category_id') as any}
          isCreatePage={isCreatePage}
        />
        <VariationsSelect control={control} />
        <Grid
          item
          xs={12}
          mobile={isCreatePage ? 3 : 4}
        >
          {isCreatePage ? (
            <ProductNameSearch
              control={control as any}
              setValue={setValue as any}
              warehouseId={isCreatePage ? (watch as any)('warehouse_id') || null : null}
              files={files}
              setFiles={setFiles}
              setVariationTypes={setVariationTypes!}
              setVariationDetails={setVariationDetails!}
              setInitialVariationDetails={setInitialVariationDetails!}
              setVariationName={setVariationName!}
            />
          ) : (
            <Controller
              name="name"
              control={control as any}
              render={({ field, fieldState }) => (
                <FormInput
                  control={control as any}
                  label="Название товара"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          )}
        </Grid>
        {/* {
          !isCreatePage && (
            <>
              <Grid
                item
                xs={6}
              >
              <Controller
                name="price"
                control={control}
                render={({ field, fieldState }) => (
                  <FormInput
                    control={control}
                    label="Цена"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              </Grid>
              <Grid
                item
                xs={6}
              >
                <Controller
                  name="product_code"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormInput
                      control={control}
                      label="Штрихкод"
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
            </>
          )
        } */}
        <Grid
          item
          xs={12}
        >
          <Controller
            name="description"
            control={control as Control<CreateDto>}
            render={({ field, fieldState }) => (
              <FormInput
                control={control as Control<CreateDto>}
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
