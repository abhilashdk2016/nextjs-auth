import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNav from '../components/TopNav';
import { Provider } from '../context';

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <TopNav />
      <Component {...pageProps} />  
      <ToastContainer />
    </Provider>
  )
}

export default MyApp;
