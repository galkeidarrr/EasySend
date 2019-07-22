const api = "http://localhost:3000";

document.getElementById("filters").addEventListener('change', e => {
    let displayGenerelSearch = 'none';
    let displayFilteredSearch = 'none';

    const value = e.target.value;
    if (value === 'Bank Name & Branch Number') {
        displayFilteredSearch = 'block'
    } else {
        displayGenerelSearch = 'block';
    }
    document.getElementById('generalSearchComp').style.display = displayGenerelSearch;
    document.getElementById('branchComp').style.display = displayFilteredSearch;

});

document.getElementById('submit').addEventListener('click', e => {
    searchBanks();
});

var start;

let body;
let  nameCode;
function searchBanks() {
    const keywords = document.getElementById('keywords').value;
    let tmpbr = branchNameInput.value.split(" | ");
    const branch = tmpbr.length > 0?tmpbr[0]:"";
    let tmpba = bankNameInput.value.split(" | ");
    const name = tmpba.length > 0?tmpba[0]:"";
    nameCode=tmpba.length > 0?tmpba[1]:"";

    let path;
    const filter = document.getElementById("filters").value;
    switch (filter) {
        case 'Bank Name & Branch Number':
            path = 'search';
            body = {bankName: name, branchCode: branch};
            if(branchNameInput.value === "") {
                path = 'searchByName';
                body = {searchParams: name};
            }
            break;
        default:
            path = 'searchByName';
            body = {searchParams: keywords};
            break;
    }
    fetch(api + '/' + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }
    ).then(response => {
        response.json().then(body => {
            /*
            if(start){map.clearOverlays();}
            body.forEach(b => {
                console.log(b);
                addMarker({lat:Number.parseFloat(b.X_Coordinate[0]), lng:Number.parseFloat(b.Y_Coordinate[0])});
            });*/
            renderResults(body);

        })
    });
}

function renderResults(results) {
    let htmlElements = "";
    results.forEach(bank => {
        htmlElements += "<div>" +
            "<b>Bank Number:</b> " + bank.Bank_Code[0] + "<br/>" +
            "<b> Branch Name:</b> " + bank.Branch_Name[0] + "<br/>" +
            "<b> Branch Address:</b> " + bank.Branch_Address[0] + "<br/>" +
            "<b> Zip Code:</b> " + bank.Zip_Code[0] + "<br/>" +
            "<b> P.O. Box:</b> " + bank.POB[0] + "<br/>" +
            "<b> Telephone:</b> " + bank.Telephone[0] + "<br/>" +
            "<b> Fax:</b> " + bank.Fax[0] + "<br/>" +
            "<b> Toll Free Number:</b> " + bank.Free_Tel[0] + "<br/>" +
            "<b> Handicap Access:</b> " + bank.Handicap_Access[0] + "<br/>" +
            "<b> Day Closed:</b> " + bank.day_closed[0] +
            "</div><hr/>"
    });
    document.getElementById("results").innerHTML = htmlElements;

}


/*An array containing all the country names in the world:*/
var bankNames = {data: []};
var currentBranches = {data: []};
var bankin={data: []};

fetch(api + '/namesAndCodes', {method: 'GET'})
    .then(response => {
        response.json().then(body => {
            bankNames.data = body.map(x => x.bankName + ' | ' + x.bankCode);
            bankin.data=body.map(x=>x);
            currentBranches.data=[];
        });
    });


function autocomplete(inp, list) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    closeAllLists();
    let handler = function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < list.data.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (list.data[i].includes(val.toUpperCase())) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + list.data[i].substr(0, val.length) + "</strong>";
                b.innerHTML += list.data[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + list.data[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);

            }
        }
    };

    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", handler);

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        checkFormValidation(bankNameInput.value);
        closeAllLists(e.target);
    });

}


var isValidBankName = false;
const bankNameInput = document.getElementById("bankName");
const branchNameInput = document.getElementById("branchName");

branchNameInput.setAttribute("disabled",true);
let checkFormValidation = (value) => {
    let bankNameValidation = document.getElementById("bankNameValidation");
    if (bankNames.data.includes(value)) {
        bankNameValidation.style.display = "none";
        isValidBankName = true;
        branchNameInput.removeAttribute("disabled");

    } else {
        isValidBankName =false;
        branchNameInput.setAttribute("disabled",true);
        bankNameValidation.style.display = "block";
    }
};

branchNameInput.addEventListener("click", e => {
    branchNameInput.value="";
    var res=[];
    var s=bankNameInput.value.split(" | ");
    var ba=s.length > 0?s[1]:"";

    for (var i=0;i<bankin.data.length;i++){
        if(ba===bankin.data[i].bankCode){
            res=bankin.data[i];
        }
    }
    fetch(api + '/branchesByCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({searchParams: res.bankCode})
        }
    ).then(response => {

        response.json().then(body => {
            console.log(body);
            currentBranches.data = body[0].branches.map(x => x.branchCode + ' | ' + x.branchName);
        })
    });
});


bankNameInput.addEventListener("keyup", (e) => {
    checkFormValidation(e.target.value)
});
autocomplete(bankNameInput, bankNames);
autocomplete(document.getElementById("branchName"), currentBranches);

/*
var map;
function initMap() {
    var options={
        zoom:8,
        center:{lat:32.109333,lng:34.855499}
    }
   map = new google.maps.Map(document.getElementById('map'),options);


    start=false;

}
var marker;
function addMarker(coords) {
    start=true;
    console.log(coords);
    marker = new google.maps.Marker({position:coords,map:map});
}
*/