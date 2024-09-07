import styled from 'styled-components'

export const Overlay = styled.div`
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

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px; /* 둥근 모서리 */
  width: 278px;
  padding: 5px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

export const Title = styled.h2`
  margin: 0;
  margin-bottom: 10px;
  margin-top: 15px;
  font-size: 18px;
  font-weight: bold;
`

export const Message = styled.p`
  margin: 0;
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 14px;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #525fd4;
  margin: 0;
  margin-bottom: 5px;
`

export const ConfirmButton = styled.button`
  background-color: transparent;
  color: black;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
`
