var util = require('../util.test');

module.exports = function() {
  util.proxy('http://test.whistlejs.com');
  util.proxy('http://tnl1.whistlejs.com');
  util.proxy('http://tnl2.whistlejs.com');
  util.proxy('http://tnl3.whistlejs.com');
  util.request('http://tnl4.whistlejs.com', function(res) {
    var data = JSON.parse(res.body);
    data.type.should.equal('server');
  });
  util.proxy('http://8080.tnl5.whistlejs.com');
  util.proxy('http://8080.tnl6.whistlejs.com');
  util.proxy('http://break.whistlejs.com', function(err) {
    if (!err) {
      throw Error('error');
    }
  });
  util.proxy('http://ts.whistlejs.com/');
};
