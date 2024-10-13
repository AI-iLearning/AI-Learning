import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

import PlaceBoxItem from './PlaceBoxItem'
import { DateSchedule } from '../../../api/calendar/postTimelineDay'
import { useDayScheduleStore } from '../../../stores/useDayScheduleStore'
import * as L from '../styles/PlaceBox.style'

interface PlaceBoxProps {
  date: string
  daySchedule: DateSchedule | undefined
  onDelete: (index: number) => void
  isEditing: boolean
  onToggleSelect: (index: number) => void
  selectedIndexes: number[]
}

const PlaceBox: React.FC<PlaceBoxProps> = ({
  date,
  isEditing,
  onDelete,
  onToggleSelect,
  selectedIndexes,
}) => {
  const { daySchedule, updateInfo } = useDayScheduleStore()
  const [isSliding, setIsSliding] = useState<number | null>(null)
  const [startX, setStartX] = useState<number | null>(null)

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    if (!daySchedule) return

    const updatedInfo = [...daySchedule.info]
    const [removed] = updatedInfo.splice(dragIndex, 1)
    updatedInfo.splice(hoverIndex, 0, removed)

    // 각 아이템의 order 값을 인덱스에 맞게 재설정
    updatedInfo.forEach((item, index) => {
      item.order = index
    })

    updateInfo(updatedInfo)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent, index: number) => {
    if (!startX) return

    const currentX = e.touches[0].clientX
    const diffX = startX - currentX

    if (diffX > 50) {
      setIsSliding(index)
    } else if (diffX < -50) {
      setIsSliding(null)
    }
  }

  const handleTouchEnd = () => {
    setStartX(null)
  }

  const handleDelete = (index: number) => {
    onDelete(index)
    setIsSliding(null)
  }

  const handleToggleSelect = (index: number) => {
    onToggleSelect(index)
  }

  // 모바일 장치에서는 TouchBackend를, 그렇지 않으면 HTML5Backend를 사용
  const isMobile = () => {
    const ua = navigator.userAgent
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        ua,
      ) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
    )
  }

  // Backend 선택
  const backendForDND = isMobile() ? TouchBackend : HTML5Backend

  // Backend 옵션
  const backendOptions = {
    enableMouseEvents: true,
    delay: 50,
    delayTouchStart: 100,
  }

  return (
    <L.PlaceBoxWrapper>
      <L.VerticalLine />
      <DndProvider backend={backendForDND} options={backendOptions}>
        {daySchedule?.info.map((item, index) => (
          <PlaceBoxItem
            key={index}
            item={item}
            index={index}
            totalItems={daySchedule.info.length}
            moveCard={moveCard}
            isEditing={isEditing}
            isSliding={isSliding}
            setIsSliding={setIsSliding}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
            handleToggleSelect={handleToggleSelect}
            selectedIndexes={selectedIndexes}
            onDelete={handleDelete}
            date={date}
            distance={daySchedule.distance}
          />
        ))}
      </DndProvider>
    </L.PlaceBoxWrapper>
  )
}

PlaceBox.propTypes = {
  date: PropTypes.string.isRequired,
  daySchedule: PropTypes.shape({
    memo: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    distance: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    info: PropTypes.arrayOf(
      PropTypes.shape({
        contentid: PropTypes.number.isRequired,
        contenttypeid: PropTypes.number.isRequired,
        areacode: PropTypes.number.isRequired,
        sigungucode: PropTypes.number.isRequired,
        place: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
        firstimage: PropTypes.string.isRequired,
        mapx: PropTypes.number.isRequired,
        mapy: PropTypes.number.isRequired,
      }).isRequired,
    ).isRequired,
  }),
  onDelete: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  selectedIndexes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
}

export default PlaceBox
