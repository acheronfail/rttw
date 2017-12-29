const express = require('express');

const app = express();
app.set('port', process.env.PORT || 3001);

app.get('/api/test', (req, res) => {
  return res.json({ hello: 'world' });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
