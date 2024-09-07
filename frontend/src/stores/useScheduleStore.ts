import create from 'zustand'

const getCurrentDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export const getFutureDate = (days: number): string => {
  const today = new Date()
  today.setDate(today.getDate() + days)
  return today.toISOString().split('T')[0]
}

export const calculateEndDate = (startDate: string, days: number): string => {
  const date = new Date(startDate)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

const getDayIndex = (day: string): number => {
  const dateFormatter = new Intl.DateTimeFormat('ko', { weekday: 'long' })
  for (let i = 0; i < 7; i++) {
    const testDate = new Date(1970, 0, 4 + i) // 1970-01-04 is a Sunday
    if (dateFormatter.format(testDate) === day) {
      return i
    }
  }
  throw new Error(`Invalid day: ${day}`)
}

const getDatesArray = (
  startDate: string,
  endDate: string,
  frequency: string,
  dayOfWeek: string,
): string[] => {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (frequency === '직접 커스튬하기') {
    return dates // 빈 배열 반환
  }

  const targetDay = getDayIndex(dayOfWeek)
  const current = new Date(start)

  // Adjust the start date to the first occurrence of the target dayOfWeek
  if (frequency !== '매일') {
    while (current.getDay() !== targetDay) {
      current.setDate(current.getDate() + 1)
    }
  }

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    switch (frequency) {
      case '매주':
        current.setDate(current.getDate() + 7)
        break
      case '격주':
        current.setDate(current.getDate() + 14)
        break
      case '매일':
        current.setDate(current.getDate() + 1)
        break
      default:
        break
    }
  }

  return dates
}

interface ScheduleState {
  startDate: string | null
  endDate: string | null
  dates: string[]
  location: string[]
  travelStyle: string[]
  description: string
  frequency: string
  dayOfWeek: string
  isScheduleConfirmed: boolean
  setStartDate: (date: string) => void
  setEndDate: (date: string) => void
  setDates: (newDates: string[]) => void
  setIsScheduleConfirmed: () => void
  updateDates: () => void // 빈도에 따라 날짜 배열을 업데이트하는 함수
  setFrequency: (frequency: string) => void
  setDayOfWeek: (dayOfWeek: string) => void
  setLocation: (location: string[]) => void
  toggleLocation: (location: string) => void
  setTravelStyle: (style: string[]) => void
  setDescription: (description: string) => void
}

export const useScheduleStore = create<ScheduleState>(set => ({
  startDate: getCurrentDate(),
  endDate: getFutureDate(29),
  dates: [],
  location: [],
  travelStyle: [],
  description: '',
  frequency: '매주', // 초기 빈도 설정
  dayOfWeek: '토요일',
  isScheduleConfirmed: false,
  setStartDate: date =>
    set(() => {
      const newEndDate = calculateEndDate(date, 29) // 시작일 + 29일
      return { startDate: date, endDate: newEndDate }
    }),
  setEndDate: date => set({ endDate: date }),
  setDates: newDates => set({ dates: newDates }),
  setIsScheduleConfirmed: () => set({ isScheduleConfirmed: true }),
  setFrequency: frequency =>
    set(state => {
      const dates = getDatesArray(
        state.startDate!,
        state.endDate!,
        frequency,
        state.dayOfWeek,
      )
      return { frequency, dates } // 빈도 변경과 함께 날짜도 업데이트
    }),
  updateDates: () =>
    set(state => {
      const { startDate, endDate, frequency, dayOfWeek } = state
      const dates = getDatesArray(startDate!, endDate!, frequency, dayOfWeek)
      return { dates }
    }),
  setDayOfWeek: dayOfWeek =>
    set(state => {
      const dates = getDatesArray(
        state.startDate!,
        state.endDate!,
        state.frequency,
        dayOfWeek,
      ) // 요일을 고려하여 날짜 배열 업데이트
      return { dayOfWeek, dates }
    }),
  setLocation: location => set({ location }),
  toggleLocation: location =>
    set(state => {
      const newLocation = state.location.includes(location)
        ? state.location.filter(l => l !== location)
        : [...state.location, location]
      return { location: newLocation }
    }),
  setTravelStyle: style => set({ travelStyle: style }),
  setDescription: description => set({ description }),
}))
