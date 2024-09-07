import calendarIcon from '@iconify/icons-mdi/calendar'
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import BackButton from './components/BackButton/BackButton'
import * as S from './styles/AISchedule1.style'
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
    dayOfWeek,
    isScheduleConfirmed,
    setStartDate,
    setEndDate,
    updateDates,
    setFrequency,
    setDayOfWeek,
    setLocation,
    setTravelStyle,
    setIsScheduleConfirmed,
  } = useScheduleStore(state => ({
    startDate: state.startDate,
    endDate: state.endDate,
    dates: state.dates,
    location: state.location,
    travelStyle: state.travelStyle,
    frequency: state.frequency,
    dayOfWeek: state.dayOfWeek,
    isScheduleConfirmed: state.isScheduleConfirmed,
    updateDates: state.updateDates,
    setFrequency: state.setFrequency,
    setDayOfWeek: state.setDayOfWeek,
    setStartDate: state.setStartDate,
    setEndDate: state.setEndDate,
    setLocation: state.setLocation,
    setTravelStyle: state.setTravelStyle,
    setIsScheduleConfirmed: state.setIsScheduleConfirmed,
  }))

  useEffect(() => {
    if (startDate && !endDate) {
      const newEndDate = new Date(startDate)
      newEndDate.setDate(newEndDate.getDate() + 29)
      setEndDate(newEndDate.toISOString().split('T')[0])
    }
    if (!isScheduleConfirmed) {
      updateDates() // isScheduleConfirmed가 false일 때만 dates를 업데이트
    }
  }, [startDate, endDate, frequency, updateDates])

  const handleLocationClick = (loc: string) => {
    if (loc === '전국') {
      // "전국"을 클릭하면 모든 지역을 선택
      setLocation(
        location.length === 7
          ? []
          : [
              '전국',
              '거주 지역 인근',
              '서울・수도권',
              '경상도권',
              '전라도권',
              '충청도권',
              '제주도',
            ],
      )
    } else {
      // "전국"이 선택된 상태에서 다른 지역을 클릭하면 "전국"을 해제
      if (location.includes('전국')) {
        setLocation([loc])
      } else {
        // "전국"이 선택되지 않은 상태에서 다른 지역을 클릭하면 해당 지역만 토글
        setLocation(
          location.includes(loc)
            ? location.filter(l => l !== loc)
            : [...location, loc],
        )
      }
    }
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
    console.log('Update date')
  }

  const handleDayOfWeekChange = (newDayOfWeek: string) => {
    setDayOfWeek(newDayOfWeek)
    updateDates()
  }

  const handleComplete = () => {
    const { startDate, endDate, frequency, dates, location, travelStyle } =
      useScheduleStore.getState()
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

  const handleCalendarIconClick = (type: 'start' | 'end') => {
    navigate(`/calendarInput?type=${type}`)
  }
  const handleCalendarIconClick2 = () => {
    console.log('Current Schedule State:', {
      startDate,
      endDate,
      frequency,
      dayOfWeek,
      dates,
      location,
      travelStyle,
    })
    setIsScheduleConfirmed()
    navigate(`/calendarCycle?type=cycle`)
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
          <S.DateInputContainer>
            <S.DateInput
              value={startDate || ''}
              onChange={e => setStartDate(e.target.value)}
              onClick={() => handleCalendarIconClick('start')} // 클릭 시 페이지 이동
              readOnly // 기본 달력 팝업을 비활성화
            />
            <Icon
              icon={calendarIcon}
              onClick={() => handleCalendarIconClick('start')}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            />
            <S.Separator>~</S.Separator>
            <S.DateInput
              value={endDate || ''}
              onChange={e => setEndDate(e.target.value)}
              onClick={() => handleCalendarIconClick('end')} // 클릭 시 페이지 이동
              readOnly // 기본 달력 팝업을 비활성화
            />
            <Icon
              icon={calendarIcon}
              onClick={() => handleCalendarIconClick('end')}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            />
          </S.DateInputContainer>
        </S.Section>

        <S.Section>
          <S.Label>
            어느 주기로{' '}
            <Icon
              icon={calendarIcon}
              style={{ cursor: 'pointer' }}
              onClick={() => handleCalendarIconClick2()}
            />
          </S.Label>
          {!isScheduleConfirmed && (
            <S.SelectContainer>
              <S.Select
                value={frequency}
                onChange={e => handleFrequencyChange(e.target.value)}
              >
                <option value='매주'>매주</option>
                <option value='격주'>격주</option>
                <option value='매일'>매일</option>
              </S.Select>
              <S.Select
                value={dayOfWeek}
                onChange={e => handleDayOfWeekChange(e.target.value)}
              >
                <option value='월요일'>월요일</option>
                <option value='화요일'>화요일</option>
                <option value='수요일'>수요일</option>
                <option value='목요일'>목요일</option>
                <option value='금요일'>금요일</option>
                <option value='토요일'>토요일</option>
                <option value='일요일'>일요일</option>
              </S.Select>
              <S.RepeatText>마다 가고 싶어요!</S.RepeatText>
            </S.SelectContainer>
          )}
        </S.Section>

        <S.ChangeScheduleButton
          onClick={handleCalendarIconClick2}
          disabled={isScheduleConfirmed}
          style={{
            marginTop: isScheduleConfirmed ? '-30px' : '-20px', // Adjust '20px' and '40px' as needed
          }}
        >
          {isScheduleConfirmed
            ? '일정 확정을 완료했습니다!'
            : '내 일정 확인하고 변경하기'}
        </S.ChangeScheduleButton>
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
