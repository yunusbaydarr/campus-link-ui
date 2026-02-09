import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store/store'; 
import { loginUser , fetchMe} from '../store/authSlice'; 
import '../css/SignIn.css';

const SignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Gerekli'),
      password: Yup.string().required('Gerekli'),
    }),
    onSubmit: async (values) => {
      console.log("Giriş yapılıyor:", values);
      
      const resultAction = await dispatch(loginUser(values));

      if (loginUser.fulfilled.match(resultAction)) {
        dispatch(fetchMe());
        navigate('/dashboard');
      } else {
        console.log("Giriş başarısız oldu.");
      }
    },
  });

  return (
    <div className="signin-container">
      <div className="signin-cardWrapper">
        
        <div className="signin-leftPanel">
          <h1 className="signin-title">Welcome Back!</h1>
          <p className="signin-subtitle">Don't have an account yet?</p>

          <div className="signin-moodSection">
            <h2 className="signin-moodText">Get back in MOOD!</h2>
            <div className="signin-arrow">↳</div>
          </div>

          <div className="signin-emoji">😎</div>
        </div>

        <div className="signin-rightPanel">
          <h2 className="signin-formTitle">Sign In</h2>

          <form onSubmit={formik.handleSubmit} className="signin-form">
            <div className="signin-inputGroup">
              <div className="inputField">
                <input 
                  name="username" 
                  placeholder="Username" 
                  onChange={formik.handleChange} 
                  value={formik.values.username}
                />
                {formik.errors.username && <span className="error">{formik.errors.username}</span>}
              </div>
              
              <div className="inputField">
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  onChange={formik.handleChange} 
                  value={formik.values.password}
                />
                {formik.errors.password && <span className="error">{formik.errors.password}</span>}
              </div>
            </div>

            <p className="signin-forgotText">Forgot password?</p>

            <button type="submit" className="signin-submitBtn" disabled={isLoading}>
              {isLoading ? 'LOADING...' : 'SIGN IN'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SignIn;