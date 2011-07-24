var RapleafApi = require('../index');


var key = process.argv[2];
var email = process.argv[3];

var client = new RapleafApi(key);

client.query_by_email(email, function(data, err) {
  console.log('direct query test');
  if (err !== undefined)
    console.log('rapleaf error: ' + err);
  else
    console.log(data);
}).on('error', function(err) {
    console.log('request error: ' + err);
});

client.bulk_by_email([email, email], function(data, err) {
  console.log('bulk test');
  if (err !== undefined)
    console.log('rapleaf error: ' + err);
  else
    console.log(data);
}).on('error', function(err) {
    console.log('request error: ' + err);
});

