const loginSearch = () => {
          const searchInputElement=document.getElementById("keyword");
          if(searchInputElement.value){
                    let data = new FormData();
                    data.append("keyword", searchInputElement.value);
                    response= axios.post('/codingnote/dashboard/search/', data);
                    console.log(response);
          }
}