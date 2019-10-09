Web application for P Norman's Garmin running data

In addition to code this app requires:

1. CSV Activities file exported from Garmin with spaces removed from headers of the fields used in filterCSV.js
2. SQL Server database table (Running) derived from import of output of filtrCSV.js
3. SQL Server Stored Procedure (runningStats-rds).  See runningStatsCreate.sql 

To start application locally clone the respository locally and run:

npm install
npm start

Note: This application has been deployed and tested to AWS Elastic Beanstalk.
