/** @type {HTMLDialogElement} */
const alertDialog = document.getElementById("alertDialog");
const alertDialogText = document.getElementById("alertDialogText");
const alertDialogButton = document.getElementById("alertDialogButton");

export const customAlert = (alertMessage) => {
  alertDialogText.innerText = alertMessage;
  alertDialog.showModal();
};
alertDialogButton.addEventListener("click", () => {
  alertDialog.close();
});

/** @type {HTMLDialogElement} */
const confirmDialog = document.getElementById("confirmDialog");
const confirmDialogText = document.getElementById("confirmDialogText");
const confirmDialogButton = document.getElementById("confirmDialogButton");
const confirmDialogCancelButton = document.getElementById(
  "confirmDialogCancelButton"
);

export const customConfirm = (confirmMessage) => {
  confirmDialogText.innerText = confirmMessage;
  confirmDialog.showModal();

  return new Promise((resolve) => {
    confirmDialogButton.addEventListener("click", () => {
      confirmDialog.close();
      resolve(true);
    });
    confirmDialogCancelButton.addEventListener("click", () => {
      confirmDialog.close();
      resolve(false);
    });
  });
};

/** @type {HTMLDialogElement} */
const promptDialog = document.getElementById("promptDialog");
const promptDialogText = document.getElementById("promptDialogText");
const promptDialogInput = document.getElementById("promptDialogInput");
const promptDialogButton = document.getElementById("promptDialogButton");
const promptDialogCancelButton = document.getElementById(
  "promptDialogCancelButton"
);

export const customPrompt = (promptMessage) => {
  promptDialogText.innerText = promptMessage;
  promptDialogInput.value = "";
  promptDialog.showModal();

  return new Promise((resolve) => {
    promptDialogButton.addEventListener("click", () => {
      promptDialog.close();
      resolve(promptDialogInput.value);
    });
    promptDialogCancelButton.addEventListener("click", () => {
      promptDialog.close();
      resolve(null);
    });
  });
};
