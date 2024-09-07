import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'

import {
  useScheduleStore,
  calculateEndDate,
} from '../../../stores/useScheduleStore'
import * as L from '../styles/CalendarFrame.style'

interface CalendarFrameProps {
  selectedDate: string
  setSelectedDate: (date: string) => void
  type: 'start' | 'end'
}

const CalendarFrame: React.FC<CalendarFrameProps> = ({
  selectedDate,
  setSelectedDate,
  type,
}) => {
  const today = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
  )
  const currentDayRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const { startDate } = useScheduleStore.getState()
  const startDateObj =
    type === 'start'
      ? today
      : new Date(calculateEndDate(startDate!, 29) || today)
  const endDateObj = new Date(startDateObj)
  endDateObj.setDate(startDateObj.getDate() + (type === 'start' ? 180 : 336))

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

  const handleDayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const clickedDay = event.currentTarget.title
    setSelectedDate(clickedDay)
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
          const isSelectedDay = selectedDate === formattedDate
          const dateObj = new Date(year, month - 1, day)
          const isWithinRange = dateObj >= startDateObj && dateObj <= endDateObj

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
  }, [selectedDate])

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
  const totalMonth = calculateTotalMonths(startDateObj, endDateObj)

  for (let i = 0; i <= totalMonth; i++) {
    const month = ((startDateObj.getMonth() + i) % 12) + 1
    const displayYear =
      startDateObj.getFullYear() +
      Math.floor((startDateObj.getMonth() + i) / 12)
    calendarMonths.push(
      <div key={month}>
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

CalendarFrame.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  setSelectedDate: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['start', 'end']).isRequired as PropTypes.Validator<
    'start' | 'end'
  >,
}

export default CalendarFrame
