payshares-wallet-js-sdk
=====================

[![Build Status](https://travis-ci.org/payshares/payshares-wallet-js-sdk.svg?branch=master)](https://travis-ci.org/payshares/payshares-wallet-js-sdk) [![Coverage Status](https://coveralls.io/repos/payshares/payshares-wallet-js-sdk/badge.png?branch=master)](https://coveralls.io/r/payshares/payshares-wallet-js-sdk?branch=master)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/bartekn.svg)](https://saucelabs.com/u/bartekn)

### Usage in a browser
```html
Normal version:
<script src="/build/payshares-wallet.js"></script>
Minified version:
<script src="/build/payshares-wallet.min.js"></script>
```

### Usage in Node
```js
var PaysharesWallet = require('payshares-wallet-js-sdk');
```

### API

#### `createWallet`

Creates a wallet and uploads it to [payshares-wallet](https://github.com/payshares/payshares-wallet) server.
This method returns [`Wallet` object](#wallet-object).

> **Heads up!** Choose `kdfParams` carefully - it may affect performance.

```js
PaysharesWallet.createWallet({
  // Required
  server: "https://wallet-server.com",
  // Required
  username: "joedoe@hostname.com",
  // Required
  password: "cat-walking-on-keyboard",
  // Public key, base64 encoded
  publicKey: "WLM5f+YYuNmu+WACddpIynHzSAneR2OxF3gJeEjUI2M=",
  // mainData: must be a string. If you want to send JSON stringify it.
  mainData: "Your main data.",
  // keychainData: must be a string. If you want to send JSON stringify it.
  keychainData: "Your keychain data.",
  // If omitted, it will be fetched from payshares-wallet server
  kdfParams: { 
    algorithm: 'scrypt',
    bits: 256,
    n: Math.pow(2,16),
    r: 8,
    p: 1
  }
}).then(function(wallet) {
  // wallet is Wallet object
}).catch(PaysharesWallet.errors.MissingField, function(e) {
  console.error('Missing field: '+e.field+'.');
}).catch(PaysharesWallet.errors.InvalidField, function(e) {
  console.error('Invalid field.');
}).catch(PaysharesWallet.errors.UsernameAlreadyTaken, function(e) {
  console.error('Username has been already taken.');
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});
```

To generate a keypair you can use: `PaysharesWallet.util.generateKeyPair()`.

#### `getWallet`

Retrieves a wallet from [payshares-wallet](https://github.com/payshares/payshares-wallet) server.
This method returns [`Wallet` object](#wallet-object).

```js
PaysharesWallet.getWallet({
  // Required
  server: "https://wallet-server.com",
  // Required
  username: "joedoe@hostname.com",
  // Required
  password: "cat-walking-on-keyboard"
}).then(function(wallet) {
  // wallet is Wallet object
}).catch(PaysharesWallet.errors.WalletNotFound, function(e) {
  console.error('Wallet not found.');
}).catch(PaysharesWallet.errors.Forbidden, function(e) {
  console.error('Forbidden access.');
}).catch(PaysharesWallet.errors.TotpCodeRequired, function(e) {
  console.error('Totp code required.');
}).catch(PaysharesWallet.errors.MissingField, function(e) {
  console.error('Missing field: '+e.field+'.');
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});
```

You can also get wallet using `masterKey`. It's helpful during recovery process:

```js
PaysharesWallet.getWallet({
  // Required
  server: "https://wallet-server.com",
  // Required
  username: "joedoe@hostname.com",
  // Base64 encoded master key
  masterKey: "masterKey"
}).then(function(wallet) {
  // wallet is Wallet object
}).catch(PaysharesWallet.errors.WalletNotFound, function(e) {
  console.error('Wallet not found.');
}).catch(PaysharesWallet.errors.Forbidden, function(e) {
  console.error('Forbidden access.');
}).catch(PaysharesWallet.errors.TotpCodeRequired, function(e) {
  console.error('Totp code required.');
}).catch(PaysharesWallet.errors.MissingField, function(e) {
  console.error('Missing field: '+e.field+'.');
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});
```

#### `createFromData`

Creates [`Wallet` object](#wallet-object) from serialized/stringified form.

#### `recover`

Allows user to recover wallet's `masterKey` using `recoveryCode`. Recovery
must be first [enabled](#enablerecovery).

If TOTP is enabled additional `totpCode` parameter must be passed.

```js
PaysharesWallet.recover({
  // Required
  server: "https://wallet-server.com",
  // Required
  username: "joedoe@hostname.com",
  // Required
  recoveryCode: "recoveryCode"
}).then(function(masterKey) {
  // masterKey is recovered wallet masterKey.
  // You can create Wallet object using getWallet method.
}).catch(PaysharesWallet.errors.Forbidden, function(e) {
  console.error('Forbidden access.');
}).catch(PaysharesWallet.errors.MissingField, function(e) {
  console.error('Missing field: '+e.field+'.');
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});
```

#### `lostTotpDevice`

When user lost TOTP device, grace period request may be sent to payshares-wallet
server to disable 2FA.

```js
PaysharesWallet.lostTotpDevice({
  // Required
  server: "https://wallet-server.com",
  // Required
  username: "joedoe@hostname.com",
  // Required
  password: "password"
}).then(function() {
  // Request was sent. Due to security reasons payshares-wallet won't inform you
  // whether grace period has been started or not.
}).catch(PaysharesWallet.errors.MissingField, function(e) {
  console.error('Missing field: '+e.field+'.');
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});
```

### Wallet object

`getWallet` and `createWallet` methods return `Wallet` object. `Wallet` object
has following methods:

#### `getServer`

Returns payshares-wallet server URL.

#### `getUsername`

Returns username associated with this wallet.

#### `getWalletId`

Returns `walletId`.

#### `getMainData`

Returns `mainData` string.

```js
var mainData = wallet.getMainData();
```

#### `updateMainData`

Updates `mainData` on the payshares-wallet server.

```js
wallet.updateMainData({
  mainData: "newMainData",
  secretKey: keyPair.secretKey
}).then(function() {
  // Main data updated
}).catch(PaysharesWallet.errors.MissingField, function(e) {
  console.error('Missing field: '+e.field+'.');
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});;
```

#### `getKeychainData`

Returns `keychainData` string.

#### `enableTotp`

Enables TOTP to user's wallet. To generate `totpKey` you can use:
`PaysharesWallet.util.generateTotpKey()`. `totpCode` is a current code generated
by user's TOTP app. It's role is to confirm a user has succesfully setup
TOTP generator.

```js
var totpKey = PaysharesWallet.util.generateTotpKey();

wallet.enableTotp({
  totpKey: totpKey,
  totpCode: totpCode,
  secretKey: keyPair.secretKey
}).then(function() {
  // Everything went fine
}).catch(PaysharesWallet.errors.MissingField, function(e) {
  console.error('Missing field: '+e.field+'.');
}).catch(PaysharesWallet.errors.InvalidTotpCode, function(e) {
  console.error('Invalid Totp code.');
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});
```

#### `disableTotp`

Disables TOTP.

```js
wallet.disableTotp({
  totpCode: totpCode,
  secretKey: keyPair.secretKey
}).then(function() {
  // Everything went fine
}).catch(PaysharesWallet.errors.MissingField, function(e) {
  console.error('Missing field: '+e.field+'.');
}).catch(PaysharesWallet.errors.InvalidTotpCode, function(e) {
  console.error('Invalid Totp code.');
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});
```

#### `enableRecovery`

Enables recovery to user's wallet. To generate `recoveryCode` you can use:
`PaysharesWallet.util.generateRandomRecoveryCode()`.

```js
var recoveryCode = PaysharesWallet.util.generateRandomRecoveryCode();

wallet.enableRecovery({
  recoveryCode: recoveryCode,
  secretKey: keyPair.secretKey
}).then(function() {
  // Everything went fine
}).catch(PaysharesWallet.errors.MissingField, function(e) {
  console.error('Missing field: '+e.field+'.');
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});
```

After recovery is enabled you can use `recover` method to recover wallet's
`masterKey`.

#### `changePassword`

Allows user to change password.

> **Heads up!** This method changes all values derived from and  `masterKey` itself.

```js
wallet.enableRecovery({
  newPassword: 'some-good-new-password',
  secretKey: keyPair.secretKey
}).then(function() {
  // Everything went fine
}).catch(PaysharesWallet.errors.MissingField, function(e) {
  console.error('Missing field: '+e.field+'.');
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});
```

You can pass additional parameter: `kdfParams`. If it's not passed `kdfParams`
will be fetched from payshares-wallet server.

#### `delete`

Removes wallet from payshares-wallet server.

> **Heads up!** This method removes all wallet data from the server! This
> operation cannot be undone.

```js
wallet.delete({
  secretKey: keyPair.secretKey
}).then(function() {
  // Everything went... well... fine
}).catch(PaysharesWallet.errors.ConnectionError, function(e) {
  console.log('Connection error.');
}).catch(function(e) {
  console.log('Unknown error.');
});
```

### Util methods

#### `util.generateTotpKey`

Generates Totp key you can use in `setupTotp`.

#### `util.generateTotpUri`

Generates Totp uri based on user's key. You can encode it as a QR code and show to
a user.

```js
var key = PaysharesWallet.util.generateTotpKey();
var uri = PaysharesWallet.util.generateTotpUri(key, {
  // Your organization name
  issuer: 'Payshares Development Foundation',
  // Account name
  accountName: 'bob@payshares.org'
});
```

#### `util.generateKeyPair`

Generates and returns Ed25519 key pair object containing following properties:
* `address`
* `secret`
* `publicKey`
* `secretKey`

Example:

```json
{
  "address": "gGc6bA2EuMcjyDCGeXJcWPCjQtekURgA98",
  "secret": "sfFAfccyhCago1Hatg94AVz4YMJG5DNqTz12jDCFrg9S2KY28zX",
  "secretKey": "WWNJnJkLuuGps93BHubQwPECLiJjeSfd8SwW9G/BHGAJUnu1B4/1+lhZhcQh2nCjnsYmBL9wZ1EU48ZW7mdGjA==",
  "publicKey": "CVJ7tQeP9fpYWYXEIdpwo57GJgS/cGdRFOPGVu5nRow="
}
```

#### `util.generateRandomRecoveryCode`

Generates random recovery code you can use in `enableRecovery`.

### Build
```sh
npm install
gulp build
```

### Development
```sh
npm install
gulp watch
```

### Testing
```sh
# Node
npm test
# Browser
zuul ./test/wallet.js --local
```