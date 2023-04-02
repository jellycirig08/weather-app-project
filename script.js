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

function getCityWeather(city) {
  let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  axios
    .get(API_URL)
    .then((response) => {
      let data = response.data;
      cityNameElement.innerHTML = `${data.name}, ${data.sys.country}`;
      currentTemp.innerHTML = `${Math.round(data.main.temp)}°`;
      updateDateTime();
    })
    .catch((error) => {
      console.log(error);
    });
}

function getLocationWeather(latitude, longitude) {
  let API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
  axios
    .get(API_URL)
    .then((response) => {
      let data = response.data;
      cityNameElement.innerHTML = `${data.name}, ${data.sys.country}`;
      currentTemp.innerHTML = `${Math.round(data.main.temp)}°`;
      updateDateTime();
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

searchTextInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    let city = searchTextInput.value;
    getCityWeather(city);
    searchTextInput.value = "";
  }
});

searchButton.addEventListener("click", () => {
  let city = searchTextInput.value;
  getCityWeather(city);
  searchTextInput.value = "";
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

let locationButton = document.querySelector(".location-button");

locationButton.addEventListener("click", () => {
  getLocation();
});
