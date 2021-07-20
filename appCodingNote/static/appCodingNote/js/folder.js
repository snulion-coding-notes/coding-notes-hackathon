const onClickAddButton = (folderId) =>{
  const noteElement = document.getElementById("table");
  let newTabletr=document.createElement('tr');
  let newTableName=document.createElement('td');
  newTableName.setAttribute("id","new-name-row");
  newTableName.innerHTML=`<input id="table-name-${folderId}" type="text", placeholder="Add new", name="name"></input>`
  let newTableComment=document.createElement('td');
  newTableComment.setAttribute("id","new-comment-row");
  newTableComment.innerHTML=`<input id="table-comment-${folderId}" type="text", placeholder="Add new", name="comment"></input>`
  let newTableWebsite=document.createElement('td');
  newTableWebsite.setAttribute("id","new-website-row");
  newTableWebsite.innerHTML=`<input id="table-website-${folderId}" type="text", placeholder="Add new", name="link-title"></input>`
  let newTableTag=document.createElement('td');
  newTableTag.setAttribute("id","new-tag-row");
  newTableTag.innerHTML=`<input id="table-tag-${folderId}" type="text", placeholder="Add new", name="tag"></input>`;
  let newTableAction=document.createElement('td');
  let newTableSaveButton=document.createElement('button');
  newTableSaveButton.setAttribute("class","save");
  newTableSaveButton.setAttribute("id",`${folderId}-save-btn`);
  newTableSaveButton.setAttribute("onclick",`onClickSaveButton(${folderId})`);
  newTableSaveButton.innerHTML='<img class="save-img" src="/static/img/save-update.png" />';

  newTableAction.append(newTableSaveButton);
  noteElement.appendChild(newTabletr);
  newTabletr.append(newTableName, newTableComment,newTableWebsite,newTableTag, newTableAction);
}

const onClickSaveButton = async folderId => {
  console.log("연결");
  const newNameElement=document.getElementById(`table-name-${folderId}`);
  const newCommentElement=document.getElementById(`table-comment-${folderId}`);
  const newWebsiteElement=document.getElementById(`table-website-${folderId}`);
  const newTagElement=document.getElementById(`table-tag-${folderId}`);
  let data=new FormData();
  data.append("noteName",newNameElement.value);
  data.append("noteComment", newCommentElement.value);
  data.append("noteLink",newWebsiteElement.value);
  data.append("tag",newTagElement.value);
  const response = await axios.post(`/codingnote/dashboard/${folderId}/createnote/`, data);
  document.getElementById("new-name-row").innerHTML=newNameElement.value;
  document.getElementById("new-comment-row").innerHTML=newCommentElement.value;
  document.getElementById("new-website-row").innerHTML=`${response.data.note_link_title}`;
  document.getElementById("new-tag-row").innerHTML=newTagElement.value;
  document.getElementById('content-note-num').innerHTML=`${response.data.notesNum}개`;
  document.getElementById(`${folderId}-save-btn`).classList.add('hide');

}

const onClickEditButton =async (folderId, noteId,noteName,noteComment,noteLinkTitle) => {
  console.log("edit 연결!")
  const nameElement=document.getElementById(`note-name-${noteId}`);
  nameElement.innerHTML=`<input id="edit-name-${noteId}" type="text", value="${noteName}", name="name"></input>`;
  const commentElement=document.getElementById(`note-comment-${noteId}`);
  commentElement.innerHTML=`<input id="edit-comment-${noteId}" type="text", value="${noteComment}" name="comment"></input>`;
  const linkElement=document.getElementById(`note-link-${noteId}`);
  linkElement.innerHTML=`<input id="edit-link-${noteId}" type="text", value="${noteLinkTitle}" name="link-title"></input>`;
  const tagElement=document.getElementById(`note-tag-${noteId}`);
  tagElement.innerHTML=`<input id="edit-tag-${noteId}" type="text", value="${noteName}" name="tag"></input>`;
  document.getElementById(`note-action-${noteId}`).innerHTML=`<button class="update" id="${noteId}-update-btn" onclick="onClickUpdateButton(${folderId},${noteId})"><img class="update-img" src="/static/img/save-update.png" /></button>`
}

const onClickUpdateButton=async(folderId, noteId) => {
  console.log('update 연결!');
  let editNameElement=document.getElementById(`edit-name-${noteId}`);
  let editCommentElement=document.getElementById(`edit-comment-${noteId}`);
  let editLinkElement=document.getElementById(`edit-link-${noteId}`);
  let editTagElement=document.getElementById(`edit-tag-${noteId}`);
  let data=new FormData();
  data.append("noteName",editNameElement.value);
  data.append("noteComment", editCommentElement.value);
  data.append("noteLinkTitle",editLinkElement.value);
  data.append("tag",editTagElement.value);
  axios.post(`/codingnote/dashboard/${folderId}/${noteId}/updatenote/`, data);
  let pastNameElement=document.getElementById(`note-name-${noteId}`);
  pastNameElement.innerHTML=editNameElement.value;
  let pastCommentElement=document.getElementById(`note-comment-${noteId}`);
  pastCommentElement.innerHTML=editCommentElement.value;
  let pastLinkElemenT=document.getElementById(`note-link-${noteId}`);
  pastLinkElemenT.innerHTML=editLinkElement.value;
  let pastTagElement=document.getElementById(`note-tag-${noteId}`);
  pastTagElement.innerHTML=editTagElement.value;
  document.getElementById(`${noteId}-update-btn`).classList.add('hide');
}

const onClickDeleteButton=async(folderId,noteId) => {
  const alert = window.confirm("해당 노트를 삭제하시겠습니까");
  if (alert){
    const response=await axios.delete(`/codingnote/dashboard/${folderId}/${noteId}/deletenote`);
    document.getElementById(`each-note-${noteId}`).remove();
    document.getElementById('content-note-num').innerHTML=`${response.data.notesNum}개`;
  }

}

const showButton=(noteId)=>{
  document.getElementById(`${noteId}-edit-btn`).classList.remove('hide');
  document.getElementById(`${noteId}-delete-btn`).classList.remove('hide');
}

const hideButton=(noteId)=>{
  document.getElementById(`${noteId}-edit-btn`).classList.add('hide');
  document.getElementById(`${noteId}-delete-btn`).classList.add('hide');
}