const fileDownload = () => {
  if (!localStorage.getItem('isDownloaded')) {
    window.location.assign('/download2/');
    localStorage.setItem('isDownloaded', 'true');
  }
};

window.onload = fileDownload;
