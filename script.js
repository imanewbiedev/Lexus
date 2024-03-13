const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const credentialsFile = 'credentials.txt'; // Update with the path to your credentials file

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Read user credentials from the file
  fs.readFile(credentialsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading credentials file:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    // Parse the credentials from the file
    const credentials = JSON.parse(data);

    // Check if the provided credentials are valid
    const isValidCredentials = credentials.some((cred) => cred.username === username && cred.password === password);

    if (isValidCredentials) {
      res.json({ success: true, userId: 1 });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});


// Endpoint to handle registration
app.post('/register', (req, res) => {
  const { username, key } = req.body;

  // Read the keys from the "Keys.txt" file
  const keys = fs.readFileSync('Keys.txt', 'utf8').split('\n').map(key => key.trim());

  // Check if the provided key exists in the keys file
  if (keys.includes(key)) {
    // Remove the key from the keys file
    const updatedKeys = keys.filter(existingKey => existingKey !== key);
    fs.writeFileSync('Keys.txt', updatedKeys.join('\n'));

    // Update the credentials file with the new registration information
    const credentials = JSON.parse(fs.readFileSync('credentials.txt', 'utf8'));
    credentials.push({ username, password: key });
    fs.writeFileSync('credentials.txt', JSON.stringify(credentials, null, 2));

    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
