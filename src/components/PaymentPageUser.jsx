import axios from 'axios';
import  { useState, useEffect } from 'react';

const PaymentPage = () => {
    const [amount, setAmount] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Razorpay key from environment variable
    const RAZORPAY_KEY_ID = 'rzp_test_kWbuztJHjjMxDu';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/current-user', {
                    withCredentials: true
                });
                setUserEmail(response.data.email);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data. Please try logging in again.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const createOrder = async () => {
        if (!userEmail) {
            setError('Please log in to make a payment');
            return;
        }

        if (!amount || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setError(null);
        setPaymentStatus('');

        try {
            console.log('Creating order with:', { amount, userEmail });

            const response = await axios.post('http://localhost:5000/api/payment/create-order1', {
                amount: parseFloat(amount),
                userEmail: userEmail
            });

            console.log('Order creation response:', response.data);

            if (!response.data.orderId) {
                throw new Error('No order ID received from server');
            }

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: response.data.amount,
                currency: response.data.currency || 'INR',
                name: 'My Shop',
                description: 'Payment for purchase',
                order_id: response.data.orderId,
                handler: function (response) {
                    verifyPayment({
                        payment_id: response.razorpay_payment_id,
                        order_id: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                        userEmail: userEmail
                    });
                },
                prefill: {
                    email: userEmail,
                    contact: ''
                },
                notes: {
                    userEmail: userEmail
                },
                theme: {
                    color: '#4F46E5' // Indigo color to match your UI
                }
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                setError(`Payment failed: ${response.error.description}`);
            });
            razorpayInstance.open();

        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            setError(error.response?.data?.error || 'Failed to create payment order');
        }
    };

    const verifyPayment = async (paymentResponse) => {
        try {
            const { payment_id, order_id, signature } = paymentResponse;
            
            const result = await axios.post('http://localhost:5000/api/payment/verify-payment1', {
                paymentId: payment_id,
                orderId: order_id,
                signature: signature,
                userEmail: userEmail
            });

            if (result.data.success) {
                setPaymentStatus('Payment successful');
                // Optional: Clear amount after successful payment
                setAmount('');
            } else {
                setPaymentStatus('Payment verification failed');
                setError(result.data.reason || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            setPaymentStatus('Payment verification failed');
            setError(error.response?.data?.error || 'Error verifying payment');
        }
    };

    return (
        <> 
            <h1 className='text-center text-6xl text-white bg-gradient-to-r from-indigo-500 to-pink-500'>
                Payment Page User
            </h1>
            <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Make a Payment</h2>
                    
                    {userEmail && (
                        <div className="mb-4 text-center text-gray-600">
                            Logged in as: {userEmail}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Amount (INR)
                            </label>
                            <input
                                type="number"
                                id="amount"
                                min="1"
                                step="any"
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={createOrder}
                            disabled={!userEmail || !amount || loading}
                            className={`w-full py-2 ${!userEmail || !amount || loading 
                                ? 'bg-gray-400' 
                                : 'bg-indigo-600 hover:bg-indigo-700'} 
                                text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300`}
                        >
                            {loading ? 'Loading...' : 'Pay with Razorpay'}
                        </button>
                    </div>

                    {paymentStatus && (
                        <div className={`mt-6 text-center p-2 rounded-md ${
                            paymentStatus === 'Payment successful' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                        }`}>
                            <p className="font-medium">{paymentStatus}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PaymentPage;