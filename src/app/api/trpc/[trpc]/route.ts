import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
<<<<<<< HEAD
  });// Export GET and POST handlers
=======
  });
>>>>>>> 7384eda (Final for production v.1.0.1)
export { handler as GET, handler as POST };
