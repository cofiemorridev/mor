import { createServer } from 'vite'

async function start() {
  const server = await createServer({
    configFile: false,
    root: process.cwd(),
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true
    },
    plugins: [
      (await import('@vitejs/plugin-react')).default()
    ]
  })
  
  await server.listen()
  server.printUrls()
}

start().catch(console.error)
