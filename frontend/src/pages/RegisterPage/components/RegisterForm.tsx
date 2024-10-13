import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { checkEmail } from '../../../api/auth/postCheckEmail'
import { checkNickname } from '../../../api/auth/postCheckNickname'
import { login } from '../../../api/auth/postLogin'
import { register } from '../../../api/auth/postRegister'
import AlertPopUp1 from '../../../components/AlertPopUp/AlertPopUp1/AlertPopUp1'
import {
  getAreaNames,
  getSigunguByAreacode,
  Sigungu,
} from '../../../datas/RegisterCityMapper'
import authToken from '../../../stores/authToken'
import * as L from '../styles/Register.style'

const RegisterForm = ({ accessToken }: { accessToken?: string }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const emailFromKakao = location.state?.email || ''

  const [signupForm, setSignupForm] = useState({
    email: accessToken ? emailFromKakao : '',
    nickname: '',
    year: 2024,
    areacode: 0,
    sigungucode: 0,
    c_password: '',
    checkedPassword: '',
  })

  // 오류 메세지
  const [validMessage, setValidMessage] = useState({
    emailMessage: '',
    nicknameMessage: '',
    passwordMessage: '',
    checkedPasswordMessage: '',
  })

  // 유효성 검사
  const [isValid, setIsValid] = useState({
    email: !!accessToken,
    nickname: false,
    c_password: false,
    checkedPassword: false,
  })

  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 30
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i,
  )

  const [selectedArea, setSelectedArea] = useState('') // 선택한 지역
  const [selectedSigungu, setSelectedSigungu] = useState('') // 선택한 시군구
  const [sigunguList, setSigunguList] = useState<Sigungu[]>([]) // 해당 지역의 시군구 목록

  const [alertMessage, setAlertMessage] = useState<string>('') // 알림창 메시지 상태
  const [showAlert, setShowAlert] = useState<boolean>(false) // 알림창 표시 여부 상태
  const [navigateOnConfirm, setNavigateOnConfirm] = useState<boolean>(false)
  const [isChecked, setIsChecked] = useState({
    emailChecked: !!accessToken, // accessToken이 있으면 이미 확인된 상태로 간주
    nicknameChecked: false,
  })
  const [myPassword, setMyPassword] = useState<boolean>(false)

  // 이메일 변경 시 중복확인 무효화
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupForm({ ...signupForm, [name]: value })

    if (name === 'email') {
      setIsValid(prev => ({ ...prev, email: false }))
      setIsChecked(prev => ({ ...prev, emailChecked: false }))
      setValidMessage(prev => ({
        ...prev,
        emailMessage: '',
      }))
    }

    if (name === 'nickname') {
      setIsValid(prev => ({ ...prev, nickname: false }))
      setIsChecked(prev => ({ ...prev, nicknameChecked: false }))
      setValidMessage(prev => ({
        ...prev,
        nicknameMessage: '',
      }))
    }
  }

  // 이메일 중복확인 버튼 클릭 시
  const handleCheckEmail = async () => {
    const emailResult = await checkEmail(signupForm.email)
    if (emailResult?.data.isExist === true) {
      setValidMessage(prev => ({
        ...prev,
        emailMessage: '사용 불가능한 이메일입니다.',
      }))
      setIsValid({ ...isValid, email: false })
    } else if (emailResult?.data.isExist == false) {
      setValidMessage(prev => ({
        ...prev,
        emailMessage: '사용 가능한 이메일입니다.',
      }))
      setIsValid({ ...isValid, email: true })
    } else {
      setValidMessage(prev => ({
        ...prev,
        emailMessage: '잠시 후 다시 시도해주세요.',
      }))
      setIsValid({ ...isValid, email: false })
    }

    setIsChecked(prev => ({ ...prev, emailChecked: true })) // 중복확인 완료로 설정
  }

  // 닉네임 중복확인 버튼 클릭 시
  const handleCheckNickname = async () => {
    const nicknameResult = await checkNickname(signupForm.nickname)
    if (nicknameResult?.data.isExist === true) {
      setValidMessage(prev => ({
        ...prev,
        nicknameMessage: '중복된 닉네임입니다.',
      }))
      setIsValid({ ...isValid, nickname: false })
    } else if (nicknameResult?.data.isExist == false) {
      setValidMessage(prev => ({
        ...prev,
        nicknameMessage: '사용 가능한 닉네임입니다.',
      }))
      setIsValid({ ...isValid, nickname: true })
    } else {
      setValidMessage(prev => ({
        ...prev,
        nicknameMessage: '잠시 후 다시 시도해주세요.',
      }))
      setIsValid({ ...isValid, nickname: false })
    }

    setIsChecked(prev => ({ ...prev, nicknameChecked: true })) // 중복확인 완료로 설정
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setSignupForm({ ...signupForm, [name]: Number(value) })
  }

  // 비밀번호 유효성 검사
  useEffect(() => {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,15}$/

    if (!regex.test(signupForm.c_password)) {
      setMyPassword(false)
      setIsValid({ ...isValid, c_password: false })
      setValidMessage(prev => ({
        ...prev,
        passwordMessage:
          '숫자, 영문, 특수문자를 포함하여 최소 8자를 입력해주세요',
      }))
    } else {
      setMyPassword(true)
      setIsValid({ ...isValid, c_password: true })
      setValidMessage(prev => ({
        ...prev,
        passwordMessage: '',
      }))
    }
  }, [signupForm.c_password])

  // 비밀번호 확인
  useEffect(() => {
    if (signupForm.c_password !== signupForm.checkedPassword) {
      setValidMessage(prev => ({
        ...prev,
        checkedPasswordMessage: '비밀번호가 일치하지 않습니다.',
      }))
      setIsValid({ ...isValid, checkedPassword: false })
    } else {
      setValidMessage(prev => ({
        ...prev,
        checkedPasswordMessage: '',
      }))
      setIsValid({ ...isValid, checkedPassword: true })
    }
  }, [signupForm.c_password, signupForm.checkedPassword])

  // 지역 선택 핸들러
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAreaname = e.target.value
    setSelectedArea(selectedAreaname) // 선택한 지역을 상태로 설정
    const sigungus = getSigunguByAreacode(selectedAreaname) // 시군구 목록 가져오기
    setSigunguList(sigungus) // 해당 시군구 목록 설정
    setSelectedSigungu('')

    if (sigungus.length > 0) {
      setSignupForm({
        ...signupForm,
        areacode: sigungus[0].areacode, // 선택한 지역의 areacode 설정
        sigungucode: 0, // 시군구 선택을 초기화
      })
    }
  }

  // 시군구 선택 핸들러
  const handleSigunguChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSigunguName = e.target.value
    setSelectedSigungu(selectedSigunguName)
    const selectedSigungu = sigunguList.find(
      sigungu => sigungu.sigunguname === selectedSigunguName,
    )
    if (selectedSigungu) {
      setSignupForm({
        ...signupForm,
        sigungucode: selectedSigungu.sigungucode, // 선택한 시군구의 sigungucode 설정
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사 실패 시 알림창 표시
    if (!isValid.email) {
      setAlertMessage('이메일 중복확인을 해주세요.')
      setShowAlert(true)
      return
    }
    if (!isValid.nickname) {
      setAlertMessage('닉네임 중복확인을 해주세요.')
      setShowAlert(true)
      return
    }
    if (!myPassword) {
      setAlertMessage('비밀번호를 다시 한 번 확인해주세요.')
      setShowAlert(true)
      return
    }
    if (!isValid.checkedPassword) {
      setAlertMessage('비밀번호가 일치하지 않습니다.')
      setShowAlert(true)
      return
    }

    const registerResult = await register(
      signupForm.email,
      signupForm.nickname,
      signupForm.c_password,
      signupForm.year,
      signupForm.areacode,
      signupForm.sigungucode,
      accessToken,
    )

    if (registerResult) {
      setAlertMessage('아이러닝의 회원이 되신 것을 환영합니다!')
      setShowAlert(true)
      setNavigateOnConfirm(true) // navigateOnConfirm을 true로 설정
    } else {
      setAlertMessage('회원가입에 실패했습니다. 다시 시도해주세요.')
      setShowAlert(true)
      setNavigateOnConfirm(false) // 실패 시에는 navigate 없이 팝업만
    }
  }

  // 팝업의 확인 버튼 클릭 시 navigate 처리
  const handleConfirm = async () => {
    setShowAlert(false) // 팝업 닫기

    if (navigateOnConfirm) {
      if (emailFromKakao) {
        const successResponse = await login(
          signupForm.email,
          signupForm.c_password,
        )
        if (successResponse) {
          authToken.setToken(successResponse.data.token)
          navigate('/calendar')
        }
      } else {
        navigate('/login')
      }
    }
  }

  return (
    <>
      {showAlert && (
        <AlertPopUp1 message={alertMessage} onConfirm={handleConfirm} />
      )}
      <L.Form onSubmit={handleSubmit}>
        <L.InputWrapper>
          <L.Label>이메일</L.Label>
          <L.Input
            type='email'
            name='email'
            id='email'
            value={signupForm.email}
            onChange={handleChange}
            placeholder='이메일을 입력해주세요'
            required
            disabled={!!accessToken} // accessToken이 있으면 이메일 입력을 비활성화
          />
          {!accessToken && (
            <L.Button type='button' onClick={handleCheckEmail}>
              중복확인
            </L.Button>
          )}
          <L.ValidationMessage error={!isValid.email && isChecked.emailChecked}>
            {validMessage.emailMessage}
          </L.ValidationMessage>
        </L.InputWrapper>
        <L.InputWrapper>
          <L.Label>닉네임</L.Label>
          <L.Input
            type='text'
            name='nickname'
            id='nickname'
            value={signupForm.nickname}
            onChange={handleChange}
            maxLength={10}
            placeholder='닉네임'
            required
          />
          <L.Button type='button' onClick={handleCheckNickname}>
            중복확인
          </L.Button>
          <L.ValidationMessage
            error={!isValid.nickname && isChecked.nicknameChecked}
          >
            {validMessage.nicknameMessage}
          </L.ValidationMessage>
        </L.InputWrapper>
        <L.InputWrapper>
          <L.Label>자녀 출생연도</L.Label>
          <L.Select
            name='year'
            id='year'
            value={signupForm.year}
            onChange={handleSelectChange}
            required
          >
            <option value='' disabled>
              출생연도
            </option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </L.Select>
        </L.InputWrapper>
        <L.InputWrapper>
          <L.Label>사는 지역</L.Label>
          <L.Select
            name='area'
            value={selectedArea}
            onChange={handleAreaChange}
            required
          >
            <option value='' disabled>
              지역 선택
            </option>
            {getAreaNames().map(area => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </L.Select>
          <L.Select
            name='sigungu'
            value={selectedSigungu}
            onChange={handleSigunguChange}
            required
          >
            <option value='' disabled>
              시/군/구 선택
            </option>
            {sigunguList.map(sigungu => (
              <option key={sigungu.sigungucode} value={sigungu.sigunguname}>
                {sigungu.sigunguname}
              </option>
            ))}
          </L.Select>
        </L.InputWrapper>

        <L.InputWrapper>
          <L.Label>비밀번호</L.Label>
          <L.Input
            type='password'
            name='c_password'
            id='c_password'
            value={signupForm.c_password}
            onChange={handleChange}
            placeholder='영문자, 숫자, 특수문자 포함 8~20자리'
            required
          />
          <L.ValidationMessage error={!isValid.c_password}>
            {validMessage.passwordMessage}
          </L.ValidationMessage>
          <L.Input
            type='password'
            name='checkedPassword'
            id='checkedPassword'
            placeholder='비밀번호 확인'
            value={signupForm.checkedPassword}
            onChange={handleChange}
            required
          />
          <L.ValidationMessage error={!isValid.checkedPassword}>
            {validMessage.checkedPasswordMessage}
          </L.ValidationMessage>
        </L.InputWrapper>
        <br />
        <L.SubmitButton type='submit'>회원가입 완료하기</L.SubmitButton>
        <L.TextCenter>
          이미 회원가입을 하셨나요?&nbsp;&nbsp;&nbsp;
          <L.Link href='/login'>로그인하기</L.Link>
        </L.TextCenter>
      </L.Form>
    </>
  )
}

export default RegisterForm
