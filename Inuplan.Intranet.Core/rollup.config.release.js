import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'wwwroot/js/app.js',
  dest: 'wwwroot/js/bundle-es2015.min.js',
  format: 'cjs',
  plugins: [
    buble(),
    uglify()
  ]
}
