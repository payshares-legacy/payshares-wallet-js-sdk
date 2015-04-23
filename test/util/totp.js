'use strict';

var chai = require("chai");
var expect = chai.expect;
var errors = require('../../lib/errors');
var totp = require('../../lib/util/totp');
var base32 = require('thirty-two');

describe('util/totp', function () {
  it('should generate 10 bytes base32 encoded without padding', function (done) {
    var randomKey = totp.generateRandomTotpKey();
    expect(randomKey.slice(-1)).to.not.be.equal('='); // no padding
    var decodedKey = base32.decode(randomKey);
    expect(decodedKey.length).to.be.equal(10);
    done();
  });

  it('should generate otpauth uri', function (done) {
    var key = totp.generateRandomTotpKey();
    var expected = 'otpauth://totp/Payshares%20Development%20Foundation:bob@payshares.org?secret='+key+'&issuer=Payshares%20Development%20Foundation';
    var uri = totp.generateTotpUri(key, {
      issuer: 'Payshares Development Foundation',
      accountName: 'bob@payshares.org'
    });
    expect(uri).to.be.equal(expected);
    done();
  });

  it('should throw MissingField error', function (done) {
    var key = totp.generateRandomTotpKey();
    var fn = function(meta) {
      return function() {
        totp.generateTotpUri(key, meta);
      };
    };
    expect(fn({
      issuer: 'Payshares Development Foundation'
    })).to.throw(errors.MissingField);
    expect(fn({
      accountName: 'bob@payshares.org'
    })).to.throw(errors.MissingField);
    done();
  });
});
