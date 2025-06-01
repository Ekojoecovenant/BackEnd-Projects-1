const taskForm = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasksContainer");
const logoutBtn = document.getElementById("logoutBtn");
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

// Fetch tasks
async function fetchTasks() {
  const search = document.getElementById("searchInput")?.value || "";
  const status = document.getElementById("statusFilter")?.value || "";

  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (status) query.append("status", status);

  try {
    // console.log("got here");
    const res = await fetch(
      // `http://localhost:3146/api/tasks`,
      `http://localhost:3146/api/tasks?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo1LCJyb2xlIjoyLCJpYXQiOjE3NDg0NTEyMDMsImV4cCI6MTc0ODUzNzYwM30.vIWzU5L1XfkK6o-A7KBNQTZCYFZRu9Z0Q9go3D-2W3A`,
        },
      }
    );
    console.log(res);
    const data = await res.json();
    const tasks = data.tasks;
    console.log(tasks);
    tasksContainer.innerHTML = "";

    tasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task-card";
      taskDiv.innerHTML = `
        <h4>${task.title}</h4>
        <p>${task.description}</p>
        <p><strong>Status:</strong> ${task.status}</p>
        <button onclick="editTask('${task.id}')">Edit</button>
        <button onclick="deleteTask('${task.id}')">Delete</button>
      `;
      tasksContainer.appendChild(taskDiv);
    });
  } catch (err) {
    alert("Failed to fetch tasks:", err.message);
  }
}

// Init
fetchTasks();

// Create task
taskForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(taskForm);

  const task = {
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
  };

  try {
    const res = await fetch("http://localhost:3146/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (!res.ok) throw new Error("Task creation failed");
    taskForm.reset();
    fetchTasks(); // refresh task list
  } catch (err) {
    alert(err.message);
  }
});

async function deleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    const res = await fetch(`http://localhost:3146/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete");
    fetchTasks(); // Refresh task list
  } catch (err) {
    alert(err.message);
  }
}

function editTask(taskId) {
  const task = prompt(
    "Enter updated title, description, and status (comma-separated)"
  );
  if (!task) return;
  const [title, description, status] = task.split(",");

  if (!title || !description || !status) {
    return alert("Invalid input. Format: title, description, status");
  }

  updateTask(taskId, title.trim(), description.trim(), status.trim());
}

async function updateTask(id, title, description, status) {
  try {
    const res = await fetch(`http://localhost:3146/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, status }),
    });

    if (!res.ok) throw new Error("Update failed");
    fetchTasks();
  } catch (err) {
    alert(err.message);
  }
}

document.getElementById("searchInput")?.addEventListener("input", fetchTasks);
document.getElementById("statusFilter")?.addEventListener("change", fetchTasks);
