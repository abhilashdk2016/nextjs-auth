import { useContext } from 'react';
import { Context } from '../../context';
import UserRoute from '../../components/routes/userRoute';

const UserIndex = () => {
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  return (
    <UserRoute>
      <h1 className="text-center">{JSON.stringify(user)}</h1>
    </UserRoute>
  )
}

export default UserIndex;
