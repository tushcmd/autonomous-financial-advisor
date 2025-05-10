
import { Mastra } from '@mastra/core';
import { helloAgent } from './agents'

export const mastra = new Mastra({
    agents: [helloAgent],
})
        
