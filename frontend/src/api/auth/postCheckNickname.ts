import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

interface CheckBooleanResponse {
  isExist: boolean
}

export const checkNickname = async (
  nickname: string,
): Promise<AxiosResponse<CheckBooleanResponse> | null> => {
  const response = await aiLearningAxios.post('members/check-nickname', {
    nickname,
  })
  return response
}
