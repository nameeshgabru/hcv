//getting books
var book = [];

$.get('/book', function(data){
    book = JSON.parse(data)
    for(var i in book){
        var chapter = book[i]
        $('#chapters').append('<option>'+ chapter.chapter +'</option>');
    }
})

$('#chapters').change(()=>{
    $('#comments').empty()
    $('img').remove()
    $('#problems').empty()
    $('#comments').hide('slow')
    $('#inputComment').hide('slow')
    $('#problems').append('<option disabled selected>Select a Problem</option>');
    var selectedChapter = document.getElementById("chapters").value;
    var problems = [];
    for(var i in book){
        if(book[i].chapter == selectedChapter){
            problems = book[i].solutions
            break;
        }
    }
    for(var i in problems){
        var problem = problems[i]
        $('#problems').append('<option>'+ Object.keys(problem)[0] +'</option>');
    }
})

$('#problems').change(()=>{
    $('#comments').empty()
    $('img').remove()
    $('#comments').show('slow')
    $('#inputComment').show('slow')
    var chapter = document.getElementById("chapters").value;
    var problem = document.getElementById("problems").value;
    var images = [];
    // console.log(chapter, problem);
    for(var i in book){
        var tempChap = book[i]
        if(tempChap.chapter == chapter){
            var tempProblems = tempChap.solutions
            for(var j in tempProblems){
                if(Object.keys(tempProblems[j])[0] == problem){
                    images = tempProblems[j][problem]
                    for(var k in images){
                        var singleImage = images[k]
                        $('#problemImages').append('<img src="/images/'+chapter+'/'+singleImage+'" alt="'+singleImage+'" style="width:100%;">')
                    }                    
                    break;
                }
            }
            break;
        }
    }
    var getNonEmptyArr = (arr)=>{
        var returnArr = []
        for(var i in arr){
            if(arr[i]){
                returnArr.push(arr[i])
            }
        }
        return returnArr
    }
    //getting comments
    $.get('/comments', {problem: chapter+problem}, function(data){
        var comments = getNonEmptyArr(data.split('<end of comment>'))
        for(var i in comments){
            $('#comments').append('<li>'+comments[i]+'</li>')
        }
    })
})

$('#inputComment').submit(function(e){
    e.preventDefault()
    e.stopPropagation()
    var chapter = document.getElementById("chapters").value;
    var problem = document.getElementById("problems").value;
    var newCom = document.getElementById("newComment").value;
    if(newCom && parseInt(problem)){
        $.post('/comment',{comment:newCom, problem:chapter+problem},function(data){
            // console.log(data)
            if(data==newCom){
                $('#comments').append('<li>'+data+'</li>') 
                $('#newComment').val('')
            }
        })
    }    
})