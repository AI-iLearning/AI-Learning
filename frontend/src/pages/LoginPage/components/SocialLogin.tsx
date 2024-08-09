// import * as L from '../styles/Login.style'

// const SocialLogin = () => {
//   return <L.KaKaoButton>카카오로 간편로그인</L.KaKaoButton>
// }

// export default SocialLogin

import React, { useState } from 'react'

import AlertPopUp2 from '../../../components/AlertPopUp/AlertPopUp2/AlertPopUp2'
import * as L from '../styles/Login.style'

const SocialLogin = () => {
  const [showAlert, setShowAlert] = useState(false) // 팝업 상태 관리

  const handleKaKaoLoginClick = () => {
    setShowAlert(true)
  }

  const handleAlertConfirm = () => {
    setShowAlert(false)
    console.log('Confirmed!')
  }

  const handleAlertCancel = () => {
    setShowAlert(false) // 팝업에서 "아니요" 버튼 클릭 시 팝업 닫기
    console.log('Cancelled!') // 아니요 버튼 클릭 후의 로직 추가 가능
  }

  return (
    <>
      <L.KaKaoButton onClick={handleKaKaoLoginClick}>
        카카오로 간편로그인
      </L.KaKaoButton>
      {showAlert && (
        <AlertPopUp2
          message='기존 생성된 AI 일정 기간과 겹치는 기간이 존재합니다. 해당 기간의 일정을 유지한 채 일정을 생성하시겠습니까?'
          onConfirm={handleAlertConfirm}
          onCancel={handleAlertCancel}
        />
      )}
    </>
  )
}

export default SocialLogin
