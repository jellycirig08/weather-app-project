let searchForm = document.getElementById("searchForm");
let searchButton = document.querySelector("#search-button");
let searchTextInput = document.querySelector("#search-text-input");
let cityNameElement = document.querySelector("#city-name");
let currentTemp = document.querySelector("#current-temp");
let currentDate = document.getElementById("current-date");
let currentDay = document.getElementById("current-day");
let currentTime = document.getElementById("current-time");

let API_KEY = "ce5e83cc51efd91e9de83c42568b0bdb";

function updateDateTime() {
  let now = new Date();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  currentDate.innerHTML = `${
    months[now.getMonth()]
  } ${now.getDate()}, ${now.getFullYear()}`;

  let dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = dayNames[now.getDay()];
  currentDay.innerHTML = day;

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let amPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  let currentTimeString = `${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${amPm}`;
  currentTime.innerHTML = currentTimeString;
}

updateDateTime();

function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  axios
    .get(apiUrl)
    .then((response) => {
      const data = response.data;
      updateWeatherInfo(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateWeatherInfo(data, temperatureUnit) {
  if (!data) {
    return;
  }

  const city = data.name;
  const country = data.sys.country;
  const weatherDescription = data.weather[0].description;
  const temperature = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const weatherIcon = data.weather[0].icon;

  document.getElementById("city").textContent = `${city}, ${country}`;
  document.getElementById("weatherDescription").textContent =
    weatherDescription;

  let temperatureElement = document.getElementById("current-temp");
  if (temperatureUnit === "celsius") {
    temperatureElement.innerHTML = `${temperature}°`;
  } else {
    let fahrenheitTemperature = (temperature * 9) / 5 + 32;
    temperatureElement.innerHTML = `${Math.round(fahrenheitTemperature)}°`;
  }

  document.getElementById("Humid").textContent = `Humidity: ${humidity}%`;
  document.getElementById("Wind").textContent = `Wind: ${windSpeed}km/h`;

  const iconUrl = `icons/${weatherIcon}.svg`;
  const weatherIconElement = document.getElementById("weather-icon");
  weatherIconElement.setAttribute("src", iconUrl);
}

function getLocationWeather(latitude, longitude) {
  let API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
  axios
    .get(API_URL)
    .then((response) => {
      const data = response.data;
      updateWeatherInfo(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        getLocationWeather(latitude, longitude);
      },
      (error) => {
        console.log(error);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

let locationButton = document.querySelector(".location-button");

locationButton.removeEventListener("click", getLocation);
locationButton.addEventListener("click", getLocation);

let celsiusLink = document.getElementById("celsius-link");
let fahrenheitLink = document.getElementById("fahrenheit-link");

celsiusLink.removeEventListener("click", displayCelsiusTemperature);
fahrenheitLink.removeEventListener("click", displayFahrenheitTemperature);

celsiusLink.addEventListener("click", displayCelsiusTemperature);
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.getElementById("current-temp");
  let celsiusTemperatureValue = parseFloat(
    temperatureElement.textContent.replace("°C", "")
  );
  let fahrenheitTemperature = (celsiusTemperatureValue * 9) / 5 + 32;
  temperatureElement.innerHTML = `${Math.round(fahrenheitTemperature)}°`;
  celsiusTemperature = celsiusTemperatureValue;
  updateWeatherInfo(currentWeatherData, "fahrenheit");
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.getElementById("current-temp");
  let fahrenheitTemperatureValue = parseFloat(
    temperatureElement.textContent.replace("°F", "")
  );
  let celsiusTemperature = ((fahrenheitTemperatureValue - 32) * 5) / 9;
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°`;
  updateWeatherInfo(currentWeatherData, "celsius");
}

function handleFormSubmit(event) {
  event.preventDefault();
  const city = searchTextInput.value;
  getWeatherData(city);
  searchTextInput.focus();
}

searchForm.addEventListener("submit", handleFormSubmit);

searchTextInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleFormSubmit(event);
  }
});
