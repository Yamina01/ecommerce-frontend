import React from 'react'
import { RotateLoader } from 'react-spinners'
import"./Loader.scss"

function Loader() {
  return (
    <div>
        <div className="loader">
            <RotateLoader
            color="#0f3460"
            size={20}
            aria-label='Loading Spinner'
            data-testid="loader"
            />
        </div>
    </div>
  )
}

export default Loader
