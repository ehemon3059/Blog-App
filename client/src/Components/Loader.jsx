import React from 'react'
import LoadingGif from '../images/load.gif'

const Loader = () => {
  return (
    <div className='loader'>
      <div className="loader_Image">
        <img src={LoadingGif} alt="" />
      </div>
    </div>
  )
}

export default Loader
