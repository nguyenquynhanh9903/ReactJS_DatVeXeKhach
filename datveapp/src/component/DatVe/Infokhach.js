import React, { useState } from 'react';

const CustomerForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [diachi, setDiaChi] = useState('');
  const [dienthoai, setDienThoai] = useState('');
  const [CMND, setCMND] = useState('');

  const handleAddCustomer = () => {
    if (name && email && diachi && dienthoai && CMND) {
      const customer = { name, email, diachi, dienthoai, CMND };
      onSubmit(customer);
      setName('');
      setEmail('');
      setDiaChi('');
      setDienThoai('');
      setCMND('');
    } else {
      alert('Vui lòng điền đầy đủ thông tin khách hàng!');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Thông Tin Khách Hàng</h2>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={e => setName(e.target.value)}
        style={styles.input}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Điện Thoại"
        value={dienthoai}
        onChange={e => setDienThoai(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Địa Chỉ"
        value={diachi}
        onChange={e => setDiaChi(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Căn cước công dân"
        value={CMND}
        onChange={e => setCMND(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleAddCustomer} style={styles.button}>Thêm Khách Hàng</button>
    </div>
  );
};


const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    fontSize: '18px',
    marginBottom: '20px',
    marginTop: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue'
  },
  input: {
    height: '40px',
    borderColor: 'gray',
    borderWidth: '1px',
    marginBottom: '10px',
    padding: '5px',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box'
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#BF6B7B',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default CustomerForm;