import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    mid: '',
    mpw: '',
    mpwConfirm: '', // 비밀번호 확인
    name: '',
    email: '',
    phone: '',
    address: '', // 주소 필드
    role: 'USER',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 체크 여부
  const [isIdAvailable, setIsIdAvailable] = useState(null); // 아이디 중복 체크 상태
  const [isEmailCheck, setIsEmailCheck] = useState(null); // 이메일 중복 체크 상태
  const [isPhoneCheck, setIsPhoneCheck] = useState(null); // 전화번호 중복 체크 상태
  const [isPasswordMatch, setIsPasswordMatch] = useState(null); // 비밀번호 일치 여부 (null: 확인 전, true: 일치, false: 불일치)
  const [openPostcode, setOpenPostcode] = useState(false); // 모달 창 상태
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // 각 필드별 중복 체크 초기화
    if (name === 'mid') {
      setIsIdChecked(false); // 아이디 변경 시 중복 체크 여부 초기화
      setIsIdAvailable(null);
    }
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
      .catch((error) => {
        console.error(`${type} 중복 체크 에러:`, error);
        setState(false);
      });
  };

  const checkIdAvailability = () => {
    if (!formData.mid) {
      alert('아이디를 입력해주세요.');
      return;
    }
    checkAvailability('id', formData.mid, setIsIdAvailable);
    setIsIdChecked(true); // 중복 체크를 한 상태로 변경
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
    if (formData.mpw && formData.mpwConfirm) {
      setIsPasswordMatch(formData.mpw === formData.mpwConfirm);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isIdChecked) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }

    if (isIdAvailable === false) {
      alert('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
      return;
    }
    if (isEmailCheck === false) {
      alert('이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.');
      return;
    }
    if (isPhoneCheck === false) {
      alert('이미 사용 중인 전화번호입니다. 다른 전화번호를 입력해주세요.');
      return;
    }
    if (isPasswordMatch === false) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!formData.address) {
      alert('주소를 입력해주세요.'); // 주소가 비어있으면 경고 메시지 출력
      return;
    }

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
          <button type="button" onClick={checkIdAvailability}>
            중복 체크
          </button>
          {isIdAvailable === true && (
            <span className="id-Check">사용 가능한 아이디입니다.</span>
          )}
          {isIdAvailable === false && (
            <span className="id-unCheck">이미 사용 중인 아이디입니다.</span>
          )}
        </label>
        <label>
          비밀번호:
          <input
            type="password"
            name="mpw"
            value={formData.mpw}
            onChange={handleChange}
            onBlur={handlePasswordBlur} // 포커스를 벗어날 때 비밀번호 확인
            required
          />
        </label>
        <label>
          비밀번호 확인:
          <input
            type="password"
            name="mpwConfirm"
            value={formData.mpwConfirm}
            onChange={handleChange}
            onBlur={handlePasswordBlur} // 포커스를 벗어날 때 비밀번호 확인
            required
          />
          {isPasswordMatch === true && (
            <span className="password-match">비밀번호가 일치합니다.</span>
          )}
          {isPasswordMatch === false && (
            <span className="password-unMatch">비밀번호가 일치하지 않습니다.</span>
          )}
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
            onBlur={checkEmailAvailability}
            required
          />
          {isEmailCheck === true && (
            <span className="email-Check">사용 가능한 이메일입니다.</span>
          )}
          {isEmailCheck === false && (
            <span className="email-unCheck">이미 사용 중인 이메일입니다.</span>
          )}
        </label>
        <label>
          전화번호:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={checkPhoneAvailability}
            required
          />
          {isPhoneCheck === true && (
            <span className="phone-Check">사용 가능한 전화번호입니다.</span>
          )}
          {isPhoneCheck === false && (
            <span className="phone-unCheck">
              이미 사용 중인 전화번호입니다.
            </span>
          )}
        </label>

        <label>주소:</label>
        <div className="postcode-container">
          <input
            type="text"
            name="address"
            value={formData.address}
            placeholder="주소를 검색하세요"
            readOnly
            required // 주소 필드도 필수로 지정
          />
          <button type="button" onClick={() => setOpenPostcode(true)}>
            주소검색
          </button>
        </div>
        <button type="submit" disabled={isSubmitting || isPasswordMatch === false}>
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
