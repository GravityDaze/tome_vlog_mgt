<script lang="ts" setup>
import { useRouter } from 'vue-router'
import useUserStore from '@/store/user'
import SideMenu from './components/SideMenu.vue'

const userStore = useUserStore()
const router = useRouter()

// 退出登录
const logout = (): void => {
  userStore.LOGOUT()
  router.replace('/login')
}
</script>

<template>
  <a-layout>
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <div class="logo" />
      <SideMenu />
    </a-layout-sider>
    <a-layout class="h-screen" :style="{ marginLeft: '200px' }">
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <span>{{ userStore.userInfo.realName }}</span>
        <a-button @click="logout">退出登录</a-button>
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
