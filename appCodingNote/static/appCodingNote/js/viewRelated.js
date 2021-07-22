// 리스트뷰, 카드뷰 토글 관련
const listOn = () => {
  document.getElementById('list-container').classList.remove('no-display');
  document.getElementById('card-container').classList.add('no-display');
  document.getElementById('card-view').classList.add('no-display');
  document.getElementById('list-view').classList.remove('no-display');
};

const cardOn = () => {
  document.getElementById('list-container').classList.add('no-display');
  document.getElementById('card-container').classList.remove('no-display');
  document.getElementById('card-view').classList.remove('no-display');
  document.getElementById('list-view').classList.add('no-display');
};

const onClickViewButton = (event) => {
  //click한 마우스 커서 위치에 따라 view 이미지 변경
  const img = document.getElementById('view-select');
  const imgWidth = img.offsetWidth;
  const x = event.pageX - img.offsetLeft;

  x < imgWidth / 2 ? listOn() : cardOn();
};

// 리스트뷰 노트 edit, delete 관련
const showNoteActionBtns = (noteId) => {
  const editHasHide = document
    .getElementById(`${noteId}-edit-btn`)
    .classList.contains('no-visibility');
  const deleteHasHide = document
    .getElementById(`${noteId}-delete-btn`)
    .classList.contains('no-visibility');
  if (editHasHide && deleteHasHide) {
    document
      .getElementById(`${noteId}-edit-btn`)
      .classList.remove('no-visibility');
    document
      .getElementById(`${noteId}-delete-btn`)
      .classList.remove('no-visibility');
  }
};

const hideNoteActionBtns = (noteId) => {
  const editHasHide = document
    .getElementById(`${noteId}-edit-btn`)
    .classList.contains('no-visibility');
  const deleteHasHide = document
    .getElementById(`${noteId}-delete-btn`)
    .classList.contains('no-visibility');
  if (!editHasHide && !deleteHasHide) {
    document
      .getElementById(`${noteId}-edit-btn`)
      .classList.add('no-visibility');
    document
      .getElementById(`${noteId}-delete-btn`)
      .classList.add('no-visibility');
  }
};

// 리스트뷰에서 노트 수정, 삭제
const editNote = (folderId, noteId, noteName, noteComment, noteLinkTitle) => {
  const nameElement = document.getElementById(`note-name-${noteId}`);
  nameElement.innerHTML = `<input id="edit-name-${noteId}" type="text", value="${noteName}", name="name"></input>`;

  const commentElement = document.getElementById(`note-comment-${noteId}`);
  commentElement.innerHTML = `<input id="edit-comment-${noteId}" type="text", value="${noteComment}" name="comment"></input>`;

  const linkElement = document.getElementById(`note-link-${noteId}`);
  linkElement.innerHTML = `<input id="edit-link-${noteId}" type="text", value="${noteLinkTitle}" name="link-title"></input>`;

  // TODO : 태그 모델 설정 후 태그 나오게 해주기
  const tagElement = document.getElementById(`note-tag-${noteId}`);
  tagElement.innerHTML = `<input id="edit-tag-${noteId}" type="text", value="${noteName}" name="tag"></input>`;


  // 업데이트 버튼 나오고 edit delete 버튼 안 나오게
  document.getElementById(`${noteId}-update-btn`).classList.remove('no-display');
  document.getElementById(`${noteId}-edit-btn`).classList.add('no-display');
  document.getElementById(`${noteId}-delete-btn`).classList.add('no-display');
};

const updateNote = async (folderId, noteId) => {
  console.log('update 연결!');
  let editNameElement = document.getElementById(`edit-name-${noteId}`);
  let editCommentElement = document.getElementById(`edit-comment-${noteId}`);
  let editLinkElement = document.getElementById(`edit-link-${noteId}`);
  let editTagElement = document.getElementById(`edit-tag-${noteId}`);

  let data = new FormData();
  data.append('noteName', editNameElement.value);
  data.append('noteComment', editCommentElement.value);
  data.append('noteLinkTitle', editLinkElement.value);
  data.append('tag', editTagElement.value);
  axios.post(`/codingnote/dashboard/${folderId}/${noteId}/updatenote/`, data);

  document.getElementById(`note-name-${noteId}`).innerHTML =
    editNameElement.value;
  document.getElementById(`note-comment-${noteId}`).innerHTML =
    editCommentElement.value;
  document.getElementById(`note-link-${noteId}`).innerHTML =
    editLinkElement.value;
  document.getElementById(`note-tag-${noteId}`).innerHTML =
    editTagElement.value;

  document.getElementById(`${noteId}-update-btn`).classList.add('no-display');
  document.getElementById(`${noteId}-edit-btn`).classList.remove('no-display');
  document.getElementById(`${noteId}-delete-btn`).classList.remove('no-display');
};

const deleteNote = async (folderId, noteId) => {
  const alert = window.confirm('해당 노트를 삭제하시겠습니까?');
  if (alert) {
    const response = await axios.delete(
      `/codingnote/dashboard/${folderId}/${noteId}/deletenote`
    );
    document.getElementById(`each-note-${noteId}`).remove();
    document.getElementById(
      'content-note-num'
    ).innerHTML = `${response.data.notesNum}개`;
  }
};
