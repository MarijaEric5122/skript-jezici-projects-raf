document.addEventListener("DOMContentLoaded", function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const objectId = urlParams.get("id");

  fetch(BASE_API_URL + "/objects/" + objectId)
    .then((response) => response.json())
    .then((data) => {
      populatePage(data);
    })
    .catch((error) => console.error("Error:", error));
});

function populatePage(data) {
  const title = data.title;
  const imageUrl = data.primaryImage;

  const titleElement = document.getElementById("exhibit-title");
  titleElement.textContent = title;

  if (imageUrl) {
    const imgElement = document.getElementById("exhibit-image");
    imgElement.src = imageUrl;
  } else {
    const imgElement = document.getElementById("exhibit-image");
    imgElement.src = "img/placeholder.png";
  }

  const culture = data.culture;
  const cultureContent = document.getElementById("content-culture");
  if (!culture) {
    const pTitle = document.createElement("span");
    pTitle.textContent = "No data";
    pTitle.style.color = "gray";
    cultureContent.appendChild(pTitle);
  } else {
    cultureContent.textContent = culture;
  }

  const artist = data.artistDisplayName;
  const artistContent = document.getElementById("content-artist");
  if (!artist) {
    const pTitle = document.createElement("span");
    pTitle.textContent = "No data";
    pTitle.style.color = "gray";
    artistContent.appendChild(pTitle);
  } else {
    artistContent.textContent = artist;
  }

  const period = data.period;
  const periodContent = document.getElementById("content-period");
  if (!period) {
    const pTitle = document.createElement("span");
    pTitle.textContent = "No data";
    pTitle.style.color = "gray";
    periodContent.appendChild(pTitle);
  } else {
    periodContent.textContent = period;
  }

  const object = data.objectName;
  const objectContent = document.getElementById("content-object");
  if (!object) {
    const pTitle = document.createElement("span");
    pTitle.textContent = "No data";
    pTitle.style.color = "gray";
    objectContent.appendChild(pTitle);
  } else {
    objectContent.textContent = object;
  }
  const department = data.department;
  const departmentContent = document.getElementById("content-department");
  if (!department) {
    const pTitle = document.createElement("span");
    pTitle.textContent = "No data";
    pTitle.style.color = "gray";
    departmentContent.appendChild(pTitle);
  } else {
    departmentContent.textContent = department;
  }
}
