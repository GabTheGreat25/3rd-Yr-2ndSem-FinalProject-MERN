import React from 'react'
import MyNavbar from '../component/MyNavbar'
import Broken from '../assets/broken-camera.jpg'
export default function NotFound() {
  return (
    <div>
      <MyNavbar />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img src={Broken} alt="Broken Image" style={{ width: '500px' }} />
          <h1>Not Found</h1>
          <p>The requested page could not be found.</p>
        </div>
      </div>
    </div>
  )
}
