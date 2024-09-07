import React from 'react'

import * as L from './AlertPopUp2.styles/AlerPopUp2.style' // 스타일 컴포넌트 임포트

// Props 타입 정의
interface AlertPopUp2Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const AlertPopUp2: React.FC<AlertPopUp2Props> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <div className='popup_dimmed'></div> {/* 팝업 백그라운드 */}
      <L.Overlay>
        <L.ModalContainer>
          <L.Title>알림</L.Title>
          <L.Message>{message}</L.Message>
          <L.Divider />
          <L.ButtonContainer>
            <L.Button1 className='no' onClick={onCancel}>
              아니요
            </L.Button1>
            <L.Button2 onClick={onConfirm}>네</L.Button2>
          </L.ButtonContainer>
        </L.ModalContainer>
      </L.Overlay>
    </>
  )
}

export default AlertPopUp2
