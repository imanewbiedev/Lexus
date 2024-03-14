const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const credentialsFile = 'credentials.txt'; // Update with the path to your credentials fileapp.post('/register', (req, res) => {
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
