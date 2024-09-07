import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

export interface AISchedule {
  date: string
  city: string
  place: string
}

export const getSchedule = async (
  token: string,
): Promise<AxiosResponse<AISchedule[]> | null> => {
  const response = await aiLearningAxios.get('schedule/get', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}
