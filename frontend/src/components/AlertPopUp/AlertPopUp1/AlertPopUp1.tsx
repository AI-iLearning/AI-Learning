import React from 'react'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 다크 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px; /* 둥근 모서리 */
  width: 278px;
  padding: 5px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const Title = styled.h2`
  margin: 0;
  margin-bottom: 10px;
  margin-top: 15px;
  font-size: 18px;
  font-weight: bold;
`

const Message = styled.p`
  margin: 0;
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 14px;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #525fd4;
  margin: 0;
  margin-bottom: 5px;
`

const ConfirmButton = styled.button`
  background-color: transparent;
  color: black;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }
`
// 1. 메세지와 2. 확인 버튼 눌렀을 때 실행 함수 넣으면 작동
// Props 타입 정의
interface AlertPopUp1Props {
  message: string
  onConfirm: () => void
}

const AlertPopUp1: React.FC<AlertPopUp1Props> = ({ message, onConfirm }) => {
  return (
    <Overlay>
      <ModalContainer>
        <Title>알림</Title>
        <Message>{message}</Message>
        <Divider />
        <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
      </ModalContainer>
    </Overlay>
  )
}

export default AlertPopUp1
