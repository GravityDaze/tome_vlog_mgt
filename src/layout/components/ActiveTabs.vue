<script lang="ts" setup>
import { ref, watch, reactive } from 'vue'
import { useRoute, useRouter, RouteLocationNormalized, RouteRecord } from 'vue-router'
import storage from 'good-storage'

type Tabs = {
  title: string
  path: string
  closable: boolean
}
const route = useRoute()
const router = useRouter()
// 当前激活的tab
const activeKey = ref('')
// 记录当前路由的数组
const recordRoute = reactive<Tabs[]>([])

// 设置tabs
const setTab = (activeRoute: RouteLocationNormalized | RouteRecord, closable: boolean): void => {
  // tabs新增标签
  recordRoute.push({
    title: activeRoute.meta.title as string,
    path: activeRoute.path,
    closable
  })
  // 持久化
  storage.set('recordRoute', recordRoute)
}

// 删除tabs
const removeTab = (path: string): void => {
  const index = recordRoute.findIndex((v) => v.path === path)
  recordRoute.splice(index, 1)
  storage.set('recordRoute', recordRoute)
  // 如果删除的是当前激活路由 则跳转至上一个路由
  if (path === activeKey.value) {
    const prevRoutePath = recordRoute[recordRoute.length - 1].path
    router.replace(prevRoutePath)
  }
}

// 初始化tabs
const initTabs = (): void => {
  // 查看持久化数据中是否有tabs数据
  const storageRoute: Tabs[] = storage.get('recordRoute')
  if (storageRoute) {
    // 使用持久化数据中的tabs数据
    recordRoute.push(...storageRoute)
  } else {
    const routes = router.getRoutes()
    // 寻找到布局路由
    const layout = routes.find((v) => v.path === '/') as RouteRecord
    // 寻找到布局路由下的第一个路由
    const firstRoute = routes.find((v) => v.path === layout.redirect) as RouteRecord
    // 不可关闭
    setTab(firstRoute, false)
  }
}

// 标签页点击
const tabClick = (path: string): void => {
  if (activeKey.value === path) return
  router.push(path)
}

// 监听路由改变
watch(
  route,
  (activeRoute: RouteLocationNormalized): void => {
    // 判断当前是否是第一次进入layout页面 || 刷新'
    if (!recordRoute.length) {
      initTabs()
    } else {
      // 只监听meta中带有title的路由
      if (!activeRoute.meta.title) return
      // 当前tabs是否已经存在该路由
      const hasRouteRecored = recordRoute.some((v) => activeRoute.path === v.path)
      if (!hasRouteRecored) setTab(activeRoute, true)
    }
    // 设置当前标签页高亮 bug:可能无法清除上一次高亮
    activeKey.value = activeRoute.path
  },
  { immediate: true }
)
</script>

<template>
  <a-tabs
    v-model:activeKey="activeKey"
    hide-add
    type="editable-card"
    @tab-click="tabClick"
    @edit="removeTab"
  >
    <a-tab-pane
      v-for="item in recordRoute"
      :key="item.path"
      :tab="item.title"
      :closable="item.closable"
    />
    >
  </a-tabs>
</template>
