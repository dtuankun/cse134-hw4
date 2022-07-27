const addBtn = document.getElementById("addBtn");
const entries = document.getElementById("entries");

const addDialog = document.getElementById("addDialog");
const editDialog = document.getElementById("editDialog");
const deleteDialog = document.getElementById("deleteDialog");

var lastId = 0;
let editId = 0;
let deleteId = 0;
var blogList;

addBtn.addEventListener("click", () => {
  if (typeof addDialog.showModal === "function") {
    addDialog.showModal();
  } else {
    alert("this browser does not support <dialog>");
  }
});

function syncBlog() {
  window.localStorage.setItem("blogList", JSON.stringify(blogList));
  blogList = JSON.parse(window.localStorage.getItem("blogList"));
}

function getLastBlogId() {
  var lastBlog = blogList[blogList.length - 1];
  lastId = lastBlog.id + 1;
}

function addBlogToList(blog) {
  var listItem = document.createElement("li");
  var postArea = document.createElement("div");
  var titleBlog = document.createElement("p");
  var dateBlog = document.createElement("p");
  var sumBlog = document.createElement("p");
  var buttonArea = document.createElement("div");
  var editButton = document.createElement("button");
  var deleteButton = document.createElement("button");
  var editButtonLogo = document.createElement("i");
  var deleteButtonLogo = document.createElement("i");

  buttonArea.classList.add("blog-post-button-area");

  editButtonLogo.classList.add("ri-pencil-line");
  editButtonLogo.classList.add("edit-button-logo");
  deleteButtonLogo.classList.add("ri-delete-bin-line");
  deleteButtonLogo.classList.add("delete-button-logo");

  editButton.classList.add("editBtn");
  editButton.textContent = "Edit";
  editButton.appendChild(editButtonLogo);

  deleteButton.classList.add("deleteBtn");
  deleteButton.textContent = "Delete";
  deleteButton.appendChild(deleteButtonLogo);

  postArea.classList.add("post-area");
  titleBlog.classList.add("blog-post-title");
  dateBlog.classList.add("blog-post-date");
  sumBlog.classList.add("blog-post-sum");

  postArea.appendChild(titleBlog);
  postArea.appendChild(dateBlog);
  postArea.appendChild(sumBlog);
  buttonArea.appendChild(editButton);
  buttonArea.appendChild(deleteButton);
  postArea.appendChild(buttonArea);
  listItem.appendChild(postArea);

  listItem.id = blog.id;

  titleBlog.textContent = blog.title;
  dateBlog.textContent = blog.date;
  sumBlog.textContent = blog.sum;

  entries.appendChild(listItem);

  var deleteButton = listItem.querySelector("button.deleteBtn");
  var editButton = listItem.querySelector("button.editBtn");
  var id = listItem.id;

  editButton.addEventListener("click", () => {
    if (typeof editDialog.showModal === "function") {
      editDialog.showModal();
      editId = id;
      let title = document.querySelector("#editDialog .title");
      const date = document.querySelector("#editDialog .date");
      let summary = document.querySelector("#editDialog .summary");
      const currentBlog = blogList.find((blog) => blog.id == editId);
      title.value = currentBlog.title;
      date.value = currentBlog.date;
      summary.value = currentBlog.sum;
    } else {
      alert("this browser does not support <dialog>");
    }
  });

  deleteButton.addEventListener("click", () => {
    if (typeof deleteDialog.showModal === "function") {
      deleteDialog.showModal();
      deleteId = id;
    } else {
      alert("this browser does not support <dialog>");
    }
  });
}

function showList() {
  if (!!blogList.length) {
    getLastBlogId();
    for (var item in blogList) {
      var blog = blogList[item];
      addBlogToList(blog);
    }
  }
}

function findBlog(id) {
  var response = {
    blog: "",
    pos: 0,
  };

  blogList.forEach(function (value, i) {
    if (value.id == id) {
      response.blog = value;
      response.pos = i;
    }
  });

  return response;
}

function clearForm(title, date, summary) {
  title.value = "";
  date.value = "";
  summary.value = "";
}

function initData() {
  var blog = [
    {
      id: 0,
      title: "How To Deploy Laravel",
      date: "21/7/2022",
      sum: "In this blog, I want to show how to deploy Laravel in ubuntu.",
    },
    {
      id: 1,
      title: "How To Deploy React JS",
      date: "21/7/2022",
      sum: "In this blog, I want to show how to deploy React JS in ubuntu.",
    },
  ];

  blogList = blog;

  syncBlog();
  addBlogToList(blog);
}

function init() {
  if (!!window.localStorage.getItem("blogList")) {
    blogList = JSON.parse(window.localStorage.getItem("blogList"));
  } else {
    blogList = [];
    initData();
  }
  showList();
}

function saveBlog(title, date, sum) {
  var blog = {
    id: lastId,
    title: title,
    date: date,
    sum: sum,
  };

  blogList.push(blog);
  syncBlog();
  addBlogToList(blog);
  lastId++;
}

function addLogic(dialog) {
  dialog.addEventListener("close", () => {
    let title = document.querySelector("#addDialog .title");
    const date = document.querySelector("#addDialog .date");
    let summary = document.querySelector("#addDialog .summary");
    let answer = dialog.returnValue;

    if (answer == "") {
    } else {
      console.log(title.value, date.value, summary.value);
      saveBlog(title.value, date.value, summary.value);
      clearForm(title, date, summary);
    }
  });
}

function updateBlog(title, date, sum) {
  var blogToUpdate = findBlog(editId).blog;
  var pos = findBlog(editId).pos;

  if (!!blogToUpdate) {
    blogToUpdate.title = title;
    blogToUpdate.date = date;
    blogToUpdate.sum = sum;

    blogList[pos] = blogToUpdate;
    syncBlog();
  }
}

function editLogic(dialog) {
  dialog.addEventListener("close", () => {
    let title = document.querySelector("#editDialog .title");
    const date = document.querySelector("#editDialog .date");
    let summary = document.querySelector("#editDialog .summary");
    let answer = dialog.returnValue;

    if (answer == "") {
    } else {
      updateBlog(title.value, date.value, summary.value);
      clearForm(title, date, summary);
      location.reload();
    }
  });
}

function removeBlog() {
  blogList.forEach(function (value, i) {
    if (value.id == deleteId) {
      blogList.splice(i, 1);
    }
  });
  syncBlog();
}

function deleteLogic(dialog) {
  dialog.addEventListener("close", () => {
    let answer = dialog.returnValue;

    if (answer == "") {
    } else {
      removeBlog();
      location.reload();
    }
  });
}

init();
addLogic(addDialog);
editLogic(editDialog);
deleteLogic(deleteDialog);
