// ATHENA RENDERING ENGINE V1.2
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '10mb' }));
app.get('/', (req, res) => { res.send('ATHENA ENGINE (CODESPACES): Online.'); });
app.post('/render', async (req, res) => {
  const { html } = req.body;
  if (!html) { return res.status(400).send('Bad Request'); }
  let browser = null;
  try {
    browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) { console.error('RENDER FAILURE:', error); res.status(500).send('Error');
  } finally { if (browser) await browser.close(); }
});
app.listen(PORT, () => { console.log(`ATHENA ENGINE is online on port ${PORT}`); });
