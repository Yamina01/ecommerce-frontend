import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.scss';
import Header from '../../Common/Header/Header';
import Footer from '../../Common/Footer/Footer';

function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [editMode, setEditMode] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: '',
        phone: ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
    try {
        console.log('🔄 Starting fetchUserProfile...');
        
        const token = localStorage.getItem('token');
        console.log('🔐 Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
        
        if (!token) {
            setError('Please login to view your profile');
            setLoading(false);
            return;
        }

        // Test if backend is reachable first
        try {
            await axios.get(`${process.env.REACT_APP_API_URL}`, { timeout: 3000 });
        } catch (err) {
            if (err.code === 'ERR_CONNECTION_REFUSED') {
                setError('Backend server is not running. Please start the Spring Boot application.');
                setLoading(false);
                return;
            }
        }

        console.log('🌐 Making profile API call...');
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        console.log('✅ Profile API Response:', response);
        
        if (response.data) {
            setUser(response.data);
            setProfileForm({
                name: response.data.name || '',
                phone: response.data.phone || ''
            });
        } else {
            setError('Profile data is empty');
        }
        
    } catch (err) {
        console.error('❌ Profile fetch error:', err);
        
        if (err.code === 'ERR_CONNECTION_REFUSED') {
            setError('Cannot connect to backend server. Make sure it\'s running on port 8080.');
        } else if (err.response?.status === 401) {
            setError('Session expired. Please login again.');
            localStorage.removeItem('token');
        } else if (err.response?.status === 403) {
            setError('Access denied. You don\'t have permission to view profiles.');
        } else if (err.response?.status === 404) {
            setError('Profile endpoint not found. Check your backend routes.');
        } else if (err.response?.data) {
            setError(`Server error: ${err.response.data.message || JSON.stringify(err.response.data)}`);
        } else {
            setError(`Failed to load profile: ${err.message}`);
        }
    } finally {
        setLoading(false);
    }
};
   
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `process.env.REACT_APP_API_URL}/api/users/profile`,
                profileForm,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            setUser(response.data);
            setEditMode(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            if (err.code === 'ERR_CONNECTION_REFUSED') {
                alert('Backend server is not running. Please start the server.');
            } else {
                alert('Failed to update profile');
            }
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('New passwords do not match'); 
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            alert('Password must be at least 6 characters long'); 
            return;
        }

        try {
            const token = localStorage.getItem('token');
        
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/users/change-password`,
                {
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            alert('Password changed successfully!');
        } catch (err) {
            console.error('Error changing password:', err);
            if (err.code === 'ERR_CONNECTION_REFUSED') {
                alert('Backend server is not running. Please start the server.');
            } else {
                alert(err.response?.data?.message || 'Failed to change password');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleRetry = () => {
        setLoading(true);
        setError('');
        fetchUserProfile();
    };

  


    if (loading) {
        return (
            <div>
                <Header />
                <div className="loading-container">
                    <div className="loading">Loading your profile...</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="user-profile-page">
                <div className="profile-container">
                    <h1>My Account</h1>
                    
                    {error && (
                        <div className="error-message">
                            <div className="error-text">{error}</div>
                            <div className="error-actions">
                                <button onClick={handleRetry} className="retry-btn">
                                    Retry
                                </button>
                             
                            </div>
                        </div>
                    )}

                    <div className="profile-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                            onClick={() => setActiveTab('password')}
                        >
                            Password
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => window.location.href = '/orders'}
                        >
                            Orders
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'profile' && (
                            <div className="profile-section">
                                <div className="section-header">
                                    <h2>Personal Information</h2>
                                    {!editMode && (
                                        <button 
                                            className="edit-btn"
                                            onClick={() => setEditMode(true)}
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                                {editMode ? (
                                    <form onSubmit={handleProfileUpdate} className="profile-form">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    name: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                value={user?.email || ''}
                                                disabled
                                                className="disabled-input"
                                            />
                                            <small>Email cannot be changed</small>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                value={profileForm.phone}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    phone: e.target.value
                                                })}
                                            />
                                        </div>

                                        <div className="form-actions">
                                            <button type="submit" className="save-btn">
                                                Save Changes
                                            </button>
                                            <button 
                                                type="button" 
                                                className="cancel-btn"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setProfileForm({
                                                        name: user?.name || '',
                                                        phone: user?.phone || ''
                                                    });
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="profile-info">
                                        <div className="info-item">
                                            <strong>Name:</strong>
                                            <span>{user?.name || 'Not provided'}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Email:</strong>
                                            <span>{user?.email}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Phone:</strong>
                                            <span>{user?.phone || 'Not provided'}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Member since:</strong>
                                            <span>{formatDate(user?.registrationDate)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="password-section">
                                <h2>Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="password-form">
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({
                                                ...passwordForm,
                                                currentPassword: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({
                                                ...passwordForm,
                                                newPassword: e.target.value
                                            })}
                                            required
                                            minLength="6"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({
                                                ...passwordForm,
                                                confirmPassword: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="change-password-btn">
                                        Change Password
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UserProfile;