import Extractor from './Extractor.js'

class Heise extends Extractor {
  async extract (url) {
    await this.goto(url)

    const title = await this.getText('.a-article-header__title')
    const abstract = await this.getText('.a-article-header__lead')
    const images = (await this.getImageLinks('.article-image__gallery-container img'))
    const content = await this.getText('.article-content p', '\n')

    return {
      url,
      title,
      abstract,
      images,
      content
    }
  }
}

Heise.prototype.baseURL = 'https://www.heise.de/'

export default Heise
