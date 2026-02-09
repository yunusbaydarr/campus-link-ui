import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Camera } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store/store'; 
import { registerUser } from '../store/authSlice'; 
import '../css/SignUp.css';

const SignUp = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const formik = useFormik({
    initialValues: {
      name: '',
      // Last name backende gitmiyor DTO'da tek name var, 
      // istersen onSubmitte birleştirebilirsin.
      lastName: '', 
      username: '', 
      email: '',
      password: '',
      profilePicture: null as File | null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Zorunlu'),
      username: Yup.string().required('Zorunlu'),
      email: Yup.string().email('Geçersiz email').required('Zorunlu'),
      password: Yup.string().min(6, 'En az 6 karakter').required('Zorunlu'),
    }),
    onSubmit: async (values) => {
      const registerPayload = {
        name: `${values.name} ${values.lastName}`.trim(), 
        username: values.username,
        email: values.email,
        password: values.password
      };

      const resultAction = await dispatch(registerUser({ 
        values: registerPayload, 
        file: values.profilePicture 
      }));

      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/login');
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    formik.setFieldValue('profilePicture', file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="container">
      <div className="cardWrapper">

        <div className="backDecoration" />

        <div className="leftPanel">
          <h1 className="title">Hi There!</h1>
          <p className="subtitle">Already have an account?</p>

          <div className="clickEmojiSection">
            <h2 className="clickEmojiText">Up your MOOD!</h2>
            <div className="arrowIcon">↳</div>
          </div>

          <div className="emojiBadge">😜</div>
        </div>

        <div className="rightPanel">
          <h2 className="formTitle">Sign Up</h2>

          <form onSubmit={formik.handleSubmit} className="form">

            <div className="photoUploadContainer">
              <div
                className="photoCircle"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} className="previewImg" alt="Profile" />
                ) : (
                  <Camera size={32} />
                )}
              </div>

              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
              />

              <span className="photoLabel">Profil Fotoğrafı Seç</span>
            </div>

            <div className="inputGroup">
              <input 
                name="name" 
                placeholder="First Name" 
                onChange={formik.handleChange} 
                value={formik.values.name}
              />
              
              <input 
                name="lastName"
                placeholder="Last Name" 
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />

              <input 
                name="username"
                placeholder="Username" 
                onChange={formik.handleChange}
                value={formik.values.username}
              />

              <input 
                name="email" 
                placeholder="Email" 
                onChange={formik.handleChange} 
                value={formik.values.email}
              />

              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={formik.handleChange} 
                value={formik.values.password}
              />
            </div>

            <p className="alreadyText">Already have an Account?</p>

            <button type="submit" className="submitBtn" disabled={isLoading}>
               {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;