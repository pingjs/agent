const ping = require('ping');
const { get, getHTTPVersion } = require('../utils/http');

module.exports = class extends think.Controller {
  /**
   * ping 命令
   *
   * @param {sring} hostname 目标主机
   * @param {number} [count=3] 探测次数
   * @param {number} [timeout=3000] 超时时间
   * @return {Promise} { success, message, data }
   */
  async pingAction() {
    const count = this.get('count') || 3;
    const timeout = this.get('timeout') || 3000;
    const hostname = this.get('hostname');

    if (!hostname) {
      return this.json({
        success: false,
        data: null,
        message: '`hostname` 必选'
      });
    }

    try {
      const res = await ping.promise.probe(hostname, {
        timeout: timeout / 1000,
        extra: ['-c', count]
      });
      return this.json({
        success: true,
        message: null,
        data: res
      });
    } catch (e) {
      return this.json({
        success: false,
        data: null,
        message: e
      });
    }
  }

  /**
   * curl 命令
   *
   * @param {sring} url 目标链接
   * @param {string} [userAgent=pingjs/1.0.0] UserAgent
   * @param {number} [timeout=6000] 超时时间
   * @return {Promise} { success, message, data: { rquest, response } }
   */
  async curlAction() {
    const timeout = parseInt(this.get('timeout')) || 6000;
    const url = this.get('url');
    const userAgent = this.get('userAgent') || 'pingjs/1.0.0';

    if (!url) {
      return this.json({
        success: false,
        data: null,
        message: '`url` 必选'
      });
    }

    try {
      const [res, httpVersion] = await Promise.all([
        await get(url, {
          headers: {
            'user-agent': userAgent
          },
          timeout
        }),
        getHTTPVersion(url)
      ]);
      this.json({
        success: true,
        data: {
          rquest: {
            url: res.config.url,
            method: res.config.method,
            headers: res.config.headers,
            timeout: res.config.timeout
          },
          response: {
            httpVersion,
            headers: res.headers,
            body: res.body,
            status: res.status
          }
        },
        message: null
      });
    } catch (e) {
      return this.json({
        success: false,
        data: null,
        message: e
      });
    }
  }
};
