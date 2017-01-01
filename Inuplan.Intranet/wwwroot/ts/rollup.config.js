import buble from "rollup-plugin-buble";

export default {
  entry: "dist/app.js",
  dest: "../js/bundle.js",
  format: "cjs",
  plugins: [
    buble()
  ],
  sourceMap: "inline",
};