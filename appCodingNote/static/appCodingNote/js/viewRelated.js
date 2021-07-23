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

const getTagNames = () => {
  const tagsSpanElements = document.getElementsByClassName('tag-span');
  const tagsArray = [];
  [...tagsSpanElements].forEach((span) => {
    tagsArray.push(span.innerHTML);
  });

  return tagsArray.join(' ');
};

const makeTagElements = (str) => {
  const tagArray = str.split(' ');
  const spanElements = [];
  tagArray.forEach((string) => {
    const newTag = document.createElement('span');
    newTag.classList.add('tag-style');
    newTag.classList.add('tag-span');
    newTag.innerHTML = string;
    spanElements.push(newTag);
  });

  return spanElements;
};

// 리스트뷰에서 노트 수정, 삭제
const editNote = (noteId, noteName, noteComment, noteLinkTitle) => {
  const nameElement = document.getElementById(`note-name-${noteId}`);
  nameElement.innerHTML = `<input id="edit-name-${noteId}" type="text", value="${noteName}", name="name"></input>`;

  const commentElement = document.getElementById(`note-comment-${noteId}`);
  commentElement.innerHTML = `<input id="edit-comment-${noteId}" type="text", value="${noteComment}" name="comment"></input>`;

  const linkElement = document.getElementById(`note-link-${noteId}`);
  linkElement.innerHTML = `<input id="edit-link-${noteId}" type="text", value="${noteLinkTitle}" name="link-title"></input>`;

  const tagElement = document.getElementById(`note-tag-${noteId}`);
  tagElement.innerHTML = `<input id="edit-tag-${noteId}" type="text", value="${getTagNames()}" name="tag"></input>`;

  // 업데이트 버튼 나오고 edit delete 버튼 안 나오게
  document
    .getElementById(`${noteId}-update-btn`)
    .classList.remove('no-display');
  document.getElementById(`${noteId}-edit-btn`).classList.add('no-display');
  document.getElementById(`${noteId}-delete-btn`).classList.add('no-display');
};

const updateNote = async (folderId, noteId) => {
  const editNameElement = document.getElementById(`edit-name-${noteId}`);
  const editCommentElement = document.getElementById(`edit-comment-${noteId}`);
  const editLinkElement = document.getElementById(`edit-link-${noteId}`);
  const editTagElement = document.getElementById(`edit-tag-${noteId}`);

  let data = new FormData();
  data.append('noteName', editNameElement.value);
  data.append('noteComment', editCommentElement.value);
  data.append('noteLink', editLinkElement.value);
  data.append('tag', editTagElement.value);

  const response = await axios.post(
    `/codingnote/dashboard/${folderId}/${noteId}/updatenote/`,
    data
  );
  console.log(response.data);

  document.getElementById(`note-name-${noteId}`).innerHTML =
    response.data.updatedNoteName;
  document.getElementById(`note-comment-${noteId}`).innerHTML =
    response.data.updatedNoteComment;
  document.getElementById(`note-link-${noteId}`).innerHTML =
    response.data.updatedNoteLinkTitle;

  const newTagElements = makeTagElements(response.data.updatedNoteTags);

  newTagElements.forEach((span) => {
    document.getElementById(`note-tag-${noteId}`).appendChild(span);
  });

  document.getElementById(`${noteId}-update-btn`).classList.add('no-display');
  document.getElementById(`${noteId}-edit-btn`).classList.remove('no-display');
  document
    .getElementById(`${noteId}-delete-btn`)
    .classList.remove('no-display');
  document.getElementById(`edit-tag-${noteId}`).remove();
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

// TODO : 아래 수정하기
const addNote = (folderId) => {
  const noteElement = document.getElementById('table-body');
  const newTabletr = document.createElement('tr');
  const newTableName = document.createElement('td');
  newTableName.setAttribute('id', 'new-name-row');
  newTableName.innerHTML = `<input id="table-name-${folderId}" type="text", placeholder="(필수)제목을 입력해주세요.", name="name"></input>`;

  const newTableComment = document.createElement('td');
  newTableComment.setAttribute('id', 'new-comment-row');
  newTableComment.innerHTML = `<input id="table-comment-${folderId}" type="text", placeholder="(선택)코멘트를 입력해주세요.", name="comment"></input>`;

  const newTableWebsite = document.createElement('td');
  newTableWebsite.setAttribute('id', 'new-website-row');
  newTableWebsite.innerHTML = `<input id="table-website-${folderId}" type="text", placeholder="(필수)url을 입력해주세요.", name="link"></input>`;

  const newTableTag = document.createElement('td');
  newTableTag.setAttribute('id', 'new-tag-row');
  newTableTag.innerHTML = `<input id="table-tag-${folderId}" type="text", placeholder="(선택)태그를 입력해주세요.", name="tag"></input>`;

  const newTableAction = document.createElement('td');
  const newTableSaveButton = document.createElement('button');
  newTableSaveButton.setAttribute('class', 'save');
  newTableSaveButton.setAttribute('id', `${folderId}-save-btn`);
  newTableSaveButton.setAttribute('onclick', `saveNote(${folderId})`);
  newTableSaveButton.innerHTML =
    '<img class="save-img" src="/static/img/save-update.svg" />';

  // TODO : 노트 제목에 focus 가도록

  // 정보를 넣을 수 있는 input 값 추가
  newTableAction.append(newTableSaveButton);
  noteElement.appendChild(newTabletr);
  newTabletr.append(
    newTableName,
    newTableComment,
    newTableWebsite,
    newTableTag,
    newTableAction
  );

  // Add 노트를 완료하기 전 새로운 노트를 Add 하지 못하도록 함
  const addBtn = document.getElementById('add-note-btn');
  addBtn.setAttribute('onclick', 'deactivateAddBtn()');
};

const deactivateAddBtn = () => {
  alert('노트 생성을 완료해주세요.');
};

const saveNote = async (folderId) => {
  const newNameElement = document.getElementById(`table-name-${folderId}`);
  const newCommentElement = document.getElementById(
    `table-comment-${folderId}`
  );
  const newWebsiteElement = document.getElementById(
    `table-website-${folderId}`
  );
  const newTagElement = document.getElementById(`table-tag-${folderId}`);

  let data = new FormData();
  data.append('noteName', newNameElement.value);
  data.append('noteComment', newCommentElement.value);
  data.append('noteLink', newWebsiteElement.value);
  data.append('tag', newTagElement.value);

  const response = await axios.post(
    `/codingnote/dashboard/${folderId}/createnote/`,
    data
  );

  console.log(response.data);

  document.getElementById('new-name-row').innerHTML = response.data.newNoteName;
  document.getElementById('new-comment-row').innerHTML =
    response.data.newNoteComment;

  const newNoteLinkElement = document.createElement('a');
  newNoteLinkElement.setAttribute('href', `${response.data.newNoteLink}`);
  newNoteLinkElement.innerHTML = response.data.newNoteLinkTitle;
  document.getElementById('new-website-row').appendChild(newNoteLinkElement);
  document.getElementById(`table-website-${folderId}`).remove();

  const newTagElements = makeTagElements(response.data.newNoteTags);
  newTagElements.forEach((span) => {
    document.getElementById('new-tag-row').appendChild(span);
  });
  document.getElementById(`table-tag-${folderId}`).remove();

  document.getElementById(
    'content-note-num'
  ).innerHTML = `${response.data.notesNum} notes`;

  document.getElementById(`${folderId}-save-btn`).classList.add('no-display');

  const addBtn = document.getElementById('add-note-btn');
  addBtn.setAttribute('onclick', `addNote(${folderId})`);
};
