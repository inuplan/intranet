import buble from 'rollup-plugin-buble'

export default {
  entry: 'app.js',
  dest: 'bundle.js',
  format: 'cjs',
  plugins: [
    buble()
  ],
  sourceMap: 'inline'
}
