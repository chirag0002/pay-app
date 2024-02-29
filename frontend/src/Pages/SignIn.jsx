import React, { useState } from 'react';
import '../styles/signup.css'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function submitForm(e) {
        e.preventDefault(); 
        
        try {
            const response = await axios.post('https://payment-app-r1ga.onrender.com/api/v1/user/signin', {
                email: email,
                password: password
            });

            console.log('Sign in successful!');

            localStorage.setItem('user_name', response.data.user.first_name);
            localStorage.setItem('isAuthenticated', true);

            document.cookie = `jwtToken=${response.data.token}; path=/;`;

            setEmail('');
            setPassword('');

            navigate('/');
            // window.location.reload();
        } catch (error) {
            console.error('Error signing in:', error);
        }
    }

    return (
        <div className="container">
            <h2>Sign In</h2>
            <form onSubmit={submitForm}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Sign In</button>
            </form>
            <div> Don't have an account 
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
}

export default SignIn;
