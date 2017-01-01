import buble from "rollup-plugin-buble";
import uglify from "rollup-plugin-uglify";

export default {
  entry: "wwwroot/ts/dist/app.js",
  dest: "wwwroot/js/bundle.min.js",
  format: "cjs",
  plugins: [
    buble(),
    uglify()
  ]
};