import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const app = express()
app.use(express.json())
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'
app.use(cors({ origin: allowedOrigin === '*' ? '*' : allowedOrigin.split(',') }))

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Tools Claude can call to reconfigure the player's quests.
const tools = [
  {
    name: 'add_quest',
    description: 'Add a new daily/recurring quest for the player.',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        category: { type: 'string', enum: ['gym','looksmaxing','study','cardio','mind','custom'] },
        difficulty: { type: 'string', enum: ['Easy','Medium','Hard','Boss'] },
        days: { type: 'array', items: { type: 'string' }, description: "Subset of ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']; empty = every day" },
        timeStart: { type: 'string', description: 'HH:MM 24h, optional' },
        timeEnd: { type: 'string', description: 'HH:MM 24h, optional' }
      },
      required: ['title','category','difficulty']
    }
  },
  {
    name: 'edit_quest',
    description: 'Edit an existing quest by id.',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        patch: { type: 'object', description: 'Fields to change' }
      },
      required: ['id','patch']
    }
  },
  {
    name: 'delete_quest',
    description: 'Delete a quest by id.',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id']
    }
  }
]

app.post('/api/chat', async (req, res) => {
  try {
    const { history = [], questConfig } = req.body
    const system = `You are "The System" from Solo Leveling — a terse, motivating game interface that levels up the user's real life.
Speak in short, punchy lines. Use the player's current quest config below to give advice and, when the user asks to add/change/remove quests, CALL THE APPROPRIATE TOOL.
Current quest config (JSON):
${JSON.stringify(questConfig, null, 2)}`

    const messages = history.map(h => ({ role: h.role, content: h.content }))

    const resp = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system,
      tools,
      messages
    })

    const reply = resp.content.filter(b => b.type === 'text').map(b => b.text).join('\n')
    const toolCalls = resp.content
      .filter(b => b.type === 'tool_use')
      .map(b => ({ name: b.name, input: b.input }))

    res.json({ reply, toolCalls })
  } catch (err) {
    console.error(err)
    res.status(500).json({ reply: 'The System is unreachable. Check API key/connection.', toolCalls: [] })
  }
})

app.get('/health', (_, res) => res.send('ok'))

const PORT = process.env.PORT || 8787
app.listen(PORT, () => console.log(`SoloRise backend on :${PORT}`))
