import { createApp } from 'vue';
import { useColorMode } from '@vueuse/core';
import LDA from './plugins/LDA';
import App from './App.vue';

import './index.css';

useColorMode();

// plugin auto mount, no need to mount manually
createApp(App).use(LDA);
