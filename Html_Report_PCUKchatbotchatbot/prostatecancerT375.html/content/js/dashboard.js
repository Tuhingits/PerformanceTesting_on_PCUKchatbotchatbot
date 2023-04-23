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

    var data = {"OkPercent": 98.59166666666667, "KoPercent": 1.4083333333333334};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4211046228710462, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.32423529411764707, 500, 1500, "http://20.254.113.19/PCUKchatbot/chatbot"], "isController": false}, {"data": [0.06533333333333333, 500, 1500, "2.Load web page"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 55-59"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Under Age 45"], "isController": true}, {"data": [0.104, 500, 1500, "9.Yes, take me there"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 60-64"], "isController": true}, {"data": [0.108, 500, 1500, "6.Select Ethnicity"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 80 Or Older"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 55-59"], "isController": true}, {"data": [0.09733333333333333, 500, 1500, "4.Age Selection"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 60-64"], "isController": true}, {"data": [0.07333333333333333, 500, 1500, "3.OK, check my risk"], "isController": false}, {"data": [0.5848888888888889, 500, 1500, "http://20.254.113.19/PCUKchatbot/register/updateUserStatus"], "isController": false}, {"data": [0.010666666666666666, 500, 1500, "1.Test user journeys"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 75-79"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 70-74"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 45-49"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 50-54"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 65-69"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Under Age 45"], "isController": true}, {"data": [0.4650377358490566, 500, 1500, "http://20.254.113.19/PCUKchatbot/register/saveUserBot"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 45-49"], "isController": true}, {"data": [0.10933333333333334, 500, 1500, "5.Select Family History"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 70-74"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 80 Or Older"], "isController": true}, {"data": [0.08, 500, 1500, "8.Yes – I’d like to sign up"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 65-69"], "isController": true}, {"data": [0.10666666666666667, 500, 1500, "7.Input User Details For Yes"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 50-54"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 75-79"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 96000, 1352, 1.4083333333333334, 1308.7857083333317, 0, 31794, 704.0, 1110.0, 1236.0, 1948.9600000000064, 59.41027872084719, 225.9167395693188, 38.83993385655636], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://20.254.113.19/PCUKchatbot/chatbot", 6375, 88, 1.380392156862745, 2696.289254901974, 35, 28884, 1235.0, 6305.200000000007, 11557.2, 16914.999999999985, 4.078997545563202, 180.1185771834714, 1.5157693595222037], "isController": false}, {"data": ["2.Load web page", 375, 80, 21.333333333333332, 4268.122666666667, 13, 24009, 2659.0, 12613.400000000009, 15216.8, 20345.480000000032, 7.4591240004773836, 395.156650927915, 2.767917748239647], "isController": false}, {"data": ["Check No For Age 55-59", 375, 37, 9.866666666666667, 16188.576000000001, 9378, 29931, 16242.0, 19881.600000000002, 20987.399999999998, 26613.840000000033, 1.2168845160369153, 62.84679624222005, 12.074805972834271], "isController": true}, {"data": ["Check No For Under Age 45", 375, 22, 5.866666666666666, 17003.885333333325, 4926, 55420, 13813.0, 27612.2, 29196.6, 40263.5200000001, 3.5190450719292814, 169.59533694270056, 21.506039121224063], "isController": true}, {"data": ["9.Yes, take me there", 375, 24, 6.4, 3312.6666666666674, 245, 30662, 2150.0, 4637.800000000002, 14354.599999999993, 27221.560000000016, 3.9832596872875596, 2.017365435529614, 2.524546422900025], "isController": false}, {"data": ["Check Yes For Age 60-64", 375, 29, 7.733333333333333, 17505.191999999977, 10662, 25873, 17937.0, 20804.4, 21703.2, 24302.52, 1.183084727795866, 61.89795159724325, 13.679793041016758], "isController": true}, {"data": ["6.Select Ethnicity", 375, 25, 6.666666666666667, 5258.834666666663, 240, 31042, 2323.0, 20895.200000000008, 26856.6, 31012.44, 4.117259552042161, 2.1024292689119455, 2.249632019927536], "isController": false}, {"data": ["Check No For Age 80 Or Older", 375, 1, 0.26666666666666666, 10681.063999999995, 8408, 15318, 10584.0, 11953.4, 12710.4, 14754.720000000007, 0.7476762223010882, 37.96296423216643, 7.412183636383122], "isController": true}, {"data": ["Check Yes For Age 55-59", 375, 80, 21.333333333333332, 23863.703999999998, 11768, 46850, 23733.0, 29429.8, 31611.399999999998, 39484.8, 1.2368726581877671, 66.88405004263088, 14.260967813687397], "isController": true}, {"data": ["4.Age Selection", 375, 67, 17.866666666666667, 6228.253333333336, 238, 31308, 2454.0, 20781.8, 24973.6, 27600.240000000013, 4.909019505170834, 2.466053618765545, 2.3250727148514203], "isController": false}, {"data": ["Check No For Age 60-64", 375, 0, 0.0, 12544.138666666666, 9612, 20174, 12320.0, 14671.6, 15848.999999999998, 17157.120000000003, 1.1396929211393283, 57.86278835655521, 11.339054180241675], "isController": true}, {"data": ["3.OK, check my risk", 375, 89, 23.733333333333334, 5962.2586666666675, 258, 27755, 2724.0, 20190.0, 24702.0, 26762.96, 5.039442032978108, 2.520442811571903, 8.897764839476974], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/updateUserStatus", 6750, 47, 0.6962962962962963, 932.7522962963003, 3, 30810, 606.0, 1556.9000000000005, 2635.8999999999996, 4475.959999999999, 4.249117914595877, 2.1727168564868293, 1.6941402795132714], "isController": false}, {"data": ["1.Test user journeys", 375, 41, 10.933333333333334, 15216.874666666667, 1316, 28027, 15878.0, 26000.8, 26891.4, 27645.64, 9.94721345393777, 482.90573958360966, 3.7010628183108305], "isController": false}, {"data": ["Check Yes For Age 75-79", 375, 1, 0.26666666666666666, 8068.391999999997, 6173, 12910, 7930.0, 9483.0, 9859.8, 11227.440000000004, 0.9392187703497401, 45.299140102168224, 6.294030282448131], "isController": true}, {"data": ["Check No For Age 70-74", 375, 1, 0.26666666666666666, 12618.08533333334, 8941, 21953, 12549.0, 14587.2, 15059.0, 18222.88000000002, 0.9222211018943651, 46.82541140283355, 9.136665405273137], "isController": true}, {"data": ["Check Yes For Age 45-49", 375, 128, 34.13333333333333, 27619.416, 11276, 42026, 27831.0, 34690.2, 36174.0, 39858.2, 2.3533546285778835, 129.50452912903913, 27.19687370565495], "isController": true}, {"data": ["Check Yes For Age 50-54", 375, 126, 33.6, 28034.14666666668, 10374, 47610, 29354.0, 38174.0, 39819.99999999999, 46262.84000000001, 1.6481125814716986, 87.99401402076842, 18.926293967523392], "isController": true}, {"data": ["Check No For Age 65-69", 375, 0, 0.0, 12734.599999999999, 9091, 21148, 12369.0, 15431.400000000001, 16024.399999999998, 18057.8, 0.9844974468699544, 49.98343531769733, 9.79498045772568], "isController": true}, {"data": ["Check Yes For Under Age 45", 375, 304, 81.06666666666666, 67254.74666666669, 27659, 117030, 64751.0, 100004.00000000001, 107890.0, 114608.48000000001, 3.099942134413491, 331.9661915790072, 24.761659657353064], "isController": true}, {"data": ["http://20.254.113.19/PCUKchatbot/register/saveUserBot", 79500, 779, 0.979874213836478, 1031.9292578616362, 0, 31112, 710.0, 1046.0, 1193.0, 1554.9800000000032, 49.815151325271, 25.504104879104265, 34.76225393488784], "isController": false}, {"data": ["Check No For Age 45-49", 375, 94, 25.066666666666666, 14762.70666666667, 5392, 35341, 13470.0, 24098.600000000002, 25813.2, 31706.32, 2.1157990950022003, 104.12828658534005, 12.752461115138965], "isController": true}, {"data": ["5.Select Family History", 375, 56, 14.933333333333334, 5650.975999999998, 237, 31794, 2130.0, 21503.200000000008, 25643.399999999998, 31361.48, 4.297600220037131, 2.1633492774301497, 2.161390735663206], "isController": false}, {"data": ["Check Yes For Age 70-74", 375, 0, 0.0, 8540.75466666667, 5730, 15399, 8377.0, 10181.400000000001, 10631.199999999999, 12009.6, 1.006576298483425, 48.54371476982955, 6.7501557047711715], "isController": true}, {"data": ["Check Yes For Age 80 Or Older", 375, 1, 0.26666666666666666, 7414.208000000001, 5380, 13616, 7303.0, 8473.4, 9019.2, 10748.280000000002, 0.747999848405364, 36.076525511407496, 5.016988868640256], "isController": true}, {"data": ["8.Yes – I’d like to sign up", 375, 20, 5.333333333333333, 4139.429333333334, 236, 31047, 2186.0, 7000.800000000101, 21620.2, 28938.120000000014, 3.905761779777528, 1.9797635158886389, 2.944578216785402], "isController": false}, {"data": ["Check Yes For Age 65-69", 375, 0, 0.0, 15029.728000000001, 11203, 21465, 15081.0, 17079.4, 17650.8, 20004.08, 0.9956324921345032, 52.068467987096604, 11.524640555927997], "isController": true}, {"data": ["7.Input User Details For Yes", 375, 36, 9.6, 3616.264000000001, 234, 31416, 2098.0, 4632.600000000002, 21435.199999999997, 30444.960000000006, 3.9744785484144485, 2.008229489041038, 2.026052541281584], "isController": false}, {"data": ["Check No For Age 50-54", 375, 118, 31.466666666666665, 23324.114666666672, 9411, 51651, 22737.0, 31885.200000000004, 34214.799999999996, 41283.00000000002, 1.5031325281887453, 77.6718994885341, 14.826159435012565], "isController": true}, {"data": ["Check No For Age 75-79", 375, 1, 0.26666666666666666, 11861.688000000006, 8271, 20385, 11541.0, 14097.0, 14620.4, 15255.320000000003, 0.8080503361489398, 41.028435964704364, 8.005649281912602], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 201, 14.866863905325443, 0.209375], "isController": false}, {"data": ["500/Internal Server Error", 1151, 85.13313609467455, 1.1989583333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 96000, 1352, "500/Internal Server Error", 1151, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 201, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://20.254.113.19/PCUKchatbot/chatbot", 6375, 88, "500/Internal Server Error", 80, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["2.Load web page", 375, 80, "500/Internal Server Error", 79, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["9.Yes, take me there", 375, 24, "500/Internal Server Error", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["6.Select Ethnicity", 375, 25, "500/Internal Server Error", 24, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4.Age Selection", 375, 67, "500/Internal Server Error", 67, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["3.OK, check my risk", 375, 89, "500/Internal Server Error", 89, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/updateUserStatus", 6750, 47, "500/Internal Server Error", 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["1.Test user journeys", 375, 41, "500/Internal Server Error", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/saveUserBot", 79500, 779, "500/Internal Server Error", 600, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 179, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["5.Select Family History", 375, 56, "500/Internal Server Error", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["8.Yes – I’d like to sign up", 375, 20, "500/Internal Server Error", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["7.Input User Details For Yes", 375, 36, "500/Internal Server Error", 36, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
