// Interação
const citySearchInput = document.getElementById('city-search-input')
const citySearchButton = document.getElementById('city-search-button')

// Exibição
const currentDate = document.getElementById("current-date");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const weatherDescription = document.getElementById("weather-description");
const currentTemperature = document.getElementById("current-temperature");
const windSpeed = document.getElementById("wind-speed");
const feelsLikeTemperature = document.getElementById("feels-like-temperature");
const currentHumidity = document.getElementById("current-humidity");
const sunriseTime = document.getElementById("sunrise-time");
const sunsetTime = document.getElementById("sunset-time");

const api_key = "b9e68e43b8b661cf25c3ed779f5f6595"

// https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid={api_key}

navigator.geolocation.getCurrentPosition( // função para receber a localização do usuário pela API
    (position) => {
        let lat = position.coords.latitude // captura a latitude do "position"
        let lon = position.coords.longitude // captura a longitude do "position"

        getCurrentLocationWeather(lat, lon) // "executa a função que recebe latitude e longitude"
    },
    (err) => {
        if (err.code === 1) {
            alert("Gelolocalização negada pelo usuário. Busque manualmente por uma cidade na barra de pesquisa.")
        } else {
        console.log(err)
        }
    }
)

function getCurrentLocationWeather(lat, lon) { // função que recebe latitude e longitude
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${api_key}`)
    .then((response) => response.json()) // converte para que o JS possa manipular os dados
    .then((data) => displayWeather(data))
}

citySearchButton.addEventListener("click", () => { // evento de clicar no botão
    let cityName = citySearchInput.value // recebe o valor do input
    getCityWeather(cityName) // executa a função que vai receber o nome da cidade digitada
})

function getCityWeather(cityName) {
    weatherIcon.src = `./assets/loading-icon.svg` // imagem para efeito de pesquisa quando digita nova cidade

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${api_key}`)
    .then((response) => response.json()) // converte para que o JS possa manipular os dados
    .then((data) => displayWeather(data))
}

function displayWeather(data) {
    let { // cria o objeto com os valores recebidos pela API
        dt,
        name,
        weather: [{ icon, description }],
        main: { temp , feels_like , humidity },
        wind: { speed },
        sys: { sunrise , sunset },
    } = data

    currentDate.textContent = formatDate(dt);
    cityName.textContent = name;
    weatherIcon.src = `./assets/${icon}.svg`
    weatherDescription.textContent = description;
    currentTemperature.textContent = `${Math.round(temp)}ºC`;
    windSpeed.textContent = `${Math.round(speed * 3,6)} km/h`;
    feelsLikeTemperature.textContent = `${Math.round(feels_like)}ºC`;
    currentHumidity.textContent = `${humidity}%`;
    sunriseTime.textContent = formatTime(sunrise);
    sunsetTime.textContent = formatTime(sunset);
}

function formatDate(epochTime) { // como o valor é "estranho" esta função o torna mais legível
    let date = new Date(epochTime * 1000)
    let formattedDate = date.toLocaleDateString('pt-BR',{month: "long", day: "numeric"})
    return `Hoje, ${formattedDate}`
}

function formatTime(epochTime) { // como o valor é "estranho" esta função o torna mais legível
    let date = new Date(epochTime * 1000)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    return `${hours}:${minutes}`
}