const cors = require('kcors');
const isDev = think.env === 'development';

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {
      keepExtensions: true,
      limit: '5mb'
    }
  },
  {
    handle: 'router',
    options: {}
  },
  {
    handle: cors,
    options: {
      origin(ctx) {
        return ctx.get('origin');

        // 这里应该做 origin 白名单的
        // const host = new URL(ctx.request.header.origin).hostname;
        // if (['host1.com', 'host2.com'].includes(host)) {
        //   return ctx.get('origin');
        // }
        // return null;
      },
      // credentials: true, // 不使用 credentials
      allowMethods: 'GET,POST,OPTIONS'
    }
  },
  'logic',
  'controller',
  {
    handle(options) {
      return function tryError(ctx, next) {
        if ([404, 500].includes(ctx.status)) {
          return ctx.json({
            success: false,
            data: null,
            message: '访问错误'
          });
        }
        next();
      };
    }
  }
];
