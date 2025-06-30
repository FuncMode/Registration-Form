
(() => {
    // helper function
const selector = (tag) => document.querySelector(tag);
const eventListener = (tag, action, callback) => selector(tag).addEventListener(action, callback);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = selector('#loginForm');

    if (!loginForm) return;

    eventListener('#loginForm', 'submit', async (e) => {
        e.preventDefault();

        const email = loginForm.email.value.trim();
        const password = loginForm.password.value;

        if (!email || !password) {
            showToast("⚠️ All fields are required", true);
            return;
        }

        try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            showToast("✅ Login successful! Redirecting...");
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            showToast(`❌ ${data.message}`, true);
        }

        } catch (err) {
            console.error(err);
            showToast("❌ Server error", true);
        }
    });
});
})();
