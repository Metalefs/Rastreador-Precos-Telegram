require("dotenv").config();
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';

export const launch = async () => {
  const browser = await puppeteer.launch({
    //executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true,
    args: [
      '--enable-features=NetworkService',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--shm-size=3gb', // this solves the issue
      '--no-sandbox',
      '--disable-gpu',
      '--no-zygote',
      '--single-process'
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


