const onClickAddButton = (folderId) => {
  const noteElement = document.getElementById('table-body');
  let newTabletr = document.createElement('tr');
  let newTableName = document.createElement('td');
  newTableName.setAttribute('id', 'new-name-row');
  newTableName.innerHTML = `<input id="table-name-${folderId}" type="text", placeholder="(필수)제목을 입력해주세요.", name="name"></input>`;
  let newTableComment = document.createElement('td');
  newTableComment.setAttribute('id', 'new-comment-row');
  newTableComment.innerHTML = `<input id="table-comment-${folderId}" type="text", placeholder="(선택)코멘트를 입력해주세요.", name="comment"></input>`;
  let newTableWebsite = document.createElement('td');
  newTableWebsite.setAttribute('id', 'new-website-row');
  newTableWebsite.innerHTML = `<input id="table-website-${folderId}" type="text", placeholder="(필수)url을 입력해주세요.", name="link-title"></input>`;
  let newTableTag = document.createElement('td');
  newTableTag.setAttribute('id', 'new-tag-row');
  newTableTag.innerHTML = `<input id="table-tag-${folderId}" type="text", placeholder="(선택)태그를 입력해주세요.", name="tag"></input>`;
  let newTableAction = document.createElement('td');
  let newTableSaveButton = document.createElement('button');
  newTableSaveButton.setAttribute('class', 'save');
  newTableSaveButton.setAttribute('id', `${folderId}-save-btn`);
  newTableSaveButton.setAttribute('onclick', `onClickSaveButton(${folderId})`);
  newTableSaveButton.innerHTML =
    '<img class="save-img" src="/static/img/save-update.svg" />';

  newTableAction.append(newTableSaveButton);
  noteElement.appendChild(newTabletr);
  newTabletr.append(
    newTableName,
    newTableComment,
    newTableWebsite,
    newTableTag,
    newTableAction
  );
};

const onClickSaveButton = async (folderId) => {
  console.log('연결');
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
  document.getElementById('new-name-row').innerHTML = newNameElement.value;
  document.getElementById('new-comment-row').innerHTML =
    newCommentElement.value;
  document.getElementById(
    'new-website-row'
  ).innerHTML = `<a href= "${response.data.note_link}">${response.data.note_link_title}</a>`;
  document.getElementById('new-tag-row').innerHTML = newTagElement.value;
  document.getElementById(
    'content-note-num'
  ).innerHTML = `${response.data.notesNum}개`;
  document.getElementById(`${folderId}-save-btn`).classList.add('hide');
};

const onClickEditButton = async (
  folderId,
  noteId,
  noteName,
  noteComment,
  noteLinkTitle
) => {
  console.log('edit 연결!');
  const nameElement = document.getElementById(`note-name-${noteId}`);
  nameElement.innerHTML = `<input id="edit-name-${noteId}" type="text", value="${noteName}", name="name"></input>`;
  const commentElement = document.getElementById(`note-comment-${noteId}`);
  commentElement.innerHTML = `<input id="edit-comment-${noteId}" type="text", value="${noteComment}" name="comment"></input>`;
  const linkElement = document.getElementById(`note-link-${noteId}`);
  linkElement.innerHTML = `<input id="edit-link-${noteId}" type="text", value="${noteLinkTitle}" name="link-title"></input>`;
  const tagElement = document.getElementById(`note-tag-${noteId}`);
  tagElement.innerHTML = `<input id="edit-tag-${noteId}" type="text", value="${noteName}" name="tag"></input>`;
  document.getElementById(
    `note-action-${noteId}`
  ).innerHTML = `<button class="update" id="${noteId}-update-btn" onclick="onClickUpdateButton(${folderId},${noteId})"><img class="update-img" src="/static/img/save-update.svg" /></button>`;
};

const onClickUpdateButton = async (folderId, noteId) => {
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
  let pastNameElement = document.getElementById(`note-name-${noteId}`);
  pastNameElement.innerHTML = editNameElement.value;
  let pastCommentElement = document.getElementById(`note-comment-${noteId}`);
  pastCommentElement.innerHTML = editCommentElement.value;
  let pastLinkElemenT = document.getElementById(`note-link-${noteId}`);
  pastLinkElemenT.innerHTML = editLinkElement.value;
  let pastTagElement = document.getElementById(`note-tag-${noteId}`);
  pastTagElement.innerHTML = editTagElement.value;
  document.getElementById(`${noteId}-update-btn`).classList.add('hide');
};

const onClickDeleteButton = async (folderId, noteId) => {
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

const onClickFolderEditButton = async (folderId, folderName) => {
  const folderNameElement = document.getElementById('folder-name');
  folderNameElement.innerHTML = `<input id="folder-new-name" type="text", value="${folderName}", name="folderName"></input>`;
  document.getElementById('folder-edit-btn').classList.add('hide');
  document.getElementById('folder-delete-btn').classList.add('hide');
  document.getElementById('folder-update-btn').classList.remove('hide');
};

const onClickFolderUpdateButton = async (folderId) => {
  const editFolderNameElement = document.getElementById('folder-new-name');
  let data = new FormData();
  data.append('folderName', editFolderNameElement.value);
  axios.post(`/codingnote/dashboard/${folderId}/updatefolder/`, data);
  let pastFolderNameElement = document.getElementById('folder-name');
  pastFolderNameElement.innerHTML = editFolderNameElement.value;
  document.getElementById('folder-edit-btn').classList.remove('hide');
  document.getElementById('folder-delete-btn').classList.remove('hide');
  document.getElementById('folder-update-btn').classList.add('hide');
};
const onClickFolderDeleteButton = async (folderId) => {
  const alert = window.confirm(
    '폴더를 삭제하실 경우 하위 노트들도 모두 삭제됩니다.\n해당 폴더를 삭제하시겠습니까?'
  );
  if (alert) {
    axios.delete(`/codingnote/dashboard/${folderId}/deletefolder/`);
    window.confirm('폴더가 삭제되었습니다.');
    window.location.href = '/codingnote/dashboard';
  }
};

const folderShowButton = () => {
  const editHasHide = document
    .getElementById('folder-edit-btn')
    .classList.contains('hide');
  const deleteHasHide = document
    .getElementById('folder-delete-btn')
    .classList.contains('hide');
  const updateHasHide = document
    .getElementById('folder-update-btn')
    .classList.contains('hide');
  if (editHasHide && deleteHasHide && updateHasHide) {
    document.getElementById('folder-edit-btn').classList.remove('hide');
    document.getElementById('folder-delete-btn').classList.remove('hide');
  }
};

const folderHideButton = () => {
  const editHasHide = document
    .getElementById('folder-edit-btn')
    .classList.contains('hide');
  const deleteHasHide = document
    .getElementById('folder-delete-btn')
    .classList.contains('hide');
  const updateHasHide = document
    .getElementById('folder-update-btn')
    .classList.contains('hide');

  if (!editHasHide && !deleteHasHide && updateHasHide) {
    document.getElementById('folder-edit-btn').classList.add('hide');
    document.getElementById('folder-delete-btn').classList.add('hide');
  }
};

const showButton = (noteId) => {
  const editHasHide = document
    .getElementById(`${noteId}-edit-btn`)
    .classList.contains('hide');
  const deleteHasHide = document
    .getElementById(`${noteId}-delete-btn`)
    .classList.contains('hide');
  if (editHasHide && deleteHasHide) {
    document.getElementById(`${noteId}-edit-btn`).classList.remove('hide');
    document.getElementById(`${noteId}-delete-btn`).classList.remove('hide');
  }
};

const hideButton = (noteId) => {
  const editHasHide = document
    .getElementById(`${noteId}-edit-btn`)
    .classList.contains('hide');
  const deleteHasHide = document
    .getElementById(`${noteId}-delete-btn`)
    .classList.contains('hide');
  if (!editHasHide && !deleteHasHide) {
    document.getElementById(`${noteId}-edit-btn`).classList.add('hide');
    document.getElementById(`${noteId}-delete-btn`).classList.add('hide');
  }
};

const onClickViewButton = (event) => {
  //click한 마우스 커서 위치에 따라 view 이미지 변경
  const img = document.getElementById('view-select');
  const imgWidth = img.offsetWidth;
  const x = event.pageX - img.offsetLeft;
  const listOn = () => {
    console.log('리스트');
    document.getElementById('list-view').classList.remove('hide');
    document.getElementById('card-view').classList.add('hide');
  };
  const cardOn = () => {
    console.log('카드');
    document.getElementById('list-view').classList.add('hide');
    document.getElementById('card-view').classList.remove('hide');
  };
  x < imgWidth / 2 ? listOn() : cardOn();
};
