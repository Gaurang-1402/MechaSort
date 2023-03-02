const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = createProxyMiddleware({
    target: 'https://sandbox.checkbook.io',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/v3/check/digital'
    },
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    }
});