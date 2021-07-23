const checkInput =  async () => {
  const newFolderName = document.getElementById('folder-new-input').value;

  if (newFolderName) {
    let data = new FormData();
    data.append('folderName', newFolderName);

    const response = await axios.post('/dashboard/createfolder/', data);

    if (response.data.message) {
      alert(response.data.message);

    } else {
      window.location.reload();
    }
    
  } else {
    alert('폴더명을 입력하세요');
  }
}
