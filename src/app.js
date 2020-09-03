//format date and time
function formatDate(timestamp) {
  let date = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} at ${formatHours(timestamp)}`;
}
function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

//Shows data from API
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  let timeElement = document.querySelector("#time");

  celsiusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute("src", changeImage(response.data.weather[0].icon));
  iconElement.setAttribute("alt", response.data.weather[0].description);

  //convert to US am/pm
  timeElement.innerHTML = date.formatHours("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

//Icons reflect the weather
function changeImage(icon) {
  let sunnySrc = "src/images/sunny.png";
  let rainySrc = "src/images/rainy.png";
  let cloudySrc = "src/images/cloudysunny.png";
  let stormySrc = "src/images/stormy.png";
  let snowySrc = "src/images/snowy.png";
  let foggySrc = "src/images/foggy.png";
  let sunnyCloudySrc = "src/images/cloudysunny.png";

  if (icon === "01d" || icon === "01n") {
    return sunnySrc;
  } else if (icon === "04d" || icon === "04n") {
    return cloudySrc;
  } else if (
    icon === "02d" ||
    icon === "02n" ||
    icon === "03d" ||
    icon === "03n"
  ) {
    return sunnyCloudySrc;
  } else if (
    icon === "09d" ||
    icon === "09n" ||
    icon === "10d" ||
    icon === "10n"
  ) {
    return rainySrc;
  } else if (icon === "11d" || icon === "11n") {
    return stormySrc;
  } else if (icon === "13d" || icon === "13n") {
    return snowySrc;
  } else if (icon === "50d" || icon === "50n") {
    return foggySrc;
  } else {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}

//forcast
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-2">
      <h3>
        ${formatHours(forecast.dt * 1000)}
      </h3>
      <img src="${changeImage(forecast.weather[0].icon)}" id="icon" />
      <div class="weather-forecast-temperature">
        <strong id="forcast-high" class="forecastTempMax">
          ${Math.round(forecast.main.temp_max)}°
        </strong>
        <span id="forecast-low" class="forecastTempMin">
        ${Math.round(forecast.main.temp_min)}°
        </span>
      </div>
    </div>
  `;
  }
}

//searching city and submiting button
function search(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

//current location API and button
function searchLocation(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let locationButton = document.querySelector("#current-location");
locationButton.addEventListener("click", getCurrentLocation);

//Switch between C/F
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  celsiusLink.addEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  let highTempElement = document.querySelectorAll("#forecast-high");
  let highTemp = (temperatureHigh * 9) / 5 + 32;
  highTempElement.innerHTML = `${Math.round(highTemp)}`;

  let lowTempElement = document.querySelector("#temperatureLow");
  let lowTemp = (temperatureLow * 9) / 5 + 32;
  lowTempElement.innerHTML = `${Math.round(lowTemp)}`;

  let highElement = document.querySelectorAll(".forecastTempMax");
  let lowElement = document.querySelectorAll(".forecastTempMin");

  highElement.forEach(function (high) {
    let currentTemp = high.innerHTML;
    high.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`;
    return highElement;
  });

  lowElement.forEach(function (low) {
    let currentTemp = low.innerHTML;
    low.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`;
    return lowElement;
  });
}

function convertCelsius(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let highTempElement = document.querySelectorAll("#forecast-high");
  let highTemp = (temperatureHigh * 9) / 5 + 32;
  highTempElement.innerHTML = `${Math.round(highTemp)}`;

  let lowTempElement = document.querySelector("#temperatureLow");
  let lowTemp = (temperatureLow * 9) / 5 + 32;
  lowTempElement.innerHTML = `${Math.round(lowTemp)}`;

  let highElement = document.querySelectorAll(".forecastTempMax");
  let lowElement = document.querySelectorAll(".forecastTempMin");

  highElement.forEach(function (high) {
    let currentTemp = high.innerHTML;
    high.innerHTML = `${Math.round(((currentTemp - 32) * 5) / 9)}`;
    return highElement;
  });

  lowElement.forEach(function (low) {
    let currentTemp = low.innerHTML;
    low.innerHTML = `${Math.round(((currentTemp - 32) * 5) / 9)}`;
    return lowElement;
  });
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Chicago");
