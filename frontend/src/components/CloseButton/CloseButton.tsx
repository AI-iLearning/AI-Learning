import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

import { CloseButton, Container } from './styles/CloseButton.style'

const BackButton = () => {
  const navigate = useNavigate()
  return (
    <Container>
      <CloseButton onClick={() => navigate(-1)}>
        <Icon icon='ei:close' />
      </CloseButton>
    </Container>
  )
}

export default BackButton
