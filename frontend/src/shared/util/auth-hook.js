import React , {useState, useCallback , useEffect} from 'react';


let logoutTimer;
const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [expire, setExpire] = useState(null);

  const login = (uid, token, expirationDate) => {
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpire(tokenExpirationDate);
    console.log(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    setUserId(null);
    setToken(null);
  };

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      const val = JSON.parse(localStorage.getItem("userData"));
      if (val && val.token && new Date(val.expiration) > new Date()) {
        login(val.id, val.token, new Date(val.expiration));
      }
    }
  }, []);

  useEffect(() => {
    if (token && expire) {
      const remainTime = expire.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, expire]);

  return { userId, token, expire, login, logout };
};

export default useAuth;
