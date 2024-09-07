import PropTypes from 'prop-types'
import React, { useRef, useState, useEffect } from 'react'

import DateDrawer from './DateDrawer'
import {
  CalendarSchedule,
  getTimelineAll,
} from '../../../api/calendar/getTimelineAll'
import authToken from '../../../stores/authToken'
import * as L from '../styles/Calendar.style'

interface MainCalendarProps {
  year: number
  month: number
}

const MainCalendar: React.FC<MainCalendarProps> = ({ year, month }) => {
  const token = authToken.getAccessToken()
  const today = new Date()

  const isToday = (day: number, month: number, year: number) => {
    return (
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      day === today.getDate()
    )
  }

  const calendarRef = useRef<HTMLDivElement>(null)
  const [daySectionHeight, setDaySectionHeight] = useState<number>(0)
  const [schedule, setSchedule] = useState<CalendarSchedule[]>([])
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const fetchSchedule = async () => {
    if (token) {
      const successResponse = await getTimelineAll(token)
      if (successResponse && successResponse.data) {
        setSchedule(successResponse.data)
      }
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [year, month])

  useEffect(() => {
    const calendarHeight = calendarRef.current?.offsetHeight || 0
    const numWeeks = calculateNumberOfWeeks(year, month)
    setDaySectionHeight(calendarHeight / numWeeks)
  }, [year, month])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay()
  }

  const calculateNumberOfWeeks = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const numWeeks = Math.ceil((daysInMonth + firstDay) / 7)
    return numWeeks
  }

  const handleDayClick = (date: string) => {
    if (selectedDay === date) {
      setDrawerOpen(true)
    } else {
      setSelectedDay(date)
      setDrawerOpen(false)
    }
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonthDays = getDaysInMonth(year, month - 1)
  const nextMonth = month === 12 ? 1 : month + 1
  const prevMonth = month === 1 ? 12 : month - 1
  const prevMonthYear = month === 1 ? year - 1 : year
  const nextMonthYear = month === 12 ? year + 1 : year

  const calendarDays = []
  let day = 1
  let allDaysAdded = false

  for (let i = 0; i < 6; i++) {
    const week = []
    for (let j = 0; j < 7; j++) {
      let currentDay = day
      let currentMonth = month
      let currentYear = year

      if (i === 0 && j < firstDay) {
        currentDay = prevMonthDays - (firstDay - j - 1)
        currentMonth = prevMonth
        currentYear = prevMonthYear
      } else if (day > daysInMonth) {
        currentDay = day - daysInMonth
        currentMonth = nextMonth
        currentYear = nextMonthYear
      }

      const isCurrentDay = isToday(currentDay, currentMonth, currentYear)
      const currentDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`
      const dayStyle = {
        backgroundColor:
          selectedDay === currentDate ? '#F1F1F1' : 'transparent',
      }
      const dayTextStyle = {
        borderRadius: '50%',
        backgroundColor: isCurrentDay ? 'black' : 'transparent',
        color: isCurrentDay
          ? 'white'
          : j === 0
            ? '#D63535'
            : j === 6
              ? '#525FD4'
              : 'black',
      }

      if (i === 0 && j < firstDay) {
        const prevMonthDay = prevMonthDays - (firstDay - j - 1)
        const prevDate = `${prevMonthYear}-${String(prevMonth).padStart(2, '0')}-${String(prevMonthDay).padStart(2, '0')}`
        const places = schedule.find(item => item.date === prevDate)?.info || []

        week.push(
          <L.Day
            key={`${i}-${j}`}
            style={dayStyle}
            onClick={() => handleDayClick(prevDate)}
          >
            <L.DayText style={{ ...dayTextStyle, opacity: 0.3 }}>
              {prevMonthDay}
            </L.DayText>
            {places.map(place => (
              <L.PlaceSection key={place.order}>{place.place}</L.PlaceSection>
            ))}
          </L.Day>,
        )
      } else if (day <= daysInMonth) {
        const currentDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const places =
          schedule.find(item => item.date === currentDate)?.info || []

        week.push(
          <L.Day
            key={`${i}-${j}`}
            style={dayStyle}
            onClick={() => handleDayClick(currentDate)}
          >
            <L.DayText style={dayTextStyle}>{day}</L.DayText>
            {places.map(place => (
              <L.PlaceSection key={place.order}>{place.place}</L.PlaceSection>
            ))}
          </L.Day>,
        )
        day++
      } else {
        const nextMonthDay = day - daysInMonth
        const nextDate = `${nextMonthYear}-${String(nextMonth).padStart(2, '0')}-${String(nextMonthDay).padStart(2, '0')}`
        const places = schedule.find(item => item.date === nextDate)?.info || []

        week.push(
          <L.Day
            key={`${i}-${j}`}
            style={dayStyle}
            onClick={() => handleDayClick(nextDate)}
          >
            <L.DayText style={{ ...dayTextStyle, opacity: 0.3 }}>
              {nextMonthDay}
            </L.DayText>
            {places.map(place => (
              <L.PlaceSection key={place.order}>{place.place}</L.PlaceSection>
            ))}
          </L.Day>,
        )
        day++
      }
    }

    if (day > daysInMonth && !allDaysAdded) {
      allDaysAdded = true
    }

    calendarDays.push(
      <L.DaySection key={i} height={daySectionHeight}>
        {week}
      </L.DaySection>,
    )

    if (allDaysAdded) break
  }

  return (
    <>
      <L.WeekSection>
        <L.HeaderText>일</L.HeaderText>
        <L.HeaderText>월</L.HeaderText>
        <L.HeaderText>화</L.HeaderText>
        <L.HeaderText>수</L.HeaderText>
        <L.HeaderText>목</L.HeaderText>
        <L.HeaderText>금</L.HeaderText>
        <L.HeaderText>토</L.HeaderText>
      </L.WeekSection>
      <L.CalendarSection ref={calendarRef}>
        {calendarDays}
        {drawerOpen && <DateDrawer date={selectedDay} />}
      </L.CalendarSection>
    </>
  )
}

MainCalendar.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
}

export default MainCalendar
