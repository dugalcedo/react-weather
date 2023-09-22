export const api = {
    geo: {
        root: "https://geocoding-api.open-meteo.com/v1/search?count=15&format=json"
    },
    weather: {
        root: "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,precipitation_probability&timezone=auto&daily=temperature_2m_min,temperature_2m_max&current_weather=true"
    }
}

function pad0(n) {
    return n < 10 ? "0"+n : n
}

export function formatDate(date) {
    return `${pad0(date.getMonth()+1)}/${pad0(date.getDate())} ${pad0(date.getHours())}:${pad0(date.getMinutes())}`
}

export function getTimes(time, utc_offset_seconds) {
    let userTime = new Date(time)
    userTime.setMinutes(userTime.getMinutes()+userTime.getTimezoneOffset())
    let localTime = new Date(userTime)
    localTime.setSeconds(localTime.getSeconds()+utc_offset_seconds)
    return {
        userTime: formatDate(userTime), 
        localTime: formatDate(localTime)
    }
}

export function tempColor(temp) {
    return (
        temp <= -20 ? "black" :
        temp <= -15 ? "gray" :
        temp <= -10 ? "#3e4e8b" :
        temp <= -5 ? "navy" :
        temp <= 0 ? "blue" :
        temp <= 5 ? "#5894d4" :
        temp <= 10 ? "#98b8da" :
        temp <= 15 ? "#39d8c9" :
        temp <= 20 ? "#37b044" :
        temp <= 25 ? "#88bb34" :
        temp <= 30 ? "yellow" :
        temp <= 35 ? "orange" : "red"
    )
}

export const weathercodes = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Light rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Light snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

export function armForecast(forecast) {
    forecast.hourlyMin = Math.min(...forecast.hourlies.map(x=>x.temp))-10
    forecast.hourlyMax = Math.max(...forecast.hourlies.map(x=>x.temp))+5
    forecast.hourlyDiff = forecast.hourlyMax - forecast.hourlyMin
    forecast.hourlyLow = forecast.hourlyMin + forecast.hourlyDiff/3
    forecast.hourlyHigh = forecast.hourlyMin + forecast.hourlyDiff/3*2
    forecast.hourlyPx = temp => ((temp-forecast.hourlyMin)/forecast.hourlyDiff*140)+"px"
}