const activateToggle = (element) => {
  const buttonElement = document.getElementById(`${element}-dropdown-btn`);
  buttonElement.classList.toggle("active");

  const toggleElements = document.getElementsByClassName(`${element}-dropdown`);
  [...toggleElements].forEach((element) => {
    if (element.style.display === "none") element.style.display = "flex";
    else element.style.display = "none";
  })
}

// TODO : Bookmark도 추가
window.onload = () => {
  const currentPath = window.location.pathname;
  let currentPageElement;

  if (currentPath === '/dashboard/') {
    currentPageElement = document.getElementById('dashboard-menu');
    currentPageElement.classList.add('current-page');
  } else if (currentPath.includes('readfolder')) {
    currentPageElement = document.getElementById('folders-menu');
    currentPageElement.classList.add('current-page');
  } else if (currentPath.includes('readtag')) {
    currentPageElement = document.getElementById('tags-menu');
    currentPageElement.classList.add('current-page');
  }
}
