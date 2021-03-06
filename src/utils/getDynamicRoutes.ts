import { RouteRecordRaw } from 'vue-router'

export default function resolveRoutes(menuList: any[]) {
  const res: RouteRecordRaw[] = []
  menuList.forEach((menu: any) => {
    const tmp = { ...menu }
    if (tmp.child) {
      res.push(...resolveRoutes(tmp.child))
    } else {
      res.push({
        path: tmp.url,
        name: tmp.name,
        component: () => import(`/src/views/${tmp.route}.vue`),
        meta: {
          title: tmp.name
        }
      })
    }
  })
  return res
}
