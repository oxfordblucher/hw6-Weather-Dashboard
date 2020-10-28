$(document).ready(function () {

    var userInput = $('#search');
    var searchButton = $('button');

    qdCities = [];

    searchButton.on('click', function () {
        var city = userInput.val();
        window.localStorage.setItem("city", city);
        qdCities.push(city);
        populateWeatherdata(city);
        renderSearch();
        window.localStorage.setItem("searches", JSON.stringify(qdCities));
    })

    function renderSearch() {
        $("#cityList").html("");
        for (let i = 0; i < qdCities.length; i++) {
            const qdCity = qdCities[i];
            var nuLi = $("<li class='list-group-item'>");
            nuLi.text(qdCity);
            nuLi.attr("id", qdCity);
            nuLi.on('click', function (event) {
                var city = $(this).text();
                populateWeatherdata(city);
            })
            $("#cityList").append(nuLi);
    }}

    function populateWeatherdata(city) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather";
        var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

        $.ajax({
            url: queryUrl,
            data: {
                q: city,
                units: "imperial",
                APPID: "dc8154684c519c00cf1c67748fcc8af5"
            },
            method: 'GET'
        }).then(function (response) {
            $("#displaytemp").text(response.main.temp);
            $("#displayhumidity").text(response.main.humidity);
            $("#displaywindspeed").text(response.wind.speed);
            getUVIndex(response.coord.lat, response.coord.lon);
            $("#currentcity").text(response.name);
            $('#currentdate').text(moment.unix(response.dt).format('dddd MMM Do h:mm a'));
            var icon = response.weather[0].icon;
            var weatherImg = $("<img>");
            weatherImg.attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png")
            $("#currentcity").append(weatherImg);
        });

        $.ajax({
            url: forecastUrl,
            data: {
                q: city,
                units: "imperial",
                APPID: "dc8154684c519c00cf1c67748fcc8af5"

            },
            method: 'GET'
        }).then(function (response) {
            $('#displayforecast').empty();
            for (var i = 0; i < response.list.length; i += 8) {
                var cardEl = $("<div class='card col-sm'>");
                var containerEl = $("<div class='container'>");
                var dateEl = $('<h5>');
                dateEl.text(moment.unix(response.list[i].dt).format('dddd MMM Do'));
                var temperatureEl = $("<p>");
                var humidityEl = $("<p>");
                temperatureEl.text("Temperature " + response.list[i].main.temp);
                humidityEl.text("Humidity " + response.list[i].main.humidity);
                containerEl.append([dateEl, humidityEl, temperatureEl]);
                cardEl.append(containerEl);
                $('#displayforecast').append(cardEl);
                var weatherImg = $("<img>");
                var icon = response.list[i].weather[0].icon;
                weatherImg.attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
                dateEl.append(weatherImg);
            }
        });

    }
    function getUVIndex(lat,lon) {
        uviUrl = "https://api.openweathermap.org/data/2.5/uvi"

        $.ajax({
            url: uviUrl,
            data: {
                lat: lat,
                lon: lon,
                APPID: "dc8154684c519c00cf1c67748fcc8af5"
            },
            method: 'GET'
        }).then(function (response) {
            var uvDisplay = $("#displayuvindex")
            uvDisplay.text(response.value);
            if (response.value > 8) {
                uvDisplay.attr("style","background-color: purple");
            }
            if (response.value <= 8) {
                uvDisplay.attr("style","background-color: red");
            } 
            if (response.value <= 5) {
                uvDisplay.attr("style","background-color: yellow");
            } 
            if (response.value <= 2) {
                uvDisplay.attr("style","background-color: green");
            } 
        });
    }

    initPage();

    function initPage() {
        if (localStorage.getItem("city") !== null) {
            var city = localStorage.getItem("city");
            populateWeatherdata(city);
            var retrievedSrch = localStorage.getItem("searches");
            qdCities = JSON.parse(retrievedSrch);
            console.log(qdCities);
        }
        renderSearch();
    }
    }
);