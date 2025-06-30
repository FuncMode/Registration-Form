// switch form
(() => {
    function toggleForms() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm && loginForm) {
        registerForm.classList.toggle('hidden');
        loginForm.classList.toggle('hidden');
    }
}
    toggleForms();
})();
