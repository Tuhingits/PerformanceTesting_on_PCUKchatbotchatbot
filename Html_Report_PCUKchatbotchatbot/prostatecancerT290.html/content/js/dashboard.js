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

    var data = {"OkPercent": 99.1252035212628, "KoPercent": 0.8747964787372023};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.46879552398509716, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.34919975057160674, 500, 1500, "http://20.254.113.19/PCUKchatbot/chatbot"], "isController": false}, {"data": [0.008802816901408451, 500, 1500, "2.Load web page"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 55-59"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Under Age 45"], "isController": true}, {"data": [0.176056338028169, 500, 1500, "9.Yes, take me there"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 60-64"], "isController": true}, {"data": [0.21654929577464788, 500, 1500, "6.Select Ethnicity"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 80 Or Older"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 55-59"], "isController": true}, {"data": [0.2535211267605634, 500, 1500, "4.Age Selection"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 60-64"], "isController": true}, {"data": [0.11619718309859155, 500, 1500, "3.OK, check my risk"], "isController": false}, {"data": [0.6574092247301275, 500, 1500, "http://20.254.113.19/PCUKchatbot/register/updateUserStatus"], "isController": false}, {"data": [0.0, 500, 1500, "1.Test user journeys"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 75-79"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 70-74"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 45-49"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 50-54"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 65-69"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Under Age 45"], "isController": true}, {"data": [0.515063904950759, 500, 1500, "http://20.254.113.19/PCUKchatbot/register/saveUserBot"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 45-49"], "isController": true}, {"data": [0.25880281690140844, 500, 1500, "5.Select Family History"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 70-74"], "isController": true}, {"data": [0.0, 500, 1500, "Check Yes For Age 80 Or Older"], "isController": true}, {"data": [0.2130281690140845, 500, 1500, "8.Yes – I’d like to sign up"], "isController": false}, {"data": [0.0, 500, 1500, "Check Yes For Age 65-69"], "isController": true}, {"data": [0.2535211267605634, 500, 1500, "7.Input User Details For Yes"], "isController": false}, {"data": [0.0, 500, 1500, "Check No For Age 50-54"], "isController": true}, {"data": [0.0, 500, 1500, "Check No For Age 75-79"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 72474, 634, 0.8747964787372023, 1052.119366945372, 0, 105543, 614.0, 938.9000000000015, 1057.0, 1371.9900000000016, 45.47947543666547, 162.51667386428386, 29.590635391474024], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://20.254.113.19/PCUKchatbot/chatbot", 4811, 7, 0.1454998960715028, 1719.0794013718587, 2, 19308, 1122.0, 2856.4000000000015, 4149.599999999997, 9834.720000000021, 3.0883356432192386, 134.6634543495157, 1.1476449444712629], "isController": false}, {"data": ["2.Load web page", 284, 242, 85.21126760563381, 1754.6901408450713, 0, 39049, 1.0, 5975.0, 14994.0, 28837.799999999857, 2.8166220370921353, 23.106797564588913, 0.15498317093127045], "isController": false}, {"data": ["Check No For Age 55-59", 284, 11, 3.8732394366197185, 16219.503521126759, 8396, 31106, 15692.0, 22631.0, 24690.25, 28793.799999999967, 0.9232319620304601, 46.92695592501991, 9.134030032467532], "isController": true}, {"data": ["Check No For Under Age 45", 284, 11, 3.8732394366197185, 9006.862676056337, 4753, 26965, 6065.5, 17911.0, 20401.5, 25620.899999999998, 2.9990073707998057, 143.25432889290167, 18.27013778340092], "isController": true}, {"data": ["9.Yes, take me there", 284, 10, 3.5211267605633805, 2124.4542253521113, 2, 13978, 1640.5, 3269.5, 4614.75, 13665.25, 3.14155816860433, 1.6118828366113207, 1.9840743430658954], "isController": false}, {"data": ["Check Yes For Age 60-64", 284, 12, 4.225352112676056, 18199.190140845065, 9922, 32951, 18806.5, 23353.5, 24768.5, 27411.699999999946, 0.8252071734910913, 42.70707043099641, 9.512588631681563], "isController": true}, {"data": ["6.Select Ethnicity", 284, 16, 5.633802816901408, 1820.728873239437, 254, 14079, 1527.5, 3178.0, 3936.5, 8888.849999999873, 3.1257566752514916, 1.5839878574258732, 1.7124506785313345], "isController": false}, {"data": ["Check No For Age 80 Or Older", 282, 0, 0.0, 9617.475177304968, 8275, 14995, 9416.0, 10693.7, 11222.599999999999, 12775.82000000001, 0.5774913529885177, 29.318965292155333, 5.72584932313713], "isController": true}, {"data": ["Check Yes For Age 55-59", 284, 10, 3.5211267605633805, 18131.926056338052, 10678, 32931, 18045.0, 21804.5, 23240.25, 31101.89999999997, 1.023456616610989, 53.57794121025547, 11.821160416013493], "isController": true}, {"data": ["4.Age Selection", 284, 23, 8.098591549295774, 2357.359154929578, 291, 16058, 1301.0, 4169.5, 12450.0, 14057.14999999999, 3.0233994080950457, 1.5297684078714844, 1.4319811649668917], "isController": false}, {"data": ["Check No For Age 60-64", 283, 41, 14.487632508833922, 16842.445229681987, 8422, 45005, 14108.0, 28804.0, 31928.800000000003, 40676.88000000007, 0.756405390524352, 38.594022083763214, 7.382647328659479], "isController": true}, {"data": ["3.OK, check my risk", 284, 57, 20.070422535211268, 3651.718309859157, 0, 16423, 2161.5, 11046.5, 13983.5, 16294.55, 2.8910560498401776, 1.9156864922022925, 4.583284555245638], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/updateUserStatus", 5095, 14, 0.2747791952894995, 778.4314033366031, 3, 14826, 541.0, 1346.800000000001, 2184.2, 3278.4399999999996, 3.24582454454934, 1.6581378747987683, 1.294646810332361], "isController": false}, {"data": ["1.Test user journeys", 285, 0, 0.0, 23132.11578947368, 6115, 105543, 20526.0, 38021.20000000003, 42266.2, 79589.31999999975, 2.6797299584406793, 116.96079176030051, 0.9970479630526355], "isController": false}, {"data": ["Check Yes For Age 75-79", 282, 0, 0.0, 6568.39361702127, 5193, 10013, 6452.0, 7428.8, 8056.25, 9366.780000000002, 0.630653800136418, 30.41364903528978, 4.229198872594514], "isController": true}, {"data": ["Check No For Age 70-74", 282, 0, 0.0, 10063.120567375894, 8428, 22989, 10027.5, 10861.8, 11455.54999999999, 13471.400000000014, 0.598122912137441, 30.366419879102814, 5.926907411580677], "isController": true}, {"data": ["Check Yes For Age 45-49", 284, 0, 0.0, 15815.46830985916, 10433, 20311, 15867.0, 19301.0, 19871.75, 20156.3, 2.1361414065438136, 111.71143404475367, 24.686618559608878], "isController": true}, {"data": ["Check Yes For Age 50-54", 284, 10, 3.5211267605633805, 18579.03169014085, 9938, 29933, 18745.5, 23781.0, 25394.5, 28823.899999999998, 1.3453849506376365, 70.22633625830207, 15.54163976044805], "isController": true}, {"data": ["Check No For Age 65-69", 282, 15, 5.319148936170213, 13246.535460992915, 8507, 30399, 12270.0, 18322.800000000003, 21400.449999999993, 29497.920000000006, 0.7034471404374842, 35.77115967673237, 6.946781678663101], "isController": true}, {"data": ["Check Yes For Under Age 45", 284, 274, 96.47887323943662, 49566.876760563355, 23628, 113268, 44634.0, 76102.5, 80011.75, 93204.74999999971, 2.4841460747867923, 143.05240166466214, 18.607904070085283], "isController": true}, {"data": ["http://20.254.113.19/PCUKchatbot/register/saveUserBot", 60011, 217, 0.3616003732649014, 874.9886687440711, 0, 24200, 622.0, 848.0, 955.0, 1312.0, 38.19874985678094, 19.58956825223422, 26.60130279114047], "isController": false}, {"data": ["Check No For Age 45-49", 284, 10, 3.5211267605633805, 8702.021126760566, 4846, 22669, 8489.5, 10867.0, 12921.75, 17804.249999999884, 1.8713142028794518, 89.39432469607618, 11.353960327232894], "isController": true}, {"data": ["5.Select Family History", 284, 17, 5.985915492957746, 1974.4260563380276, 267, 16043, 1422.0, 3783.5, 5665.75, 14570.649999999996, 3.1030451361952736, 1.572137263310862, 1.5606135206450837], "isController": false}, {"data": ["Check Yes For Age 70-74", 282, 3, 1.0638297872340425, 7365.539007092195, 5529, 19056, 6826.0, 9484.800000000001, 10237.949999999995, 17669.65000000001, 0.6724404341771427, 32.439822859189306, 4.496791712469716], "isController": true}, {"data": ["Check Yes For Age 80 Or Older", 282, 0, 0.0, 6638.968085106381, 5207, 10608, 6539.0, 7595.700000000001, 8032.15, 9218.890000000001, 0.6072573716092105, 29.285342560720355, 4.075859292060648], "isController": true}, {"data": ["8.Yes – I’d like to sign up", 284, 19, 6.690140845070423, 1799.9436619718313, 320, 14719, 1523.5, 3037.5, 3787.5, 13651.299999999992, 3.136839082364116, 1.5882987583805515, 2.364882589438572], "isController": false}, {"data": ["Check Yes For Age 65-69", 282, 34, 12.056737588652481, 20178.464539007095, 10168, 45824, 18836.5, 31061.200000000004, 35376.85, 42568.28000000004, 0.6451317715959004, 33.874795447331394, 7.37397848774364], "isController": true}, {"data": ["7.Input User Details For Yes", 284, 12, 4.225352112676056, 1816.3345070422538, 291, 12246, 1478.5, 3291.5, 4098.0, 8474.449999999944, 3.131063679661316, 1.5882814050372642, 1.5961086335773507], "isController": false}, {"data": ["Check No For Age 50-54", 284, 6, 2.112676056338028, 14614.644366197184, 8579, 34006, 14013.0, 18251.0, 19936.25, 25727.799999999923, 1.2235683388767298, 62.1618879330958, 12.159488053513881], "isController": true}, {"data": ["Check No For Age 75-79", 282, 1, 0.3546099290780142, 9758.982269503536, 7951, 16470, 9632.0, 10886.7, 11341.8, 12535.870000000004, 0.6158092650906026, 31.267702213228322, 6.101136776806264], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, 1.2618296529968454, 0.011038441372078262], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 435, 68.61198738170347, 0.6002152496067555], "isController": false}, {"data": ["500/Internal Server Error", 191, 30.126182965299684, 0.26354278775836854], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 72474, 634, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 435, "500/Internal Server Error", 191, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://20.254.113.19/PCUKchatbot/chatbot", 4811, 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 6, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["2.Load web page", 284, 242, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 238, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["9.Yes, take me there", 284, 10, "500/Internal Server Error", 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["6.Select Ethnicity", 284, 16, "500/Internal Server Error", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4.Age Selection", 284, 23, "500/Internal Server Error", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["3.OK, check my risk", 284, 57, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 29, "500/Internal Server Error", 28, "", "", "", "", "", ""], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/updateUserStatus", 5095, 14, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 7, "500/Internal Server Error", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://20.254.113.19/PCUKchatbot/register/saveUserBot", 60011, 217, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 20.77.82.176:80 failed to respond", 154, "500/Internal Server Error", 59, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["5.Select Family History", 284, 17, "500/Internal Server Error", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["8.Yes – I’d like to sign up", 284, 19, "500/Internal Server Error", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["7.Input User Details For Yes", 284, 12, "500/Internal Server Error", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
