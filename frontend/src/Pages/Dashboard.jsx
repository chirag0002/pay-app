import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { recieverUser } from '../recoil/atom';


function Dashboard() {

  const [balance, setBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const setReciever = useSetRecoilState(recieverUser);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const user_name = localStorage.getItem('user_name');

  const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwtToken='));
  const jwtToken = jwtCookie ? jwtCookie.split('=')[1] : null;
  let interval = null;


  useEffect(() => {
    async function users() {
      const response = await axios.get(`https://payment-app-r1ga.onrender.com/api/v1/user/bulk?filter=${filter}`, {
        headers: {
          Authorization: jwtToken
        }
      });
      setUsers(response.data.users)
    }

    users();
  }, [filter]);

  function searchFilter(e) {
    clearTimeout(interval);
    interval = setTimeout(async () => {
      setFilter(e.target.value);
    }, 1000)
  }

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('https://payment-app-r1ga.onrender.com/api/v1/account/balance', {
          headers: {
            Authorization: jwtToken
          }
        });
        setBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();

  }, [])

  function handleLogOut() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user_name');
    document.cookie = `jwtToken=; path=/;`;
    navigate('/signin');
  }


  return (
    <div className="dashboard-container">
      <div className="navbar">
        <h1 className="app-heading">Paytm</h1>
        <div className="user-info">
          {user_name}
          <div className="dropdown">
            <button onClick={toggleDropdown}>{user_name[0]}</button>
            {isOpen && (
              <div className="dropdown-content">
                <p onClick={handleLogOut}>Log Out</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="balance">Balance: <div>${balance}</div> </div>
      <div className="user-list">
        <h2>All Users</h2>
        <input className="search-bar" type="text" onChange={(e) => { searchFilter(e) }} placeholder="search user by name..." />
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <span>
                <button className="name_icons">{user.name[0] }</button>
                {user.name}
              </span>
              <Link to={'/transfer'} className="send-money-button" onClick={() => {
                setReciever({
                  userId: user.userId,
                  name: user.name.split(' ')[0]
                });
              }}>Send Money</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
