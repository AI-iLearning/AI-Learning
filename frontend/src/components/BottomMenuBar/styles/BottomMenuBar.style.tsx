import styled from 'styled-components'

export const MenuBar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 400px;
  height: 5rem;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`

export const MenuIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
  color: #333;

  span {
    margin-top: 4px;
    font-size: 12px;
  }

  .active & {
    color: #525fd4;
  }
`
