(() => {
  const loginForm = document.querySelector('#loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    if (!email || !password) {
      alert("⚠️ All fields are required");
      return;
    }

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Login successful!");
        window.location.href = 'dashboard.html';
      } else {
        alert("❌ " + data.message);
      }

    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  });
})();
