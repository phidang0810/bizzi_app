import { Route, Redirect } from 'react-router-dom'
import { useMeQuery } from './generated/graphql';
import { Spin } from 'antd';

export default function PrivateRoute(props) {      
    const {data, loading} = useMeQuery({variables: {}});
    console.log('privateeeee', !data?.me)   
    console.log('privateeeee 2222', data)   
    if(loading) return <div className='text-center'><Spin tip="Loading..."></Spin></div>
    else if(!data?.me) return <Redirect to='/login' />
    return (<Route {...props} exact={true}/>)
}