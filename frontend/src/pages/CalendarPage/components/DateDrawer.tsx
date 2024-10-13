import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'

import DrawerButton from './DrawerButton'
import MemoPopUp from './MemoPopUp'
import PlaceBox from './PlaceBox'
import {
  DateSchedule,
  postTimelineDay,
} from '../../../api/calendar/postTimelineDay'
import { postTimelineFix } from '../../../api/calendar/postTimelineFix'
import authToken from '../../../stores/authToken'
import { useDayScheduleStore } from '../../../stores/useDayScheduleStore'
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
  const { daySchedule, setDaySchedule } = useDayScheduleStore()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isRotated, setIsRotated] = useState<boolean>(false)
  const [isMemoPopUpOpen, setIsMemoPopUpOpen] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([])
  const [currentMemo, setCurrentMemo] = useState<string>()
  const [startY, setStartY] = useState<number | null>(null)
  const token = authToken.getAccessToken()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useQuery(['daySchedule', date], () => postTimelineDay(token, date), {
    enabled: !!token,
    select: response => response?.data,
    onSuccess: data => setDaySchedule(data),
  })

  const mutation = useMutation(
    (newSchedule: DateSchedule) => postTimelineFix(token, newSchedule),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['daySchedule', date])
      },
    },
  )

  const handleDelete = (index: number) => {
    if (daySchedule) {
      const updatedInfo = daySchedule.info.filter((_, i) => i !== index)
      const updatedSchedule = { ...daySchedule, info: updatedInfo }
      setDaySchedule(updatedSchedule)
      mutation.mutate(updatedSchedule)
    }
  }

  const handleBatchDelete = () => {
    if (daySchedule) {
      const updatedInfo = daySchedule.info.filter(
        (_, i) => !selectedIndexes.includes(i),
      )
      const updatedSchedule = { ...daySchedule, info: updatedInfo }
      setDaySchedule(updatedSchedule)
      mutation.mutate(updatedSchedule)
      setSelectedIndexes([])
    }
  }

  const toggleHeight = () => {
    setIsExpanded(prev => {
      const newState = !prev
      setIsRotated(newState)
      return newState
    })
  }

  const handleMemoAdd = () => {
    setCurrentMemo(daySchedule?.memo || '')
    setIsMemoPopUpOpen(true)
  }

  const handleMemoSave = (memo: string) => {
    if (daySchedule) {
      const updatedSchedule = { ...daySchedule, memo }
      mutation.mutate(updatedSchedule)
      setIsMemoPopUpOpen(false)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY) return

    const currentY = e.touches[0].clientY
    const diffY = startY - currentY

    if (diffY > 50 && !isExpanded) {
      setIsExpanded(true)
      setIsRotated(true)
    } else if (diffY < -50 && isExpanded) {
      setIsExpanded(false)
      setIsRotated(false)
    }
  }

  const handleTouchEnd = () => {
    setStartY(null)
  }

  const handleEditToggle = () => {
    if (isEditing) {
      if (daySchedule) {
        mutation.mutate(daySchedule)
      }
    }
    setIsEditing(prev => !prev)
    setSelectedIndexes([])
  }

  const handleToggleSelect = (index: number) => {
    setSelectedIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index],
    )
  }

  const handleClick = () => {
    navigate(`/addplace/${encodeURIComponent(date)}`)
  }

  return (
    <L.DrawerContainer
      isExpanded={isExpanded}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <DrawerButton onToggleHeight={toggleHeight} isRotated={isRotated} />
      <L.DrawerHeader>
        <L.DrawerHeaderText>{formatDate(date)}</L.DrawerHeaderText>
        <L.DrawerEditOption>
          {isEditing && selectedIndexes.length > 0 && (
            <L.DeleteText onClick={handleBatchDelete}>삭제</L.DeleteText>
          )}
          <L.DrawerHeaderEditText
            isEditing={isEditing}
            onClick={handleEditToggle}
          >
            {isEditing ? '완료' : '편집'}
          </L.DrawerHeaderEditText>
        </L.DrawerEditOption>
      </L.DrawerHeader>
      <L.DrawerCenter isExpanded={isExpanded}>
        <PlaceBox
          date={date}
          daySchedule={daySchedule}
          onDelete={handleDelete}
          onToggleSelect={handleToggleSelect}
          selectedIndexes={selectedIndexes}
          isEditing={isEditing}
        />
      </L.DrawerCenter>
      <L.DrawerBottom>
        <L.DrawerBottomBox>
          <L.DrawerBottomButton onClick={handleClick}>
            장소 추가
          </L.DrawerBottomButton>

          <L.DrawerBottomButton onClick={handleMemoAdd}>
            메모 추가
          </L.DrawerBottomButton>
        </L.DrawerBottomBox>
      </L.DrawerBottom>
      {isMemoPopUpOpen && (
        <MemoPopUp
          initialMemo={currentMemo}
          onSave={handleMemoSave}
          onClose={() => setIsMemoPopUpOpen(false)}
        />
      )}
    </L.DrawerContainer>
  )
}

export default DateDrawer
