/*
main.js
Author: Kirill Volodkin
Created date: 2019-10-21

This script will run the logic on the page - change styles for different rows as the time goes, save user input, 
retrieve user input and show on a screen.
*/

var currentDateTime = moment();
//currentDateTime = moment("2019-10-24 11:00 AM", "YYYY-MM-DD HH:mm A"); // for testing purposes only

//function to display current date on the top of the screen
function displayDate () {
    var date = currentDateTime.format("YYYY, MMM DD");
    $("#today").text(date);
}

//function to color rows depending on the current time
function colorRecords () {
    $.each($("tr"), function (index) {
        var thisTime = moment($(this).children(".slot.time_slot")[0].innerText, "HH:mm A").format("HH"); // time from the row
        var currentHour = currentDateTime.format("HH"); 
        if (thisTime === currentHour) {
            $(this).children("td.slot.event_slot")[0].setAttribute("class", "slot event_slot current")
        }
        else if (thisTime > currentHour) {
            $(this).children("td.slot.event_slot")[0].setAttribute("class", "slot event_slot future")
        }
        else {
            $(this).children("td.slot.event_slot")[0].setAttribute("class", "slot event_slot past")
            $(this).children("td.slot.event_slot").children("input")[0].setAttribute("disabled","true");
        }
    }
    );    
}

function saveRecord () {
    var value = $(this).parent().parent().children("td.slot.event_slot").children("input").val(); //value in the record where button was pressed
    var thisTime = $(this).parent().parent().children("td.slot.time_slot").text(); //time of the record where button was pressed
    var thisDay = currentDateTime.format("YYYY-MM-DD"); //today
    //console.log(thisTime + " " + value);
    thisEvent = {
        day: thisDay,
        time: thisTime,
        event: value
    }
    var stored = window.localStorage.getItem("events");
    if (!stored) {
        toSave = JSON.stringify([thisEvent]);
    }
    else {
        stored = JSON.parse(stored);
        stored.push(thisEvent);
        toSave = JSON.stringify(stored);
    }
    window.localStorage.setItem("events", toSave);

}

function displayRecords () {
    deleteOldData();
    var stored = window.localStorage.getItem("events");
    if (!stored) {
        return;
    }
    else {
        stored = JSON.parse(stored);
        for (item of stored) {
            $.each($("tr"), function () {
                //console.log($(this).children("td.slot.time_slot").text());
                if ($(this).children("td.slot.time_slot").text() === item.time) {
                    $(this).children("td.slot.event_slot").children("input").val(item.event); //set input to be the value of event
                }
            }
            );
        }
    }
}

function deleteOldData () {
    var stored = window.localStorage.getItem("events");
    if (!stored) {
        return;
    }
    else {
        stored = JSON.parse(stored);
        stored = stored.filter(function (item) {
            return item.day === currentDateTime.format("YYYY-MM-DD");
        })
        //console.log(stored);
        window.localStorage.setItem("events", JSON.stringify(stored));
    }
}

displayDate();
colorRecords();
displayRecords();

$("button").on("click", saveRecord);

