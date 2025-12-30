const BASE_API_URL = "https://collectionapi.metmuseum.org/public/collection/v1";
const PAGE_SIZE = 10;

// Nav deparments fetch
document.addEventListener("DOMContentLoaded", function () {
  fetch(BASE_API_URL + "/departments")
    .then((response) => response.json())
    .then((data) => updateDepartmentsList(data.departments))
    .catch((error) => console.error("Error:", error));
});

function updateDepartmentsList(departments) {
  const ul = document.getElementById("nav-departments-list");
  departments.forEach((department) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = department.displayName;
    a.className = "dropdown-item";
    a.href = "/search.html?id=" + department.departmentId;
    li.appendChild(a);
    ul.appendChild(li);
  });
}

// Nav search
document
  .getElementById("nav-search-button")
  .addEventListener("click", function () {
    const input = document.getElementById("nav-search-input");
    const searchText = input.value.trim();

    if (searchText === "") {
      return;
    } else {
      const encodedSearchText = encodeURIComponent(searchText);
      window.location.href = `/search.html?search=${encodedSearchText}`;
    }
  });
