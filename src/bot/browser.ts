require("dotenv").config();

import * as puppeteer from 'puppeteer';

export const launch = async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true,
    args: [
      // Required for Docker version of Puppeteer
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      "--disable-dev-shm-usage",
    ],
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
  let page = await browser.newPage();
  
  await page.setContent(html);

  const content = await page.$("body");
  const imageBuffer = await content!.screenshot({ omitBackground: true });

  await page.close();
  await browser.close();
  return imageBuffer;
};

