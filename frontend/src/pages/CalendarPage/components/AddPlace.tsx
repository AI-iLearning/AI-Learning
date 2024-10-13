import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import NoPlace from './NoPlace'
import NoPlace2 from './NoPlace2'
import SearchBar from './SearchBar'
import { postRecommendPlace } from '../../../api/calendar/postRecommendPlace'
import { postAddPlace } from '../../../api/place/postAddPlace'
import BackButton from '../../../components/BackButton/BackButton'
import Loading from '../../../components/Loading/Loading'
import { useAllPlace } from '../../../hooks/useAllPlace'
import authToken from '../../../stores/authToken'
import { getCityAndSigunguName } from '../../../style/CityMapper2'
import PlaceItem from '../../RecommendPage/components/PlaceItem'
import * as L from '../styles/AddPlace.style'
import { NoPlaceContainer } from '../styles/NoPlace.style'

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

const AddPlace: React.FC = () => {
  const token = authToken.getAccessToken()
  const navigate = useNavigate()

  const { date: dateParam } = useParams<{ date: string }>()
  const date: string | null = dateParam ?? null

  const [recommendedPlaces, setRecommendedPlaces] = useState<RecommendPlace[]>(
    [],
  )

  const [filteredPlaces, setFilteredPlaces] = useState<RecommendPlace[]>([]) // 필터링된 장소 상태
  const [isLoading, setIsLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const {
    data: allPlaces,
    isLoading: isAllPlacesLoading,
    error: allPlacesError,
  } = useAllPlace() //전체 데이터 불러오기

  const formatDate = (dateString: string | null): string => {
    if (!dateString) {
      return '날짜 없음'
    } else {
      const date = new Date(dateString)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}월 ${day}일`
    }
  }

  useEffect(() => {
    if (isAllPlacesLoading) {
      setIsLoading(true)
    }
    fetchPlaces()
  }, [token, date])

  const fetchPlaces = async () => {
    if (!token || !date) return

    try {
      setIsLoading(true)
      const requestPayload = { date }
      const response = await postRecommendPlace(token, requestPayload)

      if (response && response.data) {
        setRecommendedPlaces(response.data)
      } else {
        setRecommendedPlaces([])
      }
    } catch (error) {
      setRecommendedPlaces([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchInput = (input: string) => {
    setSearchInput(input)
  }

  const handleClick = (place: RecommendPlace) => {
    navigate(
      `/place/${encodeURIComponent(place.contenttypeid)}/${encodeURIComponent(place.contentid)}`,
      { state: { date, firstimage: place.firstimage } },
    )
  }

  const handleAddButtonClick = async (
    e: React.MouseEvent,
    contentid: number,
  ) => {
    e.stopPropagation()

    if (!date) {
      return
    }

    try {
      const response = await postAddPlace(token, contentid, date)
      if (response) {
        navigate('/calendar', {
          state: {
            selectedDate: date, // date는 추가된 날짜
          },
        })
      } else {
        console.error('Failed to add place.')
      }
    } catch (error) {
      console.error('Error adding place:', error)
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

      setRecommendedPlaces(fetchedGpsPlaces)
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
            recommendedPlaces={recommendedPlaces}
            onFilteredPlaces={setFilteredPlaces}
            onSearchInput={handleSearchInput}
            getCityAndSigunguName={getCityAndSigunguName}
          />
        </L.Header>

        <L.PlacesSection>
          <L.SectionTitle>
            <L.BoldText>{formatDate(date)}</L.BoldText> 추천장소
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
                  <PlaceItem
                    key={place.contentid}
                    place={place}
                    index={index}
                    onClick={() => handleClick(place)}
                    onAddClick={e => handleAddButtonClick(e, place.contentid)}
                  />
                ))}
              </L.PlacesList>
            ) : (
              <NoPlace2 />
            )
          ) : recommendedPlaces.length > 0 ? (
            <L.PlacesList>
              {recommendedPlaces.map((place, index) => (
                <PlaceItem
                  key={place.contentid}
                  place={place}
                  index={index}
                  onClick={() => handleClick(place)}
                  onAddClick={e => handleAddButtonClick(e, place.contentid)}
                />
              ))}
            </L.PlacesList>
          ) : (
            <NoPlace />
          )}
        </L.PlacesSection>
      </L.Container>
    </L.AppContainer>
  )
}

export default AddPlace
