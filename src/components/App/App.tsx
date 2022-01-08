import React from "react"
import Styles from "./App.module.scss"
import Logo from "assets/Logo.svg"

export default function App() {
  return (
    <div className={Styles.App}>
      <img className={Styles.Logo} src={Logo}/>
    </div>
  )
}
