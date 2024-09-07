import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

export interface User {
  id: number
  email: string
  nickname: string
  profile: string
  birth: number
  city: string
  levels: Level
}

interface Level {
  prehistoric: number
  threeKingdoms: number
  goryeo: number
  chosun: number
  modern: number
}

export const getMyInfo = async (token: string): Promise<User | null> => {
  try {
    const response: AxiosResponse<User> = await aiLearningAxios.get(
      'members/member',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response.data
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    return null
  }
}
