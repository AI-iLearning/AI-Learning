import styled from 'styled-components'

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`

export const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: black;
  line-height: 2rem;
  padding: 1rem 2rem;
  text-align: left;
  font-size: 18px;
  height: 3.75rem;
`

export const PlacesContainer = styled.main`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: calc((100vh - 16rem) / 8); // 8줄에 맞춰 높이 계산
  gap: 15px;
  padding: 10px 20px;
  height: calc(100vh - 10rem); // Title(60px)과 하단 메뉴바(60px) 높이를 뺌
  overflow-y: auto;
`

export const PlaceCardContainer = styled.div<{ selected: boolean }>`
  background-color: ${props => (props.selected ? '#b3d8c3' : '#eeeeee')};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.05);
  }
`

export const PlaceImage = styled.img`
  width: 100%;
  height: 70%;
  object-fit: cover;
`

export const NumberBadge = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7px;
  font-weight: bold;
`

export const CheckMark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(76, 175, 80, 0.3);
  color: white;
`

export const PlaceName = styled.p`
  margin: 0;
  padding: 5px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
