const fileDownload = () => {
  if (!sessionStorage.getItem('isDownloaded')) {
    window.location.assign('/download2/');
    sessionStorage.setItem('isDownloaded', 'true');
  }
};

window.onload = fileDownload;
