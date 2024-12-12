import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Sales from "../pages/Sales"
import Store from "../pages/Store"

const MyRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />}>
              <Route path="store" element={<Store />} />
              <Route path="sales" element={<Sales />} />
            </Route> 
        </Routes>    
    </BrowserRouter>
  )
}

export default MyRoutes