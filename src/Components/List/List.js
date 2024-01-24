import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import { Fab } from 'react-tiny-fab'
import ItemSearchModal, { ItemAdditionButton, ItemDisplayPrice } from './ItemSearchModal'
import {FaChevronDown, FaChevronUp, FaCopy, FaSearchPlus, FaShare, FaTrashAlt} from "react-icons/fa"
import { FAB_STYLING, ACCENT_COLOR } from '../../utils/constants'
import EmptyListIcon from '../../static/images/empty_data_icon.svg'
import Table from 'react-bootstrap/esm/Table'
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/esm/Col'
import Collapse from 'react-bootstrap/esm/Collapse'
import Carousel from 'react-bootstrap/Carousel';
import { sortAndFormatGroceryList } from '../../utils/modifiers'

export default function List(props) {
  if (props.storeID) {
    return (
      <>
        <GroceryListPlanner {...props}/>
        <Fab
          mainButtonStyles={FAB_STYLING}
          icon={<FaSearchPlus/>}
          text='Add Item'
          onClick={() => props.setShowItemSearch(true)}
        >
        </Fab>
      </>
    )
  }
  return (
    <div className='store-search-page'>
      Store must be selected before building a grocery list.
      <br></br>
      <Button 
        variant = "light"
        onClick={() => props.setShowList(!props.showList)}
      >
        Select Store
      </Button>
    </div>
  )
}

function GroceryListPlanner(props) {
  return (
    <div className='store-search-page'>
      {props.groceryList.length > 0 ? 
        <GroceryListShareCopyButtons {...props}/> :
        <></>}
      <GroceryListTable {...props}/>
      <ItemSearchModal {...props}/>
      <Row>
        <GroceryListSubTotal groceryList={props.groceryList}/>
      </Row>
    </div>
  )
}

function GroceryListShareCopyButtons(props) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Share via',
          text: sortAndFormatGroceryList(props.groceryList),
        });
      } else {
        // Fallback code for browsers that don't support Web Share API
        // You can provide alternative sharing options here.
        console.log('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  const copyTextToClipboard = () => {
    const textToCopy = sortAndFormatGroceryList(props.groceryList)
    navigator.clipboard.writeText(textToCopy)
      .catch((err) => {
        console.error('Unable to copy text: ', err);
      });
  };
  return (
    <div className='share-buttons-styling'>
      <Row>
        <Col>
          <div className='circular-icon' style={{marginRight: "20px"}}>
            <FaCopy className='share-button' onClick={() => copyTextToClipboard()} size={"1.5em"}/>
          </div>
          <div className='circular-icon'>
            <FaShare className='share-button' onClick={() => handleShare()} size={"1.5em"}/>
          </div>
        </Col>
      </Row>
    </div>
  )
}

function GroceryListTable(props) {
  if (props.groceryList.length === 0) {
    return (
      <div>
        <h2>Grocery List is Empty</h2>
        <p>To add items to list, select the <FaSearchPlus style={{color: ACCENT_COLOR}}/> button</p>
        <img src={EmptyListIcon} alt=''/>
      </div>
    )
  }
  return (
    <Table className='rounded-table'>
      <GroceryListTableHeader/>
      <tbody>
        {props.groceryList.map((product) => (
          <GroceryListTableRow key={product.productId} product={product} groceryList={props.groceryList} setGroceryList={props.setGroceryList} />
        ))}
      </tbody>
    </Table>
  )
}

function GroceryListTableHeader() {
  return (
    <thead className='grocery-list-header'>
      <tr>
        <th>
          <strong>Qty</strong>
        </th>
        <th>
          <strong>Item</strong>
        </th>
        <th>
        </th>
        <th>
          <strong>Price</strong>
        </th>
        <th>
        </th>
      </tr>
    </thead>
  )
}

function GroceryListTableRow(props) {
  const handleDelete = () => {
    const filteredList = props.groceryList.filter(
      (item) => item.productId !== props.product.productId
    );
    props.setGroceryList(filteredList)
  }
  const [toggleRow, setToggleRow] = useState(false)
  const toggleRowId = props.product.productId
  return (
    <>
      <tr className='table-spacer'><td className='non-hoverable-row'></td></tr>
      <tr className='hoverable-row' onClick={() => setToggleRow(!toggleRow)}>
        <td style={{borderTopLeftRadius: "10px"}}>
          <ItemAdditionButton product={props.product} groceryList={props.groceryList} setGroceryList={props.setGroceryList}/>
        </td>
        <td>
          <Image src={props.product?.thumbnail} className="product-thumbnail-size"/>
        </td>
        <td style={{width: "100%"}}>
          {props.product?.description}
        </td>
        <td>
          <ItemDisplayPrice price={props.product?.price} promo={props.product?.promo} priceSize={props.product?.priceSize}/>
        </td>
        <td style={{textAlign: "right", borderTopRightRadius: "10px"}}>
          {toggleRow ? 
            <FaChevronUp onClick={() => setToggleRow(!toggleRow)} aria-controls={toggleRowId}/> :
            <FaChevronDown onClick={() => setToggleRow(!toggleRow)} aria-controls={toggleRowId}/>
          }
        </td>
      </tr>
      <GroceryListTableRowAdditionalInformation {...props} toggleRow={toggleRow} toggleRowId={toggleRowId} handleDelete={handleDelete}/>
    </>
  )
}

function GroceryListTableRowAdditionalInformation(props) {
  return (
    <tr>
      <td colSpan={5} style={{borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px"}}>
        <Collapse in={props.toggleRow}> 
          <div id={props.toggleRowId} >
            <Row>
              <Col sm={12} md={4}>
                <div className='grocery-list-additional-background-left'>
                  <GroceryListImageCarousel {...props}/>
                </div>
              </Col>
              <Col sm={12} md={8}>
                <div className='grocery-list-additional-background-right'>
                  <strong>Brand</strong>
                  <p>{props.product.brand}</p>
                </div>
                <div className='grocery-list-additional-background-right'>
                  <strong>Origin</strong>
                  <p>{props.product.countryOfOrigin}</p>
                </div>
                <div className='grocery-list-additional-background-right'>
                  <strong>Size</strong>
                  <p>{props.product.size}</p>
                </div>
                <div className='grocery-list-additional-background-right'>
                  <strong>Store Location</strong>
                  <GroceryListAisleInformation {...props}/>
                </div>
              </Col>
            </Row>
            <Row>
              <div style={{textAlign: "right"}}>
                <Button variant='warning' onClick={() => {props.handleDelete()}}>
                  <p><FaTrashAlt/> Remove Item</p>
                </Button>
              </div>
            </Row>
          </div>
        </Collapse>
      </td>
    </tr>
  )
}

function GroceryListAisleInformation(props) {
  if (props.product.aisleLocations.length >= 1) {
    return (
      props.product.aisleLocations.map((location) => (
        <div key={`${JSON.stringify(location)}`}>
          <>{location?.description} {location.bayNumber ? `Bay: ${location.bayNumber}` : ""}</>
        </div>
      ))
    )
  }
  return null
}

function GroceryListImageCarousel(props) {
  const images = [props.product.frontImage, 
    props.product.backImage, 
    props.product.rightImage, 
    props.product.leftImage].filter(image => image !== "")
  return (
    <Carousel>
      {images.map((image, index) => (
        <Carousel.Item key={`${props.product.productId}-${image}`}>
          <Image src={image}/>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

function GroceryListSubTotal(props) {
  const initialSum = 0
  const subTotal = props.groceryList.reduce((accumulator, currentProduct) => {
    if (currentProduct.promo > 0)
      return accumulator + currentProduct.promo * currentProduct.quantity
    if (currentProduct.price > 0)
      return accumulator + currentProduct.price * currentProduct.quantity
    return accumulator
  }, initialSum)
  return (
    <h3 style={{textAlign: "right"}}>
      Subtotal ${subTotal.toFixed(2)}
    </h3>
  )
}