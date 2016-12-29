import buble from "rollup-plugin-buble";
import uglify from "rollup-plugin-uglify";

export default {
  entry: "dist/app.js",
  dest: "dist/bundle.min.js",
  format: "cjs",
  plugins: [
    buble(),
    uglify()
  ]
};