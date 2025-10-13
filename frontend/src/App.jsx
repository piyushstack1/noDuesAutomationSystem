import { useEffect } from "react"
import AppRouter from "./router"
import useThemeStore from "./store/useThemeStore"

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  return <AppRouter />
}

export default App
