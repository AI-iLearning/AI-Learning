import styled from 'styled-components'

export const DrawerContainer = styled.div<{ isopen: boolean }>`
  width: 100%;
  max-width: 440px;
  height: calc(100vh - 5rem);
  background-color: #eff1ff;
  position: fixed;
  bottom: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  transition: transform 0.4s ease-in-out;
  transform: translateY(${props => (props.isopen ? '0' : '100%')});
  z-index: 1000;
  will-change: transform;
`

export const MessagesContainer = styled.div`
  padding: 0.7rem;
  overflow-y: auto;
  max-height: calc(100vh - 10rem);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 2rem;
`

// 말풍선 스타일
export const MessageBubble = styled.div<{ sender: 'user' | 'bot' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ sender }) =>
    sender === 'user' ? 'flex-end' : 'flex-start'};
  max-width: 70%;
  align-self: ${({ sender }) =>
    sender === 'user' ? 'flex-end' : 'flex-start'};
  background-color: ${({ sender }) =>
    sender === 'user' ? '#DCF8C6' : '#FFFFFF'};
  border-radius: 10px;
  padding: 8px 12px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.3rem;
`

// 닉네임 스타일 (사용자와 봇 구별)
export const MessageNickname = styled.span<{ sender: 'user' | 'bot' }>`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 0.4rem;
  color: ${({ sender }) => (sender === 'user' ? '#525FD4' : '#FF5722')};
`

// 메시지 텍스트
export const MessageText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.1rem;
  color: #000;
`

// 로딩 중일 때 스타일
export const LoadingBubble = styled.div`
  align-self: flex-start;
  font-size: 14px;
  color: #777;
  padding: 12px 12px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`

// 메시지 입력 컨테이너
export const InputContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 30px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
  z-index: 99;
`

// 메시지 입력 필드 스타일
export const InputField = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  margin-right: 10px;
  background-color: #fff;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #34b7f1;
  }
`

// 전송 버튼 스타일
export const SendButton = styled.button`
  padding: 10px 15px;
  background-color: #525fd4;
  border: none;
  border-radius: 20px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
`
