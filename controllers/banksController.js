
let banks=require('../models/banks')



class banksController {

    static  getNamesandCodes(){
        let bankNamesC = new Array();
        //all names of banks
        banks.map(bank=> {
            bankNamesC.push({bankName:bank["Bank_Name"][0].replace(/\n/g,''),bankCode:bank["Bank_Code"][0].replace(/\n/g, '')});
        });
        const result = [];
        const map = new Map();
        for (const item of bankNamesC) {
            if(!map.has(item.bankCode)){
                map.set(item.bankCode, true);    // set any value to Map
                result.push({
                    bankName: item.bankName,
                    bankCode: item.bankCode

                });
            }
        }
        return result;
    }

    static async getBanksCode() {

        //all codes of banks
        banks.map(bank=> {
            bankCodes.add(bank["Bank_Code"][0].replace(/\n/g, ''))
        });
    }

    static async getBranchesByBCode() {
        let bankinf=new Array();
        let branches=new Array();
        let finalBranches=new Set();
        let bcodes=new Set();
        banks.map(b=>{
            bankinf.push({bankCode:b["Bank_Code"][0].replace(/\n/g, ''),bankName:b["Bank_Name"][0].replace(/\n/g, ''),
                branchCode:b["Branch_Code"][0].replace(/\n/g, ''),branchName:b["Branch_Name"][0].replace(/\n/g, ''),
                corX:b["X_Coordinate"][0].replace(/\n/g, ''),corY:b["Y_Coordinate"][0].replace(/\n/g, '')})
        });
        bcodes.add(bankinf[0].bankCode);
        let c=bankinf[0].bankCode;
        let n=bankinf[0].bankName;
        bankinf.forEach(b=>{
            if(bcodes.has(b.bankCode)){
                branches.push({branchCode:b.branchCode,branchName:b.branchName});

            }
            else {
                finalBranches.add({bankCode:c,bankName:n,branches:branches});
                branches=[];
                c=b.bankCode;
                n=b.bankName;
                branches.push({branchCode:b.branchCode,branchName:b.branchName});
                bcodes.add(b.bankCode);
            }
        });
        finalBranches.add({bankCode:c,bankName:n,branches:branches});

        return [...finalBranches];
    }


    static async nameSearch(model,comp){
        var dataset=model;
        var found = [];
        var re = new RegExp(comp, 'i');
        dataset.forEach(function(item) {
            if (typeof item!== 'string') return;
            if (item.match(re)) {
                if (!found.includes(item)) { found.push(item); }
            }
        });
        return found;
    };

    static async searchByName(model,comp){
        var dataset=model;
        var found = [];
        var re = new RegExp(comp, 'i');
        dataset.forEach(function(item) {
            if (typeof Object.values(item)[1][0]!== 'string') return;
            if (Object.values(item)[1][0].match(re)) {
                if (!found.includes(item)) { found.push(item); }
            }
        });
        return found;
    };

    static async branchSearchByName(model,comp){
        var dataset=model;
        var found = [];
        var re = new RegExp(comp, 'i');
        dataset.forEach(function(item) {
            if (typeof item.bankName!== 'string') return;
            if (item.bankName.match(re)) {
                if (!found.includes(item)) { found.push(item); }
            }
        });
        return found;
    }

    static async branchSearchByCode(model,comp){
        var dataset=model;
        var found = [];
        dataset.forEach(function(item) {
            if (typeof item.bankCode!== 'string') return;
            if (item.bankCode==comp) {
                if (!found.includes(item)) { found.push(item); }
            }
        });
        return found;
    }

    static async searchByBCandBN(model,branchCode){
        var x={};
        for (let i = 0; i < model.length; i++) {
            if(model[i]["Branch_Code"][0].replace(/\n/g, '')===branchCode){
                x=model[i];
            }
        }
        return x;
    }







}
module.exports = banksController;