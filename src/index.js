let apiKey = "adde97fc3eb60495333cc33248427fb1";
//Tuesday 16:00
let now = new Date();
let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

function fixNumberLowerThanTen(number) {
    if(number < 10) {
        return '0' + number;
    }else {
        return number;
    }
}


let currentWeekDay = weekDays[now.getDay()];
let currentHour = now.getHours();
let currentMinutes = now.getMinutes();
let currentDateTime = currentWeekDay + " " + fixNumberLowerThanTen(currentHour) + ":" + fixNumberLowerThanTen(currentMinutes);
let dateTimeElement = document.querySelector("#dateTime");
dateTimeElement.innerHTML = currentDateTime;

function handleWeatherResponse(response) {
  let humidity = response.data.main.humidity;
  let weatherDescription = response.data.weather[0].main;
  let windSpeed = response.data.wind.speed;
  let temperature = Math.round(response.data.main.temp);
  let cityName = response.data.name;
  document.querySelector("#city").innerHTML = cityName;
  document.querySelector("#weather").innerHTML = weatherDescription;
  document.querySelector("#humidity").innerHTML = `Humidity: ${humidity}%`;
  document.querySelector("#wind").innerHTML = `Wind: ${windSpeed}km/h`;
  document.querySelector("#temperature").innerHTML = `${temperature}°C`;
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

let form = document.querySelector("#searchCityForm");
form.addEventListener("submit", handleSearchCity);

let currentLocationButton = document.querySelector("#currentLocation");
currentLocationButton.addEventListener("click", handleCurrentLocation);
