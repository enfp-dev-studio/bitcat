import { Component } from 'react'
import { Router, Route } from 'wouter'
import App from './App'
import { SettingDialog } from './components/SettingDialog'

class ViewManager extends Component {
  static Views() {
    return {
      app: <App />,
      setting: <SettingDialog />
    }
  }

  static View() {
    let name: string = window.location.search.replace('?', '')
    let view: JSX.Element | null = null
    if (name === 'app') {
      view = ViewManager.Views().app
    } else if (name === 'setting') {
      view = ViewManager.Views().setting
    }
    if (view === null) throw new Error('View ' + name + ' is undefined')
    return view
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={ViewManager.View} />
        </div>
      </Router>
    )
  }
}
export default ViewManager
