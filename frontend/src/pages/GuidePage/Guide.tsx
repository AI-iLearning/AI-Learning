import { Icon } from '@iconify/react'
import React, { useState } from 'react'

import ChatGuideList from './components/ChatGuideList'
import GuideBox from './components/GuideBox'
import * as L from './styles/Guide.style'
import { getPattern } from '../../api/profile/getPattern'
import { useUser } from '../../hooks/useUser'
import authToken from '../../stores/authToken'

const Guide: React.FC = () => {
  const token = authToken.getAccessToken()
  const { data: userInfo } = useUser()
  const [activeTab, setActiveTab] = useState(0)

  const handleAPITest = async () => {
    if (token) {
      const successResponse = await getPattern(token)
      console.log(successResponse)
    }
  }

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <L.AppContainer>
      <L.Title>
        <h1>
          <L.Nickname onClick={handleAPITest}>{userInfo?.nickname}</L.Nickname>
          님 일정에 어울리는
          <br />
          가이드 분들이에요!
        </h1>
      </L.Title>

      <L.TabMenu>
        <L.Tab onClick={() => handleTabClick(0)} active={activeTab === 0}>
          <Icon icon='fluent:people-chat-16-filled' width='24' height='24' />
        </L.Tab>
        <L.Tab onClick={() => handleTabClick(1)} active={activeTab === 1}>
          <Icon icon='basil:chat-solid' width='24' height='24' />
        </L.Tab>
      </L.TabMenu>

      {activeTab === 0 ? <GuideBox /> : <ChatGuideList />}
    </L.AppContainer>
  )
}

export default Guide
