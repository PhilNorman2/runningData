var express = require('express');
var app = express();
var http = require('http');
var path = require('path');

//load .env file
require('dotenv').config();
//console.log("All env variables: " + buildResultsJSON(process.env));
var OS = require('os');
console.log("OS.hostnanme: " +  OS.hostname());

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * create path for accessing files 
 */

app.use(express.static(path.join(__dirname, 'public')));

/**
 * route for browser access
 */

app.get('/', function (req,res) { 
        console.log('in / route');
	res.sendFile(__dirname + '/index.html');
});


/**
 * route for API access
 */

app.get('/:startDate/:endDate/:activity', function (req, res) {
	
    var format = req.params.format,   
       	startDate = req.params.startDate,
       	endDate = req.params.endDate;
	activity = req.params.activity;
    
    console.log("startDate: " + startDate); 
    console.log("endDate: " + endDate); 
    console.log("activity: " + activity); 
    console.log("reached api route");
    console.log("host:port " + req.hostname + ':' + port);
    //res.sendFile(__dirname + '/mockJSONresponse.json');

/**
 * configure SQL server connection variables
 */

    sql = require("mssql");



    var config = {
        user:  process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        server: process.env.RDS_HOSTNAME,
        database: process.env.RDS_DATABASE 
    };

    console.log("startDate: " + startDate); 
    console.log("endDate: " + endDate); 
    console.log("activity: " + activity); 

    sql.close(); // in case connection was left open

/**
 * make SQL server connection, execute stored procedure query, and return results
 */

    sql.connect(config, function (err) {
        if (err) {
            
            console.log(err);
            res.send(buildResultsJSON(err));
        }
        else {
            console.log('success!');
            const request = new sql.Request;
	    request.input('startDate', sql.Date, startDate);
	    request.input('endDate', sql.Date, endDate);
	    request.input('activity', sql.NVARCHAR(50), activity);
	    //request.execute('runningStats', function (err,result) {
	    request.execute('runningStats-rds', function (err,result) {
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

/**
 * format JSON for response from query results
 */

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

/**
 * initiate server
 */

const server = http.createServer(app).listen(port, () => {
  console.log(`listening on ${port}`)
});
