import React from 'react'
import { useNavigate } from 'react-router-dom'

import * as S from './styles/NotFound.style'

const NotFound = () => {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/calendar')
  }

  return (
    <S.Container>
      <S.Title>404</S.Title>
      <S.Message>페이지를 찾을 수 없습니다.</S.Message>
      <S.Description>
        요청하신 페이지가 존재하지 않거나<br></br>잘못된 경로로 이동하셨습니다.
      </S.Description>
      <S.HomeButton onClick={goHome}>메인으로 돌아가기</S.HomeButton>
    </S.Container>
  )
}

export default NotFound
