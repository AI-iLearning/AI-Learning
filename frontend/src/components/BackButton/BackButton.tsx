import arrowIcon from '@iconify/icons-heroicons/arrow-small-up'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

import { StyledButton, StyledIcon } from './styles/BackButton.style'
import authToken from '../../stores/authToken'

const BackButton = () => {
  const token = authToken.getAccessToken()
  const navigate = useNavigate()

  const handleBack = () => {
    if (token) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <StyledButton onClick={handleBack}>
      <StyledIcon>
        <Icon icon={arrowIcon} />
      </StyledIcon>
    </StyledButton>
  )
}

export default BackButton
