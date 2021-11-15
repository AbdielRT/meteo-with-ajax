const userLocation = document.querySelector("#user-input");
const divMeteo = document.querySelector("#meteo");

// OpenWeather API: stock url addresses and api key
const baseUrl = "https://api.openweathermap.org/data/2.5/";
const apiKey = "50aed4dd88f39aa5e55d04654d94a9ec";
const iconURL = "https://openweathermap.org/img/wn/";

// global variable for Chart in order to clear the chart
var forecastChart;

// 1st async function to get current weather conditions
const getLocationWeather = async function () {
  try {
    // retrieves input value from the user
    const city = this.value;
    const fetchUrl = `${baseUrl}weather?q=${city}&appid=${apiKey}&units=metric`;

    // fetches information from the API
    const response = await fetch(fetchUrl);

    // test for error in the communication with the API
    if (!response.ok)
      throw new Error("Unable to retrieve data for this location.");

    // saves fetched data in json format
    const data = await response.json();

    // prepare html structure with the retrieved weather info, as well as a country flag
    // from a 2nd API www.countryflags.io
    const conditions = `
			<h3>Current conditions in ${data.name}
				<img id="countryFlag" 
				src="https://www.countryflagicons.com/FLAT/32/${data.sys.country}.png"></h3>
			<img id='icon' src='${iconURL}${data.weather[0].icon}@2x.png'>
			<p>${data.weather[0].description}</p>
			<div><span>${Math.round(data.main.temp)}</span> ºC</div>
			`;
    // writes current conditions in html
    divMeteo.innerHTML = conditions;

    // clears previous chart in case there was already another one
    if (forecastChart) forecastChart.destroy();
  } catch (error) {
    // display error in console
    console.error(error);
    // display a message in web page for unknown city name
    divMeteo.innerHTML = `<h3>Hmm, I can not find this city.</h3>`;
  }
};

// 2nd async function to get 5-day forecast from OpenWeather API
const getForecast = async function () {
  try {
    const city = userLocation.value;
    const fetchUrl = `${baseUrl}forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error("Unable to retrieve data.");

    const forecastData = await response.json();
    // console.log(forecastData);

    // prepares empty arrays for incoming data for 5-day forecast
    const temps = [];
    const dates = [];
    const precips = [];

    // loop to stock 40 points data for the forecast
    for (i = 0; i < forecastData.list.length; i++) {
      temps.push(Math.round(forecastData.list[i].main.temp));
      dates.push(forecastData.list[i].dt_txt.slice(0, -3));

      // checks for precipitation forecast if available
      if (forecastData.list[i].rain) {
        precips.push(forecastData.list[i].rain["3h"]);
      } else {
        precips.push("0");
      }
    }

    // ******* Chart.js for 5 day forecast **********

    // create context for canvas
    var ctx = document.querySelector("#forecastCanvas").getContext("2d");

    // stock chart in forecastChart
    forecastChart = new Chart(ctx, {
      maintainAspectRatio: true,
      data: {
        labels: dates,
        datasets: [
          {
            // Dataset for temperatures
            type: "line",
            label: "Temperature",
            data: temps,
            cubicInterpolationMode: "monotone",
            backgroundColor: "rgba(255, 99, 132, 0.7)",
            borderColor: "rgba(255, 99, 132, 0.7)",
            yAxisID: "y1",
          },
          {
            // Dataset for precipitations
            type: "bar",
            label: "Precipitation",
            data: precips,
            borderColor: "rgba(130,144,255, 0.7)",
            backgroundColor: "rgba(130,144,255, 0.7)",
            yAxisID: "y2",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y1: {
            // beginAtZero: false
            title: {
              display: true,
              text: "Celsius",
            },
          },
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y2: {
            // precipitations axis on the right
            position: "right",
            title: {
              display: true,
              text: "mm",
            },
            grid: {
              // no grid lines for precipitations
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// Listen to user input and calls functions on change
userLocation.addEventListener("change", getLocationWeather);
userLocation.addEventListener("change", getForecast);
