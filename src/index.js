let apiKey = "adde97fc3eb60495333cc33248427fb1";
//Tuesday 16:00
let now = new Date();

let unit = "Celcius";
let temperature = 23;

function getWeekDay(date) {
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekDays[date.getDay()];
}

function handleForecastResponse(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "<div class='row'>";
  const futureDays = response.data.daily.slice(1, 7);
  futureDays.forEach((day) => {
    forecastHTML += generateForecastForOneDay(day);
  });
  forecastHTML += "</div>";
  forecastElement.innerHTML = forecastHTML;
}

function generateForecastForOneDay(day) {
  let date = new Date(day.dt * 1000);
  let weekDay = getWeekDay(date).substring(0, 3);
  let temperature = day.temp;
  let icon = day.weather[0].icon;
  let min = Math.floor(temperature.min);
  let max = Math.floor(temperature.max);
  return `
  <div class="col-2">
    <div class="weather-forecast-date">${weekDay}</div>
    <img
      src="http://openweathermap.org/img/wn/${icon}@2x.png"
      alt="${weekDay} weather icon"
      width="42"
    />
    <div class="weather-forecast-temperature">
      <span class="weather-forecast-temperature-max"> ${max}°C </span>
      <span class="weather-forecast-temperature-min"> ${min}°C </span>
    </div>
  </div>`;
}

function showTemperature(temperature, unit) {
  let celciusUnit = "°C";
  let fahrenheitUnit = '<a href="#" onclick="toggleUnits()">°F</a>';
  if (unit === "Fahrenheit") {
    temperature = (temperature * 9) / 5 + 32;
    celciusUnit = '<a href="#" onclick="toggleUnits()">°C</a>';
    fahrenheitUnit = "°F";
  }
  let finalTemp = Math.floor(temperature);
  document.querySelector(
    "#temperature"
  ).innerHTML = `${finalTemp}${celciusUnit}|${fahrenheitUnit}`;
}

function toggleUnits() {
  if (unit === "Celcius") {
    unit = "Fahrenheit";
  } else {
    unit = "Celcius";
  }
  showTemperature(temperature, unit);
}

function fixNumberLowerThanTen(number) {
  if (number < 10) {
    return "0" + number;
  } else {
    return number;
  }
}

let currentWeekDay = getWeekDay(now);
let currentHour = now.getHours();
let currentMinutes = now.getMinutes();
let currentDateTime =
  currentWeekDay +
  " " +
  fixNumberLowerThanTen(currentHour) +
  ":" +
  fixNumberLowerThanTen(currentMinutes);
let dateTimeElement = document.querySelector("#dateTime");
dateTimeElement.innerHTML = currentDateTime;

function fetchForecast(coords) {
  let exclude = "current,minutely,hourly,alerts";
  console.log(coords);
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=${exclude}&appid=${apiKey}&units=metric`;
  axios.get(url).then(handleForecastResponse);
}

function handleWeatherResponse(response) {
  //get elements from document
  let cityElement = document.querySelector("#city");
  let weatherElement = document.querySelector("#weather");
  let weatherIconElement = document.querySelector("#icon");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");

  //prepare data from response
  let humidity = response.data.main.humidity;
  let weather = response.data.weather[0];
  let weatherDescription = weather.description;
  let weatherIconUrl = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  let windSpeed = response.data.wind.speed;
  temperature = response.data.main.temp;
  let cityName = response.data.name;

  //update document elements
  cityElement.innerHTML = cityName;
  weatherElement.innerHTML = capitaliseFirstLetter(weatherDescription);
  weatherIconElement.setAttribute("src", weatherIconUrl);
  humidityElement.innerHTML = `Humidity: ${humidity}%`;
  windElement.innerHTML = `Wind: ${windSpeed}km/h`;
  showTemperature(temperature, unit);
  fetchForecast(response.data.coord);
}

function handleCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(url).then(handleWeatherResponse);
}

function handleSearchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#searchCityInput").value;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(handleWeatherResponse);
}

function handleCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleCurrentPosition);
}

function capitaliseFirstLetter(text) {
  let capitalisedFirstLetter = text[0].toUpperCase();
  let restOfText = text.substring(1);
  return `${capitalisedFirstLetter}${restOfText}`;
}

let form = document.querySelector("#searchCityForm");
form.addEventListener("submit", handleSearchCity);

let currentLocationButton = document.querySelector("#currentLocation");
currentLocationButton.addEventListener("click", handleCurrentLocation);
