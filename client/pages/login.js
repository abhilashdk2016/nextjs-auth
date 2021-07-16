import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // state
  const { state, dispatch } = useContext(Context);
  const router = useRouter();
  const { user } = state;

  useEffect(() => {
    if(user !== null) {
      router.push('/');
    }
  }, [user]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/login`, {
        email,
        password
      });
      dispatch({type: "LOGIN", payload: data});
      window.localStorage.setItem('user', JSON.stringify(data));
      toast.success("Logged In.");
      setLoading(false);
      router.push('/');
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data);
    }
  }

  return (
    <>
      <div className="col-md-4 offset-md-4 pb-5 mt-5">
      <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="form-control p-4 mb-4" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter Email" required />
          <input 
              type="password" 
              className="form-control p-4 mb-4" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Password" required />
          <button className="btn btn-primary btn-block p-2" type="submit" 
          disabled={!email || !password || loading}>
            {
              loading ? <SyncOutlined spin /> : 'Login'
            }
          </button>
        </form>
        <p className="text-center p-3">
          Not Registered? {"  "}
          <Link href="/register">
            <a>Register</a>
          </Link>
        </p>
      </div>
    </>
  )
}

export default Login;
