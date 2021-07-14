const openTab = (tabName) => {
  document.getElementById(`${tabName}-section`).style.right = "0";
  document.getElementById("tab-shadow").classList.remove("hide");
}

const closeTab = (tabName) => {
  document.getElementById(`${tabName}-section`).style.right = "-50%";
  document.getElementById("tab-shadow").classList.add("hide");
}
