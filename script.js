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

  // Read the credentials from the file
  fs.readFile(credentialsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading credentials file:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    // Parse the credentials from the file
    const credentials = JSON.parse(data);

    // Check if the key is already associated with another user
    const keyAlreadyExists = credentials.some((cred) => cred.password === key);

    if (keyAlreadyExists) {
      res.json({ success: false, message: 'Key already used by another user' });
    } else {
      // Update the credentials file with the new registration information
      credentials.push({ username, password: key });
      fs.writeFile(credentialsFile, JSON.stringify(credentials, null, 2), (err) => {
        if (err) {
          console.error('Error writing to credentials file:', err);
          return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        res.json({ success: true });
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
