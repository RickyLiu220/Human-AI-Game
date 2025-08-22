async function loadPosts() {
    try {
        const post = await fetch("http://localhost:3000/getPost");
        const data = await post.json();

        const ai = await fetch("http://localhost:3000/getAI");
        const aidata = await ai.json();

        const aiText = aidata.text;
        const postText = data.text;
        

        const postIndex = Math.floor(Math.random() * 2);
        const aiIndex = +!postIndex;
        const boxes = document.querySelectorAll(".box");

        boxes[postIndex].textContent = postText;
        boxes[aiIndex].textContent = aiText;

        boxes[postIndex].dataset.type = "human";
        boxes[aiIndex].dataset.type = "ai";


    } catch (err) {
        document.getElementById("errorbox").textContent = "Error loading post.";
    }
}


window.onload = async () => {
    try {
        loadPosts();
        bestScore = document.getElementById("bestscore");

        bestScore.textContent = "Highest Score: " + localStorage.getItem("highscore");

    } catch (err) {
        document.getElementById("errorbox").textContent = "Error loading post.";
    }

    totalScore = 0
    firstTime = true;

    const boxes = document.querySelectorAll(".box");

    boxes.forEach(box => {
        box.addEventListener("click", async () => {
            if (box.dataset.type === "human") {
                if (firstTime) {
                    document.getElementById("errorbox").textContent = "Good job!"
                    totalScore = totalScore + 1;
                    document.getElementById("currscore").textContent = "Current score: " + totalScore;
                    if (totalScore > localStorage.getItem("highscore")) {
                        document.getElementById("bestscore").textContent = "Highest Score: " + totalScore;
                    }
                }
            } else {
                if (firstTime) {
                    document.getElementById("errorbox").textContent = "Wrong!"
                    if (totalScore > localStorage.getItem("highscore")) {
                        userID = localStorage.getItem("userId");
                        const res = await fetch("http://localhost:3000/updateScore", {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({userId: userID, newScore: totalScore})
                            }
                        );
                    }
                    localStorage.setItem("highscore", totalScore);
                    totalScore = 0
                    document.getElementById("currscore").textContent = "Current score: " + totalScore;
                }
            }
            if (firstTime) {
                const resSection = document.getElementById("resultSection");
                const nextButton = document.createElement("button");

                nextButton.textContent = "Next";

                nextButton.addEventListener("click", () => {
                    loadPosts();
                    firstTime = true;
                    nextButton.remove();
                    document.getElementById("errorbox").textContent = ""
                });
                resSection.appendChild(nextButton);
            }
            firstTime = false;

        });
    });

}

