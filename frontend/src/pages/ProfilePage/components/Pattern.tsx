import React, { useState, useEffect } from 'react'

import { getPattern } from '../../../api/profile/getPattern'
import AlertPopUp1 from '../../../components/AlertPopUp/AlertPopUp1/AlertPopUp1'
import BackButton from '../../../components/BackButton/BackButton'
import Loading from '../../../components/Loading/Loading'
import authToken from '../../../stores/authToken'
import * as L from '../styles/Pattern.style'

interface PatternData {
  id: number
  email: string
  nickname: string
  pattern: string
  description: string
  character: string
}

const Pattern: React.FC = () => {
  const [patternData, setPatternData] = useState<PatternData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const token = authToken.getAccessToken()

  useEffect(() => {
    const fetchPattern = async () => {
      if (token) {
        try {
          setIsLoading(true)
          const data = await getPattern(token)
          setPatternData(data)
        } catch (error) {
          console.error('Failed to fetch pattern:', error)
          setPatternData(null)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchPattern()
  }, [token])

  const handleMoreButtonClick = () => {
    setShowAlert(true)
  }

  const handleAlertConfirm = () => {
    setShowAlert(false)
  }

  if (isLoading) return <Loading />

  if (!patternData) {
    return <div>데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.</div>
  }

  return (
    <L.Container>
      <L.ButtonContainer>
        <BackButton />
      </L.ButtonContainer>
      <L.Title>
        <L.BlueText>{patternData.nickname}</L.BlueText>님의 교육여행패턴은?
      </L.Title>
      <L.ScrollContainer>
        <L.ContentWrapper>
          {patternData.character && (
            <L.CharacterImage src={patternData.character} alt='Character' />
          )}
          <L.PatternText>{patternData.pattern}</L.PatternText>
          <L.DescriptionBox>
            <L.Description>{patternData.description}</L.Description>
          </L.DescriptionBox>
        </L.ContentWrapper>
        <L.MoreButton onClick={handleMoreButtonClick}>
          교육패턴 더 알아보기
        </L.MoreButton>
      </L.ScrollContainer>
      {showAlert && (
        <AlertPopUp1
          message='아직 준비중입니다 ( ⁎ᵕᴗᵕ⁎ )'
          onConfirm={handleAlertConfirm}
        />
      )}
    </L.Container>
  )
}

export default Pattern
