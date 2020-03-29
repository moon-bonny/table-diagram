<template>
  <nuxt />
</template>
<script>
//这个页面主要是为了面包屑点击应用服务的时候做重定向的作用
import {application, interfaceApplication} from '@/const/path'
export default {
  title: '应用服务',
  middleware({redirect, route}) {
    // 因为是嵌套路由，要判断是顶层路由时才跳转
    if (route.path === application) {
      redirect(interfaceApplication)
    }
  }
}
</script>
