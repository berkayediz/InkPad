// Global variables
var noteArea = document.getElementById("noteArea");
var noteContainer = document.getElementById("noteContainer");
var notification = document.getElementById("notification");

// Load saved notes from local storage
window.addEventListener("load", function () {
  var savedNotes = localStorage.getItem("notes");

  if (savedNotes) {
    var notes = JSON.parse(savedNotes);

    notes.forEach(function (note) {
      createNoteElement(note.content, note.timestamp);
    });
  }
});

// Save note
function saveNote() {
  var noteContent = noteArea.value.trim();

  if (noteContent !== "") {
    var timestamp = new Date().toLocaleString();
    createNoteElement(noteContent, timestamp);

    noteArea.value = "";
    showNotification("Note saved successfully!", "success");
  } else {
    showNotification("Please enter a note before saving.", "error");
  }
}

// Create note element
function createNoteElement(content, timestamp) {
  var noteElement = document.createElement("div");
  noteElement.className = "note";

  var noteText = document.createElement("p");
  noteText.className = "note-content";
  noteText.textContent = content;

  var noteTimestamp = document.createElement("span");
  noteTimestamp.className = "note-timestamp";
  noteTimestamp.textContent = timestamp;

  var editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.innerHTML = "Edit";
  editButton.addEventListener("click", function () {
    editNoteElement(noteElement, noteText);
  });

  var deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML = "&#10005;";
  deleteButton.addEventListener("click", function () {
    deleteNoteElement(noteElement);
  });

  noteElement.appendChild(noteText);
  noteElement.appendChild(noteTimestamp);
  noteElement.appendChild(editButton);
  noteElement.appendChild(deleteButton);

  noteContainer.insertBefore(noteElement, noteContainer.firstChild);

  saveNoteToLocalStorage(content, timestamp);

  showNotification("New note added!", "info");
}

// Edit note element
function editNoteElement(noteElement, noteText) {
  var noteContent = noteText.textContent;
  var editedTimestamp = noteElement.querySelector(".note-timestamp");

  noteArea.value = noteContent;
  noteContainer.removeChild(noteElement);

  deleteNoteFromLocalStorage(noteContent);

  showNotification("Editing note...", "info");
}

// Delete note element
function deleteNoteElement(noteElement) {
  var noteContent = noteElement.querySelector(".note-content").textContent;
  noteElement.remove();

  deleteNoteFromLocalStorage(noteContent);

  showNotification("Note deleted.", "info");
}

// Save note to local storage
function saveNoteToLocalStorage(content, timestamp) {
  var savedNotes = localStorage.getItem("notes");

  if (savedNotes) {
    var notes = JSON.parse(savedNotes);
    notes.unshift({ content: content, timestamp: timestamp });
    localStorage.setItem("notes", JSON.stringify(notes));
  } else {
    var notes = [{ content: content, timestamp: timestamp }];
    localStorage.setItem("notes", JSON.stringify(notes));
  }
}

// Delete note from local storage
function deleteNoteFromLocalStorage(content) {
  var savedNotes = localStorage.getItem("notes");

  if (savedNotes) {
    var notes = JSON.parse(savedNotes);
    var updatedNotes = notes.filter(function (note) {
      return note.content !== content;
    });
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }
}

// Clear note
function clearNote() {
  noteArea.value = "";
}

// Show notification
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = "show " + type;

  setTimeout(function () {
    notification.className = notification.className.replace("show ", "");
  }, 3000);
}
