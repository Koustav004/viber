import { gemini, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { PROMPT } from "@/prompt";
import { inngest } from "./client";
import { z } from "zod";
import { getSandbox, lastAssistantTextMessage } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("viberv0-dev");
      return sandbox.sandboxId;
    });
    const codeAgent = createAgent({
      name: "code-agent",
      description:"An expert coding agent",
      system: PROMPT,
      model: gemini({
        model: "gemini-2.5-flash-lite",
        apiKey: process.env.GEMINI_API_KEY,
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Command failed: ${e} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr}`,
                );
                return `Command failed: ${e} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFile",
          description:
            "create or update a file in the code interpreter sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async ({ files }, { step, network }) => {
            const newfiles = await step?.run(
              "create-or-update-file",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                } catch (e) {
                  return { error: `Failed to create or update files: ${e}` };
                }
              },
            );
            if (typeof newfiles === "object") {
              network.state.data.files = newfiles;
            }
          },
        }),
        createTool({
          name: "readFile",
          description: "read a file from the code interpreter sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFile", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files){
                  const content = await sandbox.files.read(file);
                  contents.push({path: file, content});
                }
                return JSON.stringify(contents);
              } catch (e) {
                return `Failed to read file: ${e}`;
              }
            });
          },
        })
      ],
      lifecycle:{
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = lastAssistantTextMessage(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.task_summary = lastAssistantMessageText;
            }
          }
          return result;
        }
      }
    });
    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      router: async ({ network }) => {
        const taskSummary = network.state.data.task_summary;
        if (taskSummary) {
          return;
        }
        return codeAgent;
      }
    })
    // const { output } = await codeAgent.run(`code: ${event.data.value}`);
    const result = await network.run(event.data.value);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    return { 
        url : sandboxUrl,
        title: "Project Sandbox",
        files: result.state.data.files,
        summary: result.state.data.task_summary,

      };
  },
);
