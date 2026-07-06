import { chromium } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/home-light.png", fullPage: true });

await page.emulateMedia({ colorScheme: "dark" });
await page.screenshot({ path: "/tmp/home-dark.png", fullPage: true });

console.log("Console errors:", errors.length ? errors : "none");
await browser.close();
