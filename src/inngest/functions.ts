import { gemini, createAgent } from "@inngest/agent-kit";


import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const codeWriterAgent = createAgent({
  name: 'summarizer',
  system:
    'You are a expert summarizer. you take long text and summarize it in a 1 sentence.',
  model: gemini({
    model: "gemini-3-flash-preview",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});
const { output } = await codeWriterAgent.run(
  `summarize the following text in a concise manner: ${event.data.value}`,
);

    return {output};
  },
);