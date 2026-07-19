import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from "../pages/Home";
import Signup from "../pages/SignUp";
import Layout from "../pages/Layout";
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Upload from "../pages/Upload";
import Watch from '../pages/Watch';
import Channel from '../pages/Channel';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Settings from '../pages/Settings';
import Dashboard from '../pages/Dashboard';
import StudioVideos from "../pages/StudioVideos";
import Playlists from "../pages/Playlists";
import PlaylistDetails from "../pages/PlaylistDetails";
import Library from "../pages/Library";
import WatchHistory from "../pages/WatchHistory";
import LikedVideos from "../pages/LikedVideos";
import Subscriptions from "../pages/Subscriptions";
import Notifications from "../pages/Notifications";

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Layout />}>
            <Route path='' element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            <Route path='logout' element={<Logout />} />
            <Route path='profile' element={<Profile />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='settings' element={<Settings />} />
            <Route path='upload' element={<Upload />} />
            <Route path='watch/:videoId' element={<Watch />} />
            <Route path='channel/:username' element={<Channel />} />
            <Route path='*' element={<NotFound />} />
            <Route path="studio/videos" element={<StudioVideos />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="playlists/:playlistId" element={<PlaylistDetails />} />
            <Route path="library" element={<Library />} />
            <Route path="library/history" element={<WatchHistory />} />
            <Route path="library/liked" element={<LikedVideos />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="notifications" element={<Notifications />} />
        </Route>
    )
)

export default Router;
