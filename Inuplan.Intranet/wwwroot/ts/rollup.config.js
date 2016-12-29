import buble from 'rollup-plugin-buble'

export default {
  entry: 'dist/app.js',
  dest: 'dist/bundle.js',
  format: 'cjs',
  plugins: [
    buble()
  ],
  sourceMap: 'none',
}

