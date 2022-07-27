/** @type HTMLElement | null */
const addBtn = document.getElementById("addBtn");

/** @type HTMLElement | null */
const entries = document.getElementById("entries");

/** @type HTMLElement | null */
const addDialog = document.getElementById("addDialog");

/** @type HTMLElement | null */
const editDialog = document.getElementById("editDialog");

/** @type HTMLElement | null */
const deleteDialog = document.getElementById("deleteDialog");

/** @type number */
let lastId = 0;

/** @type number */
let editId = 0;

/** @type number */
let deleteId = 0;

/** @type {{ id: number, title: string, date: string, sum: string }[]} */
let blogList;

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
  let lastBlog = blogList[blogList.length - 1];
  lastId = lastBlog.id + 1;
}

function addBlogToList(blog) {
  let listItem = document.createElement("li");
  listItem.innerHTML = `
    <div class="post-area">
      <p class="blog-post-title">${blog.title}</p>
      <p class="blog-post-date">${blog.date}</p>
      <p class="blog-post-sum">${blog.sum}</p>
      <div class="blog-post-button-area">
        <button class="editBtn">Edit<i class="ri-pencil-line edit-button-logo"></i></button>
        <button class="deleteBtn">Edit<i class="ri-delete-bin-line delete-button-logo"></i></button>
      </div>
    </div>
  `;
  listItem.id = blog.id;

  entries.appendChild(listItem);

  let deleteBtn = listItem.querySelector("button.deleteBtn");
  let editBtn = listItem.querySelector("button.editBtn");
  let id = listItem.id;

  editBtn.addEventListener("click", () => {
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

  deleteBtn.addEventListener("click", () => {
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
    for (let item in blogList) {
      let blog = blogList[item];
      addBlogToList(blog);
    }
  }
}

function findBlog(id) {
  let response = {
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
  let blog = [
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
  let blog = {
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
  let blogToUpdate = findBlog(editId).blog;
  let pos = findBlog(editId).pos;

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
