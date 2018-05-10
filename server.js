'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(require('fs').writeFile);
const readFile = util.promisify(require('fs').readFile);
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(cors());
app.use(bodyParser.raw({ type: 'audio/*' , limit: '100mb'}));
app.post('/', async (req, res) => {
  console.log('process!');
  let base64Pre = req.body.toString('ascii');
  await writeFile('data/stereo.opus', Buffer.from(base64Pre,'base64'),{encoding: 'binary'});
  const { stdout }  = await exec('bin/ffmpeg/ffmpeg -y -i data/stereo.opus -acodec libopus -mode mono -ac 1 data/mono.opus');
  const post = await readFile('data/mono.opus');

  res.send(post.toString('base64'));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
