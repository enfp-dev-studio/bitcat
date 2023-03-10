import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { Provider } from 'jotai'
import ViewManager from './ViewManager'

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
