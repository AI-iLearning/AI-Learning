import PropTypes from 'prop-types'
import { useState } from 'react'

import DrawerButton from './DrawerButton'
import PlaceBox from './PlaceBox'
import * as L from '../styles/DateDrawer.style'

interface DateDrawerProps {
  date: string
}

const formatDate = (dateString: string): string => {
  const strWeak = ['일', '월', '화', '수', '목', '금', '토']
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDay = strWeak[date.getDay()]
  return `${month}.${day} / ${weekDay}`
}

const DateDrawer: React.FC<DateDrawerProps> = ({ date }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleHeight = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <L.DrawerContainer isExpanded={isExpanded}>
        <DrawerButton onToggleHeight={toggleHeight} />
        <L.DrawerHeader>
          <L.DrawerHeaderText>{formatDate(date)}</L.DrawerHeaderText>
          <L.DrawerHeaderEditText>편집</L.DrawerHeaderEditText>
        </L.DrawerHeader>
        <L.DrawerCenter isExpanded={isExpanded}>
          <PlaceBox date={date} />
        </L.DrawerCenter>
        <L.DrawerBottom>
          <L.DrawerBottomBox>
            <L.DrawerBottomButton>장소 추가</L.DrawerBottomButton>
            <L.DrawerBottomButton>메모 추가</L.DrawerBottomButton>
          </L.DrawerBottomBox>
        </L.DrawerBottom>
      </L.DrawerContainer>
    </>
  )
}

DateDrawer.propTypes = {
  date: PropTypes.string.isRequired,
}

export default DateDrawer
