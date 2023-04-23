/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.64325023978247, "KoPercent": 1.356749760217527};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4374782472504525, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.33991844769403823, 500, 1500, "http://20.254.113.19/PCUKchatbot/chatbot"], "isController": false}, {"data": [0.08372093023255814, 500, 1500, "2.Load web page"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 55-59"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Under Age 45"], "isController": true}, {"data": [0.08837209302325581, 500, 1500, "9.Yes, take me there"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 60-64"], "isController": true}, {"data": [0.11395348837209303, 500, 1500, "6.Select Ethnicity"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 80 Or Older"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 55-59"], "isController": true}, {"data": [0.09767441860465116, 500, 1500, "4.Age Selection"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 60-64"], "isController": true}, {"data": [0.08604651162790698, 500, 1500, "3.OK, check my risk"], "isController": false}, {"data": [0.5863509749303621, 500, 1500, "http://20.254.113.19/PCUKchatbot/register/updateUserStatus"], "isController": false}, {"data": [0.004651162790697674, 500, 1500, "1.Test user journeys"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 75-79"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 70-74"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 45-49"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 50-54"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 65-69"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Under Age 45"], "isController": true}, {"data": [0.484949588153216, 500, 1500, "http://20.254.113.19/PCUKchatbot/register/saveUserBot"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 45-49"], "isController": true}, {"data": [0.0941860465116279, 500, 1500, "5.Select Family History"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 70-74"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 80 Or Older"], "isController": true}, {"data": [0.10813953488372093, 500, 1500, "8.Yes – I’d like to sign up"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 65-69"], "isController": true}, {"data": [0.12325581395348838, 500, 1500, "7.Input User Details For Yes"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 50-54"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 75-79"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 107389, 1457, 1.356749760217527, 1363.674417305317, 0, 38569, 689.0, 1069.0, 1169.0, 1652.9900000000016, 8.370126561638617, 31.81128915634414, 5.47468328316069], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://20.254.113.19/PCUKchatbot/chatbot", 7112, 96, 1.3498312710911136, 3330.7249718785097, 6, 27797, 1171.0, 10345.599999999999, 13752.05, 20182.11999999998, 0.5560377711641876, 24.545146900750073, 0.20662334099012408], "isController": false}, {"data": ["2.Load web page", 430, 109, 25.348837209302324, 5085.806976744189, 0, 27843, 2204.5, 17289.600000000002, 20991.25, 24602.11, 6.88870732606014, 348.46441214194743, 2.4319489835151633], "isController": false}, {"data": ["Check No For Age 55-59", 427, 17, 3.981264637002342, 15544.302107728337, 9005, 29068, 14495.0, 20927.8, 22409.8, 26100.99999999999, 0.0343421259094933, 1.7475136479287876, 0.34159673940615787], "isController": true}, {"data": ["Check No For Under Age 45", 430, 111, 25.813953488372093, 24711.22558139535, 6176, 73422, 22626.0, 39780.8, 43528.95, 62854.909999999996, 2.895934915546456, 145.7786881709477, 17.67273352053083], "isController": true}, {"data": ["9.Yes, take me there", 430, 40, 9.30232558139535, 4210.132558139532, 0, 31032, 2280.5, 12471.000000000005, 17353.3, 28777.549999999996, 3.7084630576709126, 1.901597981043717, 2.339451309173703], "isController": false}, {"data": ["Check Yes For Age 60-64", 424, 5, 1.179245283018868, 17231.009433962266, 10386, 27408, 16962.5, 21751.5, 23523.5, 25291.0, 0.034200159498574044, 1.7854564211172517, 0.3957801043778382], "isController": true}, {"data": ["6.Select Ethnicity", 430, 54, 12.55813953488372, 4468.525581395346, 0, 31601, 1950.5, 17562.200000000008, 20367.25, 24622.849999999995, 4.144897919839602, 2.2568852447658614, 2.2126988556948968], "isController": false}, {"data": ["Check No For Age 80 Or Older", 396, 0, 0.0, 10212.383838383847, 8103, 22227, 9931.0, 11570.5, 12832.449999999999, 18976.329999999947, 0.03352594666987026, 1.7021296680330185, 0.3324110708390554], "isController": true}, {"data": ["Check Yes For Age 55-59", 429, 9, 2.097902097902098, 21871.75291375291, 11963, 39672, 21240.0, 26373.0, 28971.0, 30716.299999999996, 1.5446100669691079, 80.93859280487146, 17.8776547985526], "isController": true}, {"data": ["4.Age Selection", 430, 95, 22.093023255813954, 5694.972093023258, 0, 31314, 1956.5, 20446.6, 23256.499999999993, 30297.76, 5.837949386336483, 3.1794894721747036, 2.6878803576762245], "isController": false}, {"data": ["Check No For Age 60-64", 419, 3, 0.7159904534606205, 12661.01193317423, 9718, 20002, 12565.0, 14054.0, 14550.0, 16452.4, 1.1811867120723485, 59.97357317173299, 11.749985420167], "isController": true}, {"data": ["3.OK, check my risk", 430, 92, 21.3953488372093, 6452.316279069765, 2, 30128, 2168.5, 21263.6, 23464.4, 27195.64, 6.788973444062017, 3.6001356314534716, 11.763771353689728], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/updateUserStatus", 7539, 73, 0.9682981827828624, 1027.1374187558022, 0, 31282, 592.0, 1582.0, 2912.0, 8056.000000000007, 0.5885917658986529, 0.3007359079301244, 0.23471762729185017], "isController": false}, {"data": ["1.Test user journeys", 430, 65, 15.116279069767442, 15598.625581395354, 1179, 38569, 15455.5, 25870.8, 28338.25, 29265.32, 10.087503225655102, 508.6235644002041, 3.7532604775142513], "isController": false}, {"data": ["Check Yes For Age 75-79", 403, 1, 0.24813895781637718, 7746.300248138961, 5832, 12331, 7468.0, 9362.6, 9790.8, 10765.24, 0.8389453852799433, 40.46264990228784, 5.624415727493677], "isController": true}, {"data": ["Check No For Age 70-74", 407, 1, 0.2457002457002457, 11851.92383292383, 8650, 24764, 11691.0, 13369.8, 14046.199999999999, 15748.520000000008, 0.03365686929259711, 1.7089035373969164, 0.33345688936991197], "isController": true}, {"data": ["Check Yes For Age 45-49", 430, 223, 51.86046511627907, 35708.54651162791, 12233, 69136, 35094.0, 50292.50000000001, 56599.69999999999, 62712.9, 2.6476691275622355, 152.21036236315243, 30.589976830970954], "isController": true}, {"data": ["Check Yes For Age 50-54", 430, 13, 3.0232558139534884, 24292.993023255796, 10265, 47670, 23297.5, 32977.0, 33746.4, 45522.67, 1.8127244827411766, 94.2922035457734, 20.972475471571844], "isController": true}, {"data": ["Check No For Age 65-69", 416, 0, 0.0, 12760.846153846152, 9050, 22300, 12155.5, 16510.600000000002, 17769.05, 18867.6, 0.9628537503847943, 48.884582897425986, 9.579642586836215], "isController": true}, {"data": ["Check Yes For Under Age 45", 430, 375, 87.20930232558139, 73946.82790697673, 22814, 133715, 71359.5, 111151.90000000001, 118204.95, 132485.31, 3.0169510552312526, 322.86116998721303, 23.49271119095897], "isController": true}, {"data": ["http://20.254.113.19/PCUKchatbot/register/saveUserBot", 88868, 637, 0.716793446459918, 1028.8785051987306, 0, 31176, 690.0, 998.0, 1128.9500000000007, 1628.9900000000016, 6.934983553722555, 3.532905373060295, 4.846218602949209], "isController": false}, {"data": ["Check No For Age 45-49", 430, 14, 3.255813953488372, 12941.581395348843, 5242, 33719, 12409.5, 18594.300000000003, 22241.3, 26218.329999999994, 2.6077833235288765, 125.25980112430334, 15.92496141390373], "isController": true}, {"data": ["5.Select Family History", 430, 71, 16.511627906976745, 5304.427906976746, 0, 30834, 2005.0, 19184.00000000001, 21585.1, 28511.319999999992, 4.410030254858725, 2.4756042158094456, 2.135407318855443], "isController": false}, {"data": ["Check Yes For Age 70-74", 413, 0, 0.0, 8014.159806295397, 5513, 21999, 7866.0, 9246.2, 10017.0, 11015.6, 0.0340198141941538, 1.640658936798228, 0.2281387344445841], "isController": true}, {"data": ["Check Yes For Age 80 Or Older", 403, 0, 0.0, 7466.736972704718, 5299, 19979, 7285.0, 8947.6, 9340.2, 13597.239999999925, 0.03396285980089337, 1.6379123923659666, 0.22795579630033214], "isController": true}, {"data": ["8.Yes – I’d like to sign up", 430, 56, 13.023255813953488, 4251.583720930232, 0, 30817, 2178.0, 14348.000000000055, 20217.0, 25639.61, 3.794162284262168, 2.051374087856916, 2.793920737302792], "isController": false}, {"data": ["Check Yes For Age 65-69", 419, 0, 0.0, 15146.692124105013, 10569, 20201, 15375.0, 17475.0, 17920.0, 18766.6, 1.024196958697241, 53.562307485651466, 11.85527983538906], "isController": true}, {"data": ["7.Input User Details For Yes", 430, 69, 16.046511627906977, 3765.125581395347, 0, 30351, 1887.0, 11260.500000000005, 17710.84999999999, 23564.6, 3.925005020355259, 2.2610496307756907, 1.9077706541979298], "isController": false}, {"data": ["Check No For Age 50-54", 430, 17, 3.953488372093023, 21929.769767441834, 9710, 43998, 22848.5, 30341.0, 31719.8, 42692.31, 1.9102790784458326, 97.39603781602901, 19.00413149911372], "isController": true}, {"data": ["Check No For Age 75-79", 403, 0, 0.0, 11453.444168734495, 8045, 21025, 11402.0, 13221.2, 13680.599999999999, 14697.8, 0.7457425134298419, 37.86172791131031, 7.3896965661841865], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 173, 11.873713109128346, 0.1610965741370159], "isController": false}, {"data": ["500/Internal Server Error", 1284, 88.12628689087165, 1.195653186080511], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 107389, 1457, "500/Internal Server Error", 1284, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 173, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://20.254.113.19/PCUKchatbot/chatbot", 7112, 96, "500/Internal Server Error", 87, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["2.Load web page", 430, 109, "500/Internal Server Error", 87, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 22, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["9.Yes, take me there", 430, 40, "500/Internal Server Error", 38, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["6.Select Ethnicity", 430, 54, "500/Internal Server Error", 43, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 11, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4.Age Selection", 430, 95, "500/Internal Server Error", 83, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 12, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["3.OK, check my risk", 430, 92, "500/Internal Server Error", 84, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/updateUserStatus", 7539, 73, "500/Internal Server Error", 61, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["1.Test user journeys", 430, 65, "500/Internal Server Error", 65, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/saveUserBot", 88868, 637, "500/Internal Server Error", 586, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 51, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["5.Select Family History", 430, 71, "500/Internal Server Error", 55, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 16, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["8.Yes – I’d like to sign up", 430, 56, "500/Internal Server Error", 46, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 10, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["7.Input User Details For Yes", 430, 69, "500/Internal Server Error", 49, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 20, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
