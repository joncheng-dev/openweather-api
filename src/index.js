import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import WeatherService from "./weather-service.js";

// User Interface Logic
$(document).ready(function () {
  // Search by City Name
  $("#weatherByCity").click(function () {
    const additions = checkedBoxes();
    const city = $("#city").val();
    clearFields();
    const address = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;
    callApi(additions, address);
  });
  // Search by Zip Code
  $("#weatherByZip").click(function () {
    const additions = checkedBoxes();
    const zipCode = $("#zipCode").val();
    clearFields();
    let countryCode = "us";
    const address = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${process.env.API_KEY}`;
    callApi(additions, address);
  });
  // Search by Coordinates
  $("#weatherbyCoord").click(function () {
    const additions = checkedBoxes();
    const coordLat = $("#coordLat").val();
    const coordLong = $("#coordLong").val();
    clearFields();
    const address = `https://api.openweathermap.org/data/2.5/weather?lat=${coordLat}&lon=${coordLong}&appid=${process.env.API_KEY}`;
    callApi(additions, address);
  });

  function callApi(additions, address) {
    let promise = WeatherService.getWeather(address);

    promise.then(
      function (response) {
        const body = JSON.parse(response);
        getElements(body);
        additionalElements(additions, body);
      },
      function (error) {
        $(".showErrors").text(
          `There was an error processing your request: ${error}`
        );
      }
    );
  }
  // User interface
  function clearFields() {
    $("#city").val("");
    $("#zipCode").val("");
    $("#coordLat").val("");
    $("#coordLong").val("");
    $(".showConditions").text("");
    $(".showFeelsLikeTemp").text("");
    $(".showsHighTemp").text("");
    $(".showHumidity").text("");
    $(".showLowTemp").text("");
    $(".showPressure").text("");
    $(".showTemp").text("");
    $(".showVisibility").text("");
  }
  // User interface
  function getElements(response) {
    $(".showTemp").text(
      `Temperature (in F): ${kToF(response.main.temp)} degrees.`
    );
    $(".showFeelsLikeTemp").text(
      `Feels like: ${kToF(response.main.feels_like)} degrees.`
    );
    $(".showLowTemp").text(`Low: ${kToF(response.main.temp_min)} degrees.`);
    $(".showHighTemp").text(`High: ${kToF(response.main.temp_max)} degrees.`);
    $(".showHumidity").text(`Humidity: ${response.main.humidity}%`);
    $(".showPressure").text(`Pressure: ${response.main.pressure} hPa.`);
  }
  // User interface
  function additionalElements(additions, response) {
    if (additions[0] === 1) {
      $(".showConditions").text(
        `Current conditions: ${response.weather[0].main}.`
      );
    }
    if (additions[1] === 1) {
      $(".showVisibility").text(`Visibility: ${response.visibility}.`);
    }
  }
  // Business logic
  function kToF(kelvin) {
    let fahrenheit;
    fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
    return fahrenheit.toFixed(2);
  }

  function checkedBoxes() {
    const boxesChecked = [];
    const conditionValue = $("#condition:checked").val();
    const visibilityValue = $("#visibility:checked").val();

    if (conditionValue === "on") {
      boxesChecked.push(1);
    } else {
      boxesChecked.push(0);
    }
    if (visibilityValue === "on") {
      boxesChecked.push(1);
    } else {
      boxesChecked.push(0);
    }
    return boxesChecked;
  }
});
