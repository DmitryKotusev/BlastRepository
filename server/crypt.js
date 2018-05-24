const crypto = require('crypto');


const crypt = (function () {
  function getRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  function cryptAES192(password, secret) {
    const cipher = crypto.createCipher('aes192', secret);

    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  }

  function cryptSHA512(password, salt) {
    const hash = crypto.createHmac('sha512', salt);

    hash.update(password);
    const value = hash.digest('hex');

    return value;
  }

  function generateHashAndSecretPair(password) {
    const randomString = getRandomString(16);

    const hash = cryptAES192(password, randomString);

    return {
      hash,
      secret: randomString,
    };
  }

  function getPasswordHash(password, secret) {
    const hash = cryptAES192(password, secret);
    return hash;
  }

  return {
    getRandomString,
    cryptAES192,
    cryptSHA512,
    generateHashAndSecretPair,
    getPasswordHash,
  };
}());

module.exports = crypt;
