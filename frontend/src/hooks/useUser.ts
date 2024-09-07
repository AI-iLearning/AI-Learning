import { useQuery } from 'react-query'

import { getMyInfo, User } from '../api/auth/getMyInfo'
import authToken from '../stores/authToken'

export const useUser = () => {
  const token = authToken.getAccessToken()

  return useQuery<User | null>('user', () => getMyInfo(token), {
    enabled: !!token, // 토큰이 있을 때만 쿼리를 실행
  })
}
