import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'app.js',
  dest: 'bundle.min.js',
  format: 'cjs',
  plugins: [
    buble(),
    uglify()
  ]
}
