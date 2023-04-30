let searchForm = document.getElementById("searchForm");
let searchButton = document.querySelector(".search-button");
let searchTextInput = document.querySelector("#search-text-input");
let currentTemp = document.querySelector("#current-temp");
let currentDate = document.getElementById("current-date");
let currentDay = document.getElementById("current-day");
let currentTime = document.getElementById("current-time");
let cityNameElement = document.querySelector("#city");
cityNameElement.textContent = "Cebu City";

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

let currentWeatherData;
let celsiusTemperature;

let forecastDiv = document.getElementById("forecast");

function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  axios
    .get(apiUrl)
    .then((response) => {
      const data = response.data;
      currentWeatherData = data;
      updateWeatherInfo(data);

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
      return axios.get(forecastUrl);
    })
    .then((response) => {
      let forecastList = response.data.list;
      let forecastHTML = "";

      let tomorrow = new Date(new Date().setHours(0, 0, 0, 0));
      tomorrow.setDate(tomorrow.getDate() + 1);
      let tomorrowIndex = forecastList.findIndex((forecastData) => {
        let date = new Date(forecastData.dt * 1000);
        return date >= tomorrow;
      });

      for (let i = tomorrowIndex; i < tomorrowIndex + 5 * 8; i += 8) {
        if (i >= forecastList.length) {
          break;
        }
        let forecastData = forecastList[i];
        let temperature = forecastData.main.temp;
        let description = forecastData.weather[0].description;
        let dateUTC = new Date(forecastData.dt * 1000);
        let dateLocal = new Date(
          dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000
        );
        let date = dateLocal.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "2-digit",
        });
        let hourLocal = dateLocal.getHours();
        let isDaytime = hourLocal >= 6 && hourLocal < 18;
        let iconCode = forecastData.weather[0].icon;
        if (!isDaytime) {
          iconCode = iconCode.replace("d", "n");
        }
        let iconUrl = `icons/${iconCode}.svg`;
        let high = Math.round((temperature * 9) / 5 + 32) + "°F";
        let low = Math.round(temperature) + "°C";
        forecastHTML += `
    <div class="list">
      <div class="weather-icons">
        <img src="${iconUrl}" id="weather-icon" width="70px" />
      </div>
      <div class="content">
        <h4 class="date">
          <span class="dow-date">${date}</span>
        </h4>
        <p>${description}</p>
        <div class="daily-temp-wrapper">
          <div class="daily-temp">
            <span class="high">${high}</span>
            <span class="low">| ${low}</span>
          </div>
        </div>
      </div>
    </div>
  `;
      }

      let dailyWrapper = document.querySelector(".daily-wrapper-col");
      dailyWrapper.innerHTML = forecastHTML;
    });
}

getWeatherData("Cebu City");

function updateWeatherInfo(data, temperatureUnit) {
  if (!data) {
    return;
  }

  const city = data.name;
  const country = data.sys.country;
  const weatherDescription = data.weather[0].description;
  const temperature = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = Math.round(data.wind.speed);
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

let latitude, longitude;

function getLocationWeather(latitude, longitude) {
  let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

  axios
    .all([axios.get(currentWeatherUrl), axios.get(forecastUrl)])
    .then((responses) => {
      const currentWeatherData = responses[0].data;
      const forecastData = responses[1].data;

      updateWeatherInfo(currentWeatherData);

      let forecastList = forecastData.list;
      let forecastHTML = "";

      for (let i = 0; i < forecastList.length; i += 8) {
        let forecastData = forecastList[i];
        let temperature = forecastData.main.temp;
        let description = forecastData.weather[0].description;
        let date = new Date(forecastData.dt * 1000).toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            day: "numeric",
            month: "2-digit",
          }
        );
        let high = Math.round((temperature * 9) / 5 + 32) + "°F";
        let low = Math.round(temperature) + "°C";

        forecastHTML += `
          <div class="list">
            <div class="weather-icons">
              <img src="icons/${forecastData.weather[0].icon}.svg" id="weather-icon" width="70px" />
            </div>
            <div class="content">
              <h4 class="date">
                <span class="dow-date">${date}</span>
              </h4>
              <p>${description}</p>
              <div class="daily-temp-wrapper">
                <div class="daily-temp">
                  <span class="high">${high}</span>
                  <span class="low">| ${low}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      let dailyWrapper = document.querySelector(".daily-wrapper-col");
      dailyWrapper.innerHTML = forecastHTML;
    })
    .catch((error) => {
      console.log(error);
    });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
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
locationButton.removeEventListener("touchend", getLocation);

locationButton.addEventListener("click", getLocation);
locationButton.addEventListener("touchend", getLocation);

let celsiusButton = document.querySelector(".btn-celsius");
let fahrenheitButton = document.querySelector(".btn-fahrenheit");
let celsiusLink = document.getElementById("celsius-link");
let fahrenheitLink = document.getElementById("fahrenheit-link");
let activeButton = document.querySelector(".btn.active");

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  fahrenheitButton.classList.add("active");
  celsiusButton.classList.remove("active");
  let temperatureElement = document.getElementById("current-temp");
  let fahrenheitTemperature =
    (parseFloat(temperatureElement.innerHTML) * 9) / 5 + 32;
  temperatureElement.innerHTML = `${Math.round(fahrenheitTemperature)}°`;
  updateWeatherInfo(currentWeatherData, "fahrenheit");
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  celsiusButton.classList.add("active");
  fahrenheitButton.classList.remove("active");
  let temperatureElement = document.getElementById("current-temp");
  let celsiusTemperature =
    ((parseFloat(temperatureElement.innerHTML) - 32) * 5) / 9;
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°C`;
  updateWeatherInfo(currentWeatherData, "celsius");
}

if (activeButton === celsiusButton) {
  displayCelsiusTemperature(new Event("click"));
} else {
  displayFahrenheitTemperature(new Event("click"));
}

celsiusLink.addEventListener("click", displayCelsiusTemperature);
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

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
