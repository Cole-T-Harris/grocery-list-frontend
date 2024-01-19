export class Item {
    constructor(itemObj) {
        this.productId = itemObj.productId
        this.aisleLocations = itemObj.aisleLocations
        this.brand = itemObj.brand
        this.countryOfOrigin = itemObj.countryOfOrigin
        this.description = itemObj.description
        this.thumbnail = itemObj.images.thumbnail
        this.frontImage = itemObj.images.frontImage
        this.backImage = itemObj.images.backImage
        this.rightImage = itemObj.images.rightImage
        this.leftImage = itemObj.images.leftImage
        this.stock = itemObj.stock
        this.price = itemObj.prices.price
        this.promo = itemObj.prices.promo
        this.size = itemObj.size
        this.priceSize = itemObj.priceSize
        this.quantity = 0
    }
} 