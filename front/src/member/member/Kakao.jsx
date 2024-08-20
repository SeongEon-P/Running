const CLIENT_ID = '4ef446a79d53d180b43311c6b5a4ff46'
const REDIRECT_URI =
  'http://localhost:3000/login/oauth2/code/kakao'


export const KAKAO_AUTH_URL = 
  `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`