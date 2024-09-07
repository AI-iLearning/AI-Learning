import styled from 'styled-components'

export const PlaceBoxWrapper = styled.div`
  width: 100%;
`

export const PlaceBoxContainer = styled.div`
  width: 100%;
  height: 4.5rem;
  background-color: white;
  border-radius: 15px;
  padding: 1rem;
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`

export const PlaceBoxText = styled.div`
  line-height: 1.5rem;
  justify-content: center;
  align-items: center;
`

export const PlaceBoxTitle = styled.p`
  font-weight: 700;
  font-size: 1.1rem;
  margin-left: 0.5rem;
`

export const PlaceBoxCity = styled.p`
  font-weight: 400;
  color: #626262;
  font-size: 0.9rem;
  margin-left: 0.5rem;
`

export const PlaceBoxPic = styled.img`
  height: 3.5rem;
  width: 3.5rem;
  position: relative;
  object-fit: cover;
  border-radius: 10px;
`
