import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const Register= () => {
  const [name, setName] = useState('');
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
      await axios.post(`/api/register`, {
      name,
      email,
      password
    });
    toast.success("Registered Sucessfully. Please login.");
    setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data);
    }
  }

  return (
    <>
      <div className="col-md-4 offset-md-4 pb-5 mt-5">
      <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input 
              type="text" 
              className="form-control p-4 mb-4" 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="Enter Name" required />
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
          disabled={!name || !email || !password || loading}>
            {
              loading ? <SyncOutlined spin /> : 'Register'
            }
          </button>
        </form>
        <p className="text-center p-3">
          Already Registered? {"  "}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  )
}

export default Register
