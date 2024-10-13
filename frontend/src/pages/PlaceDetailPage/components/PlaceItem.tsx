import React from 'react'

import * as L from '../styles/AccomodationItem.style'

interface PlaceBoxItemProps {
  item: {
    addr1: string
    title: string
    firstimage: string
  }
}

const PlaceItem: React.FC<PlaceBoxItemProps> = ({ item }) => {
  return (
    <>
      <L.PlaceBoxContainer>
        <L.PlaceBoxText>
          <L.PlaceBoxTitle>{item.title}</L.PlaceBoxTitle>
          <L.PlaceBoxCity>{item.addr1}</L.PlaceBoxCity>
        </L.PlaceBoxText>
        <L.PlaceBoxPic alt='placePreview' src={item.firstimage} />
      </L.PlaceBoxContainer>
    </>
  )
}

export default PlaceItem
