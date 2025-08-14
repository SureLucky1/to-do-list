const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const HttpError = require('./error');

class Router {
  constructor() {
    this.routes = [];
  }

  get(url, handler) {
    console.log('GET Route:', url);
    this.routes.push({ method: 'GET', url, handler });
    return this;
  }

  post(url, handler) {
    console.log('POST Route:', url);
    this.routes.push({ method: 'POST', url, handler });
    return this;
  }

  put(url, handler) {
    console.log('PUT Route:', url);
    this.routes.push({ method: 'PUT', url, handler });
    return this;
  }
  delete(url, handler) {
    console.log('DELETE Route:', url);
    this.routes.push({ method: 'DELETE', url, handler });
    return this;
  }

  static(prefix, dir) {
    if (!prefix.endsWith('/')) {
      prefix += '/';
    }

    const filenames = readdirSync(dir);
    for (const filename of filenames) {
      this.get(prefix + filename, context => {
        return file(join(dir, filename))(context.req, context.res);
      });
    }
    return this;
  }

  resolve(req, res) {
    console.log(`🔍 收到請求：${req.method} ${req.url}`);
    try {
      const handler = this.match(req, res);
      if (handler) {
        handler(req, res);
      } else {
        this.fallback(req, res);
      }
    } catch (error) {
      if (error instanceof HttpError) {
        res.statusCode = error.statusCode;
        json({ error: error.message })(req, res);
      } else if (error instanceof Error) {
        console.error(error);
        res.statusCode = 500;
        json({
          error: error.message,
          stack: error.stack?.split('\n'),
        })(req, res);
      } else {
        res.statusCode = 500;
        json({ error: String(error) })(req, res);
      }
    }
  }

  match(req, res) {
    const [path] = (req.url || '/').split('?');
    const method = req.method;
    const urlParts = path.split('/');

    for (const route of this.routes) {
      if (route.method !== method) {
        continue;
      }

      const routeUrlParts = route.url.split('/');
      if (urlParts.length !== routeUrlParts.length) {
        continue;
      }

      const params = {};
      let isMatched = true;
      for (let i = 0; i < urlParts.length; i++) {
        if (routeUrlParts[i].startsWith(':')) {
          const key = routeUrlParts[i].slice(1);
          params[key] = urlParts[i];
        } else if (urlParts[i] !== routeUrlParts[i]) {
          isMatched = false;
          break;
        }
      }

      if (isMatched) {
        return (req, res) => route.handler({ req, res, params });
      }
    }

    return null;
  }

  
  fallback(req, res) {
    res.statusCode = 404;
    return console.log('404 Not Found');
  }
}

function file(path) {
  return (req, res) => {
    res.write(readFileSync(path));
    res.end();
  };
}

function json(payload) {
  return (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  };
}

module.exports = { Router, file, json };