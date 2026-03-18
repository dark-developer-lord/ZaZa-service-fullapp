import { BannerActions, BannerStatusToggle } from '@features/banners'
import { BannersTable, useGetBanners } from '@entities/banner'
import { Board } from '@shared/ui'

export const Ui = () => {
  const { data, isFetching, error } = useGetBanners()

  return (
    <Board>
      <BannersTable
        loading={isFetching}
        rows={data?.data || []}
        Actions={BannerActions}
        StatusToggle={BannerStatusToggle}
        error={error}
      />
    </Board>
  )
}
