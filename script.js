const cityName = document.getElementById(`input_text`);
const addCityBtn = document.getElementById(`input_btn`);

const sectionAddCity = document.getElementById(`add_city`);
const displayCity = document.getElementById(`displayed_city`);
const main = document.getElementById(`main`);

const errorMessage = document.getElementById(`type_error`);
const regExInput = /^[A-Z][a-z]+( [a-zA-Z0-9_]+)*$/;

const cityInLS = JSON.parse(localStorage.getItem('AddedCity')) || [];

window.onload = () => {
    sectionAddCity.style.display = `none`;
    displayCity.style.display = `none`;
    main.style.height = `120vh`;

    // displayCityList();
    // for (const i in cityInLS) {
    //     $.ajax({
    //         method: 'GET',
    //         url: 'https://api.api-ninjas.com/v1/weather?city=' + cityInLS[i].name,
    //         headers: { 'X-Api-Key': 'NpbkZwyOilO2PC3FrakOQg==gaOA2SG7o5Qfar1I'},
    //         contentType: 'application/json',
    //         success: function(result) {
    //             let cityTemp = result.temp;
    //             cityInLS[i].temp = cityTemp;
    //             localStorage.setItem(`AddedCity`, JSON.stringify(cityInLS));

    //             errorMessage.style.display = 'none';
    //         },
    //         error: function ajaxError(jqXHR) {
    //             console.error('Error: ', jqXHR.responseText);
    //             errorMessage.textContent = `City doesn't exist!`;
    //             errorMessage.style.display = 'block';
    //         }
    //     });
    // }
}

function addCity(tempr) {          
    const city = {
        name: cityName.value,
        temp: tempr,
    };
    // console.log(city.name);
    
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
            let cityTemp = result.temp;
            addCity(cityTemp);
            displayCityList();

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


function displayCityList() {
    cityInLS.map((city) => {
        
        let cardCity = `<article class="added_city">
        <h3>${city.name}</h3>
        <p>Country</p>
        <span>${city.temp}°C</span>
        <a href="#" id="${city.name}" class="viewCity">View City</a>
        </article>`;
        displayCity.innerHTML += cardCity;
    });

    const btnViewCity = document.querySelectorAll(`.viewCity`);
    console.log(btnViewCity);
    for (let i = 0; i < btnViewCity.length; i++) {
        btnViewCity[i].addEventListener(`click`, function(e) {
            console.log(e.target.id);
            // sectionAddCity.style.display = `none`;
            // displayCity.style.display = `none`;
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

// Forecast

const API_FORECAST = `7FK84ZF37VZJ8R7K9872V8EXG`;

document.addEventListener('click', (e) =>
  {
    // Retrieve id from clicked element
    let elementId = e.target.id;
    // If element has id
    if (elementId !== '') {
        console.log(elementId);
    }
    // If element has no id
    else { 
        console.log("An element without an id was clicked.");
    }
  }
);

fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Belgrade?unitGroup=metric&key=7FK84ZF37VZJ8R7K9872V8EXG&contentType=json`).then((data) => console.log(data));