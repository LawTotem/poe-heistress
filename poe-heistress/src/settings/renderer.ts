import { createApp } from 'vue';
import Settings from './Settings.vue';
import { i18n } from '../locales/i18n';

const settng = createApp(Settings)
settng.use(i18n)
settng.mount('#settings')