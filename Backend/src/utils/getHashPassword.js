const bcrypt = require("bcrypt");

function getHashPassword(password) {
  const saltRound = 10;

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRound, (err, salt) => {
      if (err) {
        reject(new Error("Error in generating salt"));
      } else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(new Error("Error in hashing password"));
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
}

module.exports = getHashPassword;
