const express = require('express');
const cookieParser = require('cookie-parser');
const admin = require('./firebase-admin');
const authenticateUser = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/api/sessionLogin', async (req, res) => {
  const { idToken } = req.body;
  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true, secure: true };
    res.cookie('session', sessionCookie, options);
    res.end(JSON.stringify({ status: 'success' }));
  } catch (error) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
  }
});

app.get('/api/protected', authenticateUser, (req, res) => {
  res.json({ user: req.user });
});

app.listen(5000, () => console.log('Server running on port 5000'));