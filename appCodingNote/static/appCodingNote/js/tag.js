const checkSize = () => {
  const inputElement = document.getElementById("tag-name-input");
  const resize = inputElement.value.length;
  inputElement.setAttribute("size", resize);
}


// 마우스 호버 -> Edit 버튼 show (나중에)
  const titleElement = document.getElementById("tag-tag");
  const titleEditBtns = document.getElementsByClassName("tag-title-btn");
if (titleElement) {
  titleElement.addEventListener("mouseover", (e) => {
    
    // e.target.style.font-size = "40px";
    
    [...titleEditBtns].forEach((btn) => {
      btn.style.visibility = "visible";
    })
  })
}

const onClickBookmarking = async (folderId, noteId) => {
  const bookmarkStarElement = document.getElementById(`bookmark-star-${noteId}`);
  const response = await axios.get(`/codingnote/dashboard/${folderId}/${noteId}/`);

  if (response.data.isBookmarking === 1) {
    bookmarkStarElement.src = "/static/img/star-fill.png"
  } else {
    bookmarkStarElement.src = "/static/img/star-empty.png"
  }
}


