import {API_URL} from '../constants'

export const apiRequest = async (
  endpoint,
  options = {},
) => {
  const token = localStorage.getItem('jwt_token')

  const headers = {
    Authorization: token
      ? `Bearer ${token}`
      : '',
    ...options.headers,
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] =
      'application/json'
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    },
  )

  return response.json()
}