import Extractor from './Extractor.js'

class Spiegel extends Extractor {
  constructor ({ user, password }) {
    super()

    this.user = user
    this.password = password
  }

  async connect (page) {
    await super.connect(page)

    await this.goto('https://www.spiegel.de/')

    await this.login()
    await this.accept()
  }

  async login () {
    const hasLogin = await this.page.evaluate(() => {
      return document.querySelectorAll('[data-logged-in-hidden]').length > 0
    })

    if (!hasLogin) {
      return
    }

    try {
      await this.page.evaluate(() => {
        document.querySelector('[data-logged-in-hidden]').click()
      })
    } catch (e) {}

    await this.page.waitForNavigation()

    await this.page.evaluate(() => {
      document.getElementById('loginname').value = 'thomas-bergwinkl@muehlhausen.org'
      document.getElementById('password').value = 'zQL2yd0cZ4WmlJy'
      document.getElementById('loginAutologin_input').checked = true
      document.getElementById('submit').click()
    })

    await this.page.waitForNavigation()
  }

  async accept () {
    const hasAccept = await this.page.evaluate(() => {
      return document.querySelectorAll('[title="SP Consent Message"]').length > 0
    })

    if (!hasAccept) {
      return
    }

    try {
      await this.page.evaluate(() => {
        const iframe = document.querySelector('[title="SP Consent Message"]')

        iframe.contentWindow.document.body.querySelector('.accept button').click()
      })
    } catch (e) {}

    await this.page.waitForNavigation()
  }

  async extract (url) {
    await this.goto(url)

    const title = await this.getAttribute('article', 'ariaLabel')
    const abstract = await this.getText('.leading-loose')
    const images = await this.getImageLinks('figure[data-component="Image"] img')
    const content = await this.getText('.RichText--iconLinks p', '\n')

    return {
      url,
      title,
      abstract,
      images,
      content
    }
  }
}

Spiegel.prototype.baseURL = 'https://www.spiegel.de/'

export default Spiegel
