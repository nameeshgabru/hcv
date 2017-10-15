var express = require('express');
var router = express.Router();
var fs = require('fs')
var book = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'H.C. Verma solutions'});
});

/* GET book.*/
router.get('/book', function(req, res, next) {
  res.end(JSON.stringify(book))
});

router.get('/comments', function(req, res, next){
  var problem = req.query.problem
  console.log(problem)
  fs.exists('./comments/'+problem+'.txt', function(exists) { 
    if (exists) { 
      fs.createReadStream('./comments/'+problem+'.txt').pipe(res);
    }else{
      res.end('')
    } 
  })
})
router.post('/comment', function(req, res, next){
  console.log(req.body)
  var comment = req.body.comment
  var problem = req.body.problem
  fs.appendFile('./comments/'+problem+'.txt', comment+'<end of comment>', function(err){
    if(err){
      // console.log(err)
      res.end('errorSavingComment');
      return
    }
    res.end(comment);
  })
})
//creating JSON for book
var chaps = fs.readdirSync('./public/images')
var getPages = (chapter)=>{
  var pages = fs.readdirSync('./public/images/'+chapter)
  var pagesArr = pages.map((page)=>{return JSON.parse(page.substring(0,page.lastIndexOf(']')+1))})
  var maxSolutionNo = 1
  for(var i in pagesArr){
    var singlePageSolutionsArr = pagesArr[i]
    for(var j in singlePageSolutionsArr){
      if(singlePageSolutionsArr[j]>maxSolutionNo){
        maxSolutionNo=singlePageSolutionsArr[j]
      }
    }
  }
  var solutions =[];
  //looping from 1 to max problemNos
  for(var i=1; i<=maxSolutionNo; i++){
    //array containing all solutions against a problem No.
    var completeColutions = []
    //looping in all pagesArr
    for(var j in pagesArr){
      var singlePageSolutionsArr = pagesArr[j]
      //looping in all solutionsarr in a single page
      for(var k in singlePageSolutionsArr){
        //if single solution matched our i, push in completeSolutions
        if(singlePageSolutionsArr[k]==i){
          completeColutions.push('['+singlePageSolutionsArr.toString()+'].jpg')
        }
      }
    }
      //filling the solutions for a given problem no
    var tempObj={}
    tempObj[i] = completeColutions
    solutions.push(tempObj)
  }

  book.push({chapter: chapter, solutions:solutions})
  // console.log(book)
}

for(var i in chaps){
  var chapter = chaps[i]
  getPages(chapter)
}

module.exports = router;
