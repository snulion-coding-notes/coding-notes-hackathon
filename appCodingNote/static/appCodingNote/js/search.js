const loginSearch = async () => {
          const searchInputElement=document.getElementById("keyword");
          const searchTypeElement=document.getElementById("type");
          if(searchInputElement.value){
                    let data = new FormData();
                    data.append("keyword", searchInputElement.value);
                    data.append("type", searchTypeElement.value);
                    const response=await axios.post('/codingnote/dashboard/search/', data);
          }
}