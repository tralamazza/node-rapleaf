/*
 * Author: Daniel Tralamazza
 *
 * RapLeaf API for node.js
 *
 * TODO bulk call
 */

var https = require('https'),
  qs = require('querystring'),
  crypto = require('crypto');


var RapleafApi = function(api_key) {
  this.api_key = api_key;
  this.base_path = '/v4/dr?';
  this.options = {
    host: 'personalize.rapleaf.com',
    headers: {
      'User-Agent': 'RapleafAPI/node/1.0'
    }
  };
};

RapleafApi.prototype._send_query = function(params, callback) {
  params.api_key = this.api_key;
  this.options.path = this.base_path + qs.stringify(params);
  https.get(this.options, function(res) {
    res.setEncoding('utf-8');
    res.on('data', function(d) {
      if (res.statusCode != 200)
        throw new Error(d);
      callback(d);
    });
  }).on('error', function(err) {
    throw new Error(err);
  });
};

RapleafApi.prototype.query_by_email = function(email, callback, hash_it) {
  if (hash_it) {
    var sha1sum = crypto.createHash('sha1');
    sha1sum.update(email);
    return this.query_by_sha1(sha1sum.digest('hex'), callback);
  } else
    return this._send_query({ 'email': email }, callback);
};

RapleafApi.prototype.query_by_md5 = function(md5email, callback) {
  return this._send_query({ 'md5_email': md5email }, callback);
};

RapleafApi.prototype.query_by_sha1 = function(sha1email, callback) {
  return this._send_query({ 'sha1_email': sha1email }, callback);
};

RapleafApi.prototype.query_by_nap = function(first, last, street, city, state, callback, email) {
  var params = { first: first, last: last, street: street, state: state };
  if (email !== undefined)
    params.email = email;
  return this._send_query(params, callback);
};

RapleafApi.prototype.query_by_nap = function(first, last, zip4, callback, email) {
  var params = { first: first, last: last, zip4: zip4 };
  if (email !== undefined)
    params.email = email;
  return this._send_query(params, callback);
};

module.exports = RapleafApi;
