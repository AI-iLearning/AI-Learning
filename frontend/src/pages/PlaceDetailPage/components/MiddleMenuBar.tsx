import { Icon } from '@iconify/react'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { postAddPlace } from '../../../api/place/postAddPlace'
import authToken from '../../../stores/authToken'
import * as L from '../styles/PlaceDetail.style'

// Kakao 객체를 전역에서 참조
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any
  }
}

interface MiddleMenuBarProps {
  date?: string
  isLiked: boolean
  isVisited: boolean
  onLikeToggle: () => void
  onVisitedToggle: () => void
  menuButtonWidth: number
  setMenuButtonWidth: (width: number) => void
  contentid?: string
  contenttypeid?: string
  title?: string
  firstimage?: string
  overview?: string
}

const MiddleMenuBar: React.FC<MiddleMenuBarProps> = ({
  date,
  isLiked,
  isVisited,
  onLikeToggle,
  onVisitedToggle,
  menuButtonWidth,
  setMenuButtonWidth,
  contentid,
  contenttypeid,
  title,
  firstimage,
  overview,
}) => {
  const token = authToken.getAccessToken()
  const navigate = useNavigate()
  const menubarRef = useRef<HTMLDivElement>(null)
  const realUrl = `https://ai-learning-kappa.vercel.app/place/${contenttypeid}/${contentid}` // 전달받은 contenttypeid와 contentid를 사용하여 URL 설정

  useEffect(() => {
    if (menubarRef.current) {
      const menubarWidth = menubarRef.current.offsetWidth
      setMenuButtonWidth(menubarWidth / 4)
    }
  }, [menubarRef, setMenuButtonWidth])

  // Kakao SDK 초기화
  useEffect(() => {
    const { Kakao } = window

    if (Kakao) {
      if (Kakao.isInitialized()) {
        Kakao.cleanup()
      }

      try {
        Kakao.init(process.env.REACT_APP_KAKAO_JS_SDK_KEY)
      } catch (error) {
        console.error('Kakao SDK initialization failed:', error)
      }
    }
  }, [])

  // Kakao 공유 기능 처리
  const shareKakao = () => {
    const { Kakao } = window

    if (!Kakao.isInitialized()) {
      console.error('Kakao SDK is not initialized')
      return
    }

    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title || '제목이 없습니다',
        description: overview || '설명이 없습니다',
        imageUrl: firstimage || '',
        link: {
          mobileWebUrl: realUrl,
          webUrl: realUrl,
        },
      },
      buttons: [
        {
          title: '자세히 보기',
          link: {
            mobileWebUrl: realUrl,
            webUrl: realUrl,
          },
        },
      ],
    })
  }

  const handleAddPlace = async () => {
    if (date) {
      const successResponse = await postAddPlace(token, Number(contentid), date)
      if (successResponse && successResponse.data) {
        navigate('/calendar')
      }
    } else {
      navigate(`/dateselected/${contentid}/${encodeURIComponent(title!)}`)
    }
  }

  return (
    <L.MenubarContainer ref={menubarRef}>
      <L.MenuButton
        onClick={onLikeToggle}
        isLast={false}
        style={{ width: menuButtonWidth }}
      >
        {isLiked ? (
          <>
            <Icon icon='ph:heart-fill' width='24' height='24' />
            <div>저장됨</div>
          </>
        ) : (
          <>
            <Icon icon='ph:heart-light' width='24' height='24' />
            <div>저장하기</div>
          </>
        )}
      </L.MenuButton>
      <L.MenuButton
        onClick={handleAddPlace}
        isLast={false}
        style={{ width: menuButtonWidth }}
      >
        <>
          <Icon icon='hugeicons:pin-location-03' width='24' height='24' />
          <div>장소추가</div>
        </>
      </L.MenuButton>
      <L.MenuButton
        onClick={onVisitedToggle}
        isLast={false}
        style={{ width: menuButtonWidth }}
      >
        {isVisited ? (
          <>
            <Icon
              icon='teenyicons:calendar-tick-solid'
              width='20'
              height='24'
            />
            <div>방문완료</div>
          </>
        ) : (
          <>
            <Icon
              icon='teenyicons:calendar-tick-outline'
              width='20'
              height='24'
            />
            <div>방문추가</div>
          </>
        )}
      </L.MenuButton>
      <L.MenuButton
        onClick={shareKakao}
        isLast={true}
        style={{ width: menuButtonWidth }}
      >
        <Icon icon='material-symbols:share' width='24' height='24' />
        <div>공유하기</div>
      </L.MenuButton>
    </L.MenubarContainer>
  )
}

export default MiddleMenuBar
