// We're using payshares-lib's Seed to generate address and keypair in keypair.js.
// However, for some legacy browsers we need to add some entropy to sjcl using
// crypto.ensureEntropy method. Rather then doing this for both instances
// (payshares-wallet-js-sdk & payshares-lib) let's switch to payshares-lib's sjcl.
var sjcl = require('payshares-lib/src/js/ripple/utils').sjcl;
require('sjcl-scrypt').extendSjcl(sjcl);

var randomWords = sjcl.random.randomWords;

sjcl.random.randomWords = function(nwords) {
  if (!sjcl.random.isReady()) {
    for (var i = 0; i < 8; i++) {
      sjcl.random.addEntropy(Math.random(), 32, "Math.random()");
    }

    if (!sjcl.random.isReady()) {
      throw "Unable to seed sjcl entropy pool";
    }
  }

  return randomWords.call(sjcl.random, nwords);
};

module.exports = sjcl;