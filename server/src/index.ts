import 'dotenv/config'
import express, { Application, Request, Response } from 'express'
import * as trpcExpress from '@trpc/server/adapters/express';
import webhook from './webhook';
import { realAppRouter } from './router';

const app = express()

const port = process.env.PORT || 3000;

const createContext = ({
    req,
    res,
  }: trpcExpress.CreateExpressContextOptions) => ({}); // no context
  type Context = Awaited<ReturnType<typeof createContext>>;

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: realAppRouter,
      createContext,
    }),
  );

app.use('/api', webhook)

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
});

export default app;