const {app, BrowserWindow} = require("electron")

app.on("ready", async () => {
  let window = new BrowserWindow({
    width: 1000,
    height: 800,
    autoHideMenuBar: true,
  })

  if (process.env.BUILD_MODE === "development") {
    await window.loadURL("http://localhost:8080/main.html")
  } else {
    await window.loadFile("dist/app/main.html")
  }
})
