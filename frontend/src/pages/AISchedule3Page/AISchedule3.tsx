import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Schedule from './components/Schedule'
import * as L from './styles/AISchedule3.style'
import { getSchedule, AISchedule } from '../../api/schedule/getSchedule'
import { postEdit } from '../../api/schedule/postEdit'
import authToken from '../../stores/authToken'
import { getCityName } from '../../style/CityMapper'

const AISchedule3 = () => {
  const token = authToken.getAccessToken()
  const navigate = useNavigate()
  const [scheduleInfo, setScheduleInfo] = useState<AISchedule[]>([])

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await getSchedule(token)
      if (response && response.data) {
        const updatedSchedule = response.data.map(item => ({
          ...item,
          city: getCityName(item.areacode, item.sigungucode), // city 값을 설정
        }))
        setScheduleInfo(updatedSchedule)
      } else {
        console.error('Failed to fetch schedule data.')
      }
    }

    fetchSchedule()
  }, [token])

  // 드래그 앤 드롭을 통해 장소만 교환하는 함수
  const moveSchedule = (dragIndex: number, hoverIndex: number) => {
    const updatedSchedule = [...scheduleInfo]

    // 드래그된 항목과 드롭된 위치의 항목의 장소를 교환
    const temp = updatedSchedule[dragIndex].place
    updatedSchedule[dragIndex].place = updatedSchedule[hoverIndex].place
    updatedSchedule[hoverIndex].place = temp

    // 도시(city)도 함께 교환
    const tempCity = updatedSchedule[dragIndex].city
    updatedSchedule[dragIndex].city = updatedSchedule[hoverIndex].city
    updatedSchedule[hoverIndex].city = tempCity

    setScheduleInfo(updatedSchedule)
    console.log('바뀐 일정들', updatedSchedule)
  }

  const handleDelete = (index: number) => {
    const newSchedule = [...scheduleInfo]
    newSchedule.splice(index, 1)
    setScheduleInfo(newSchedule)
  }

  const handleComplete = () => {
    const token = authToken.getAccessToken()

    postEdit(token, scheduleInfo)
      .then(response => {
        if (response && response.data.message === 'Upload success') {
          navigate('/calendar')
        } else {
          console.error('Failed to upload edits.')
        }
      })
      .catch(error => {
        console.error('Error during upload:', error)
      })

    navigate('/calendar')
  }

  return (
    <>
      <L.ContainerTotal>
        <L.Container1>
          <L.Title>
            <L.Text>완성된 플랜이에요!</L.Text>
            <L.Text>전체 일정을 확인해보세요!</L.Text>
            <L.AdditionText>
              수정을 원하는 일정을 움직여 변경할 수 있습니다
            </L.AdditionText>
          </L.Title>
        </L.Container1>
        <L.Divider />
        <L.Container>
          <Schedule
            scheduleInfo={scheduleInfo}
            moveSchedule={moveSchedule}
            handleDelete={handleDelete}
          />
          <L.GuideRequestButton>
            <Icon icon='fluent:people-chat-16-filled' width='20' height='20' />
            해당 일정으로 가이드탭에서 가이드를 구할 수 있어요!
          </L.GuideRequestButton>
        </L.Container>
      </L.ContainerTotal>
      <L.BottomButton onClick={handleComplete}>완료</L.BottomButton>
    </>
  )
}

export default AISchedule3
