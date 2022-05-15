var util = require('../util.test');

module.exports = function() {
  util.request('http://css1.test.whistlejs.com/index.html?resBody=_', function(res, body) {
    body.should.equal('_\r\n<style>css</style>');
  });

  util.request({
    method: 'post',
    url: 'https://css2.test.whistlejs.com/index.html?resBody=_'
  }, function(res, body) {
    body.should.equal('_\r\ncss');
  });

  util.request({
    method: 'post',
    url: 'https://css3.test.whistlejs.com/index.html?resBody=_'
  }, function(res, body) {
    body.should.equal('_');
  });
};
