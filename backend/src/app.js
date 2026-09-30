import express   from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import errorHandler from './middleware/error.middleware.js'
import authRoutes from './routes/auth.Routes.js'
import {connectDB} from './config/db.js'



const app = express()
app.use(cors({
    origin :process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials : true
}))
connectDB()
app.use(express.json())
app.use(cookieparser())


// Routes 
app.use('/api/auth/', authRoutes)

// Global - Error Handler 
app.use(errorHandler)
export default app