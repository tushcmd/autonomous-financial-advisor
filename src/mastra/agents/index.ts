import { Agent } from '@mastra/core'
import { z } from 'zod'

export const helloAgent = new Agent({
  name: 'hello-agent',
  description: 'Returns a greeting.',
  inputSchema: z.object({
    name: z.string().describe('The name of the person to greet'),
  }),
  async run({ input }) {
    return `Hello, ${input.name}! 👋`
  },
})
