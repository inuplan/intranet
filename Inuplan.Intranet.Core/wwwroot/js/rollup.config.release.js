import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'app.js',
  dest: 'bundle-es2015.min.js',
  format: 'cjs',
  plugins: [
    buble(),
    uglify()
  ]
}
