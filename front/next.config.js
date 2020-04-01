const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const nodeExternals = require('webpack-node-externals');

module.exports = withBundleAnalyzer({
  distDir : '.next',
  analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  },
  webpack(config, {isServer}) {
    if (!isServer) {
      config.node = {
        fs: 'empty',
        net: 'empty',
      }
    }
     return {
        ...config,
        mode : process.env.NODE_ENV === 'production' ? 'production' : 'development',
        devtool : process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'eval',
        externals: [nodeExternals()],
     };
  },
});