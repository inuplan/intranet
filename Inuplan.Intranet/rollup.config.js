import buble from "rollup-plugin-buble";

export default {
  entry: "wwwroot/ts/dist/app.js",
  dest: "wwwroot/js/bundle.js",
  format: "cjs",
  plugins: [
    buble()
  ],
  sourceMap: "inline",
};