import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Ui as Products} from './products'
import { Ui as Arrivals } from './arrivals'
import { Ui as Sales } from './sales'
import { Ui as Transfers } from './transfers'
import { IncomingTransfers } from './incoming'
// import { Ui as Inventory } from './inventory'

export const Ui = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const reportType = searchParams.get('report')

  // Redirect old routes to "receipt"
  useEffect(() => {
    if (reportType === 'arrivals' || reportType === 'arrival') {
      navigate('/warehouse?report=receipt', { replace: true })
    }
  }, [reportType, navigate])

  switch (reportType) {
    case 'receipt':
      return <Arrivals />
    case 'sales':
      return <Sales />
    case 'flow':
      return <Transfers />
    case 'incoming':
      return <IncomingTransfers />
    // case 'inventory':
    //   return <Inventory />
    case 'arrivals':
    case 'arrival':
      // Old routes - will be redirected by useEffect above
      return null
    default:
      return <Products />
  }
}
