const openTab = (tabName) => {
  const hiddenTab = tabName === 'signin' ? 'signup' : 'signin';
  const rightContainers = document.getElementsByClassName("right-container");
  [...rightContainers].forEach((tab) => {
    tab.style.right = "0";
  })
  document.getElementById(`${hiddenTab}-section`).classList.add("hide");
  document.getElementById("tab-shadow").classList.remove("hide");
}

const closeTab = (tabName) => {
  const hiddenTab = tabName === 'signin' ? 'signup' : 'signin';
  const rightContainers = document.getElementsByClassName("right-container");
  [...rightContainers].forEach((tab) => {
    tab.style.right = "-550px";
  })
  document.getElementById(`${hiddenTab}-section`).classList.remove("hide");
  document.getElementById("tab-shadow").classList.add("hide");

}

const switchTab = (tabName) => {
  const hiddenTab = tabName === 'signin' ? 'signup' : 'signin';
  document.getElementById(`${tabName}-section`).classList.remove("hide");
  document.getElementById(`${hiddenTab}-section`).classList.add("hide");
}

const signup = async () => {
  const response = await axios.post('/')
}

const signin = async () => {
  const signinUsernameInputElement = document.getElementById("signin-username");
  const signinPasswordInputElement = document.getElementById("signin-password");
  if (signinUsernameInputElement.value && signinPasswordInputElement.value) {
    let data = new FormData();
    data.append("username", signinUsernameInputElement.value);
    data.append("password", signinPasswordInputElement.value);
    const response = await axios.post('/accounts/signin', data);
    console.log(response);
  }
}

