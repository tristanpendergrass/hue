var request = require('request');
var colors = require('./colors.js');

var baseUrl = 'http://192.168.1.5/api/newdeveloper';
//var baseUrl = 'http://72.70.51.89/api/newdeveloper';

var fullRed   = colors.hexToCIE1931(colors.hexFullRed);
var fullGreen = colors.hexToCIE1931(colors.hexFullGreen);
var fullBlue  = colors.hexToCIE1931(colors.hexFullBlue);
var fullWhite = colors.hexToCIE1931(colors.hexFullWhite);

function sendHueRequest (url, data, callback) {
  request({
	url: url,
	method: 'PUT',
	body: data,
	json: true
  }, callback);
}

function turnLightToColor (light, color, callback) {
  var url = baseUrl + '/lights/' + light + '/state';
  var params = {
	transitiontime: 0,
	on: true,
	bri: 254,
	xy: color
  };

  sendHueRequest(url, params, callback);
}

var turnLightToRandomColor = (function () {
  var lastColor;

  function getRandomColor(colors) {
	colors = colors.slice();

	if (lastColor && colors.indexOf(lastColor) > -1) {
	  colors.splice(colors.indexOf(lastColor), 1);
	}
	  
	var randomInt = getRandomInt(0, colors.length);
	var randomColor = colors[randomInt];

	lastColor = randomColor;
	return randomColor;
  }

  // optionally specify the colors array
  return function (light, colors, callback) {
	var colors = colors || [fullRed, fullGreen, fullBlue, fullWhite];
	var color = getRandomColor(colors);

	turnLightToColor(light, color, callback);
  }
}());

function cycleRandomColors (lights, colors, interval) {
  interval = interval || 500;

  setInterval(function () {
	turnLightToRandomColor('2', colors);
	//lights.forEach(function (light) {
	  //turnLightToRandomColor(light, colors);
	//});
  }, interval);
}

// min (inclusive), max (exclusive)
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//cycleRandomColors(['1', '2', '3'], [fullRed, fullBlue[>, fullGreen, fullWhite<]], 250);

var sequence = [
  { repetitions: 20, interval: 50 },
  { repetitions: 10, interval: 100 },
  { repetitions: 10, interval: 125 },
  { repetitions: 10, interval: 150 },
  { repetitions: 5, interval: 300 },
  { repetitions: 3, interval: 500 }
];

runPartOfSequence(sequence);

function runPartOfSequence (sequence, part) {
  if (typeof part === 'undefined') {
	part = 0;
  }

  if (part < sequence.length) {
	var repetitions = sequence[part].repetitions;
	var interval = sequence[part].interval;
	var count = 0;

	function runRecursive (callback) {
	  turnLightToRandomColor('2', [fullRed, fullBlue, fullWhite]);
	  if (count < repetitions) {
		count++;
		console.log('next change in', interval);
		setTimeout(function () {
		  runRecursive(callback)
		}, interval);
	  } else {
		callback();
	  }
	}

	runRecursive(function () {
	  runPartOfSequence(sequence, part + 1);
	});
  }
}

