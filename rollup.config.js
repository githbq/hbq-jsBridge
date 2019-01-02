import { uglify } from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'
import banner from 'rollup-plugin-license'
import { version } from './package.json'
import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'


function getConfig (options) {
  const config = {
    input: 'src/index.ts',
    output: {     
      format:'umd',
      file: `./releases/jsBridge.rollup${options.debug ? '.debug' : ''}.js`,
      name: 'jsBridge',
      intro: `var __DEBUG_MODE__ = ${options.debug}`
    },
    plugins: [
      commonjs(),
      typescript({ tsconfig: "tsconfig.json" }),
      !options.debug ? uglify({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      }) : () => { },
      // clear({
      //   // required, point out which directories should be clear.
      //   targets: ['releases'],
      //   // optional, whether clear the directores when rollup recompile on --watch mode.
      //   watch: true, // default: false
      // })
    ]
  }

  return config
}

const config = [
  getConfig({ debug: false }),
  getConfig({ debug: true })
]

export default config
