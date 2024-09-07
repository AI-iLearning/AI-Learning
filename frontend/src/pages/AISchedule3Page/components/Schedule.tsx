import React from 'react'
//import { isMobile } from 'react-device-detect'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

import ScheduleItem from './ScheduleItem'
import { AISchedule } from '../../../api/schedule/getSchedule'

interface ScheduleProps {
  scheduleInfo: AISchedule[]
  moveSchedule: (dragIndex: number, hoverIndex: number) => void
}

const Schedule: React.FC<ScheduleProps> = ({ scheduleInfo, moveSchedule }) => {
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
    <DndProvider backend={backendForDND} options={backendOptions}>
      <div>
        {scheduleInfo?.map((item, index) => (
          <ScheduleItem
            key={index}
            index={index}
            item={item}
            moveSchedule={moveSchedule}
          />
        ))}
      </div>
    </DndProvider>
  )
}

export default Schedule
