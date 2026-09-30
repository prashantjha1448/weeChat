import React, { useEffect, useState } from 'react'
import { Outlet , Navigate } from 'react-router'
import {useSelector} from 'react-redux'
import { useAuthentication } from '../hooks/auth.hooks'

const ProtectedLayouts = () => {

  const {isAuthenticated} = useSelector((state)=>state.auth)
  const [Loading, setLoading] = useState(true)
  const {getCurrentUserStatus } = useAuthentication()


  useEffect(()=>{
    const verifysession = async ()=>{
      await getCurrentUserStatus()
      setLoading(false)
    }
    verifysession()
  },[])

  if(Loading){
    return (<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>)
  }

  if(!isAuthenticated){
    return < Navigate to='/login' />
  }
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default ProtectedLayouts