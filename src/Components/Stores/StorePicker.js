import React, { useState } from 'react'
import Collapse from 'react-bootstrap/Collapse'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import InputGroup from 'react-bootstrap/InputGroup'
import Table from 'react-bootstrap/Table'
import { useLocations } from '../../hooks/useLocations'
import { Map, Marker } from "pigeon-maps"
import { capitalizeFirstLetter } from '../../utils/modifiers'
import NoLocation from '../../static/images/location_not_found.svg'
import { Loading } from '../../utils/constants'

export default function StorePicker(props) {
  const [zipCode, setZipCode] = useState("")
  const [radius, setRadius] = useState(50)
  const {locations, setLocations, invalidZipCode, distances, loading} = useLocations(zipCode, radius)
  const locationProps = {
    zipCode, setZipCode,
    radius, setRadius,
    locations, setLocations,
    invalidZipCode,
    storeID: props.storeID, setStoreID: props.setStoreID,
    storeName: props.storeName, setStoreName: props.setStoreName,
    showList: props.showList, setShowList: props.setShowList,
    groceryList: props.groceryList, setGroceryList: props.setGroceryList,
    distances,
    loading
  }
  return (
    <div className='store-search-page'>
      <StoreFinderForm {...locationProps}/>
      <StoreResultsTable {...locationProps}/>
    </div>
)}

function StoreFinderForm(props) {
  return (
    <div className="store-element-width store-input-style">
      <InputGroup hasValidation>
        <Form.Control 
          type="search"
          placeholder='Enter your zipcode'
          value={props.zipCode}
          onChange={(input) => props.setZipCode(input.target.value)}
          isInvalid={props.invalidZipCode}
        >
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          Please enter a valid 5 digit zipcode.
        </Form.Control.Feedback>
      </InputGroup>
      <StoreRadiusFilter {...props}/>
    </div>
  )
}

function StoreRadiusFilter(props) {
  const dropDownLabel = props.radius + "miles"
  const handleSelect = (eventKey) => {
    props.setRadius(eventKey)
  }
  return (
    <>
      Seach Within
        <DropdownButton
        variant="light"
        title={dropDownLabel}
        size="sm"
        onSelect={handleSelect}
      >
        <Dropdown.Item eventKey={5}>5 miles</Dropdown.Item>
        <Dropdown.Item eventKey={10}>10 miles</Dropdown.Item>
        <Dropdown.Item eventKey={15}>15 miles</Dropdown.Item>
        <Dropdown.Item eventKey={25}>25 miles</Dropdown.Item>
        <Dropdown.Item eventKey={50}>50 miles</Dropdown.Item>
      </DropdownButton>
    </>
  )
}

function StoreResultsTable(props) {
  if (props.loading) {
    return (
      <Loading/>
    )
  }
  if (!props.loading && !props.invalidZipCode && props.locations.length === 0 && props.zipCode.length === 5) {
    return (
      <div className='store-element-width no-locations-result'>
        <h2>No locations found.</h2>
        <p>Try increasing radius or searching a different zipcode.</p>
        <img src={NoLocation}/>
      </div>
    )
  }
  return (
    <div className='store-element-width store-table-styling'>
      <Table responsive hover className='stores-table'>
        <tbody>
          {props.locations.map((location, index) => (
            <StoreResultsRow
              {...props}
              key = {`table-${JSON.stringify(location)}`}
              location = {location}
              index = {index}
              distance = {props.distances[index]}
            />
          ))}
        </tbody>
      </Table>
    </div>
  )
}

function changingStoreWarning() {
  const userConfirmed =  window.confirm("Changing the store will result in the loss of your grocery list. Do you wish to continue?");
  return userConfirmed
}

function StoreResultsRow(props) {
  const [toggleRow, setToggleRow] = useState(false)
  const handleLocationSelect = (location) => {
    if (!props.storeID) {
      props.setStoreID(location.locationID)
      props.setStoreName(location.name)
      props.setShowList(!props.showList)
    }
    else if (changingStoreWarning()) {
      props.setStoreID(location.locationID)
      props.setStoreName(location.name)
      props.setShowList(!props.showList)
      props.setGroceryList([])
    }
  }
  return (
    <>
      <tr className='table-spacer'><td className='non-hoverable-row'></td></tr>
      <tr className='table-store-data hoverable-row'>
        <td>
          <Table className='stores-row-table'>
            <tbody>
              <tr>
                <td>
                  <img src={props.location.thumbnail}/> <strong>{props.location.name}</strong>
                  <div>
                    {props.distance.toFixed(2)} miles
                  </div>
                </td>
                <td className='store-right-column'>
                  <Button variant='light' onClick={() => handleLocationSelect(props.location)}>Shop Here</Button>
                  <Button variant='link' size="sm" onClick={() => setToggleRow(!toggleRow)}>Store Details</Button>
                </td>
              </tr>
              <StoreAdditionalInformation {...props} toggleRow={toggleRow}/>
            </tbody>
          </Table>
        </td>
      </tr>
    </>
  )
}

function StoreAdditionalInformation(props) {
  return (
    <tr>
      <td colSpan={2}>
        <Collapse in={props.toggleRow}>
          <div>
            <StoreLocation {...props}/>
            <strong>{props.location.streetAddress}</strong>
            <div>
              {props.location.city}, {props.location.state} {props.location.zipcode}
            </div>
            <StoreHours {...props}/>
          </div>
        </Collapse>
      </td>
    </tr>
  )
}

function StoreLocation(props) {
  const position = [props.location.latitude, props.location.longitude]
  return (
    <Map height={175} defaultCenter={position} defaultZoom={15}>
        <Marker width={28} anchor={position} />
    </Map>
  )
}

function StoreHours(props) {
  const hours = props.location.hours
  const dateList = []
  for (const day in hours) {
    const openTime = convert24HrTo12HrTime(hours[day].open)
    const closeTime = convert24HrTo12HrTime(hours[day].close)
    const hoursDetails = (openTime === closeTime) ? "Open 24 Hours" : `${openTime} - ${closeTime}`
    dateList.push(
      <>
        <td className='store-hours-table-td'>{capitalizeFirstLetter(day)}</td> 
        <td className='store-hours-table-td'>{hoursDetails}</td>
      </>
    )
  }
  return (
    <Table className='stores-row-table'>
      <tbody>
      {dateList.map((weekdayHours, index) =>
        <tr key={`${props.location.name}-hours-${index}`}>
          {weekdayHours}
        </tr>
      )}
      </tbody>
    </Table>
  )
}

function convert24HrTo12HrTime(time) {
  const timeString12hr = new Date('1970-01-01T' + time + 'Z')
  .toLocaleTimeString('en-US',
    {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
  );
  return timeString12hr
}