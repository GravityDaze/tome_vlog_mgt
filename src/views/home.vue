<template>
  <div>{{ title }}</div>
  <div>{{ store.count }}</div>
  <a-popover title="Title">
    <template #content>
      <p>Content</p>
      <p>Content</p>
    </template>
    <a-button type="primary" @click="add">Primary Button</a-button>
  </a-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useStore from '@/store'

const store = useStore()
const title = ref('vue3')
function add() {
  store.countPlusOne()
}
</script>
