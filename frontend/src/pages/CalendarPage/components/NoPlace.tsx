import React from 'react'

import {
  ImageWrapper,
  NoPlaceContainer,
  NoPlaceText,
} from '../styles/NoPlace.style'

const NoPlaceImage = '/img/NoPlace.png'

const NoPlace: React.FC = () => {
  return (
    <NoPlaceContainer>
      <ImageWrapper>
        <img src={NoPlaceImage} alt='No places available' />
      </ImageWrapper>
      <NoPlaceText>해당하는 장소가 없습니다</NoPlaceText>
    </NoPlaceContainer>
  )
}

export default NoPlace
