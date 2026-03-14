import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import OtpInput from './components/OtpInput';
import './auth.css';

// A simple spinner component for loading states
const Spinner = () => <div className="spinner"></div>;

const Register = () => {
    // State for form inputs
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    // State to manage UI flow and feedback
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    // Check if we were redirected here to verify OTP
    useEffect(() => {
        if (location.state && location.state.email && location.state.showOtp) {
            setEmail(location.state.email);
            setIsRegistered(true);
        }
    }, [location.state]);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    // Handles the initial registration form submission
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await api.post('/register', {
                username,
                email,
                password
            });
            setSuccessMessage(response.data.message);
            setIsRegistered(true); // Move to OTP verification step
        } catch (err) {
            setError(err.response?.data?.message || 'An unexpected error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handles the OTP verification form submission
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await api.post('/verify-otp', { email, otp });
            setSuccessMessage(response.data.message + ' Redirecting to login...');

            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'An unexpected error occurred during OTP verification.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handles the OTP resend
    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const response = await api.post('/resend-otp', { email });
            setSuccessMessage(response.data.message);
            setResendCooldown(60); // Start 60-second cooldown
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    // Renders the initial registration form
    const renderRegisterForm = () => (
        <form onSubmit={handleRegisterSubmit}>
            <p>Join us to start organizing your tasks today.</p>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                    </button>
                </div>
            </div>
            <button type="submit" disabled={isLoading} className="primary-btn">
                {isLoading ? <Spinner /> : 'Create Account'}
            </button>
            <div className="auth-footer">
                <p>Already have an account? <span onClick={() => navigate('/login')}>Sign In</span></p>
            </div>
        </form>
    );

    // Renders the OTP verification form
    const renderOtpForm = () => (
        <form onSubmit={handleOtpSubmit}>
            <p>Enter the 6-digit OTP sent to <strong>{email}</strong></p>
            <div className="form-group">
                <label htmlFor="otp">6-Digit OTP</label>
                <OtpInput value={otp} onChange={setOtp} />
            </div>
            <button type="submit" disabled={isLoading || otp.length !== 6} className="primary-btn">
                {isLoading ? <Spinner /> : 'Verify Email'}
            </button>

            <div className="resend-container">
                <button type="button" onClick={handleResendOtp} disabled={isLoading || resendCooldown > 0} className="secondary-btn">
                    {resendCooldown > 0 ? `Resend Available in ${resendCooldown}s` : 'Resend OTP'}
                </button>
            </div>
        </form>
    );

    return (
        <>
            <title>To Do App - Sign Up</title>
            <div className="auth-page">
                <div className="auth-container glass-card">
                    <h2>{isRegistered ? 'Verify OTP' : 'Create Account'}</h2>

                    {/* Conditionally render the correct form */}
                    {!isRegistered ? renderRegisterForm() : renderOtpForm()}

                    {/* Display loading, error, or success messages */}
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </div>
            </div>
        </>
    );
};

export default Register;