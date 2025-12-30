document.addEventListener("DOMContentLoaded", function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const search = urlParams.get("search");
  const id = urlParams.get("id");

  if (search) {
    fetchBySearch(search);
  } else if (id) {
    fetchById(id);
  } else {
    notFound();
  }
  
});


function fetchById(id) {
  fetch(BASE_API_URL + "/search?q=&departmentId=" + id)
    .then((response) => response.json())
    .then((data) => {
      const ids = data.objectIDs;
      const total = data.total;
      const currentPage = getCurrentPage();
      const totalPages = getTotalPages(total, PAGE_SIZE);
      populateTable(ids, total, currentPage, PAGE_SIZE);
      processPagination(currentPage, totalPages);
    })
    .catch((error) => console.error("Error:", error));
}

function fetchBySearch(search) {
  fetch(BASE_API_URL + "/search?q=" + search)
    .then((response) => response.json())
    .then((data) => {
      const ids = data.objectIDs;
      const total = data.total;
      const currentPage = getCurrentPage();
      const totalPages = getTotalPages(total, PAGE_SIZE);
      populateTable(ids, total, currentPage, PAGE_SIZE);
      processPagination(currentPage, totalPages);
    })
    .catch((error) => console.error("Error:", error));
}

function populateTable(ids, total, currentPage, pageSize) {
  const idsByPage = getIdsByPage(ids, total, currentPage, pageSize);
  if (ids.length === 0) return notFound();

  const fetchPromises = idsByPage.map((id) =>
    fetch(BASE_API_URL + "/objects/" + id).then((response) => response.json())
  );
  Promise.all(fetchPromises)
    .then((results) => {
      results.forEach((result) => {
        const tbody = document.getElementById("search-results-body");
        tbody.innerHTML = "";

        results.forEach((result) => {
          const tr = document.createElement("tr");

          // TD - Image
          const tdImage = document.createElement("td");
          const linkImage = document.createElement("a");
          linkImage.href = "exhibit.html?id=" + result.objectID;
          const img = document.createElement("img");
          img.src = result.primaryImage || "img/placeholder.png";
          img.style.height = "4rem";
          linkImage.appendChild(img);
          if (result.title) {
            tdImage.appendChild(linkImage);
          } else {
            tdImage.appendChild(document.createElement("p"));
          }

          // TD - Title
          const tdTitle = document.createElement("td");
          if (result.title) {
            const linkTitle = document.createElement("a");
            linkTitle.href = "exhibit.html?id=" + result.objectID;
            linkTitle.textContent = result.title;
            tdTitle.appendChild(linkTitle);
          } else {
            const pTitle = document.createElement("p");
            pTitle.textContent = "No data";
            pTitle.style.color = "gray";
            tdTitle.appendChild(pTitle);
          }

          // TR
          tr.appendChild(tdImage);
          tr.appendChild(tdTitle);
          tbody.appendChild(tr);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function generateTableRows(rows) {
  console.log("rows", rows);
}

function processPagination(currentPage, totalPages) {
  if (totalPages === 1) {
    const pagination = document.getElementById("search-pagination");
    if (pagination) pagination.parentNode.removeChild(pagination);
    return;
  }

  const searchPrev = document.getElementById("search-prev");
  const searchNext = document.getElementById("search-next");

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const pageParam = params.get("page");

  searchPrev.href = getPrevPageLink(url, params, pageParam);
  searchNext.href = getNextPageLink(url, params, pageParam);

  if (currentPage <= 1) searchPrev.classList.add("disabled");
  if (currentPage >= totalPages) searchNext.classList.add("disabled");

  const pageCurrent = document.getElementById("pagination-current-text");
  pageCurrent.innerText = currentPage;
  const pageTotal = document.getElementById("pagination-total-text");
  pageTotal.innerText = totalPages;
}

function getPrevPageLink(url, params, pageParam) {
  if (!pageParam) {
    params.set("page", 1);
    url.search = params.toString();
    return url.toString();
  }
  params.set("page", parseInt(pageParam) - 1);
  url.search = params.toString();
  return url.toString();
}

function getNextPageLink(url, params, pageParam) {
  if (!pageParam) {
    params.set("page", 2);
    url.search = params.toString();
    return url.toString();
  }
  params.set("page", parseInt(pageParam) + 1);
  url.search = params.toString();
  return url.toString();
}

function getIdsByPage(ids, total, currentPage, pageSize) {
  if (ids.length === 0) return [];
  if (currentPage > pageSize) return [];

  const fromIndex = (currentPage - 1) * pageSize;
  let toIndex = currentPage * pageSize;
  if (toIndex > total) toIndex = total;

  return ids.slice(fromIndex, toIndex);
}

function getCurrentPage() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const currentPage = urlParams.get("page");
  return currentPage || 1;
}

function getTotalPages(total, pageSize) {
  return Math.ceil(total / pageSize);
}

function notFound() {
  const existingTable = document.getElementById("search-results");
  if (existingTable) {
    existingTable.parentNode.removeChild(existingTable);
  }

  const h1 = document.createElement("h1");
  h1.textContent = "NOT FOUND";
  h1.style.color = "red";
  h1.style.textAlign = "center";
  h1.style.marginTop = "5rem";
  document.body.appendChild(h1);
}
