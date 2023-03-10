import { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Main from './pages/Main'
import Question1 from './pages/Main/Question1'
import SignIn from './pages/SignIn'
import Stats from './pages/Stats'

type PropTypes = {
  children: ReactNode
}

const Container = ({ children }: PropTypes) => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-200">
      <div className="aspect-[9/16] h-screen bg-white">
        { children }
      </div>
    </div>
  )
}

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<Navigate to='/sign-in' />}></Route>
          <Route path='/sign-in' element={<SignIn />}></Route>
          <Route path='/main' element={<Main />}>
            <Route path='q1' element={<Question1 />}></Route>
          </Route>
          <Route path='/stats' element={<Stats />}></Route>
        </Routes>
      </BrowserRouter>
    </Container>
  )
}

export default App
