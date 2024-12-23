import { Outlet } from "react-router-dom"
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Footer from "./components/Footer";



function App() {
  return (
    <>
    <ToastContainer />
    <Navigation />
    <main className="py-20 mt-[3rem] ">
      <Outlet />
    </main>
    <Footer />
  </>
  )
   
}

export default App;
