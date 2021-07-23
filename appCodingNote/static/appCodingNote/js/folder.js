const editFolder = (folderId, folderName) => {
  const folderNameElement = document.getElementById('folder-name');
  folderNameElement.innerHTML = `<input id="folder-new-name" type="text", value="${folderName}", name="folderName"></input>`;

  document.getElementById('folder-edit-btn').classList.add('no-display');
  document.getElementById('folder-delete-btn').classList.add('no-display');
  document.getElementById('folder-update-btn').classList.remove('no-display');
};

const updateFolder = (folderId) => {
  const folderNameElement = document.getElementById('folder-new-name');

  let data = new FormData();
  data.append('folderName', folderNameElement.value);
  axios.post(`/codingnote/dashboard/${folderId}/updatefolder/`, data);
  let pastFolderNameElement = document.getElementById('folder-name');
  pastFolderNameElement.innerHTML = folderNameElement.value;
  document.getElementById('folder-edit-btn').classList.remove('hide');
  document.getElementById('folder-delete-btn').classList.remove('hide');
  document.getElementById('folder-update-btn').classList.add('hide');
};

const deleteFolder = (folderId) => {
  const alert = window.confirm(
    '폴더를 삭제하실 경우 하위 노트들도 모두 삭제됩니다.\n해당 폴더를 삭제하시겠습니까?'
  );
  if (alert) {
    axios.delete(`/codingnote/dashboard/${folderId}/deletefolder/`);
    window.confirm('폴더가 삭제되었습니다.');
    window.location.href = '/codingnote/dashboard/';
  }
};
