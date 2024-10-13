import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { kakaoCallback } from '../../../api/auth/postKakaoCallback'
import { postNewAccessToken } from '../../../api/auth/postNewAccessToken'
import { postRefreshAccessToken } from '../../../api/auth/postRefreshAccessToken'
import Loading from '../../../components/Loading/Loading'
import { useAllPlace } from '../../../hooks/useAllPlace'
import authKakaoToken from '../../../stores/authKakaoToken'
import authToken from '../../../stores/authToken'
import { isAxios401Error } from '../../../utils/isAxios401Error'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const kakao = (window as any).Kakao

const KakaoRedirectHandle = () => {
  const navigate = useNavigate()
  const { isLoading } = useAllPlace()

  useEffect(() => {
    const params = new URL(document.location.toString()).searchParams
    const code = params.get('code')
    const grant_type = 'authorization_code'
    const client_id = process.env.REACT_APP_KAKAO_CLIENT_ID
    const url = 'https://ai-learning-kappa.vercel.app'
    axios
      .post(
        `https://kauth.kakao.com/oauth/token?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${url}/start/oauth&code=${code}`,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      )
      .then(async res => {
        const accessToken = res.data.access_token
        const refreshToken = res.data.refresh_token
        kakao.Auth.setAccessToken(accessToken)

        authKakaoToken.setTokens(accessToken, refreshToken)
        getUserInfo(accessToken, refreshToken)
      })
      .catch(error => {
        console.error('카카오 토큰 요청 실패:', error)
      })
  }, [navigate])

  const getUserInfo = (accessToken: string, refreshToken: string) => {
    kakao.API.request({
      url: '/v2/user/me',
    })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(async (response: any) => {
        const email = response.kakao_account?.email
        const callbackResponse = await kakaoCallback(accessToken)
        if (callbackResponse?.data.userExists) {
          navigate('/calendar')
          authToken.setToken(callbackResponse.data.token)
        } else {
          navigate('/register', { state: { accessToken, email } })
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: any) => {
        console.error('카카오 사용자 정보 요청 실패:', error)

        if (isAxios401Error(error)) {
          const newAccessToken = await postRefreshAccessToken(refreshToken)
          if (newAccessToken) {
            authKakaoToken.setAccessToken(newAccessToken)
            const successResponse = await postNewAccessToken(
              accessToken,
              newAccessToken,
            )

            if (successResponse && successResponse.data) {
              authToken.setToken(successResponse.data.token)

              // 재발급 받은 액세스 토큰으로 사용자 정보 다시 요청
              kakao.Auth.setAccessToken(newAccessToken)
              getUserInfo(newAccessToken, refreshToken)
            } else {
              console.error('새로운 액세스 토큰 백엔드 전달 실패')
            }
          } else {
            console.error('액세스 토큰 재발급 실패')
          }
        }
      })
  }

  return <>{isLoading && <Loading />}</>
}

export default KakaoRedirectHandle
