<<<<<<< HEAD
import { projectsRouter } from '@/modules/projects/server/procedures';
import { createTRPCRouter } from '../init';
import { messagesRouter } from '@/modules/messages/server/procedures';


export const appRouter = createTRPCRouter({

  messages: messagesRouter,
  projects: projectsRouter,
// fragments: fragmentsRouter
//   invoke: baseProcedure
//     .input(
//       z.object({
//         value: z.string(),
//       }),
//     )
//     .mutation(async ({ input }) => {
//       await inngest.send({
//         name: "test/hello.world",
//         data: {
//           value: input.value,
//         },
//       });
//       return { ok: "success" };
//     }),
//   createAI: baseProcedure
//     .input(
//       z.object({
//         text: z.string(),
//       }),
//     )
//     .query((opts) => {
//       return {
//         greeting: `hello ${opts.input.text}`,
//       };
//     }),
});
// // export type definition of API
export type AppRouter = typeof appRouter;
=======
import { usageRouter } from '@/modules/usage/server/procedures';
import { messagesRouter } from '@/modules/messages/server/procedures';
import { projectsRouter } from '@/modules/projects/server/procedures';

import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  usage: usageRouter,
  messages: messagesRouter,
  projects: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
>>>>>>> 7384eda (Final for production v.1.0.1)
