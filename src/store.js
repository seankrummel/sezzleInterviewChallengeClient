import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import log from './reducers/log';

export default createStore(log, applyMiddleware(thunk));
