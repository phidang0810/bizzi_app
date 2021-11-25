import "./App.scss";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import routes from "./routes";
import { PageNotFound } from "./PageNotFound";
import PrivateRoute from "./PrivateRoute";
import { setAccessToken } from "./accessToken";
import { useEffect, useState } from "react";
import { Loading } from "./components/Loading";


function App() {    
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/refresh_token`, {
            method: "POST",
            credentials: "include"
        }).then(async res => {
            const { accessToken } = await res.json();
            setAccessToken(accessToken);
            setLoading(false);
        });
    }, []);
    if (loading) return <Loading />
    return (
        <BrowserRouter>
            <Switch>
                {routes.map((route, i) => {
                    if (route.auth) {
                        return <PrivateRoute key={i} {...route} />;
                    } else {
                        return <Route key={i} {...route} exact={true} />;
                    }
                })}
                <Route component={PageNotFound} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
