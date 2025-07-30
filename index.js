import express from 'express';
import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend

app.post('/scan', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL missing' });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const axeScript = await fs.readFile('./node_modules/axe-core/axe.min.js', 'utf8');
  await page.addScriptTag({ content: axeScript });

  const results = await page.evaluate(async () => await axe.run());
  await browser.close();

  res.json(results);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🟢 Scanner running on http://localhost:${PORT}`));
