import arrowUp from '@iconify/icons-iconamoon/arrow-up-2-thin'
import { Icon } from '@iconify/react'
import PropTypes from 'prop-types'
import { useState } from 'react'

import { StyledButton, StyledIcon } from '../styles/DrawerButton.style'

interface DrawerButtonProps {
  onToggleHeight: () => void
}

const DrawerButton: React.FC<DrawerButtonProps> = ({ onToggleHeight }) => {
  const [isRotated, setIsRotated] = useState(false)

  const handleClick = () => {
    setIsRotated(!isRotated)
    onToggleHeight()
  }

  return (
    <StyledButton onClick={handleClick}>
      <StyledIcon isRotated={isRotated}>
        <Icon icon={arrowUp} />
      </StyledIcon>
    </StyledButton>
  )
}

DrawerButton.propTypes = {
  onToggleHeight: PropTypes.func.isRequired,
}

export default DrawerButton
