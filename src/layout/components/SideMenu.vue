<script lang="tsx">
import { defineComponent, ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useUserStore from '@/store/user'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const current = ref<string[]>([route.path])
    const openkeys = ref<string[]>([]) // todo

    const setOpenKeys = (menuList: any[], menuKey?: string): void => {
      menuList.forEach((menu: any) => {
        if (menu.child) {
          setOpenKeys(menu.child, menu.url)
        } else if (menu.url === route.path) {
          openkeys.value = [menuKey] as string[]
        }
      })
    }

    // 监听路由变化
    watchEffect(() => {
      current.value = [route.path]
      setOpenKeys(userStore.menuList)
    })

    // 递归渲染菜单
    const renderMenu = (menuList: any[]) =>
      menuList.map((menu: any) => {
        return menu.child?.length ? (
          <a-sub-menu key={menu.url} title={menu.name}>
            {renderMenu(menu.child)}
          </a-sub-menu>
        ) : (
          <a-menu-item key={menu.url}>
            <span>{menu.name}</span>
          </a-menu-item>
        )
      })

    return () => (
      <a-menu
        theme="dark"
        mode="inline"
        onClick={(e: any) => router.push(e.key)}
        v-model:selectedKeys={current.value}
        v-model:openKeys={openkeys.value}
      >
        {renderMenu(userStore.menuList)}
      </a-menu>
    )
  }
})
</script>
