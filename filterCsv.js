const csv = require('csv-parser');  
const fs = require('fs');
   
var stream;
stream = fs.createWriteStream("./filteredData4.csv");

console.log(`Date,Time,Distance,Calories,Avg_Pace,Max_HR`);
//stream.write(`Date:Time:Distance:Calories:Avg_Pace:Max_HR\n`);
stream.write(`Date,Time,Distance,Calories,Avg_Pace,Max_HR\n`);

fs.createReadStream('Activities8.csv')  
  .pipe(csv())
  .on('data', (row) => {
    var words = row.Date.split(" ");
    var CaloriesNoCommas = row.Calories.replace(/,/g, '');
    /*
    if (row.Avg_Pace.length != 5) {
       console.log("Avg_Pace length not 5");
    } 
    */
    var Avg_Pace_Pad = row.Avg_Pace.padStart(5, '0');
    console.log(`"${words[0]}",${words[1]},${row.Distance},${CaloriesNoCommas},"${Avg_Pace_Pad}",${row.Max_HR}\n`);
    stream.write(`"${words[0]}","${words[1]}","${row.Distance}","${CaloriesNoCommas}","${Avg_Pace_Pad}","${row.Max_HR}"\n`);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
