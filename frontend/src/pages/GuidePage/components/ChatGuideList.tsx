import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getSelect } from '../../../api/guide/getSelect'
import authToken from '../../../stores/authToken'
import { guideData } from '../datas/GuideList'
import * as L from '../styles/GuideBox.style'

interface ChatGuide {
  guideId: number
  chat: string[]
}

const ChatGuideList = () => {
  const [chatGuides, setChatGuides] = useState<ChatGuide[]>([])
  const [selectedGuide, setSelectedGuide] = useState<number | null>(1) // 기본 선택 가이드
  const token = authToken.getAccessToken()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChatGuides = async () => {
      if (!token) return

      const response = await getSelect(token)
      if (response && response.data) {
        setChatGuides(response.data)
      }
    }

    fetchChatGuides()
  }, [token])

  const handleGuideClick = (guideId: number) => {
    if (selectedGuide === guideId) {
      // 이미 선택된 상태에서 한 번 더 클릭하면 채팅창으로 이동
      navigate(`/chat/${guideId}/${guideData[guideId].name}`)
    } else {
      // 선택되지 않은 상태에서 클릭하면 해당 가이드를 선택
      setSelectedGuide(guideId)
    }
  }

  if (!chatGuides.length)
    return <L.OverviewText>채팅한 가이드가 없습니다.</L.OverviewText>

  return (
    <L.ScrollableContainer>
      {chatGuides.map(guide => (
        <L.PlaceBoxWrapper
          key={guide.guideId}
          onClick={() => handleGuideClick(guide.guideId)}
          style={{
            backgroundColor:
              selectedGuide === guide.guideId ? '#f0f0f0' : 'white',
          }}
        >
          <L.PlaceBoxText>
            <L.PlaceBoxTitle>
              {guideData[guide.guideId]?.name || 'Unknown Guide'}
            </L.PlaceBoxTitle>
            <L.PlaceBoxIntro>
              {guide.chat[guide.chat.length - 1]}
            </L.PlaceBoxIntro>
          </L.PlaceBoxText>
        </L.PlaceBoxWrapper>
      ))}
    </L.ScrollableContainer>
  )
}

export default ChatGuideList
