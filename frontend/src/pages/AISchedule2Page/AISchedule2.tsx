import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as L from './styles/AISchedule2.style'
import { makeSchedule } from '../../api/schedule/postMakeSchedule'
import Loading from '../../components/Loading/Loading'
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

  const handleSubmitAIInput = async () => {
    console.log('Received Schedule State from Zustand:', {
      startDate,
      endDate,
      dates,
      location,
      travelStyle,
      description,
    })
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
        setLoading(false)
        navigate('/ai-schedule-step3')
      } else {
        // Handle error and stop loading
        setLoading(false)
        // You can add an error message or alert here
      }
    }
  }

  return (
    <>
      <BackButton />
      {loading ? ( // Display loading indicator if loading is true
        <Loading />
      ) : (
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
      )}
      {!loading && ( // Only show the button when not loading
        <L.BottomButton onClick={handleSubmitAIInput}>완료</L.BottomButton>
      )}
    </>
  )
}

export default AISchedule2
