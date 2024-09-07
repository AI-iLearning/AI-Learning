import { Icon } from '@iconify/react'
import menuIcon from '@iconify-icons/tabler/menu'
import React from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { AISchedule } from '../../../api/schedule/getSchedule'
import { cityColors } from '../../../style/CityColor'
import { monthColors } from '../../../style/MonthColor'
import * as L from '../styles/AISchedule3.style'

// 드래그 앤 드롭을 위한 항목 타입 정의
const ItemType = 'SCHEDULE_ITEM'

interface ScheduleItemProps {
  item: AISchedule
  index: number
  moveSchedule: (dragIndex: number, hoverIndex: number) => void
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  item,
  index,
  moveSchedule,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: ItemType,
    hover(draggedItem: { index: number }) {
      if (draggedItem.index !== index) {
        moveSchedule(draggedItem.index, index)
        draggedItem.index = index
      }
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  const cityBackgroundColor = cityColors[item.city]
  const date = new Date(item.date)
  const month = date.getMonth() + 1
  const monthBackgroundColor = monthColors[month]

  return (
    <L.ScheduleContainer key={index}>
      <L.DateBox style={{ backgroundColor: monthBackgroundColor }}>
        {`${month}월 ${date.getDate()}일`}
      </L.DateBox>
      <L.PlaceBox style={{ opacity: isDragging ? 0.5 : 1 }}>
        <L.CityBox style={{ backgroundColor: cityBackgroundColor }}>
          {item.city}
        </L.CityBox>
        <L.PlaceName>{item.place}</L.PlaceName>
        <L.IconContainer>
          <div ref={ref} style={{ display: 'inline-block', cursor: 'move' }}>
            <Icon icon={menuIcon} width='18' height='18' />
          </div>
        </L.IconContainer>
      </L.PlaceBox>
    </L.ScheduleContainer>
  )
}

export default ScheduleItem
