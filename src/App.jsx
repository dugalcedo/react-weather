import { BrowserRouter } from 'react-router-dom'
import { createContext, useState, useEffect } from 'react'

import Header from "./components/Header.jsx"
import Main from "./components/Main.jsx"

export let Store = createContext()
let storeInitial = {
  searchedLocations: null,
  forecast: null
}

let mountFlag

function App() {

  let [store, setStore] = useState(storeInitial)

  useEffect(()=>{
    if (mountFlag) {
      console.log(`Store was updated\n`,store)
    }
    mountFlag = true
  },[store])

  return (
    <Store.Provider value={[store, setStore]}>
      <BrowserRouter>
        <Header />
        <Main />
        <footer>
          &copy; 2023 Forecastlify Dot Ly, AB
        </footer>
      </BrowserRouter>
    </Store.Provider>
  )
}

export default App
