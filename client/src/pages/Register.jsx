import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'recipient',
    bloodGroup: 'A+',
    phone: '',
    city: '',
    state: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendEmailOTP = async () => {
    if (!formData.email) {
      toast.error('Please enter an email address');
      return;
    }
    
    setIsEmailVerifying(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, { email: formData.email });
      setEmailOtpSent(true);
      setResendTimer(30);
      toast.success('OTP sent successfully');
    } catch (error) {
      console.error('OTP Send Error:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsEmailVerifying(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsEmailVerifying(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, { 
        email: formData.email,
        otp: emailOtp
      });
      setIsEmailVerified(true);
      toast.success('Email verified successfully');
    } catch (error) {
      console.error('OTP Verification Error:', error);
      toast.error('Invalid OTP. Please try again');
    } finally {
      setIsEmailVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      toast.error('Please verify your email first');
      return;
    }
    setIsLoading(true);
    try {
      const user = await register(formData);
      toast.success('Registration successful!');
      
      if (user.role === 'donor') navigate('/donor/dashboard');
      else navigate('/recipient/dashboard');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl border border-gray-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 input-field"
                >
                  <option value="recipient">I need blood (Recipient)</option>
                  <option value="donor">I want to donate (Donor)</option>
                </select>
              </div>

              {formData.role === 'donor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="mt-1 input-field"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={formData.role !== 'donor' ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 input-field"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={isEmailVerified}
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field rounded-r-none border-r-0"
                    placeholder="Enter your email address"
                  />
                  <button
                    type="button"
                    onClick={handleSendEmailOTP}
                    disabled={isEmailVerifying || isEmailVerified || (emailOtpSent && resendTimer > 0)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed transition"
                  >
                    {isEmailVerifying && !emailOtpSent ? 'Sending...' : (isEmailVerified ? 'Email Verified ✓' : 'Send OTP')}
                  </button>
                </div>
              </div>

              {emailOtpSent && !isEmailVerified && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                  <div className="mt-1 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      className="input-field flex-1"
                      maxLength={6}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleVerifyEmailOTP}
                        disabled={isEmailVerifying || emailOtp.length !== 6}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 transition"
                      >
                        {isEmailVerifying ? 'Verifying...' : 'Verify OTP'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSendEmailOTP}
                        disabled={isEmailVerifying || resendTimer > 0}
                        className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-400 transition"
                      >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 input-field"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Full Address</label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 input-field resize-none"
                ></textarea>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !isEmailVerified}
                className="w-full btn-primary py-3 flex justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
