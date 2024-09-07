import LogoutButton from './components/LogoutButton'
import ProfileSection from './components/ProfileSection'
import * as L from './styles/Profile.style'

const Profile = () => {
  return (
    <>
      <L.Container>
        <ProfileSection />
        <LogoutButton />
      </L.Container>
    </>
  )
}

export default Profile
