import ulog from 'ulog';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export const BASE_COLOR = "#EAFBEA"
export const SECONDARY_COLOR = "#6F9A8D"
export const THIRD_COLOR = "#1F6650"
export const ACCENT_COLOR = "#EA5E5E"

export const LOG = ulog("App");

export const LOCATIONS_LIMIT = 10;

export const ITEMS_LIMIT = 7;

export const HELMET_BACKGROUND = 'body {background-color: ' + BASE_COLOR + '; '

export const ZIPCODE_REGEX = /^[0-9]{5}$/

export const FAB_STYLING = {
                                bottom: 100,
                                right: 40,
                                backgroundColor: ACCENT_COLOR
                            }

export const Loading = () => {
    return (
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
}