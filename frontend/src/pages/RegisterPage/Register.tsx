import RegisterForm from './components/RegisterForm'
import * as L from './styles/Register.style'

const Register = () => {
  return (
    <L.Container>
      <L.Title>회원가입</L.Title>
      <RegisterForm />
    </L.Container>
  )
}

export default Register
