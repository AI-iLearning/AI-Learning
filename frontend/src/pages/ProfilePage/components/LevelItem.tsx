import React from 'react'

import { getCityName } from '../../../style/CityMapper'
import * as L from '../styles/LevelItem.style'

interface LevelPlace {
  contentid: number
  contenttypeid: number
  areacode: number
  sigungucode: number
  place: string
  firstimage: string
  isVisited: boolean
}

interface LevelItemProps {
  place: LevelPlace
  index: number
  onClick: (place: LevelPlace) => void
}

const getContentTypeDescription = (contenttypeid: number | string): string => {
  switch (contenttypeid.toString()) {
    case '12':
      return '관광지'
    case '14':
      return '문화시설'
    case '15':
      return '축제공연행사'
    default:
      return '기타'
  }
}

const LevelItem: React.FC<LevelItemProps> = ({ place, onClick }) => {
  const cityName = getCityName(place.areacode, place.sigungucode)

  return (
    <L.PlaceItem
      key={place.contentid}
      onClick={() => onClick(place)}
      visited={place.isVisited}
    >
      <L.PlaceCardContainer isVisited={place.isVisited}>
        <L.PlaceImage
          src={place.firstimage || '/img/default_pic.png'}
          alt={place.place}
        />
      </L.PlaceCardContainer>
      <L.PlaceInfo>
        <L.PlaceName>{place.place}</L.PlaceName>
        <L.PlaceDescription>
          {`${cityName} · ${getContentTypeDescription(place.contenttypeid)}`}
        </L.PlaceDescription>
      </L.PlaceInfo>
    </L.PlaceItem>
  )
}

export default LevelItem
