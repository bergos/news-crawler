import puppeteer from 'puppeteer'

class Crawler {
  constructor ({ extractors = [], headless = true } = {}) {
    this.extractors = extractors
    this.headless = headless
  }

  async start () {
    this.browser = await puppeteer.launch({
      args: ['--disable-web-security'],
      headless: this.headless
    })

    this.page = await this.browser.newPage()

    for (const extractor of this.extractors) {
      await extractor.connect(this.page)
    }
  }

  async stop () {
    if (this.browser) {
      await this.browser.close()
    }

    this.browser = null
    this.page = null
  }

  async extract (url) {
    for (const extractor of this.extractors) {
      if (await extractor.supports(url)) {
        return extractor.extract(url)
      }
    }
  }
}

export default Crawler
