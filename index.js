import express from 'express';
import { chromium } from 'playwright';
import fs from 'fs/promises';

const app = express();
app.use(express.json({ limit: '5mb' }));

app.post('/scan', async (req, res) => {
  const { url } = req.body;
  console.log("Received scan request for:", url);

  if (!url) return res.status(400).json({ error: 'URL missing' });

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const axeScript = await fs.readFile('./node_modules/axe-core/axe.min.js', 'utf8');
    await page.addScriptTag({ content: axeScript });

    const results = await page.evaluate(async () => {
      return await axe.run();
    });

    await browser.close();
    res.json(results);
  } catch (error) {
    console.error("Error during scan:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Accessibility scanner running on port ${PORT}`));
