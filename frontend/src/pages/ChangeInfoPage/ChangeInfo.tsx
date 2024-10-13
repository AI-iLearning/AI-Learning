import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'

import BackButton from './BackButton/BackButton'
import * as L from './styles/ChangeInfo.style'
import { postUserUpdate } from '../../api/profile/postUserUpdate'
import { getCityAndSigunguName } from '../../datas/EditCityMapper'
import {
  getAreaNames,
  getSigunguByAreacode,
  Sigungu,
} from '../../datas/RegisterCityMapper'
import { useUser } from '../../hooks/useUser'
import authToken from '../../stores/authToken'

const ChangeInfo = () => {
  const token = authToken.getAccessToken()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: userInfo, refetch } = useUser()

  const [year, setYear] = useState<number>(0)
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 30
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i,
  )

  const [areacode, setAreacode] = useState(0)
  const [sigungucode, setSigungucode] = useState(0)
  const [selectedArea, setSelectedArea] = useState('') // 선택한 지역
  const [selectedSigungu, setSelectedSigungu] = useState('') // 선택한 시군구
  const [sigunguList, setSigunguList] = useState<Sigungu[]>([]) // 해당 지역의 시군구 목록

  useEffect(() => {
    if (userInfo) {
      setYear(userInfo.birth)
      const cityInfo = getCityAndSigunguName(
        userInfo.areacode,
        userInfo.sigungucode,
      )

      setSelectedArea(cityInfo[0])
      setSelectedSigungu(cityInfo[1])

      // 지역이 설정되었을 때, 시군구 목록도 설정
      const sigungus = getSigunguByAreacode(cityInfo[0])
      setSigunguList(sigungus)

      setAreacode(userInfo.areacode)
      setSigungucode(userInfo.sigungucode)
    }
  }, [userInfo])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setYear(Number(value))
  }

  // 지역 선택 핸들러
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAreaname = e.target.value
    setSelectedArea(selectedAreaname) // 선택한 지역을 상태로 설정
    const sigungus = getSigunguByAreacode(selectedAreaname) // 시군구 목록 가져오기
    setSigunguList(sigungus) // 해당 시군구 목록 설정

    // 시군구 선택 초기화
    setSelectedSigungu('')

    // 선택한 지역의 첫 번째 시군구를 기본값으로 설정 (필요한 경우)
    if (sigungus.length > 0) {
      setAreacode(sigungus[0].areacode)
      setSigungucode(0)
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
      setSigungucode(selectedSigungu.sigungucode)
    }
  }

  const handleComplete = async () => {
    if (userInfo) {
      const response = await postUserUpdate(
        token,
        userInfo.nickname,
        year,
        areacode,
        sigungucode,
      )
      if (response?.data) {
        await refetch()
        queryClient.invalidateQueries('user')

        navigate('/my-info')
      }
    }
  }

  return (
    <>
      <L.Container>
        <L.HeaderContainer>
          <BackButton />
          <L.HeaderText>회원정보 변경</L.HeaderText>
        </L.HeaderContainer>
        <L.InputWrapper>
          <L.Label>자녀 출생연도</L.Label>
          <L.Select
            name='year'
            id='year'
            value={year}
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
        <L.BottomButton onClick={handleComplete}>완료</L.BottomButton>
      </L.Container>
    </>
  )
}

export default ChangeInfo
