import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { login } from '../../../api/auth/postLogin'
import AlertPopUp1 from '../../../components/AlertPopUp/AlertPopUp1/AlertPopUp1'
import authToken from '../../../stores/authToken'
import * as L from '../styles/Login.style'

const LoginForm = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (email.trim() === '') {
      setErrorMessage('이메일을 입력해주세요')
      setShowErrorPopup(true)
      return
    }

    if (password.trim() === '') {
      setErrorMessage('비밀번호를 입력해주세요')
      setShowErrorPopup(true)
      return
    }

    try {
      const loginResult = await login(email, password)

      if (loginResult && loginResult.data && loginResult.data.token) {
        authToken.setToken(loginResult.data.token)
        navigate('/calendar')
      } else {
        setErrorMessage('아이디 혹은 비밀번호가 틀렸습니다')
        setShowErrorPopup(true)
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('아이디 혹은 비밀번호가 틀렸습니다')
      setShowErrorPopup(true)
    }
  }

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false)
  }

  return (
    <>
      <L.Form onSubmit={handleSubmit}>
        <L.Input
          type='email'
          value={email}
          onChange={handleEmailChange}
          placeholder='이메일을 입력해주세요'
        />
        <L.Input
          type='password'
          value={password}
          onChange={handlePasswordChange}
          placeholder='비밀번호를 입력해주세요'
        />
        <L.LoginButton type='submit'>로그인</L.LoginButton>
      </L.Form>
      {showErrorPopup && (
        <AlertPopUp1 message={errorMessage} onConfirm={handleCloseErrorPopup} />
      )}
    </>
  )
}

export default LoginForm
