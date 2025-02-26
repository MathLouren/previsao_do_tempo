const history = []; 

function getUserLocation() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const city = data.city;
            getWeather(city); 
        })
        .catch(error => {
            console.error('Erro ao detectar localização:', error);
            document.getElementById('weatherInfo').innerHTML = `<p>Não foi possível detectar sua localização.</p>`;
        });
}

function getWeather(city) {
    const apiKey = '411fbfe0c29a437baaf233915251302'; 
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&lang=pt`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.location) {
                updateWeatherInfo(data);
                updateForecastInfo(data.forecast.forecastday);
                addToHistory(city); 
            } else {
                document.getElementById('weatherInfo').innerHTML = `<p>Cidade não encontrada. Tente novamente.</p>`;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

function updateWeatherInfo(data) {
    const current = data.current;
    const location = data.location;
    
    const localTime = new Date(location.localtime);
    const formattedDate = localTime.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const formattedTime = localTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const weatherInfo = `
        <h2>${location.name}, ${location.country}</h2>
        <p><strong>Data:</strong> ${formattedDate}</p>
        <p><strong>Hora local:</strong> ${formattedTime}</p>
        <p>Temperatura: ${current.temp_c}°C</p>
        <p>Sensação térmica: ${current.feelslike_c}°C</p>
        <p>Condição: ${current.condition.text}</p>
        <p>Umidade: ${current.humidity}%</p>
        <p>Vento: ${current.wind_kph} km/h</p>
        <p>Índice UV: ${current.uv}</p>
        <img src="https:${current.condition.icon}" alt="${current.condition.text}">
    `;
    document.getElementById('weatherInfo').innerHTML = weatherInfo;
}


function updateForecastInfo(forecastDays) {
    let forecastHTML = '';
    forecastDays.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' });

        forecastHTML += `
            <div class="forecast-day">
                <h3>${dayName}</h3>
                <p>Máx: ${day.day.maxtemp_c}°C</p>
                <p>Mín: ${day.day.mintemp_c}°C</p>
                <p>${day.day.condition.text}</p>
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            </div>
        `;
    });
    document.getElementById('forecastInfo').innerHTML = forecastHTML;
}


function addToHistory(city) {
    if (!history.includes(city)) {
        history.push(city);
        if (history.length > 3) history.shift(); 
        updateHistory();
    }
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = history.map(city => `<li onclick="getWeather('${city}')">${city}</li>`).join('');
}

function getCitySuggestions(query) {
    const apiKey = '411fbfe0c29a437baaf233915251302'; 
    const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const suggestions = document.getElementById('suggestions');
            suggestions.innerHTML = '';
            if (data.length > 0) {
                data.forEach(city => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = `${city.name}, ${city.country}`;
                    suggestion.onclick = () => {
                        document.getElementById('cityInput').value = `${city.name}, ${city.country}`;
                        suggestions.innerHTML = '';
                        getWeather(`${city.name}, ${city.country}`);
                    };
                    suggestions.appendChild(suggestion);
                });
                suggestions.style.display = 'block';
            } else {
                suggestions.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar sugestões:', error);
        });
}

document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    getWeather(city);
});

document.getElementById('cityInput').addEventListener('input', function() {
    const query = this.value;
    if (query.length >= 3) {
        getCitySuggestions(query);
    } else {
        document.getElementById('suggestions').style.display = 'none';
    }
});

window.onload = getUserLocation;

document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("acceptCookies");
    const declineBtn = document.getElementById("declineCookies");

    if (localStorage.getItem("cookiesAccepted") === "true") {
        banner.style.display = "none";
    }

    acceptBtn.addEventListener("click", function () {
        localStorage.setItem("cookiesAccepted", "true");
        banner.style.display = "none";
    });

    declineBtn.addEventListener("click", function () {
        localStorage.setItem("cookiesAccepted", "false");
        banner.style.display = "none";
    });
});
