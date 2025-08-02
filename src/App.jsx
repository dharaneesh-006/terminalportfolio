import React from 'react'
import Terminal from './components/Terminal'
import Home from './components/Home'

const App = () => {
  return (
    
    <div className='grid grid-cols-[40%_60%]  h-full'>
      <div>
        <Home />
      </div>
      <Terminal/>
    </div>
  )
}

export default App
