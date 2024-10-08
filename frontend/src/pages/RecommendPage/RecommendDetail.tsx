/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import PlaceItem from './components/PlaceItem'
import * as L from './styles/RecommendDetail.style'
import { postRecommendPlace } from '../../api/recommend/postRecommendPlace'
import BackButton from '../../components/BackButton/BackButton'
import Loading from '../../components/Loading/Loading'
import { useAllPlace } from '../../hooks/useAllPlace'
import authToken from '../../stores/authToken'

interface RecommendPlace {
  contentid: number
  contenttypeid: number
  areacode: number
  sigungucode: number
  place: string
  firstimage: string
}

const RecommendDetail: React.FC = () => {
  const token = authToken.getAccessToken()
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const areacode = JSON.parse(searchParams.get('areacode') || '[]')
  const sigungucode = searchParams.get('sigungucode')
  const [recommendedPlaces, setRecommendedPlaces] = useState<RecommendPlace[]>(
    [],
  )
  const [visiblePlaces, setVisiblePlaces] = useState<RecommendPlace[]>([]) // 현재 보여줄 장소들
  const [currentIndex, setCurrentIndex] = useState(20) // 처음에 20개만 보이도록 설정
  const [searchTerm, setSearchTerm] = useState('') // 검색어 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { data: allPlaces } = useAllPlace()

  const listRef = useRef<HTMLUListElement | null>(null) // PlacesList에 ref 추가

  const fetchPlaces = async () => {
    setIsLoading(true)
    if (sigungucode === null) return

    if (areacode.length === 0) {
      if (allPlaces) setRecommendedPlaces(allPlaces.data)
    } else {
      let sigungu = null
      if (sigungucode !== 'null') {
        sigungu = Number(sigungucode)
      }

      try {
        const response = await postRecommendPlace(token, areacode, sigungu)
        if (response && response.data) {
          setRecommendedPlaces(response.data)
        }
      } catch (error) {
        console.error('추천 장소를 가져오는 데 실패했습니다:', error)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchPlaces()
  }, [token])

  useEffect(() => {
    if (recommendedPlaces.length > 0) {
      setVisiblePlaces(recommendedPlaces.slice(0, currentIndex))
    }
  }, [recommendedPlaces, currentIndex])

  // 스크롤 이벤트를 PlacesList에 등록
  useEffect(() => {
    const listElement = listRef.current // PlacesList 요소 참조
    if (!listElement) return

    const handleScroll = () => {
      // 모든 데이터를 이미 로드한 경우 더 이상 업데이트하지 않음
      if (visiblePlaces.length >= recommendedPlaces.length) return

      if (
        listElement.scrollTop + listElement.clientHeight >=
        listElement.scrollHeight - 100
      ) {
        // 이미 모든 데이터를 로드한 경우, 추가 데이터를 로드하지 않음
        setCurrentIndex(prevIndex => {
          const newIndex = prevIndex + 20

          // 새로운 인덱스가 recommendedPlaces의 길이를 넘지 않도록 제한
          if (newIndex >= recommendedPlaces.length) {
            setVisiblePlaces(
              recommendedPlaces.slice(0, recommendedPlaces.length),
            )
            return prevIndex // 더 이상 증가하지 않도록 이전 인덱스를 반환
          }

          setVisiblePlaces(recommendedPlaces.slice(0, newIndex))
          return newIndex
        })
      }
    }

    listElement.addEventListener('scroll', handleScroll)

    return () => {
      listElement.removeEventListener('scroll', handleScroll)
    }
  }, [recommendedPlaces, visiblePlaces.length])

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
    if (areacode.includes(35) && sigungucode === 2) return '경주'
    if (areacode.includes(35) || areacode.includes(36)) return '경상도'
    if (areacode.includes(37) || areacode.includes(38)) return '전라도'
    if (areacode.includes(6)) return '부산'
    if (areacode.includes(5)) return '광주'
    if (areacode.includes(39)) return '제주'
    return '알 수 없음'
  }

  const locationName = getLocationName(
    areacode,
    sigungucode !== 'null' ? Number(sigungucode) : null,
  )

  const filteredPlaces = recommendedPlaces.filter(place =>
    place.place.includes(searchTerm),
  )

  useEffect(() => {
    const slicedPlaces = filteredPlaces.slice(0, currentIndex)
    if (slicedPlaces.length !== visiblePlaces.length) {
      setVisiblePlaces(slicedPlaces)
    }
  }, [filteredPlaces, currentIndex])

  const handleClick = (place: RecommendPlace) => {
    navigate(
      `/place/${encodeURIComponent(place.contenttypeid)}/${encodeURIComponent(place.contentid)}`,
      { state: { firstimage: place.firstimage } },
    )
  }

  const handleAddButtonClick = (
    e: React.MouseEvent,
    contentid: number,
    place: string,
  ) => {
    e.stopPropagation()
    navigate(`/dateselected/${contentid}/${encodeURIComponent(place)}`)
  }

  return (
    <>
      {isLoading && <Loading />}
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
              <L.BoldText>{locationName}</L.BoldText> 추천 장소
            </L.SectionTitle>
            <L.PlacesList ref={listRef}>
              {visiblePlaces.map((place, index) => (
                <PlaceItem
                  key={place.contentid}
                  place={place}
                  index={index}
                  onClick={handleClick}
                  onAddClick={handleAddButtonClick}
                />
              ))}
            </L.PlacesList>
          </L.PlacesSection>
        </L.Container>
      </L.AppContainer>
    </>
  )
}

export default RecommendDetail
