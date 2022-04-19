import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import { SettingDialog } from "./components/SettingDialog";

class ViewManager extends Component {
  static Views() {
    return {
      app: <App />,
      setting: <SettingDialog />,
    };
  }

  static View(props: any) {
    let name: string = props.location.search.substr(1);
    let view = null;
    if (name === "app") {
      view = ViewManager.Views().app;
    } else if (name === "setting") {
      view = ViewManager.Views().setting;
    }
    if (view === null) throw new Error("View " + name + " is undefined");
    return view;
  }

  render() {
    return (
      <Router>
        <div>
          {/* @ts-ignore */}
          <Route path="/" component={ViewManager.View} />
        </div>
      </Router>
    );
  }
}
export default ViewManager;
