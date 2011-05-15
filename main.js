//all the jsonp magic is here, we create an script element and we set the url and callback function.
function jsonp(url, callback) {
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    // i add to the url the call back function
    var jsonpReq = url + "&jsoncallback=" + callback;
    scriptElement.src = jsonpReq;
    
    // If found then remove it
    var head = document.getElementsByTagName("head")[0];
    var scripts = head.getElementsByTagName("script");
    var scriptToRemove;
    for(i in scripts) {
        if(scripts[i].type == "text/javascript" && scripts[i].src == jsonpReq) {
            scriptToRemove = scripts[i];
        }
    }
    if(scriptToRemove) {
        head.removeChild(scriptToRemove);
    }
    console.log(scriptElement.cache);
    head.appendChild(scriptElement);
}

//this function just set the url, and make the call
function getPark() {
    var url = "http://api.sfpark.org/sfpark/rest/availabilityservice?lat=37.792275&long=-122.397089&radius=2&uom=mile&response=json";
    var callback = 'sfParkResults';
    jsonp(url, callback);
    
    setTimeout("getPark()", 5000);
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
    var lastUpdated = document.getElementById('lastUpdated');
    var table = document.getElementById('parkResults');
    
    lastUpdated.innerHTML = parking.AVAILABILITY_UPDATED_TIMESTAMP + Math.random();
    
    // Get the table
    var tbody = table.getElementsByTagName("tbody")[0];
    
    // Remove all the table contents
    if(tbody.hasChildNodes()) {
        while(tbody.childNodes.length >= 1) {
            tbody.removeChild(tbody.firstChild);
        }
    }
    
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