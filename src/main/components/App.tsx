import React from "react"
import Styles from "./App.module.scss"
import {Page} from "main/pages/auth/Page";

export default function App() {
  return (
    <div className={Styles.App}>
      <Page/>
    </div>
  )
}
