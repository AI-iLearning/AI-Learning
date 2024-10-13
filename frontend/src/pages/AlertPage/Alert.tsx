import { Icon } from '@iconify/react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import * as S from './styles/Alert.style'
import { getAlertPlace, AlertPlace } from '../../api/profile/getAlertList'
import BackButton from '../../components/BackButton/BackButton'
import Loading from '../../components/Loading/Loading'
import authToken from '../../stores/authToken'
import { useWeatherAlert } from '../../stores/useWeatherAlert'

const Alert: React.FC = () => {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState<AlertPlace[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getDateDifference = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 설정
    const alertDate = new Date(dateString)
    alertDate.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 설정
    const diffTime = alertDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0)
      return `${alertDate.getMonth() + 1}월 ${alertDate.getDate()}일`
    if (diffDays === 0) return '오늘'
    if (diffDays === 1) return '내일'
    if (diffDays === 2) return '모레'
    if (diffDays > 2 && diffDays <= 7) return `${diffDays}일 뒤에`

    // 날짜가 7일 이상 차이나면 월/일 형식으로 표시
    return `${alertDate.getMonth() + 1}월 ${alertDate.getDate()}일`
  }

  const isDatePassed = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 설정
    const alertDate = new Date(dateString)
    alertDate.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 설정
    return alertDate < today
  }

  const handleAlertItemClick = (contentid: number, date: string) => {
    navigate(`/indoorplace/${date}/${contentid}`, { state: { date } })
  }

  useEffect(() => {
    const fetchAlerts = async () => {
      const token = authToken.getAccessToken()
      setIsLoading(true)
      try {
        const response = await getAlertPlace(token)
        if (response && response.data) {
          setAlerts(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()
  }, [useWeatherAlert().lastCalendarVisit])

  const getWeatherIcon = (weather: number) => {
    switch (weather) {
      case 1:
        return 'fluent:weather-rain-48-filled'
      case 2:
        return 'fluent:weather-snow-48-filled'
      case 3:
        return 'mingcute:snow-fill'
      case 4:
        return 'f7:cloud-bolt-rain-fill'
      default:
        return 'fluent:weather-partly-cloudy-day-48-filled'
    }
  }

  const getWeatherText = (weather: number) => {
    switch (weather) {
      case 1:
        return '비가'
      case 2:
        return '비/눈이'
      case 3:
        return '눈이'
      case 4:
        return '소나기가'
      default:
        return '날씨 변화'
    }
  }

  //아이콘 크기가 다 달라서 통일감 있게 보이려고 조정
  const getWeatherIconSize = (weather: number) => {
    switch (weather) {
      case 1: // fluent
      case 2: // fluent
      case 3: // mingcute
        return { width: '24', height: '24' }
      case 4: // f7
        return { width: '20', height: '20' }
      default: // fluent
        return { width: '24', height: '24' }
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <S.Container>
      <S.Header>
        <BackButton />
        <S.Title>알림</S.Title>
      </S.Header>
      {alerts.length === 0 ? (
        <S.NoAlertsMessage>알림 내역이 없습니다</S.NoAlertsMessage>
      ) : (
        <S.AlertList>
          {alerts.map(alert => {
            const isPassed = isDatePassed(alert.date)
            return (
              <S.AlertItem
                key={alert.contentid}
                onClick={() =>
                  !isPassed && handleAlertItemClick(alert.contentid, alert.date)
                }
                isPassed={isPassed}
              >
                <S.WeatherIcon>
                  <Icon
                    icon={getWeatherIcon(alert.weather)}
                    {...getWeatherIconSize(alert.weather)}
                    color={isPassed ? '#A0A0A0' : '#525FD4'}
                  />
                </S.WeatherIcon>
                <S.AlertContent>
                  <S.AlertText isPassed={isPassed}>
                    <S.BoldText>{getDateDifference(alert.date)}</S.BoldText>{' '}
                    {getWeatherText(alert.weather)} 올 예정이에요
                  </S.AlertText>
                  <S.AlertText isPassed={isPassed}>
                    예정된 <S.BoldText>{alert.place}</S.BoldText> 일정을
                    변경해볼까요?
                  </S.AlertText>
                </S.AlertContent>
                <S.ArrowIcon>
                  <Icon
                    icon='heroicons-solid:chevron-right'
                    width='24'
                    height='24'
                    color={isPassed ? '#A0A0A0' : '#525FD4'}
                  />
                </S.ArrowIcon>
              </S.AlertItem>
            )
          })}
        </S.AlertList>
      )}
    </S.Container>
  )
}

export default Alert
