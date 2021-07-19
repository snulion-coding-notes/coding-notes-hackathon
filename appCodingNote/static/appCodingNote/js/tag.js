const checkSize = () => {
  const inputElement = document.getElementById("tag-name-input");
  const resize = inputElement.value.length;
  inputElement.setAttribute("size", resize);
}
