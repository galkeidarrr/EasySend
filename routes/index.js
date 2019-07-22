let express = require('express');
let banksController=require('../controllers/banksController')
let banks=require('../models/banks')
let router = express.Router();


let defineRoutes = router => {


  router.post('/searchByName',async  function(req,res) {
    let bank="";
    if(!req.params.searchParams) {
      //console.log(req.body.searchParams);
      bank = await banksController.searchByName(banks, req.body.searchParams);
    }
    res.status(bank ? 200 : 400).send(bank);
  });




  router.post('/searchName',async  function(req,res) {
    let bank="";
    if(!req.params.searchParams) {
      //console.log(req.body.searchParams);
      bank = await banksController.nameSearch(await banksController.getNames(), req.body.searchParams);
    }
    res.status(bank ? 200 : 400).send(bank);
  });

  router.post('/search',async  function(req,res) {
    let bank="";
    if(!req.params.searchParams) {
      //console.log(req.body.searchParams);
      let result=await banksController.searchByName(banks,req.body.bankName);
      bank = await banksController.searchByBCandBN(result, req.body.branchCode);
    }
    res.status(bank ? 200 : 400).send([bank]);
  });


  router.post('/branchesByName',async  function(req,res) {
    let bank="";
    if(!req.params.searchParams) {
      //console.log(req.body.searchParams);
      bank = await banksController.branchSearchByName(await banksController.getBranchesByBCode(), req.body.searchParams);
    }
    res.status(bank ? 200 : 400).send(bank);
  });

  router.post('/branchesByCode',async  function(req,res) {
    let bank="";
    if(!req.params.searchParams) {
      //console.log(req.body.searchParams);

      bank = await banksController.branchSearchByCode(await banksController.getBranchesByBCode(), req.body.searchParams);
    }
    res.status(bank ? 200 : 400).send(bank);
  });

  router.get('/namesAndCodes', function(req,res) {
    let names =  banksController.getNamesandCodes();

    res.status(names ? 200 : 400).send(names);
  });

  router.get('/branches',async  function(req,res) {
    let bank = await banksController.getBranchesByBCode();
    res.status(bank ? 200 : 400).send(bank);
  });


  /* GET home page. */
  router.get('/', function(req, res, next) {
     res.render('index', { title: 'Search Banks' });
  });



  return router;
}
module.exports = defineRoutes(router);
