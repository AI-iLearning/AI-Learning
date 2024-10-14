import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as L from './styles/AISchedule2.style'
import { makeSchedule } from '../../api/schedule/postMakeSchedule'
import TimerLoading from '../../components/TimerLoading/TimerLoading'
import authToken from '../../stores/authToken'
import { useScheduleStore } from '../../stores/useScheduleStore'
import BackButton from '../AISchedule1Page/components/BackButton/BackButton'

const AISchedule2 = () => {
  const token = authToken.getAccessToken()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { startDate, endDate, dates, location, travelStyle } =
    useScheduleStore()
  const { description, setDescription } = useScheduleStore(state => ({
    description: state.description,
    setDescription: state.setDescription,
  }))
  const [responseReceived, setResponseReceived] = useState(false) // 응답 여부 상태 추가

  const handleSubmitAIInput = async () => {
    setLoading(true)

    if (token && startDate && endDate) {
      const duration = [startDate, endDate]
      const successResponse = await makeSchedule(
        token,
        duration,
        dates,
        description,
        location,
        travelStyle,
      )

      if (successResponse && successResponse.data) {
        setResponseReceived(true) // 응답이 도착했음을 설정
        setLoading(false)
        navigate('/ai-schedule-step3')
      } else {
        setLoading(false)
      }
    }
  }

  return (
    <>
      {loading ? (
        <TimerLoading responseReceived={responseReceived} /> // 응답 여부를 TimerLoading에 전달
      ) : (
        <>
          <BackButton />
          <L.Container>
            <L.Title>
              <L.Text>거의 다 왔어요!</L.Text>
              <L.Text>
                <L.Highlighted>여행 플랜에 반영할 의견</L.Highlighted>을
              </L.Text>
              <L.Text>자유롭게 남겨주세요 :{')'}</L.Text>
            </L.Title>
            <L.InputBox
              name='ai-Input2'
              id='ai-Input2'
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={300}
              placeholder='예시) 4, 5월엔 멀리 이동이 어려울 거 같아, 서울 내 장소로만 추천해주세요!'
            />
          </L.Container>
        </>
      )}
      {!loading && (
        <L.BottomButton onClick={handleSubmitAIInput}>완료</L.BottomButton>
      )}
    </>
  )
}

export default AISchedule2
