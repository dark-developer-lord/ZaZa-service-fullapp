import { useMutation } from 'react-query'
import { postQuery, VendorApi } from '@shared/api'

export interface AIInsightRequest {
  page: 'customers' | 'financial-overview'
}

export interface ActionLink {
  title: string
  description: string
  type: string
  url: string
  count?: number
  filters?: Record<string, any>
}

export interface AIInsightResponse {
  insights: string
  recommendations: string[]
  warnings?: string[]
  cached?: boolean
  cache_type?: string
  generated_at?: string
  excel_export?: {
    file_name: string
    file_path: string
    download_url: string
    total_customers?: number
    min_absence_days?: number
    generated_at: string
  }
  action_links?: ActionLink[]
}

export const useGetAIInsights = () => {
  return useMutation({
    mutationFn: postQuery<AIInsightResponse, AIInsightRequest>(
      VendorApi.getAIInsights
    ),
  })
}

