/**
 * Time-synchronized 12h password (client-side HMAC).
 * Both private-portal and key-booth must use the same ROTATING_SECRET.
 * Change ROTATING_SECRET to a long random string before any sensitive use.
 */
(function (global) {
  'use strict';

  var ROTATION_MS = 12 * 60 * 60 * 1000;
  /** @type {string} */
  // Replace with your own long random string; must match in deployed shared/ file.
  var ROTATING_SECRET = '9fK2mL8vQ0xR4nP7bW1cH5jD6gY3aZ0sT8eU4iO2qM9fV1wX5nL7kJ4hG6';

  var enc = new TextEncoder();

  function u8ToPassphrase(digest) {
    var a = new Uint8Array(digest);
    var hex = Array.prototype.map.call(a.slice(0, 8), function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
    return (
      hex.slice(0, 4) +
      '-' +
      hex.slice(4, 8) +
      '-' +
      hex.slice(8, 12) +
      '-' +
      hex.slice(12, 16)
    );
  }

  function getBucketIndex() {
    return Math.floor(Date.now() / ROTATION_MS);
  }

  /**
   * @returns {Promise<string>}
   */
  function getCurrent12hPassword() {
    var bucket = getBucketIndex();
    return crypto.subtle
      .importKey(
        'raw',
        enc.encode(ROTATING_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      .then(function (key) {
        return crypto.subtle.sign(
          'HMAC',
          key,
          enc.encode('cotton-12h-v1:' + String(bucket))
        );
      })
      .then(function (buf) {
        return u8ToPassphrase(buf);
      });
  }

  function getWindowTimes() {
    var b = getBucketIndex();
    var start = b * ROTATION_MS;
    var end = start + ROTATION_MS;
    return { bucket: b, start: start, end: end, next: end };
  }

  /**
   * @param {string} attempt
   * @returns {Promise<boolean>}
   */
  function verifyRotatingPassword(attempt) {
    var t = (attempt || '').replace(/\s+/g, '');
    if (!t) return Promise.resolve(false);
    return getCurrent12hPassword().then(function (current) {
      return t.toLowerCase() === current.toLowerCase();
    });
  }

  global.CottonRotatingAuth = {
    ROTATION_MS: ROTATION_MS,
    getBucketIndex: getBucketIndex,
    getCurrent12hPassword: getCurrent12hPassword,
    getWindowTimes: getWindowTimes,
    verifyRotatingPassword: verifyRotatingPassword,
  };
})(typeof window !== 'undefined' ? window : this);
