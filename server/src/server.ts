import Fastify from "fastify";

const app = Fastify()

app.get('/', () => {
  return 'Hello World'
})

app.listen({
  port: 3333,
}).then(() => {
  console.log('Http server running')
})