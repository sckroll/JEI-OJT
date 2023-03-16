import { createContext, ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Main from './pages/Main'
import SignIn from './pages/SignIn'
import MyPage from './pages/MyPage'
import { ContentState } from './types/User'

type PropTypes = {
  children: ReactNode
}

// const ContentContext = createContext<ContentState[]>([])

const Container = ({ children }: PropTypes) => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-slate-200">
      <div className="w-full sm:w-auto sm:aspect-[9/19.5] h-screen bg-white">
        <div className='h-full p-4 flex flex-col gap-4'>
          { children }
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    // <ContentContext.Provider value={[]}>
      <Container>
        <BrowserRouter>
          <Routes>
            <Route path='/*' element={<Navigate to='/sign-in' />}></Route>
            <Route path='/sign-in' element={<SignIn />}></Route>
            <Route path='/main/*' element={<Main />}></Route>
            <Route path='/my-page' element={<MyPage />}></Route>
          </Routes>
        </BrowserRouter>
      </Container>
    // </ContentContext.Provider>
  )
}

export default App
