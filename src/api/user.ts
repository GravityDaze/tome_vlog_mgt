import request from '@/utils/request'

// 获取登录验证码
export const fetchCaptcha = () => request.get('/v/sysCode', { responseType: 'arraybuffer' })

// 登录
type LoginParams = {
  name: string
  password: string
  code: string
}
export const login = (data: LoginParams) => request.post('/v/sysLogin', data)

// 获取用户个人资料
export const fetchUserInfo = () => request.get('/videomis/user/userInfo')

// 获取用户菜单
export const fetchMenuList = () => request.get('/videomis/menu/auth')
