import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { postAddPlace } from '../../../api/place/postAddPlace'
import authToken from '../../../stores/authToken'
import * as L from '../styles/PlaceAddBanner.style'

interface PlaceAddBannerProps {
  contentid: string
  place: string
  selectedDay: string
}

const PlaceAddBanner: React.FC<PlaceAddBannerProps> = ({
  contentid,
  place,
  selectedDay,
}) => {
  const token = authToken.getAccessToken()
  const navigate = useNavigate()
  const formatDate = (dateString: string) => {
    const [, month, day] = dateString.split('-').map(Number)
    return `${month}월 ${day}일`
  }

  const handleCompleteButton = async () => {
    if (token) {
      const successResponse = await postAddPlace(
        token,
        Number(contentid),
        selectedDay,
      )
      if (successResponse) {
        navigate('/calendar', {
          state: {
            selectedDate: selectedDay, // date는 추가된 날짜
          },
        })
      }
    } else {
      navigate('/')
    }
  }

  return (
    <L.BannerSection>
      <L.Banner>
        <L.BannerContainer>
          <div>
            <L.BannerText>
              <strong>{place}</strong>를 추가할 날짜를 선택해주세요!
            </L.BannerText>
            <L.BannerDateText>
              <strong>{formatDate(selectedDay)}</strong>&nbsp;선택
            </L.BannerDateText>
          </div>
          <L.ButtonContainer>
            <L.SelectedButton onClick={handleCompleteButton}>
              완료
            </L.SelectedButton>
          </L.ButtonContainer>
        </L.BannerContainer>
      </L.Banner>
    </L.BannerSection>
  )
}

PlaceAddBanner.propTypes = {
  contentid: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  selectedDay: PropTypes.string.isRequired,
}

export default PlaceAddBanner
