import { createApp } from 'vue';
import Pricer from './Pricer.vue';
import { i18n } from '../locales/i18n';

const prcc = createApp(Pricer)
prcc.use(i18n)
prcc.mount('#pricer')