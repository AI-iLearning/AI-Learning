import styled from 'styled-components'

export const Button = styled.button`
  color: black;
  background-color: #f0f0f0;
  border: none;
  padding: 9px 20px;
  margin: 5px;
  border-radius: 20px;
  cursor: pointer;

  &.selected {
    background-color: #525fd4;
    color: white;
  }
`
export const DateInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px;
`
export const DateInput = styled.input.attrs({ type: 'date' })`
  color: black;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px;
  font-size: 14px;
  background-color: #fafafa;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(38, 143, 255, 0.25);
    outline: none;
  }

  &::-webkit-calendar-picker-indicator {
    display: none;
  }
`

export const Separator = styled.span`
  font-size: 1.2rem;
  color: #333;
  margin-right: 10px;
  margin-left: 10px;
`

export const Section = styled.div`
  margin: 10px 0;
`

export const Label = styled.label`
  color: black;
  display: block;
  margin-bottom: 5px;
  font-size: 1.1rem;
  font-weight: 700;
`

export const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 3rem);
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 2rem;
  padding-top: 4rem;
  overflow-y: auto;
`

export const Title = styled.div`
  color: black;
  line-height: 2rem;
  margin-bottom: 1rem;
`

export const Text = styled.p`
  font-size: 1.3rem;
  font-weight: 700;
`

export const Highlighted = styled.span`
  background-color: rgb(82, 95, 212, 0.3);
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
export const SelectContainer = styled.div`
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: flex-start; /* 수평 왼쪽 정렬 */
  gap: 10px; /* 요소 간의 간격 */
  margin-top: 11px;
`

export const Select = styled.select`
  padding: 8px 16px;
  padding-right: 32px; /* 글자와 화살표 사이의 간격을 늘리기 위해 추가 */
  margin-right: 10px;
  border: none;
  border-bottom: 2px solid black;
  background-color: transparent;
  font-size: 14px;
  color: black;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position-x: calc(100% - 8px); /* 화살표 위치 조정 */
  background-position-y: 50%;

  &:focus {
    outline: none;
    //border-bottom: 2px solid #007bff;
  }
`

export const RepeatText = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
`
export const ChangeScheduleButton = styled.button`
  display: block;
  width: 100%;
  margin-top: 15px;
  padding: 8px 20px;
  background-color: #eff1ff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-align: center;
  &:hover {
    background-color: #e0e0e0;
  }
`
