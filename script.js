const apiKey = "6491aca056341b9568ba8317be7b643c"; // Your OpenWeather API key

// Map weather condition to Lottie animation URLs
const iconMap = {
  Clear: "https://assets2.lottiefiles.com/packages/lf20_t24tpvcu.json",
  Clouds: "https://assets2.lottiefiles.com/packages/lf20_jmBauI.json",
  Rain: "https://assets2.lottiefiles.com/packages/lf20_Stt1R9.json",
  Thunderstorm: "https://assets2.lottiefiles.com/packages/lf20_XkF78Y.json"
};

async function getWeather(city) {
  city = city || document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    updateUI(data);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

function updateUI(data) {
  document.getElementById("cityName").innerText = `${data.name}, ${data.sys.country}`;

  document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;

  document.getElementById("wind").innerText = `${data.wind.speed} km/h`;

  document.getElementById("humidity").innerText = `${data.main.humidity}%`;

  document.getElementById("feels").innerText = `${Math.round(data.main.feels_like)}°C`;

  const condition = data.weather[0].main;

  // Update Lottie player animation URL dynamically
  const weatherIcon = document.getElementById("weatherIcon");
  weatherIcon.load(`https://assets2.lottiefiles.com/packages/lf20_t24tpvcu.json`); // reset before setting new src (optional)
  weatherIcon.setAttribute("src", iconMap[condition] || iconMap["Clouds"]);

  setTheme(condition);
}

function getLocationWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );

      if (!res.ok) throw new Error("Location weather not found");

      const data = await res.json();
      updateUI(data);
    } catch (error) {
      alert("Error: " + error.message);
    }
  }, () => {
    alert("Unable to retrieve your location");
  });
}

/* dynamic theme */
function setTheme(condition) {
  if (condition === "Clear") {
    document.body.style.background =
      "linear-gradient(to right, #fceabb, #f8b500)";
  } else if (condition === "Rain") {
    document.body.style.background =
      "linear-gradient(to right, #4e54c8, #8f94fb)";
  } else {
    document.body.style.background =
      "linear-gradient(-45deg, #4facfe, #00f2fe, #43e97b, #38f9d7)";
  }
}

/* dark mode toggle */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};