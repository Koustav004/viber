<<<<<<< HEAD
import { gemini, createAgent, createTool, createNetwork, type Tool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { PROMPT } from "@/prompt";
import { inngest } from "./client";
import { z } from "zod";
import  prisma  from "@/lib/db";
import { getSandbox, lastAssistantTextMessage } from "./utils";

interface AgentState {
  summary?: string;
  files: {[path: string]: string};
}
=======
import { z } from "zod";
import { Sandbox } from "@e2b/code-interpreter";
import { gemini, createAgent, createTool, createNetwork, type Tool, type Message, createState } from "@inngest/agent-kit";

import { prisma } from "@/lib/db";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";

import { inngest } from "./client";
import { SANDBOX_TIMEOUT } from "./types";
import { getSandbox, lastAssistantTextMessageContent, parseAgentOutput } from "./utils";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
};
>>>>>>> 7384eda (Final for production v.1.0.1)

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("viberv0-dev");
<<<<<<< HEAD
      return sandbox.sandboxId;
    });
    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description:"An expert coding agent",
      system: PROMPT,
      model: gemini({
        model: "gemini-2.5-flash-lite",
        apiKey: process.env.GEMINI_API_KEY,
=======
      await sandbox.setTimeout(SANDBOX_TIMEOUT);
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run("get-previous-messages", async () => {
      const formattedMessages: Message[] = [];

      const messages = await prisma.message.findMany({
        where: {
          projectId: event.data.projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

      for (const message of messages) {
        formattedMessages.push({
          type: "text",
          role: message.role === "ASSISTANT" ? "assistant" : "user",
          content: message.content,
        })
      }

      return formattedMessages.reverse();
    });

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      },
    );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: openai({ 
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
>>>>>>> 7384eda (Final for production v.1.0.1)
      }),
      tools: [
        createTool({
          name: "terminal",
<<<<<<< HEAD
          description: "use the terminal to run commands",
=======
          description: "Use the terminal to run commands",
>>>>>>> 7384eda (Final for production v.1.0.1)
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
<<<<<<< HEAD
                  },
=======
                  }
>>>>>>> 7384eda (Final for production v.1.0.1)
                });
                return result.stdout;
              } catch (e) {
                console.error(
<<<<<<< HEAD
                  `Command failed: ${e} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr}`,
                );
                return `Command failed: ${e} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr}`;
=======
                  `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`,
                );
                return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
>>>>>>> 7384eda (Final for production v.1.0.1)
              }
            });
          },
        }),
        createTool({
<<<<<<< HEAD
          name: "createOrUpdateFile",
          description:
            "create or update a file in the code interpreter sandbox",
=======
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
>>>>>>> 7384eda (Final for production v.1.0.1)
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
<<<<<<< HEAD
          handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
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
=======
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }

                return updatedFiles;
              } catch (e) {
                return "Error: " + e;
              }
            });

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          }
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
>>>>>>> 7384eda (Final for production v.1.0.1)
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
<<<<<<< HEAD
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
=======
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (e) {
                return "Error: " + e;
              }
            })
          },
        })
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

>>>>>>> 7384eda (Final for production v.1.0.1)
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
<<<<<<< HEAD
          return result;
        }
      }
    });
    const network = createNetwork<AgentState>({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      }
    })
    // const { output } = await codeAgent.run(`code: ${event.data.value}`);
    const result = await network.run(event.data.value);

    const summary = result.state.data.summary;
    const files = result.state.data.files || {};
    const errorMessage = "Something went wrong. Please try again later.";
    const isError = !summary || Object.keys(files).length === 0;
=======

          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({ 
        model: "gpt-4o",
      }),
    })

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "A response generator",
      system: RESPONSE_PROMPT,
      model: openai({ 
        model: "gpt-4o",
      }),
    });

    const { 
      output: fragmentTitleOuput
    } = await fragmentTitleGenerator.run(result.state.data.summary);
    const { 
      output: responseOutput
    } = await responseGenerator.run(result.state.data.summary);

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;
>>>>>>> 7384eda (Final for production v.1.0.1)

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
<<<<<<< HEAD
      return `http://${host}`;
    });
    
    await step.run("save-result", async() => {
      if(isError){
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: errorMessage,
=======
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again.",
>>>>>>> 7384eda (Final for production v.1.0.1)
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
<<<<<<< HEAD
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: summary,
=======

      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput),
>>>>>>> 7384eda (Final for production v.1.0.1)
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
<<<<<<< HEAD
            sandboxUrl: sandboxUrl,
            title: "Fragment",
            files: result.state.data.files
=======
              sandboxUrl: sandboxUrl,
              title: parseAgentOutput(fragmentTitleOuput),
              files: result.state.data.files,
>>>>>>> 7384eda (Final for production v.1.0.1)
            },
          },
        },
      })
<<<<<<< HEAD
    })


    return { 
        url : sandboxUrl,
        title: "Fragment",
        files: result.state.data.files,
        summary: result.state.data.summary,

      };
=======
    });

    return { 
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
>>>>>>> 7384eda (Final for production v.1.0.1)
  },
);
