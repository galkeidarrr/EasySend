const https = require('https');
const fs = require('fs');
let parser = require('xml2js');

let url = "https://www.boi.org.il/he/BankingSupervision/BanksAndBranchLocations/Lists/BoiBankBranchesDocs/snifim_dnld_he.xml";
var s={};
//read the xml -parse and save in json
let req =  https.get(url, function(res) {
    let data = '';
    res.on('data', function(stream) {
        data += stream;
    });
    res.on('end', function(){
        parser.parseString(data, function(error, result) {
            if(error === null) {
                s =  JSON.stringify( result, null, 3 );
                //console.log( "Result" + "\n", s, "\n" );
                fs.writeFileSync('banks.json', s);
            }
            else {
                console.log(error);
            }
        });
    });
});



// Get content from file
let contents = fs.readFileSync("banks.json");
// Define to JSON type
let jsonContent = JSON.parse(contents);

//console.log(jsonContent["BRANCHES"]["BRANCH"][0]);

//directly the banks
module.exports=jsonContent["BRANCHES"]["BRANCH"];
