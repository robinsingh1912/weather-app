const apiKey = "";

//set background acording to time
var today = Date().toLocaleString().slice(0, 15);
function setBackground(time) {
  body = document.getElementsByTagName("body")[0];
  if (time > 5 && time < 9) {
    body.style.backgroundImage =
      "linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75)),url(https://wallpapershome.com/images/pages/pic_h/19715.jpg)";
  } else if (time > 9 && time < 17) {
    body.style.backgroundImage =
      "linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75)),url(https://wallpapershome.com/images/pages/pic_h/11925.jpg)";
  } else if (time > 17 && time < 20) {
    body.style.backgroundImage =
      "linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75)),url(https://wallpapershome.com/images/pages/pic_h/20035.jpg)";
  } else {
    body.style.backgroundImage =
      "linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75)),url(https://wallpapershome.com/images/pages/pic_h/21456.jpg)";
  }
}

//get location coordinates
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  //console.log(lat, lon);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  getData(url);
}

//call the api for data
function getData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // do stuff with the data
      setLoading(false);

      var d = new Date();
      var hours = d.getHours();
      setBackground(hours);

      document.getElementById("error").innerHTML = "";

      if (data.cod === 200) {
        const { name, weather, main, sys, wind } = data;
        const {
          feels_like,
          humidity,
          pressure,
          temp,
          temp_max,
          temp_min,
        } = main;
        //console.log(name, sys.country, weather[0].main, temp, wind.speed);

        setData(
          name,
          sys.country,
          today,
          feels_like,
          humidity,
          pressure,
          temp,
          temp_max,
          temp_min,
          weather[0].main,
          weather[0].description,
          wind.speed
        );
      } else if (data.cod === "404") {
        setData(
          data.message,
          "",
          today,
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "weather N/A",
          "-",
          "-"
        );
      } else if (data.cod === "400") {
        var error = document.getElementById("error");
        error.innerHTML = "";
      } else {
        if (data.message) {
          var error = document.getElementById("error");
          error.innerHTML = data.message;
        }
      }
    })
    .catch(() => {
      console.log("Please search for a valid city 😩");
    });
}

//call the api custom search
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const cityName = form[0].value.trim();
  if (cityName !== "") {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    getData(url);
  }
  form.reset();
});

//Loading screen
function setLoading(isLoading) {
  document.querySelector(".loading").style.display = isLoading
    ? "block"
    : "none";
}

//get Weather icon
function getIcon(weather) {
  if (weather === "weather N/A" || weather === undefined) return null;
  else if (weather === "Haze")
    return `<img src="https://img.icons8.com/fluent/48/000000/fog-day.png"/>`;
  else if (weather === "Clouds")
    return `<img src="https://img.icons8.com/fluent/48/000000/clouds.png"/>`;
  else if (weather === "Clear")
    return `<img src="https://img.icons8.com/fluent/48/000000/sun.png"/>`;
  else if (weather === "Rain")
    return `<img src="https://img.icons8.com/fluent/48/000000/rain.png"/>`;
  else if (weather === "Dust")
    return `<img src="https://img.icons8.com/color/48/000000/dust.png"/>`;
  else if (weather === "Sand")
    return `<img src="https://img.icons8.com/color/48/000000/dust.png"/>`;
  else if (weather === "Snow" || weather === "Drizzle")
    return `<img src="https://img.icons8.com/color/48/000000/snow.png"/>`;
  else if (weather === "Fog" || weather === "Mist")
    return `<img src="https://img.icons8.com/color/48/000000/fog-night.png"/>`;
  else if (weather === "Thunderstorm")
    return `<img src="https://img.icons8.com/color/48/000000/lightning-bolt.png"/>`;
  else if (weather === "Mist")
    return `<img src="https://img.icons8.com/color/48/000000/lightning-bolt.png"/>`;
  else
    return `<img src="https://img.icons8.com/fluent/48/000000/smiling-sun.png"/>`;
}

//display data on screen
function setData(
  cityName,
  country,
  date,
  feels_like,
  humidity,
  pressure,
  temp,
  temp_max,
  temp_min,
  weather_main,
  weather_description,
  wind_speed
) {
  iconElmt = document.getElementsByClassName("icon")[0];
  iconElmt.innerHTML = getIcon(weather_main);

  cityNameElmt = document.getElementsByClassName("cityName")[0];
  cityNameElmt.innerHTML = `${cityName} ${country} `;

  dateElmt = document.getElementsByClassName("date")[0];
  dateElmt.innerHTML = `${date}`;

  humidityElmt = document.getElementsByClassName("humidity")[0];
  humidityElmt.innerHTML = `${humidity}%`;

  fellsLike = document.getElementsByClassName("fellsLike")[0];
  fellsLike.innerHTML = `Feels Like ${feels_like} 'C`;

  temperature = document.getElementsByClassName("temperature")[0];
  temperature.innerHTML = `${Math.floor(temp)}`;

  pressureElmt = document.getElementsByClassName("pressure")[0];
  pressureElmt.innerHTML = `${pressure} hPa`;

  windSpeedElmt = document.getElementsByClassName("windSpeed")[0];
  windSpeedElmt.innerHTML = `${wind_speed} m/s`;

  weatherType = document.getElementsByClassName("weatherType")[0];
  weatherType.innerHTML = `${weather_description}`;

  tempMinMax = document.getElementsByClassName("tempMinMax")[0];
  tempMinMax.innerHTML = `${temp_min}/${temp_max}`;
}
