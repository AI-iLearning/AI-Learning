import calendarIcon from '@iconify/icons-heroicons/calendar-solid'
import profileIcon from '@iconify/icons-heroicons/user-20-solid'
import rankingIcon from '@iconify/icons-icon-park-solid/five-star-badge'
import recommendationIcon from '@iconify/icons-majesticons/map-marker-area'
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { MenuBar, MenuIcon } from './styles/BottomMenuBar.style'
import { useMenuStore } from '../../stores/useBottomMenuStore'

const icons = [
  {
    icon: calendarIcon,
    path: '/calendar',
    alt: '캘린더',
    label: '캘린더',
  },
  {
    icon: recommendationIcon,
    path: '/recommend-place',
    alt: '장소추천',
    label: '장소추천',
  },
  {
    icon: rankingIcon,
    path: '/ranking-place',
    alt: '순위',
    label: '순위',
  },
  {
    icon: profileIcon,
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
