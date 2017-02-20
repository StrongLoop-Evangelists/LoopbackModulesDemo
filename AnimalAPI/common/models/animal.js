'use strict';

var request = require('request-promise');
var Promise = require('bluebird');

module.exports = function(Animal) {
	Animal.observe('access', function(context) {
		return Promise.all([
			fetch('http://0.0.0.0:5000/api/Bears'),
			fetch('http://0.0.0.0:6000/api/Cats'),
		]).spread((bears, cats) => {
			var allData = [].concat(bears).concat(cats);
			return updateAnimals(allData);
		});
	});

	function fetch(url) {
		return request({uri: url, json: true});
	}

	function updateAnimals(newAnimals) {
		return Animal.find({}, {notify: false})
			.then(cachedAnimals => {
				let lookup = Object.create(null);
				for (let animal of cachedAnimals) {
					lookup[animal.photoURL] = true;
				}
				return newAnimals.filter(animal => !(animal.photoURL in lookup));
			})
			.then(animalsToAdd => {
				return Promise.all(animalsToAdd.map(addAnimalToCache));
			});
	}

	function addAnimalToCache(animalJSON) {
		let photoURL = animalJSON.photoURL;
		let looksFriendly = animalJSON.looksFriendly;
		let plural = animalJSON.plural;
		let animalType = animalJSON.animalType;
		return Animal.create({
			"photoURL": photoURL,
			"looksFriendly": looksFriendly,
			"plural": plural,
			"animalType": animalType
		});
	}
};
