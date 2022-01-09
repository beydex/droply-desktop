import React from "react"
import Styles from "./App.module.scss"
import {Auth} from "web/pages/auth/Auth";

export default function App() {
  return (
    <div className={Styles.App}>
      <Auth/>
    </div>
  )
}
