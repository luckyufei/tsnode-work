// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var Transform = require('pipestream').Transform;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('../config');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var STATUS_CODES = require('http').STATUS_CODES || {};

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'FileWriterTransform'.
function FileWriterTransform(this: any, writer: any, source: any, isRaw: any, req: any, isReq: any) {
  var self = this;
  Transform.call(self);
  self._writer = writer;
  source.on('error', function () {
    writer.end();
  });
  isRaw && writer.write(getRawData(source, req, isReq));
}

function getRawData(source: any, req: any, isReq: any) {
  var firstLine;
  if (req) {
    var message = source.statusMessage || STATUS_CODES[source.statusCode] || '';
    firstLine = [
      'HTTP/' + (req.httpVersion || '1.1'),
      source.statusCode,
      message
    ].join(' ');
  } else {
    firstLine = [
      source.method,
      source.url,
      'HTTP/' + (source.httpVersion || '1.1')
    ].join(' ');
  }

  var headers: any = [];
  var rawHeaderNames = source.rawHeaderNames || {};
  Object.keys(source.headers).forEach(function (key) {
    var val = source.headers[key];
    if (!isReq || (key !== config.HTTPS_FIELD && key !== 'content-encoding')) {
      key = rawHeaderNames[key] || key;
      headers.push(
        Array.isArray(val)
          ? val
              .map(function (item) {
                return key + ': ' + item;
              })
              .join('\r\n')
          : key + ': ' + val
      );
    }
  });

  return firstLine + '\r\n' + headers.join('\r\n') + '\r\n\r\n';
}

util.inherits(FileWriterTransform, Transform);

FileWriterTransform.prototype._transform = function (
  chunk: any,
  encoding: any,
  callback: any
) {
  if (chunk) {
    this._writer.write(chunk);
  } else {
    this._writer.end();
  }

  callback(null, chunk);
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = FileWriterTransform;
