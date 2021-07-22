const showTitleActionBtns = () => {
  const tagTitleBtns = document.getElementsByClassName('edit-delete-btn');
  [...tagTitleBtns].forEach((btn) => {
    btn.classList.remove('no-visibility');
  })
}

const hideTitleActionBtns = () => {
  const tagTitleBtns = document.getElementsByClassName('edit-delete-btn');
  [...tagTitleBtns].forEach((btn) => {
    btn.classList.add('no-visibility');
  })
}

const editTagName = (tagName) => {
  const tagNameElement = document.getElementById('tag-name');
  const newInputElement = document.createElement('input');
  newInputElement.setAttribute('id', 'tag-name-input');
  newInputElement.setAttribute('value', `${tagName}`);
  newInputElement.setSelectionRange(tagName.length, tagName.length);
  tagNameElement.parentNode.replaceChild(newInputElement, tagNameElement);
  document.getElementById('tag-name-input').focus();

  const tagTitleBtns = document.getElementsByClassName('edit-delete-btn');
  [...tagTitleBtns].forEach((btn) => {
    btn.style.display = 'none';
  })

  const editDoneBtn = document.getElementById('edit-done-btn');
  editDoneBtn.classList.remove('no-visibility');
}

// TODO : 태그 모델 완성 후 update tag, delete tag 함수 완성
const updateTag = async () => {
  alert('아직 구현되지 않은 기능입니다');
  // const response = await axios.post()
}

const deleteTag = (tagName) => {
  confirm(`${tagName} 태그를 정말 삭제하시겠습니까?`);
}

const onClickBookmarking = async (folderId, noteId) => {
  const bookmarkStarElement = document.getElementById(`bookmark-star-${noteId}`);
  const response = await axios.get(`/codingnote/dashboard/${folderId}/${noteId}/`);

  if (response.data.isBookmarking === 1) {
    bookmarkStarElement.src = '/static/img/star-fill.png'
  } else {
    bookmarkStarElement.src = '/static/img/star-empty.png'
  }
}


