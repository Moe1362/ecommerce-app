import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation } from '../../redux/api/usersApiSlice'
import { setCredientials } from '../../redux/features/auth/authSlice'
import { toast } from 'react-toastify'



const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, { isLoading }] = useLoginMutation()
    const { userInfo } = useSelector((state) => state.auth)

    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])




  return (
    <div>
        <section className='pl-[10rem] flex flex-wrap'>
            <div className='mr-[4rem] mt-[5rem]'>
                <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
                <form className='container w-[40rem]'>
                    <div className='my-[2rem]'>
                        <label htmlFor="email" className='block text-sm font-medium text-black'>Email Address</label>
                        <input type='email' id='email' className='mt-1 p-2 w-full border border-gray-300 rounded-md' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </form>
            </div>

        </section>
    </div>
  )
}

export default Login