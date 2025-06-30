async function handleForgot(e) {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value;

    const res = await fetch("/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await res.json();
    alert(data.message);
  }