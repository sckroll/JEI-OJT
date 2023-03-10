import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Main from './pages/Main'
import SignIn from './pages/SignIn'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<Navigate to='/sign-in' />}></Route>
        <Route path='/sign-in' element={<SignIn />}></Route>
        <Route path='/main' element={<Main />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
