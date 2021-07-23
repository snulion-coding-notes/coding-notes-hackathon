console.log("signup연결");
/*아이디, 이메일, 비밀번호 정보 받기*/
let usernameCheckResult;
const getUsername = () => {
  return document.querySelector("input[name=username]").value;
};
const getEmail = () => {
  return document.querySelector("input[name=email]").value;
};
const getPasswords = () => {
  let passwords = [];
  const password1 = document.querySelector("input[name=password1]").value;
  const password2 = document.querySelector("input[name=password2]").value;
  passwords.push(password1);
  passwords.push(password2);
  return passwords;
};

/*회원가입 검증*/
const signupForm = document.getElementById("signup-form");
signupForm.onsubmit = (e) => handleSignup(e);

const handleSignup = async (e) => {
  e.preventDefault();
  username = getUsername();
  email = getEmail();
  passwords = getPasswords();
  usernameCheckResult=await validateUsername(username);
  if (
    usernameCheckResult &&
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

/*회원가입 submit 보내기*/
const submitTarget = (e) => {
  e.target.submit();
};

/*회원가입 block*/
const dismissSignup = () => {
  showErrorNotice();
};

const showErrorNotice = async () => {
  const checkResult=await validateUsername(username);
  const errorNotice = document.getElementById("signup-error-notice");
  if (!checkResult) {
    errorNotice.innerHTML = "&#128557 아이디를 다시 확인해주세요";
  } else if (!validateEmail(email)) {
    errorNotice.innerHTML = "&#128557 형식에 맞춰 이메일을 입력해주세요.";
  } else if (!isValidFormatPassword(passwords)) {
    errorNotice.innerHTML =
      "&#128557 숫자, 특수문자를 포함한 6글자 이상의 비밀번호를 입력해주세요.";
  } else if (!isSamePasswords(passwords)) {
    errorNotice.innerHTML = "&#128557 비밀번호가 일치하지 않습니다.";
  }
};

/*아이디 유효성 실시간 검증*/
const signupUsername=document.getElementById('username');
const prevalidateUsername = async() =>{
  const usernameCheckNotice=document.getElementById('signup-username-notice');
  username=getUsername();
  const isFilledUsername = (username) => {
    const reg_username=/^[A-Za-z]{3,}$/;
    return reg_username.test(username);
  };
  const usernameCheckResult=await validateUsername(username);
  if (usernameCheckResult){
    console.log(validateUsername(username));
    usernameCheckNotice.innerHTML="&#128522 사용가능한 아이디입니다."
  }
  else if(isFilledUsername(username)){
    usernameCheckNotice.innerHTML="&#128533 중복된 아이디입니다."
  }
  else if(username !== ""){
    usernameCheckNotice.innerHTML="&#128527 영문으로만 구성된 3글자 이상의 아이디를 적어주세요."
  }
  else{
    usernameCheckNotice.innerHTML=""
  }
}


/*아이디 유효성 최종 검증*/
const validateUsername = async (username) => {
  const isFilledUsername = (username) => {
    const reg_username=/^[A-Za-z]{3,}$/;
    return reg_username.test(username);
  };
  let data = new FormData();
  data.append("username", username);
  const response = await axios.post("accounts/checkusername/", data);
  console.log(isFilledUsername(username));
  console.log(response.data.result);
  console.log(isFilledUsername(username) && response.data.result)
  return isFilledUsername(username) && response.data.result;
};

/*이메일 유효성 검증*/
const validateEmail = (email) => {
  const reg_email =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return reg_email.test(email);
};

/*비밀번호 유효성 검증*/
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


/*로그인 검증*/
/*아이디, 비밀번호 정보 받기*/
const getSigninUsername = () => {
  return document.querySelector("input[name=signin-username]").value;
};
const getSigninPassword = () => {
  return document.querySelector("input[name=signin-password]").value;
};

/*로그인 검증 함수 호출*/
const signinForm = document.getElementById("signin-form");
signinForm.onsubmit = (e) => handleSignin(e);

const handleSignin=async (e) =>{
  e.preventDefault();
  signinUsername=getSigninUsername();
  signinPassword=getSigninPassword();
  let data=new FormData();
  data.append('username',signinUsername);
  data.append('password',signinPassword);
  const response = await axios.post("accounts/checksignin/", data);

  if (response.data.result){
    console.log("Valid Signup form!");
    submitTarget(e);
  }

  else{
    console.log("Invalid Signup form!");
    dismissSignIn();
  }
}

const dismissSignIn=()=>{
  const signinErrorNotice = document.getElementById("signin-error-notice");
  signinErrorNotice.innerHTML="&#128557 아이디/비밀번호가 올바르지 않습니다."
}