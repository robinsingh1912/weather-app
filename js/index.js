const apiKey = "6df7a3a05b739e9f064400677cefa104";
var loading = true;
var today = Date().toLocaleString().slice(0, 15);
console.log(today);

function setBackground(time) {
  if (time < 24) {
    body = document.getElementsByTagName("body")[0];
    body.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1415025148099-17fe74102b28?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1140&q=80)";
    console.log(body);
  }
}

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
  console.log(lat, lon);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  getData(url);
}

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  loading = true;
  setLoading();
  const cityName = form[0].value;
  console.log(cityName);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  getData(url);
  form.reset();
});

function setLoading() {
  document.querySelector(".loading").style.display = loading ? "block" : "none";
}

function getData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // do stuff with the data
      loading = false;
      setLoading();
      var d = new Date();
      var hours = d.getHours();

      setBackground(hours);
      document.getElementById("error").innerHTML = "";

      if (data.cod === 200) {
        const { name, weather, main, sys } = data;
        const {
          feels_like,
          humidity,
          pressure,
          temp,
          temp_max,
          temp_min,
        } = main;
        console.log(name, sys.country, weather[0].main, temp);
        console.log(data);

        cityName = document.getElementsByClassName("cityName")[0];
        cityName.innerHTML = `${name}, ${sys.country} `;

        date = document.getElementsByClassName("date")[0];
        date.innerHTML = `${today}`;

        temperature = document.getElementsByClassName("temperature")[0];
        temperature.innerHTML = `${temp} 'C`;

        weatherType = document.getElementsByClassName("weatherType")[0];
        weatherType.innerHTML = `${weather[0].main}`;

        tempMinMax = document.getElementsByClassName("tempMinMax")[0];
        tempMinMax.innerHTML = `${temp_min}/${temp_max}`;
      }
      if (data.cod === "404") {
        cityName = document.getElementsByClassName("cityName")[0];
        cityName.innerHTML = data.message;

        date = document.getElementsByClassName("date")[0];
        date.innerHTML = `${today}`;

        temperature = document.getElementsByClassName("temperature")[0];
        temperature.innerHTML = `- 'C`;

        weatherType = document.getElementsByClassName("weatherType")[0];
        weatherType.innerHTML = `--`;

        tempMinMax = document.getElementsByClassName("tempMinMax")[0];
        tempMinMax.innerHTML = `--/--`;
      }
      if (data.cod === "400") {
        var error = document.getElementById("error");
        error.innerHTML = "";
      } else {
        if (data.message) {
          var error = document.getElementById("error");
          error.innerHTML = data.message;
          console.log(data.message);
        }
      }
    })
    .catch(() => {
      console.log("Please search for a valid city 😩");
    });
}
