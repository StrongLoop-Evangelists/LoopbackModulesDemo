'use strict';

var request = require('request-promise');
var Promise = require('bluebird');

module.exports = function(Animal) {
	Animal.validatesUniquenessOf('photoURL');

	Animal.observe('access', function(context) {
		return Promise.all([
			fetch('Bears'),
			fetch('Cats'),
		]).spread(bears, cats) => {
			var allData = [].concat(bears).concat(cats);
			return updateAnimals(allData);
		};
	});
	
	function fetch(urlPath) {
		if (urlPath === "Bears") {
			return request({
				uri: 'http://0.0.0.0:5000/api/' + urlPath,
				json: true
			});
		} else {
			return request({
				uri: 'http://0.0.0.0:6000/api/' + urlPath,
				json: true
			});
		}
		
	}
	
	function updateAnimals(list) {
		return Promise.all(list.map(animalJSON => {
			let photoURL = animalJSON.photoURL;
			let looksFriendly = animalJSON.looksFriendly;
			let plural = animalJSON.plural;
			let animalType = animalJSON.animalType;
			return Animal.create({
				"photoURL": photoURL, 
				"looksFriendly": looksFriendly, 
				"plural": plural,
				"animalType": animalType
			}).then(null, err => {
				// detect "photoURL" is not unique error and ignore it
				let isDuplicate = // TODO;
				if (isDuplicate) return; // ignore the error
				// else report the original error and fail the operation
				return Promise.reject(err);
			});
		}));
	}
};