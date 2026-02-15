import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
function AppRoutes(){
    return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register/>} />
      </Routes>
    </BrowserRouter>
    )
}

export default AppRoutes