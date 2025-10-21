const city = "Kharkov";
const key = "ccb712103b1bac33d5e81824ae76a565";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=uk`;

getWeather().then(showWeather);

async function getWeather() {
  const cached = await cookieStore.get("weather");

  if (!cached) {
    const data = await fetch(url).then(response => response.json());
    const {
      weather: [{ icon, description }],
      main: { temp, pressure, humidity },
      wind: { speed }
    } = data
    const weather = { icon, description, humidity, pressure, temp, speed };
    document.cookie = `weather=${JSON.stringify(weather)}; Max-Age=7200`
    return weather;
  } else {
    const weather = JSON.parse(cached.value)
    return weather
  }
}

function showWeather({ icon, description, humidity, pressure, temp, speed }) {
  document.body.innerHTML = `
    <div class="container">
      <div class="description">
          <div class="img-weather">
            <img class="temp-img" src="https://openweathermap.org/img/wn/${icon}.png" style="filter:drop-shadow(0 0 2px black)" alt=${description}>
            <p class="weather">${description}</p>
          </div>  
        <p class="temperature">${Math.round(temp)}<span>&deg;</span></p>
      </div>
      <ul class="grid">
        <li class="grid-name">
          <p class="value-name">Вологість</p>
          <p class="value">${humidity}<span>%</span></p>
        </li>
        <li class="grid-name">
          <p class="value-name">Тиск</p>
          <p class="value">${pressure}<span>мм</span></p>
        </li>
        <li class="grid-name">
          <p class="value-name">Вітер</p>
          <p class="value">${speed}<span>km/h</span></p>
        </li>
      </ul>
    </div>
  `
}
