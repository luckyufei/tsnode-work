"use strict";
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('../util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (err, req, res, next) {
    res.response(util.wrapGatewayError(util.getErrorStack(err)));
};
