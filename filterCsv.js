const csv = require('csv-parser');  
const fs = require('fs');
   
var stream;
stream = fs.createWriteStream("filteredData13.csv");

console.log(`Activity,Date,Time,Distance,Calories,Avg_Pace,Max_HR`);
stream.write(`Activity,Date,Time,Distance,Calories,Avg_Pace,Max_HR\n`);

fs.createReadStream('Activities.csv')  
  .pipe(csv())
  .on('data', (row) => {
    var words = row.Date.split(" ");
    var CaloriesNoCommas = row.Calories.replace(/,/g, '');
    if (row.Distance != 0) {
      var Avg_Pace_Pad = row.Avg_Pace.padStart(5, '0');
  //console.log(`row.Activity_Type: ${row.Activity_Type}`);
	if (row.Activity_Type.toLowerCase() === "uncategorized") {
		row.Activity_Type = 'cycling';
		}
    	console.log(`"${row.Activity_Type}","${words[0]}",${words[1]},${row.Distance},${CaloriesNoCommas},"${Avg_Pace_Pad}",${row.Max_HR}\n`);
    	stream.write(`"${row.Activity_Type}","${words[0]}","${words[1]}","${row.Distance}","${CaloriesNoCommas}","${Avg_Pace_Pad}","${row.Max_HR}"\n`);
	}
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
