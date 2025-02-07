import '@renderer/assets/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@renderer/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'



const app = createApp(App)
app.use(router)

//导入elementUi图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
