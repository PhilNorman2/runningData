var express = require('express');
var app = express();

app.get('/:startDate/:endDate/:activity', function (req, res) {
	
    var format = req.params.format,   
       	startDate = req.params.startDate,
       	endDate = req.params.endDate;
	activity = req.params.activity;

    sql = require("mssql");

    var config = {
        user:  'sa',
        password: 'Your*Password*Here',
        server: 'localhost',
        database: 'Running'
    };

    console.log("startDate: " + startDate); 
    console.log("endDate: " + endDate); 
    console.log("activity: " + activity); 

    sql.close(); // in case connection was left open
    sql.connect(config, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('success!');
            const request = new sql.Request;
	    request.input('startDate', sql.Date, startDate);
	    request.input('endDate', sql.Date, endDate);
	    request.input('activity', sql.NVARCHAR(50), activity);
	    request.execute('runningStats', function (err,result) {
                if (err) {
			console.log("Encountered query error: " + err);
			sql.close();
                        }
		else {
                	console.log(result.recordset[0]);
                	res.append('Access-Control-Allow-Origin', ['*']);
                	res.send(buildResultsJSON(result.recordset[0]));
                	sql.close();
			}
            });
        }
    });
});    

function buildResultsJSON(resultsObj) {
    var resultsJSON = JSON.stringify(resultsObj);
    console.log(resultsJSON);
    var resultsArr = Object.entries(resultsObj);
    console.log(resultsArr.length);
    var fmtResultsJSON = `{\n "results": [`;
    for (let [key, value] of resultsArr) {
        console.log(`${key}: ${value}`);
        fmtResultsJSON += `\n\t{\n\t"label": "${key}",\n\t"value": "${value}"\n\t},`;
        
    }
    /* remove comma after last JSON array element */
    fmtResultsJSON = fmtResultsJSON.substring(0, fmtResultsJSON.length - 1);
    fmtResultsJSON += `\n]\n}`;
    console.log("fmtresultsJson: " + fmtResultsJSON);
    return fmtResultsJSON;
}

var server = app.listen(5000, function () {
    console.log('Server is running..');
});
