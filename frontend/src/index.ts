import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useColorMode } from '@vueuse/core';
import App from './App.vue';

import './index.css';

useColorMode();

import router from './router.js';
import i18n from './i18n.js';

createApp(App).use(router).use(i18n).use(createPinia()).mount('#app');
