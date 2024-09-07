import styled from 'styled-components'

export const StyledButton = styled.button`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
`

interface StyledIconProps {
  isRotated: boolean
}

export const StyledIcon = styled.div<StyledIconProps>`
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${({ isRotated }) =>
    isRotated ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s ease;
`

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
