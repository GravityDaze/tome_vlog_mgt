<script lang="ts" setup>
import { createVNode } from 'vue'
import { useRouter } from 'vue-router'
import { PoweroffOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import useUserStore from '@/store/user'
import ActiveTabs from './components/ActiveTabs.vue'
import SideMenu from './components/SideMenu.vue'

const userStore = useUserStore()
const router = useRouter()

interface MenuInfo {
  key: string
  keyPath: string[]
  item: any
  domEvent: MouseEvent
}

// 退出登录
const logout = (): void => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认退出吗',
    centered: true,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      userStore.LOGOUT()
      router.replace('/login')
    }
  })
}

const handleDropDownClick = ({ key }: MenuInfo): void => {
  switch (key) {
    case 'logout':
      logout()
      break
    default:
  }
}
</script>

<template>
  <a-layout>
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <SideMenu />
    </a-layout-sider>
    <a-layout class="h-screen" :style="{ marginLeft: '200px' }">
      <a-layout-header :style="{ background: '#fff', padding: 0, height: 'auto' }">
        <div class="flex justify-between pl-4 pr-4">
          <div>折叠</div>
          <div>
            <a-dropdown class="cursor-pointer">
              <a-space>
                <a-avatar size="middle" :src="userStore.userInfo.headPicPath" />
                <span>{{ userStore.userInfo.realName }}</span>
              </a-space>
              <template #overlay>
                <a-menu @click="handleDropDownClick">
                  <a-menu-item key="logout">
                    <template #icon>
                      <PoweroffOutlined />
                    </template>
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
        <ActiveTabs />
      </a-layout-header>
      <a-layout-content class="h-full m-5">
        <a-card class="h-full overflow-hidden overflow-y-auto">
          <router-view #default="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </a-card>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style>
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(19, 13, 13, 0.2);
  margin: 16px;
}
.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
