import { createBrowserRouter } from "react-router";
import PublicLayouts from "./layouts/PublicLayouts";
import ProtectedLayouts from "./layouts/ProtectedLayouts";
import Publicpage from "./pages/Publicpage";
import Home from "./pages/HomePage";
import Register from "./components/Register"
import Login from "./components/Login";

const Routes = createBrowserRouter([
{
  path : '/',
  element : <PublicLayouts/>,
  children : [
    {
      index : true,
      element : <Publicpage/>,
      
    },
     {
      path : 'register',
      element : <Register/>
    },
    {
      path : 'login',
      element :<Login/>
    } 
  ]
},
{
  path :'home',
  element : <ProtectedLayouts/>,
  children : [
    {
      index : true,
      element : <Home/>
    },
    
  ]
}

])

export default Routes