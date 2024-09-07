import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

import BottomNav from './BottomMenuBar/BottomMenuBar'

const Container = styled.div`
  max-width: 400px;
  width: 100vw;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 100vh;
`

const Layout = () => {
  return (
    <Container>
      <Outlet />
      <BottomNav />
    </Container>
  )
}

export default Layout
