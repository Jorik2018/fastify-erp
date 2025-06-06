import { utils } from './helpers/utils';
import Fastify from 'fastify'
import closeWithGrace from "close-with-grace";
import pino from 'pino';
import userRouter from './routes/user.router'
import postRouter from './routes/post.router';
import loadConfig from './config'

loadConfig()

const port = process.env.API_PORT || 5000;

const startServer = () => {

  const server = Fastify({
    logger: pino({ level: 'info' }),
  })
  server.register(require('@fastify/formbody'))
  server.register(require('@fastify/cors'))
  server.register(require('@fastify/helmet'))
  server.register(userRouter, { prefix: '/api/user' })
  server.register(postRouter, { prefix: '/api/post' })

  const closeListeners = closeWithGrace({ delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY!) || 500 }, async function ({ signal, err, manual }) {
    if (err) {
      server.log.error(err)
    }
    await server.close()
  } as closeWithGrace.CloseWithGraceAsyncCallback)

  server.addHook('onClose', (instance, done) => {
    closeListeners.uninstall()
    done()
  })

  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);
  })

  server.get('/', (request, reply) => {
    reply.send({ name: 'fastify-typescript' })
  })
  
  server.get('/health-check', async (request, reply) => {
    try {
      await utils.healthCheck()
      reply.status(200).send()
    } catch (e) {
      reply.status(500).send()
    }
  })
  
  if (process.env.NODE_ENV === 'production') {
    for (const signal of ['SIGINT', 'SIGTERM']) {
      process.on(signal, () =>
        server.close().then((err) => {
          console.log(`close application on ${signal}`)
          process.exit(err ? 1 : 0)
        }),
      )
    }
  }
  
  return server.listen({ port: port as number })
    .then(() => {
      console.log('addresses', server.addresses())
      return server;
    })
    .catch((err) => {
      server.log.error(err);
      process.exit(1);
    })
}

process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})

startServer().then(() => {
  console.log('server start!')
})

