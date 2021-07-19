

//chrome extension은 html 상의 onclick을 허용하지 않음. 마찬가지로 링크 기반 스크립트도 안됨. 보안 상의 이유라는데 왜지.. 안되는게 그냥 많음..ㅜㅜ
var click=document.getElementById("submit")
if(click){
    click.addEventListener("click", saveNote);
}

//chrome api 사용 current tab url, title 받아오기
var url;
var title;
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    url=tabs[0].url;
    title=tabs[0].title;
});

//csrftoken 받아오기. 
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}



//ajax 통신, 이상하게 xml이나 html에서 form 방식으로 제출하는 것은 안 된다. 크롬 익스텐션 js 코드 전체가 비동기로 돌아간다는 것과 관련이 있나. 모르겠네.



function saveNote(){
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    
    $.ajax({
        url: 'http://localhost:8000/extension/',
        type: "POST",
        data : {
            noteName: document.getElementById("noteName").value,
            noteTag: document.getElementById("noteTag").value,
            noteComment: document.getElementById("noteComment").value,
            file: document.getElementById("File").value,
            noteLink: url,
            noteTitle: title
        },
        success: function (result) {
            switch (result) {
                case true:
                    processResponse(result);
                    break;
                default:
                    
            }
        },
        error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
        }
    })

    /*var xhr=new XMLHttpRequest();
    var data = {
        noteName: document.getElementById("noteName").value,
        noteTag: document.getElementById("noteTag").value,
        noteComment: document.getElementById("noteComment").value,
        noteLink: url,
        noteTitle: title
    };


    xhr.onload=function(){
        if(xhr.status===200 || xhr.status=== 201){
            console.log(xhr.responseText);
        } else{
            console.error(xhr.responseText);
        }  
    }

    xhr.open('Post', 'http://localhost:8000');
    xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
    xhr.setRequestHeader('x-csrf-token', csrfToken);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(JSON.stringify(data));*/
}
