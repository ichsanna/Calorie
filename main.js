const back = require('androidjs').back;
const sha1 = require('sha1');
const axios = require('axios');

back.on("login", function (username, password) {
	password = sha1(password + "ld10252k")
	axios.get('https://testproject-23aed.firebaseio.com/users/' + username + ".json").then(resp => {
		var password1 = resp.data.password
		var status
		if (password1 != null && password == password1) {
			status = "yes"
		}
		else status = "no"
		back.send("authenticate", status);
	}).catch(err => {
		back.send("authenticate", "no");
	})
});
back.on("whichone", function (username) {
	axios.get('https://testproject-23aed.firebaseio.com/users/' + username + "/profile.json").then(resp => {
		if (resp.data.ageValue != null) {
			back.send("thisone", "yes");
		}
		else back.send("thisone", "no");
	}).catch(err => {
		back.send("thisone", "no");
	})
});
back.on("sendprofile", function (username, genderValue, heightValue, weightValue, ageValue, activityValue, optimalCalorie) {
	axios.put('https://testproject-23aed.firebaseio.com/users/' + username + "/profile.json",
		{
			genderValue: genderValue,
			heightValue: heightValue,
			weightValue: weightValue,
			ageValue: ageValue,
			activityValue: activityValue,
			calorie: {
				optimalCalorie: optimalCalorie,
				todayCalorie: 0,
				statusCalorie: "Kurang"
			}
		},
		{
			"Content-Type": "application/json"
		}).then(resp => {
			back.send("displaycalorie")
		})
})
back.on("getcaloriedata", function (username) {
	axios.get('https://testproject-23aed.firebaseio.com/users/' + username + "/profile/calorie.json").then(resp => {
		optimalCalorie = resp.data.optimalCalorie
		todayCalorie = resp.data.todayCalorie
		statusCalorie = resp.data.statusCalorie
		back.send("gotcalorie", optimalCalorie, todayCalorie, statusCalorie);
	}).catch(err => {
		alert("error")
	})
})
back.on("sendcaloriedata", function (username, optimalCalorie, todayCalorie, statusCalorie) {
	axios.put('https://testproject-23aed.firebaseio.com/users/' + username + "/profile/calorie.json",
		{
			optimalCalorie: optimalCalorie,
			todayCalorie: todayCalorie,
			statusCalorie: statusCalorie
		},
		{
			"Content-Type": "application/json"
		}).then(resp => {
			back.send("gotcalorie", optimalCalorie, todayCalorie, statusCalorie);
		})
		.catch(err => {
			alert("error")
		})
})