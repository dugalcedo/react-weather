import { Routes, Route } from 'react-router-dom'

import WeatherApp from '../routes/WeatherApp.jsx'

import Nav from './Nav.jsx'
const nav = [
    {
        content: "Weather",
        to: "/"
    }
]

export default function Main() {
    return (
        <>
            {/* <Nav nav={nav}/> */}
            <main>
                <Routes>
                    <Route index element={<WeatherApp />} />
                </Routes>
            </main>
        </>
    )
}
