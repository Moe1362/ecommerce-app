import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { Link } from 'react-router-dom'
import { useGetMyOrdersQuery } from '../redux/api/orderApiSlice'

const UserOrder = () => {
    const {data: orders, isLoading, error} = useGetMyOrdersQuery()

    return (
        <div className='container mx-auto'>
            <h2 className="text-2xl font-semibold mb-4 hover:text-blue-600 transition-colors">My Orders</h2>
            {isLoading ? (<Loader />) : error ? (<Message variant='danger'>{error?.data?.error || error.error}</Message>) : (
                <table className='w-full'>
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <td className='py-2'>IMAGE</td>
                            <td className='py-2'>ID</td>
                            <td className='py-2'>DATE</td>
                            <td className='py-2'>TOTAL</td>
                            <td className='py-2'>PAID</td>
                            <td className='py-2'>Shipped</td>
                            <td className='py-2'></td>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map(order => (
                            <tr 
                                key={order._id} 
                                className="hover:-translate-y-0.5 transition-transform duration-200 border-b"
                            >
                                <td className='py-2'>
                                    <img 
                                        src={order.orderItems[0].image} 
                                        alt={order.user} 
                                        className='w-[6rem] mb-5 hover:scale-105 transition-transform duration-200' 
                                    />
                                </td>
                                <td className='py-2'>{order._id}</td>
                                <td className='py-2'>{order.createdAt.substring(0, 10)}</td>
                                <td className='py-2'>${order.totalPrice}</td>
                                <td className='py-2'>
                                    {order.isPaid ? (
                                        <p className='p-1 text-center bg-green-400 w-[6rem] rounded-full hover:bg-green-500 transition-colors'>
                                            Completed
                                        </p>
                                    ) : (
                                        <p className='p-1 text-center bg-red-400 w-[6rem] rounded-full hover:bg-red-500 transition-colors'>
                                            Pending
                                        </p>
                                    )}
                                </td>
                                <td className='py-2'>{order.isDelivered ? (
                                    <p className='p-1 text-center bg-green-400 w-[6rem] rounded-full hover:bg-green-500 transition-colors'>
                                        Shipped
                                    </p>
                                ) : (
                                    <p className='p-1 text-center bg-red-400 w-[6rem] rounded-full hover:bg-red-500 transition-colors'>
                                        Pending
                                    </p>
                                )}</td>
                                <td className='py-2'>
                                    <Link 
                                        to={`/order/${order._id}`}>
                                        <button className='p-1 bg-blue-400 hover:bg-blue-500 transition-colors rounded-full'>
                                            View Details
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default UserOrder