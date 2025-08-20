document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.Email.value;
    const password = e.target.Password.value;

    // now that we have login attempt, try to send it to the backend
    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        }
        );


        //seeing if the login attempt was successful
        const data = await res.json();

        if (data.success) {
            window.location.href = "../pages/Game.html";
        } else {
            document.getElementById("message").innerText = "Invalid email or password";
        }
    } catch (err) {
        console.error("Error:", err);
        document.getElementById("message").innerText = "⚠️ Could not connect to server";
    }
})