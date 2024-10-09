import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

interface GuideResponse {
  guideId: number
  chat: string[]
}

export const getSelect = async (
  token: string,
): Promise<AxiosResponse<GuideResponse[]> | null> => {
  const response = await aiLearningAxios.get('guide/select', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}
