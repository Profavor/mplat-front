import Axios, { AxiosResponse } from 'axios'
import qs from 'qs'

export const baseURL = 'http://prusoft.synology.me:28080/'
//export const baseURL = 'http://localhost:8080/'

export const CONTENT_TYPE = 'Content-Type'

export const FORM_URLENCODED = 'application/x-www-form-urlencoded; charset=UTF-8'

export const APPLICATION_JSON = 'application/json; charset=UTF-8'

export const TEXT_PLAIN = 'text/plain; charset=UTF-8'

const service = Axios.create({
  baseURL,
  timeout: 10 * 60 * 1000,
  withCredentials: true,
})

service.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUZXN0IEpXVCIsImp0aSI6ImFiY2RlZiIsImlzcyI6InByb2Zhdm9yIiwiZXhwIjoxNjQ4MDIzMjg3LCJpYXQiOjE2NDc2NjMyODd9.NOTHU2kKPY8zy2bAQdt_h7_Qzp2OJGMNgyeissOjAYg'
    !config.headers && (config.headers = {})
    if (!config.headers[CONTENT_TYPE]) {
      config.headers[CONTENT_TYPE] = APPLICATION_JSON
    }
    if (config.headers[CONTENT_TYPE] === FORM_URLENCODED) {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200) {
      return response
    } else {
      throw new Error(response.status.toString())
    }
  },
  (error) => {
    if (import.meta.env.MODE === 'development') {
      console.log(error)
    }
    return Promise.reject({ code: 500, msg: 'Error' })
  }
)

export default service
