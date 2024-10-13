import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import LevelItem from './LevelItem'
import { postLevel } from '../../../api/profile/postLevel'
import BackButton from '../../../components/BackButton/BackButton'
import authToken from '../../../stores/authToken'
import * as L from '../styles/EachLevel.style'

interface Level {
  contentid: number
  contenttypeid: number
  areacode: number
  sigungucode: number
  place: string
  firstimage: string
  isVisited: boolean
}

const EachLevel: React.FC = () => {
  const [levelPlaces, setLevelPlaces] = useState<Level[]>([])

  const token = authToken.getAccessToken()
  const navigate = useNavigate()
  const { level: level } = useParams<{ level: string }>()

  useEffect(() => {
    fetchPlaces()
  }, [token, level])

  const fetchPlaces = async () => {
    if (!token || !level) return

    try {
      const response = await postLevel(token, level)

      if (response && response.data) {
        setLevelPlaces(response.data)
      } else {
        setLevelPlaces([])
      }
    } catch (error) {
      console.error('Failed to fetch recommended places:', error)
      setLevelPlaces([])
    }
  }

  const notVisited = levelPlaces.filter(place => !place.isVisited)
  const visited = levelPlaces.filter(place => place.isVisited)

  const handleClick = (place: Level) => {
    navigate(
      `/place/${encodeURIComponent(place.contenttypeid)}/${encodeURIComponent(place.contentid)}`,
      { state: { firstimage: place.firstimage } },
    )
  }

  return (
    <L.Container>
      <L.ButtonContainer>
        <BackButton />
      </L.ButtonContainer>

      <L.ScrollContainer>
        <L.Title>{level} 추천 여행지</L.Title>

        {notVisited.length > 0 && (
          <L.Section1>
            <L.SectionHeader>아직 방문하지 않음</L.SectionHeader>
            <L.DestinationList>
              {notVisited.map((place, index) => (
                <LevelItem
                  key={place.contentid}
                  place={place}
                  index={index}
                  onClick={() => handleClick(place)}
                />
              ))}
            </L.DestinationList>
          </L.Section1>
        )}

        <L.Section2>
          <L.SectionHeader>방문 완료</L.SectionHeader>
          {visited.length > 0 ? (
            <L.DestinationList>
              {visited.map((place, index) => (
                <LevelItem
                  key={place.contentid}
                  place={place}
                  index={index}
                  onClick={() => handleClick(place)}
                />
              ))}
            </L.DestinationList>
          ) : (
            <L.NoVisitedMessage>아직 방문한 장소가 없습니다</L.NoVisitedMessage>
          )}
        </L.Section2>
      </L.ScrollContainer>
    </L.Container>
  )
}

export default EachLevel
