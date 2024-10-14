import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  LoadingContainer,
  LoadingText,
  DotsWrapper,
  Dot,
  TimerText,
  TimerIcon,
} from './styles/TimerLoading.style'

const TimerLoading: React.FC<{ responseReceived: boolean }> = ({
  responseReceived,
}) => {
  const [timeLeft, setTimeLeft] = useState(180) // 3분 (180초)
  const navigate = useNavigate() // navigate 훅 사용

  const formatTimeLeft = (time: number) => {
    const minutes = Math.floor(time / 60) // 분 계산
    const seconds = time % 60 // 초 계산
    return `${minutes} : ${seconds.toString().padStart(2, '0')}` // 초를 두 자리로 포맷팅
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (responseReceived) {
        // 응답이 도착하면 타이머 정리
        clearInterval(timer)
        navigate('/ai-schedule-step3') // 다음 페이지로 이동
      } else {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            clearInterval(timer)
            return 0
          }
          return prevTime - 1
        })
      }
    }, 1000) // 1초마다 확인

    return () => clearInterval(timer) // 컴포넌트 언마운트 시 타이머 정리
  }, [navigate, responseReceived])

  return (
    <LoadingContainer>
      <LoadingText>AI가 일정을 생성 중이에요</LoadingText>
      <TimerText>
        <TimerIcon />
        {formatTimeLeft(timeLeft)} {/* 남은 시간을 분과 초로 표시 */}
      </TimerText>
      <DotsWrapper>
        <Dot delay='0s' />
        <Dot delay='0.4s' />
        <Dot delay='0.8s' />
      </DotsWrapper>
    </LoadingContainer>
  )
}

export default TimerLoading
