import { createI18n } from 'vue-i18n'

import enUS from './en.json'

type MessageSchema = typeof enUS

export const i18n = createI18n<[MessageSchema], 'en'>({
    legacy: false,
    locale: 'en',
    messages: {
        'en': enUS
    }
})