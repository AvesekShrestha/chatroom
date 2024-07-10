import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.esm.js"
import { Provider } from 'react-redux'
import store from './store/index.jsx'
import { SocketProvider } from './context/socket.jsx'
import { PeerProvider } from './context/webrtc.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(


  <Provider store={store}>
    <PeerProvider>
      <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketProvider>
    </PeerProvider>
  </Provider>

)
