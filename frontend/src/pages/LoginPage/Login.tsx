import CreateAccount from './components/CreateAccount'
import LoginForm from './components/LoginForm'
import * as L from './styles/Login.style'
import Loading from '../../components/Loading/Loading'
import { useAllPlace } from '../../hooks/useAllPlace'

const Login = () => {
  const { isLoading } = useAllPlace()

  return (
    <>
      {isLoading && <Loading />}
      <L.Container>
        <L.ImgContainer src='/img/logo_main.png' alt='logo' />
        <LoginForm />
        <CreateAccount />
      </L.Container>
    </>
  )
}

export default Login
