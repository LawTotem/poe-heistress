import { createApp } from 'vue'
import RunStats from './RunStats.vue'
import { i18n } from '../locales/i18n'

const rstats = createApp(RunStats)
rstats.use(i18n)
rstats.mount('#runstats')