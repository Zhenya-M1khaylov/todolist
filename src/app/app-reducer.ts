import {Dispatch} from 'redux';
import {authAPI, Result_Code} from '../api/todolists-api';
import {setIsLoggedInAC} from '../features/Login/auth-reducer';
import {handleServerNetworkError} from '../utils/error-utils';

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return {...state}
    }
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    isInitialized: boolean
}

export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setIsInitializedAC = (isInitialized: boolean) => ({type: 'APP/SET-IS-INITIALIZED', isInitialized} as const)

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type InitializedActionType = ReturnType<typeof setIsInitializedAC>


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === Result_Code.OK) {
            dispatch(setIsLoggedInAC(true));
        }
    })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
        .finally(()=> {
            dispatch(setIsInitializedAC(true));
        })
}

type ActionsType =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | InitializedActionType
