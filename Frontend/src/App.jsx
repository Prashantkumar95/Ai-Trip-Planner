import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h2>
        HELLO JEE
      </h2>
      <Button>cLICK ME</Button>
    </>
  )
}

export default App
