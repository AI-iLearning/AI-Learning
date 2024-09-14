import styled from 'styled-components'

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 6rem);
  margin-bottom: 6rem;
`

export const Container = styled.div`
  padding: 20px;
  padding-bottom: 0px;
  font-family: 'Arial', sans-serif;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`

export const SearchInput = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  outline: none;
  border-radius: 4px;
  margin-left: 0.5rem;
  width: calc(100% - 1.8rem);
  background-color: #f7f7f7;
  color: #333;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.01);
`

export const PlacesSection = styled.section`
  margin-top: 10px;
`

export const SectionTitle = styled.div`
  font-size: 16px;
  margin-bottom: 15px;
  margin-left: 5px;
`

export const BoldText = styled.span`
  font-weight: bold;
  font-size: 20px;
`

export const PlacesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

export const PlaceItem = styled.li`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
`

export const PlaceNumber = styled.span`
  font-size: 12px;
  font-weight: bold;
  margin-left: 5px;
  margin-right: 15px;
`

export const PlaceImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-right: 15px;
`

export const PlaceInfo = styled.div`
  flex-grow: 1;
`

export const PlaceName = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`

export const PlaceDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 5px 0 0 0;
`

export const AddButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 5px 13px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 22px;

  &:hover {
    background-color: #e0e0e0;
  }
`