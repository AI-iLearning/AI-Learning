import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import IndoorPlaceItem from './components/IndoorPlaceItem'
import * as L from './styles/IndoorPlace.style'
import {
  DateSchedule,
  PlacePreviewInfo,
  postTimelineDay,
} from '../../api/calendar/postTimelineDay'
import { postTimelineFix } from '../../api/calendar/postTimelineFix'
import { postIndoor } from '../../api/place/postIndoor'
import { alertDelete } from '../../api/profile/postAlertDelete'
import BackButton from '../../components/BackButton/BackButton'
import Loading from '../../components/Loading/Loading'
import { useAllPlace } from '../../hooks/useAllPlace'
import authToken from '../../stores/authToken'
import { useDayScheduleStore } from '../../stores/useDayScheduleStore'
import { useAlertStore } from '../../stores/useFutureAlerts' // 추가
import { getCityAndSigunguName } from '../../style/CityMapper2'
import NoPlace from '../CalendarPage/components/NoPlace'
import NoPlace2 from '../CalendarPage/components/NoPlace2'
import SearchBar from '../CalendarPage/components/SearchBar'
import { NoPlaceContainer } from '../CalendarPage/styles/NoPlace.style'

interface RecommendPlace {
  contentid: number
  contenttypeid: number
  areacode: number
  sigungucode: number
  place: string
  firstimage: string
}

interface OpenAPIPlace {
  contentid: number
  contenttypeid: number
  areacode: number
  sigungucode: number
  title: string // OpenAPI의 장소 이름 필드
  firstimage?: string
}

const IndoorPlace: React.FC = () => {
  const token = authToken.getAccessToken()
  const navigate = useNavigate()
  const { daySchedule, setDaySchedule } = useDayScheduleStore()

  const location = useLocation()
  const { date: dateParam, contentid: contentidParam } =
    (location.state as {
      date?: string
      contentid?: string
    }) || {}

  const date = dateParam || ''
  const contentid = contentidParam || ''

  const [indoorPlaces, setIndoorPlaces] = useState<RecommendPlace[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<RecommendPlace[]>([]) // 필터링된 장소 상태
  const [isLoading, setIsLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const {
    data: allPlaces,
    isLoading: isAllPlacesLoading,
    error: allPlacesError,
  } = useAllPlace() //전체 데이터 불러오기

  const { futureAlerts, setFutureAlerts } = useAlertStore() // 추가

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !date || !contentid) return

      setIsLoading(true)
      try {
        // 일정 가져오기
        const scheduleResponse = await postTimelineDay(token, date)
        if (scheduleResponse && scheduleResponse.data) {
          setDaySchedule(scheduleResponse.data)
        } else {
          console.error('Failed to fetch day schedule or received empty data')
        }

        // 실내 장소 가져오기
        const indoorResponse = await postIndoor(token, date, Number(contentid))
        if (indoorResponse && indoorResponse.data) {
          setIndoorPlaces(indoorResponse.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token, date, contentid, setDaySchedule])

  const findOriginalPlace = () => {
    if (!daySchedule || !daySchedule.info || !contentid) return null

    const originalPlace = daySchedule.info.find(
      place =>
        place.contentid &&
        place.contentid.toString() === Number(contentid).toString(),
    )

    if (!originalPlace) return null

    return originalPlace
  }

  const fetchPlaces = async () => {
    if (token && date) {
      await postTimelineDay(token, date as string)
    }
  }

  useEffect(() => {
    if (isAllPlacesLoading || isLoading) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
    fetchPlaces()
  }, [token, date])

  const handleSearchInput = (input: string) => {
    setSearchInput(input)
  }

  const handleClick = (place: RecommendPlace) => {
    navigate(
      `/place/${encodeURIComponent(place.contenttypeid)}/${encodeURIComponent(place.contentid)}`,
      { state: { date, firstimage: place.firstimage } },
    )
  }

  const handleFixButtonClick = async (
    newPlace: RecommendPlace,
    originalPlace: PlacePreviewInfo | null,
  ) => {
    if (!date || !daySchedule || !originalPlace) return

    const updatedFutureAlerts = futureAlerts.filter(
      alert => alert.contentid !== originalPlace.contentid,
    )
    setFutureAlerts(updatedFutureAlerts)

    await alertDelete(token, {
      date: date, // 원래 장소의 날짜
      contentid: originalPlace.contentid, // 원래 장소의 contentid
    })

    try {
      const indexToReplace = daySchedule.info.findIndex(
        place =>
          place.contentid &&
          place.contentid.toString() === originalPlace.contentid.toString(),
      )

      if (indexToReplace === -1) {
        console.error('Place to replace not found in current schedule.')
        return
      }

      const newPlaceInfo: PlacePreviewInfo = {
        contentid: newPlace.contentid,
        contenttypeid: newPlace.contenttypeid,
        areacode: newPlace.areacode,
        sigungucode: newPlace.sigungucode,
        place: newPlace.place,
        order: daySchedule.info[indexToReplace].order,
        firstimage: newPlace.firstimage,
        mapx: 0,
        mapy: 0,
      }

      const updatedSchedule: DateSchedule = {
        ...daySchedule,
        info: [
          ...daySchedule.info.slice(0, indexToReplace),
          newPlaceInfo,
          ...daySchedule.info.slice(indexToReplace + 1),
        ],
      }

      const response = await postTimelineFix(token, updatedSchedule)

      if (response && response.data) {
        navigate('/calendar', {
          state: {
            selectedDate: date,
          },
        })
      } else {
        console.error('Failed to update place.')
      }
    } catch (error) {
      console.error('Error updating place:', error)
    }
  }

  const fetchPlacesByContentType = async (
    latitude: number,
    longitude: number,
  ) => {
    const radius = '5000' // 검색 반경 (10km)
    const serviceKey = process.env.REACT_APP_TOURISM_SERVICE_KEY
    const contentTypeIds = [12, 14, 15] // 검색할 contentTypeId 목록
    let fetchedGpsPlaces: RecommendPlace[] = []

    try {
      for (const contentTypeId of contentTypeIds) {
        const url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AILearning&_type=json&listYN=Y&arrange=A&mapX=${longitude}&mapY=${latitude}&radius=${radius}&contentTypeId=${contentTypeId}`

        const response = await fetch(url)

        if (response.ok) {
          const contentType = response.headers.get('content-type') || ''
          if (contentType.includes('application/json')) {
            const data = await response.json()
            if (data.response?.body?.items?.item) {
              const places = data.response.body.items.item.map(
                (item: OpenAPIPlace) => ({
                  contentid: item.contentid,
                  contenttypeid: item.contenttypeid,
                  areacode: Number(item.areacode),
                  sigungucode: item.sigungucode,
                  place: item.title,
                  firstimage: item.firstimage || '/img/default_pic.png', // Default image if none available
                }),
              )

              fetchedGpsPlaces = fetchedGpsPlaces.concat(places)
            }
          } else {
            console.error('Expected JSON, but received:', await response.text())
          }
        } else {
          console.error('Failed to fetch places:', response.statusText)
        }
      }

      setIndoorPlaces(fetchedGpsPlaces)
    } catch (error) {
      console.error('Error fetching places by content type:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGPSButtonClick = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          fetchPlacesByContentType(latitude, longitude)
        },
        error => {
          console.error('Error getting location:', error)
          setIsLoading(false)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
      setIsLoading(false)
    }
  }

  const handleReloadButtonClick = () => {
    fetchPlaces()
  }

  return (
    <L.AppContainer>
      <L.Container>
        <L.Header>
          <BackButton />
          <SearchBar
            allPlaces={allPlaces?.data ?? []}
            recommendedPlaces={indoorPlaces}
            onFilteredPlaces={setFilteredPlaces}
            onSearchInput={handleSearchInput}
            getCityAndSigunguName={getCityAndSigunguName}
          />
        </L.Header>

        <L.PlacesSection>
          <L.SectionTitle>
            실내장소 추천
            <L.gpsIcon onClick={handleGPSButtonClick}></L.gpsIcon>
            <L.ReloadIcon onClick={handleReloadButtonClick}></L.ReloadIcon>
          </L.SectionTitle>
          {isLoading ? (
            <NoPlaceContainer>
              <Loading />
            </NoPlaceContainer>
          ) : allPlacesError ? (
            <div>Error occurred</div>
          ) : searchInput ? (
            filteredPlaces.length > 0 ? (
              <L.PlacesList>
                {filteredPlaces.map((place, index) => (
                  <IndoorPlaceItem
                    key={place.contentid}
                    place={place}
                    index={index}
                    originalPlace={findOriginalPlace()}
                    onClick={handleClick}
                    onFixClick={handleFixButtonClick}
                  />
                ))}
              </L.PlacesList>
            ) : (
              <NoPlace2 />
            )
          ) : indoorPlaces.length > 0 ? (
            <L.PlacesList>
              {indoorPlaces.map(
                (place, index) =>
                  place && (
                    <IndoorPlaceItem
                      key={place.contentid || index}
                      place={place}
                      index={index}
                      originalPlace={findOriginalPlace()}
                      onClick={handleClick}
                      onFixClick={handleFixButtonClick}
                    />
                  ),
              )}
            </L.PlacesList>
          ) : (
            <NoPlace />
          )}
        </L.PlacesSection>
      </L.Container>
    </L.AppContainer>
  )
}

export default IndoorPlace
