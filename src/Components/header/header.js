import React from "react";
import {FaList, FaSearchLocation, FaStore, FaStoreSlash} from "react-icons/fa"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Header(props) {
    return (
        <div className="header">
            <div className="header-icon">
                <Row>
                    <Col style={{textAlign: "left"}}>
                        <SelectedStoreDisplay {...props}/>
                    </Col>
                    <Col style={{textAlign: "right"}}>
                        <ExitHeaderButton {...props}/>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

function SelectedStoreDisplay(props) {
    const spacing = "   " //Need to look into a better solution to styling the header
    if (props.storeID) {
        return (
            <>
                <FaStore></FaStore> {props.storeName} {spacing}
            </>
        )
    }
    return (
        <>
            <FaStoreSlash></FaStoreSlash> No Selected Store {spacing}
        </>
    )
}

function ExitHeaderButton(props) {
    if (props.showList) {
        return (
            <FaSearchLocation
                size={'2em'}
                onClick={() => props.setShowList(!props.showList)}
            />
        )
    }
    return (
        <FaList
            size={'2em'}
            onClick={() => props.setShowList(!props.showList)}
        />
    )
}