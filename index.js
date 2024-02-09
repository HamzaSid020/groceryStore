const express = require('express');
const app = express();

app.use(express.static('public')); // Create a 'public' folder for static files (HTML, CSS, etc.)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});