import styled from 'styled-components'

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #eff1ff;
`

export const ChatHeader = styled.div`
  padding: 1rem;
  margin-top: 0.5rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
`

export const MessageList = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Message = styled.div`
  max-width: 60%;
  padding: 0.7rem 1rem;
  border-radius: 15px;
  color: #000;
  font-size: 14px;
  line-height: 1.3rem;
  background-color: #dcf8c6;
  align-self: flex-end;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  border-top-right-radius: 0;

  &:after {
    content: '';
    position: absolute;
    right: -5px;
    top: 0;
    border: 10px solid transparent;
    border-bottom-color: #dcf8c6;
    border-right: 0;
    margin-top: 10px;
  }
`

export const ChatInputContainer = styled.div`
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 30px;
  background-color: white;
  border-top: 1px solid #ddd;
`

export const ChatInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
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

export const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #525fd4;
  border: none;
  border-radius: 20px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4151b5;
  }
`
