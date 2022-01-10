const initialstate = {
    login: false,
    user: {},
    loading: true
}

const USER_REDUCER = (state = initialstate, { type, payload }) => {

    if (type === 'USER_FAIL') {
        return {
            ...state,
            loading: false,
        }
    }

    if (type === 'USER_SUCCESS') {
        return {
            login: true,
            loading: false,
            user: payload
        }
    }

    return state
}

export default USER_REDUCER