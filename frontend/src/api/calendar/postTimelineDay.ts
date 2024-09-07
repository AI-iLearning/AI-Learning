import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

export interface DateSchedule {
  memo: string
  date: string
  distance: number[]
  info: PlacePreviewInfo[]
}

export interface PlacePreviewInfo {
  city: string
  place: string
  order: number
  pic: string
  lon: number
  lat: number
}

export const postTimelineDay = async (
  token: string,
  date: string,
): Promise<AxiosResponse<DateSchedule> | null> => {
  const response = await aiLearningAxios.post(
    'calendar/timeline-day',
    { date },
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return response
}
