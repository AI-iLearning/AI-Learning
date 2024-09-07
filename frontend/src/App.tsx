import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import BottomMenuBar from './components/BottomMenuBar/BottomMenuBar'
import GlobalStyle from './style/GlobalStyle'
import { MobileContainer } from './style/MobileStyle'
import setScreenHeight from './utils/mobileScreenSize/setScreenHeight'

const App = () => {
  const location = useLocation()

  useEffect(() => {
    setScreenHeight()
    window.addEventListener('resize', setScreenHeight)
    return () => window.removeEventListener('resize', setScreenHeight)
  }, [])

  const showBottomMenuBar = [
    '/calendar',
    '/profile',
    '/recommend-place',
    '/ranking-place',
  ].includes(location.pathname)

  return (
    <>
      <GlobalStyle />
      <MobileContainer>
        <Outlet />
        {showBottomMenuBar && <BottomMenuBar />}
      </MobileContainer>
    </>
  )
}

export default App
