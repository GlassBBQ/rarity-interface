import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Token from './pages/Token'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import MenuModal from './components/MenuModal'
import { FaDonate } from 'react-icons/fa'

function App() {
  return (
    <div>
      <Router>
        <div className="layout shadow-xl border-gray-400">
          <Header />

          <div className="grid w-screen grid-cols-1 lg:grid-cols-5">
            <Sidebar />

            <div className="lg:col-span-4 bg-gray-200">
              <Switch>
                <Route path="/token">
                  <Token />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
        <MenuModal />
      </Router>
      <footer className="h-12 flex justify-center items-center">
        <p
          className="w-5 h-5"
        >
          <FaDonate className="w-full h-full text-gray-500" /></p>&nbsp;&nbsp;ELA: EY6fRgmt9B67af7ARThzrC5ToWbCmrcNSj | ESC: 0xB70AA99199D449bEf0E974f6b27b5ED3E50AB0C8
        
      </footer>
    </div>
  )
}

export default App
