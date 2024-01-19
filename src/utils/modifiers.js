export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sortAndFormatGroceryList(groceryList) {
    const sortedGroceryList = groceryList.sort((a,b) => {
        if (a.aisleLocations[0].description.split(' ')[0] === 'AISLE' &&  b.aisleLocations[0].description.split(' ')[0] === 'AISLE') {
            return parseInt(a.aisleLocations[0].description.match(/\d+/)[0]) - parseInt(b.aisleLocations[0].description.match(/\d+/)[0])
        }
        if (a.aisleLocations[0].description < b.aisleLocations[0].description) return -1
        if (a.aisleLocations[0].description > b.aisleLocations[0].description) return 1
        return parseInt(a.aisleLocations[0].bayNumber) - parseInt(b.aisleLocations[0].bayNumber)
    })
    const today = new Date()
    let groceryListString = "Grocery List " + today.toDateString() + "\n"
    let previousSection = ""
    for (const item of sortedGroceryList) {
        if (item.aisleLocations[0]?.description !== previousSection) {
            groceryListString += "\n" + item.aisleLocations[0].description + ":\n"
        }
        let weight = ""
        if (item.priceSize === "WEIGHT") {
            weight += "lb"
        }
        const bay = item.aisleLocations[0].bayNumber ? "(Bay: " + item.aisleLocations[0].bayNumber + ")" : ""
        groceryListString += item.quantity + weight + " " + item.description + " " + bay + "\n"
        previousSection = item.aisleLocations[0].description
    }
    return groceryListString
}