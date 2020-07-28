// Show additional edit options when edit mode switch on
$('#edit-mode-switch').change(function() {
    if($('#edit-mode-switch').is(':checked')) {
        $('#highlight-span').css('display','block');
        $('#import-voters-btn').css('display','block');
        $('#save-camp-btn').css('display','block');
        $('#delete-camp-form').css('display','block');
    }
    else{
        $('#highlight-span').css('display','none');
        $('#highlight-dropdown-content').css('display','none'); 
        $('#drop-column-span').css('display','none');
        $('#import-voters-btn').css('display','none');
        $('#save-camp-btn').css('display','none');
        $('#delete-camp-form').css('display','none');
    }
});

// Table search funciton
var $rows = $('table tbody tr');
$('#camp-search').keyup(function() {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    
    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

// Pop-ups

function addPopup(msg, delay, feel){
    $(".alert-modal").append('<div class="alert non-animated ' + feel + 
                             '"><i class="icon-notification fa fa-bell feel"></i><span>' + msg + 
                             '</span><i class="fa fa-times icon-delete"></i></div>');
    $(".non-animated").animate({bottom: "0"});
    $(".non-animated").removeClass(".non-animated")
        .delay(2000).fadeOut(function(){
            $(this).remove();
        });
    if($(".alert-modal .alert").length > 1){
        $(".alert-modal .alert").eq(0).remove();
    }
}

$(document).on("click", ".alert-modal .alert", function(){
    $(this).stop(false, true);
});

$("#save-camp-btn").click(function(){
    addPopup("Campaign has been saved!", 2000, "success");
});

// Alerts

function addAlert(msg, feel){
    $(".confirm-modal").append('<div class="confirm non-animated ' + feel + 
                             '"><span>' + msg + '<br><div class="btns"><button type="button" id="confirm-btn">Confirm</button>' + 
                             '<button type="button" id="cancel-btn">Cancel</button></div>' + 
                             '</span><i class="fa fa-times icon-delete"></i></div>');
    if($(".confirm-modal .confirm").length > 1){
        $(".confirm-modal .confirm").eq(0).remove();
    }
    var response = false;
    return response;
}

function confirmCampDelete(){
    var msg = "Are you sure you want to delete this campaign?<br>This action can not be undone"
    addAlert(msg, "warning");
    $(".confirm-modal #cancel-btn").on("click", function(){
        $(".confirm-modal .confirm").remove();
    });
    $('.confirm-modal #confirm-btn').on('click', function(){
        $(".confirm-modal .confirm").remove();
        $('#delete-camp-form').submit();
    });
}

// checking the hidden data
$(document).ready(function(){

    var scriptTitles = $(".script-vals-hidden[data-type='door']").map(function(){return $(this).attr("data-title");}).get();
    scriptTitles.unshift("");

    var selectScriptDiv = document.getElementById("select-script-div");

    var select = document.createElement("select");
    select.id = "select-script";
    selectScriptDiv.appendChild(select);
    $("#select-script").select2({data: scriptTitles, 
                                 width: "45%",
                                 placeholder: "Select a script ..."});

    // add event listener on change

    $('#select-script').on('change', function(e){
        var scriptTitle = $('#select-script').val();
        var scriptContent = $(".script-vals-hidden[data-title='" + scriptTitle + "']").attr("data-content");
        var p = document.createElement('p'); 
        p.innerHTML = scriptContent;
        var scriptArea = document.getElementById("script-content");
        scriptArea.appendChild(p);
    });
});

// on list row click, change data in voter info section
$(document).on('click','#doorTable tr',function(e){
    var id = e.target.parentNode.cells[0].textContent;
    var voter = $(".voter-vals-hidden[data-id='" + id + "']");

    $('#p-dob').html('<b>Date of Birth:</b>' + ' ' + voter.attr("data-dob"))
    $('#p-gender').html('<b>Gender:</b>' + ' ' + voter.attr("data-gender"))
    $('#p-pol-aff').html('<b>Political Affiliation:</b>' + ' ' + voter.attr("data-pol-aff"))
    $('#p-reg-date').html('<b>Registration Date:</b>' + ' ' + voter.attr("data-reg-date"))
    $('#p-ylv').html('<b>Year Last Voted:</b>' + ' ' + voter.attr("data-ylv"))
    $('#p-voter-type').html('<b>Voter Type:</b>' + ' ' + voter.attr("data-voter-type"))
    $('#p-stat').html('<b>Voter Status:</b>' + ' ' + voter.attr("data-stat"))

    $('#p-fn').html('<b>First Name:</b>' + ' ' + voter.attr("data-fn"))
    $('#p-ln').html('<b>Last Name:</b>' + ' ' + voter.attr("data-ln"))
    $('#p-mi').html('<b>Middle Initial:</b>' + ' ' + voter.attr("data-mi"))
    $('#p-hn').html('<b>House Number:</b>' + ' ' + voter.attr("data-hn"))
    $('#p-an').html('<b>Apartment Number:</b>' + ' ' + voter.attr("data-an"))
    $('#p-sa').html('<b>Street Address:</b>' + ' ' + voter.attr("data-sa"))
    $('#p-city').html('<b>City:</b>' + ' ' + voter.attr("data-city"))
    $('#p-zc').html('<b>Zip Code:</b>' + ' ' + voter.attr("data-zc"))
})

function getStatCounts(){
    var numTrs = $("#doorTable").children('tbody').children('tr').length;

    var contactedArray = $('#doorTable td:nth-child(9) select').map(function(){
        return $(this).val();
    }).get()
    var contactedCounts = {};
    for (var i = 0; i < contactedArray.length; i++) {
        var val = contactedArray[i];
        contactedCounts[val] = contactedCounts[val] ? contactedCounts[val] + 1 : 1;
    }
    if(contactedCounts["Yes"]){
        var numContacted = contactedCounts["Yes"];
    }
    else{
        var numContacted = 0;
    }
    
    var respondedArray = $('#doorTable td:nth-child(10) select').map(function(){
        return $(this).val();
    }).get()
    var respondedCounts = {};
    for (var i = 0; i < respondedArray.length; i++) {
        var val = respondedArray[i];
        respondedCounts[val] = respondedCounts[val] ? respondedCounts[val] + 1 : 1;
    }
    if(respondedCounts["Yes"]){
        var numResponded = respondedCounts["Yes"];
    }
    else{
        var numResponded = 0;
    }

    var supportArray = $('#doorTable td:nth-child(11) select').map(function(){
        return $(this).val();
    }).get()
    var supportCounts = {};
    for (var i = 0; i < supportArray.length; i++) {
        var val = supportArray[i];
        supportCounts[val] = supportCounts[val] ? supportCounts[val] + 1 : 1;
    }

    return [numTrs, numContacted, numResponded, supportCounts];
}

// highlight table row
$('#doorTable').bind('click', function(e) {
    if($('#edit-mode-switch').is(':checked')) {
        if($('#edit-choice-higlight').is(':checked')) {
            if($('#dd-choice-red').is(':checked')) {
                $(e.target).closest('tr').children('td').css('background-color','#f94144');
            }
            if($('#dd-choice-orange').is(':checked')) {
                $(e.target).closest('tr').children('td').css('background-color','#f3722c');
            }
            if($('#dd-choice-yellow').is(':checked')) {
                $(e.target).closest('tr').children('td').css('background-color','#f9c74f');
            }
            if($('#dd-choice-green').is(':checked')) {
                $(e.target).closest('tr').children('td').css('background-color','#90be6d');
            }
            if($('#dd-choice-blue').is(':checked')) {
                $(e.target).closest('tr').children('td').css('background-color','#3a86ff');
            }
            if($('#dd-choice-clear').is(':checked')) {
                $(e.target).closest('tr').children('td').css('background-color','#ffffff');
            }
        }
    }
});

// Saving list edits

// On save, get a list of all rows with colors and their color; 
// send to database

$("#save-camp-btn").click(function(){

    var listId = $(this).attr("listId");

    var redList = [];
    var orangeList = [];
    var yellowList = [];
    var greenList = [];
    var blueList = [];

    // loop through each table row
    // get background color and id
    // append to the appropriate list

    $("#doorTable").find('tr').each(function(i) {
        var idCol = $(this).find('td')[0];
        if(idCol){
            var id = idCol.innerHTML;
            var bkgColor = idCol.style.backgroundColor;
            // red
            if(bkgColor == 'rgb(249, 65, 68)'){
                redList.push(id);
            }
            // orange
            else if(bkgColor == 'rgb(243, 114, 44)'){
                orangeList.push(id);
            }
            // yellow
            else if(bkgColor == 'rgb(249, 199, 79)'){
                yellowList.push(id);
            }
            // green
            else if(bkgColor == 'rgb(144, 190, 109)'){
                greenList.push(id);
            }
            // blue
            else if(bkgColor == 'rgb(58, 134, 255)'){
                blueList.push(id);
            }
        }
    });

    var colorData = {
        red: redList,
        orange: orangeList,
        yellow: yellowList,
        green: greenList,
        blue: blueList
    }

    // loop through each custom column; save the template and the content in each row
    customColDict= {};
    $("#doorTable th.custom-col").each(function(){
        var colDict = {}
        var colName = $(this)[0].innerHTML;
        var t = parseInt($(this).index()) + 1;
        $('td:nth-child(' + t + ')').each(function(){
            if($(this).find("select").length > 0){
                var colContent = $(this).find("select").val();
            }
            else if($(this).find("input").length > 0){
                var colContent = $(this).find("input").val();
            }
            else{
                var colContent = $(this)[0].innerHTML;
            }
            var id = $(this).closest('tr').children('td.ID').text();
            colDict[id.toString()] = colContent;
        });
        customColDict[colName] = colDict;
    });

    // Save the counts of the values in the custom cols
    var statCounts = getStatCounts();

    // console.log(colorData);
    // console.log(customColDict);
    // console.log(counts);

    var campUrl = $('#camp-url').val();

    // console.log("/Politiker/campaigns/" + campUrl + "/" + listId + "/save?_method=PUT");

    $.ajax({
        "url": "/Politiker/campaigns/" + campUrl + "/" + listId + "/save?_method=PUT",
        "method": "POST",
        "data": {
            colorData: colorData,
            customColDict: JSON.stringify(customColDict),
            statCounts: statCounts
        },
        "content-type": "application/json",
        success: function(response){
            console.log(response);
            window.location.reload(false);
        },
        error: function(response){
            console.log(response);
            window.location.reload(false);
        }
    });
});

// Highlight the rows as necessary upon page load

$( document ).ready(function() {
    var highlightVals = document.getElementById('highlight-vals').getAttribute('value').replace(/\s+/g, '').replace(/'/g, '');
    
    var redPattern = highlightVals.match(/red:\[([^\]]+)\]/) 
    var orangePattern = highlightVals.match(/orange:\[([^\]]+)\]/)
    var yellowPattern = highlightVals.match(/yellow:\[([^\]]+)\]/)
    var greenPattern = highlightVals.match(/green:\[([^\]]+)\]/)
    var bluePattern = highlightVals.match(/blue:\[([^\]]+)\]/)

    if(redPattern){
        var redList = redPattern[1].split(",");
        redList.forEach(function(id){
            $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').children('td').css('background-color','#f94144');
        });
    }
    if(orangePattern){
        var orangeList = orangePattern[1].split(",");
        orangeList.forEach(function(id){
            $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').children('td').css('background-color','#f3722c');
        });
    }
    if(yellowPattern){
        var yellowList = yellowPattern[1].split(",");
        yellowList.forEach(function(id){
            $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').children('td').css('background-color','#f9c74f');
        });
    }
    if(greenPattern){
        var greenList = greenPattern[1].split(",");
        greenList.forEach(function(id){
            $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').children('td').css('background-color','#90be6d');
        });
    }
    if(bluePattern){
        var blueList = bluePattern[1].split(",");
        blueList.forEach(function(id){
            $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').children('td').css('background-color','#3a86ff');
        });
    }
});

// Add the custom columns upon page load

$(document).ready(function() {
    var customInputs = $(".customCols-vals-hidden");
    customInputs.each(function(i){
        var colName = customInputs[i].getAttribute('data-colname');
        var colIds = customInputs[i].getAttribute('data-colids');
        var colVals = customInputs[i].getAttribute('data-colval');

        var idList = colIds.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        var valList = colVals.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        valList = valList.map(function(item) {
            return item.replace (/"/g,'');
          });

        var idValMap = {};
        idList.forEach(function(id, i){
            idValMap[id] = valList[i]
        });

        // console.log(idValMap);

        if(colName === "Visited"){
            for(var id of Object.keys(idValMap)){
                // get row with specific id; go to the last cell; set the value to the value associated with the key
                $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').find('td:nth-child(9)').find('select').val(idValMap[id]);
            }
        }
        else if(colName === "Spoken To"){
            for(var id of Object.keys(idValMap)){
                // get row with specific id; go to the last cell; set the value to the value associated with the key
                $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').find('td:nth-child(10)').find('select').val(idValMap[id]);
            }
        }
        else if(colName === "Level of Support"){
            for(var id of Object.keys(idValMap)){
                // get row with specific id; go to the last cell; set the value to the value associated with the key
                $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').find('td:nth-child(11)').find('select').val(idValMap[id]);
            }
        }
        else{
            for(var id of Object.keys(idValMap)){
                // get row with specific id; go to the last cell; set the value to the value associated with the key
                $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').find('td:nth-child(12)').find('div').html(idValMap[id]);
            }
        }
    });
});

// dynamically create and update top stats upon page load
$(document).ready(function(){
    
    var counts = getStatCounts();

    var numTrs = counts[0];
    var numContacted = counts[1];
    var numResponded = counts[2];

    $("#stats-total-voters-body h3").text(numTrs);
    $("#stats-voters-contacted h3").text(numContacted);
    $("#stats-voters-responded h3").text(numResponded);
    $("#stats-voters-to-contact h3").text(numTrs - numContacted);
});

// dynamically create and update top stats upon select change
$(document).on('change','#doorTable select',function(){
    var counts = getStatCounts();

    var numTrs = counts[0];
    var numContacted = counts[1];
    var numResponded = counts[2];

    $("#stats-total-voters-body h3").text(numTrs);
    $("#stats-voters-contacted h3").text(numContacted);
    $("#stats-voters-responded h3").text(numResponded);
    $("#stats-voters-to-contact h3").text(numTrs - numContacted);
});

// Dropdown Events

function toggleDropdown(id) {
    var dropdown = document.getElementById(id);
    var display = dropdown.style.display;
    if(display === ""){
        dropdown.style.display = "block";
    }
    else{
        dropdown.style.display = "";
    }
}

// Show loading screen on page load

window.addEventListener("load", function(){
    var loader = document.querySelector(".loader");
    loader.className += " hidden";
});