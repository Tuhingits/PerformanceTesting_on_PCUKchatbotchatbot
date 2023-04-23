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

    var data = {"OkPercent": 98.61257530120481, "KoPercent": 1.3874246987951808};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.423373054260839, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.330049610205528, 500, 1500, "http://20.254.113.19/PCUKchatbot/chatbot"], "isController": false}, {"data": [0.07650602409638554, 500, 1500, "2.Load web page"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 55-59"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Under Age 45"], "isController": true}, {"data": [0.0572289156626506, 500, 1500, "9.Yes, take me there"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 60-64"], "isController": true}, {"data": [0.0789156626506024, 500, 1500, "6.Select Ethnicity"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 80 Or Older"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 55-59"], "isController": true}, {"data": [0.08132530120481928, 500, 1500, "4.Age Selection"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 60-64"], "isController": true}, {"data": [0.06506024096385542, 500, 1500, "3.OK, check my risk"], "isController": false}, {"data": [0.5838353413654619, 500, 1500, "http://20.254.113.19/PCUKchatbot/register/updateUserStatus"], "isController": false}, {"data": [0.010240963855421687, 500, 1500, "1.Test user journeys"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 75-79"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 70-74"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 45-49"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 50-54"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 65-69"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Under Age 45"], "isController": true}, {"data": [0.46838486019549896, 500, 1500, "http://20.254.113.19/PCUKchatbot/register/saveUserBot"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 45-49"], "isController": true}, {"data": [0.06867469879518072, 500, 1500, "5.Select Family History"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 70-74"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 80 Or Older"], "isController": true}, {"data": [0.06807228915662651, 500, 1500, "8.Yes – I’d like to sign up"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 65-69"], "isController": true}, {"data": [0.08072289156626505, 500, 1500, "7.Input User Details For Yes"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 50-54"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 75-79"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 212480, 2948, 1.3874246987951808, 1357.4533650225944, 0, 31754, 717.0, 1090.9000000000015, 1185.9500000000007, 1534.9800000000032, 60.42167206626592, 230.25860386069687, 39.56004599161865], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://20.254.113.19/PCUKchatbot/chatbot", 14110, 224, 1.5875265768958187, 3316.3221828490236, 32, 27239, 1211.0, 9982.699999999999, 14004.899999999998, 18703.67, 4.071418039411673, 180.35393410867252, 1.5137801792780115], "isController": false}, {"data": ["2.Load web page", 830, 162, 19.518072289156628, 5026.914457831324, 1, 29568, 2561.5, 18327.6, 19480.299999999985, 25492.149999999867, 0.4185792713493079, 21.71282949091431, 0.15480272198191738], "isController": false}, {"data": ["Check No For Age 55-59", 830, 104, 12.53012048192771, 17102.448192771062, 9429, 38991, 16664.0, 22037.3, 24022.0, 27911.249999999993, 0.3744899266721652, 19.178087739944267, 3.7251168469200233], "isController": true}, {"data": ["Check No For Under Age 45", 830, 214, 25.783132530120483, 20624.94578313253, 4187, 56461, 20466.0, 31887.899999999998, 34051.2, 49142.31999999996, 0.4056826857562365, 19.91399513697045, 2.4543711797704617], "isController": true}, {"data": ["9.Yes, take me there", 830, 71, 8.55421686746988, 3816.5746987951848, 6, 31390, 2225.5, 5400.699999999998, 19922.79999999995, 26820.66999999998, 0.4065048614063305, 0.20633450587130153, 0.25732792737986554], "isController": false}, {"data": ["Check Yes For Age 60-64", 830, 73, 8.795180722891565, 19137.130120481903, 11174, 35141, 18907.0, 25081.999999999996, 27526.949999999997, 30480.80999999998, 0.3670756980851032, 19.357908314220335, 4.248028778624165], "isController": true}, {"data": ["6.Select Ethnicity", 830, 77, 9.27710843373494, 4678.9542168674725, 229, 30695, 2038.0, 18841.5, 23716.55, 27371.699999999997, 0.41124940542254634, 0.20787323902880728, 0.22530362933793802], "isController": false}, {"data": ["Check No For Age 80 Or Older", 830, 0, 0.0, 10492.248192771081, 8447, 18394, 10329.5, 11895.9, 12342.899999999996, 13289.909999999993, 0.340982291926854, 17.311844116196497, 3.380852744075536], "isController": true}, {"data": ["Check Yes For Age 55-59", 830, 72, 8.674698795180722, 22357.421686746955, 13718, 44866, 21782.0, 28751.5, 30927.6, 34145.38, 0.3803657927418875, 20.05488666932464, 4.402436890211767], "isController": true}, {"data": ["4.Age Selection", 830, 178, 21.44578313253012, 5600.0614457831325, 233, 27807, 2058.0, 20439.199999999997, 23062.199999999993, 24990.859999999993, 0.4137651180053132, 0.20807285422282198, 0.19573662482446139], "isController": false}, {"data": ["Check No For Age 60-64", 830, 17, 2.0481927710843375, 13083.275903614467, 9510, 22886, 12952.0, 15054.6, 15463.05, 18247.25, 0.3667449792391411, 18.678989935446257, 3.6488260239144243], "isController": true}, {"data": ["3.OK, check my risk", 830, 167, 20.120481927710845, 5951.66867469879, 1, 29355, 2475.5, 20408.8, 22843.699999999997, 27179.26, 0.4142191968140056, 0.21164499449787152, 0.726950011727893], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/updateUserStatus", 14940, 136, 0.9103078982597055, 943.8291164658664, 4, 27184, 613.0, 1531.8999999999996, 2362.949999999999, 5118.950000000001, 4.275638448120679, 2.1780391616929697, 1.7067213572111333], "isController": false}, {"data": ["1.Test user journeys", 830, 117, 14.096385542168674, 16423.18433734939, 1032, 31754, 16892.0, 26871.2, 28349.7, 29818.25, 0.4222465960819586, 21.09721543075385, 0.1571054229562756], "isController": false}, {"data": ["Check Yes For Age 75-79", 830, 0, 0.0, 7878.262650602415, 5698, 11969, 7844.0, 9003.5, 9314.749999999998, 10076.419999999998, 0.3438101538322612, 16.58078187192616, 2.3056096937169315], "isController": true}, {"data": ["Check No For Age 70-74", 830, 0, 0.0, 12079.03132530121, 8943, 18978, 11945.5, 13748.6, 14209.25, 15130.66, 0.34424021828977314, 17.47725069205763, 3.411138178697586], "isController": true}, {"data": ["Check Yes For Age 45-49", 830, 439, 52.89156626506024, 32516.437349397536, 13255, 65377, 31201.5, 42962.3, 47010.49999999998, 54908.74999999999, 0.3966090404880489, 22.658607386048967, 4.575435360551067], "isController": true}, {"data": ["Check Yes For Age 50-54", 830, 109, 13.132530120481928, 27648.384337349402, 10705, 55868, 26151.0, 40429.8, 42354.1, 49952.49999999998, 0.3912322496042898, 21.11487199355103, 4.528032258365771], "isController": true}, {"data": ["Check No For Age 65-69", 830, 1, 0.12048192771084337, 12731.910843373485, 8719, 19998, 12755.5, 14494.3, 15187.35, 16439.519999999993, 0.34994032041884904, 17.766632537603826, 3.4816327972922205], "isController": true}, {"data": ["Check Yes For Under Age 45", 830, 691, 83.25301204819277, 71158.41204819288, 24147, 121384, 69148.5, 102827.8, 108892.34999999995, 116567.35999999999, 0.40397963747938126, 43.39005391485472, 3.2216601325698115], "isController": true}, {"data": ["http://20.254.113.19/PCUKchatbot/register/saveUserBot", 175960, 1549, 0.8803137076608321, 1031.6654296431034, 0, 30944, 715.0, 1005.0, 1116.0, 1398.9700000000048, 50.17928915145214, 25.556399613635016, 35.07554285711536], "isController": false}, {"data": ["Check No For Age 45-49", 830, 82, 9.879518072289157, 13785.206024096382, 5877, 44414, 12964.5, 22844.2, 26605.149999999998, 35488.38999999996, 0.39992676040050495, 19.427598518855582, 2.4429119983448815], "isController": true}, {"data": ["5.Select Family History", 830, 117, 14.096385542168674, 6151.489156626502, 232, 30695, 2058.5, 22782.8, 24077.35, 27465.209999999992, 0.41112799652869275, 0.20710127797651717, 0.20676847481667654], "isController": false}, {"data": ["Check Yes For Age 70-74", 830, 2, 0.24096385542168675, 8078.298795180727, 5961, 13797, 7968.5, 9293.7, 9782.35, 10862.119999999992, 0.34620290493435074, 16.697457511153573, 2.320598984207308], "isController": true}, {"data": ["Check Yes For Age 80 Or Older", 830, 0, 0.0, 7459.956626506033, 5493, 14908, 7367.5, 8585.8, 8912.749999999998, 9432.549999999994, 0.34703349082242757, 16.73623233474098, 2.3292589672095163], "isController": true}, {"data": ["8.Yes – I’d like to sign up", 830, 69, 8.313253012048193, 3968.490361445784, 232, 28519, 2071.5, 5982.499999999998, 20036.949999999986, 27009.639999999974, 0.40694632868221464, 0.20583080238048895, 0.3067993806080759], "isController": false}, {"data": ["Check Yes For Age 65-69", 830, 4, 0.4819277108433735, 15748.390361445789, 11295, 22544, 15457.5, 18724.2, 19483.9, 20671.629999999986, 0.3535456367782877, 18.4906098491851, 4.091298228896094], "isController": true}, {"data": ["7.Input User Details For Yes", 830, 81, 9.759036144578314, 3811.251807228916, 28, 31575, 1967.5, 5785.5, 21098.649999999998, 27083.829999999994, 0.4076244433225223, 0.20672533215253208, 0.20754257618893734], "isController": false}, {"data": ["Check No For Age 50-54", 830, 105, 12.650602409638553, 23935.1843373494, 8961, 51087, 23588.5, 34287.7, 35805.7, 39552.52999999997, 0.38846802252927315, 20.098466240929508, 3.864953333523667], "isController": true}, {"data": ["Check No For Age 75-79", 830, 0, 0.0, 11691.13012048193, 8605, 15373, 11700.5, 13238.7, 13543.0, 14258.109999999999, 0.34671282820755317, 17.60278635320555, 3.435639714669963], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 125, 4.240162822252374, 0.058829066265060244], "isController": false}, {"data": ["500/Internal Server Error", 2823, 95.75983717774763, 1.3285956325301205], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 212480, 2948, "500/Internal Server Error", 2823, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 125, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://20.254.113.19/PCUKchatbot/chatbot", 14110, 224, "500/Internal Server Error", 214, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["2.Load web page", 830, 162, "500/Internal Server Error", 157, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["9.Yes, take me there", 830, 71, "500/Internal Server Error", 70, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["6.Select Ethnicity", 830, 77, "500/Internal Server Error", 77, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4.Age Selection", 830, 178, "500/Internal Server Error", 177, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["3.OK, check my risk", 830, 167, "500/Internal Server Error", 162, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/updateUserStatus", 14940, 136, "500/Internal Server Error", 127, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["1.Test user journeys", 830, 117, "500/Internal Server Error", 117, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/saveUserBot", 175960, 1549, "500/Internal Server Error", 1456, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 93, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["5.Select Family History", 830, 117, "500/Internal Server Error", 117, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["8.Yes – I’d like to sign up", 830, 69, "500/Internal Server Error", 69, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["7.Input User Details For Yes", 830, 81, "500/Internal Server Error", 80, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
