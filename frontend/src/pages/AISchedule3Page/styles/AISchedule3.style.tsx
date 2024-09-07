import styled from 'styled-components'

export const ContainerTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 중앙 정렬 */
  justify-content: center;
  //position: fixed;
  width: 100%;
`

export const Container1 = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  height: 10rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 2rem;
  padding-top: 5rem;
  margin-bottom: 1rem;
  background-color: #fff;
  margin: 1rem auto;
  margin-top: -1rem;
`

export const Divider = styled.div`
  width: 90%;
  max-width: 400px;
  height: 1px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #d9d9d9;
  z-index: 1;
  margin: 0 auto;
`

export const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  height: calc(
    100vh - 14rem
  ); /* 화면 높이에서 Container1과 버튼의 높이를 제외한 값 */
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 2rem;
  padding-top: 1rem;
  overflow-y: auto;
  background-color: #fff;
  margin: -1px auto;
`

// export const Container = styled.div`
//   box-sizing: border-box;
//   width: 100%;
//   height: calc(100vh - 3rem);
//   display: flex;
//   flex-direction: column;
//   gap: 1.6rem;
//   padding: 2rem;
//   padding-top: 4rem;
//   overflow-y: auto;
// `

export const Title = styled.div`
  line-height: 1.8rem;
  margin-bottom: 1rem;
`

export const Text = styled.p`
  font-size: 1.3rem;
  font-weight: 700;
`

export const AdditionText = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
  margin-top: 0.5rem;
  line-height: 1.3rem;
  margin-bottom: 1rem;
`

export const ScheduleContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  position: relative;
  margin-bottom: 0.7rem;
`

export const DateBox = styled.p`
  background-color: #bfddff;
  width: 7rem;
  border-radius: 15px;
  padding: 0.6rem;
  padding-top: 0.9rem;
  color: #545454;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin-right: 0.5rem;
`

export const PlaceBox = styled.button`
  background-color: #f4f4f4;
  position: relative;
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 세로 정렬 */
  justify-content: flex-start;
  width: 100%;
  border-radius: 15px;
  border: none;
  padding: 0.6rem;
  color: #545454;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
`

export const CityBox = styled.p`
  background-color: #525fd4;
  border-radius: 8px;
  padding: 0.3rem;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  margin-right: 0rem; /* 오른쪽 여백 추가 */
`

export const PlaceName = styled.span`
  //flex-grow: 1; /* 남은 공간을 차지 */
  margin-left: 20px;
  color: #545454;
  justify-content: flex-start;
  font-size: 0.8rem;
  font-weight: 600;
  //width: 100px;
`

export const IconContainer = styled.span`
  color: #545454;
  justify-content: flex-start;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: auto;
`
export const BottomButton = styled.button`
  position: absolute;
  align-items: center;
  margin-top: 0px;
  padding-top: 0px;
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
