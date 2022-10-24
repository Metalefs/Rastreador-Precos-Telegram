const server_port = process.env.PORT || 8080;
const server_host = "0.0.0.0";

module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  devServer: {
    disableHostCheck: true,
    contentBase: "./dist",
    compress: true,
    inline: true,
    port: server_port,
    host: server_host
  },
};
