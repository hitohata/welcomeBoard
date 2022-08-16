import { Amplify, Auth } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import logo from './logo.svg';
import './App.css';
import { ApolloClient, ApolloProvider, NormalizedCacheObject, createHttpLink, InMemoryCache } from '@apollo/client';
import { GetSample } from "./Get";
import { useState, useEffect } from "react";
import { setContext } from "@apollo/client/link/context";
import { Hearts } from "react-loader-spinner";
import { inMemoryCacheConfig } from "./ApolloCache";

Amplify.configure({
  aws_project_region: process.env.REACT_APP_PROJECT_REGION,
  aws_cognito_region: process.env.REACT_APP_COGNITO_REGION,
  aws_user_pools_id: process.env.REACT_APP_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_WEB_CLIENT_ID
})

function App() {

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>(undefined)

  useEffect(() => {

    if (!client) {
    const createClient = async () => {
      const httpLink = createHttpLink({
        uri: process.env.REACT_APP_APPSYNC_URL
      });

      const token = (await Auth.currentSession()).getIdToken().getJwtToken();

      const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: token,
            }
          }
       }
     );

     const apolloClient = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(inMemoryCacheConfig)
     })

     setClient(apolloClient)

    }

    createClient();
    }

  }, []);

  return (
    <>
      {!client && <Hearts /> }
      {client && (
					<ApolloProvider client={client}>
							<GetSample />
					</ApolloProvider>
				)}
    </>
  );
}

export default App;
