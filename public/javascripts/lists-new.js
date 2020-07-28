
// Events & functions to add filters to list form

// Get the area in the html where the filters are added
var filterArea = document.getElementById('addFiltersArea');
var listInfoArea = document.getElementById('listInfoArea');

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

var parsedUrl = window.location.href.split("/")

// Create list-info inputs/filter
createInput('titleParams', '', 'Title: ', false, listInfoArea);
createInput('descriptionParams', '', 'Description: ', false, listInfoArea);

var fieldsArray = ['County EMSID', 'First Name', 'Last Name', 'Middle Initial', 'Name Suffix',
                    'House Number', 'Apartment Number', 'Street Name', 'City', 'Zip Code', 'Date of Birth',
                    'Gender', 'Political Affiliation', 'Election District', 'Assembly District', 
                    'Congressional District', 'Council District', 'Senate District', 'Civil Court District',
                    'Judicial District', 'Registration Date', 'Status Code', 'Voter Type', 
                    'Eff. Status Change Date', 'Year Last Voted', 'Telephone Number'];

createSelect('fieldsFilter', fieldsArray, 'Fields: ', listInfoArea);
addFilterListen('fieldsFilter');

// Add list of ids to model upon save

$(document).on("click","#saveListBtn",function() {
    var idArray = $('#votersTable td.ID:visible').map(function(){
        return $(this).text()
    }).get();

    // console.log(idArray.toString());
    
    $('#idList').val(idArray.toString());

    $(this).parents("form").submit();
});

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

    var selectedFields = getList($("#fieldsFilter").select2('data'), dateBool = false, fieldsBool = true);

    if(selectedFields.length > 0){
        for(var f = 0; f < fieldsArray.length; f++){
            var elements = document.getElementsByClassName(fieldsArray[f])
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "None";
            }
        }
        for(var g = 0; g < selectedFields.length; g++){
            var elements = document.getElementsByClassName(selectedFields[g])
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "";
            }
        }
        if(selectedFields.length < 12){
            document.getElementById("votersTable").style.tableLayout = "fixed";
        }
    }
    else{
        for(var h = 0; h < fieldsArray.length; h++){
            var elements = document.getElementsByClassName(fieldsArray[h])
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "";
            }
        }
        document.getElementById("votersTable").style.tableLayout = "";
    }

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
        if (display < filterClassList.length) {
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