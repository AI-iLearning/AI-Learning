import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import CalendarFrame from './components/CalendarFrame'
import * as L from './styles/CalendarFrame.style'
import CloseButton from '../../components/CloseButton/CloseButton'
import {
  useScheduleStore,
  calculateEndDate,
} from '../../stores/useScheduleStore'

const CalendarInput = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const type = params.get('type') as 'start' | 'end'

  const today = new Date()
  const { startDate, endDate, setStartDate, setEndDate } = useScheduleStore()
  const [, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  })
  const [selectedDate, setSelectedDate] = useState<string>(
    type === 'start'
      ? startDate || today.toISOString().split('T')[0]
      : startDate
        ? calculateEndDate(startDate, 29) // 시작일 + 29일
        : today.toISOString().split('T')[0],
  )

  useEffect(() => {
    setCurrentDate({ year: today.getFullYear(), month: today.getMonth() + 1 })
    setSelectedDate(
      type === 'start'
        ? startDate || today.toISOString().split('T')[0]
        : endDate || today.toISOString().split('T')[0],
    )
  }, [type, startDate, endDate])

  const handleApplyDate = () => {
    if (type === 'start') {
      setStartDate(selectedDate)
    } else {
      setEndDate(selectedDate)
    }
    console.log(`Applied ${type} date: ${selectedDate}`)
    navigate('/ai-schedule-step1')
  }

  const renderSelectedDate = () => {
    if (!selectedDate) return '일정 적용'
    const [year, month, day] = selectedDate.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    return `${type === 'start' ? '시작일' : '종료일'} ${month}.${day} (${dayNames[date.getDay()]}) 적용`
  }

  return (
    <>
      <L.HeaderSection>
        <CloseButton />
        <L.HeaderTitle>날짜 선택</L.HeaderTitle>
      </L.HeaderSection>
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
        <CalendarFrame
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          type={type}
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

export default CalendarInput
