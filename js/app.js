
const userLocation = document.querySelector('#user-input');
const divMeteo = document.querySelector('#meteo');


const baseUrl = "http://api.openweathermap.org/data/2.5/";
const apiKey = "50aed4dd88f39aa5e55d04654d94a9ec";

var forecastCanvas;


const getLocationWeather = async function(){
	try {
		const city = this.value;
		const fetchUrl = `${baseUrl}weather?q=${city}&appid=${apiKey}&units=metric`;
		const response = await fetch(fetchUrl);

		if (!response.ok) throw new Error ('Unable to retrieve data for this location.');

		const data = await response.json();

		const conditions = `
			<h3>Current conditions in ${data.name}
				<img src="https://www.countryflags.io/${data.sys.country}/flat/32.png"></h3>
			<p>${data.weather[0].description}</p>
			<div>${Math.round(data.main.temp)} ºC</div>

			<button id="forecast">5-day Forecast</button>
		`;

		divMeteo.innerHTML = conditions;
		const btnForecast = document.querySelector('#forecast');
		btnForecast.addEventListener('click',getForecast);

		if(forecastCanvas) forecastCanvas.destroy();
		
	} catch(error){
		console.error(error);
		divMeteo.innerHTML = `<h3>Sorry, I don't know this city!</h3>`
	}
}

const getForecast = async function(){
	try {
		const city = userLocation.value;
		const fetchUrl = `${baseUrl}forecast?q=${city}&appid=${apiKey}&units=metric`;

		const response = await fetch(fetchUrl);
		if(!response.ok) throw new Error('Unable to retrieve data.');

		const forecastData = await response.json();
		console.log(forecastData);

		const temps = []; 
		const labels = [];
		const precips = [];
		for(i = 0; i < forecastData.list.length; i++){
			temps.push(forecastData.list[i].main.temp);
			labels.push(forecastData.list[i].dt_txt.slice(0,-3));
			
			// if(forecastData.list[i].rain){
			// 	precips.push(forecastData.list[i].rain["3h"])
			// }else {
			// 	precips.push('0');
			// };
		}

		var ctx = document.querySelector('#forecastCanvas').getContext('2d');

		forecastCanvas = new Chart(ctx, {
			type: 'line',
		    data: {
		    	// type: 'line',
		        labels: labels,
		        datasets: [{
		            label: 'Temperatures for next 5 days',
		            data: temps,
		            cubicInterpolationMode: 'monotone',
		            borderColor: 'rgba(255, 99, 132, 0.7)',
		        // },
		        // {
		        // 	type: 'bar',
		        // 	label: 'Precipitation',
		        // 	data: precips,
		        // 	borderColor: 'rgba(30,144,255, 0.7)',
		        }]
		    },
		    options: {
		        scales: {
		            y: {
		                beginAtZero: false
		            }
		        }
		    }
		});

	} catch(error){
		console.log(error);
	}

}

userLocation.addEventListener('change',getLocationWeather);






