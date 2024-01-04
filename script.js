// Selecting DOM elements
const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i");

// Weatherbit API key
const apiKey = "0d89beb02ec849bc8761dfce0af2d4b1"; // Create and add your own Weatherbit API key from https://www.weatherbit.io/
let api;

// Event listener for input field keyup
inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    // Constructing Weatherbit API URL for city search
    api = `https://api.weatherbit.io/v2.0/current?city=${inputField.value}&key=${apiKey}`;
    fetchData();
  }
});


// Event listener for "Get Device Location" button
locationBtn.addEventListener("click", () => {
  // Get current geolocation coordinates
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support geolocation API");
  }
});

// Success callback for geolocation
function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  // Constructing Weatherbit API URL for geolocation
  api = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`;
  fetchData();
}

// Error callback for geolocation
function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

// Function to fetch weather data from Weatherbit API
function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");

  // Fetching data from Weatherbit API
  fetch(api)
    .then((res) => res.json())
    .then((result) => {
      if (result.error) {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
      } else {
        const observation = result.data[0];
        const city = observation.city_name;
        const country = observation.country_code;
        const { description } = observation.weather;
        const { temp, app_temp, rh } = observation;

        const weatherConditionCodes = {
          '200': 'Thunderstorm with light rain',
          '201': 'Thunderstorm with rain',
          '202': 'Thunderstorm with heavy rain',
          '210': 'Light thunderstorm',
          '211': 'Thunderstorm',
          '212': 'Heavy thunderstorm',
          '221': 'Ragged thunderstorm',
          '230': 'Thunderstorm with light drizzle',
          '231': 'Thunderstorm with drizzle',
          '232': 'Thunderstorm with heavy drizzle',
          '300': 'Light intensity drizzle',
          '301': 'Drizzle',
          '302': 'Heavy intensity drizzle',
          '310': 'Light intensity drizzle rain',
          '311': 'Drizzle rain',
          '312': 'Heavy intensity drizzle rain',
          '313': 'Shower rain and drizzle',
          '314': 'Heavy shower rain and drizzle',
          '321': 'Shower drizzle',
          '500': 'Light rain',
          '501': 'Moderate rain',
          '502': 'Heavy intensity rain',
          '503': 'Very heavy rain',
          '504': 'Extreme rain',
          '511': 'Freezing rain',
          '520': 'Light intensity shower rain',
          '521': 'Shower rain',
          '522': 'Heavy intensity shower rain',
          '531': 'Ragged shower rain',
          '600': 'Light snow',
          '601': 'Snow',
          '602': 'Heavy snow',
          '611': 'Sleet',
          '612': 'Light shower sleet',
          '613': 'Shower sleet',
          '615': 'Light rain and snow',
          '616': 'Rain and snow',
          '620': 'Light shower snow',
          '621': 'Shower snow',
          '622': 'Heavy shower snow',
          '701': 'Mist',
          '711': 'Smoke',
          '721': 'Haze',
          '731': 'Dust or sand',
          '741': 'Fog',
          '751': 'Sand',
          '761': 'Dust',
          '762': 'Volcanic ash',
          '771': 'Squalls',
          '781': 'Tornado',
          '800': 'Clear sky',
          '801': 'Few clouds',
          '802': 'Scattered clouds',
          '803': 'Broken clouds',
          '804': 'Overcast clouds'
        };

        const weatherCode = observation.weather.code;
        const weatherDescription = weatherConditionCodes[weatherCode] || 'Unknown';

        // Display the weather description or use it as needed in your UI
        weatherPart.querySelector(".weather").innerText = weatherDescription;

        if (weatherCode == 800) {
          wIcon.src =
            "https://drive.google.com/uc?export=view&id=13TlzPFrICsSEB3llo6PWuywWpoL6ywxb";
        } else if (weatherCode >= 200 && weatherCode <= 232) {
          wIcon.src =
            "https://drive.google.com/uc?export=view&id=13eqt-OgtVphxXYpIHd9Q7QOBNocK0Onq";
        } else if (weatherCode >= 600 && weatherCode <= 622) {
          wIcon.src =
            "https://drive.google.com/uc?export=view&id=13Z9FbAC1FJ-ptr55vUWUufLBCrhgjbF1";
        } else if (weatherCode >= 701 && weatherCode <= 781) {
          wIcon.src =
            "https://drive.google.com/uc?export=view&id=13YVPMlryJ3168jk-VR_zfTvVBL6Xeaqs";
        } else if (weatherCode >= 801 && weatherCode <= 804) {
          wIcon.src =
            "https://drive.google.com/uc?export=view&id=13TVP9iuZz8A9cf3OtJCgTmeS9AtJ-B3R";
        } else if ((weatherCode >= 500 && weatherCode <= 531) || (weatherCode >= 300 && weatherCode <= 321)) {
          wIcon.src =
            "https://drive.google.com/uc?export=view&id=13YoLrgIqfw6UHTu0x4yqTRLIyCbT1O6e";
        }

        // Updating DOM with weather details
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(
          ".location span"
        ).innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(
          app_temp
        );
        weatherPart.querySelector(".humidity span").innerText = `${rh}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
      }
    })
    .catch((error) => {
      // Handle fetch error
      console.error("Error fetching data:", error);
      infoTxt.innerText = "Something went wrong, API Error";
      infoTxt.classList.replace("pending", "error");
    });
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
