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
				console.log("Should see something here.");
				// detect "photoURL" is not unique error and ignore it
				Animal.find({notify:false}, function(err, animals) {
					// check animals here to filter out duplicates
				});
				let isDuplicate = false; // TODO
				if (isDuplicate) return; // ignore the error
				// else report the original error and fail the operation
				return Promise.reject(err);
			});
		}));
	}
};
