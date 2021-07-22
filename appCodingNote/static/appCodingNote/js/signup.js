console.log("signup연결");
const signupForm = document.getElementById("signup-form");
console.log(signupForm);
signupForm.onsubmit = (e) => handleSignup(e);

const handleSignup = (e) => {
  e.preventDefault();
  username = getUsername();
  email = getEmail();
  passwords = getPasswords();

  if (
    validateUsername(username) &&
    validateEmail(email) &&
    validatePassword(passwords)
  ) {
    console.log("Valid Signup form!");
    submitTarget(e);
  } else {
    console.log("Invalid Signup form!");
    dismissSignup();
  }
};

const submitTarget = (e) => {
  e.target.submit();
};

const dismissSignup = () => {
  showErrorNotice();
};

const showErrorNotice = () => {
  const errorNotice = document.getElementById("signup-error-notice");
  if (username === '') {
    errorNotice.innerHTML = "&#128161 아이디를 입력해주세요.";
  } else if (validateUsername(username)) {
    errorNotice.innerHTML = "&#128161 중복된 아이디입니다.";
  } else if (!validateEmail(email)) {
    errorNotice.innerHTML = "&#128161 형식에 맞춰 이메일을 입력해주세요.";
  } else if (!isValidFormatPassword(passwords)) {
    errorNotice.innerHTML =
      "&#128161 숫자, 특수문자를 포함한 6글자 이상의 비밀번호를 입력해주세요.";
  } else if (!isSamePasswords(passwords)) {
    errorNotice.innerHTML = "&#128161 비밀번호가 일치하지 않습니다.";
  }
};

const getUsername = () => {
  return document.querySelector("input[name=username]").value;
};

const validateUsername = async (username) => {
  const isFilledUsername = (username) => {
    return username !== "";
  };
  let data = new FormData();
  data.append("username", username);
  const response = await axios.post("accounts/signup/checkusername/", data);
  console.log(isFilledUsername(username));
  console.log(response.data.result);
  return isFilledUsername(username) && response.data.result;
};

const getEmail = () => {
  return document.querySelector("input[name=email]").value;
};

const validateEmail = (email) => {
  const reg_email =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return reg_email.test(email);
};

const getPasswords = () => {
  let passwords = [];
  const password1 = document.querySelector("input[name=password1]").value;
  const password2 = document.querySelector("input[name=password2]").value;
  passwords.push(password1);
  passwords.push(password2);
  return passwords;
};

const isSamePasswords = ([pw1, pw2]) => {
  return pw1 === pw2;
};

const isValidFormatPassword = ([pw]) => {
  console.log(pw);
  const regExp = /^(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,}$/;
  return regExp.test(pw);
};

const validatePassword = (passwords) => {
  return isSamePasswords(passwords) && isValidFormatPassword(passwords);
};
