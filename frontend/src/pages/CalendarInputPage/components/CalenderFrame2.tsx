import PropTypes from 'prop-types'
import React, { useRef, useEffect, useState } from 'react'

import { useScheduleStore } from '../../../stores/useScheduleStore'
import * as L from '../styles/CalendarFrame.style'

interface CalendarFrameProps {
  selectedDates: string[]
  setSelectedDates: (date: string[]) => void
  // setSelectedDate: (date: string) => void
  calendarRange: { start: Date; end: Date }
}

const CalendarFrame2: React.FC<CalendarFrameProps> = ({
  selectedDates,
  // setSelectedDate,
  setSelectedDates,
  calendarRange,
}) => {
  const { dates: storedDates } = useScheduleStore() // Zustand에서 상태 가져오기
  const [selectedDatesState, setSelectedDatesState] =
    useState<string[]>(storedDates)

  const currentDayRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedDates(selectedDatesState)
  }, [selectedDatesState])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number): string => {
    const formattedMonth = month < 10 ? `0${month}` : `${month}`
    const formattedDay = day < 10 ? `0${day}` : `${day}`
    return `${year}-${formattedMonth}-${formattedDay}`
  }

  // const handleDayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   const clickedDay = event.currentTarget.title
  //   setSelectedDates(clickedDay)
  // }
  const handleDayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const clickedDay = event.currentTarget.title
    setSelectedDatesState(prevDates => {
      if (prevDates.includes(clickedDay)) {
        // 클릭된 날짜가 이미 선택된 상태라면, 그 날짜를 선택 해제
        return prevDates.filter(date => date !== clickedDay)
      } else {
        // 클릭된 날짜가 선택되지 않은 상태라면, 그 날짜를 선택
        return [...prevDates, clickedDay]
      }
    })
  }

  const generateCalendarDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const calendarDays = []
    let day = 1

    for (let i = 0; i < 6; i++) {
      const week = []
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(
            <L.CalendarButton
              key={`${i}-${j}`}
              style={{ visibility: 'hidden' }}
            >
              N/A
            </L.CalendarButton>,
          )
        } else if (day <= daysInMonth) {
          const isSunday = j === 0
          const isSaturday = j === 6
          const formattedDate = formatDate(year, month, day)
          // const isSelectedDay = selectedDates.includes(formattedDate)
          const isSelectedDay = selectedDatesState.includes(formattedDate)
          const dateObj = new Date(year, month - 1, day)
          const isWithinRange =
            dateObj >= calendarRange.start && dateObj <= calendarRange.end

          week.push(
            <L.CalendarButton
              key={`${i}-${j}`}
              ref={isSelectedDay ? currentDayRef : null}
              $isSunday={isSunday}
              $isSaturday={isSaturday}
              $isSelectedDay={isSelectedDay}
              $isPast={!isWithinRange}
              onClick={isWithinRange ? handleDayClick : undefined}
              title={formattedDate}
              style={{ backgroundColor: isSelectedDay ? '#525FD4' : 'white' }} // Color the selected dates
            >
              {day}
            </L.CalendarButton>,
          )
          day++
        } else {
          week.push(
            <L.CalendarButton
              key={`${i}-${j}`}
              style={{ visibility: 'hidden' }}
            >
              N/A
            </L.CalendarButton>,
          )
        }
      }
      calendarDays.push(<L.DaySection key={i}>{week}</L.DaySection>)
    }

    return <div>{calendarDays}</div>
  }

  useEffect(() => {
    if (currentDayRef.current && calendarRef.current) {
      const currentDayElement = currentDayRef.current
      const calendarElement = calendarRef.current

      setTimeout(() => {
        calendarElement.scrollTo({
          top:
            currentDayElement.offsetTop -
            calendarElement.clientHeight / 2 +
            currentDayElement.clientHeight / 2,
          behavior: 'smooth',
        })
        currentDayElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 0)
    }
  }, [])

  useEffect(() => {
    if (currentDayRef.current && calendarRef.current) {
      const currentDayElement = currentDayRef.current
      const calendarElement = calendarRef.current

      setTimeout(() => {
        calendarElement.scrollTo({
          top:
            currentDayElement.offsetTop -
            calendarElement.clientHeight / 2 +
            currentDayElement.clientHeight / 2,
          behavior: 'smooth',
        })
        currentDayElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 0)
    }
  }, [selectedDates])

  const calculateTotalMonths = (startDate: Date, endDate: Date): number => {
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() + 1

    const yearDifference = endYear - startYear
    const monthDifference = endMonth - startMonth

    return yearDifference * 12 + monthDifference
  }

  const calendarMonths = []
  const totalMonth = calculateTotalMonths(
    calendarRange.start,
    calendarRange.end,
  )

  for (let i = 0; i <= totalMonth; i++) {
    const month = ((calendarRange.start.getMonth() + i) % 12) + 1
    const displayYear =
      calendarRange.start.getFullYear() +
      Math.floor((calendarRange.start.getMonth() + i) / 12)
    calendarMonths.push(
      <div key={i}>
        <L.MonthTitle>{`${displayYear}년 ${month}월`}</L.MonthTitle>
        {generateCalendarDays(displayYear, month)}
      </div>,
    )
  }

  return (
    <L.ScrollableCalendarSection ref={calendarRef}>
      {calendarMonths}
    </L.ScrollableCalendarSection>
  )
}

CalendarFrame2.propTypes = {
  selectedDates: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  // setSelectedDate: PropTypes.func.isRequired,
  calendarRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
}

export default CalendarFrame2
