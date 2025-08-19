const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.post('/signup', (req, res) => {
    const { Email, Password } = req.body;
    console.log("Received signup info:", Email, Password);
    
    res.send(`Signup info received! Email: ${Email}, Password: ${Password}`);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });