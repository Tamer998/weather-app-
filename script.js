document
  .getElementById("getWeatherBtn")
  .addEventListener("click", getWeatherData);

document
  .getElementById("countryInput")
  .addEventListener("change", populateCitiesDropdown);

async function getCitiesInCountry(countryCode) {
  const geoNamesApiKey = `tamer19_1`; // Replace with your GeoNames API key
  const apiUrl = `http://api.geonames.org/searchJSON?country=${countryCode}&cities15000&username=${geoNamesApiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.geonames;
  } catch (error) {
    throw new Error("Failed to fetch city data from GeoNames API.");
  }
}

async function getWeatherData() {
  const cityInput = document.getElementById("cityInput");
  const countryInput = document.getElementById("countryInput");
  const city = cityInput.value;
  const country = countryInput.value;

  const apiKey = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=5e94b6dc5105b856f4ac3e12b4801ba2`; // Replace with your OpenWeatherMap API key
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`;

  try {
    showLoadingPopup();
    const response = await fetch(weatherApiUrl);
    const data = await response.json();
    hideLoadingPopup();
    displayWeatherData(data);
  } catch (error) {
    hideLoadingPopup();
    showError("Failed to fetch weather data. Please try again later.");
  }
}

async function populateCitiesDropdown() {
  const selectedCountry = document.getElementById("countryInput").value;

  if (selectedCountry) {
    try {
      const citiesList = await getCitiesInCountry(selectedCountry);
      const cities = citiesList.map((city) => city.name);
      console.log(cities); // Log the cities array to the console

      const cityDropdown = document.getElementById("cityDropdown");

      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.name;
        cityDropdown.appendChild(option);
      });
    } catch (error) {
      console.error(error);
    }
  }
}

function displayWeatherData(data) {
  const cityName = data.name;

  const weatherCondition = data.weather[0].main;
  const temperature = (data.main.temp - 273.15).toFixed(2); // Convert temperature from Kelvin to Celsius

  document.getElementById("cityName").textContent = `City: ${cityName}`;
  document.getElementById(
    "weatherCondition"
  ).textContent = `Weather: ${weatherCondition}`;
  document.getElementById(
    "temperature"
  ).textContent = `Temperature: ${temperature} °C`;

  changeBackground(weatherCondition);
}

function changeBackground(weatherCondition) {
  const body = document.body;

  switch (weatherCondition.toLowerCase()) {
    case "clear":
      body.style.backgroundColor = "lightyellow";
      break;
    case "clouds":
      body.style.backgroundColor = "gray";
      break;
    case "rain":
      body.style.backgroundColor = "blue";
      break;
    default:
      body.style.backgroundColor = "white";
  }
}

function showLoadingPopup() {
  document.getElementById("loadingPopup").classList.remove("hidden");
}

function hideLoadingPopup() {
  document.getElementById("loadingPopup").classList.add("hidden");
}

function showError(message) {
  alert(message);
}
