const axios = require('axios');
const { execSync } = require('child_process');

exports.http = (url, options = {}) => {
  return new Promise((resolve) => {
    axios({
      url,
      ...options
    }).then((res) => {
      resolve({
        success: res.status === 200,
        config: res.config,
        headers: res.headers || {},
        body: res.data,
        status: res.status
      });
    }).catch((err) => {
      resolve({
        success: false,
        config: err.response ? err.response.config : err.config,
        headers: err.response ? err.response.headers : {},
        body: err.response ? err.response.data : null,
        status: err.response ? err.response.status : 500
      });
    });
  });
};

exports.get = (url, options) => exports.http(url, { ...options, method: 'GET' });

exports.getHTTPVersion = (url) => {
  return new Promise((resolve) => {
    try {
      const output = execSync(`curl --head -k -s --max-time 3 "${url.split(/\s+/)[0]}"`, { encoding: 'utf8' });
      const mathed = output.match(/^(HTTP\/[0-9.]+)\s\d+/i);
      resolve(mathed ? mathed[1].toUpperCase() : null);
    } catch (e) {
      resolve(null);
    }
  });
};
