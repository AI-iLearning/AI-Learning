import styled from 'styled-components'

export const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
  padding: 2rem;
  background-color: #f9f9f9;
`

export const Title = styled.h1`
  font-size: 6rem;
  color: #525fd4;
  margin: 0;
  font-weight: 700;
  text-align: center;
`

export const Message = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0.5rem 0;
  text-align: center;
`

export const Description = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  max-width: 300px;
  line-height: 1.5;
  text-align: center;
`

export const HomeButton = styled.button`
  padding: 0.8rem 2rem;
  background-color: #525fd4;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #414aad;
  }
`
