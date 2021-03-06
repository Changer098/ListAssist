var osmosis = require('osmosis');

var scrapeAmazonItem = function (url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject('Url not defined');
    }
    let out = {}
    osmosis
      .get(url)
      .set({
        itemTitle: '#productTitle',
        // price: '#priceblock_ourprice',
        itemImg: '#landingImage@data-old-hires',
      })
      .data(item => {
        out = item;
      })
      .done(() => {
        console.log(out.obj);
        console.log(out);
        if (!out || !out.itemTitle) {
          reject('Item Not found');
        }
        if (out.price) 
          out.price = Number.parseFloat(out.price.substring(1));
        out.link = url;
        resolve(out);
      })
      .error(reject);
  })
}

// debug code
//scrapeAmazonItem('https://www.amazon.com/gp/product/B073ZK95P6').then(console.log);

module.exports = scrapeAmazonItem;