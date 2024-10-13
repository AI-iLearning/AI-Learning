import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { postCheckInfo } from '../../../api/auth/postCheckInfo'
import AlertPopUp1 from '../../../components/AlertPopUp/AlertPopUp1/AlertPopUp1'
import * as L from '../styles/PasswordChange.style'

const PasswordChangeForm = () => {
  const navigate = useNavigate()

  const [signupForm, setSignupForm] = useState({
    email: '',
    nickname: '',
  })

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupForm({ ...signupForm, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await postCheckInfo(
        signupForm.nickname,
        signupForm.email,
      )

      if (response?.data.isCorrect) {
        navigate('/password-change3', {
          state: {
            email: signupForm.email,
            nickname: signupForm.nickname,
          },
        })
      } else {
        setAlertMessage('가입하신 이메일과 닉네임이 일치하지 않습니다.')
        setShowAlert(true)
      }
    } catch (error) {
      setAlertMessage('잠시 후 다시 시도해주세요.')
      setShowAlert(true)
    }
  }

  const handleCloseAlert = () => {
    setShowAlert(false)
  }

  return (
    <>
      <L.Form onSubmit={handleSubmit}>
        <L.InputWrapper>
          <L.Label>닉네임</L.Label>
          <L.Input
            type='text'
            name='nickname'
            id='nickname'
            value={signupForm.nickname}
            onChange={handleChange}
            placeholder='닉네임을 입력해주세요'
            required
          />
        </L.InputWrapper>
        <L.InputWrapper>
          <L.Label>이메일</L.Label>
          <L.Input
            type='email'
            name='email'
            id='email'
            value={signupForm.email}
            onChange={handleChange}
            placeholder='이메일을 입력해주세요'
            required
          />
        </L.InputWrapper>

        <L.SubmitButton type='submit'>완료</L.SubmitButton>
      </L.Form>
      {showAlert && (
        <AlertPopUp1 message={alertMessage} onConfirm={handleCloseAlert} />
      )}
    </>
  )
}

export default PasswordChangeForm
