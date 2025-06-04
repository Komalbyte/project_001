const input = document.getElementById("todo-input");
const button = document.getElementById("submit");
const listContainer = document.getElementById("todo-lists");
const clearBtn = document.getElementById("clear-all");
const removeCompletedBtn = document.getElementById("remove-completed");

// Add task on button click
button.addEventListener("click", () => {
  const task = input.value.trim();
  if (task === "") return;
  addTodo(task);
  input.value = "";
  input.focus();
});

// Add task on Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    button.click();
  }
});

// Add a new todo item
function addTodo(task) {
  const item = document.createElement("div");
  item.className = "todo-item";
  item.draggable = true;

  // Task text input (readonly by default)
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.value = task;
  textInput.setAttribute("readonly", "readonly");
  textInput.classList.add("text");

  // Container for action buttons
  const actionDiv = document.createElement("div");
  actionDiv.className = "action-items";

  // Mark as Complete button
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Complete";
  completeBtn.onclick = () => {
    textInput.classList.toggle("done");
  };

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    if (textInput.hasAttribute("readonly")) {
      textInput.removeAttribute("readonly");
      textInput.focus();
      editBtn.textContent = "Save";
    } else {
      textInput.setAttribute("readonly", "readonly");
      editBtn.textContent = "Edit";
    }
  };

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.onclick = () => {
    listContainer.removeChild(item);
  };

  actionDiv.appendChild(completeBtn);
  actionDiv.appendChild(editBtn);
  actionDiv.appendChild(removeBtn);

  item.appendChild(textInput);
  item.appendChild(actionDiv);
  listContainer.appendChild(item);

  addDragEvents(item);
}

// Drag-and-drop handlers
function addDragEvents(el) {
  el.addEventListener("dragstart", () => {
    el.classList.add("dragging");
  });

  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
  });
}

listContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(listContainer, e.clientY);
  const dragging = document.querySelector(".dragging");
  if (!dragging) return;
  if (afterElement == null) {
    listContainer.appendChild(dragging);
  } else {
    listContainer.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".todo-item:not(.dragging)")];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Clear all tasks
clearBtn.addEventListener("click", () => {
  listContainer.innerHTML = "";
});

// Remove only completed tasks
removeCompletedBtn.addEventListener("click", () => {
  const todos = listContainer.querySelectorAll(".todo-item");
  todos.forEach((todo) => {
    const inputField = todo.querySelector("input[type='text']");
    if (inputField.classList.contains("done")) {
      listContainer.removeChild(todo);
    }
  });
});
