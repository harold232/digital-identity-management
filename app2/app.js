const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'app2-keycloak-session',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = new Keycloak({ store: memoryStore });
app.use(keycloak.middleware());

app.get('/', (req, res) => {
  res.send(`<h2>App 2</h2>
    <a href="/private">Ir a área privada</a> |
    <a href="http://localhost:3001">Ir a App 1</a>`);
});

app.get('/private', keycloak.protect(), (req, res) => {
  res.send(`<h2>Área privada App 2</h2>
    <pre>${JSON.stringify(req.kauth.grant.access_token.content, null, 2)}</pre>
    <a href="/logout">Cerrar sesión</a>`);
});

app.get('/check-auth', keycloak.protect(), (req, res) => {
  res.json({
    authenticated: true,
    user: req.kauth.grant.access_token.content
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    const redirectUri = encodeURIComponent('http://localhost:3002');
    res.redirect(`http://localhost:8080/realms/DemoSSO/protocol/openid-connect/logout?redirect_uri=${redirectUri}`);
  });
});

app.listen(3002, () => console.log('App 2 corriendo en http://localhost:3002'));
