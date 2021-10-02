import React, { useReducer, createContext } from 'react'

const INITIAL_LOCATION_VALUES = null

export const LocationContext = createContext(INITIAL_LOCATION_VALUES)

export const LocationContextProvider = (props) => {
    const [location, dispatchLocation] = useReducer(reducer, INITIAL_LOCATION_VALUES)
    return (
        <LocationContext.Provider value={{ location, dispatchLocation }} >
            {props.children}
        </LocationContext.Provider>
    )
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOCATION':
            return {
                ...state,
                INITIAL_LOCATION_VALUES: action.payload
            }
        default:
            return state
    }
}