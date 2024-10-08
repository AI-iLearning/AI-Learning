import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSwipeable } from 'react-swipeable'

import MainCalendar from './components/MainCalendar'
import * as L from './styles/DateSelected.style'
import BackButton from '../../components/BackButton/BackButton'

const DateSelected = () => {
  const { contentid } = useParams<{ contentid: string }>()
  const { place } = useParams<{ place: string }>()
  const today = new Date()
  const [currentDate, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  })

  useEffect(() => {
    setCurrentDate({ year: today.getFullYear(), month: today.getMonth() + 1 })
  }, [])

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate({ ...currentDate, year: Number(event.target.value) })
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate({ ...currentDate, month: Number(event.target.value) })
  }

  const generateYearOptions = () => {
    const years = []
    for (let i = 2024; i <= today.getFullYear() + 1; i++) {
      years.push(
        <option key={i} value={i}>
          {i}
        </option>,
      )
    }
    return years
  }

  const generateMonthOptions = () => {
    const months = []
    for (let i = 1; i <= 12; i++) {
      months.push(
        <option key={i} value={i}>
          {i}
        </option>,
      )
    }
    return months
  }

  const handleSwipeLeft = () => {
    if (currentDate.month === 12) {
      setCurrentDate({ year: currentDate.year + 1, month: 1 })
    } else {
      setCurrentDate({ year: currentDate.year, month: currentDate.month + 1 })
    }
  }

  const handleSwipeRight = () => {
    if (currentDate.month === 1) {
      setCurrentDate({ year: currentDate.year - 1, month: 12 })
    } else {
      setCurrentDate({ year: currentDate.year, month: currentDate.month - 1 })
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: true,
    delta: 10,
  })

  return (
    <div {...handlers}>
      <L.HeaderSection>
        <BackButton />
        <L.HeaderTitle>
          <L.CalendarSelect
            value={currentDate.year}
            onChange={handleYearChange}
          >
            {generateYearOptions()}
          </L.CalendarSelect>
          년&nbsp;&nbsp;
          <L.CalendarSelect
            value={currentDate.month}
            onChange={handleMonthChange}
          >
            {generateMonthOptions()}
          </L.CalendarSelect>
          월
        </L.HeaderTitle>
      </L.HeaderSection>
      <MainCalendar
        year={currentDate.year}
        month={currentDate.month}
        contentid={contentid!}
        place={place!}
      />
    </div>
  )
}

export default DateSelected
