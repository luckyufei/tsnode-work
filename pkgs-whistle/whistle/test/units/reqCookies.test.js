var util = require('../util.test');

module.exports = function() {
  util.request('http://reqcookies.test.whistlejs.com/', function(res, data) {
    data.headers.cookie.should.be.equal('test=abc');
  });
};
