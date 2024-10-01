import styled, { keyframes } from 'styled-components'

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`

interface DrawerContainerProps {
  isExpanded: boolean
}

interface DrawerCenterProps {
  isExpanded: boolean
}

export const DrawerContainer = styled.div<DrawerContainerProps>`
  width: 100%;
  max-width: 440px;
  height: ${({ isExpanded }) => (isExpanded ? 'calc(100vh - 10rem)' : '17rem')};
  background-color: white;
  position: fixed;
  bottom: 5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  animation: ${slideUp} 0.1s ease-out;
  transition: height 0.3s ease;
`

export const DrawerHeader = styled.div`
  margin: 1rem 1rem 0 1rem;
  display: flex;
  padding: 1rem 1rem 0 1rem;
  justify-content: space-between;
`

export const DrawerHeaderText = styled.p`
  font-weight: 600;
`

export const DrawerEditOption = styled.div`
  display: flex;
`

export const DrawerHeaderEditText = styled.p<{ isEditing: boolean }>`
  font-weight: 400;
  font-size: 0.9rem;
  color: ${({ isEditing }) => (isEditing ? '#525FD4' : '#717171')};
  cursor: pointer;
`

export const DeleteText = styled.p`
  font-weight: 400;
  font-size: 0.9rem;
  color: #f31c1c;
  cursor: pointer;
  margin-right: 1rem;
`

export const DrawerBottom = styled.div`
  position: fixed;
  width: 100%;
  max-width: 440px;
  bottom: 5rem;
  justify-content: space-between;
`

export const DrawerBottomBox = styled.div`
  display: flex;
  background-color: white;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-bottom: 1rem;
`

export const DrawerBottomButton = styled.button`
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  padding: 0.3rem;
  color: black;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  background-color: white;
`

export const DrawerCenter = styled.div<DrawerCenterProps>`
  margin: 0 0.5rem 0 1rem;
  display: flex;
  flex-direction: column;
  height: ${({ isExpanded }) => (isExpanded ? '43rem' : '12rem')};
  padding: 1rem;
  justify-content: space-between;
  overflow-y: auto;
  padding-bottom: 1rem;
`
