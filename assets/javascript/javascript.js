

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCTS_NoLnOjXtEYewrpsEIGRNB-9_vyzog",
    authDomain: "train-project-d6bbc.firebaseapp.com",
    databaseURL: "https://train-project-d6bbc.firebaseio.com",
    projectId: "train-project-d6bbc",
    storageBucket: "",
    messagingSenderId: "385880129545"
};
firebase.initializeApp(config);


// Create a variable to reference the database
var database = firebase.database();

//Initalize Variables
var trainName = '';
var destination = '';
var trainTime = '';
var frequency = 0;
var nextArrival = '';
var minutesAway = '';
var difference = '';
moment().format();
console.log(moment().format("MMM Do YY"));

//On click function to get form data
// Capture Button Click
$("#submit-id").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text-boxes
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    trainTime = $("#train-time").val().trim();
    frequency = $("#frequency").val().trim();


    // Code for "Setting values in the database"
    database.ref().push({
        trainName: trainName,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency,
    });
    console.log(trainTime);

    // Alert
    alert("Train successfully added");

    //Clear form text fields
    $("#train-name").val('');
    $("#destination").val('');
    $("#train-time").val('');
    $("#frequency").val('');
});

// --------------------------------------------------------------

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase has a "child" pushed to the database.
database.ref().on("child_added", function (snapshot) {
    var data = snapshot.val();
    console.log(data.trainName)
    console.log(data.destination);
    var fluxTrainTime = data.trainTime;
    console.log(data.trainTime);
    var fluxFrequency = data.frequency;
    console.log(data.frequency);
    console.log(data.now);
    //Save the key in a variable.
    var childKey = snapshot.key;
    console.log(childKey);
    // Format the TrainTime into Unix ms Timestamp
    var startTrain = moment(fluxTrainTime, "HH:mm").subtract(1, 'years').format("X");
    console.log(startTrain);
    // Take the difference between the current moment and startTrain then gets the modulo of the frequency in minutes.
    difference = moment().diff(moment.unix(startTrain), "minutes") % fluxFrequency;
    console.log(difference);
    //Subtract the frequency of the train from the differnce from current and start time modulo frequency to get trains minutesAway
    minutesAway = fluxFrequency - difference;
    console.log(minutesAway);
    //Find the nextArrival by adding the minutes away to the current time
    nextArrival = moment().add(minutesAway, 'm').format('hh:mm A');
    //Create button on each row
    var button = $('<button>');
    button.addClass('checkbox');
    button.addClass("btn btn-outline-danger");
    button.append('X');
    // Create a new row for each "child_added"
    var newRow = $('<tr>');
    //Append the form submition and results to table.
    $(newRow).append('<td>' + data.trainName + '</td>')
    $(newRow).append('<td>' + data.destination + '</td>')
    $(newRow).append('<td>' + data.frequency + '</td>')
    $(newRow).append('<td>' + nextArrival + '</td>')
    $(newRow).append('<td>' + minutesAway + '</td>')
    $(newRow).append(button)
    $(newRow).attr('key', childKey);
    // Append newRow data to the table
    $('#table').append(newRow);


    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

//Create an on click function to remove row 
$(document.body).on("click", "tr", function () {

    // Get the key attribute form the button clicked
    var key = $(this).attr('key');
    console.log(key);
    //Remove the child form the database.
    database.ref().child(key).remove();
    //Reload the page, this will remove the row
    location.reload();
});
//Super hacky way to get the minutes away to update every 2 minutes
//Every 2 minutes the page reloads
setInterval(function () { location.reload() }, 120000);

