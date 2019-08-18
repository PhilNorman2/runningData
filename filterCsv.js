const csv = require('csv-parser');  
const fs = require('fs');
   
var stream;
stream = fs.createWriteStream("./filteredData5.csv");

console.log(`Activity,Date,Time,Distance,Calories,Avg_Pace,Max_HR`);
//stream.write(`Date:Time:Distance:Calories:Avg_Pace:Max_HR\n`);
stream.write(`Activity,Date,Time,Distance,Calories,Avg_Pace,Max_HR\n`);

fs.createReadStream('Activities10.csv')  
  .pipe(csv())
  .on('data', (row) => {
    var words = row.Date.split(" ");
    var CaloriesNoCommas = row.Calories.replace(/,/g, '');
    if (row.Distance != 0) {
    	var Avg_Pace_Pad = row.Avg_Pace.padStart(5, '0');
	if (row.Activity_Type == "uncategorized") {
		row.Activity_Type = 'cycling';
		}
    	console.log(`"${row.Activity_Type}","${words[0]}",${words[1]},${row.Distance},${CaloriesNoCommas},"${Avg_Pace_Pad}",${row.Max_HR}\n`);
    	stream.write(`"${row.Activity_Type}","${words[0]}","${words[1]}","${row.Distance}","${CaloriesNoCommas}","${Avg_Pace_Pad}","${row.Max_HR}"\n`);
	}
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
