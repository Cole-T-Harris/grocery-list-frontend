import { useEffect, useState } from "react";
import { getOriginalServerUrl, sendGETAPIRequest } from "../utils/restfulAPI";
import { ITEMS_LIMIT, LOG } from "../utils/constants";
import { Item } from "../models/item.model";

export function useItems(storeID, term, offset, searchForItems) {
    const [items, setItems] = useState([])
    const [totalResults, setTotalResults] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [previousSearch, setPreviousSearch] = useState("")
    const [previousOffset, setPreviousOffset] = useState(-1)
    const itemAPIInfo = {
        storeID, term, offset,
        items, setItems,
        totalResults, setTotalResults,
        loading, setLoading,
        previousSearch, setPreviousSearch,
        error, setError
    }
    useEffect(() => {
        if (term.length > 0 && offset !== previousOffset) {
            setPreviousOffset(offset)
            makeItemAPIRequest(itemAPIInfo)
        }
    }, [searchForItems])

    return {items, setItems, totalResults, loading, error}
}

async function makeItemAPIRequest(info) {
    const requestBody = { requestType: "products", 
                          locationId: info.storeID, 
                          term: info.term,
                          start: info.offset,
                          limit: ITEMS_LIMIT}
    info.setLoading(true)
    info.setError(false)
    const itemsResponse = await sendGETAPIRequest(requestBody, getOriginalServerUrl())
    if (itemsResponse) {
        info.setItems(makeItemsList(itemsResponse, info.items, info.term, info.previousSearch))
        info.setTotalResults(itemsResponse.meta.pagination.total)
        info.setPreviousSearch(info.term)
    }
    else {
        info.setError(true)
        info.setLoading(false)
        LOG.error(`Items request to ${getOriginalServerUrl()} failed. Check the log for more details.`, "error")
    }
    info.setLoading(false)
}

function makeItemsList(itemsResponse, currentItemsList, term, previousSearch) {
    let items = [];
    if (term === previousSearch) {
        items = currentItemsList
    }
    for (let index in itemsResponse.products) {
        let item = itemsResponse.products[index]
        items.push(new Item(item))
    }
    return items
}