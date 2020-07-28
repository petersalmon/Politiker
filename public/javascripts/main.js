
// maps.ejs //

$(document).ready(function(){

    var zipList = 
    [
        10453, 10457, 10460, 10458, 10467, 10468, 10451, 10452, 10456, 10454, 10455, 10459, 10474, 10463, 10471,
        10466, 10469, 10470, 10475, 10461, 10462,10464, 10465, 10472, 10473, 11212, 11213, 11216, 11233, 11238,
        11209, 11214, 11228, 11204, 11218, 11219, 11230, 11234, 11236, 11239, 11223, 11224, 11229, 11235,
        11201, 11205, 11215, 11217, 11231, 11203, 11210, 11225, 11226, 11207, 11208, 11211, 11222, 11220, 11232,
        11206, 11221, 11237, 10026, 10027, 10030, 10037, 10039, 10001, 10011, 10018, 10019, 10020, 10036, 
        10029, 10035, 10010, 10016, 10017, 10022, 10012, 10013, 10014, 10004, 10005, 10006, 10007, 10038, 10280,
        10002, 10003, 10009, 10021, 10028, 10044, 10065, 10075, 10128, 10023, 10024, 10025, 10031, 10032, 10033, 
        10034, 10040, 11361, 11362, 11363, 11364, 11354, 11355, 11356, 11357, 11358, 11359, 11360, 11365, 11366, 
        11367, 11412, 11423, 11432, 11433, 11434, 11435, 11436, 11101, 11102, 11103, 11104, 11105, 11106,11374, 
        11375, 11379, 11385, 11691, 11692, 11693, 11694, 11695, 11697, 11004, 11005, 11411, 11413, 11422, 11426, 
        11427, 11428, 11429, 11414, 11415, 11416, 11417, 11418, 11419, 11420, 11421, 11368, 11369, 11370, 11372, 
        11373, 11377, 11378, 10302, 10303, 10310, 10306, 10307, 10308, 10309, 10312, 10301, 10304, 10305, 10314
    ];

    var cdList = 
    [
       'Elmhurst/Corona', 'Upper East Side', 'Jamaica/Hollis', 'St. George/Stapleton', 'Flatbush/Midwood',
       'Fort Greene/Brooklyn Heights', 'Hillcrest/Fresh Meadows', 'Clinton/Chelsea', 'Washington Heights/Inwood',
       'Flatlands/Canarsie', 'Kew Gardens/Woodhaven', 'Midtown', 'Bedford Stuyvesant', 'Mott Haven/Melrose', 'Sheepshead Bay',
       'Queens Village', 'Ridgewood/Maspeth', 'Morningside Heights/Hamilton', 'Greenwich Village/Soho',
       'Crown Heights/Prospect Heights', 'Woodside/Sunnyside', 'Rockaway/Broad Channel', 'Borough Park', 'Belmont/East Tremont',
       'Throgs Neck/Co-op City', 'Bushwick', 'East New York/Starrett City', 'Morris Park/Bronxdale',
       'Kingsbridge Heights/Bedford', 'Coney Island', 'Jackson Heights', 'South Crown Heights/Lefferts Gardens',
       'Lower East Side/Chinatown', 'Riverdale/Fieldston', 'Park Slope/Carroll Gardens', 'Williamsbridge/Baychester',
       'Highbridge/Concourse', 'Bay Ridge/Dyker Heights', 'Astoria', 'Bensonhurst', 'Fordham/University Heights', 'Sunset Park',
       'Financial District', 'Parkchester/Soundview', 'Hunts Point/Longwood', 'Brownsville', 'Tottenville/Great Kills',
       'South Ozone Park/Howard Beach', 'Rego Park/Forest Hills', 'Central Harlem', 'Stuyvesant Town/Turtle Bay', 'Upper West Side',
       'East Harlem', 'Flushing/Whitestone', 'Bayside/Little Neck', 'South Beach/Willowbrook', 'East Flatbush', 'Morrisania/Crotona',
       'Greenpoint/Williamsburg'
    ];

    // $("#explore-select").select2({
    //     dropdownParent: $('#explore'),
    //     data: zipList
    // });
 
    $("#explore-select").select2({
        dropdownParent: $('#explore'),
        data: cdList
    });

    // $("#zip-select").select2({
    //     data:zipList
    // });
});

var cdDict = 
    {'404': 'Elmhurst/Corona', '108': 'Upper East Side', '412': 'Jamaica/Hollis', '501': 'St. George/Stapleton', '314': 'Flatbush/Midwood', 
    '302': 'Fort Greene/Brooklyn Heights', '408': 'Hillcrest/Fresh Meadows', '104': 'Clinton/Chelsea', '112': 'Washington Heights/Inwood', 
    '318': 'Flatlands/Canarsie', '409': 'Kew Gardens/Woodhaven', '105': 'Midtown', '303': 'Bedford Stuyvesant', '201': 'Mott Haven/Melrose', 
    '315': 'Sheepshead Bay', '413': 'Queens Village', '405': 'Ridgewood/Maspeth', '109': 'Morningside Heights/Hamilton', '102': 'Greenwich Village/Soho', 
    '308': 'Crown Heights/Prospect Heights', '402': 'Woodside/Sunnyside', '414': 'Rockaway/Broad Channel', '312': 'Borough Park', '206': 'Belmont/East Tremont', 
    '210': 'Throgs Neck/Co-op City', '304': 'Bushwick', '305': 'East New York/Starrett City', '211': 'Morris Park/Bronxdale', '207': 'Kingsbridge Heights/Bedford', 
    '313': 'Coney Island', '403': 'Jackson Heights', '309': 'South Crown Heights/Lefferts Gardens', '103': 'Lower East Side/Chinatown', '208': 'Riverdale/Fieldston', 
    '306': 'Park Slope/Carroll Gardens', '212': 'Williamsbridge/Baychester', '204': 'Highbridge/Concourse', '310': 'Bay Ridge/Dyker Heights', '401': 'Astoria', 
    '311': 'Bensonhurst', '205': 'Fordham/University Heights', '307': 'Sunset Park', '101': 'Financial District', '209': 'Parkchester/Soundview', 
    '202': 'Hunts Point/Longwood', '316': 'Brownsville', '503': 'Tottenville/Great Kills', '410': 'South Ozone Park/Howard Beach', 
    '406': 'Rego Park/Forest Hills', '110': 'Central Harlem', '106': 'Stuyvesant Town/Turtle Bay', '107': 'Upper West Side', 
    '111': 'East Harlem', '407': 'Flushing/Whitestone', '411': 'Bayside/Little Neck', '502': 'South Beach/Willowbrook', '317': 'East Flatbush', 
    '203': 'Morrisania/Crotona', '301': 'Greenpoint/Williamsburg'}
