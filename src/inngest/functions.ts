import { gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";


import { inngest } from "./client";
import { get } from "http";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("viberv0-dev");
      return sandbox.sandboxId;
    });
    const codeWriterAgent = createAgent({
  name: 'code-writer',
  system:
    'you write code snippets based on user requests. only respond with code snippets, no explanations.',
  model: gemini({
    model: "gemini-3-flash-preview",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});
const { output } = await codeWriterAgent.run(
  `code: ${event.data.value}`,
);

const sandboxUrl = await step.run("get-sandbox-url", async () => {
  const sandbox = await getSandbox(sandboxId);
  const host = sandbox.getHost(3000);
  return `http://${host}`;
});



    return {output, sandboxUrl};
  },
);