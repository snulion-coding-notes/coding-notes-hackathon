const showTitleActionBtns = () => {
  const tagTitleBtns = document.getElementsByClassName('edit-delete-btn');
  [...tagTitleBtns].forEach((btn) => {
    btn.classList.remove('no-visibility');
  });
};

const hideTitleActionBtns = () => {
  const tagTitleBtns = document.getElementsByClassName('edit-delete-btn');
  [...tagTitleBtns].forEach((btn) => {
    btn.classList.add('no-visibility');
  });
};

const editFolder = (folderName) => {
  const tagNameElement = document.getElementById('tag-name');
  const newInputElement = document.createElement('input');
  newInputElement.setAttribute('id', 'folder-name-input');
  newInputElement.setAttribute('value', `${folderName}`);
  newInputElement.setSelectionRange(folderName.length, folderName.length);
  tagNameElement.parentNode.replaceChild(newInputElement, tagNameElement);
  document.getElementById('folder-name-input').focus();

  const folderTitleBtns = document.getElementsByClassName('edit-delete-btn');
  [...folderTitleBtns].forEach((btn) => {
    btn.style.display = 'none';
  });

  const editDoneBtn = document.getElementById('edit-done-btn');
  editDoneBtn.classList.remove('no-visibility');
};

const updateFolder = async (folderId) => {
  const folderNameElement = document.getElementById('folder-name-input');

  let data = new FormData();
  data.append('folderName', folderNameElement.value);

  await axios.post(`/codingnote/dashboard/${folderId}/updatefolder/`, data);

  window.location.reload();
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
