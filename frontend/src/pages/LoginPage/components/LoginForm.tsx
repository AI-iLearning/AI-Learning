import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SocialLogin from './SocialLogin'
import { login } from '../../../api/auth/postLogin'
import { useUser } from '../../../hooks/useUser'
import authToken from '../../../stores/authToken'
import * as L from '../styles/Login.style'

const LoginForm = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()

  const { refetch: refetchUser } = useUser() // refetch 함수를 사용하여 로그인 후 유저 정보를 갱신

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (email.trim() !== '' && password.trim() !== '') {
      const loginResult = await login(email, password)

      if (loginResult) {
        authToken.setAccessToken(loginResult.data.token)
        await refetchUser()
        navigate('/calendar')
      } else {
        console.error('login fail')
      }
    }
  }

  return (
    <L.Form onSubmit={handleSubmit}>
      <L.Input
        type='email'
        value={email}
        onChange={handleEmailChange}
        placeholder='이메일을 입력해주세요'
        required
      />
      <L.Input
        type='password'
        value={password}
        onChange={handlePasswordChange}
        placeholder='비밀번호를 입력해주세요'
        required
      />
      <L.LoginButton type='submit'>로그인</L.LoginButton>
      <SocialLogin />
    </L.Form>
  )
}

export default LoginForm
