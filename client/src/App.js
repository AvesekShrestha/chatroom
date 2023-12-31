import './App.css';
import ChatArea from "./components/ChatArea";
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Order from './components/Order';
import Navbar from './components/Navbar';
import Notfound from './components/Notfound';

function App() {
  return (
    <>
      <div className='container-fluid'>
        <div className="row">
          <div className="col-md-2 px-0"><Sidebar /></div>
          <div className="col-md-8 px-0">
            <Navbar />
            <div className="container d-flex flex-column">
              <Routes>
                <Route path='/' element={<ChatArea />} />
                <Route path='/order' element={<Order />} />
                <Route path='*' element={<Notfound />} />
              </Routes>
            </div>
          </div>
          <div className="col-md-2 px-0">Online Status</div>

        </div>
      </div>
    </>
  );
}

export default App;
