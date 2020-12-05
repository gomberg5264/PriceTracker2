// /* eslint-disable */
// const withLess = require("@zeit/next-less")
// const lessToJS = require("less-vars-to-js")
// const fs = require("fs")
// const path = require("path")

// // Where your antd-custom.less file lives
// const themeVariables = lessToJS(
//   fs.readFileSync(path.resolve(__dirname, "./assets/antd-custom.less"), "utf8")
// )

// module.exports = withLess({
//   lessLoaderOptions: {
//     javascriptEnabled: true,
//     modifyVars: themeVariables, // make your antd custom effective
//   },
//   env: {
//     API_BASE_URL: process.env.API_BASE_URL,
//   },
//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       const antStyles = /antd\/.*?\/style.*?/
//       const origExternals = [...config.externals]
//       config.externals = [
//         (context, request, callback) => {
//           if (request.match(antStyles)) return callback()
//           if (typeof origExternals[0] === "function") {
//             origExternals[0](context, request, callback)
//           } else {
//             callback()
//           }
//         },
//         ...(typeof origExternals[0] === "function" ? [] : origExternals),
//       ]

//       config.module.rules.unshift({
//         test: antStyles,
//         use: "null-loader",
//       })
//     }
//     return config
//   },
// })

/* eslint-disable */
const withLess = require("@zeit/next-less")
const withCss = require("@zeit/next-css")
const lessToJS = require("less-vars-to-js")
const withPWA = require("next-pwa")
const fs = require("fs")
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const isProd = process.env.NODE_ENV === "production"

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, "./assets/antd-custom.less"), "utf8")
)

module.exports = withPWA({
  pwa: {
    disable: !isProd,
    dest: "public",
  },
  ...withCss({
    cssModules: true,
    ...withLess({
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: themeVariables, // make your antd custom effective
        importLoaders: 0,
      },
      cssLoaderOptions: {
        importLoaders: 3,
        localIdentName: "[local]___[hash:base64:5]",
      },
      env: {
        API_BASE_URL: process.env.API_BASE_URL,
      },
      webpack: (config, { isServer }) => {
        new MiniCssExtractPlugin({
          ignoreOrder: true,
        })

        //Make Ant styles work with less
        if (isServer) {
          const antStyles = /antd\/.*?\/style.*?/

          const origExternals = [...config.externals]
          config.externals = [
            (context, request, callback) => {
              if (request.match(antStyles)) return callback()
              if (typeof origExternals[0] === "function") {
                origExternals[0](context, request, callback)
              } else {
                callback()
              }
            },
            ...(typeof origExternals[0] === "function" ? [] : origExternals),
          ]

          config.module.rules.unshift({
            test: antStyles,
            use: "null-loader",
          })
        }
        return config
      },
    }),
  }),
})

// module.exports = withPWA({
//   pwa: {
//       dest: 'public'
//   }

// })
