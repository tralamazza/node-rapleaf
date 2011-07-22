# node-rapleaf

Simple [Rapleaf](http://www.rapleaf.com) API client for node.js. To learn more about Rapleaf API check the official [documentation](https://www.rapleaf.com/developers/api_docs/personalization/direct).

## How to Install

    $ npm install node-rapleaf

## How to Use

```js
var RapLeafApi = require('node-rapleaf');

var client = new RapLeafApi('<your key goes here>');

rap.query_by_email('<some email>', function(json_data) {
  console.log(json_data);
});
```
