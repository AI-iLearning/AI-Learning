import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

export interface CalendarSchedule {
  date: string
  info: PlaceInfo[]
}

export interface PlaceInfo {
  city: string
  place: string
  order: number
}

export const getTimelineAll = async (
  token: string,
): Promise<AxiosResponse<CalendarSchedule[]> | null> => {
  const response = await aiLearningAxios.get('calendar/timeline-all', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}
