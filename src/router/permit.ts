import { message } from 'ant-design-vue'
import NProgress from 'nprogress'
import { useTitle } from '@vueuse/core'
import { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import router from '.'
import useUserStore from '@/store/user'
import 'nprogress/nprogress.css'
import getDynamicRoutes from '@/utils/getDynamicRoutes'
import Layout from '@/layout/index.vue'

NProgress.configure({ showSpinner: false })

router.beforeEach((to: RouteLocationNormalized) => {
  const userStore = useUserStore()
  const title = useTitle()
  // 开启进度条
  NProgress.start()
  //   查看路由跳转时是否带有token
  if (userStore.token) {
    //   有token时不允许直接跳转到login页
    if (to.path === '/login') {
      return '/'
    }
    // 动态更改title
    title.value = to.meta.title as string
    // 判断当前是否存在layout路由 无则添加路由
    if (!router.hasRoute('layout')) {
      // 将store中的菜单数组转换为路由
      const accessRoutes: Array<RouteRecordRaw> = getDynamicRoutes(userStore.menuList)
      // 添加layout路由
      router.addRoute({
        path: '/',
        name: 'layout',
        component: Layout,
        children: accessRoutes,
        redirect: accessRoutes[0].path // 默认重定向到第一个路由
      })
      // 触发重定向 否则白屏
      return to.fullPath
    }
    return true
  }
  //   无token时去往login页面放行并清除layout路由
  if (to.path === '/login') {
    // 删除动态路由
    router.removeRoute('layout')
    // 动态更改title
    title.value = `途咪vlog后台管理系统`
    return true
  }
  //   无token时直接重定向至login页
  message.warning('请先登录')
  return '/login'
})

// 全局后置守卫
router.afterEach(() => NProgress.done())
