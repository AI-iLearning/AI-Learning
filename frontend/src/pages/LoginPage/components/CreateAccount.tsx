import { useNavigate } from 'react-router-dom'

import * as L from '../styles/Login.style'

const CreateAccount = () => {
  const navigate = useNavigate()

  const handleRegister = () => {
    navigate('/register')
  }

  const handleCalendar = () => {
    navigate('/calendar') // 서버 꺼졌을 때 화면 테스트용 이동
  }

  return (
    <L.CreateAccountSection>
      <L.BottomButton onClick={handleCalendar}>비밀번호 재설정</L.BottomButton>
      <L.DivideLine>|</L.DivideLine>
      <L.BottomButton onClick={handleRegister}>
        이메일로 회원가입
      </L.BottomButton>
    </L.CreateAccountSection>
  )
}

export default CreateAccount
