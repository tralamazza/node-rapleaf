var RapleafApi = require('../index');


var key = process.argv[2];
var email = process.argv[3];

var rap = new RapleafApi(key);

rap.query_by_email(email, function(data) {
  console.log(data);
});
