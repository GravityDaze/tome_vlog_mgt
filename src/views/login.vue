<script lang="ts" setup>
import { ref, reactive, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { notification } from 'ant-design-vue'
import { UserOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons-vue'
// utils
import { onKeyStroke } from '@vueuse/core'
import { binaryToBase64 } from '@/utils/common'
// store
import useUserStore from '@/store/user'
// api
import { fetchCaptcha } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

/**
 * 验证码
 */
const captcha = ref('')
// 获取图形验证码
const getCode = async () => {
  const res = await fetchCaptcha()
  captcha.value = binaryToBase64(res.data)
}
onMounted(() => getCode())

/**
 * 用户登录
 */
const isLoading = ref(false) // 按钮加载效果
const formRef = ref()
const loginForm = reactive({
  name: '',
  password: '',
  code: ''
})
const rules = {
  name: {
    required: true,
    message: '请输入用户名'
  },
  password: {
    required: true,
    message: '请输入密码'
  },
  code: {
    required: true,
    message: '请输入验证码'
  }
}

// 登录
const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      try {
        isLoading.value = true
        // 登录
        await userStore.LOGIN(loginForm)
        // 请求用户资料
        await userStore.FETCH_USER_INFO()
        // 请求菜单
        await userStore.FETCH_MENU_LIST()
        notification.open({
          message: `您好 ${userStore.userInfo.realName}`,
          description: `今天是${new Date().toLocaleDateString()} 欢迎登录途咪vlog后台管理系统`,
          icon: h(SmileOutlined, { style: 'color: #108ee9' })
        })
        router.push('/')
      } catch {
        // 失败时重新请求二维码
        getCode()
      } finally {
        isLoading.value = false
      }
    })
    .catch(() => {})
}

// 回车按钮触发登录
onKeyStroke('Enter', () => onSubmit())
</script>

<template>
  <div class="h-screen flex justify-center items-center bg-login bg-cover bg-center">
    <div class="rounded-lg shadow-md w-1/5 p-14 bg-white min-w-96">
      <div class="flex flex-col w-full items-center">
        <img class="w-36 h-10 text-center pb-8 box-content" src="@/assets/main-title.png" />
        <a-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 24 }"
        >
          <a-form-item name="name">
            <a-input v-model:value="loginForm.name" placeholder="请输入账号">
              <template #prefix>
                <user-outlined type="user" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password v-model:value="loginForm.password" placeholder="请输入密码">
              <template #prefix> <lock-outlined /> </template
            ></a-input-password>
          </a-form-item>
          <a-form-item name="code">
            <div class="w-full flex space-x-8">
              <a-input v-model:value="loginForm.code" placeholder="请输入验证码" />
              <img
                class="w-16 cursor-pointer"
                :src="`data:image/png;base64,${captcha}`"
                @click="getCode"
              />
            </div>
          </a-form-item>
          <a-form-item>
            <a-button block type="primary" @click="onSubmit" :loading="isLoading">登录</a-button>
          </a-form-item>
        </a-form>
        <div class="fixed bottom-20 left-1/2 -translate-x-1/2 text-white">
          <div class="text-center mt-10">—— 途咪VLOG 后台管理系统 ——</div>
          <div class="text-center">Copyright 2022 © 成都途咪智慧视频有限技术公司</div>
        </div>
      </div>
    </div>
  </div>
</template>
