export class Location {
    constructor(locationObj) {
        this.locationID = locationObj.locationId
        this.chain = locationObj.chain
        this.name = locationObj.name
        this.streetAddress = locationObj.address.addressLine1
        this.city = locationObj.address.city
        this.state = locationObj.address.state
        this.zipcode = locationObj.address.zipCode
        this.county = locationObj.address.county
        this.thumbnail = locationObj.thumbnail
        this.latitude = locationObj.geolocation.latitude
        this.longitude = locationObj.geolocation.longitude
        this.hours = locationObj.hours
        this.distance = locationObj.distance
    }
}