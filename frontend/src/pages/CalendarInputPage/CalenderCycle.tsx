import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import CalendarFrame2 from './components/CalenderFrame2'
import * as L from './styles/CalendarFrame.style'
import CloseButton from '../../components/CloseButton/CloseButton'
import InfoBanner from '../../components/InfoBanner/InfoBanner'
import {
  useScheduleStore,
  calculateEndDate,
} from '../../stores/useScheduleStore'

const CalendarCycle = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const type = params.get('type') as 'start' | 'end' | 'cycle' | null

  const today = new Date()
  const { startDate, endDate, dates, setStartDate, setEndDate, setDates } =
    useScheduleStore()
  const [, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  })

  const [showBanner, setShowBanner] = useState(true) // 배너를 보여줄지 여부를 결정하는 상태
  const [selectedDate, setSelectedDate] = useState<string>(
    type === 'start'
      ? startDate || today.toISOString().split('T')[0]
      : startDate
        ? calculateEndDate(startDate, 29) // 시작일 + 29일
        : today.toISOString().split('T')[0],
  )
  const [loadedDates, setLoadedDates] = useState<string[]>([])

  let startDateObj: Date = today
  let endDateObj: Date = today

  if (type === 'start') {
    startDateObj = today
    endDateObj = new Date(startDateObj)
    endDateObj.setDate(startDateObj.getDate() + 180)
  } else if (type === 'end') {
    startDateObj = new Date(startDate || today.toISOString().split('T')[0])
    endDateObj = new Date(startDateObj)
    endDateObj.setDate(startDateObj.getDate() + 336)
  } else if (type === 'cycle') {
    startDateObj = new Date(startDate || today.toISOString().split('T')[0])
    endDateObj = new Date(endDate || startDateObj) // endDate가 없으면 startDate 기반으로 초기화
    if (!endDate) {
      endDateObj.setFullYear(startDateObj.getFullYear() + 1) // endDate가 없는 경우 1년 뒤로 설정
    }
  }

  useEffect(() => {
    setCurrentDate({ year: today.getFullYear(), month: today.getMonth() + 1 })
    setSelectedDate(
      type === 'start'
        ? startDate || today.toISOString().split('T')[0]
        : endDate || today.toISOString().split('T')[0],
    )
  }, [type, startDate, endDate])

  useEffect(() => {
    const currentDates = useScheduleStore.getState().dates
    setLoadedDates(currentDates)
    console.log(currentDates)
  }, [dates])

  const handleApplyDate = () => {
    if (type === 'start') {
      setStartDate(selectedDate)
      console.log(`Applied ${type} date: ${selectedDate}`)
    } else if (type === 'end') {
      setEndDate(selectedDate)
      console.log(`Applied ${type} date: ${selectedDate}`)
    } else if (type === 'cycle') {
      setDates(loadedDates)
      const currentDates = useScheduleStore.getState().dates
      console.log('Current dates in Zustand:', currentDates)

      console.log(`Applied ${type} date: ${loadedDates}`)
    }
    navigate('/ai-schedule-step1')
  }

  const renderSelectedDate = () => {
    if (!selectedDate) return '일정 적용'
    const [year, month, day] = selectedDate.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    if (type === 'cycle') {
      return '해당 날짜들에 가고 싶어요!'
    }
    return `${type === 'start' ? '시작일' : '종료일'} ${month}.${day} (${dayNames[date.getDay()]}) 적용`
  }

  //날짜 선택이나 해제 시 - 각 상태 반영
  const setSelectedDates = (newDates: string[]) => {
    setLoadedDates(newDates)
    //console.log('함수 setSelectedDates:', { newDates })
  }

  //배너 문구
  const bannerText =
    '원하는 날짜를 선택하세요! 이미 선택된 날짜를 다시 누르면 해제됩니다!'
  return (
    <>
      <L.HeaderSection>
        <CloseButton />
        <L.HeaderTitle>날짜 선택</L.HeaderTitle>
      </L.HeaderSection>
      {showBanner && (
        <InfoBanner text={bannerText} onClose={() => setShowBanner(false)} />
      )}
      <L.WeekSection>
        <L.HeaderText>일</L.HeaderText>
        <L.HeaderText>월</L.HeaderText>
        <L.HeaderText>화</L.HeaderText>
        <L.HeaderText>수</L.HeaderText>
        <L.HeaderText>목</L.HeaderText>
        <L.HeaderText>금</L.HeaderText>
        <L.HeaderText>토</L.HeaderText>
      </L.WeekSection>
      <L.CalendarWrapper>
        <CalendarFrame2
          selectedDates={loadedDates}
          setSelectedDates={setSelectedDates}
          calendarRange={{ start: startDateObj, end: endDateObj }} // Add calendarRange here
        />
      </L.CalendarWrapper>
      <L.BottomSection>
        <L.FixedBottomButton onClick={handleApplyDate}>
          {renderSelectedDate()}
        </L.FixedBottomButton>
      </L.BottomSection>
    </>
  )
}

export default CalendarCycle
