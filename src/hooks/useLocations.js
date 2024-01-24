import { useEffect, useState } from "react";
import { getOriginalServerUrl, sendGETAPIRequest } from "../utils/restfulAPI";
import { LOCATIONS_LIMIT, LOG, ZIPCODE_REGEX } from "../utils/constants";
import { Location } from "../models/location.model";
import { getByZipCode } from "zips"

export function useLocations(zipCode, radiusInMiles, tryAgain) {
    const [locations, setLocations] = useState([])
    const [distances, setDistances] = useState([])
    const [invalidZipCode, setInvalidZipCode] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const storeAPIInfo = {
        zipCode, radiusInMiles,
        stores: locations, setLocations: setLocations,
        distances, setDistances,
        loading, setLoading,
        error, setError
    }
    useEffect(() => {
        if (isValidZipCode(zipCode)) {
            setInvalidZipCode(false)
            makeStoreAPIRequest(storeAPIInfo)
        }
        else {
            setInvalidZipCode(zipCode.length >= 5)
            setLocations([])
        }
    }, [zipCode, radiusInMiles, tryAgain])

    return {locations: locations, setLocations: setLocations, invalidZipCode: invalidZipCode, distances: distances, loading: loading, error:error}
}

async function makeStoreAPIRequest(info) {
    const requestBody = { requestType: "locations", 
                          zipcode: info.zipCode, 
                          radiusInMiles: info.radiusInMiles,
                          limit: LOCATIONS_LIMIT}
    info.setLoading(true)
    info.setError(false)
    const locationsResponse = await sendGETAPIRequest(requestBody, getOriginalServerUrl())
    if (locationsResponse) {
        info.setLocations(makeLocationsList(locationsResponse))
        info.setDistances(locationsResponse.distances)
    }
    else {
        info.setError(true)
        info.setLoading(false)
        LOG.error(`Locations request to ${getOriginalServerUrl()} failed. Check the log for more details.`, "error")
    }
    info.setLoading(false)
}

function makeLocationsList(locationsResponse) {
    let locations = [];
    for (let index in locationsResponse.stores) {
        let location = locationsResponse.stores[index]
        locations.push(new Location(location))
    }
    return locations
}

function isValidZipCode(zipCode) {
    const zipCodeObject = getByZipCode(zipCode)
    return !!(ZIPCODE_REGEX.test(zipCode) && zipCodeObject);
}