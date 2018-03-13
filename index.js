let WEATHER_DATA = []; // 
const CONDITIONS = {
  main: {
    'Clear sky': 'http://openweathermap.org/img/w/01d.png',
    'Few clouds': 'http://openweathermap.org/img/w/02d.png',
    'Clouds': 'http://openweathermap.org/img/w/02d.png',
    'Scattered clouds': 'http://openweathermap.org/img/w/03d.png',
    'Broken clouds': 'http://openweathermap.org/img/w/04d.png',
    'Shower rain': 'http://openweathermap.org/img/w/09d.png',
    'Rain': 'http://openweathermap.org/img/w/10d.png',
    'Thunderstorm': 'http://openweathermap.org/img/w/11d.png',
    'Snow': 'http://openweathermap.org/img/w/13d.png',
    'Mist': 'http://openweathermap.org/img/w/50d.png'
  },
  wind: [ '<a href="http://tinypic.com?ref=2uhwvgk" target="_blank"><img src="http://i68.tinypic.com/2uhwvgk.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=28takuc" target="_blank"><img src="http://i68.tinypic.com/28takuc.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=280jfb5" target="_blank"><img src="http://i68.tinypic.com/280jfb5.png" border="0" alt="Image and video hosting by TinyPic"></a>'],
  temperature:['<a href="http://tinypic.com?ref=ivlikx" target="_blank"><img src="http://i67.tinypic.com/ivlikx.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=2qiz3as" target="_blank"><img src="http://i68.tinypic.com/2qiz3as.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=126fzna" target="_blank"><img src="http://i66.tinypic.com/126fzna.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=2qibn1z" target="_blank"><img src="http://i63.tinypic.com/2qibn1z.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=9sugw8" target="_blank"><img src="http://i66.tinypic.com/9sugw8.png" border="0" alt="Image and video hosting by TinyPic"></a>'
    ]
};

$('.location-form').submit(event => {
  event.preventDefault();
  const area = $(event.currentTarget).find('#location');
  let city = area.val();
  console.log('city from submission: ' + city);
  area.val(" ");
  weatherInformation(city);
});

// google map api is going to render the map to .map
// the location will be provided from input
// we'll use that input to pass to map api to focus on the area 

// weather api
function weatherInformation(city){
  $('.weather-text').html(`<p></p>`);
  $('.weather-image').html(`<div></div>`);
  console.log('city from weatherInformation: ' + city);
  $.ajax({
    url : `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=3c2ae1668b32134ba5c910ca0375caaa`,
    type: "GET",
    dataType: "jsonp",
    success: function(data) {
      WEATHER_DATA = data;
      console.log('weaterdata from weatherInformation: ' + WEATHER_DATA);
      initMap();
    }
  });
}

function initMap() {
  console.log('weatherdata from initMap: ' + JSON.stringify(WEATHER_DATA));
  let latNum = WEATHER_DATA.coord.lat || 40;
  let lngNum = WEATHER_DATA.coord.lon || 73;
  let coordinates = {
    lat: latNum,
    lng: lngNum
  };
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: coordinates
  });
  let marker = new google.maps.Marker({
    position: coordinates,
    map: map
  });
}

// Attach a delegated event handler
$('.weather-options').on( "click", "button", function( event ) {
    event.preventDefault();
    switch ($(this).attr('class')) {
      case 'main-condition': 
        let condition = WEATHER_DATA.weather[0].main;
        $('.weather-image').html(`<img src=${CONDITIONS.main[condition]}>`);
        $('.weather-text').html(`<p>${condition}</p>`);
        break;
      case 'wind-speed':
        windConditions();
        break;
      case 'temp-measure':
        temperatureConditions();
        let temp = WEATHER_DATA.main.temp;
        console.log(temp);
        break;
      default:
        break;
    }
});

// their weather selection from input will be passed to the 
// weather api 
let mainCond = 'thunderstorm';

// these should all be moved to a CONDITIONS key
function windConditions(){
  let windspeed = WEATHER_DATA.wind.speed;
  if(windspeed >= .1 && windspeed <= 5){
    $('.weather-image').html(`<img ${CONDITIONS.wind[2]}>`);
    $('.weather-text').html(`<p>Light Breeze ${windspeed}m/s</p>`);
    console.log('yess');
  }else if(windspeed >= 5.01 && windspeed <= 16.99){
    $('.weather-image').html(`<img ${CONDITIONS.wind[1]}`);
    $('.weather-text').html(`<p>Moderate Breeze ${windspeed}m/s</p>`);
    console.log('wind');
  }else if(windspeed >= 17 && windspeed <= 27){
    $('.weather-image').html(`<img ${CONDITIONS.wind[0]}>`);
    $('.weather-text').html(`<p>Strong Gale ${windspeed}m/s</p>`);
    console.log("High Wind Speed");
  }
}

function temperatureConditions(){
  let temp = WEATHER_DATA.main.temp;
  console.log('yes');
  if(temp <= 0){
    $('.weather-image').html(`<img ${CONDITIONS.temperature[0]}>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
    console.log('Cold');
  }
  else if(temp >= .5 && temp <=10){
    $('.weather-image').html(`<img ${CONDITIONS.temperature[1]}>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
    console.log('Sweater Weather');
  }
  else if(temp >= 10.55 && temp <=21){
    $('.weather-image').html(`<img ${CONDITIONS.temperature[2]}>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
    console.log('Warm');
  }
  else if(temp >= 21.1 && temp <=27){
    $('.weather-image').html(`<img ${CONDITIONS.temperature[3]}>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
    console.log('Nice Hot');
  }

}

$(weatherInformation('Bronx'));