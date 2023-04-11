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

function updateWeatherInfo(data) {
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
  document.getElementById("current-temp").textContent = `${temperature}°`;
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

locationButton.addEventListener("click", () => {
  getLocation();
});

function convertCelsius(event) {
  let city = cityNameElement.innerHTML.split(",")[0];
  let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  axios
    .get(API_URL)
    .then((response) => {
      let data = response.data;
      currentTemp.innerHTML = `${Math.round(data.main.temp)}°`;
    })
    .catch((error) => {
      console.log(error);
    });
}

function convertFahrenheit(event) {
  let city = cityNameElement.innerHTML.split(",")[0];
  let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;
  axios
    .get(API_URL)
    .then((response) => {
      let data = response.data;
      currentTemp.innerHTML = `${Math.round(data.main.temp)}°`;
    })
    .catch((error) => {
      console.log(error);
    });
}

let celsiusButton = document.querySelector("#celsius-link");
celsiusButton.addEventListener("click", convertCelsius);

let fahrenheitButton = document.querySelector("#fahrenheit-link");
fahrenheitButton.addEventListener("click", convertFahrenheit);

function handleFormSubmit(event) {
  event.preventDefault();
  const city = searchTextInput.value;
  getWeatherData(city);
  searchForm.reset();
  searchTextInput.focus();
}

searchForm.addEventListener("submit", handleFormSubmit);

searchTextInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleFormSubmit(event);
  }
});
