require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 5000;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
app.listen(port, () => {
  /* eslint-disable no-console */

  // console.log(process.env);
  console.log(`!Listening: http://localhost:${port}`);
  //
  /* eslint-enable no-console */
});
