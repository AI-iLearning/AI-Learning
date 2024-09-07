import styled from 'styled-components'

export const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  align-items: center;
  padding: 1.5rem;
`

export const ProfileSection = styled.div`
  width: 100%;
  display: flex;
  padding: 1rem;
`

export const ProfileContainer = styled.div`
  border-radius: 50%;
  overflow: hidden;
  margin-left: 1rem;
  margin-right: 2rem;
  width: 6rem;
  height: 6rem;
`

export const ProfileImage = styled.img`
  height: 100%;
  width: 100%;
  object-cover: cover;
  border-radius: 50%;
`

export const ProfileNickname = styled.p`
  font-weight: 700;
  margin-top: 1rem;
  font-size: 1.5rem;
`

export const BottomButton = styled.button`
  width: 100%;
  max-width: 400px;
  height: 46px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  color: white;
  font-weight: 600;
  background-color: #525fd4;
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: #434cb1;
  }
`
