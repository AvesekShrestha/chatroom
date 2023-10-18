import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Notfound() {
    const navigate = useNavigate();
    const handelOnClick = ()=>{
        navigate("/")
    }
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center flex-column " style={{height : "88vh"}}>
        <h2 className='font-weight-bold mb-4'>Not Found!</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, vitae recusandae! Eveniet delectus ratione eius modi, saepe quibusdam. Explicabo accusantium voluptas facere nesciunt saepe consequuntur earum reprehenderit, modi molestias magnam?</p>
        <button className="btn btn-primary" onClick={handelOnClick}>Go Back</button>
      </div>
    </>
  )
}
