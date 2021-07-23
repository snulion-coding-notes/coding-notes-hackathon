const createBookmark = async (noteId) => {
  const bookmarkStarElement = document.getElementById(
    `bookmark-star-${noteId}`
  );

  let data = new FormData();
  data.append('noteId', noteId);

  const response = await axios.post(
    `/dashboard/createbookmark/`,
    data
  );

  if (response.data.isBookmarking === 1) {
    bookmarkStarElement.src = '/static/img/star-fill.png';
  } else {
    bookmarkStarElement.src = '/static/img/star-empty.png';
  }
};
