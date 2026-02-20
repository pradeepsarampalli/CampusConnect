import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard.js'
function AppRoutes(){
    return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register/>} />
      </Routes>
    </BrowserRouter>
    )
}

export default AppRoutes