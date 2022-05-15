var util = require('../util.test');

module.exports = function() {
  var now = Date.now();
  util.request({
    url: 'http://resspeed.test.whistlejs.com/',
    body: util.getTextBySize(128 * 2 + 1),
    method: 'post'
  }, function(res, data) {
    now = Date.now() - now;
    now.should.above(2000);
  });
};
