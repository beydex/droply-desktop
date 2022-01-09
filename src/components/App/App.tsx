import React from "react"
import Styles from "./App.module.scss"
import {Root as AuthRoot} from "src/pages/auth/Root/Root";

export default function App() {
  return (
    <div className={Styles.App}>
      <AuthRoot/>
    </div>
  )
}
