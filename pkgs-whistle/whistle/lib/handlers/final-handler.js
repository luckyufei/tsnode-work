"use strict";
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (req, res, next) {
    next(new Error('Unknown protocol ' + req.options.protocol));
};
