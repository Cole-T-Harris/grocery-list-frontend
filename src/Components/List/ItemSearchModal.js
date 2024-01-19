import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/esm/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { useItems } from "../../hooks/useItems";
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import { Loading } from '../../utils/constants'
import { FaPlus, FaMinus } from "react-icons/fa"

export default function ItemSearchModal(props) {
    const handleClose = () => props.setShowItemSearch(false)
    const [searchPressed, setSearchPressed] = useState(false)
    const [itemSearchTerm, setItemSearchTerm] = useState("")
    const itemsResponse = useItems(props.storeID, itemSearchTerm, 0, searchPressed)
    return (
        <Modal 
            show={props.showItemSearch}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                Search Items @ {props.storeName}
            </Modal.Header>
            <Modal.Body>
                <GroceryListSearch term={itemSearchTerm} setTerm={setItemSearchTerm} searchPressed={searchPressed} setSearchPressed={setSearchPressed} />
                <ItemSearchResultsTable {...itemsResponse} {...props} searchPressed={searchPressed} setSearchPressed={setSearchPressed}/>
            </Modal.Body>
            <Modal.Footer>
                <Button
                className="grocery-item-search-button"
                onClick={() => setSearchPressed(!searchPressed)}
                >
                    Search
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function GroceryListSearch(props) {
    const handleEnterPress = (e) => {
      if (e.key === 'Enter') {
        props.setSearchPressed(!props.searchPressed)
      }
    }
    return (
        <InputGroup>
            <Form.Control
            placeholder='Search For Items'
            onChange={(e) => props.setTerm(e.target.value)}
            onKeyDown={(e) => handleEnterPress(e)}
            value={props.itemSearchTerm}
            />
        </InputGroup>
    )
}

function ItemSearchResultsTable(props) {
    if (props.loading) {
        return (
            <Loading/>
        )
    }
    if (props.error) {
      return (
        <div className='no-locations-result'>
          <p>Error Obtaining search results from server.<Button variant='link' size="sm" onClick={() => props.setSearchPressed(!props.searchPressed)}> Try Again</Button></p>
        </div>
      )
    }
    if (props.items)
    return(
        <Table striped>
            <thead></thead>
            <tbody>
                {props.items.map((product, index) => (
                    <ItemSearchResultsTableRow
                        product={product}
                        groceryList={props.groceryList}
                        setGroceryList={props.setGroceryList}
                        key={`${product.productId}`}
                    />
                ))}
            </tbody>
        </Table>
    )
}

function ItemSearchResultsTableRow(props) {
    const product = props.product
    return (
        <tr>
            <td>
                <ItemAdditionButton product={product} groceryList={props.groceryList} setGroceryList={props.setGroceryList}/>
                <ItemStockLevel stock={product.stock}/>
            </td>
            <td>
                <Image src={product?.thumbnail} className="product-thumbnail-size"/>
            </td>
            <td>
                {product?.description}
            </td>
            <td>
                <ItemDisplayPrice price={product.price} promo={product.promo} priceSize={product.priceSize}/>
            </td>
        </tr>
    )
}

export function ItemDisplayPrice(props) {
    let priceSize = ""
    if (props.priceSize == "UNIT")
        priceSize = "ea"
    if (props.priceSize == "WEIGHT")
        priceSize = "lb"
    if (props.promo > 0) {
        return (
            <p>
                <del style={{color: "#ff6561"}}>${props.price}</del>
                <span>${props.promo}</span>
                / {priceSize}
            </p>
        )
    }
    if (props.price > 0) {
        return (
            <p>${props.price} / {priceSize}</p>
        )
    }
    return (
        <p>-</p>
    )
}

function ItemStockLevel(props) {
    if (props.stock == "HIGH") {
        return (
            <span style={{color: "green"}}> In Stock</span>
        )
    }
    if (props.stock == "LOW") {
        return (
            <span style={{color: "orange"}}> Low Stock</span>
        )
    }
    if (props.stock == "TEMPORARILY_OUT_OF_STOCK") {
        return (
            <span style={{color: "red"}}> Out of Stock</span>
        )
    }
    return (
        <p></p>
    )
}

export function ItemAdditionButton(props) {
  const productIndex = props.groceryList.findIndex(
    (item) => item.productId === props.product.productId
  );
  let startingQuantity = 0
  if (productIndex > -1) {
    startingQuantity = props.groceryList[productIndex].quantity
  }
  const [quantity, setQuantity] = useState(startingQuantity);

  const handleQuantityChange = (e) => {
    const changedValue = parseInt(e.target.value);
    if (changedValue >= 0 && changedValue <= 99) {
      setQuantity(changedValue);
    }
  };

  const addToGroceryList = () => {
    const updatedProduct = { ...props.product, quantity };

    // If the product is already in the list, just update its quantity
    if (productIndex > -1) {
      const updatedList = props.groceryList.map((item) =>
        item.productId === updatedProduct.productId ? updatedProduct : item
      );

      // Remove the item if quantity is reduced to 0
      if (quantity === 0) {
        const filteredList = updatedList.filter(
          (item) => item.productId !== updatedProduct.productId
        );
        props.setGroceryList(filteredList);
      } else {
        props.setGroceryList(updatedList);
      }
    } else {
      // If the product is not in the list and quantity is greater than 0, add it
      if (quantity > 0) {
        props.setGroceryList([...props.groceryList, updatedProduct]);
      }
    }
  };
  useEffect(() => {
    addToGroceryList();
  }, [quantity]);
  if (productIndex > -1) {
    return (
      <Form>
        <Form.Group className="d-flex align-items-center">
          <FaMinus
            size={14}
            onClick={() => {
              if (quantity > 0) {
                setQuantity(quantity - 1);
              }
            }}
          />
          <Form.Control
            style={{ width: "58px" }}
            type="number"
            value={props.groceryList[productIndex].quantity}
            onChange={(e) => handleQuantityChange(e)}
          />
          <FaPlus
            size={14}
            onClick={() => {
              if (quantity < 99) {
                setQuantity(quantity + 1);
              }
            }}
          />
        </Form.Group>
      </Form>
    );
  } else {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setQuantity(1);
        }}
      >
        Add
      </Button>
    );
  }
}