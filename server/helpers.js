module.exports = {
	compare(arr1, arr2) {
		let match;
		for(i = 0; i < arr1.length; i++) {
			if (arr1[i].value === arr2[i].value) match = true
			else {
				match = false
				break;
			}
		}
		return match
	}
}

// Array.prototype.compare = function (arr) {
// 	let match;
// 	for (i = 0; i < this.length; i++) {
// 		if (this[i].value === arr[i].value)
// 			match = true;
// 		else {
// 			match = false;
// 			break;
// 		}
// 	}
// 	return match;
// };