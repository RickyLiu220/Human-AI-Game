document.getElementById("signUp").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = e.target.Email.value;
    const password = e.target.Password.value;

    try {
        const res = await fetch("http://localhost:3000/signUp", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("highscore", data.highscore);
            window.location.href = "../pages/Game.html";
        } else {
            document.getElementById("response").textContent = data.result;
        }



    } catch (err) {

    }
});