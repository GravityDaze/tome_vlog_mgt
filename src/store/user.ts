import { defineStore } from 'pinia'
import storage from 'good-storage'
import { login, fetchUserInfo, fetchMenuList } from '@/api/user'

// 登录表单类型
type LoginParams = {
  name: string
  password: string
  code: string
}

export default defineStore({
  id: 'user',
  state: () => ({
    token: storage.get('token'),
    userInfo: storage.get('userInfo'),
    menuList: storage.get('menuList')
  }),
  getters: {},
  actions: {
    // 登录
    async LOGIN(loginForm: LoginParams) {
      const { data } = await login(loginForm)
      this.token = data.value.access_token
      storage.set('token', data.value.access_token)
    },
    // 获取用户信息
    async FETCH_USER_INFO() {
      const { data } = await fetchUserInfo()
      this.userInfo = data.value
      storage.set('userInfo', data.value)
    },
    // 获取菜单
    async FETCH_MENU_LIST() {
      const { data } = await fetchMenuList()
      this.menuList = data.value
      storage.set('menuList', data.value)
    },
    // 注销
    LOGOUT() {
      this.token = ''
      this.userInfo = {}
      storage.clear()
    }
  }
})
