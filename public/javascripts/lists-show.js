// Events & functions to add filters to list form

var thCount = document.getElementsByTagName("th").length;
if(thCount < 12){
    document.getElementById("votersTable").style.tableLayout = "fixed";
}

// Get the area in the html where the filters are added
var filterArea = document.getElementById('addFiltersArea');

// Create variables for each filter
var cityCheckbox = document.getElementById('cityCheckbox');
var zipcodeCheckbox = document.getElementById('zipcodeCheckbox');
var dobCheckbox = document.getElementById('dobCheckbox');
var genderCheckbox = document.getElementById('genderCheckbox');
var polAffCheckbox = document.getElementById('polAffCheckbox');
var voterTypeCheckbox = document.getElementById('voterTypeCheckbox');
var yrLastVotedCheckbox = document.getElementById('yrLastVotedCheckbox');
var electDisCheckbox = document.getElementById('electDisCheckbox');
var assemDisCheckbox = document.getElementById('assemDisCheckbox');
var congDisCheckbox = document.getElementById('congDisCheckbox');
var counDisCheckbox = document.getElementById('counDisCheckbox');
var senDisCheckbox = document.getElementById('senDisCheckbox');
var civCourtDisCheckbox = document.getElementById('civCourtDisCheckbox');
var judDisCheckbox = document.getElementById('judDisCheckbox');
var regDateCheckbox = document.getElementById('regDateCheckbox');

// Choices for each select filter to be added
var cityArray = ['Brooklyn','Breezy Point'];
var zipcodeArray = ['11697','11230','11210'];
var genderArray = ['M','F'];
var polAffArray = ['DEM','BLK','REP','CON','IND','WOR','LBT','GRE'];
var voterTypeArray = ['P','R','H','4'];
var yrLastVotedArray = ['2019','2018','2017','2016','2015','2014','2013','2012',
                        '2011','2010','2009','2008','2006','2005','2004','2002',
                        '2001','2000','1999','1997','1996','1994','1993','1992',
                        '1989','1988','1986','1985','1984','1980'];
var electDisArray = ['001','002'];
var assemDisArray = ['23','41'];
var congDisArray = ['05','09'];
var counDisArray = ['32','48'];
var senDisArray = ['15','17'];
var civCourtDisArray = ['05','08'];
var judDisArray = ['02','11'];

// // Filter Functions

// Create input function
function createInput(filterId, placeHolder, labelName, dateBool, createTo = filterArea){

    var label = document.createElement("label");
    label.id = filterId + 'Label'
    label.for = filterId;
    label.innerHTML = labelName;
    createTo.appendChild(label);

    var label = document.getElementById(filterId + 'Label');

    var input = document.createElement("input");
    input.id = filterId;
    var filterName = filterId.slice(0, -6)
    if(['title','description','fields'].includes(filterName)){
        input.name = "list[" + filterId.slice(0, -6) + "]";
    }
    else{
        input.name = "list[filters][" + filterId.slice(0, -6) + "]";
    }
    input.type = 'text';
    input.placeholder = placeHolder;
    label.appendChild(input);

    if(dateBool){
        $("#" + filterId).daterangepicker({
            startDate: "1900-01-01",
            autoUpdateInput: false,
            locale: {
                format: "YYYY-MM-DD",
                cancelLabel: 'Clear'
            }
        });
      
        $("#" + filterId).on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
        });
      
        $("#" + filterId).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
    }
}

// Add input function
function addInput(checkboxId, filterId, placeHolder, labelName, dateBool){

    var check = document.getElementById(checkboxId).checked;
    var filter = document.getElementById(filterId);

    if(check){
        if(!filter){

            createInput(filterId, placeHolder, labelName, dateBool);

            if(dateBool){
                addDateFilterListen(filterId);
            }
            else{
                addFilterListen(filterId);
            }
        }
    }
    else{
        if(filter){
            filter.remove();
            document.getElementById(filterId + 'Label').remove();
        }
    }
}

// Create select function
function createSelect(filterId, arrayName, labelName, createTo = filterArea){

    var label = document.createElement("label");
    label.id = filterId + 'Label'
    label.for = filterId;
    label.innerHTML = labelName;
    createTo.appendChild(label);

    var label = document.getElementById(filterId + 'Label');

    var select = document.createElement("select");
    select.id = filterId;
    select.class = "filter-key";
    var filterName = filterId.slice(0, -6)
    if(['title','description','fields'].includes(filterName)){
        select.name = "list[" + filterId.slice(0, -6) + "]";
    }
    else{
        select.name = "list[filters][" + filterId.slice(0, -6) + "]";
    }
    select.multiple = "multiple";
    label.appendChild(select);
    $("#" + filterId).select2();

    var filter = document.getElementById(filterId);

    $('#' + filterId).select2({
        data: arrayName
    });
}

// Add select function
function addSelect(checkboxId, filterId, arrayName, labelName){

    var check = document.getElementById(checkboxId).checked;
    var filter = document.getElementById(filterId);

    if(check){
        if(!filter){

            createSelect(filterId, arrayName, labelName);

            addFilterListen(filterId);
        }
    }
    else{
        if(filter){
            $('#' + filterId).select2('destroy');
            filter.remove();
            document.getElementById(filterId + 'Label').remove();
        }
    }
}

// List of fields

var fieldsArray = ['ID', 'County EMSID', 'First Name', 'Last Name', 'Middle Initial', 'Name Suffix',
                    'House Number', 'Apartment Number', 'Street Name', 'City', 'Zip Code', 'Date of Birth',
                    'Gender', 'Political Affiliation', 'Election District', 'Assembly District', 
                    'Congressional District', 'Council District', 'Senate District', 'Civil Court District',
                    'Judicial District', 'Registration Date', 'Status Code', 'Voter Type', 
                    'Eff. Status Change Date', 'Year Last Voted', 'Telephone Number'];


// Add event listeners to inputs boxes

cityCheckbox.addEventListener('click', function(){
    addSelect('cityCheckbox', 'cityFilter', cityArray, 'City: ');
});

zipcodeCheckbox.addEventListener('click', function(){
    addSelect('zipcodeCheckbox', 'zipCodeFilter', zipcodeArray, 'ZIP Code: ');
});

dobCheckbox.addEventListener('click', function(){
    addInput('dobCheckbox', 'dobFilter', '', 'Date of Birth: ', true);
});

genderCheckbox.addEventListener('click', function(){
    addSelect('genderCheckbox', 'genderFilter', genderArray, 'Gender: ');
});

polAffCheckbox.addEventListener('click', function(){
    addSelect('polAffCheckbox', 'polAffFilter', polAffArray, 'Political Affiliation: ');
});

voterTypeCheckbox.addEventListener('click', function(){
    addSelect('voterTypeCheckbox', 'voterTypeFilter', voterTypeArray, 'Voter Type: ');
});

yrLastVotedCheckbox.addEventListener('click', function(){
    addSelect('yrLastVotedCheckbox', 'yrLastVotedFilter', yrLastVotedArray, 'Year Last Voted: ');
});

electDisCheckbox.addEventListener('click', function(){
    addSelect('electDisCheckbox', 'electDisFilter', electDisArray, 'Election District: ');
});

assemDisCheckbox.addEventListener('click', function(){
    addSelect('assemDisCheckbox', 'assemDisFilter', assemDisArray, 'Assembly District: ');
});

congDisCheckbox.addEventListener('click', function(){
    addSelect('congDisCheckbox', 'congDisFilter', congDisArray, 'Congressional District: ');
});

counDisCheckbox.addEventListener('click', function(){
    addSelect('counDisCheckbox', 'counDisFilter', counDisArray, 'Council District: ');
});

senDisCheckbox.addEventListener('click', function(){
    addSelect('senDisCheckbox', 'senDisFilter', senDisArray, 'Senate District: ');
});

civCourtDisCheckbox.addEventListener('click', function(){
    addSelect('civCourtDisCheckbox', 'civCourtDisFilter', civCourtDisArray, 'Civil Court District: ');
});

judDisCheckbox.addEventListener('click', function(){
    addSelect('judDisCheckbox', 'judDisFilter', judDisArray, 'Judicial District: ');
});

regDateCheckbox.addEventListener('click', function(){
    addInput('regDateCheckbox', 'regDateFilter', '', 'Registration Date: ', true);
});

function getList(filterList, dateBool = false, fieldsBool = false){

    if(filterList){

        if(dateBool){
            var startDate = filterList.startDate._d.toISOString().substr(0,10)

            var endDate = filterList.endDate._d.toISOString().substr(0,10)
            var day = parseInt(endDate.substr(8,10)) - 1
            if(day < 10){
                day = "0" + day.toString();
            }
            endDate = endDate.substr(0,8) + day

            var todayDate = new Date().toISOString().substr(0,10)

            if(startDate === endDate &&  endDate === todayDate){
                return ['']
            }
            else{
                return [startDate, endDate]
            }
        }
        else{
            var newArray = filterList.map(function(e) { 
                if(fieldsBool){
                    e = e.text.toString();
                }
                else{
                    e = e.text.toString().toLowerCase();
                }
                return e;
            });
            return newArray;
        }
    }
    else{
        return [''];
    }
}

function filterTable(){

    var table = document.getElementById("votersTable");
    var colCount = table.rows[0].cells.length
    var tr = table.getElementsByTagName("tr");

    var filterObj = new Object();
    
    var i = 0
    for (var i = 0; i < tr.length; i++) {
        tr[i].style.display = "";
    }

    filterClassList = ['City', 'Zip Code', 'Date of Birth', 'Gender', 'Political Affiliation', 'Voter Type', 
                    'Year Last Voted', 'Election District', 'Assembly District', 'Congressional District', 
                    'Council District', 'Senate District', 'Civil Court District', 'Judicial District', 
                    'Registration Date']

    var fieldList = [];
    for(var i = 0; i < colCount; i++){
        var className = tr[1].getElementsByTagName("td")[i].className;
        fieldList.push(className);
    }

    var filterFieldsCount = 0;
    for(var i = 0; i < fieldList.length; i++){
        if(filterClassList.includes(fieldList[i])){
            filterFieldsCount++;
        }
    }

    filterObj['City'] = getList($("#cityFilter").select2('data'));
    filterObj['Zip Code'] = getList($("#zipCodeFilter").select2('data'));
    filterObj['Date of Birth'] = getList($("#dobFilter").data('daterangepicker'), true);
    filterObj['Gender'] = getList($("#genderFilter").select2('data'));
    filterObj['Political Affiliation'] = getList($("#polAffFilter").select2('data'));
    filterObj['Voter Type'] = getList($("#voterTypeFilter").select2('data'));
    filterObj['Year Last Voted'] = getList($("#yrLastVotedFilter").select2('data'));
    filterObj['Election District'] = getList($("#electDisFilter").select2('data'));
    filterObj['Assembly District'] = getList($("#assemDisFilter").select2('data'));
    filterObj['Congressional District'] = getList($("#congDisFilter").select2('data'));
    filterObj['Council District'] = getList($("#counDisFilter").select2('data'));
    filterObj['Senate District'] = getList($("#senDisFilter").select2('data'));
    filterObj['Civil Court District'] = getList($("#civCourtDisFilter").select2('data'));
    filterObj['Judicial District'] = getList($("#judDisFilter").select2('data'));
    filterObj['Registration Date'] = getList($("#regDateFilter").data('daterangepicker'), true);

    for (var j = 1; j < tr.length; j++) {

        var currentRow = tr[j]; 
        var currentRowCols = tr[j].getElementsByTagName("td");
        var display = 0;
        currentRow.style.display = "";
        
        for (var k = 0; k < colCount; k++) {

            var currentCell = currentRowCols[k]

            var cellClass = currentCell.className;

            if(filterClassList.includes(cellClass)){

                var cellValue = currentCell.innerHTML.toString().toLowerCase();

                if(['Date of Birth','Registration Date'].includes(cellClass)){

                    var fromDate = new Date(filterObj[cellClass][0]);
                    var toDate = new Date(filterObj[cellClass][1]);
                    var checkDate = new Date(cellValue);

                    if((checkDate >= fromDate && checkDate <= toDate) || filterObj[cellClass] == ''){
                        display++;
                    }
                }
                else{
                    if (filterObj[cellClass].includes(cellValue) || filterObj[cellClass] == '') {
                        display++;    
                    } 
                }
            }
        }
        if (display < filterFieldsCount) {
            currentRow.style.display = "None";
        }
    }    
}

function addFilterListen(filterId){
    $('#' + filterId).on('change', filterTable);
}

function addDateFilterListen(filterId){

    var filterIdStr = '#' + filterId;
    var todayDate = new Date().toISOString().substr(0,10);
    // var yr = todayDate.substr(0,4);
    // var mon = todayDate.substr(5,7);
    // var day = todayDate.substr(8,10);
    // todayDate = yr + '-' + mon + '-' + day

    $(filterIdStr).on('apply.daterangepicker', filterTable);
    $(filterIdStr).on('cancel.daterangepicker', function(){
        $(filterIdStr).data('daterangepicker').setStartDate('1900-01-01');
        $(filterIdStr).data('daterangepicker').setEndDate(todayDate);
        $(filterIdStr).val('');
        filterTable();
    });
}

// More table events

// Show filters title/lable when filters are added
jQuery("input.form-check-input").click(function(){
    if($(".select2-hidden-accessible:visible").length > 0){
        document.getElementById("filters-title").style.display = "block"
    }
    else{
        document.getElementById("filters-title").style.display = "none"
    }
});

// Show additional edit options when edit mode switch on
$('#edit-mode-switch').change(function() {
    if($('#edit-mode-switch').is(':checked')) {
        $('#edit-span').css('display','block');
        $('#add-column-span').css('display','block');
        $('#drop-column-span').css('display','block');
        $('#save-list-btn').css('display','block');
        $('#delete-list-btn').css('display','block');
        $('.editable-th').attr('contenteditable','true');
        $('.editable-td').attr('contenteditable','true');
    }
    else{
        $('#edit-span').css('display','none');
        $('#add-column-span').css('display','none');
        $('#drop-column-span').css('display','none');
        $('#save-list-btn').css('display','none');
        $('#delete-list-btn').css('display','none');
        $('.editable-th').attr('contenteditable','false');
        $('.editable-td').attr('contenteditable','false');
    }
});

// toggle hilight color menu display
$("#edit-dropdown-content input[type='radio']").on("click", function(){
    if($('#edit-choice-highlight').checked) {
        $("#highlight-dropdown-content").style.display = "block";
    }
    else if($('#edit-choice-text').checked){
        $("#highlight-dropdown-content").style.display = "";
    }
});

// table search funciton
var $rows = $('#votersTable tbody tr');
$('#list-search').keyup(function() {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    
    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

// table row hover animation
$('tr').hover(function() {
    if($('#edit-mode-switch').is(':checked')) {
        if($('#edit-icon').is(':checked')) {
            if($('#edit-choice-higlight').is(':checked')) {
                $(this).toggleClass("row-hover"); 
            }
        }
    }
});

// table column hover animation
$("#votersTable tr").on({
    mouseenter: function() {
        if($('#edit-mode-switch').is(':checked')) {
            if($('#drop-column-icon').is(':checked')) {
                if($(this).hasClass( "custom-col" )){
                    var t = parseInt($(this).index()) + 1;
                    $('td:nth-child(' + t + ')').toggleClass("col-hover"); 
                    $(this).css("cursor", "pointer");
                }
            }
        }
    },
    mouseleave: function() {
        if($('#edit-mode-switch').is(':checked')) {
            if($('#drop-column-icon').is(':checked')) {
                if($(this).hasClass( "custom-col" )){
                    var t = parseInt($(this).index()) + 1;
                    $('td:nth-child(' + t + ')').toggleClass("col-hover");
                    $(this).css("cursor", "default"); 
                }
            }
        }
    }
}, "td");

// highlight table row
$('#votersTable').bind('click', function(e) {
    if($('#edit-mode-switch').is(':checked')) {
        if($('#edit-icon').is(':checked')) {
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
    }
});

// // export table to csv
// function downloadCSV(csv) {
//     var csvFile;
//     var downloadLink;
//     // CSV file
//     csvFile = new Blob([csv], {type: "text/csv"});
//     // Download link
//     downloadLink = document.createElement("a");
//     // File name
//     var filename = document.getElementById('list-title').innerHTML.replace(/^\s+|\s+$/gm,'').replace(' ','_') + '_list.csv'
//     downloadLink.download = filename;
//     // Create a link to the file
//     downloadLink.href = window.URL.createObjectURL(csvFile);
//     // Hide download link
//     downloadLink.style.display = "none";
//     // Add the link to DOM
//     document.body.appendChild(downloadLink);
//     // Click download link
//     downloadLink.click();
// }
// function exportTableToCSV() {
//     var csv = [];
//     var rows = document.querySelectorAll("table tr");
//     for (var i = 0; i < rows.length; i++) {
//         var row = [], cols = rows[i].querySelectorAll("td, th");
//         for (var j = 0; j < cols.length; j++) 
//             row.push(cols[j].innerText);
//         csv.push(row.join(","));        
//     }
//     // Download CSV file
//     downloadCSV(csv.join("\n"));
// }

// Add table column (with specific template)

// Currency formatter for "Amount Donated"
function addCurrencyFields(){
    $("#votersTable tr").on({
        keyup: function() {
            formatCurrency($(this));
        },
        blur: function() { 
            formatCurrency($(this), "blur");
        }
    }, "#currency-field");
}

function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.
  
  // get input value
  var input_val = input.val();
  
  // don't validate empty input
  if (input_val === "") { return; }
  
  // original length
  var original_len = input_val.length;

  // initial caret position 
  var caret_pos = input.prop("selectionStart");
    
  // check for decimal
  if (input_val.indexOf(".") >= 0) {

    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);
    
    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }
    
    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = "$" + left_side + "." + right_side;

  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = "$" + input_val;
    
    // final formatting
    if (blur === "blur") {
      input_val += ".00";
    }
  }
  
  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}

function AddNewCol(){ // templateName
    if($('#edit-mode-switch').is(':checked')) {
        if($('#dd-choice-contacted').is(':checked')) {
            $("#votersTable tr th:last-child").after('<th class="custom-col">Contacted</th>');
            $("#votersTable tr td:last-child").after('<td class="custom-col td-select"><select> <option value="yes">YES</option> <option value="no">NO</option> </select></td>');
        }
        if($('#dd-choice-support').is(':checked')) {
            $("#votersTable tr th:last-child").after('<th class="custom-col">Support Level</th>');
            $("#votersTable tr td:last-child").after('<td class="custom-col td-select"><select> <option value="support">Support</option> <option value="undecided">Undecided</option> <option value="opposed">Opposed</option> </select></td>');
        }
        if($('#dd-choice-donated').is(':checked')) {
            $("#votersTable tr th:last-child").after('<th class="custom-col">Amount Donated</th>');
            $("#votersTable tr td:last-child").after('<td class="custom-col"><input type="text" name="currency-field" id="currency-field" pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" value="" data-type="currency" placeholder="$"></td>');
            addCurrencyFields();
        }
        if($('#dd-choice-donor-class').is(':checked')) {
            $("#votersTable tr th:last-child").after('<th class="custom-col">Donor Classification</th>');
            $("#votersTable tr td:last-child").after('<td class="custom-col td-select"><select> <option value="low">Low Dollar</option> <option value="high">High Dollar</option> </select></td>');
        }
        if($('#dd-choice-custom').is(':checked')) {
            $("#votersTable tr th:last-child").after('<th class="editable-th custom-col" contenteditable="true"></th>');
            $("#votersTable tr td:last-child").after('<td class="editable-td custom-col" contenteditable="true"></td>');
        }
        var thCount = document.getElementsByTagName("th").length;
        if(thCount >= 12){
            document.getElementById("votersTable").style.tableLayout = "";
        }
    }
}

// Drop column 

$('#votersTable').on('click', 'td', function(e){
    if($('#edit-mode-switch').is(':checked')){
        if($('#drop-column-icon').is(':checked')){
            var colIndex = this.cellIndex;
            var colHead = e.delegateTarget.tHead.rows[0].cells[this.cellIndex];
            if(colHead.classList.contains('custom-col')){
                // SHOW POPUP
                var msg = "Are you sure you want to delete this column?<br>All data in the column will be lost"
                addAlert(msg, "warning");
                $(".confirm-modal #cancel-btn").on("click", function(){
                    $(".confirm-modal .confirm").remove();
                });
                $('.confirm-modal #confirm-btn').on('click', function(){
                    $(".confirm-modal .confirm").remove();
                    // REMOVE THE COLUMN; note that on save list, the column will be removed from database
                    $('#votersTable tr').find('td:eq(' + colIndex + '),th:eq(' + colIndex + ')').remove();
                });
                var thCount = document.getElementsByTagName("th").length;
                if(thCount < 12){
                    document.getElementById("votersTable").style.tableLayout = "fixed";
                }
            }            
        }
    }
});

// change cursor on hover
// $("#tblData tr:has(th)").mouseover(function(e) {
//     $(this).css("cursor", "pointer");
//   });

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

// Saving list edits

// On save, get a list of all rows with colors and their color; 
// send to database

$("#save-list-btn").click(function(){

    var listId = $(this).attr("listId");

    var redList = [];
    var orangeList = [];
    var yellowList = [];
    var greenList = [];
    var blueList = [];

    // loop through each table row
    // get background color and id
    // append to the appropriate list

    $("#votersTable").find('tr').each(function(i) {
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
    $("#votersTable th.custom-col").each(function(){
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

    // console.log(customColDict);

    $.ajax({
        "url": "/Politiker/lists/" + listId + "?_method=PUT",
        "method": "POST",
        "data": {
            colorData: colorData,
            customColDict: JSON.stringify(customColDict)
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

// Render list from model

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

        if(colName === "Contacted"){
            $("#votersTable tr th:last-child").after('<th class="custom-col">Contacted</th>');
            $("#votersTable tr td:last-child").after('<td class="custom-col td-select"><select> <option value="yes">YES</option> <option value="no">NO</option> </select></td>');
            for(var id of Object.keys(idValMap)){
                // get row with specific id; go to the last cell; set the value to the value associated with the key
                $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').find('td:last-child').find('select').val(idValMap[id]);
            }
        }
        else if(colName === "Level of Support"){
            $("#votersTable tr th:last-child").after('<th class="custom-col">Support Level</th>');
            $("#votersTable tr td:last-child").after('<td class="custom-col td-select"><select> <option value="support">Support</option> <option value="undecided">Undecided</option> <option value="opposed">Opposed</option> </select></td>');
            for(var id of Object.keys(idValMap)){
                // get row with specific id; go to the last cell; set the value to the value associated with the key
                $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').find('td:last-child').find('select').val(idValMap[id]);
            }
        }
        else if(colName === "Amount Donated"){
            $("#votersTable tr th:last-child").after('<th class="custom-col">Amount Donated</th>');
            $("#votersTable tr td:last-child").after('<td class="custom-col"><input type="text" name="currency-field" id="currency-field" pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" value="" data-type="currency" placeholder="$"></td>');
            for(var id of Object.keys(idValMap)){
                // get row with specific id; go to the last cell; set the value to the value associated with the key
                $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').find('td:last-child').find('input').val(idValMap[id]);
            }
        }
        else if(colName === "Donor Classification"){
            $("#votersTable tr th:last-child").after('<th class="custom-col">Donor Classification</th>');
            $("#votersTable tr td:last-child").after('<td class="custom-col td-select"><select> <option value="low">Low Dollar</option> <option value="high">High Dollar</option> </select></td>');
            for(var id of Object.keys(idValMap)){
                // get row with specific id; go to the last cell; set the value to the value associated with the key
                $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').find('td:last-child').val(idValMap[id]);
            }
        }
        else{
            $("#votersTable tr th:last-child").after('<th class="editable-th custom-col" contenteditable="true">' + colName + '</th>');
            $("#votersTable tr td:last-child").after('<td class="editable-td custom-col" contenteditable="true"></td>');
            for(var id of Object.keys(idValMap)){
                // get row with specific id; go to the last cell; set the value to the value associated with the key
                $("td.ID").filter(function(){return $(this).text() === id;}).closest('tr').find('td:last-child').html(idValMap[id]);
            }
        }
    });
    addCurrencyFields();
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

// Pop-ups

// function addPopup(msg, delay, feel){
//     $(".alert-modal").append('<div class="alert non-animated ' + feel + 
//                              '"><i class="icon-notification fa fa-bell feel"></i><span>' + msg + 
//                              '</span><i class="fa fa-times icon-delete"></i></div>');
//     $(".non-animated").animate({bottom: "0"});
//     $(".non-animated").removeClass(".non-animated")
//         .delay(2000).fadeOut(function(){
//             $(this).remove();
//         });
//     if($(".alert-modal .alert").length > 1){
//         $(".alert-modal .alert").eq(0).remove();
//     }
// }

// $(document).on("click", ".alert-modal .alert", function(){
//     $(this).stop(false, true);
// });

// $("#save-list-btn").click(function(){
//     addPopup("List has been saved!", 2000, "success");
// });

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

function confirmListDelete(){
    var msg = "Are you sure you want to delete this list?<br>This action can not be undone"
    addAlert(msg, "warning");
    $(".confirm-modal #cancel-btn").on("click", function(){
        $(".confirm-modal .confirm").remove();
    });
    $('.confirm-modal #confirm-btn').on('click', function(){
        $(".confirm-modal .confirm").remove();
        $('#delete-list-form').submit();
    });
}

// Show loading screen on page load

window.addEventListener("load", function(){
    var loader = document.querySelector(".loader");
    loader.className += " hidden";
});