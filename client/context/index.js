import axios from 'axios';
import { useRouter } from 'next/router';
import { useReducer , createContext, useEffect } from 'react';

const initialState = {
  user: null
};

const Context = createContext();

// root reducer
const rootReducer = (state, action) => {
  switch(action.type) {
    case "LOGIN": 
      return {
        ...state,
        user: action.payload
      }
    case "LOGOUT": 
      return {
        ...state,
        user: null
      }
  }
}

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    dispatch({type: "LOGIN", payload: JSON.parse(window.localStorage.getItem('user'))});
  }, []);

  axios.interceptors.response.use(
    function(response) {
      return response
    },
    function(error) {
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios.get('/api/logout').then(data => {
            window.localStorage.removeItem('user');
            dispatch({ type: "LOGOUT" });
            //router.push('/login');
          }).catch(err => {
            console.log(`Axios Interceptor Error: ${err}`);
            reject(err);
          })
        })
      }
      return Promise.reject(error);
    }
  )

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get('/api/csrf-token');
      axios.defaults.headers['X-CSRF-Token'] = data.getCsrfToken;
    }
    getCsrfToken();
  }, []);
  return (
    <Context.Provider value={{state, dispatch}}>
      {children}
    </Context.Provider>
  )
}

export { Context, Provider };
