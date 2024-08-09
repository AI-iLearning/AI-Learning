import React from 'react'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  width: 278px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`

const Title = styled.h2`
  margin: 0;
  padding-top: 20px;
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`

const Message = styled.p`
  margin: 0;
  padding: 30px;
  line-height: 1.5;
  font-size: 14px;
  text-align: center;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #525fd4;
  margin: 0;
`

const ButtonContainer = styled.div`
  width: 100%;
  height: 50px; /* 높이를 50px로 설정 */
`

const Button1 = styled.button`
  float: center;
  background-color: white;
  width: 45%;
  height: 100%; /* 부모 컨테이너의 높이에 맞춤 */
  border: 0;
  padding-right: 15px;
  font-size: 15px;
  cursor: pointer;
  border-right: 0.5px solid #525fd4;
`
const Button2 = styled.button`
  float: center;
  background-color: white;
  width: 45%;
  height: 100%; /* 부모 컨테이너의 높이에 맞춤 */
  border: 0;
  padding-left: 15px;
  font-size: 15px;
  cursor: pointer;
  border-left: 0.5px solid #525fd4;
`

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
      <Overlay>
        <ModalContainer>
          <Title>알림</Title>
          <Message>{message}</Message>
          <Divider />
          <ButtonContainer>
            <Button1 className='no' onClick={onCancel}>
              아니요
            </Button1>
            <Button2 onClick={onConfirm}>네</Button2>
          </ButtonContainer>
        </ModalContainer>
      </Overlay>
    </>
  )
}

export default AlertPopUp2
