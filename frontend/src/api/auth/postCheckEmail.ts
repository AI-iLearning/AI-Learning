import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

interface CheckBooleanResponse {
  isExist: boolean
}

export const checkEmail = async (
  email: string,
): Promise<AxiosResponse<CheckBooleanResponse> | null> => {
  const response = await aiLearningAxios.post('members/check-email', { email })
  return response
}
