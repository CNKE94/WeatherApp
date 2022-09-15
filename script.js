const cityName = document.getElementById(`input_text`);
const addCityBtn = document.querySelectorAll(`.addCityBtn`);

const sunIcon = document.querySelector(`.sun_icon`);
const header_title = document.getElementById(`header_title`);

const sectionAddCity = document.getElementById(`add_city`);
const displayCity = document.getElementById(`displayed_city`);
const main = document.getElementById(`main`);
const wrapperForecast = document.getElementById(`wrapperForecast`);

const errorMessage = document.getElementById(`type_error`);
const regExInput = /^[A-Z][a-z]+( [a-zA-Z0-9_]+)*$/;

const pressure = document.getElementById(`pressure`);
const wind = document.getElementById(`wind`);
const uvIndex = document.getElementById(`uvIndex`);
const humidy = document.getElementById(`humidy`);
const feelsLike = document.getElementById(`feelsLike`);
const temperature = document.getElementById(`temperature`);
const positionN = document.getElementById(`positionN`);
const positionE = document.getElementById(`positionE`);
const region = document.getElementById(`region`);
const cityForecast = document.getElementById(`cityForecast`);
const tempIcon = document.getElementById(`tempIcon`);

const dateOne = document.getElementById(`dateOne`);
const dateTwo = document.getElementById(`dateTwo`);
const dateTree = document.getElementById(`dateTree`);

const dayOne = document.getElementById(`forecastDayOne`);
const dayTwo = document.getElementById(`forecastDayTwo`);
const dayTree = document.getElementById(`forecastDayTree`);

// LocalStorage
const cityInLS = JSON.parse(localStorage.getItem('AddedCity')) || [];

// function who add city name and country in LS
function addCity(cityPased, country) {          
    const city = {
        name: cityPased,
        country: country,
    };
    
    cityInLS.push(city);
    cityInLS.splice(5);
    
    localStorage.setItem('AddedCity', JSON.stringify(cityInLS));
};

// When clicked on weather header (title and sun icon) refresh page
document.querySelectorAll('.refresh').forEach((item) => {
    item.addEventListener('click', event => {
      location.reload();
    })
});

// On load refresh data for each city pulling its name from LS
window.onload = () => {
    cityInLS.map((city, index) => {
        setTimeout(() => {
            requestCityData(city.name, city.country);
          }, 500*index);
    });
}

// funtion for requesting API 1 (city temperature)
function requestCityData(city, country) {
    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/weather?city=' + city,
        headers: { 'X-Api-Key': 'NpbkZwyOilO2PC3FrakOQg==gaOA2SG7o5Qfar1I'},
        contentType: 'application/json',
        success: function(result) {
            let cardCity = `<article class="added_city">
                <h3>${city}</h3>
                <p>${country}</p>
                <span>${result.temp}°C</span>
                <a href="#" id="${city}" class="viewCity">View City</a>
                </article>`;
            displayCity.innerHTML += cardCity;
            showViewCityDeatils();

            cityName.value = ``;
            errorMessage.style.display = 'none';
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
            errorMessage.textContent = `City doesn't exist!`;
            errorMessage.style.display = 'block';
        }
    });
}

// function for requsting API 2 (forecast) for country name and puting it on each city card (because on first API there is no come back data for city and state)
function requestCityData2() {
    $.ajax({
        method: 'GET',
        url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName.value}/next3days?key=7FK84ZF37VZJ8R7K9872V8EXG`,
        headers: { 'Access-Control-Allow-Origin': 'http://127.0.0.1:5500/'},
        contentType: 'application/json',
        success: function(result) {
            let cityCountry = result.resolvedAddress.split(',').pop();
            addCity(cityName.value, cityCountry);
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    });
}

// function for calling API 2 (forecast) and showing it the screen on second page
function showViewCityDeatils() {
    const btnViewCity = document.querySelectorAll(`.viewCity`);

    for (let i = 0; i < btnViewCity.length; i++) {
        btnViewCity[i].addEventListener(`click`, function(e) {
            sectionAddCity.style.display = `none`;
            displayCity.style.display = `none`;
            wrapperForecast.style.display = 'block';
            main.style.height = `120vh`;

            let cityClicked = e.target.id;
            $.ajax({
                method: 'GET',
                url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityClicked}/next3days?key=7FK84ZF37VZJ8R7K9872V8EXG`,
                headers: { 'Access-Control-Allow-Origin': 'http://127.0.0.1:5500/'},
                contentType: 'application/json',
                success: function(result) {
                    let hour = result.resolvedAddress.split(`,`);
                    let regionLocation = hour[hour.length - 2] + ',' + hour.pop();

                    cityForecast.textContent = result.address;
                    region.textContent = regionLocation;
                    positionN.textContent = `${result.latitude}°N`; 
                    positionE.textContent = `${result.longitude}°E`;
                    
                    temperature.textContent = Math.ceil((result.currentConditions.temp - 32) / 1.8) + '°C';
                    tempIcon.src = 'images/WeatherIcon/' + result.currentConditions.icon + '.png';
                    
                    let uvIndexString = ``;
                    if (result.currentConditions.uvindex < 3) {
                        uvIndexString = 'Low';
                    }
                    if (result.currentConditions.uvindex > 2 && result.currentConditions.uvindex < 6) {
                        uvIndexString = 'Medium';
                    }
                    if (result.currentConditions.uvindex > 5 && result.currentConditions.uvindex < 8) {
                        uvIndexString = 'High';
                    }
                    if (result.currentConditions.uvindex > 7 && result.currentConditions.uvindex < 11) {
                        uvIndexString = 'Very high';
                    }
                    if (result.currentConditions.uvindex == 11) {
                        uvIndexString = 'Extreme';
                    }

                    feelsLike.textContent = Math.round((result.currentConditions.feelslike - 32) / 1.8)  + '°C';
                    humidy.textContent = result.currentConditions.humidity + '%';
                    pressure.textContent = result.currentConditions.pressure + ' mbar';
                    wind.textContent = result.currentConditions.winddir + ' m/s SE';
                    uvIndex.textContent = uvIndexString;

                    const date1 = new Date(result.days[1].datetime);
                    const date2 = new Date(result.days[2].datetime);
                    const date3 = new Date(result.days[3].datetime);
                    const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    
                    dateOne.textContent = `${weeks[date1.getDay()]}, ${months[date1.getMonth()]} ${date1.getDate()}`;
                    dateTwo.textContent = `${weeks[date2.getDay()]}, ${months[date2.getMonth()]} ${date2.getDate()}`;
                    dateTree.textContent = `${weeks[date3.getDay()]}, ${months[date3.getMonth()]} ${date3.getDate()}`;

                    const displayHourlyWeather1 = result.days[1].hours;
                    const displayHourlyWeather2 = result.days[2].hours;
                    const displayHourlyWeather3 = result.days[3].hours;

                    const arrayHouryWeather = [displayHourlyWeather1, displayHourlyWeather2, displayHourlyWeather3];
                    const daysForecast = [dayOne, dayTwo, dayTree];

                    for (let i = 0; i < arrayHouryWeather.length; i++) {
                        arrayHouryWeather[i].map((data) => {
                            let hour = data.datetime.split(`:`);
                            let displayWeather = `
                            <article>
                                <p>${hour[0]}h</p>
                                <img src="images/WeatherIcon/${data.icon}.png" alt="iconTemp" class="iconForecastTemp">
                                <p>${Math.round((data.temp - 32) / 1.8)}°</p>
                            </article>`;
                            daysForecast[i].innerHTML += displayWeather;
                        })
                        
                    }
                },
                error: function ajaxError(jqXHR) {
                    console.error('Error: ', jqXHR.responseText);
                }
            });
            
        })
    }
}

// On click add city and + adding it to the first page after validation if the input text is valid
for (let i = 0; i < addCityBtn.length; i++) {
    addCityBtn[i].addEventListener(`click`, function() {
        if(cityName.value == ``) {
            errorMessage.textContent = `Empty field`;
            errorMessage.style.display = `block`;
        } else {
            errorMessage.style.display = `none`;
            if(!regExInput.test(cityName.value)) {
                errorMessage.textContent = `Incorrect format search`;
                errorMessage.style.display = 'block';
            } else {
                errorMessage.style.display = 'none';
                if(cityInLS.length == 5) {
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = `Favorites full!`;
                } else {
                    errorMessage.style.display = 'none';
                    if (cityInLS.some(city => city.name === cityName.value)) {
                        errorMessage.style.display = 'block';
                        errorMessage.textContent = `City is in favorites`;
                    } else {
                        requestCityData2();
                        setTimeout(() => {
                            requestCityData(cityName.value, cityInLS[cityInLS.length - 1].country);
                          }, 500)
                        errorMessage.style.display = 'none';
                    }
                }
            }
        }
    });
}
