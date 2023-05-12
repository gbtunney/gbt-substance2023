import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createSSRApp } from 'vue'
// Vue's server-rendering API is exposed under `vue/server-renderer`.
import { renderToString } from 'vue/server-renderer'

createApp(App).mount('#app')
