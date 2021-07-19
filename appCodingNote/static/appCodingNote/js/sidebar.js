const activateToggle = (element) => {
  // 토글 스위치를 회전시켜줌
  const buttonElement = document.getElementById(`${element}-dropdown-btn`);
  buttonElement.classList.toggle("active");

  // 토글 목록을 보여줌
  const toggleElements = document.getElementsByClassName(`${element}-dropdown`);
  [...toggleElements].forEach((element) => {
    if (element.style.display === "none") element.style.display = "flex";
    else element.style.display = "none";
  })
}
