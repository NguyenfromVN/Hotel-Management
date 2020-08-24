const sha = require("sha.js");
const haslength = 64;

function hasWithSalt(str, salt) {
  const preHash = str + salt;
  const pwhash = sha("sha256")
    .update(preHash)
    .digest("hex");
  return pwhash;
}

module.exports = {
  getHashWithSalt: (str, salt) => {
    return hasWithSalt(str, salt);
  },

  cmpPassword: (pwIn, pwSaved, salt) => {
    const pwhash = hasWithSalt(pwIn, salt);
    return pwhash === pwSaved;
  }
};
