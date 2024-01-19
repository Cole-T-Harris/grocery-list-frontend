import React, { useState } from 'react'
import Collapse from 'react-bootstrap/Collapse'
import StorePicker from './Components/Stores/StorePicker'
import List from './Components/List/List'
import Container from 'react-bootstrap/esm/Container'
import Header from './Components/header/header'
import {Helmet} from "react-helmet"
import { HELMET_BACKGROUND } from './utils/constants'

export default function App() {
  const [showList, setShowList] = useState(false)
  const [showItemSearch, setShowItemSearch] = useState(false)
  const [storeName, setStoreName] = useState("")
  const [storeID, setStoreID] = useState("")
  const [groceryList, setGroceryList] = useState([])
  const context = {
    showList, setShowList,
    showItemSearch, setShowItemSearch,
    storeName, setStoreName,
    storeID, setStoreID,
    groceryList, setGroceryList
  }
  return (
    <div className='app-background'>
      <Helmet>
        <style>{HELMET_BACKGROUND}</style>
      </Helmet>
      <Header {...context}/>
      <Planner {...context}/>
    </div>
  )
}

function Planner(props) {
  return (
    <div className='body'>
      <Collapse in={!props.showList}>
        <Container>
          <StorePicker {...props} />
        </Container>
      </Collapse>
      <Collapse in={props.showList}>
        <Container>
          <List {...props} />
        </Container>
      </Collapse>
    </div>
  )
}