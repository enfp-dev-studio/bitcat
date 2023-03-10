import { Component, ReactNode } from 'react'
// import { Router, Route } from 'wouter'
import { BrowserRouter as Router, Route } from 'react-router-dom'
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
    let name = window.location.search.substring(1)
    let view: ReactNode | null = null
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
        <Route path="/" component={ViewManager.View} />
      </Router>
    )
  }
}
export default ViewManager
