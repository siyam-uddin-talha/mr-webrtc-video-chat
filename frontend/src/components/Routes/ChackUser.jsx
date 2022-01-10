import React from 'react'
import { Redirect, Route } from "react-router"
import { useSelector } from 'react-redux';

const UserPrivateRoute = ({ component: Component, ...rest }) => {

    const { login } = useSelector(state => state.UserReducer)


    return (<Route {...rest} render={props => {
        return !login ? <Component {...props} /> : <Redirect to='/' />
    }} >
    </Route>)


}

export default UserPrivateRoute