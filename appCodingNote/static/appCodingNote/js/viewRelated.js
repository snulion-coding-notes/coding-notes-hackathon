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

const getTagNames = (noteId) => {
  const tagsSpanElements = document.getElementsByClassName(
    `tag-span-${noteId}`
  );
  const tagsArray = [];
  [...tagsSpanElements].forEach((span) => {
    tagsArray.push(span.innerHTML);
  });

  return tagsArray.join(' ');
};

const editNote = (noteId, noteName, noteComment, noteLink) => {
  const nameElement = document.getElementById(`note-name-${noteId}`);
  nameElement.innerHTML = `<input id="edit-name-${noteId}" type="text", value="${noteName}", name="name"></input>`;

  const commentElement = document.getElementById(`note-comment-${noteId}`);
  commentElement.innerHTML = `<input id="edit-comment-${noteId}" type="text", value="${noteComment}" name="comment"></input>`;

  const linkElement = document.getElementById(`note-link-${noteId}`);
  linkElement.innerHTML = `<input id="edit-link-${noteId}" type="text", value="${noteLink}" name="link-title"></input>`;

  const tagElement = document.getElementById(`note-tag-${noteId}`);
  tagElement.innerHTML = `<input id="edit-tag-${noteId}" type="text", value="${getTagNames(
    noteId
  )}" name="tag"></input>`;

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
  // TODO : 태그 input이 비어있지 않을 때만 데이터 보내도록 하기
  data.append('tag', editTagElement.value);

  await axios.post(
    `/dashboard/${folderId}/${noteId}/updatenote/`,
    data
  );

  window.location.reload();
};

const deleteNote = async (folderId, noteId) => {
  const alert = window.confirm('해당 노트를 삭제하시겠습니까?');
  if (alert) {
    const response = await axios.delete(
      `/dashboard/${folderId}/${noteId}/deletenote`
    );
    document.getElementById(`each-note-${noteId}`).remove();
    document.getElementById(
      'content-note-num'
    ).innerHTML = `${response.data.notesNum}개`;
  }
};

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

  newTableAction.append(newTableSaveButton);
  noteElement.appendChild(newTabletr);
  newTabletr.append(
    newTableName,
    newTableComment,
    newTableWebsite,
    newTableTag,
    newTableAction
  );

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

  await axios.post(`/dashboard/${folderId}/createnote/`, data);

  window.location.reload();
};
