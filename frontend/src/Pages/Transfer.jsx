import React, { useState } from 'react';
import '../styles/transfer.css';
import { useRecoilValue } from 'recoil';
import { recieverUser } from '../recoil/atom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Transfer() {
  const [amount, setAmount] = useState('');
  const { userId, name } = useRecoilValue(recieverUser);

  const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwtToken='));
  const jwtToken = jwtCookie ? jwtCookie.split('=')[1] : null;
  const navigate = useNavigate();


  const handleTransfer = async () => {
    const response = await axios.post('https://payment-app-r1ga.onrender.com/api/v1/account/transfer', {
      amount: amount,
      to: userId
    }, {
      headers: {
        Authorization: jwtToken
      }
    })

    console.log(response.data)

    alert('Transfer Completed')

    navigate('/');
  };

  return (
    <div className="transfer-card">
      <h2>Send Money</h2>
      <p className='sender-name'>
        <div className="name_icon">{name[0]}</div>
        {name}
      </p>
      <div className="amount-input">
        <label htmlFor="amount">Amount(in Rs)</label>
        <input
          type="number"
          id="amount"
          name="amount"
          placeholder='Enter amount'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={handleTransfer}>Initiate Transfer</button>
    </div>
  );
}

export default Transfer;
