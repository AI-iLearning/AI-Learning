import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

interface User {
  id: number
  email: string
  nicknmae: string
  profile: string
  birth: number
  city: string
}

export const getList = async (): Promise<AxiosResponse<User[]> | null> => {
  const response = await aiLearningAxios.get('members/list')
  return response
}
