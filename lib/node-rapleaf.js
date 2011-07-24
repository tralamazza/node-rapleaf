/*
 * Author: Daniel Tralamazza
 *
 * RapLeaf API for node.js
 *
 */

var https = require('https'),
  qs = require('querystring'),
  crypto = require('crypto');


/*
 * @api_key RapLeaf API key
 */
var RapleafApi = function(api_key) {
  this.api_key = api_key;
  this.direct_path = '/v4/dr?';
  this.bulk_path = '/v4/bulk?';
  this.port = 443;
  this.host = 'personalize.rapleaf.com';
  this.headers = { 'User-Agent': 'RapleafAPI/node/1.0' };
};

RapleafApi.prototype._send_query = function(params, callback, payload) {
  params.api_key = this.api_key;
  var options = {
    host: this.host,
    port: this.port,
    path: this.direct_path + qs.stringify(params),
    method: 'GET',
    headers: this.headers
  };
  if (payload !== undefined) {
    options.path = this.bulk_path + qs.stringify(params);
    options.method = 'POST';
    options.headers['Content-Type'] = 'application/json';
    options.headers['Content-Length'] = Buffer.byteLength(payload);
  }
  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');
    res.on('data', function(d) {
      if (res.statusCode != 200)
        callback(undefined, d);
      callback(d);
    });
  });
  if (payload !== undefined)
    req.write(payload);
  req.end();

  return req;
};

/* 
 * @email email
 * @callback function(data, err){}
 * @hash_it (optional) hash email before sending
 */
RapleafApi.prototype.query_by_email = function(email, callback, hash_it) {
  if (hash_it) {
    var sha1sum = crypto.createHash('sha1');
    sha1sum.update(email);
    return this.query_by_sha1(sha1sum.digest('hex'), callback);
  } else
    return this._send_query({ 'email': email }, callback);
};

/* 
 * @md51email MD5 of an email
 * @callback function(data, err){}
 */
RapleafApi.prototype.query_by_md5 = function(md5email, callback) {
  return this._send_query({ 'md5_email': md5email }, callback);
};

/* 
 * @sha1email SHA1 of an email
 * @callback function(data, err){}
 */
RapleafApi.prototype.query_by_sha1 = function(sha1email, callback) {
  return this._send_query({ 'sha1_email': sha1email }, callback);
};

/* 
 * @first first name
 * @last last name
 * @street address
 * @city city
 * @state state
 * @callback function(data, err){}
 * @email (optional)
 */
RapleafApi.prototype.query_by_nap = function(first, last, street, city, state, callback, email) {
  var params = { first: first, last: last, street: street, state: state };
  if (email !== undefined)
    params.email = email;
  return this._send_query(params, callback);
};

/* 
 * @first first name
 * @last last name
 * @zip4 4-digit zip code
 * @callback function(data, err){}
 * @email (optional)
 */
RapleafApi.prototype.query_by_nap = function(first, last, zip4, callback, email) {
  var params = { first: first, last: last, zip4: zip4 };
  if (email !== undefined)
    params.email = email;
  return this._send_query(params, callback);
};

/* 
 * @emails array containing emails
 * @callback function(data, err){}
 */
RapleafApi.prototype.bulk_by_email = function(emails, callback) {
  var payload = [];
  emails.forEach(function(e) {
    payload.push({email: e});
  });
  return this._send_query({}, callback, JSON.stringify(payload));
};


module.exports = RapleafApi;
