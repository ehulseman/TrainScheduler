/* global moment firebase */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAXzEX2ZhL6JDTaSN9GSVmgMkYHQuvArMw",
    authDomain: "train-schedule-f3e74.firebaseapp.com",
    databaseURL: "https://train-schedule-f3e74.firebaseio.com",
    projectId: "train-schedule-f3e74",
    storageBucket: "train-schedule-f3e74.appspot.com",
    messagingSenderId: "395772113560"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var frequency = 0;
var firstTrainTime = "";

// Capture button click for inputs
$("#submit-train-schedule").on("click", function () {
    // Don't refresh the page!
    event.preventDefault();

    //Capturing the values for each input
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#first-train-time").val();
    frequency = $("#frequency").val().trim();

    // Calculations to solve for Minutes Away and Next Arrival
    // Grabbing the current time 
    var now = moment(); 
    var currentTime = moment(now).format("HH:mm");

    console.log("firstTrainTime: " + firstTrainTime);

    //Converting entered time into a format
    var formattedTime = moment(firstTrainTime, "HH:mm");  
    console.log("firstTrainTime: " + formattedTime);

    var displayFirstTrain = moment(formattedTime).format("HH:mm")
    console.log("formattedTime: " + displayFirstTrain);

    //Solving to get the difference between the Current Time and Formatted Time
    var timeDifference = moment().diff(moment(formattedTime), "minutes");
    console.log("timeDifference: " + timeDifference); 

    //**  moment() automatically returns the current time, .diff(moment(enteredTime), "minutes") handles the math 
    //**  formattedTime - as opposed to displayFirstTrain - reads as 1509703200000 - this allows momentJS to perform said math operations

    //Solving to get the remainder
    var remainingMinutes = timeDifference % frequency; 

    console.log("frequency: " + frequency);
    console.log("remainingMinutes: " + remainingMinutes);

    //Solving for Minutes Away
    var minutesAway = frequency - remainingMinutes
    console.log("This is minutes away (frequency - remainingMinutes): " + minutesAway);

    //Solving for Next Arrival
    var nextArrival = moment().add(minutesAway, "minutes");
    console.log("This is the Next Arrival: " + moment(nextArrival).format("HH:mm")); 

    var displayNextArrival = moment(nextArrival).format("HH:mm");

    // Handling the "initial load"
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: displayFirstTrain,
        frequency: frequency,
        nextArrival: displayNextArrival,
        minutesAway: minutesAway,
    });
});

database.ref().on("child_added", function (childSnapshot) {

    //console logging all this data
    console.log("Train Name: " + childSnapshot.val().trainName);
    console.log("Destination: " + childSnapshot.val().destination);
    console.log("First Train Time: " + childSnapshot.val().firstTrainTime);
    console.log("Frequency: " + childSnapshot.val().frequency);
    console.log("Next Arrival: " + childSnapshot.val().nextArrival);
    console.log("Minutes Away: " + childSnapshot.val().minutesAway);

    // Adding data to the table
    var tableData = "<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + childSnapshot.val().nextArrival + "</td><td>" + childSnapshot.val().minutesAway + "</td></tr>";

    $("#train-table").append(tableData);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

});