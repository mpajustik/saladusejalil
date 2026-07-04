import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { gamesRouter } from './routes/games.js'
import { casesRouter } from './routes/cases.js'
import { initSocket } from './socket.js'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001

// Lubatud päritolu: env muutujast või localhost arenduseks
const ALLOWED_ORIGINS = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173']

app.use(cors({ origin: ALLOWED_ORIGINS }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Saladuse Jälil backend töötab.' })
})

app.use('/api/games', gamesRouter)
app.use('/api/cases', casesRouter)

const httpServer = createServer(app)
initSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`Backend käivitus pordil ${PORT}`)
})
