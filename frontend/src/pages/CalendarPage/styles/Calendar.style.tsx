import styled from 'styled-components'

export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
`

export const HeaderTitle = styled.h1`
  font-weight: 600;
`

export const CalendarSelect = styled.select`
  border: none;
  background-color: white;
  color: black;
  font-weight: 800;
  font-size: 0.9rem;
`

export const AIScheduleButton = styled.button`
  height: 1.7rem;
  padding: 0 1rem;
  border: none;
  border-radius: 1rem;
  background-color: #3a3a3a;
  color: white;
  font-size: 0.7rem;
  margin-left: auto;

  &:hover {
    background-color: black;
  }
`

export const CalendarSection = styled.div`
  align-items: center;
  height: calc(100vh - 12rem);
`

export const WeekSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  padding-bottom: 0.5rem;
`

export const HeaderText = styled.p`
  font-weight: 300;
  font-size: 0.8rem;
`

export const DaySection = styled.div<{ height: number }>`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  border-top: 1px solid #f1f1f1;
  height: ${({ height }) => height}px;
  overflow: hidden;
`

export const Day = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 0.1rem 0.1rem;
  overflow: hidden;
`

export const DayText = styled.p`
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem;
  margin-bottom: 0.1rem;
`

export const PlaceSection = styled.div`
  width: 100%;
  text-align: center;
  background-color: #525fd4;
  border-radius: 4px;
  font-size: 0.5rem;
  color: white;
  padding: 0.22rem 0.3rem;
  margin-bottom: 0.1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
`
