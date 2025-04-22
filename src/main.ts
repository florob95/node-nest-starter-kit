import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import compression from '@fastify/compress'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  )
  await app.register(compression, { encodings: ['gzip', 'deflate', 'br'] })
  app.useLogger(app.get(Logger))
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
