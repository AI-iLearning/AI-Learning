import { FaClock } from 'react-icons/fa' // 아이콘 임포트
import styled, { keyframes } from 'styled-components'

const blink = keyframes`
  0%, 80%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: transparent;
`

export const LoadingText = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
`

export const DotsWrapper = styled.div`
  display: flex;
  gap: 8px;
`

export const Dot = styled.div<{ delay: string }>`
  width: 8px;
  height: 8px;
  background-color: #525fd4;
  border-radius: 50%;
  animation: ${blink} 1.4s infinite both;
  animation-delay: ${props => props.delay};
  margin-top: 10px;
`

export const TimerText = styled.div`
  display: flex;
  align-items: center; // 아이콘과 텍스트 정렬
  font-size: 30px; // 원하는 폰트 크기로 조정
  margin: 20px 0; // 위아래 여백 조정
  color: #333; // 원하는 색상으로 조정
`

export const TimerIcon = styled(FaClock)`
  margin-right: 8px; // 아이콘과 텍스트 간격 조정
  color: #525fd4; // 아이콘 색상 조정
`
