import React from 'react'

import * as L from './styles/InfoBanner.style'

interface InfoBannerProps {
  text: string
  onClose: () => void
}

const InfoBanner: React.FC<InfoBannerProps> = ({ text, onClose }) => {
  return (
    <L.BannerContainer>
      <L.CloseButtonContainer>
        <L.CloseButton onClick={onClose}>X</L.CloseButton>
      </L.CloseButtonContainer>
      <L.BannerText>{text}</L.BannerText> {/* 전달받은 텍스트를 표시 */}
    </L.BannerContainer>
  )
}

export default InfoBanner
