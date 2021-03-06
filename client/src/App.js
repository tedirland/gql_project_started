import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

//component/ page imports
import Nav from './components/Nav';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CompleteRegistration from './pages/auth/CompleteRegistration';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';
import { setContext } from '@apollo/client/link/context';
import PrivateRoute from './components/PrivateRoute';
import PasswordUpdate from './pages/auth/PasswordUpdate';
import Post from './pages/post/Post';
import Profile from './pages/auth/Profile';

import PasswordReset from './pages/auth/PasswordForgot';

const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });

  const authLink = setContext((_, { headers }) => {
    const token = user.token;
    return {
      headers: {
        ...headers,
        authtoken: user ? token : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <Nav />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/password/forgot" component={PasswordReset} />
        <Route exact path="/register" component={Register} />
        <Route
          exact
          path="/complete-registration"
          component={CompleteRegistration}
        />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/password/reset" component={PasswordUpdate} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/post/create" component={Post} />
      </Switch>
    </ApolloProvider>
  );
};

export default App;
