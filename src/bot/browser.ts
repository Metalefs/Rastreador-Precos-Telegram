require("dotenv").config();
import * as puppeteer from 'puppeteer';

export const launch = async () => {
  const browser = await puppeteer.launch({
    //executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true,
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--lang=pt-BR,pt'
    ],
    //env: { LANGUAGE: 'pt-BR' },
  });
  return browser;
};
export const navigate = async (url) => {
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto(url);
  return [page, browser];
};
export const takeScreenshotFromHtml = async (html) => {
  const browser = await launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const content = await page.$('body');
  const imageBuffer = await content!.screenshot({ omitBackground: true });

  await page.close();
  await browser.close();
  return imageBuffer;
};
export const takeScreenshotFromUrl = async (url) => {
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto(url);

  const content = await page.$('body');
  const imageBuffer = await content!.screenshot({ omitBackground: true });

  await page.close();
  await browser.close();
  return imageBuffer;
};


