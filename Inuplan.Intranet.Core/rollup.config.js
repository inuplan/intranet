import buble from 'rollup-plugin-buble'

export default {
  entry: 'wwwroot/js/app.js',
  dest: 'wwwroot/js/bundle.min.js',
  format: 'cjs',
  plugins: [
    buble()
  ],
  sourceMap: 'inline'
}
