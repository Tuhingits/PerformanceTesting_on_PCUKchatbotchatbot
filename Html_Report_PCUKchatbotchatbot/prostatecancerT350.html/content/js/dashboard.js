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

    var data = {"OkPercent": 99.40848214285714, "KoPercent": 0.5915178571428571};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4727580813347237, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3954621848739496, 500, 1500, "http://20.254.113.19/PCUKchatbot/chatbot"], "isController": false}, {"data": [0.14714285714285713, 500, 1500, "2.Load web page"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 55-59"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Under Age 45"], "isController": true}, {"data": [0.14142857142857143, 500, 1500, "9.Yes, take me there"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 60-64"], "isController": true}, {"data": [0.21, 500, 1500, "6.Select Ethnicity"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 80 Or Older"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 55-59"], "isController": true}, {"data": [0.18428571428571427, 500, 1500, "4.Age Selection"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 60-64"], "isController": true}, {"data": [0.15285714285714286, 500, 1500, "3.OK, check my risk"], "isController": false}, {"data": [0.6473809523809524, 500, 1500, "http://20.254.113.19/PCUKchatbot/register/updateUserStatus"], "isController": false}, {"data": [0.03571428571428571, 500, 1500, "1.Test user journeys"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 75-79"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 70-74"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 45-49"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 50-54"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 65-69"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Under Age 45"], "isController": true}, {"data": [0.5174730458221024, 500, 1500, "http://20.254.113.19/PCUKchatbot/register/saveUserBot"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 45-49"], "isController": true}, {"data": [0.21285714285714286, 500, 1500, "5.Select Family History"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 70-74"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 80 Or Older"], "isController": true}, {"data": [0.17142857142857143, 500, 1500, "8.Yes – I’d like to sign up"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 65-69"], "isController": true}, {"data": [0.2, 500, 1500, "7.Input User Details For Yes"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 50-54"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 75-79"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 89600, 530, 0.5915178571428571, 1025.1091071428616, 1, 28394, 670.0, 1049.0, 1156.0, 2085.980000000003, 58.81163735274118, 220.72159594009352, 38.50065228263488], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://20.254.113.19/PCUKchatbot/chatbot", 5950, 28, 0.47058823529411764, 1580.4690756302618, 56, 22010, 1130.0, 2433.9000000000005, 3655.249999999999, 9602.56999999998, 4.007014632674611, 175.3296328549693, 1.489137196940055], "isController": false}, {"data": ["2.Load web page", 350, 36, 10.285714285714286, 4523.09142857143, 2, 25395, 1879.0, 20163.600000000002, 23670.899999999998, 25175.15, 6.741140215716487, 320.31112694409666, 2.486679476839368], "isController": false}, {"data": ["Check No For Age 55-59", 350, 1, 0.2857142857142857, 12985.528571428566, 8865, 18897, 12875.0, 15572.600000000006, 16354.199999999999, 18505.220000000005, 1.137941236714536, 57.637457078278985, 11.32041659114259], "isController": true}, {"data": ["Check No For Under Age 45", 350, 42, 12.0, 11865.777142857145, 5201, 43979, 7896.5, 23908.600000000013, 28766.749999999985, 35568.860000000015, 4.409448818897638, 214.46043307086615, 26.933526082677165], "isController": true}, {"data": ["9.Yes, take me there", 350, 15, 4.285714285714286, 2959.277142857143, 247, 26151, 1773.5, 3569.4000000000015, 12866.599999999993, 22500.27, 5.056488196711839, 2.564926211390101, 3.204746913736311], "isController": false}, {"data": ["Check Yes For Age 60-64", 350, 5, 1.4285714285714286, 15964.27714285714, 10403, 29953, 15530.0, 19900.2, 20766.45, 24616.750000000025, 1.0665724019819962, 55.66923168599956, 12.325252944311208], "isController": true}, {"data": ["6.Select Ethnicity", 350, 24, 6.857142857142857, 2795.9171428571426, 238, 25475, 1520.0, 3507.3000000000015, 19233.45, 23474.160000000007, 5.6993046848284505, 2.8856228424060837, 3.1223729767468367], "isController": false}, {"data": ["Check No For Age 80 Or Older", 350, 7, 2.0, 10381.042857142857, 8653, 24460, 9866.0, 11622.300000000007, 14228.8, 19633.160000000018, 0.7815046867952503, 39.70063433758546, 7.7402762326003565], "isController": true}, {"data": ["Check Yes For Age 55-59", 350, 2, 0.5714285714285714, 16254.78857142856, 10785, 21681, 16624.5, 18967.5, 19519.35, 20762.19, 1.3213430886205932, 69.27580237969171, 15.291353496556956], "isController": true}, {"data": ["4.Age Selection", 350, 26, 7.428571428571429, 4117.694285714286, 234, 27917, 1581.0, 21001.1, 23035.5, 27674.9, 6.200177147918512, 3.1381649966784764, 2.9366073405668733], "isController": false}, {"data": ["Check No For Age 60-64", 350, 2, 0.5714285714285714, 11568.877142857142, 8096, 19149, 11333.5, 13186.7, 14389.1, 17994.83, 1.0861604538288707, 55.153388282384654, 10.799729153283618], "isController": true}, {"data": ["3.OK, check my risk", 350, 41, 11.714285714285714, 4223.388571428573, 52, 27640, 1946.5, 19595.500000000004, 22322.599999999995, 27240.770000000004, 6.451256151733545, 3.2838585827051037, 11.357954859639099], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/updateUserStatus", 6300, 23, 0.36507936507936506, 787.5726984127, 5, 27773, 546.0, 1201.5000000000027, 2345.6499999999987, 3582.9199999999983, 4.188256129812007, 2.1366572505694035, 1.671255206650552], "isController": false}, {"data": ["1.Test user journeys", 350, 39, 11.142857142857142, 9633.391428571433, 1070, 22860, 9902.5, 17716.7, 19691.2, 21451.600000000006, 11.192478654344281, 544.399507281107, 4.1643890305714555], "isController": false}, {"data": ["Check Yes For Age 75-79", 350, 5, 1.4285714285714286, 7527.719999999998, 5931, 21837, 7242.0, 8665.400000000001, 9243.449999999999, 15682.240000000002, 0.8370302167908262, 40.384638739253134, 5.604092461197671], "isController": true}, {"data": ["Check No For Age 70-74", 350, 0, 0.0, 10974.548571428568, 8402, 13996, 10922.0, 12533.900000000001, 12942.05, 13569.03, 0.8972633467922835, 45.553639524450425, 8.891143730372365], "isController": true}, {"data": ["Check Yes For Age 45-49", 350, 79, 22.571428571428573, 22197.797142857144, 11611, 33282, 22241.0, 29144.7, 30139.2, 31719.81, 2.4990003998400643, 133.23140330921203, 28.867442978165872], "isController": true}, {"data": ["Check Yes For Age 50-54", 350, 5, 1.4285714285714286, 18953.134285714306, 9673, 31031, 19663.0, 23102.000000000004, 23991.4, 24793.58, 1.855277735076941, 96.82757135696338, 21.466339878267277], "isController": true}, {"data": ["Check No For Age 65-69", 350, 0, 0.0, 11541.24857142857, 8473, 19819, 11102.0, 13415.400000000001, 17142.8, 19252.91, 1.0151754223129756, 51.53998032735057, 10.100202346215427], "isController": true}, {"data": ["Check Yes For Under Age 45", 350, 218, 62.285714285714285, 48150.51714285718, 20137, 87506, 46075.5, 74327.8, 78210.59999999999, 86282.74, 3.7910790494140074, 385.6780437964407, 30.26039508798011], "isController": true}, {"data": ["http://20.254.113.19/PCUKchatbot/register/saveUserBot", 74200, 228, 0.30727762803234504, 870.41149595687, 1, 28394, 665.0, 919.0, 1042.0, 1432.8700000000208, 49.21547090317685, 25.081755506353904, 34.396263735518914], "isController": false}, {"data": ["Check No For Age 45-49", 350, 2, 0.5714285714285714, 8728.71428571429, 5105, 12498, 9012.5, 10712.7, 11113.6, 11650.660000000002, 2.6354032543465333, 125.75245763118662, 16.09809312103278], "isController": true}, {"data": ["5.Select Family History", 350, 26, 7.428571428571429, 2808.6571428571424, 241, 28000, 1525.5, 3322.1000000000026, 19769.299999999992, 26063.63, 6.268245070472984, 3.1723021641116103, 3.152486534466393], "isController": false}, {"data": ["Check Yes For Age 70-74", 350, 1, 0.2857142857142857, 7275.12857142857, 5366, 14173, 7151.0, 8214.900000000001, 8855.05, 11147.760000000011, 0.8891553532233152, 42.88394035784057, 5.9582389531974025], "isController": true}, {"data": ["Check Yes For Age 80 Or Older", 350, 7, 2.0, 7464.394285714286, 5584, 19360, 7035.0, 8711.300000000003, 10548.35, 15822.620000000004, 0.8441993854228474, 40.73794605761902, 5.65616885887157], "isController": true}, {"data": ["8.Yes – I’d like to sign up", 350, 22, 6.285714285714286, 2840.0685714285673, 253, 23359, 1613.5, 3450.6000000000004, 12088.849999999942, 23045.49, 5.304718167901909, 2.6868752747086195, 3.999260181269798], "isController": false}, {"data": ["Check Yes For Age 65-69", 350, 1, 0.2857142857142857, 14365.834285714296, 10391, 24869, 13452.5, 19387.10000000003, 21776.55, 23098.15, 1.0099611020695547, 52.821255889335674, 11.685402121423294], "isController": true}, {"data": ["7.Input User Details For Yes", 350, 22, 6.285714285714286, 2954.9257142857155, 242, 25965, 1557.0, 3337.3000000000025, 20863.25, 23039.45, 5.481683346645992, 2.7765246176525866, 2.7943737372550865], "isController": false}, {"data": ["Check No For Age 50-54", 350, 3, 0.8571428571428571, 14272.062857142859, 8778, 20030, 13902.0, 17468.800000000003, 18272.199999999997, 19261.81, 1.6489211344577406, 83.92564138615377, 16.405477068218225], "isController": true}, {"data": ["Check No For Age 75-79", 350, 21, 6.0, 11956.551428571425, 8388, 30877, 11138.0, 14247.400000000009, 20221.949999999997, 28363.530000000035, 0.8611908054348522, 43.80162050735211, 8.500037350306584], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.18867924528301888, 0.0011160714285714285], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 61, 11.50943396226415, 0.06808035714285714], "isController": false}, {"data": ["500/Internal Server Error", 468, 88.30188679245283, 0.5223214285714286], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 89600, 530, "500/Internal Server Error", 468, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 61, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://20.254.113.19/PCUKchatbot/chatbot", 5950, 28, "500/Internal Server Error", 21, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 7, "", "", "", "", "", ""], "isController": false}, {"data": ["2.Load web page", 350, 36, "500/Internal Server Error", 33, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["9.Yes, take me there", 350, 15, "500/Internal Server Error", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["6.Select Ethnicity", 350, 24, "500/Internal Server Error", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4.Age Selection", 350, 26, "500/Internal Server Error", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["3.OK, check my risk", 350, 41, "500/Internal Server Error", 40, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/updateUserStatus", 6300, 23, "500/Internal Server Error", 17, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["1.Test user journeys", 350, 39, "500/Internal Server Error", 39, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/saveUserBot", 74200, 228, "500/Internal Server Error", 183, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 45, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["5.Select Family History", 350, 26, "500/Internal Server Error", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["8.Yes – I’d like to sign up", 350, 22, "500/Internal Server Error", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["7.Input User Details For Yes", 350, 22, "500/Internal Server Error", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
