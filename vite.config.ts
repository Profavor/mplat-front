import vue from '@vitejs/plugin-vue'
import viteSvgIcons from 'vite-plugin-svg-icons'
import path from 'path'

export default ({ command, mode }) => {
  const config = {
    plugins: [
      vue(),
      viteSvgIcons({
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: [
        {
          find: '@/',
          replacement: path.resolve(process.cwd(), 'src') + '/',
        },
      ],
    },
    server: {
      open: false,
      host: '0.0.0.0'
    },
    build: {
      sourcemap: true,
      manifest: true
    }
  }
  if (command === 'build' && mode === 'staging') {
    return Object.assign(
      {
        base: '/',
      },
      config
    )
  } else {
    return Object.assign(
      {
        base: '/',
      },
      config
    )
  }
}
