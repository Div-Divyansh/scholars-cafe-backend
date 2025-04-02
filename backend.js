const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// Firebase Admin SDK Setup
admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// User Registration API
app.post("/register", async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    await db.collection("users").doc(userId).set({
      name: name,
      email: email,
      createdAt: new Date()
    });
    res.status(200).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// User Login API
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();
    if (snapshot.empty) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
