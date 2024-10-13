import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { postResetPassword } from '../../../api/auth/postResetPassword'
import AlertPopUp1 from '../../../components/AlertPopUp/AlertPopUp1/AlertPopUp1'
import * as L from '../styles/PasswordChange.style'

const PasswordChangeForm3 = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email
  const nickname = location.state?.nickname

  const [signupForm, setSignupForm] = useState({
    password: '',
    checkedPassword: '',
  })

  // 오류 메세지
  const [validMessage, setValidMessage] = useState({
    passwordMessage: '',
    checkedPasswordMessage: '',
  })

  // 유효성 검사
  const [isValid, setIsValid] = useState({
    password: false,
    checkedPassword: false,
  })

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupForm({ ...signupForm, [name]: value })
  }

  // 비밀번호 유효성 검사
  useEffect(() => {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,15}$/

    if (!regex.test(signupForm.password)) {
      setValidMessage(prev => ({
        ...prev,
        passwordMessage:
          '숫자, 영문, 특수문자를 포함하여 최소 8자를 입력해주세요',
      }))
      setIsValid(prev => ({ ...prev, password: false }))
    } else {
      setValidMessage(prev => ({
        ...prev,
        passwordMessage: '',
      }))
      setIsValid(prev => ({ ...prev, password: true }))
    }
  }, [signupForm.password])

  // 비밀번호 확인
  useEffect(() => {
    if (signupForm.password !== signupForm.checkedPassword) {
      setValidMessage(prev => ({
        ...prev,
        checkedPasswordMessage: '비밀번호가 일치하지 않습니다.',
      }))
      setIsValid(prev => ({ ...prev, checkedPassword: false }))
    } else {
      setValidMessage(prev => ({
        ...prev,
        checkedPasswordMessage: '',
      }))
      setIsValid(prev => ({ ...prev, checkedPassword: true }))
    }
  }, [signupForm.password, signupForm.checkedPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid.password && isValid.checkedPassword) {
      try {
        const response = await postResetPassword(email, signupForm.password)
        if (response?.data.message === 'Success Response') {
          setAlertMessage('비밀번호가 성공적으로 변경되었습니다.')
          setShowAlert(true)
        } else {
          setAlertMessage('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
          setShowAlert(true)
        }
      } catch (error) {
        setAlertMessage('오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
        setShowAlert(true)
      }
    } else {
      setAlertMessage('올바른 비밀번호를 입력해주세요.')
      setShowAlert(true)
    }
  }

  const handleCloseAlert = () => {
    setShowAlert(false)
    if (alertMessage === '비밀번호가 성공적으로 변경되었습니다.') {
      navigate('/login')
    }
  }

  return (
    <>
      <L.WelcomeMessage>{nickname || '사용자'} 님</L.WelcomeMessage>
      <L.SubTitle>비밀번호를 재설정해주세요</L.SubTitle>
      <L.Form onSubmit={handleSubmit}>
        <L.InputWrapper>
          <L.Label>새로운 비밀번호</L.Label>
          <L.Input
            type='password'
            name='password'
            id='password'
            value={signupForm.password}
            onChange={handleChange}
            placeholder='영문자, 숫자, 특수문자 포함 8~20자리'
            required
          />
          <L.Input
            type='password'
            name='checkedPassword'
            id='checkedPassword'
            placeholder='비밀번호 확인'
            value={signupForm.checkedPassword}
            onChange={handleChange}
            required
          />
          <L.ValidationMessage error={!isValid.checkedPassword}>
            {validMessage.checkedPasswordMessage}
          </L.ValidationMessage>
        </L.InputWrapper>
        <br />
        <L.SubmitButton type='submit'>비밀번호 변경하기</L.SubmitButton>
      </L.Form>
      {showAlert && (
        <AlertPopUp1 message={alertMessage} onConfirm={handleCloseAlert} />
      )}
    </>
  )
}

export default PasswordChangeForm3
