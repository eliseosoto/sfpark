//all the jsonp magic is here, we create an script element and we set the url and callback function.
function jsonp(url, callback) {
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    // i add to the url the call back function
    scriptElement.src = url + "&jsoncallback="+callback;
    document.getElementsByTagName("head")[0].appendChild(scriptElement);
}

//this function just set the url, and make the call
function getPark() {
    var url = "http://api.sfpark.org/sfpark/rest/availabilityservice?lat=37.792275&long=-122.397089&radius=2&uom=mile&response=json";
    var callback = 'sfParkResults';
    jsonp(url, callback);
}

function createTableRow(element) {
    var args = arguments;
    var tableRow = document.createElement('tr');
    
    for(i in args) {
        var tableData = document.createElement('td');
        tableData.innerHTML = args[i];
        tableRow.appendChild(tableData);
    }
    
    return tableRow;
}

function sfParkResults(parking) {    
    var content = document.getElementById('results');
    var table = document.getElementById('xxx');
    
    var item = document.createElement('li');
    item.innerHTML = parking.AVAILABILITY_UPDATED_TIMESTAMP;
    content.appendChild(item);
    
    var tbody = table.getElementsByTagName("tbody")[0];
    
    for(i in parking.AVL) {
        var obj = parking.AVL[i];
        
        // Need to sanitize OCC since sometimes is greater than OPER (service bug?)
        var percentage = obj.OPER == 0 ? 0.0 : ((Math.min(obj.OCC, obj.OPER) * 100) / obj.OPER).toFixed(0);
        
        var tableRow = createTableRow(obj.NAME, obj.OPER, obj.OCC, percentage);
        tbody.appendChild(tableRow);
    }
}

// wait for all the page elements to load (including images), not very effective but I wanted to keep it simple
window.onload = function() {
    getPark();
}