import { serve } from "inngest/next";
<<<<<<< HEAD
=======

>>>>>>> 7384eda (Final for production v.1.0.1)
import { inngest } from "@/inngest/client";
import { codeAgentFunction } from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
<<<<<<< HEAD
    /* your functions will be passed here later! */
    codeAgentFunction,
  ],
});
=======
    codeAgentFunction,
  ],
});
>>>>>>> 7384eda (Final for production v.1.0.1)
