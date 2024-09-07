import React, { useState } from 'react'

import CreateAccount from './components/CreateAccount'
import LoginForm from './components/LoginForm'
import * as L from './styles/Login.style'
import AlertPopUp1 from '../../components/AlertPopUp/AlertPopUp1/AlertPopUp1'
const Login = () => {
  const [showAlert, setShowAlert] = useState(false) // 팝업 상태 관리

  const handleLogoClick = () => {
    setShowAlert(true) // 로고 클릭 시 팝업 표시
  }

  const handleAlertConfirm = () => {
    setShowAlert(false) // 팝업 확인 버튼 클릭 시 팝업 닫기
  }
  return (
    <L.Container>
      <L.ImgContainer
        src='/img/logo_purple.png'
        alt='logo'
        onClick={handleLogoClick}
      />
      <LoginForm />
      <CreateAccount />
      {showAlert && (
        <AlertPopUp1
          message='최소 한 개 이상의 날짜가 선택되어야 합니다.'
          onConfirm={handleAlertConfirm}
        />
      )}
    </L.Container>
  )
}

export default Login
