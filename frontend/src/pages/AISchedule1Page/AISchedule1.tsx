import React from 'react'
import { useNavigate } from 'react-router-dom'

import * as S from './styles/AISchedule1.style'
import BackButton from '../../components/BackButton/BackButton'
import { useScheduleStore } from '../../stores/useScheduleStore'

const AISchedule1: React.FC = () => {
  const navigate = useNavigate()
  const {
    startDate,
    endDate,
    dates,
    location,
    travelStyle,
    frequency,
    setStartDate,
    setEndDate,
    updateDates,
    setFrequency,
    setLocation,
    setTravelStyle,
    // setDescription,
  } = useScheduleStore(state => ({
    startDate: state.startDate,
    endDate: state.endDate,
    dates: state.dates,
    location: state.location,
    travelStyle: state.travelStyle,
    frequency: state.frequency,
    updateDates: state.updateDates,
    setFrequency: state.setFrequency,
    setStartDate: state.setStartDate,
    setEndDate: state.setEndDate,
    setLocation: state.setLocation,
    setTravelStyle: state.setTravelStyle,
    setDescription: state.setDescription,
  }))

  const handleLocationClick = (loc: string) => {
    setLocation(
      location.includes(loc)
        ? location.filter(l => l !== loc)
        : [...location, loc],
    )
  }

  const handleStyleClick = (style: string) => {
    setTravelStyle(
      travelStyle.includes(style)
        ? travelStyle.filter(s => s !== style)
        : [...travelStyle, style],
    )
  }

  const handleFrequencyChange = (newFrequency: string) => {
    setFrequency(newFrequency)
    updateDates() // 빈도 변경 후 날짜 업데이트
  }

  const handleComplete = () => {
    console.log('Current Schedule State:', {
      startDate,
      endDate,
      frequency,
      dates,
      location,
      travelStyle,
    })

    navigate('/ai-schedule-step2')
  }

  return (
    <>
      <BackButton />
      <S.Container>
        <S.Title>
          <S.Text>안녕하세요!</S.Text>
          <S.Text>
            <S.Highlighted>AI 교육 여행 플랜</S.Highlighted>이 필요하신가요?
          </S.Text>
        </S.Title>
        <S.Section>
          <S.Label>얼마나</S.Label>
          <S.DateInput
            type='date'
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <S.Separator>~</S.Separator>
          <S.DateInput
            type='date'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </S.Section>
        <S.Section>
          <S.Label>어느 주기로</S.Label>
          <S.Button
            onClick={() => handleFrequencyChange('1주에 1번')}
            className={frequency === '1주에 1번' ? 'selected' : ''}
          >
            1주에 1번
          </S.Button>
          <S.Button
            onClick={() => handleFrequencyChange('2주에 1번')}
            className={frequency === '2주에 1번' ? 'selected' : ''}
          >
            2주에 1번
          </S.Button>
          <S.Button
            onClick={() => handleFrequencyChange('한 달에 1번')}
            className={frequency === '한 달에 1번' ? 'selected' : ''}
          >
            한 달에 1번
          </S.Button>
        </S.Section>
        <S.Section>
          <S.Label>어디로</S.Label>
          <S.Button
            onClick={() => handleLocationClick('전국')}
            className={location.includes('전국') ? 'selected' : ''}
          >
            전국
          </S.Button>
          <S.Button
            onClick={() => handleLocationClick('거주 지역 인근')}
            className={location.includes('거주 지역 인근') ? 'selected' : ''}
          >
            거주 지역 인근
          </S.Button>
          <S.Button
            onClick={() => handleLocationClick('서울・수도권')}
            className={location.includes('서울・수도권') ? 'selected' : ''}
          >
            서울・수도권
          </S.Button>
          <S.Button
            onClick={() => handleLocationClick('경상도권')}
            className={location.includes('경상도권') ? 'selected' : ''}
          >
            경상도권
          </S.Button>
          <S.Button
            onClick={() => handleLocationClick('전라도권')}
            className={location.includes('전라도권') ? 'selected' : ''}
          >
            전라도권
          </S.Button>
          <S.Button
            onClick={() => handleLocationClick('충청도권')}
            className={location.includes('충청도권') ? 'selected' : ''}
          >
            충청도권
          </S.Button>
          <S.Button
            onClick={() => handleLocationClick('제주도')}
            className={location.includes('제주도') ? 'selected' : ''}
          >
            제주도
          </S.Button>
        </S.Section>
        <S.Section>
          <S.Label>여행 스타일</S.Label>
          <S.Button
            onClick={() => handleStyleClick('유적지 위주')}
            className={travelStyle.includes('유적지 위주') ? 'selected' : ''}
          >
            유적지 위주
          </S.Button>
          <S.Button
            onClick={() => handleStyleClick('박물관 위주')}
            className={travelStyle.includes('박물관 위주') ? 'selected' : ''}
          >
            박물관 위주
          </S.Button>
          <S.Button
            onClick={() => handleStyleClick('공연/행사')}
            className={travelStyle.includes('공연/행사') ? 'selected' : ''}
          >
            공연/행사
          </S.Button>
          <S.Button
            onClick={() => handleStyleClick('체험・액티비티')}
            className={travelStyle.includes('체험・액티비티') ? 'selected' : ''}
          >
            체험・액티비티
          </S.Button>
          <S.Button
            onClick={() => handleStyleClick('유명한 곳 위주')}
            className={travelStyle.includes('유명한 곳 위주') ? 'selected' : ''}
          >
            유명한 곳 위주
          </S.Button>
          <S.Button
            onClick={() => handleStyleClick('자연과 함께')}
            className={travelStyle.includes('자연과 함께') ? 'selected' : ''}
          >
            자연과 함께
          </S.Button>
          <S.Button
            onClick={() => handleStyleClick('여유롭게 힐링')}
            className={travelStyle.includes('여유롭게 힐링') ? 'selected' : ''}
          >
            여유롭게 힐링
          </S.Button>
        </S.Section>
      </S.Container>
      <S.BottomButton onClick={handleComplete}>다음</S.BottomButton>
    </>
  )
}

export default AISchedule1
