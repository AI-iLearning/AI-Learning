import styled from 'styled-components'

export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 99;
`

export const HeaderTitle = styled.h1`
  font-weight: 600;
  font-size: 20px;
  flex-grow: 1;
  text-align: center;
`

export const MonthTitle = styled.h1`
  font-weight: 600;
  font-size: 15px;
  flex-grow: 1;
  text-align: center;
  margin-bottom: 25px;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`

export const CalendarSelect = styled.select`
  border: none;
  font-weight: 800;
  font-size: 0.9rem;
`

export const CalendarWrapper = styled.div`
  flex-grow: 1;
  padding-bottom: 4rem;
  z-index: 0;
`

export const ScrollableCalendarSection = styled.div`
  align-items: center;
  height: calc(90vh - 5rem); /* BottomSection의 높이를 제외한 높이 설정 */
  overflow-y: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 2.5rem;
  padding-bottom: 2rem;
  z-index: 0; /* 달력 영역의 z-index를 낮게 설정 */
`

export const WeekSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: 1.5px solid #f1f1f1;
  z-index: 99;
`

export const HeaderText = styled.p`
  font-weight: 300;
  font-size: 0.8rem;
`

export const DaySection = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
  gap: 0; /* 그리드 간격 제거 */
  margin-top: 0.5rem;
`

export const CalendarButton = styled.button<{
  $isSunday?: boolean
  $isSaturday?: boolean
  $isSelectedDay?: boolean
  $isPast?: boolean
}>`
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: ${({ $isSelectedDay }) =>
    $isSelectedDay ? '#525FD4' : 'transparent'};
  color: ${({ $isSelectedDay, $isSunday, $isSaturday, $isPast }) =>
    $isSelectedDay
      ? 'white'
      : $isPast
        ? 'grey'
        : $isSunday
          ? '#D63535'
          : $isSaturday
            ? '#525FD4'
            : 'black'};
  clip-path: ${({ $isSelectedDay }) =>
    $isSelectedDay ? 'circle(40%)' : 'none'};
  cursor: ${({ $isPast }) => ($isPast ? 'default' : 'pointer')};
  margin: 5px;
`

export const CalendarButton2 = styled.button<{
  $isSunday?: boolean
  $isSaturday?: boolean
  $isSelectedDay?: boolean
  $isGrey?: boolean
}>`
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: ${({ $isSelectedDay }) =>
    $isSelectedDay ? '#525FD4' : 'transparent'};
  color: ${({ $isSelectedDay, $isSunday, $isSaturday, $isGrey }) =>
    $isSelectedDay
      ? 'white'
      : $isGrey
        ? 'grey'
        : $isSunday
          ? '#D63535'
          : $isSaturday
            ? '#525FD4'
            : 'black'};
  clip-path: ${({ $isSelectedDay }) =>
    $isSelectedDay ? 'circle(40%)' : 'none'};
  cursor: ${({ $isGrey }) => ($isGrey ? 'not-allowed' : 'pointer')};
  margin: 5px;
`

export const BottomSection = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  height: 5rem;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: white;
  z-index: 99;
  border-top: 1.5px solid #f1f1f1;
`

export const FixedBottomButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
  height: 46px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  color: white;
  font-weight: 600;
  background-color: #525fd4;
  cursor: pointer;
  position: relative;
`
