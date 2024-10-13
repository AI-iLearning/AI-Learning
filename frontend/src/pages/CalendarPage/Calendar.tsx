import React, { useState, useEffect } from 'react'
import { FaWandMagicSparkles } from 'react-icons/fa6'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSwipeable } from 'react-swipeable'

import MainCalendar from './components/MainCalendar'
import TodayMemo from './components/TodayMemo'
import * as L from './styles/Calendar.style'
import { postTimelineDay } from '../../api/calendar/postTimelineDay'
import { getAlertPlace, AlertPlace } from '../../api/profile/getAlertList'
import IndoorAlertPopUp from '../../components/AlertPopUp/IndoorAlertPopUp/IndoorAlertPopUp'
import useLikeList from '../../hooks/useLikeList'
import useLockBodyScroll from '../../hooks/useLockBodyScroll'
import { useUser } from '../../hooks/useUser'
import useVisitedList from '../../hooks/useVisitedList'
import authToken from '../../stores/authToken'
import { useAlertStore } from '../../stores/useFutureAlerts'
import { useScheduleStore, initialState } from '../../stores/useScheduleStore'
import { useWeatherAlert } from '../../stores/useWeatherAlert'

const Calendar: React.FC = () => {
  const token = authToken.getAccessToken()
  const navigate = useNavigate()
  const location = useLocation()
  const selectedDate = location.state?.selectedDate || null
  const [showPopup, setShowPopup] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useLockBodyScroll(drawerOpen)

  const { refetch: refetchUser } = useUser()
  const { refetch: refetchLikeList } = useLikeList()
  const { refetch: refetchVisitedList } = useVisitedList()

  const {
    setLastCalendarVisit,
    setHasCheckedAlertToday,
    hasCheckedAlertToday,
    resetDailyCheck,
  } = useWeatherAlert()

  const { setFutureAlerts } = useAlertStore()
  const today = new Date()
  const cyear = today.getFullYear()
  const cmonth = String(today.getMonth() + 1).padStart(2, '0')
  const cday = String(today.getDate()).padStart(2, '0')
  const formattedDate = `${cyear}-${cmonth}-${cday}`
  const [currentDate, setCurrentDate] = useState({
    year: cyear,
    month: today.getMonth() + 1,
  })
  const [myMemo, setMyMemo] = useState<string>()

  useEffect(() => {
    const fetchAlertPlaces = async () => {
      const token = authToken.getAccessToken()
      try {
        const response = await getAlertPlace(token)
        if (response && response.data) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const newFutureAlerts = response.data.filter((place: AlertPlace) => {
            const placeDate = new Date(place.date)
            return placeDate >= today
          })

          setFutureAlerts(newFutureAlerts)

          if (newFutureAlerts.length > 0 && !hasCheckedAlertToday) {
            setShowPopup(true)
          }
        }
      } catch (error) {
        console.error('알림 장소 가져오기 실패:', error)
      }
    }

    setLastCalendarVisit(new Date().toISOString())
    resetDailyCheck()
    fetchAlertPlaces()
  }, [setLastCalendarVisit])

  // selectedDate가 존재하면 그 날짜의 Drawer를 열기 위한 로직
  useEffect(() => {
    if (selectedDate) {
      const [year, month] = selectedDate.split('-')
      setCurrentDate({
        year: Number(year),
        month: Number(month),
      })
    } else {
      setCurrentDate({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
      })
    }
  }, [selectedDate])

  const saveInfos = async () => {
    await refetchUser()
    await refetchLikeList()
    await refetchVisitedList()
  }

  const handleTodayMemo = async () => {
    const successResponse = await postTimelineDay(token, formattedDate)
    if (successResponse) {
      setMyMemo(successResponse.data.memo)
    }
  }

  useEffect(() => {
    saveInfos()
    handleTodayMemo()
  }, [])

  const handleAIScheduleButton = () => {
    useScheduleStore.setState(initialState)
    navigate('/ai-schedule-step1')
  }

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
    if (!drawerOpen) {
      if (
        currentDate.year === today.getFullYear() + 1 &&
        currentDate.month === 12
      ) {
        return
      }

      if (currentDate.month === 12) {
        setCurrentDate({ year: currentDate.year + 1, month: 1 })
      } else {
        setCurrentDate({ year: currentDate.year, month: currentDate.month + 1 })
      }
    }
  }

  const handleSwipeRight = () => {
    if (!drawerOpen) {
      if (currentDate.year === 2024 && currentDate.month === 1) {
        return
      }

      if (currentDate.month === 1) {
        setCurrentDate({ year: currentDate.year - 1, month: 12 })
      } else {
        setCurrentDate({ year: currentDate.year, month: currentDate.month - 1 })
      }
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: true,
    delta: 10,
  })

  const handleClosePopup = () => {
    setShowPopup(false)
    setHasCheckedAlertToday(true)
  }

  return (
    <>
      <div {...handlers}>
        <L.HeaderSection>
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
          <L.AIScheduleButton onClick={handleAIScheduleButton}>
            <FaWandMagicSparkles />
            &nbsp;&nbsp;AI 교육여행
          </L.AIScheduleButton>
        </L.HeaderSection>
        {myMemo && <TodayMemo text={myMemo} />}
        <MainCalendar
          year={currentDate.year}
          month={currentDate.month}
          selectedDate={selectedDate}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
      </div>
      {showPopup && !hasCheckedAlertToday && (
        <IndoorAlertPopUp onClose={handleClosePopup} />
      )}
    </>
  )
}

export default Calendar
