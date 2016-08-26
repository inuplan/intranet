import buble from 'rollup-plugin-buble'

export default {
  entry: 'app.js',
  dest: 'bundle-es2015.js',
  format: 'cjs',
  plugins: [
    buble()
  ],
  sourceMap: 'inline'
}
