// URL FOR IMPORT CSV

let link = "/acme_worksheet.csv"; //Change this link to load file



//Search Name in Temporary veriable

function search(nameKey, myArray){
        for (let i=0; i < myArray.length; i++) {
            if (myArray[i]['Date/Name'] === nameKey) {
                return myArray[i];
            }
        }
    }

// CSV Sort by name [A-z]

function dynamicSort(property) {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

// global veriables
let final_arr = []; 
let csv; 

// d3 JavaScript library to parse CSV

d3.csv(link).then(function(data) {

        let allGroupDate = d3.map(data, function(d){return(d.Date)}).keys(); // array of grouped dates
        let firstObj = {};
        
        // Algorithm

        firstObj['Date/Name'] = data[0]['Employee Name'];
        firstObj[data[0].Date.toString()] = data[0]['Work Hours'];

        final_arr.push(firstObj);

        let temp = [];
        temp.push(data[0]['Employee Name']); // Push data to temporary array

        for(let i = 1; i < data.length; i++)
        {
            if(!temp.includes(data[i]['Employee Name']))
            {   
                let obj = new Object();
                obj['Date/Name'] = data[i]['Employee Name'];
                obj[data[i].Date.toString()] = data[i]['Work Hours'];
                final_arr.push(obj);
                temp.push(data[i]['Employee Name']);
            }
            else{
                index = final_arr.indexOf(search(data[i]['Employee Name'], final_arr));
                final_arr[index][data[i].Date.toString()] = data[i]['Work Hours'];              
            }
        }

        // This loop adds zero value to csv export 

        for (let i = 0; i < final_arr.length; i++){
            allGroupDate.forEach(element => {   
                if (final_arr[i][element] == undefined){
                    final_arr[i][element] = 0;
                }
            });
        }
        
        final_arr.sort(dynamicSort("Date/Name"));
        
        // Unparse array to CSV format

        csv = Papa.unparse(final_arr,{
            quotes: false, //or array of booleans
	        quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true,
            newline: "\r\n",
            skipEmptyLines: true, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
            columns: false //or array of strings
        });
});
