import { 
    api, 
    formatDate, 
    getTimes, 
    armForecast, 
    tempColor,
    weathercodes } from '../lib'
import { Store } from '../App.jsx'
import { useContext, useRef, useState, useEffect } from 'react'

export default function WeatherApp() {
    const [searchError, SEARCH_ERROR] = useState(null)
    const [store, setStore] = useContext(Store)
    const input_location = useRef()

    async function handleLocationSearch() {
        SEARCH_ERROR(null)
        let {value} = input_location.current
        if (!value) return
        let res = await fetch(api.geo.root + `&name=${value}`)
        let data = await res.json()
        let err = !data.results?.length
        if (err) {
            SEARCH_ERROR("No results found.")
            return
        }
        setStore(c=>{
            c.forecast = null
            c.searchedLocations = data.results
            return {...c}
        })
    }


    async function selectLocation(lat, lon) {
        let res = await fetch(api.weather.root + `&latitude=${lat}&longitude=${lon}`)
        let data = await res.json()
        setStore(c=>{
            c.searchedLocations = null
            c.forecast = data
            c.forecast.hourlies = 
                c.forecast.hourly.time
                .slice(0, 72)
                .filter(t => {
                    return true
                })
                .map((t, i)=>{
                    if (i%6) return
                    let {userTime,localTime} = getTimes(t, c.forecast.utc_offset_seconds)
                    let p = c.forecast.hourly.precipitation_probability[i]
                    return {
                        userTime, localTime, p,
                        temp: c.forecast.hourly.temperature_2m[i]
                    }
                })
                .filter(x => x)
            c.forecast.dailies =
            c.forecast.daily.time.map((t, i) => {
                return {
                    date: t,
                    max: c.forecast.daily.temperature_2m_max[i],
                    min: c.forecast.daily.temperature_2m_min[i]
                }
            })
            armForecast(c.forecast)
            return {...c}
        })
    }

    // useEffect(()=>{
    //     console.log("WeatherApp re-rendered\n",store)
    // })

    return (
        <section id="weatherApp">
            <form onClick={e=>e.preventDefault()} id="location-search">
                <div className="field">
                    Location
                    <input type="text" ref={input_location}/>
                    <button onClick={handleLocationSearch}>
                        Search
                    </button>
                </div>
            </form>
            <div id="results">

            </div>

            {searchError && (
                <div className="error">
                    {searchError}
                </div>
            )}

            {store.searchedLocations && (
                <div className="searchedLocations">
                    {store.searchedLocations.map(({
                        name,
                        id,
                        admin1,
                        country,
                        latitude,
                        longitude
                    }) => (
                        <div className="loc" key={id}>
                            <div className="name">{name}</div>
                            <button onClick={()=>{selectLocation(latitude, longitude)}}>
                                &#9658;
                            </button>
                            <div className="region">{admin1}, {country}</div>
                        </div>
                    ))}
                </div>
            )}

            {store.forecast && (
                <div className="forecast">
                    <h3>Current</h3>
                    <div className="current">
                        <div className="temp">{store.forecast.current_weather.temperature}&deg;C</div>
                        <div className="weather">
                            {weathercodes[store.forecast.current_weather.weathercode]}
                        </div>
                    </div>
                    <h3>Daily</h3>
                    <div className="dailies">
                        {store.forecast.dailies.map(({
                            date, min, max
                        })=>{
                            return (
                                <div className="daily" key={date}>
                                    <div className="date">{date}</div>
                                    <div className="min">low: {min}</div>
                                    <div className="max">high: {max}</div>
                                </div>
                            )
                        })}
                    </div>
                    <h3>Hourly</h3>
                    <div className="hourlies-container">
                        <div className="hourlies-y">
                            <div>{store.forecast.hourlyMax.toFixed(1)}</div>
                            <div>{store.forecast.hourlyHigh.toFixed(1)}</div>
                            <div>{store.forecast.hourlyLow.toFixed(1)}</div>
                            <div>{store.forecast.hourlyMin.toFixed(1)}</div>
                        </div>
                        <div className="hourlies">
                            {store.forecast.hourlies.map(h => {
                                return (
                                    <div className="hourly" key={h.localTime}>
                                        <div className="dot"
                                        style={{
                                            height: store.forecast.hourlyPx(h.temp),
                                            backgroundColor: tempColor(h.temp)
                                        }}>
                                            <div className='temp'>{h.temp}&deg;</div>
                                            <div className='p'>{h.p}% 💧</div>
                                            <div className='date'>{h.localTime}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}