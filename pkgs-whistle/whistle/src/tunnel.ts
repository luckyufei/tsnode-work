// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var socks = require('sockx');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var url = require('url');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var net = require('net');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var extend = require('extend');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var LRU = require('lru-cache');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var EventEmitter = require('events').EventEmitter;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var hparser = require('hparser');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var dispatch = require('./https');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var util = require('./util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var rules = require('./rules');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var socketMgr = require('./socket-mgr');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var rulesUtil = require('./rules/util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var ca = require('./https/ca');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var pluginMgr = require('./plugins');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var config = require('./config');

var hasCustomCerts = ca.hasCustomCerts;
var existsCustomCert = ca.existsCustomCert;
var IP_CACHE = new LRU({ max: 600 });
var LOCALHOST = '127.0.0.1';
var TUNNEL_HOST_RE = /^[^:\/]+\.[^:\/]+:\d+$/;
var X_RE = /^x/;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var STATUS_CODES = require('http').STATUS_CODES || {};
var getRawHeaderNames = hparser.getRawHeaderNames;
var formatHeaders = hparser.formatHeaders;
var getRawHeaders = hparser.getRawHeaders;

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'tunnelProxy'.
function tunnelProxy(server: any, proxy: any, type: any) {
  proxy.getTunnelIp = function (id: any) {
    return IP_CACHE.get(id);
  };
  var fromHttpServer = type === 2;
  var fromHttpsServer = type === 1;
  server.on('connect', function (req: any, reqSocket: any) {
    //ws, wss, https proxy
    var headers = req.headers;
    if (headers[config.WEBUI_HEAD]) {
      delete headers[config.WEBUI_HEAD];
      reqSocket.destroy();
      return;
    }
    req.fromHttpServer = reqSocket.fromHttpServer = fromHttpServer;
    req.fromHttpsServer = reqSocket.fromHttpsServer = fromHttpsServer;
    var tunnelUrl = (req.fullUrl = util.setProtocol(
      TUNNEL_HOST_RE.test(req.url) ? req.url : headers.host,
      true
    ));
    var options: any;
    var socketErr: any;
    var _emitError: any;
    var parseUrl = function (_url: any, port: any) {
      _url = _url || tunnelUrl;
      options = req.options = url.parse(_url);
      options.port = options.port || port || 443;
      if (options.host && options.host.indexOf(':') === -1) {
        options.host += ':' + options.port;
      }
      return options;
    };
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
    parseUrl();
    tunnelUrl = req.fullUrl = 'tunnel://' + options.host;
    proxy.emit('_request', tunnelUrl);
    util.onSocketEnd(reqSocket, function (err: any) {
      socketErr = err;
      if (req.isLogRequests) {
        --util.proc.tunnelRequests;
      }
      req.isLogRequests = false;
      if (_emitError) {
        _emitError(err);
      } else {
        reqSocket.destroy();
      }
    });
    var resSocket: any, proxyClient: any, responsed: any, reqEmitter: any, data: any, originPort: any;
    var reqData: any, resData: any, res: any, rollBackTunnel: any, buf: any;
    req.isTunnel = true;
    req.method = util.toUpperCase(req.method) || 'CONNECT';
    var clientInfo = util.parseClientInfo(req);
    reqSocket.clientIp = req.clientIp = clientInfo[0] || util.getClientIp(req);
    reqSocket.clientPort = req.clientPort =
      clientInfo[1] || util.getClientPort(req);
    req._remoteAddr = clientInfo[2] || util.getRemoteAddr(req);
    req._remotePort = clientInfo[3] || util.getRemotePort(req);
    delete headers[config.CLIENT_PORT_HEAD];
    req.reqId = reqSocket.reqId = util.getReqId();
    reqSocket.headers = headers;
    reqSocket.fromTunnel = req.fromTunnel;
    reqSocket.fromComposer = req.fromComposer;
    req.isPluginReq = reqSocket.isPluginReq = util.checkPluginReqOnce(req, true);
    var hostname = options.hostname;
    var isICloundCKDB = hostname === 'p22-ckdatabase.icloud.com';
    var isIPHost = !isICloundCKDB && net.isIP(hostname);
    var policy = headers[config.WHISTLE_POLICY_HEADER];
    var useTunnelPolicy = policy == 'tunnel';
    var inspect = useTunnelPolicy;
    useTunnelPolicy = useTunnelPolicy || policy == 'connect';
    var enableTunnelAck =
      useTunnelPolicy && req.headers['x-whistle-request-tunnel-ack'];
    var isLocalUIUrl = !useTunnelPolicy && config.isLocalUIUrl(hostname);
    if (isLocalUIUrl ? isIPHost : util.isLocalHost(hostname)) {
      isLocalUIUrl =
        options.port == config.port || options.port == config.uiport;
    }
    var _rules = {};
    if (isICloundCKDB || isLocalUIUrl) {
      req.enable = req.disable = req._filters = _rules;
    } else {
      _rules = rules.initRules(req);
    }
    req.rules = reqSocket.rules = _rules;
    reqSocket._globalPluginVars = req._globalPluginVars;
    reqSocket.isLocalUIUrl = isLocalUIUrl;
    rules.resolveRulesFile(req, function () {
      var filter = req._filters;
      var disable = req.disable;
      var isDisabeIntercept = function () {
        return (
          isICloundCKDB ||
          useTunnelPolicy ||
          disable.intercept ||
          disable.https ||
          disable.capture ||
          (req.isPluginReq && policy !== 'capture')
        );
      };
      var isCustomIntercept = function () {
        return (
          filter.https ||
          filter.capture ||
          filter.intercept ||
          policy === 'intercept' ||
          policy === 'capture'
        );
      };
      var isWebPort =
        options.port == 80 || options.port == 443 || isCustomIntercept();
      var matchCustomCert;
      var isEnableIntercept = function () {
        if (isCustomIntercept()) {
          return true;
        }
        if (!rulesUtil.properties.isEnableCapture()) {
          matchCustomCert = !!existsCustomCert(hostname);
          return matchCustomCert;
        }
        return true;
      };
      var isIntercept = function () {
        if (isLocalUIUrl || (!isDisabeIntercept() && isEnableIntercept())) {
          return true;
        }
        if (!isIPHost || !hasCustomCerts()) {
          return false;
        }
        reqSocket.useProxifier =
          (config.proxifier2 || (config.proxifier && isWebPort)) &&
          !disable.proxifier;
        return reqSocket.useProxifier;
      };
      var resolvedPlugin: any;
      if (isIntercept()) {
        if (util.isAuthCapture(req)) {
          req.justAuth = true;
          resolvedPlugin = true;
        }
      } else {
        resolvedPlugin = true;
      }
      var plugin = resolvedPlugin ? pluginMgr.resolveWhistlePlugins(req) : null;
      var handlePluginRules = function (_rulesMgr: any) {
        if (_rulesMgr) {
          req.pluginRules = _rulesMgr;
          req.curUrl = tunnelUrl;
          util.mergeRules(req, _rulesMgr.resolveReqRules(req));
          util.filterWeakRule(req);
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'rule' does not exist on type '{}'.
          plugin = pluginMgr.getPluginByRuleUrl(util.rule.getUrl(_rules.rule));
        } else {
          util.filterWeakRule(req);
        }
        filter = req._filters;
        disable = req.disable;
      };
      if (req.whistlePlugins) {
        if (
          matchCustomCert ||
          (matchCustomCert == null && existsCustomCert(hostname))
        ) {
          req._existsCustomCert = true;
          req._enableCapture = true;
        } else if (isEnableIntercept()) {
          req._enableCapture = true;
        }
      }
      pluginMgr.getTunnelRules(req, function (_rulesMgr: any) {
        handlePluginRules(_rulesMgr);
        policy = headers[config.WHISTLE_POLICY_HEADER];
        if (!reqSocket._hasError && !req._authForbidden &&
          !req.fromComposer && (req._forceCapture || isIntercept())) {
          reqSocket.rulesHeaders = req.rulesHeaders;
          reqSocket.enable = req.enable;
          reqSocket.disable = req.disable;
          reqSocket.tunnelHostname = hostname;
          reqSocket.rules = _rules;
          dispatch(
            reqSocket,
            function (chunk: any) {
              if (
                isLocalUIUrl ||
                (isIPHost &&
                  util.isLocalAddress(hostname) &&
                  options.port == config.port)
              ) {
                return reqSocket.destroy();
              }
              buf = chunk;
              rollBackTunnel = true;
              ensureLoadRules();
            },
            !req.enable.socket && isWebPort
          );
          util.setEstablished(reqSocket);
          return;
        }

        ensureLoadRules();

        function ensureLoadRules() {
          if (!req.justAuth) {
            if (resolvedPlugin) {
              return handleTunnel();
            }
          } else {
            req.justAuth = false;
          }
          if (!resolvedPlugin) {
            plugin = pluginMgr.resolveWhistlePlugins(req);
          }
          pluginMgr.getTunnelRules(req, function (_rulesMgr2: any) {
            handlePluginRules(_rulesMgr2);
            handleTunnel();
          });
        }

        function handleTunnel() {
          if (req.isLogRequests !== false) {
            ++util.proc.tunnelRequests;
            ++util.proc.totalTunnelRequests;
            req.isLogRequests = true;
          }
          var reqRawHeaderNames = getRawHeaderNames(req.rawHeaders) || {};
          var enable = req.enable;
          inspect =
            inspect || util.isInspect(enable) || util.isCustomParser(req);
          reqData = {
            _clientId: util.getComposerClientId(headers),
            ip: req.clientIp,
            port: req.clientPort,
            method: req.method,
            httpVersion: req.httpVersion || '1.1',
            headers: headers,
            rawHeaderNames: reqRawHeaderNames
          };
          resData = { headers: {} };
          reqEmitter = new EventEmitter();
          data = {
            id: req.reqId,
            url: options.host,
            startTime: Date.now(),
            rules: _rules,
            req: reqData,
            res: resData,
            isHttps: true,
            inspect: inspect,
            rulesHeaders: req.rulesHeaders
          };
          if (
            util.showPluginReq(req) &&
            config.captureData &&
            (!filter.hide || disable.hide)
          ) {
            data.abort = emitError;
            if (req.isPluginReq) {
              data.isPR = 1;
            }
            proxy.emit('request', reqEmitter, data);
          }
          if (reqSocket._hasError) {
            return emitError(socketErr);
          }
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'reqHeaders' does not exist on type '{}'.
          util.parseRuleJson(_rules.reqHeaders, function (reqHeaders: any) {
            if (reqSocket._hasError) {
              return emitError(socketErr);
            }
            _emitError = emitError;
            var customXFF;
            if (reqHeaders) {
              reqHeaders = util.lowerCaseify(reqHeaders, reqRawHeaderNames);
              customXFF = reqHeaders[config.CLIENT_IP_HEAD];
              delete reqHeaders[config.CLIENT_IP_HEAD];
              extend(headers, reqHeaders);
            }

            if (disable.clientIp || disable.clientIP) {
              delete headers[config.CLIENT_IP_HEAD];
            } else {
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'forwardedFor' does not exist on type '{}... Remove this comment to see the full error message
              var forwardedFor = util.getMatcherValue(_rules.forwardedFor);
              if (net.isIP(forwardedFor)) {
                headers[config.CLIENT_IP_HEAD] = forwardedFor;
              } else if (net.isIP(customXFF)) {
                headers[config.CLIENT_IP_HEAD] = customXFF;
              } else if (util.isLocalAddress(req.clientIp)) {
                delete headers[config.CLIENT_IP_HEAD];
              } else {
                headers[config.CLIENT_IP_HEAD] = req.clientIp;
              }
            }

            pluginMgr.postStats(req);
            if (
              !req.disable.abort &&
              (enable.abort || filter.abort || disable.tunnel)
            ) {
              return reqSocket.destroy();
            }

            res = util.getStatusCodeFromRule(_rules);
            if (res) {
              var statusCode = res.statusCode;
              util.deleteReqHeaders(req);
              if (statusCode == 200) {
                resSocket = util.getEmptyRes();
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'reqDelay' does not exist on type '{}'.
                var reqDelay = util.getMatcherValue(_rules.reqDelay);
                data.requestTime = data.dnsTime = Date.now();
                if (reqDelay > 0) {
                  setTimeout(handleConnect, reqDelay);
                } else {
                  handleConnect();
                }
                return;
              }
              // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
              return sendEstablished(statusCode);
            }

            pluginMgr.loadPlugin(
              req.isPluginReq ? null : plugin,
              function (err: any, ports: any) {
                if (reqSocket._hasError) {
                  return emitError(socketErr);
                }
                if (err) {
                  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
                  return sendEstablished(500);
                }
                var tunnelPort = ports && ports.tunnelPort;
                var proxyUrl: any;
                if (tunnelPort) {
                  proxyUrl = 'proxy://127.0.0.1:' + tunnelPort;
                  reqSocket.customParser = req.customParser =
                    util.getParserStatus(req);
                  pluginMgr.addRuleHeaders(req, _rules);
                  headers[config.PLUGIN_HOOK_NAME_HEADER] =
                    config.PLUGIN_HOOKS.TUNNEL;
                  socketMgr.setPending(req);
                  data.reqPlugin = 1;
                }

                // @ts-expect-error ts-migrate(2339) FIXME: Property 'rule' does not exist on type '{}'.
                var realUrl = _rules.rule && _rules.rule.url;
                if (realUrl) {
                  var isHttp;
                  if (/^https?:/.test(realUrl)) {
                    isHttp = realUrl[4] === ':';
                    realUrl =
                      'tunnel' + realUrl.substring(realUrl.indexOf(':'));
                  }
                  if (/^tunnel:\/\//.test(realUrl) && realUrl != tunnelUrl) {
                    parseUrl(realUrl, isHttp ? 80 : 443);
                    tunnelUrl = 'tunnel://' + options.host;
                    data.realUrl = tunnelUrl.replace('tunnel://', '');
                  }
                }
                originPort = options.port;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'ua' does not exist on type '{}'.
                if (_rules.ua) {
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'ua' does not exist on type '{}'.
                  var ua = util.getMatcherValue(_rules.ua);
                  headers['user-agent'] = ua;
                }
                rules.getProxy(
                  tunnelUrl,
                  proxyUrl ? null : req,
                  function (err: any, hostIp: any, hostPort: any) {
                    var isInternalProxy: any;
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'proxy' does not exist on type '{}'.
                    var proxyRule = _rules.proxy || '';
                    if (!proxyUrl) {
                      proxyUrl = proxyRule
                        ? util.rule.getMatcher(proxyRule)
                        : null;
                    }
                    var isXProxy: any;
                    if (proxyUrl) {
                      isXProxy = X_RE.test(proxyUrl);
                      isInternalProxy = proxyRule.isInternal || util.isInternalProxy(req);
                      var isSocks = proxyRule.isSocks;
                      var isHttpsProxy = proxyRule.isHttps;
                      var _url = 'http:' + util.removeProtocol(proxyUrl);
                      data.proxy = true;
                      // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
                      getServerIp(_url, function (ip: any) {
                        options = parseUrl(
                          _url,
                          isSocks ? 1080 : isHttpsProxy ? 443 : 80
                        );
                        options.auth = options.auth || req._pacAuth;
                        var isProxyPort = util.isProxyPort(options.port);
                        if (isProxyPort && util.isLocalAddress(ip)) {
                          return emitError(
                            new Error(
                              'Self loop (' + ip + ':' + config.port + ')'
                            )
                          );
                        }
                        var handleProxy = function (proxySocket: any, _res: any) {
                          resSocket = proxySocket;
                          res = _res;
                          // 通知插件连接建立成功的回调
                          handleConnect();
                          handleError(resSocket);
                          delete headers['x-whistle-frame-parser'];
                        };
                        var dstOptions = url.parse(tunnelUrl);
                        dstOptions.proxyHost = ip;
                        dstOptions.proxyPort = parseInt(options.port, 10);
                        dstOptions.port = dstOptions.port || 443;
                        resData.port = dstOptions.proxyPort;
                        dstOptions.host = dstOptions.hostname;
                        util.setClientId(
                          headers,
                          req.enable,
                          req.disable,
                          req.clientIp,
                          isInternalProxy
                        );
                        util.deleteReqHeaders(req);
                        var _headers = extend({}, headers);
                        _headers.host =
                          dstOptions.hostname + ':' + (dstOptions.port || 443);
                        if (disable.proxyUA) {
                          delete _headers['user-agent'];
                        }
                        dstOptions.headers = formatHeaders(
                          _headers,
                          reqRawHeaderNames
                        );
                        if (isSocks) {
                          dstOptions.proxyPort = options.port || 1080;
                          dstOptions.localDNS = false;
                          dstOptions.auths = config.getAuths(options);
                        } else {
                          dstOptions.proxyPort = options.port || 80;
                          dstOptions.proxyAuth = options.auth;
                          if (isProxyPort || util.isLocalPHost(req, true)) {
                            _headers[config.WEBUI_HEAD] = 1;
                          }
                          _headers['x-whistle-request-tunnel-ack'] = 1;
                        }
                        var netMgr = isSocks ? socks : config;
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'reqDelay' does not exist on type '{}'.
                        var reqDelay = util.getMatcherValue(_rules.reqDelay);
                        util.setProxyHost(req, dstOptions, true);
                        if (isHttpsProxy) {
                          dstOptions.proxyServername = options.hostname;
                        }
                        var connectProxy = function () {
                          if (responsed) {
                            return;
                          }
                          if (req.isPluginReq) {
                            var host = ip + ':' + dstOptions.proxyPort;
                            if (req._phost && req._phost.host) {
                              IP_CACHE.set(
                                req.isPluginReq,
                                req._phost.host + ', ' + host
                              );
                            } else {
                              IP_CACHE.set(req.isPluginReq, host);
                            }
                          } else if (req._phost) {
                            resData.phost = req._phost.host;
                          }
                          resData.port = dstOptions.proxyPort;
                          req.serverPort = reqSocket.serverPort = resData.port;
                          try {
                            if (!tunnelPort && req._phost && req._proxyTunnel) {
                              dstOptions.proxyTunnelPath = util.removeProtocol(
                                tunnelUrl,
                                true
                              );
                            }
                            var s = netMgr.connect(dstOptions, handleProxy);
                            proxyClient = s._sock || s;
                            s.on('error', function (err: any) {
                              if (isXProxy) {
                                resData.phost = undefined;
                                // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
                                tunnel();
                              } else {
                                emitError(err);
                              }
                            });
                          } catch (e) {
                            emitError(e);
                          }
                        };
                        if (reqDelay > 0) {
                          setTimeout(connectProxy, reqDelay);
                        } else {
                          connectProxy();
                        }
                      });
                    } else {
                      tunnel(hostIp, hostPort);
                    }
                  }
                );
              }
            );
          }, req);
        }
        var retryConnect: any;
        var retryXHost = 0;
        function tunnel(hostIp: any, hostPort: any) {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
          getServerIp(
            tunnelUrl,
            function (ip: any, port: any) {
              if (port) {
                req.hostIp = resData.ip = util.getHostIp(ip, port);
                resData.port = port;
              } else {
                req.hostIp = resData.ip = ip;
                // 不要赋值给port，否则重试时getServerIp会有端口
                resData.port = port || originPort;
              }
              if (responsed) {
                return;
              }
              if (req.isPluginReq) {
                IP_CACHE.set(req.isPluginReq, req.hostIp);
              }
              req.serverPort = reqSocket.serverPort = resData.port;
              resSocket = net.connect(resData.port, ip, handleConnect);
              if (retryConnect) {
                handleError(resSocket);
              } else {
                retryConnect = function () {
                  if (
                    retryXHost < 2 &&
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'host' does not exist on type '{}'.
                    _rules.host &&
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'host' does not exist on type '{}'.
                    X_RE.test(_rules.host.matcher)
                  ) {
                    ++retryXHost;
                    retryConnect = false;
                    if (retryXHost > 1) {
                      req.curUrl = tunnelUrl;
                      rules.lookupHost(req, function (_err: any, _ip: any) {
                        if (_err) {
                          return emitError(_err);
                        }
                        tunnel(_ip, originPort);
                      });
                      return;
                    }
                  }
                  tunnel(ip, port);
                };
                var retried: any;
                resSocket.on('error', function(this: any) {
                  if (!retried) {
                    retried = true;
                    this.destroy && this.destroy();
                    !responsed &&
                      !reqSocket._hasError &&
                      retryConnect &&
                      retryConnect();
                  }
                });
              }
            },
            hostIp,
            hostPort
          );
        }

        function handleConnect() {
          if (reqSocket._hasError) {
            return emitError(socketErr);
          }
          if (retryConnect) {
            resSocket.removeListener('error', retryConnect);
            handleError(resSocket);
            retryConnect = null;
          }
          reqSocket.inspectFrames = inspect;
          reqSocket.fullUrl = tunnelUrl;
          reqSocket.enable = req.enable;
          reqSocket.disable = req.disable;
          reqSocket._filters = req._filters;
          reqSocket.hostIp = req.hostIp;
          reqSocket.method = req.method;
          reqSocket.headerRulesMgr = req.headerRulesMgr;
          reqSocket.clientPort = req.clientPort;
          reqSocket.globalValue = req.globalValue;
          resSocket.statusCode = resData.statusCode;
          pluginMgr.resolvePipePlugin(reqSocket, function () {
            if (reqSocket._hasError) {
              return emitError(socketErr);
            }
            data.pipe = reqSocket._pipeRule;
            if (reqSocket._pipePluginPorts) {
              reqSocket.inspectFrames = data.inspect = true;
              reqSocket.customParser = false;
            }
            var connHandler = function () {
              if (buf) {
                var _pipe = reqSocket.pipe;
                reqSocket.pipe = function (stream: any) {
                  if (buf) {
                    stream.write(buf);
                    buf = null;
                  }
                  return _pipe.apply(this, arguments);
                };
              }
              socketMgr.handleConnect(reqSocket, resSocket);
            };
            var handleEstablished = function () {
              if (useTunnelPolicy) {
                sendEstablished(200, connHandler);
              } else {
                connHandler();
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
                sendEstablished();
              }
            };
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'resDelay' does not exist on type '{}'.
            var resDelay = util.getMatcherValue(_rules.resDelay);
            if (resDelay > 0) {
              setTimeout(handleEstablished, resDelay);
            } else {
              handleEstablished();
            }
          });
        }

        function getServerIp(url: any, callback: any, hostIp: any, hostPort: any, proxyRule: any) {
          var hostHandler = function (err: any, ip: any, port: any, host: any) {
            if (host) {
              (proxyRule || _rules).host = host;
            }
            data.requestTime = data.dnsTime = Date.now();
            req.hostIp = resData.ip = ip || LOCALHOST;
            reqEmitter.emit('send', data);
            err ? emitError(err) : callback(ip, port);
          };
          if (hostIp) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
            hostHandler(null, hostIp, hostPort);
          } else {
            req.curUrl = url;
            rules.resolveHost(
              req,
              hostHandler,
              req.pluginRules,
              req.rulesFileMgr,
              req.headerRulesMgr
            );
          }
        }

        function handleError(socket: any) {
          socket.on('error', emitError);
        }

        function sendEstablished(code: any, cb: any) {
          if (res) {
            code = res.statusCode || 200;
            if (!res.headers['proxy-agent']) {
              res.headers['proxy-agent'] = config.name;
              res.rawHeaders = res.rawHeaders || [];
              res.rawHeaders.push('proxy-agent', 'Proxy-Agent');
            }
          } else {
            code = code || 200;
            res = {
              statusCode: code,
              headers: {
                'proxy-agent': config.name
              },
              rawHeaders: ['proxy-agent', 'Proxy-Agent']
            };
          }
          var tunnelAck = enableTunnelAck && cb && code == 200;
          if (tunnelAck) {
            res.headers['x-whistle-allow-tunnel-ack'] = 1;
          }
          var resHeaders = res.headers;
          pluginMgr.getResRules(req, res, function () {
            var reqRules = req.rules;
            util.parseRuleJson(
              rollBackTunnel ? null : reqRules.resHeaders,
              function (newResHeaders: any) {
                if (rollBackTunnel) {
                  reqSocket.resume();
                  cb && cb();
                } else {
                  var rawHeaderNames = getRawHeaderNames(res.rawHeaders) || {};
                  if (newResHeaders) {
                    util.lowerCaseify(newResHeaders, rawHeaderNames);
                    extend(resHeaders, newResHeaders);
                  }
                  var responseFor = util.getMatcherValue(reqRules.responseFor);
                  if (responseFor) {
                    resHeaders['x-whistle-response-for'] = responseFor;
                  }
                  util.setResponseFor(reqRules, resHeaders, req, req.hostIp);
                  var delResHeaders =
                    util.parseDeleteProperties(req).resHeaders;
                  Object.keys(delResHeaders).forEach(function (name) {
                    delete resHeaders[name];
                  });
                  code = util.getMatcherValue(reqRules.replaceStatus) || code;
                  var message =
                    code == 200
                      ? 'Connection Established'
                      : STATUS_CODES[code] || 'unknown';
                  var statusLine = ['HTTP/1.1', code, message].join(' ');
                  var curHeaders = resHeaders;
                  if (req.fromComposer) {
                    curHeaders = extend({}, resHeaders);
                    curHeaders['x-whistle-req-id'] = req.reqId;
                  }
                  var rawData =
                    [
                      statusLine,
                      getRawHeaders(formatHeaders(curHeaders, rawHeaderNames))
                    ].join('\r\n') + '\r\n\r\n';
                  if (code != 200) {
                    reqSocket.end(rawData, cb);
                  } else {
                    if (tunnelAck) {
                      reqSocket.write(rawData);
                      reqSocket.once('data', function (chunk: any) {
                        buf = chunk.length > 1 ? chunk.slice(1) : null;
                        reqSocket.pause();
                        cb();
                      });
                    } else {
                      reqSocket.write(
                        rawData,
                        cb &&
                          function () {
                            setTimeout(cb, 16);
                          }
                      );
                    }
                  }
                }
                if (reqEmitter) {
                  responsed = true;
                  data.responseTime = data.endTime = Date.now();
                  resData.rawHeaderNames = rawHeaderNames;
                  resData.statusCode = code || 200;
                  resData.ip = resData.ip || LOCALHOST;
                  resData.headers = resHeaders;
                  reqEmitter.emit('response', data);
                  reqEmitter.emit('end', data);
                }
                pluginMgr.postStats(req, res);
              },
              req
            );
          });
          return reqSocket;
        }
        var reqDestroyed: any, resDestroyed: any;
        function emitError(err: any) {
          if (!reqDestroyed) {
            reqDestroyed = true;
            reqSocket.destroy();
          }
          if (resSocket && !resDestroyed) {
            resDestroyed = true;
            resSocket.destroy();
          }
          if (proxyClient) {
            proxyClient.destroy && proxyClient.destroy();
            proxyClient = null;
          }
          if (responsed) {
            return;
          }
          responsed = true;
          if (!reqEmitter) {
            return;
          }
          data.responseTime = data.endTime = Date.now();

          if (!resData.ip) {
            req.hostIp = resData.ip = LOCALHOST;
          }

          if (!err && !resData.statusCode) {
            err = new Error('Aborted');
            data.reqError = true;
            resData.statusCode = 'aborted';
            reqData.body = util.getErrorStack(err);
            reqEmitter.emit('abort', data);
          } else {
            data.resError = true;
            resData.statusCode = resData.statusCode || 502;
            resData.body = err ? util.getErrorStack(err) : 'Aborted';
            util.emitError(reqEmitter, data);
          }
          resData.headers = { 'x-server': 'whistle' };
          pluginMgr.postStats(req, resData);
        }
      });
    });
  });

  return server;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = tunnelProxy;
