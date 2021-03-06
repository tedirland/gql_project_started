import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { AuthContext } from '../../context/authContext';
import { useMutation, gql } from '@apollo/client';
import AuthForm from '../../components/forms/AuthForm';

const USER_CREATE = gql`
  mutation userCreate {
    userCreate {
      username
      email
    }
  }
`;

const CompleteRegistration = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState('');

  let history = useHistory();

  useEffect(() => {
    setEmail(window.localStorage.getItem('emailForRegistration'));
  }, []);

  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.error('You must enter a valid email and password.');
      setLoading(false);
      return;
    }
    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      if (result.user.emailVerified) {
        window.localStorage.removeItem('emailForRegistration');
        let user = auth.currentUser;
        await user.updatePassword(password);

        //dispatch user with token and email

        //redirect to another page
        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: { email: user.email, token: idTokenResult.token },
        });
        //make api request to save/update user in MongoDB
        userCreate();
        history.push('/profile');
      }
      console.log(result);
      toast.success('User successfully registered!');
    } catch (error) {
      console.log('registration failed', error.message);
      setLoading(false);
      toast.error(error.message);
    }
  };
  return (
    <div>
      <div className="container p-5">
        {loading ? (
          <h4 className="text-danger">Loading...</h4>
        ) : (
          <h4>Complete Registration</h4>
        )}

        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          handleSubmit={handleSubmit}
          showPasswordInput="true"
        />
      </div>
    </div>
  );
};

export default CompleteRegistration;
