import { createApp } from 'vue'
import Tracker from './Tracker.vue'
import { i18n } from '../locales/i18n'

const trkr = createApp(Tracker)
trkr.use(i18n)
trkr.mount('#tracker')