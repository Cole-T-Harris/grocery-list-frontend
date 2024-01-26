import Ajv from 'ajv';
import * as locationsSchema from '../schemas/LocationsResponse.json';
import * as productsSchema from '../schemas/ProductsResponse.json'
import { LOG } from "./constants";

const SCHEMAS = {
    locations: locationsSchema,
    products: productsSchema
}

export async function sendGETAPIRequest(requestBody, serverUrl) {
    const response = await sendGETRequest(requestBody, serverUrl);
    if (isRequestNotSupported(requestBody)) {
        throw new Error(`sendAPIRequest() does not have support for type: ${requestBody.requestType}. Please add the schema to 'SCHEMAS'.`);
    }
    if (isJsonResponseValid(response, SCHEMAS[requestBody.requestType])) {
        return response;
    }
    LOG.error(`Server ${requestBody.requestType} response json is invalid. Check the Server.`);
    return null;
}

function isRequestNotSupported(requestBody){
    return (!Object.keys(SCHEMAS).includes(requestBody.requestType));
}

async function sendGETRequest(requestBody, serverUrl) {
    const fetchOptions = {
        method: "GET"
    };
    try {
        const response = await fetch(getRequestURL(requestBody, serverUrl), fetchOptions);
        if (response.ok) {
            return response.json();
        } else {
            LOG.error(`Request to server ${serverUrl} failed: ${response.status}: ${response.statusText}`);
        }

    } catch (err) {
        LOG.error(`Request to server failed : ${err}`);
    }

    return null;
}

export function getOriginalServerUrl() {
    if (process.env.NODE_ENV === 'development') {
      // Development environment
      return "http://localhost:8000";
    } else {
      // Production environment
      return "https://d3hkh53fn525s5.cloudfront.net";
    }
  }
  

export function isJsonResponseValid(object, schema) {
    if (object && schema) {
        const anotherJsonValidator = new Ajv();
        const validate = anotherJsonValidator.compile(schema);
        return validate(object);
    }
    LOG.error(`bad arguments - isJsonResponseValid(object: ${object}, schema: ${schema})`);
    return false;
}

function getRequestURL(requestBody, serverUrl) {
    // let requestURL = `${serverUrl}/api/${requestBody.requestType}/?`
    let requestURL = `${serverUrl}/${requestBody.requestType}/?`
    for (const filter of Object.keys(requestBody)) {
        if (filter !== "requestType") {
            requestURL += filter + "=" + requestBody[filter] + "&"
        }
    }
    return requestURL.substring(0, requestURL.length-1)
}