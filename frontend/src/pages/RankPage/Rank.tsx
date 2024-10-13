import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as L from './styles/Rank.style'
import { getRank } from '../../api/rank/getRank'
import useVisitedList from '../../hooks/useVisitedList'
import authToken from '../../stores/authToken'
import { useWeatherAlert } from '../../stores/useWeatherAlert'

interface Place {
  contentid: number
  contenttypeid: number
  place: string
  firstimage: string
}

interface VisitedPlace {
  contentid: number
  contenttypeid: number
  areacode: number
  sigungucode: number
  place: string
  firstimage: string
}

const PlaceCard: React.FC<{
  place: Place
  selected: boolean
  index: number
}> = ({ place, selected, index }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(
      `/place/${encodeURIComponent(place.contenttypeid)}/${encodeURIComponent(place.contentid)}`,
      { state: { firstimage: place.firstimage } },
    )
  }

  return (
    <L.PlaceCardContainer selected={selected} onClick={handleClick}>
      <L.NumberBadge>{index + 1}</L.NumberBadge>
      {selected && (
        <L.CheckMark>
          <Icon icon='gravity-ui:check' width='40' height='40' />
        </L.CheckMark>
      )}
      <L.PlaceImage src={place.firstimage} alt={place.place} />
      <L.PlaceName>{place.place}</L.PlaceName>
    </L.PlaceCardContainer>
  )
}

const Rank: React.FC = () => {
  const { visitedList } = useVisitedList()
  const [visitedPlaces, setVisitedPlaces] = useState<Set<number>>(new Set())
  const [top100Places, setTop100Places] = useState<Place[]>([])
  const { setHasCheckedAlertToday } = useWeatherAlert()

  useEffect(() => {
    const fetchPlaces = async () => {
      const token = authToken.getAccessToken()

      const places = await getRank(token)
      if (places) {
        setTop100Places(places.data)
      }
    }

    const fetchVisitedPlaces = async () => {
      if (visitedList) {
        const visitedIds = new Set(
          visitedList.map((place: VisitedPlace) => place.contentid),
        ) // Set 생성
        setVisitedPlaces(visitedIds)
      }
    }

    fetchPlaces()
    fetchVisitedPlaces()
    setHasCheckedAlertToday(false)
  }, [])

  return (
    <L.AppContainer>
      <L.Title>
        <h1>교육여행장소 100곳</h1>
      </L.Title>
      <L.PlacesContainer>
        {top100Places.slice(0, 100).map((place, index) => (
          <PlaceCard
            key={place.contentid}
            place={place}
            selected={visitedPlaces.has(place.contentid)}
            index={index}
          />
        ))}
      </L.PlacesContainer>
    </L.AppContainer>
  )
}

export default Rank
