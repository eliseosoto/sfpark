refreshRate = 5000; // In Milliseconds

/**
Inserts <script> in the <head> to handle JSONP requests
**/
function jsonp(url, callback) {
    var head = document.getElementsByTagName("head")[0];
    var scripts = head.getElementsByTagName("script");
    var scriptToRemove;
    
    // Remove previous wrapper function
    var wrapScriptPrefix = callback + "_";
    for(i in scripts) {
        if(scripts[i].type == "text/javascript" && scripts[i].innerHTML && beginsWith(scripts[i].innerHTML, wrapScriptPrefix)) {
            scriptToRemove = scripts[i];
            break;
        } 
    }
    if(scriptToRemove) {
        head.removeChild(scriptToRemove);
        scriptToRemove = null;
    }
    
    // Create wrapper function that points to the callback
    var wrapScript = document.createElement("script");
    wrapScript.type = "text/javascript";
    callbackWrap = wrapScriptPrefix + Math.round(Math.random() * 10000); // Adds a _9999 suffix
    wrapScript.innerHTML = callbackWrap + '=' + callback ;
    head.appendChild(wrapScript);
    
    // Remove previous script
    for(i in scripts) {
        if(scripts[i].type == "text/javascript" && scripts[i].src && beginsWith(scripts[i].src, url)) {
            scriptToRemove = scripts[i];
            break;
        }
    }
    if(scriptToRemove) {
        head.removeChild(scriptToRemove);
    }
    
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    // i add to the url the call back function
    var jsonpReq = url + "&jsoncallback=" + callbackWrap;
    scriptElement.src = jsonpReq;
    head.appendChild(scriptElement);
}

/**
Determines if string begins with subString
**/
function beginsWith(string, subString) {
    return string.substr(0, subString.length) === subString;
}

/**
Main function that gets refreshed every refreshRate milliseconds and makes the call to the SFPark service
**/
function getPark() {
    var url = "http://api.sfpark.org/sfpark/rest/availabilityservice?lat=37.792275&long=-122.397089&radius=2&uom=mile&response=json";
    jsonp(url, 'sfParkResults');
    
    setTimeout("getPark()", refreshRate);
}

/**
Creates a <tr> with a variable number of <td>s
**/
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

/**
Refreshes the UI with the data coming from the SFPark service
**/
function sfParkResults(parking) {    
    var lastUpdated = document.getElementById('lastUpdated');
    var table = document.getElementById('parkResults');
    
    lastUpdated.innerHTML = parking.AVAILABILITY_UPDATED_TIMESTAMP;
    
    // Get the table
    var tbody = table.getElementsByTagName("tbody")[0];
    
    // Remove the table contents
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
    
    // Footer
    var tfoot = table.getElementsByTagName("tfoot")[0];
    tfoot.removeChild(tfoot.firstChild);
    tfoot.appendChild(createTableRow(1,2,3,Math.random()));
}

// wait for all the page elements to load (including images), not very effective but I wanted to keep it simple
window.onload = function() {
    getPark();
}