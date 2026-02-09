import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, type AppDispatch, type RootState } from './store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import EntryPage from './components/EntryPage';
import Dashboard from './components/Dashboard';
import ClubDetail from './components/ClubDetail';
import EventDetail from './components/EventDetail';
import { fetchMe } from './store/authSlice';



function App() {

// const dispatch = useDispatch<AppDispatch>();
// const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

// useEffect(() => {
//   if (isAuthenticated) {
//     dispatch(fetchMe());
//   }
// }, [isAuthenticated]);

 const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMe());
    }
  }, [isAuthenticated]);

  return (
      <Router>
        <Routes>
          <Route path="/" element={<EntryPage />} />
          
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/club/:id" element={<ClubDetail />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </Router>
  );
}

export default App;