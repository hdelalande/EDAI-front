import axios from 'axios'

const production = process.env.NODE_ENV

let API_URL = 'https://lectury.app/'

if (production === 'development') {
  API_URL = 'http://localhost:8000/api/'
}

const api = axios.create({

  baseURL: API_URL,
  timeout: 30000,
  headers: { 
    'Content-Type':  'application/json',
  },
})

export default api
