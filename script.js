const cityName = document.getElementById(`input_text`);
const addCityBtn = document.getElementById(`input_btn`);

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
const position = document.getElementById(`position`);
const region = document.getElementById(`region`);
const cityForecast = document.getElementById(`cityForecast`);
const tempIcon = document.getElementById(`tempIcon`);

const dateOne = document.getElementById(`dateOne`);
const dateTwo = document.getElementById(`dateTwo`);
const dateTree = document.getElementById(`dateTree`);

const dayOne = document.getElementById(`forecastDayOne`);
const dayTwo = document.getElementById(`forecastDayTwo`);
const dayTree = document.getElementById(`forecastDayTree`);

const cityInLS = JSON.parse(localStorage.getItem('AddedCity')) || [];

window.onload = () => {
    // sectionAddCity.style.display = `none`;
    // displayCity.style.display = `none`;
    // main.style.height = `120vh`;
    // wrapperForecast.style.display = 'block';

    displayCityList();
    for (const i in cityInLS) {
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/weather?city=' + cityInLS[i].name,
            headers: { 'X-Api-Key': 'NpbkZwyOilO2PC3FrakOQg==gaOA2SG7o5Qfar1I'},
            contentType: 'application/json',
            success: function(result) {
                let cityTemp = result.temp;
                cityInLS[i].temp = cityTemp;
                localStorage.setItem(`AddedCity`, JSON.stringify(cityInLS));

                errorMessage.style.display = 'none';
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
                errorMessage.textContent = `City doesn't exist!`;
                errorMessage.style.display = 'block';
            }
        });
    }
}

document.querySelectorAll('.refresh').forEach((item) => {
    item.addEventListener('click', event => {
      location.reload();
    })
});

function addCity(tempr) {          
    const city = {
        name: cityName.value,
        temp: tempr,
        country: `Country`,
    };
    
    cityInLS.push(city);
    cityInLS.splice(5);
    
    localStorage.setItem('AddedCity', JSON.stringify(cityInLS));
};

function requestCityData(city) {
    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/weather?city=' + city,
        headers: { 'X-Api-Key': 'NpbkZwyOilO2PC3FrakOQg==gaOA2SG7o5Qfar1I'},
        contentType: 'application/json',
        success: function(result) {
            console.log(result);
            let cityTemp = result.temp;
            addCity(cityTemp);
            displayCityList();
            requestCityData2();

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

function requestCityData2() {
    for (const i in cityInLS) {
        $.ajax({
            method: 'GET',
            url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityInLS[i].name}/next3days?key=7FK84ZF37VZJ8R7K9872V8EXG`,
            headers: { 'Access-Control-Allow-Origin': 'http://127.0.0.1:5500/'},
            contentType: 'application/json',
            success: function(result) {
                console.log(result);
                let cityCountry = result.resolvedAddress.split(',').pop();
                cityInLS[i].country = cityCountry;
                localStorage.setItem(`AddedCity`, JSON.stringify(cityInLS));
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    }
}

function displayCityList() {
    cityInLS.map((city) => {
        
        let cardCity = `<article class="added_city">
        <h3>${city.name}</h3>
        <p>${city.country}</p>
        <span>${city.temp}°C</span>
        <a href="#" id="${city.name}" class="viewCity">View City</a>
        </article>`;
        displayCity.innerHTML += cardCity;
    });

    const btnViewCity = document.querySelectorAll(`.viewCity`);

    for (let i = 0; i < btnViewCity.length; i++) {
        btnViewCity[i].addEventListener(`click`, function(e) {
            console.log(e.target.id);
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
                    position.textContent = `${result.latitude}°N, ${result.longitude}°E`;
                    
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

addCityBtn.addEventListener(`click`, function() {
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
                    displayCity.innerHTML = ``;
                    requestCityData(cityName.value);
                    errorMessage.style.display = 'none';
                }
            }
        }
    }
});
