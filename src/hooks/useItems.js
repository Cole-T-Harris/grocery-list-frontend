import { useEffect, useState } from "react";
import { getOriginalServerUrl, sendGETAPIRequest } from "../utils/restfulAPI";
import { ITEMS_LIMIT, LOG } from "../utils/constants";
import { Item } from "../models/item.model";

export function useItems(storeID, term, offset, searchForItems) {
    const [items, setItems] = useState([])
    const [totalResults, setTotalResults] = useState(0)
    const [loading, setLoading] = useState(false)
    const itemAPIInfo = {
        storeID, term, offset,
        items, setItems,
        totalResults, setTotalResults,
        loading, setLoading
    }
    useEffect(() => {
        makeItemAPIRequest(itemAPIInfo)
    }, [searchForItems])

    return {items, setItems, totalResults, loading}
}

async function makeItemAPIRequest(info) {
    const requestBody = { requestType: "products", 
                          locationId: info.storeID, 
                          term: info.term,
                          start: info.offset,
                          limit: ITEMS_LIMIT}
    info.setLoading(true)
    const itemsResponse = await sendGETAPIRequest(requestBody, getOriginalServerUrl())
    if (itemsResponse) {
        info.setItems(makeItemsList(itemsResponse))
        info.setTotalResults(itemsResponse.meta.pagination.total)
    }
    else {
        LOG.error(`Items request to ${getOriginalServerUrl()} failed. Check the log for more details.`, "error")
    }
    info.setLoading(false)
}

function makeItemsList(itemsResponse) {
    let items = [];
    for (let index in itemsResponse.products) {
        let item = itemsResponse.products[index]
        items.push(new Item(item))
    }
    return items
}