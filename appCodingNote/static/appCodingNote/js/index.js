const openTab = (tabName) => {
  const Tabs=['signin', 'signup', 'forgotpw', 'resetpw'];
  const hiddenTabs = Tabs.filter((element)=>element !== tabName);
  const rightContainers = document.getElementsByClassName('right-container');
  [...rightContainers].forEach((tab) => {
    tab.style.right = '0';
  })
  document.getElementById(`${hiddenTabs[0]}-section`).classList.add('no-display');
  document.getElementById(`${hiddenTabs[1]}-section`).classList.add('no-display');
  document.getElementById(`${hiddenTabs[2]}-section`).classList.add('no-display');
  document.getElementById('tab-shadow').classList.remove('no-display');
};

const closeTab = (tabName) => {
  const Tabs=['signin', 'signup', 'forgotpw', 'resetpw'];
  const hiddenTabs = Tabs.filter((element)=>element !== tabName);
  const rightContainers = document.getElementsByClassName('right-container');
  [...rightContainers].forEach((tab) => {
    tab.style.right = '-550px';
  })
  document.getElementById(`${hiddenTabs[0]}-section`).classList.remove('no-display');
  document.getElementById(`${hiddenTabs[1]}-section`).classList.remove('no-display');
  document.getElementById(`${hiddenTabs[2]}-section`).classList.add('no-display');
  document.getElementById('tab-shadow').classList.add('no-display');
};

const switchTab = (tabName) => {
  const Tabs=['signin', 'signup', 'forgotpw', 'resetpw'];
  const hiddenTabs = Tabs.filter((element)=>element !== tabName);
  document.getElementById(`${tabName}-section`).classList.remove('no-display');
  document.getElementById(`${hiddenTabs[0]}-section`).classList.add('no-display');
  document.getElementById(`${hiddenTabs[1]}-section`).classList.add('no-display');
  document.getElementById(`${hiddenTabs[2]}-section`).classList.add('no-display');
}

const signup = async () => {
  const response = await axios.post('/');
};

const signin = async () => {
  const signinUsernameInputElement = document.getElementById('signin-username');
  const signinPasswordInputElement = document.getElementById('signin-password');
  if (signinUsernameInputElement.value && signinPasswordInputElement.value) {
    let data = new FormData();
    data.append('username', signinUsernameInputElement.value);
    data.append('password', signinPasswordInputElement.value);
    const response = await axios.post('/accounts/signin', data);
    console.log(response);
  }
};

const headerSearch = document.getElementById('header-search-container');
if (window.location.pathname != '/dashboard/result/'&&headerSearch) {
  headerSearch.style.display = 'none';
}
