class Extractor {
  async connect (page) {
    this.page = page
  }

  async supports (url) {
    return url.startsWith(this.baseURL)
  }

  async extract (url) {}

  async getAttribute (selector, attribute, separator = '') {
    return this.page.evaluate((selector, attribute, separator) => {
      return [...document.querySelectorAll(selector)].map(e => e[attribute].trim()).join(separator)
    }, selector, attribute, separator)
  }

  async getImageLinks (selector) {
    return this.page.evaluate(selector => {
      return [...document.querySelectorAll(selector)].map(e => e.src)
    }, selector)
  }

  async getText (selector, separator = '') {
    return this.page.evaluate((selector, separator) => {
      return [...document.querySelectorAll(selector)].map(e => e.innerText.trim()).join(separator)
    }, selector, separator)
  }

  async goto (url, options) {
    return this.page.goto(url, { waitUntil: 'domcontentloaded', ...options })
  }
}

export default Extractor
