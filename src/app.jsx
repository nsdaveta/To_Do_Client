import './App.css';
import To_Do from './to-do';
import NotFound from './notfound'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes,Route} from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import VerifyOtp from './VerifyOtp';
import ForgotPassword from './ForgotPassword';

function App() 
{  
  return(
    <div className="App">
      <ToastContainer hideProgressBar={true} autoClose={2000} position="top-right" theme="colored" />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/verify-otp' element={<VerifyOtp/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/todos' element={<To_Do/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  )
}
export default App;