import ReactDOM from "react-dom";
import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink, Observable } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import App from "./App";
import { getAccessToken, setAccessToken } from "./accessToken";

// const fetchAccessToken = async (): Promise<any> => {
//     const payload = {
//         operationName: "RefreshToken",
//         variables: {},
//         query: "mutation RefreshToken {\n  refreshToken\n}\n"
//     };
//     return fetch(`${process.env.REACT_APP_SERVER_URL}/graphql`, {
//         method: "POST",
//         credentials: "include",
//         body: JSON.stringify(payload),
//         headers: {
//             "Content-Type": "application/json; charset=utf-8",
//             Accept: "application/json"
//         }
//     }).then(async res => {
//         const response = await res.json();
//         console.log("fetchAccessToken");
//         console.log(response.data.refresh);
//         return response.data.refresh;
//     });
// };

const tk: any = new TokenRefreshLink({
    accessTokenField: "accessToken",
    isTokenValidOrUndefined: () => {		
        const token = getAccessToken();

        if (!token) {
            return true;
        }

        try {			
            const { exp } = jwtDecode(token);
            
            if (Date.now() >= exp * 1000) {
                return false;
            } else {
                return true;
            }
        } catch {
            return false;
        }
    },
    fetchAccessToken: () => {
		return fetch(`${process.env.REACT_APP_SERVER_URL}/api/refresh_token`, {
			method: "POST",
			credentials: "include",
		});
	},
    handleFetch: accessToken => {
        setAccessToken(accessToken);
    },
    handleResponse: () => {

    },
    handleError: err => {
        console.log(`handleError: ${err}`);
    }
});

const requestLink = new ApolloLink(
    (operation, forward) =>
        new Observable(observer => {
            let handle: any;
            Promise.resolve(operation)
                .then(operation => {
					const accessToken = getAccessToken();
                    operation.setContext({ headers: { authorization: `${accessToken}` } });
                })
                .then(() => {
                    handle = forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer)
                    });
                })
                .catch(observer.error.bind(observer));
            return () => {
                if (handle) handle.unsubscribe();
            };
        })
);

const errorLink = onError((errors: any) => {
    console.log(errors)
    //handle errors.graphQLErrors[0].extensions?.code
});

const client = new ApolloClient({
    link: ApolloLink.from([
        tk,
        errorLink,
        requestLink,
        new HttpLink({
            uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
            credentials: "include"
        })
    ]),
    cache: new InMemoryCache()
});

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
