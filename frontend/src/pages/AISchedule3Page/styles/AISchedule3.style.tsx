import styled, { css, keyframes } from 'styled-components'

interface ScheduleContainerProps {
  isSwiped: boolean
}

const textLoop = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
  }
`

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
  max-width: 440px;
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
  max-width: 440px;
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
  max-width: 440px;
  height: calc(
    100vh - 14rem
  ); /* 화면 높이에서 Container1과 버튼의 높이를 제외한 값 */
  display: flex;
  flex-direction: column;
  //gap: 1.6rem;
  padding: 2rem;
  padding-top: 1rem;
  overflow-y: auto;
  background-color: #fff;
  margin: -1px auto;
`

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

export const ScheduleContainer = styled.div<ScheduleContainerProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  margin-bottom: 0.7rem;
  position: relative; /* 삭제 버튼을 절대 위치로 설정하기 위해 필요 */
  transform: ${({ isSwiped }) =>
    isSwiped ? 'translateX(-50px)' : 'translateX(0)'};
  transition: transform 0.3s ease;
  width: 100%; /* 가로 길이 유지 */
`
export const DateBox = styled.p`
  background-color: #bfddff;
  width: 25%;
  height: 2rem; // 높이를 명시적으로 지정
  border-radius: 15px;
  color: #545454;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 0.5rem;

  // Flexbox를 사용하여 내용을 중앙 정렬
  display: flex;
  justify-content: center;
  align-items: center;
`

export const PlaceBox = styled.button`
  background-color: #f4f4f4;
  position: relative;
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 세로 정렬 */
  justify-content: flex-start; /* 좌측 정렬 유지 */
  width: 73%;
  height: 2rem;
  border-radius: 15px;
  border: none;
  padding: 0.6rem;
  color: #545454;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left; /* 텍스트 좌측 정렬 */
`

export const CityBox = styled.div`
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: white;
  margin-right: 8px;

  // 텍스트를 한 줄로 유지하고 넘치는 부분을 처리
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  // 내용에 맞게 자동으로 크기 조절
  display: inline-block;
  min-width: 35px; // 최소 너비 설정
  max-width: 60px; // 최대 너비 설정
`
export const PlaceName = styled.span`
  flex: 1; // 남은 공간을 모두 차지
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.8rem;
  font-weight: 600;
  color: #545454;
  margin-left: 10px;
  margin-right: 10px; // 아이콘과의 간격

  &:hover {
    color: #000;
  }
`

interface FlowWrapProps {
  shouldFlow: boolean
}

export const FlowWrap = styled.div<FlowWrapProps>`
  display: inline-block;
  padding-right: ${props =>
    props.shouldFlow ? '50px' : '0'}; // 텍스트 사이의 간격
  animation: ${props =>
    props.shouldFlow
      ? css`
          ${textLoop} 10s linear infinite
        `
      : 'none'};

  &:hover {
    cursor: pointer;
    animation-play-state: paused;
  }
`

export const IconContainer = styled.span`
  color: #545454;
  justify-content: flex-start;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 10px;
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
  max-width: 440px;
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

export const DeleteButton = styled.button`
  position: absolute;
  right: 10px;
  top: 40%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* ScheduleContainer와 같은 높이로 설정 */
`

export const MinusCircleIcon = styled.div`
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23d20000' d='M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m5 11H7v-2h10z'/%3E%3C/svg%3E");
  margin-right: 8px; /* Space between icon and text */
`

export const GuideRequestButton = styled.button`
  padding: 0 0 0 5px; /* top, right, bottom, left */
  margin-top: 0px;
  background: transparent; // 배경을 투명하게 설정
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  gap: 5px;
  align-items: center;
  position: relative; // z-index 컨텍스트를 생성합니다
  z-index: 0;

  // 텍스트에만 그라데이션 적용
  background-image: linear-gradient(to right, #00c6ff, #0072ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: #41aeec;

  &:hover {
    text-decoration: none;
  }
`
export const Icon = styled.button`
  background: linear-gradient(45deg, #f3ec78, #af4261);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 24px;
  height: 24px;
  margin-right: px;
`
