import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import { useOnline } from '@vueuse/core'
import router from '@/router'
import useUserStore from '@/store/user'

const baseURL = 'https://tome3pay.zhihuiquanyu.com'

const request = Axios.create({
  baseURL,
  timeout: 20000
})

// 请求拦截器
request.interceptors.request.use(
  (config): AxiosRequestConfig => {
    const userStore = useUserStore()
    const { token } = userStore
    if (token) {
      // @ts-ignore
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error): Promise<any> => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response): AxiosResponse | Promise<any> => {
    if (response.data.resultStatus) {
      const { resultCode, resultMessage } = response.data.resultStatus
      if (resultCode === '0000') {
        return response
      }
      message.error(resultMessage || '未知错误')
      return Promise.reject(new Error(resultMessage || 'Error'))
    }
    return response
  },
  (err): Promise<any> => {
    const { response } = err
    const online = useOnline()
    const userStore = useUserStore()
    if (response) {
      switch (response.status) {
        case 401: // 权限不足
          userStore.LOGOUT()
          message.warning('登录过期')
          router.replace('/login')
          break
        case 404:
          message.warning('404 NOT FOUND')
          break
        default:
          message.warning('未知错误')
      }
    } else if (!online) {
      message.warning('网络错误')
    }
    return Promise.reject(err)
  }
)

export default request
