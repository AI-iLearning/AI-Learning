import arrowIcon from '@iconify/icons-heroicons/arrow-small-up'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

import { StyledButton, StyledIcon, Container } from './styles/BackButton.style'

const BackButton = () => {
  const navigate = useNavigate()
  return (
    <Container>
      <StyledButton onClick={() => navigate('/calendar')}>
        <StyledIcon>
          <Icon icon={arrowIcon} />
        </StyledIcon>
      </StyledButton>
    </Container>
  )
}

export default BackButton
