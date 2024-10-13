/* eslint-disable react-hooks/rules-of-hooks */
import { Icon } from '@iconify/react'
import heartIcon from '@iconify-icons/tabler/heart-filled'
import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import AccomodationList from './components/AccomodationList'
import ChatDrawer from './components/ChatDrawer/ChatDrawer'
import ContentType12 from './components/ContentType/ContentType12'
import ContentType14 from './components/ContentType/ContentType14'
import ContentType15 from './components/ContentType/ContentType15'
import MiddleMenuBar from './components/MiddleMenuBar'
import PlaceMap from './components/PlaceMap'
import RestaurantList from './components/RestaurantList'
import StudyPlan from './components/StudyPlan/StudyPlan'
import * as L from './styles/PlaceDetail.style'
import { postAddVisited } from '../../api/calendar/postAddVisited'
import { postLike } from '../../api/calendar/postLike'
import { postPlaceLike } from '../../api/calendar/postPlaceLike'
import BackButton from '../../components/BackButton/BackButton'
import useLikeList from '../../hooks/useLikeList'
import useLockBodyScroll from '../../hooks/useLockBodyScroll'
import { useUser } from '../../hooks/useUser'
import useVisitedList from '../../hooks/useVisitedList'
import authToken from '../../stores/authToken'
import { getCityName } from '../../style/CityMapper'

interface PlaceDetail {
  title: string
  addr1: string
  addr2: string
  areacode: number
  sigungucode: number
  firstimage: string
  firstimage2: string
  mapx: number
  mapy: number
  homepage: string
  overview: string
}

const PlaceDetail = () => {
  const token = authToken.getAccessToken()
  const location = useLocation()
  const navigate = useNavigate()
  const { date, firstimage } = location.state || {}
  const { contentid } = useParams<{ contentid: string }>()
  const { contenttypeid } = useParams<{ contenttypeid: string }>()
  const [placeDetail, setPlaceDetail] = useState<PlaceDetail | null>(null)
  const [likeInfo, setLikeInfo] = useState<number>(0)
  const { likeList, refetch: refetchLikeList } = useLikeList()
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const { refetch: refetchUser } = useUser()
  const { visitedList, refetch: refetchVisitedList } = useVisitedList()
  const [isVisited, setIsVisited] = useState<boolean>(false)
  const [showMap, setShowMap] = useState<boolean>(false)
  const imageContainerRef = useRef<HTMLDivElement | null>(null)
  const [imageHeight, setImageHeight] = useState<number>(200)
  const [city, setCity] = useState<string>('')
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const menubarRef = useRef<HTMLDivElement>(null)
  const [menuButtonWidth, setMenuButtonWidth] = useState<number>(0)

  useLockBodyScroll(drawerOpen)

  useEffect(() => {
    if (menubarRef.current) {
      const menubarWidth = menubarRef.current.offsetWidth
      setMenuButtonWidth(menubarWidth / 4)
    }
  }, [menubarRef])

  useEffect(() => {
    fetchCommonPlaceInfo()
    fetchPlaceLikeTotal()
  }, [token, contentid])

  useEffect(() => {
    if (imageContainerRef.current) {
      const imageElement = imageContainerRef.current.querySelector('img')
      if (imageElement) {
        setImageHeight(imageElement.clientHeight)
      }
    }
  }, [firstimage])

  useEffect(() => {
    if (likeList && contentid) {
      const liked = likeList.some(
        place => place.contentid.toString() === contentid,
      )
      setIsLiked(liked)
    }
  }, [likeList, contentid])

  useEffect(() => {
    if (visitedList && contentid) {
      const visited = visitedList.some(
        place => place.contentid.toString() === contentid,
      )
      setIsVisited(visited)
    }
  }, [visitedList, contentid])

  // placeDetail이 업데이트될 때 city 설정
  useEffect(() => {
    if (placeDetail) {
      const cityName = getCityName(
        placeDetail.areacode,
        placeDetail.sigungucode,
      )
      setCity(cityName)
    }
  }, [placeDetail])

  const fetchCommonPlaceInfo = async () => {
    if (!contentid) return

    try {
      const myServiceKey = process.env.REACT_APP_TOURISM_SERVICE_KEY
      const response = await fetch(
        `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${myServiceKey}&MobileOS=ETC&MobileOS=ETC&MobileApp=AILearning&_type=json&contentId=${contentid}&contentTypeId=${contenttypeid}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=N&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1`,
      )
      const data = await response.json()
      if (data.response.body.items.item[0]) {
        const item = data.response.body.items.item[0]
        setPlaceDetail(item)
      }
    } catch (error) {
      console.error('Failed to fetch place details:', error)
    }
  }

  const fetchPlaceLikeTotal = async () => {
    if (!token || !contentid) return

    const successResponse = await postPlaceLike(token, Number(contentid))
    if (successResponse && successResponse.data) {
      setLikeInfo(successResponse.data.like)
    }
  }

  const handleLikeToggle = async () => {
    if (!token || !contentid) {
      navigate('/')
      return
    }

    try {
      await postLike(token, Number(contentid))
      await refetchLikeList()
      setIsLiked(!isLiked)
      fetchPlaceLikeTotal()
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleVistedCheckButton = async () => {
    if (!token || !contentid) {
      navigate('/')
      return
    }

    try {
      if (!isVisited) {
        await postAddVisited(token, Number(contentid))
        await refetchVisitedList()
        await refetchUser()
        setIsVisited(!isVisited)
      }
    } catch (error) {
      console.error('Error toggling visited:', error)
    }
  }

  const handleMapToggle = () => {
    setShowMap(prevState => !prevState)
  }

  const handleChatButtonClick = () => {
    setDrawerOpen(!drawerOpen)
  }

  const getContentTypeText = (contenttypeid: number) => {
    switch (contenttypeid) {
      case 12:
        return '관광지'
      case 14:
        return '문화시설'
      case 15:
        return '축제공연행사'
      default:
        return '기타'
    }
  }

  return (
    <>
      <L.Container>
        <L.HeaderContainer>
          <BackButton />
          <L.MapButton>
            {firstimage && (
              <>
                {showMap ? (
                  <Icon
                    icon='system-uicons:picture'
                    width='28'
                    height='28'
                    onClick={handleMapToggle}
                  />
                ) : (
                  <Icon
                    icon='material-symbols-light:map-outline'
                    width='28'
                    height='28'
                    onClick={handleMapToggle}
                  />
                )}
              </>
            )}
          </L.MapButton>
        </L.HeaderContainer>
        <L.Title>
          <L.Text>{placeDetail?.title || ''}</L.Text>
          <L.LikeContatiner>
            <Icon
              icon={heartIcon}
              style={{ fontSize: '16px', color: 'red', paddingTop: '3px' }}
            />
            <L.SmText>{likeInfo || 0}</L.SmText>
          </L.LikeContatiner>
        </L.Title>
        <L.Title>
          <Icon
            icon='icons-majesticons:map-marker'
            width='18'
            height='18'
            style={{ color: '#BCBCBC' }}
          />
          <L.LocationText>
            {city},&nbsp;
            {getContentTypeText(Number(contenttypeid))}
          </L.LocationText>
        </L.Title>
        {showMap ? (
          <PlaceMap
            mapx={placeDetail?.mapx || 0}
            mapy={placeDetail?.mapy || 0}
            height={imageHeight}
          />
        ) : firstimage && placeDetail ? (
          <L.ImageContainer ref={imageContainerRef}>
            <L.PlaceImage src={firstimage} alt={placeDetail.title} />
          </L.ImageContainer>
        ) : (
          <PlaceMap
            mapx={placeDetail?.mapx || 0}
            mapy={placeDetail?.mapy || 0}
            height={imageHeight}
          />
        )}
        <MiddleMenuBar
          date={date}
          isLiked={isLiked}
          isVisited={isVisited}
          onLikeToggle={handleLikeToggle}
          onVisitedToggle={handleVistedCheckButton}
          menuButtonWidth={menuButtonWidth}
          setMenuButtonWidth={setMenuButtonWidth}
          contentid={contentid}
          contenttypeid={contenttypeid}
          title={placeDetail?.title}
          firstimage={placeDetail?.firstimage}
          overview={placeDetail?.overview}
        />
        <L.OverviewContainer>
          {placeDetail?.homepage && (
            <>
              <L.HomepageTitle>홈페이지</L.HomepageTitle>
              <L.HomepageLink
                dangerouslySetInnerHTML={{ __html: placeDetail.homepage }}
              />
              <br></br>
            </>
          )}
          {placeDetail?.overview && (
            <L.OverviewText>{placeDetail.overview}</L.OverviewText>
          )}
          {Number(contenttypeid) === 12 && (
            <ContentType12 contentid={contentid!} />
          )}
          {Number(contenttypeid) === 14 && (
            <ContentType14 contentid={contentid!} />
          )}
          {Number(contenttypeid) === 15 && (
            <ContentType15 contentid={contentid!} />
          )}
          {placeDetail && (
            <>
              <StudyPlan
                title={placeDetail.title}
                overview={placeDetail.overview}
              />
              <AccomodationList
                areacode={placeDetail.areacode!}
                sigungucode={placeDetail.sigungucode!}
              />
              <RestaurantList
                areacode={placeDetail.areacode!}
                sigungucode={placeDetail.sigungucode!}
              />
            </>
          )}
          <br></br>
        </L.OverviewContainer>
        <L.ChatButton onClick={handleChatButtonClick}>
          <Icon
            icon='fluent:chat-12-filled'
            width='32'
            height='32'
            style={{ color: '#F8F8F8' }}
          />
          <br></br>
          장소 Q&A
        </L.ChatButton>
      </L.Container>
      {drawerOpen && (
        <ChatDrawer
          contentid={contentid!}
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          overview={placeDetail?.overview!}
          isopen={drawerOpen}
          onclose={handleChatButtonClick}
        />
      )}
    </>
  )
}

export default PlaceDetail
