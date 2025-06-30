(() => {
const selector = (tag) => document.querySelector(tag);
const eventListener = (tag, action, callback) => selector(tag).addEventListener(action, callback);

const registerForm = selector('#registerForm');

eventListener('#registerForm', 'submit', async (e) => {
    e.preventDefault();

    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value.trim();

    const nameRegex = /^[A-Za-z\s]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!name || !email || !password) {
        showToast('❌ All fields are required.', true);
        return;
    }

    if (!nameRegex.test(name)) {
        showToast('❌ Name should only contain letters and spaces.', true);
        return;
    }

    if (!passwordRegex.test(password)) {
        showToast('❌ Password must be at least 8 characters and include at least 1 letter & 1 number.', true);
        return;
    }

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            showToast("✅ Registration successful!");
            clear();
            setTimeout(() => {
                toggleForms(); //switch to login form
            }, 2000);
        } else {
            showToast(data.message || 'Registration failed.', true);
            clear();
        }

    } catch (err) {
        console.error(err);
        showToast('❌ Something went wrong.', true);
        clear();
    }
});

function clear() {
    registerForm.name.value = '';
    registerForm.email.value = '';
    registerForm.password.value = '';
}

})();
