import {API_BASE_URL} from '../config';

const postEquationRequest = () => ({
  type: 'POST_EQUATION_REQUEST'
});
const postEquationSuccess = data => ({
  type: 'POST_EQUATION_SUCCESS',
  data
});
const postEquationError = err => ({
  type: 'POST_EQUATION_ERROR',
  err
});
export const postEquation = equation => dispatch => {
  dispatch(postEquationRequest());
  return fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({equ: equation})
  })
    // .then(res => normalizeResponseErrors(res))
    // not calling next line, commenting previous line fixes
    .then(() => {
      // console.log('post Equation Success');s
      return dispatch(postEquationSuccess(equation))
    })
    .catch(err => dispatch(postEquationError(err)));
};

const fetchLogsRequest = () => ({
  type: 'FETCH_LOGS_REQUEST'
});
const fetchLogsSuccess = data => ({
  type: 'FETCH_LOGS_SUCCESS',
  data
});
const fetchLogsError = err => ({
  type: 'FETCH_LOGS_ERROR',
  err
});
export const fetchLogs = () => dispatch => {
  // console.log('here!')
  dispatch(fetchLogsRequest());
  return fetch(`${API_BASE_URL}`)
    .then(res => normalizeResponseErrors(res))
    .then(res => {
      // console.log(res);
      dispatch(fetchLogsSuccess(res))
    })
    .catch(err => dispatch(fetchLogsError(err)));
};

const normalizeResponseErrors = res => {
  if (!res.ok) {
    if (
      res.headers.has('content-type') &&
      res.headers.get('content-type').startsWith('application/json')
    ) {
      return res.json().then(err => Promise.reject(err))
    }
    return Promise.reject({
      code: res.status,
      message: res.statusText
    });
  }
  return res.json();
}
