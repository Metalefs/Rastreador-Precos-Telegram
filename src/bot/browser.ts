require("dotenv").config();
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';

export const launch = async () => {
  const browser = await puppeteer.launch({
    //executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true,
    timeout: 20000,
    ignoreHTTPSErrors: true,
    slowMo: 0,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
    ],

    //env: { LANGUAGE: 'pt-BR' },
  });
  return browser;
};
export async function CloseBrowserWithText(browser:Browser, text) {
  if (browser && browser.process() != null) browser.process().kill("SIGINT");
  return text;
}
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


