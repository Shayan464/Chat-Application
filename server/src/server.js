import express from 'express';
import { ENV } from './lib/env.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'path';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './lib/socket.js';

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: '10mb' })); //req.body
app.use(cookieParser()); //req.cookie
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const __dirname = path.resolve();

//make ready for deployment
if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

connectDB();
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
