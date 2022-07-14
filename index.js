// Set up the page with Puppeteer and FS
const puppeteer = require("puppeteer")
const fs = require("fs/promises")
const { format } = require("path")

// Main function of scrapper. Can set this on a timer. 
async function start() {
  const browser = await puppeteer.launch({
    args: [
      "--window-size=1920, 1080"
    ],
    headless: true, ignoreHTTPErrors: true, defaultViewport: null
  })

  const page = await browser.newPage()
  //Change this to set the website you want to scrape.
  await page.goto("https://news.ycombinator.com/", {waitUnil: 'networkidle2', timeout:60000})
  await page.emulateMediaFeatures('screen')

  //Save a pdf of the full website.
  await page.pdf({path: 'fullpage.pdf', width: 1920, height: 1080, printBackground: true})

  //Use this to pull text from a division and add it to a text file. Change the .title section to the desired webpage div id.
  const divtext = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".title")).map(x => x.textContent)
  })
  await fs.writeFile("text.txt", divtext.join("\r\n"))

  //Close browser when commands are done.
  await browser.close()
}

start()

//setInterval(start, 5000) -- Use this if you want to run function on a timer.