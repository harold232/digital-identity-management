import express from 'express';
import session, { MemoryStore } from 'express-session';
import Keycloak from 'keycloak-connect';
const app = express();

const memoryStore = new MemoryStore();
app.use(session({
  secret: 'keycloak-demo',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = new Keycloak({ store: memoryStore });

app.use(keycloak.middleware());

app.get('/', (req, res) => {
  res.send(`<h2>App 1</h2>
    <a href="/private">Ir a área privada</a> |
    <a href="http://localhost:3002">Ir a App 2</a>`);
});

app.get('/private', keycloak.protect(), (req, res) => {
  res.send(`<h2>Área privada App 1</h2>
    <pre>${JSON.stringify(req.kauth.grant.access_token.content, null, 2)}</pre>
    <a href="/logout">Cerrar sesión</a>`);
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('http://localhost:8080/realms/DemoSSO/protocol/openid-connect/logout?redirect_uri=http://localhost:300w');
  });
});


app.listen(3001, () => console.log('App 1 en http://localhost:3001'));
