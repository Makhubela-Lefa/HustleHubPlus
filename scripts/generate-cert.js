const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

const certDirectory = path.resolve('certs');
fs.mkdirSync(certDirectory, { recursive: true });

const attributes = [{ name: 'commonName', value: 'localhost' }];

const pems = selfsigned.generate(attributes, {
  days: 365,
  keySize: 2048,
  algorithm: 'sha256',
  extensions: [
    {
      name: 'subjectAltName',
      altNames: [
        { type: 2, value: 'localhost' },
        { type: 7, ip: '127.0.0.1' }
      ]
    }
  ]
});

fs.writeFileSync(
  path.join(certDirectory, 'localhost-key.pem'),
  pems.private
);
fs.writeFileSync(
  path.join(certDirectory, 'localhost-cert.pem'),
  pems.cert
);

console.log('Local self-signed HTTPS certificate generated in /certs.');
console.log('Certificate files are ignored by Git and must not be committed.');
