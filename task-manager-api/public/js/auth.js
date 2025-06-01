// /public/js/auth.js
const loginForm = document.getElementById("loginForm");

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const body = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const res = await fetch("http://localhost:3146/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.accessToken);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

// Register.html
const registerForm = document.getElementById("registerForm");

registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(registerForm);
  const body = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const res = await fetch("http://localhost:3146/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Registration failed");

    localStorage.setItem("token", data.accessToken);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});
