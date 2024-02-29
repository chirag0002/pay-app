import React, { useState } from 'react';
import '../styles/signup.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    async function submitForm(e) {
        e.preventDefault();
        try {
            const response = await axios.post('https://payment-app-r1ga.onrender.com/api/v1/user/signup', {
                username: username,
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            },{
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            console.log('Sign up successful!');

            localStorage.setItem('user_name', response.data.user.first_name);
            localStorage.setItem('isAuthenticated', true);

            document.cookie = `jwtToken=${response.data.token}; path=/;`;

            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setUsername('');

            navigate('/');
            window.location.reload();
        } catch (err) {
            console.log('Error submitting form');
        }
    }

    return (
        <div className="container">
            <h2>Sign Up</h2>
            <form action="submit_signup_form.php" onSubmit={submitForm}>

                <div className="form-group">
                    <label htmlFor="first-name">First Name</label>
                    <input type="text" id="first-name" name="first-name" required
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="last-name">Last Name</label>
                    <input type="text" id="last-name" name="last-name" required
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Sign Up</button>
            </form>
            <div> Already have an acoount 
                <Link to="/signin">SignIn</Link>
            </div>
        </div>
    );
}


export default SignUp;
