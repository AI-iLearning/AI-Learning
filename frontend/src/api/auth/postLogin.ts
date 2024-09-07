import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

interface LoginResponse {
  token: string
}

export const login = async (
  email: string,
  password: string,
): Promise<AxiosResponse<LoginResponse> | null> => {
  const response = await aiLearningAxios.post('members/login', {
    email,
    password,
  })
  return response
}
