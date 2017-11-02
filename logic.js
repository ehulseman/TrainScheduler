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
    firstTrainTime = $("first-train-time").val();
    console.log("Firsttraintime: " + firstTrainTime);
    frequency = $("#frequency").val().trim();


    // Calculations to solve for Minutes Away and Next Arrival
    // Grabbing the current time 
    var currentTime = moment().format("HH:mm");
    console.log("currentTime: " + currentTime);

    //Converting entered time into a format
    var enteredTime = moment(childSnapshot.val().firstTrainTime, 'HH:mm');
    console.log("enteredTime: " + enteredTime);

    var formattedTime = moment(firstTrainTime).format("HH:mm");
    console.log("formattedTime: " + formattedTime);

    //Solving to get the difference between the Current Time and Formatted Time
    var timeDifference = currentTime - formattedTime;
    console.log("timeDifference: " + timeDifference);

    //Solving to get the remainder
    var remainingMinutes = timeDifference % frequency;
    console.log("remainingMinutes: " + remainingMinutes);

    //Solving for Minutes Away
    var minutesAway = frequency - remainingMinutes;
    console.log("This is minutes away (frequency - remainingMinutes): " + minutesAway);

    //Solving for Next Arrival
    var nextArrivalSolved = minutesAway + currentTime;
    console.log("This is the Next Arrival Time Solved (minutesAway + currentTime): " + nextArrivalSolved);

    var nextArrival = moment(nextArrivalSolved).format("HH:mm");
    console.log("Next Arrival: " + nextArrival);

    // Handling the "initial load"
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        nextArrival: nextArrival,
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