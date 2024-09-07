import { AxiosResponse } from 'axios'

import { aiLearningAxios } from '../axiosInstance'

// Request 바디의 인터페이스
interface EditRequest {
  date: string
  city: string
  place: string
}

// Response 바디의 인터페이스
interface EditResponse {
  message: string
}

// POST 요청 함수
export const postEdit = async (
  token: string,
  edits: EditRequest[],
): Promise<AxiosResponse<EditResponse> | null> => {
  try {
    const response = await aiLearningAxios.post<EditResponse>(
      'schedule/edit',
      edits,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response
  } catch (error) {
    console.error('Error uploading edits:', error)
    return null
  }
}
