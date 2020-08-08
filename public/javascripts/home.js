
window.addEventListener("load", function(){
    var loader = document.querySelector(".loader");
    loader.className += " hidden";
});

// Create all of the buttons and menus for the graph
$(document).ready(function(){

    var campDict = document.getElementById("camp-dict");
        campDict = JSON.parse(campDict.value);
    var campTitles = Object.keys(campDict);
 
    var selectScriptDiv = document.getElementById("select-area");

    var selectOne = document.createElement("select");
    var optionOne = document.createElement("option");
    selectOne.id = "select-campaign";
    selectOne.appendChild(optionOne);
    selectScriptDiv.appendChild(selectOne);
    $("#select-campaign").select2({data: campTitles, 
                                   width: "25%",
                                   margin: "30px",
                                   placeholder: "Select a campaign ..."});

    var selectTwo = document.createElement("select");
    var optionTwo = document.createElement("option");
    selectTwo.id = "select-attribute";
    selectTwo.appendChild(optionTwo);
    selectScriptDiv.appendChild(selectTwo);
    $("#select-attribute").select2({data: ['Contact','Response','Support'], 
                                    width: "25%",
                                    margin: "30px",
                                    placeholder: "Select an attribute ..."});

    var label = document.createElement("label"); 
    label.setAttribute("for","select-date-range");
    label.innerHTML = "Date:";

    var input = document.createElement("input"); 
    input.id = "select-date-range";
    selectScriptDiv.appendChild(label);
    label.appendChild(input);
    $("#select-date-range").daterangepicker({
        startDate: "2020-01-01",
        autoUpdateInput: false,
        locale: {
            format: "YYYY-MM-DD",
            cancelLabel: 'Clear'
        }
    });

    var today = new Date();
    var todayDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    $("#select-date-range").on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
    });
    $("#select-date-range").on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
        $(this).val('2020-01-01 - ' + todayDate);
    });

    var submit = document.createElement("button"); 
    submit.setAttribute("id","get-graph");
    submit.setAttribute("onclick","getData(); return false");
    submit.innerHTML = "Plot";
    selectScriptDiv.appendChild(submit);

});

// Function to get data to plot a graph
function getData() {

    var campaign = document.getElementById("select-campaign").value;
    var attribute = document.getElementById("select-attribute").value;
    var date = document.getElementById("select-date-range").value;

    if(date === ''){
        var today = new Date();
        var todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        date = '2020-01-01 - ' + todayDate;
    }

    var campDict = document.getElementById("camp-dict");
    campDict = JSON.parse(campDict.value);
    var campType = campDict[campaign];

    console.log(campaign);
    console.log(attribute);
    console.log(date);
    console.log(campType);

    $.get("https://politiker-web-app.herokuapp.com/Politiker/home/graph", { campaign: campaign, 
                                                          campType: campType,
                                                          attribute: attribute,
                                                          date: date }, function(result, status) {
        console.log(result);

        if(attribute === 'Support'){
            $('#camp-progress-chart').remove();
            $('#camp-progress-area').append('<canvas id="camp-progress-chart"></canvas>');
            var context = document.getElementById('camp-progress-chart').getContext('2d');
            Chart.defaults.global.defaultFontSize = 20;
            var myChart = new Chart(context, {
                type: 'bar',
                data: {
                    labels: ['Support', 'Opposed', 'Undecided', 'TBD'],
                    datasets: [{
                        label: 'Count',
                        data: [result['Support'], result['Opposed'], result['Undecided'], result['Null']],
                        backgroundColor: [
                            'rgba(255, 99, 132)',
                            'rgba(54, 162, 235)',
                            'rgba(255, 206, 86)',
                            'rgba(255, 159, 64)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132)',
                            'rgba(54, 162, 235)',
                            'rgba(255, 206, 86)',
                            'rgba(255, 159, 64)'
                        ],
                        borderWidth: 5
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Level of Support'
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Count'
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    }
                }
            });
        }
        else{
            $('#camp-progress-chart').remove();
            $('#camp-progress-area').append('<canvas id="camp-progress-chart"></canvas>');
            var context = document.getElementById('camp-progress-chart').getContext('2d');
            Chart.defaults.global.defaultFontSize = 20;

            for(var i=0; i < result['date'].length; i++) {
                result['date'][i] = result['date'][i].substring(0,10);
            }
            console.log(result['date']);

            if(attribute === 'Contact'){
                var color = '#00B4EB';
            }
            else if(attribute === 'Response'){
                var color = 'rgb(250, 181, 10)';
            }

            var myChart = new Chart(context, {
                type: 'line',
                data: {
                    labels: result['date'],
                    datasets: [{
                        label: 'Count',
                        data: result['count'],
                        backgroundColor: color,
                        borderColor: color,
                        borderWidth: 5,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Count'
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    }
                }
            });
        }
    });
 }

