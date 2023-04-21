// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs')
const { i18n } = require('./next-i18next.config')

const path = require('path')

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  i18n,
  experimental: {
    esmExternals: false,
    jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}

module.exports = withSentryConfig(module.exports, { silent: true }, { hideSourcemaps: true })
