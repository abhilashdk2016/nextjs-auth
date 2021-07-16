import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';

const UserRoute = ({ children }) => {
  const [hidden, setHidden] = useState(false);
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/currentUser');
      if (data.ok) setHidden(true);
    } catch (error) {
      setHidden(false);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {!hidden ? <SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p-5"/> : children}
    </>
  )
}

export default UserRoute;
