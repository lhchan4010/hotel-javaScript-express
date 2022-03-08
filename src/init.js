import app from './server';
import './db';

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`✅Server listening on http://localhost:${PORT}`);
});
