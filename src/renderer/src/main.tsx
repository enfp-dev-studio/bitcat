import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { Provider } from 'jotai'
import ViewManager from './ViewManager'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { en } from './i18n/en'
import { ko } from './i18n/ko'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: en
      },
      ko: {
        translation: ko
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <ViewManager />
      {/* <HashRouter>
          <div>
            <Route path="/" exact>
              <App />
            </Route>
            <Route path="/setting" exact sensitive>
              <SettingDialog />
            </Route>
          </div>
        </HashRouter> */}
    </Provider>
  </React.StrictMode>
)
