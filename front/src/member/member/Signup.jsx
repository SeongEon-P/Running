import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import './Signup.css';
import signupBg from '../../assets/img_src/signup_bg.png'; // 배경 이미지 import
import signupImg from '../../assets/img_src/signup_img.png'; // 회원가입 이미지 import
import logo from '../../assets/logo/running_logo.png'; // 로고 이미지 import

const Signup = () => {
  const [formData, setFormData] = useState({
    mid: '',
    mpw: '',
    mpwConfirm: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'USER',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [isEmailCheck, setIsEmailCheck] = useState(null);
  const [isPhoneCheck, setIsPhoneCheck] = useState(null);
  const [isPasswordMatch, setIsPasswordMatch] = useState(null);
  const [openPostcode, setOpenPostcode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'mid') setIsIdAvailable(null);
    if (name === 'email') setIsEmailCheck(null);
    if (name === 'phone') setIsPhoneCheck(null);
  };

  const checkAvailability = (type, value, setState) => {
    axios
      .get('http://localhost:8080/members/checked', {
        params: { type, value },
      })
      .then((response) => {
        setState(response.data);
      })
      .catch(() => {
        setState(false);
      });
  };

  const checkIdAvailability = () => {
    if (!formData.mid) return;
    checkAvailability('id', formData.mid, setIsIdAvailable);
  };

  const checkEmailAvailability = () => {
    if (!formData.email) return;
    checkAvailability('email', formData.email, setIsEmailCheck);
  };

  const checkPhoneAvailability = () => {
    if (!formData.phone) return;
    checkAvailability('phone', formData.phone, setIsPhoneCheck);
  };

  const handlePasswordBlur = () => {
    setIsPasswordMatch(formData.mpw === formData.mpwConfirm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (isIdAvailable === false) {
      alert('이미 사용 중인 아이디입니다.');
      return;
    }
    if (isEmailCheck === false) {
      alert('이미 사용 중인 이메일입니다.');
      return;
    }
    if (isPhoneCheck === false) {
      alert('이미 사용 중인 전화번호입니다.');
      return;
    }
    if (isPasswordMatch === false) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!formData.address) {
      alert('주소를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    axios
      .post('http://localhost:8080/members/signup', formData)
      .then(() => {
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      })
      .catch(() => {
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
      if (data.bname) extraAddress += data.bname;
      if (data.buildingName) extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
      fullAddress += extraAddress ? ` (${extraAddress})` : '';
    }

    setFormData({ ...formData, address: fullAddress });
    setOpenPostcode(false);
  };

  return (
    <div className="signup-wrapper" style={{ backgroundImage: `url(${signupBg})` }}>
      <div className="signup-inner">
        <div className="signup-image-holder">
          <img src={signupImg} alt="Signup" />
        </div>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-title">
            <img src={logo} alt="Logo" className="logo" />
            <h3>회원가입</h3>
          </div>

          <div className="form-group">
            <div className="form-wrapper">
              <input
                type="text"
                name="mid"
                value={formData.mid}
                onChange={handleChange}
                placeholder="아이디"
                required
                className="input-mid"
              />
            </div>
            <button type="button" className="check-button" onClick={checkIdAvailability}>
              중복 체크
            </button>
          </div>
          {isIdAvailable === true && <span className="id-Check">사용 가능한 아이디입니다.</span>}
          {isIdAvailable === false && <span className="id-unCheck">이미 사용 중인 아이디입니다.</span>}

          <div className="form-wrapper">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름"
              required
            />
          </div>
          <div className="form-wrapper">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={checkEmailAvailability}
              placeholder="이메일"
              required
            />
          </div>
          {isEmailCheck === true && <span className="email-Check">사용 가능한 이메일입니다.</span>}
          {isEmailCheck === false && <span className="email-unCheck">이미 사용 중인 이메일입니다.</span>}

          <div className="form-wrapper">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={checkPhoneAvailability}
              placeholder="전화번호"
              required
            />
          </div>
          {isPhoneCheck === true && <span className="phone-Check">사용 가능한 전화번호입니다.</span>}
          {isPhoneCheck === false && <span className="phone-unCheck">이미 사용 중인 전화번호입니다.</span>}

          <div className="form-wrapper">
            <input
              type="password"
              name="mpw"
              value={formData.mpw}
              onChange={handleChange}
              placeholder="비밀번호"
              onBlur={handlePasswordBlur}
              required
            />
          </div>
          <div className="form-wrapper">
            <input
              type="password"
              name="mpwConfirm"
              value={formData.mpwConfirm}
              onChange={handleChange}
              placeholder="비밀번호 확인"
              onBlur={handlePasswordBlur}
              required
            />
          </div>
          {isPasswordMatch === true && <span className="password-match">비밀번호가 일치합니다.</span>}
          {isPasswordMatch === false && <span className="password-unMatch">비밀번호가 일치하지 않습니다.</span>}

          <div className="form-wrapper">
            <input
              type="text"
              name="address"
              value={formData.address}
              placeholder="주소"
              readOnly
              required
            />
            <button type="button" className="check-button" onClick={() => setOpenPostcode(true)}>
              주소 검색
            </button>
          </div>

          <button type="submit" className="check-button" disabled={isSubmitting || isPasswordMatch === false}>
            회원가입
          </button>
        </form>

        {openPostcode && (
          <div className="modal">
            <div className="modal-content">
              <span className="modal-close" onClick={() => setOpenPostcode(false)}>
                &times;
              </span>
              <DaumPostcode onComplete={handleComplete} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
