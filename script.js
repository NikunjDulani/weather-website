"use strict";

const API = "3f3331041c06f22a57f913c28f87cc63";

const dayEL = document.querySelector('.default_day');
const dateEL = document.querySelector('.default_date');
const btnEl = document.querySelector('.btn_search');
const inputEL = document.querySelector('.input_field');

const iconsContainer = document.querySelector('.icons');
const dayInfoEL = document.querySelector('.day_info');
const listContentEL = document.querySelector('.list_content ul');
const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thrusday",
    "Friday",
    "Saturday",
];

// display the date
const day = new Date()
const dayName = days[day.getDay()];
dayEL.textContent = dayName;

//display date
let month = day.toLocaleDateString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();

console.log();
dateEL.textContent = date + " " + month + " " + year;

//add event
btnEl.addEventListener('click', (e) => {
    e.preventDefault();

    //check empty value
    if (inputEL.value!== "") {
        const Search = inputEL.value;
        inputEL.value = "";

        findLocation(Search);
    } else {
        console.log("Please enter City or Country name");
    }
});

async function findLocation(name) {
    iconsContainer.innerHTML = "";
    dayInfoEL.innerHTML = "";
    listContentEL.innerHTML = "";
    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const data = await fetch(API_URL);
        const result = await data.json();
        console.log(result);

        if (result.cod!== "404") {
            //display image content
            const ImageContent = displayImageContent(result);
            //display right side content
            const rightSide = rightSideContent(result);
            //forecast function
            displayForecast(result.coord.lat, result.coord.lon);
            setTimeout(()=>{
                iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
                iconsContainer.classList.add("fadeIn");
            dayInfoEL.insertAdjacentHTML("afterbegin", rightSide);
            },1500);
        } else {
            const message = `<h2 class="weather_temp">${result.cod}</h2>
            <h3 class="cloudtxt">${result.message}</h3>`;
            iconsContainer.insertAdjacentHTML("afterbegin", message);
        }
    } catch (error) {}
}

//display image content and temp
function displayImageContent(data) {
    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="">
        <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}°C</h2>
        <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

//display right side content
function rightSideContent(result){
    return`<div class="content">
                            <p class="title">NAME</p>
                            <span class="value">${result.name}</span>
                        </div>
                        <div class="content">
                            <p class="title">TEMP</p>
                            <span class="value">${Math.round(result.main.temp - 275.15)}°C</span>
                        </div>
                        <div class="content">
                            <p class="title">HUMIDITY</p>
                            <span class="value">${result.main.humidity}%</span>
                        </div>
                        <div class="content">
                            <p class="title">WIND SPEED</p>
                            <span class="value">${result.wind.speed}km/h</span>
                        </div>`;
}

async function displayForecast(lat,long){
    const Forecast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
    const data = await fetch(Forecast_API);
    const result = await data.json();
    

    //filter the forecast
    const uniqueForecastdays = [];
    const daysForecast = result.list.filter((forecast)=>{
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if(!uniqueForecastdays.includes(forecastDate)){
            return uniqueForecastdays.push(forecastDate);
        }
    });
    console.log(daysForecast);

    daysForecast.forEach((content,indx)=>{
        if(indx<=3){
            listContentEL.insertAdjacentHTML("afterbegin",forecast(content))
        }
    })
}

//forecast html element data
function forecast(frContent){

    const day = new Date(frContent.dt_txt);
    const dayName = days[day.getDay()];
    const splitDay = dayName.split("",3);
    const joinDay = splitDay.join("");


    
    return `<li>
                                <img src=" https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png" />
                                <span>${joinDay}</span>
                                <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
                            </li>`
}