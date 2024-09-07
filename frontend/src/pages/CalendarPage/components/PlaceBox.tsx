import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import {
  DateSchedule,
  postTimelineDay,
} from '../../../api/calendar/postTimelineDay'
import authToken from '../../../stores/authToken'
import * as L from '../styles/PlaceBox.style'

interface PlaceBoxProps {
  date: string
}

const PlaceBox: React.FC<PlaceBoxProps> = ({ date }) => {
  const token = authToken.getAccessToken()
  const [daySchedule, setDaySchedule] = useState<DateSchedule>({
    memo: 'memo',
    date: date,
    distance: [191, 232],
    info: [
      {
        city: '경주',
        place: '첨성대',
        order: 0,
        pic: 'https://www.cha.go.kr/unisearch/images/national_treasure/1612759.jpg',
        lon: 0,
        lat: 0,
      },
      {
        city: '경주',
        place: '석굴암',
        order: 1,
        pic: 'https://www.heritage.go.kr/unisearch/images/national_treasure/thumb/2021042208550900.jpg',
        lon: 0,
        lat: 0,
      },
      {
        city: '경주',
        place: '동궁과 월지',
        order: 2,
        pic: 'https://www.gyeongju.go.kr/upload/content/thumb/20200317/5F92275758614941B3EB69A32A12CA4E.jpg',
        lon: 0,
        lat: 0,
      },
      {
        city: '경주',
        place: '첨성대',
        order: 3,
        pic: 'https://www.cha.go.kr/unisearch/images/national_treasure/1612759.jpg',
        lon: 0,
        lat: 0,
      },
      {
        city: '경주',
        place: '석굴암',
        order: 4,
        pic: 'https://www.heritage.go.kr/unisearch/images/national_treasure/thumb/2021042208550900.jpg',
        lon: 0,
        lat: 0,
      },
      {
        city: '경주',
        place: '동궁과 월지',
        order: 5,
        pic: 'https://www.gyeongju.go.kr/upload/content/thumb/20200317/5F92275758614941B3EB69A32A12CA4E.jpg',
        lon: 0,
        lat: 0,
      },
    ],
  })

  const fetchDaySchedule = async () => {
    if (token) {
      const successResponse = await postTimelineDay(token, date)
      if (successResponse && successResponse.data) {
        setDaySchedule(successResponse.data)
      }
    }
  }

  useEffect(() => {
    fetchDaySchedule()
  }, [token])

  return (
    <>
      <L.PlaceBoxWrapper>
        {daySchedule.info.map((item, index) => (
          <L.PlaceBoxContainer key={index}>
            <L.PlaceBoxText>
              <L.PlaceBoxTitle>{item.place}</L.PlaceBoxTitle>
              <L.PlaceBoxCity>{item.city}</L.PlaceBoxCity>
            </L.PlaceBoxText>
            <L.PlaceBoxPic alt='placePreview' src={item.pic} />
          </L.PlaceBoxContainer>
        ))}
      </L.PlaceBoxWrapper>
    </>
  )
}

PlaceBox.propTypes = {
  date: PropTypes.string.isRequired,
}

export default PlaceBox
