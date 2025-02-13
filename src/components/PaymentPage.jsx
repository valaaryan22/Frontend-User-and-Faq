import axios from 'axios';
import React, { useState } from 'react';

const PaymentPage = () => {
    const [amount, setAmount] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    // Function to create a Razorpay order
    const createOrder = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/payment/create-order', {
                amount: amount,  // Amount in the smallest unit (e.g., paisa for INR)
            });

            const { orderId, amount: orderAmount } = response.data;

            // Initialize Razorpay payment options
            const options = {
                key: 'rzp_test_kWbuztJHjjMxDu', // Your Razorpay Key ID
                amount: orderAmount,  // Amount in paise
                currency: 'INR',
                name: 'My Shop',
                description: 'Payment for purchase',
                order_id: orderId,  // The order ID from Razorpay API
                handler: function (response) {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

                    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
                        console.error('Missing paymentId, orderId, or signature in Razorpay response');
                        return;
                    }

                    // Call verifyPayment with the correct field names
                    verifyPayment({
                        payment_id: razorpay_payment_id,
                        order_id: razorpay_order_id,
                        signature: razorpay_signature
                    });
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '9999999999',
                },
                notes: {
                    address: 'Customer Address',
                },
            };

            // Ensure Razorpay script is loaded before creating the instance
            if (window.Razorpay) {
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                console.error('Razorpay script not loaded');
            }
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
        }
    }; const verifyPayment = async (paymentResponse) => {
        try {
            // Ensure payment_id, order_id, and signature are available in paymentResponse
            const { payment_id, order_id, signature } = paymentResponse;
            if (!payment_id) {
                console.error('Payment ID not available in paymentResponse');
            }
            console.log('Sending Payment Data:', { payment_id, order_id, signature });

            const result = await axios.post('http://localhost:5000/api/payment/verify-payment', {
                paymentId: payment_id,  // payment_id from Razorpay response
                orderId: order_id,      // order_id from Razorpay response
                signature: signature,
                // signature from Razorpay response
            });


            if (result.data.success) {
                setPaymentStatus('Payment successful');
            } else {
                setPaymentStatus('Payment verification failed');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            setPaymentStatus('Payment verification failed');
        }
    };


    return (
        <> <h1 className='text-center text-6xl text-white bg-gradient-to-r from-indigo-500 to-pink-500 '>
            Payment Page
        </h1>
            <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center  p-4">

                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Make a Payment</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (INR)</label>
                            <input
                                type="number"
                                id="amount"
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={createOrder}
                            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                        >
                            Pay with Razorpay
                        </button>
                    </div>

                    {paymentStatus && (
                        <div className={`mt-6 text-center p-2 rounded-md ${paymentStatus === 'Payment successful' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            <p className="font-medium">{paymentStatus}</p>
                        </div>
                    )}
                </div>
            </div></>
    );
};

export default PaymentPage;
