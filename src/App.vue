<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
import { ElNotification } from "element-plus"
// 将 Element Plus 的语言设置为中文
import zhCn from "element-plus/es/locale/lang/zh-cn"

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()

/** 作者小心思 */
ElNotification({
  title: "Hello",
  type: "success",
  dangerouslyUseHTMLString: true,
  message:
    "<a style='color: teal' target='_blank' href='https://github.com/un-pany/v3-admin-vite'>欢迎使用时间管家软件后台管理平台</a>",
  duration: 0,
  position: "bottom-right"
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
