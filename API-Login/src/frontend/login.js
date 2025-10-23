document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login");
  const registerForm = document.getElementById("register");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginFormContainer = document.getElementById("loginForm");
  const registerFormContainer = document.getElementById("registerForm");
  const aside = document.getElementById("asside");

  window.toggleForm = () => {
    loginFormContainer.classList.toggle("hidden");
    registerFormContainer.classList.toggle("hidden");
  };

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    const response = await fetch("http://localhost:5500/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      registerForm.reset();
      toggleForm();
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const response = await fetch("http://localhost:5500/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      localStorage.setItem("isLoggedIn", JSON.stringify(data.user));
      window.location.href = "homePage.html";
    }
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    alert("Você foi desconectado.");
    window.location.href = "login.html";
  });

  window.toggleAside = () => aside.classList.toggle("active");
  window.fecharAside = () => aside.classList.remove("active");
});
