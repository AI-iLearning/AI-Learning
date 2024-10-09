import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { MenuBar, MenuIcon } from './styles/BottomMenuBar.style'
import { useMenuStore } from '../../stores/useBottomMenuStore'

const icons = [
  {
    icon: 'heroicons-solid:calendar',
    path: '/calendar',
    alt: '캘린더',
    label: '캘린더',
  },
  {
    icon: 'majesticons:map-marker-area',
    path: '/recommend-place',
    alt: '장소추천',
    label: '장소추천',
  },
  {
    icon: 'icon-park-solid:five-star-badge',
    path: '/ranking-place',
    alt: '러닝픽',
    label: '러닝픽',
  },

  {
    icon: 'fluent:people-chat-16-filled',
    path: '/guide',
    alt: '가이드',
    label: '가이드',
  },
  {
    icon: 'heroicons-solid:user',
    path: '/profile',
    alt: '프로필',
    label: '프로필',
  },
]

const BottomNav: React.FC = () => {
  const location = useLocation()
  const setCurrentMenu = useMenuStore(state => state.setCurrentMenu)

  useEffect(() => {
    setCurrentMenu(location.pathname)
  }, [location.pathname, setCurrentMenu])

  return (
    <MenuBar>
      {icons.map((icon, index) => (
        <NavLink
          key={index}
          to={icon.path}
          className={({ isActive }) => (isActive ? 'active' : '')}
          end
        >
          <MenuIcon className='menu-icon'>
            <Icon
              icon={icon.icon}
              style={{ fontSize: '20px', color: 'currentColor' }}
            />
            <span>{icon.label}</span>
          </MenuIcon>
        </NavLink>
      ))}
    </MenuBar>
  )
}

export default BottomNav
