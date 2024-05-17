/* eslint-disable no-console */
import { API_ROOT } from '../utils/constants'
import authorizedAxiosInstance from '../utils/authorizeAxios'
import { toast } from 'react-toastify'

// export const fetchBoardDetailsAPI = async (boardId) => {
//   const request = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

//Luu y : tat ca function goi API voi axios chi co request va lay data luon ma khong co try/catch hay then/catch de bat loi
//boi vi nhu vay la khong can thiet no se gay ra du thua code catch loi qua nhieu
//chung ta chi can catch loi tap trung tai mot noi bang cach dung Interceptors trong axios
//   return request.data
// }

/** Users */
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our services! Have a good day!', { theme: 'colored' })
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return request.data
}
export const moveCardToDifferentColumnAPI = async (updateData) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return request.data
}

//Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return request.data
}
export const deleteColumnDetailsAPI = async (columnId) => {
  const request = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return request.data
}


//Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}
export const deleteCardAPI = async (cardId) => {
  const request = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/cards/${cardId}`)
  return request.data
}


export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
  return response.data
}
