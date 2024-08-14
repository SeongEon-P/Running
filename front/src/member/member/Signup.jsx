import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import './Signup.css'; // CSS 파일 임포트

const Signup = () => {
  const [formData, setFormData] = useState({
    mid: '',
    mpw: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'USER',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openPostcode, setOpenPostcode] = useState(false); // 모달 창 상태
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    axios
      .post('http://localhost:8080/members/signup', formData)
      .then(() => {
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      })
      .catch((error) => {
        console.error('회원가입 에러:', error);
        alert('회원가입에 실패했습니다.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setFormData({ ...formData, address: fullAddress });
    setOpenPostcode(false); // 주소 선택 후 모달 닫기
  };

  const handleCloseModal = () => {
    setOpenPostcode(false);
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원가입</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          아이디:
          <input
            type="text"
            name="mid"
            value={formData.mid}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          비밀번호:
          <input
            type="password"
            name="mpw"
            value={formData.mpw}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          이름:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          이메일:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          전화번호:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>주소:</label>
        <div className="postcode-container">
          <input
            type="text"
            name="address"
            value={formData.address}
            placeholder="주소를 검색하세요"
            readOnly
          />
          <button type="button" onClick={() => setOpenPostcode(true)}>
            주소검색
          </button>
        </div>
        <button type="submit" disabled={isSubmitting}>
          회원가입
        </button>
      </form>

      {/* 모달 창 */}
      {openPostcode && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="modal-close"
              onClick={() => setOpenPostcode(false)}
            >
              &times;
            </span>
            <DaumPostcode onComplete={handleComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
