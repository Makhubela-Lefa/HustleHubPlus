const https = require('https');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 3000;
const keyPath = path.resolve(
  process.env.SSL_KEY_PATH || 'certs/localhost-key.pem'
);
const certPath = path.resolve(
  process.env.SSL_CERT_PATH || 'certs/localhost-cert.pem'
);

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error(
    'HTTPS certificate files were not found. Run "npm run cert" first.'
  );
  process.exit(1);
}

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HustleHub+ API running securely at https://localhost:${PORT}`);
});
