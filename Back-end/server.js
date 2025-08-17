const mongoose = require('mongoose');
const http = require('http');
const { Router } = require('./router');
const today = require('./TaskModel');
const regular = require('./RegularModel');
require('dotenv').config();

const url = process.env.DATABASE_URL;
const router = new Router();

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }
  router.resolve(req, res);
});

async function main() {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    server.listen(8080, () => {});
  } catch (err) {
    console.error('DB connect error', err);
  }
}

/* ---------- newlist (Daily) ---------- */
router.put('/newlist', async ({ req, res }) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', async () => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      const { date, taskList } = JSON.parse(body);
      const existingTask = await today.findOne({ date });
      if (!existingTask) {
        const newTask = new today({ date, task: taskList });
        await newTask.save();
      } else {
        await today.updateOne({ date }, { task: taskList });
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Task inserted successfully' }));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }
  });
});

router.post('/newlistComplete', async ({ req, res }) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', async () => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      const { task, date } = JSON.parse(body);
      const existingTask = await today.findOne({ date });
      if (existingTask) {
        await today.updateOne(
          { date, 'task.name': task, 'task.completed': false },
          { $set: { 'task.$.completed': true } }
        );
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Task inserted successfully' }));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }
  });
});

router.get('/newlist', async ({ res }) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    const task = await today.find({});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(task));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
  }
});

router.delete('/newlist', async ({ req, res }) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', async () => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, OPTIONS, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      const { date, task } = JSON.parse(body);
      const existingTask = await today.findOne({ date });
      if (existingTask) {
        existingTask.task = existingTask.task.filter(item => item.name !== task);
        if (existingTask.task.length === 0) {
          await existingTask.deleteOne();
        } else {
          await existingTask.save();
        }
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Task deleted successfully' }));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

/* ---------- regular ---------- */
router.post('/regular', async ({ req, res }) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', async () => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    try {
      const { task } = JSON.parse(body);
      const exist = await regular.findOne({});
      if (exist) {
        const selected = exist.task.find(item => item.name === task);
        if (selected) {
          await regular.updateOne(
            { 'task.name': task, 'task.completed': false },
            { $set: { 'task.$.completed': true } }
          );
        }
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Task inserted successfully' }));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }
  });
});

router.put('/regular', async ({ req, res }) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', async () => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      const { regularTask } = JSON.parse(body);
      const { date, task } = regularTask[0];
      await regular.updateOne(
        { date },
        { $set: { task } },
        { upsert: true }
      );
      const latest = await regular.find({ date });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(latest));
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

router.get('/regular', async ({ res }) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    const data = await regular.find({});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
});

main();
