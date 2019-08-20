var express = require('express');
var app = express();

app.get('/:startDate/:endDate', function (req, res) {
	
    var format = req.params.format,   
       	startDate = req.params.startDate,
       	endDate = req.params.endDate;

    sql = require("mssql");

    var config = {
        user:  'sa',
        password: 'Your*Password*Here',
        server: 'localhost',
        database: 'Running'
    };

    console.log("startDate: " + startDate); 

    sql.connect(config, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('success!');
            const request = new sql.Request;
	    //request.input('startDate', sql.Date, '2019-06-01');
	    request.input('startDate', sql.Date, startDate);
	    request.input('endDate', sql.Date, endDate);
	    request.execute('runningStats2', function (err,result) {
                if (err) console.log(err)
                console.log(result.recordset[0]);
                res.append('Access-Control-Allow-Origin', ['*']);
                res.send(buildResultsJSON(result.recordset[0]));
                sql.close();
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
