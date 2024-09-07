import styled from 'styled-components'

export const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 4rem;
  background: white;
  border: none;
  display: flex;
  justify-content: flex-start;
  align-items: center; /* 필요에 따라 추가 */
`

export const StyledButton = styled.button`
  width: 4rem;
  height: 3rem;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledIcon = styled.div`
  font-size: 2rem;
  color: black;
  margin-left: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  transform: rotate(-90deg);
`
