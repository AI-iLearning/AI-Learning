import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { postRecommendPlace } from '../../../api/calendar/postRecommendPlace'
import { postAddPlace } from '../../../api/place/postAddPlace'
import BackButton from '../../../components/BackButton/BackButton'
import authToken from '../../../stores/authToken'
import PlaceItem from '../../RecommendPage/components/PlaceItem'
import dummyImage from '../../RecommendPage/img/dummy.png'
import * as L from '../styles/AddPlace.style'

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

// const dummyData: RecommendPlace[] = [
//   {
//     contentid: 1,
//     contenttypeid: 12,
//     areacode: 35,
//     sigungucode: 2,
//     place: '불국사',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 2,
//     contenttypeid: 12,
//     areacode: 35,
//     sigungucode: 2,
//     place: '석굴암',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 3,
//     contenttypeid: 12,
//     areacode: 35,
//     sigungucode: 2,
//     place: '동궁과 월지',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 4,
//     contenttypeid: 14,
//     areacode: 35,
//     sigungucode: 2,
//     place: '경주 대릉원',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 5,
//     contenttypeid: 12,
//     areacode: 35,
//     sigungucode: 3,
//     place: '첨성대',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 6,
//     contenttypeid: 15,
//     areacode: 35,
//     sigungucode: 4,
//     place: '포석정',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 7,
//     contenttypeid: 12,
//     areacode: 35,
//     sigungucode: 5,
//     place: '경주 남산',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 8,
//     contenttypeid: 16,
//     areacode: 35,
//     sigungucode: 6,
//     place: '문무대왕릉',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 9,
//     contenttypeid: 12,
//     areacode: 35,
//     sigungucode: 7,
//     place: '경주 오릉',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 10,
//     contenttypeid: 14,
//     areacode: 35,
//     sigungucode: 8,
//     place: '경주 국립공원',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 11,
//     contenttypeid: 13,
//     areacode: 35,
//     sigungucode: 9,
//     place: '경주 월정교',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 12,
//     contenttypeid: 12,
//     areacode: 35,
//     sigungucode: 10,
//     place: '경주 황리단길',
//     firstimage: dummyImage,
//   },
//   {
//     contentid: 13,
//     contenttypeid: 12,
//     areacode: 35,
//     sigungucode: 11,
//     place: '경주 보문단지',
//     firstimage: dummyImage,
//   },
// ]

const AddPlace: React.FC = () => {
  const token = authToken.getAccessToken()
  const navigate = useNavigate()

  const { date: dateParam } = useParams<{ date: string }>()
  const date: string | null = dateParam ?? null

  console.log('Date:', date)

  const [recommendedPlaces, setRecommendedPlaces] = useState<RecommendPlace[]>(
    [],
  )
  const [searchTerm, setSearchTerm] = useState('') // 검색어 상태 추가

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

  //-----API 연결----
  useEffect(() => {
    fetchPlaces()
  }, [token, date])

  const fetchPlaces = async () => {
    if (!token || !date) return

    try {
      const requestPayload = { date }
      const response = await postRecommendPlace(token, requestPayload)

      if (response && response.data) {
        setRecommendedPlaces(response.data)
      } else {
        setRecommendedPlaces([])
      }
    } catch (error) {
      console.error('Failed to fetch recommended places:', error)
      setRecommendedPlaces([])
    }
  }

  // 더미 데이터를 상태로 설정
  // useEffect(() => {
  //   setRecommendedPlaces(dummyData)
  // }, [date, token])

  const handleClick = (place: RecommendPlace) => {
    navigate(
      `/place/${encodeURIComponent(place.contenttypeid)}/${encodeURIComponent(place.contentid)}`,
      { state: { date } },
    )
  }

  const handleAddButtonClick = async (
    e: React.MouseEvent,
    contentid: number,
  ) => {
    e.stopPropagation()

    if (!date) {
      console.error('Date is null or undefined.')
      return
    }

    try {
      const response = await postAddPlace(token, contentid, date)
      if (response) {
        console.log('Place added successfully:', response.data.message)
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
    let allPlaces: RecommendPlace[] = []

    try {
      for (const contentTypeId of contentTypeIds) {
        const url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AILearning&_type=json&listYN=Y&arrange=A&mapX=${longitude}&mapY=${latitude}&radius=${radius}&contentTypeId=${contentTypeId}`

        const response = await fetch(url)

        if (response.ok) {
          const contentType = response.headers.get('content-type') || ''
          if (contentType.includes('application/json')) {
            const data = await response.json()
            if (data.response?.body?.items?.item) {
              // 장소 항목들을 배열에 병합하고 'title'을 'place'로 매핑
              const places = data.response.body.items.item.map(
                (item: OpenAPIPlace) => ({
                  contentid: item.contentid,
                  contenttypeid: item.contenttypeid,
                  areacode: Number(item.areacode),
                  sigungucode: item.sigungucode,
                  place: item.title, // OpenAPI의 'title'을 'place'로 매핑
                  firstimage: item.firstimage || dummyImage, // 이미지가 없는 경우 더미 이미지 사용
                }),
              )

              allPlaces = allPlaces.concat(places)

              // 변환된 장소 목록에서 contentid 값만 콘솔에 출력
              places.forEach((place: OpenAPIPlace) => {
                console.log(`contentid: ${place.contentid}`)
              })
            }
          } else {
            console.error('Expected JSON, but received:', await response.text())
          }
        } else {
          console.error('Failed to fetch places:', response.statusText)
        }
      }

      setRecommendedPlaces(allPlaces)
      console.log('Places fetched by content type:', allPlaces)
    } catch (error) {
      console.error('Error fetching places by content type:', error)
    }
  }

  const handleGPSButtonClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          fetchPlacesByContentType(latitude, longitude)
        },
        error => {
          console.error('Error getting location:', error)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  const getLocationName = (
    areacode: number[],
    sigungucode: number | null,
  ): string => {
    if (areacode.length === 0) return '전체'
    if (areacode.includes(1)) return '서울'
    if (areacode.includes(2)) return '인천'
    if (areacode.includes(32)) return '강원도'
    if (areacode.includes(31)) return '경기도'
    if (areacode.includes(33) || areacode.includes(34)) return '충청도'
    if (areacode.includes(35) && sigungucode === 2) return '경주' // 특정 조건에 맞춰 경주로 설정
    if (areacode.includes(35) || areacode.includes(36)) return '경상도'
    if (areacode.includes(37) || areacode.includes(38)) return '전라도'
    if (areacode.includes(6)) return '부산'
    if (areacode.includes(5)) return '광주'
    if (areacode.includes(39)) return '제주'
    return '알 수 없음' // 매칭되지 않는 경우 기본값
  }

  const filteredPlaces = recommendedPlaces.filter(
    place => place && place.place && place.place.includes(searchTerm),
  )

  const handleReloadButtonClick = () => {
    fetchPlaces()
  }

  return (
    <L.AppContainer>
      <L.Container>
        <L.Header>
          <BackButton />
          <L.SearchInput
            type='text'
            placeholder='원하는 장소 검색'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </L.Header>
        <L.PlacesSection>
          <L.SectionTitle>
            <L.BoldText>{formatDate(date)}</L.BoldText> 추천 장소
            <L.gpsIcon onClick={handleGPSButtonClick}></L.gpsIcon>
            <L.ReloadIcon onClick={handleReloadButtonClick}></L.ReloadIcon>
          </L.SectionTitle>
          <L.PlacesList>
            {filteredPlaces.map((place, index) => {
              // Calculate locationName for each place
              const locationName = getLocationName(
                [place.areacode], // Ensure areacode is passed as an array
                place.sigungucode,
              )

              // Print locationName and areacode to the console
              console.log(
                `Location Name: ${locationName}, Area Code: ${place.areacode}`,
              )

              return (
                <PlaceItem
                  key={place.contentid}
                  place={place}
                  index={index}
                  locationName={locationName} // Pass locationName to PlaceItem
                  onClick={handleClick}
                  onAddClick={handleAddButtonClick}
                />
              )
            })}
          </L.PlacesList>
        </L.PlacesSection>
      </L.Container>
    </L.AppContainer>
  )
}

export default AddPlace