import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { nanoid } from 'nanoid';

let jobs = [
  { id: nanoid(), company: 'apple', position: 'front-end' },
  { id: nanoid(), company: 'google', position: 'back-end' },
];

const app = express();
import morgan from 'morgan';

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/', (req, res) => {
  res.json({ message: 'data received', data: { message: req.body } });
});

// Get All Jobs
app.get('/api/v1/jobs', (req, res) => {
  res.status(200).json({ jobs });
});

// Create a Job
app.post('/api/v1/jobs', (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    res.status(400).json({ msg: 'please enter company and position!' });
    return;
  }
  const id = nanoid(10);
  const job = { id, company, position };
  jobs.push(job);
  res.status(201).json({ job });
});

// Get One JOb
app.get('/api/v1/jobs/:id', (req, res) => {
  const { id } = req.params;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    res.status(404).json({ msg: `no job with this id ${id}` });
    return;
  }
  res.status(200).json({ job });
});

// Modify a JOb
app.patch('/api/v1/jobs/:id', (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    res.status(400).json({ msg: 'please enter company and position!' });
    return;
  }

  const { id } = req.params;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    res.status(404).json({ msg: `no job with this id ${id}` });
    return;
  }

  job.company = company;
  job.position = position;
  res.status(200).json({ msg: 'job modified', job });
});

const port = process.env.PORT || 5100;
app.listen(port, () => {
  console.log('Server Running...');
});
