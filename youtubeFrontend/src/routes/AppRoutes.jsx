import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import Home from "../pages/Home";
import Signup from "../pages/SignUp";
import Layout from "../pages/Layout";
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Upload from "../pages/Upload";
import Watch from '../pages/Watch';
import Channel from '../pages/Channel';

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Layout/>}>
            <Route path='' element={<Home/>}/>
            <Route path='login' element={<Login/>}/>
            <Route path='signup' element={<Signup/>}/>
            <Route path='logout' element={<Logout/>}/>
            <Route path='upload' element={<Upload/>}/>
            <Route path='watch/:videoId' element={<Watch/>}/>
            <Route path='channel/:username' element={<Channel/>}/>
        </Route>
    )
)

export default Router;