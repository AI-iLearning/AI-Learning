import React from 'react'

import * as L from './AlerPopUp1.styles/AlertPopUp1.style'

// 1. 메세지와 2. 확인 버튼 눌렀을 때 실행 함수 넣으면 작동
// Props 타입 정의
interface AlertPopUp1Props {
  message: string
  onConfirm: () => void
}

const AlertPopUp1: React.FC<AlertPopUp1Props> = ({ message, onConfirm }) => {
  return (
    <L.Overlay>
      <L.ModalContainer>
        <L.Title>알림</L.Title>
        <L.Message>{message}</L.Message>
        <L.Divider />
        <L.ConfirmButton onClick={onConfirm}>확인</L.ConfirmButton>
      </L.ModalContainer>
    </L.Overlay>
  )
}

export default AlertPopUp1
