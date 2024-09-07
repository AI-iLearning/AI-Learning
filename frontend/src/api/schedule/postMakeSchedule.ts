import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

interface SuccessResponse {
  message: string
}

export const makeSchedule = async (
  token: string,
  duration: string[],
  period: string[],
  description: string,
  places: string[],
  style: string[],
): Promise<AxiosResponse<SuccessResponse> | null> => {
  const response = await aiLearningAxios.post(
    'schedule/make',
    {
      duration,
      period,
      description,
      places,
      style,
    },
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return response
}
