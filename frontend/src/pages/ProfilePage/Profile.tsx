import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MyLevel from './components/MyLevel'
import PlaceList from './components/PlaceList'
import ProfileSection from './components/ProfileSection'
import * as L from './styles/Profile.style'
import InfoBanner from '../../components/InfoBanner/InfoBanner'

const Profile = () => {
  const [showBanner, setShowBanner] = useState(true)
  const bannerText = '나의 교육 여행 패턴 및 방향성을 알고 싶나요?'
  const navigate = useNavigate()

  const handleBannerClick = () => {
    navigate('/pattern')
  }

  return (
    <>
      <L.Container>
        <ProfileSection />
        <MyLevel />
        <L.BannerContainer>
          {showBanner && (
            <InfoBanner
              text={bannerText}
              onClose={() => setShowBanner(false)}
              onClick={handleBannerClick}
            />
          )}
        </L.BannerContainer>
        <PlaceList />
      </L.Container>
    </>
  )
}

export default Profile
