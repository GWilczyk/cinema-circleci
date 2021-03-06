import React from 'react'
import 'components/Spinner/Spinner.scss'

const Spinner = () => {
  return (
    <div className="spinner" data-testid="spinner">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  )
}

export default Spinner
