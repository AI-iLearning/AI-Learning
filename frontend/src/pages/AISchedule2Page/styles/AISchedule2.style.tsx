import styled from 'styled-components'

export const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 5rem); /* BackButton 높이만큼 빼기 */
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 2rem;
  padding-top: 6rem; /* BackButton 높이만큼 추가 */
`

export const Title = styled.div`
  line-height: 2rem;
  margin-bottom: 2rem;
`

export const Text = styled.p`
  font-size: 1.3rem;
  font-weight: 700;
`

export const Highlighted = styled.span`
  background-color: rgb(82, 95, 212, 0.3);
`

export const InputBox = styled.textarea`
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  height: 200px;
  border: none;
  border-radius: 10px;
  background-color: #f4f4f4;
  box-sizing: border-box;
  overflow: auto;
  font-size: 0.9rem;
  text-align: left;
  line-height: 1.5;
`

export const BottomButton = styled.button`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 3rem);
  max-width: 352px;
  height: 46px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  color: white;
  font-weight: 600;
  background-color: #525fd4;
  cursor: pointer;
  box-sizing: border-box;
  &:hover {
    background-color: #434cb1;
  }
`
