const city = "Kharkov";
const key = "837caf925275d1fe081a80b115d9ca72";
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
    <div>
      <div class="description">
        <img class="temp-img" src="https://openweathermap.org/img/wn/${icon}.png" style="filter:drop-shadow(0 0 2px black)" alt=${description}>
        <p class="temperature">${Math.round(
    temp
  )}<span>&deg;</span></p>
        <p class="weather">${description}</p>
      </div>
      <ul class="grid">
        <li class="grid-name">
          <p class="value">${humidity}<span>%</span></p>
          <p class="value-name">Humidity</p>
        </li>
        <li class="grid-name">
          <p class="value">${pressure}<span>h/Pa</span></p>
          <p class="value-name">Pressure</p>
        </li>
        <li class="grid-name">
          <p class="value">${speed}<span>km/h</span></p>
          <p class="value-name">Wind Speed</p>
        </li>
      </ul>
    </div>
  `
}
