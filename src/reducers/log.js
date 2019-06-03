const initialState = {log: [], error: null, loading: false};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case 'POST_EQUATION_REQUEST':
    case 'FETCH_LOGS_REQUEST':
      return {...state, error: null, loading: true};
    case 'POST_EQUATION_SUCCESS':
      console.log('here!');
      let newLog
      if (state.log.length === 10) newLog = state.log.slice(0, 9);
      else newLog = [...state.log]
      newLog.unshift(action.data);
      console.log(newLog);
      return {...state, log: newLog, loading: false};
    case 'FETCH_LOGS_SUCCESS':
      return {...state, log: action.data, loading: false};
    case 'POST_EQUATION_ERROR':
    case 'FETCH_EQUATION_ERROR':
      return {...state, error: action.err};
    default:
      return state;
  }
}
