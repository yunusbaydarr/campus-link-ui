import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { dataService } from '../../api/dataService';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../../store/eventSlice';
import type{ AppDispatch, RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import './Modal.css';

interface Props {
  onClose: () => void;
}

const CreateEventModal: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { clubs } = useSelector((state: RootState) => state.club);
  
  const myClubs = clubs.filter(c => c.createdByUserId === user?.id);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      formik.setFieldValue('file', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      location:'',
      date: '',
      clubId: myClubs.length > 0 ? myClubs[0].id : '', 
      file: null
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      date: Yup.string().required('Required'),
      clubId: Yup.string().required('Select a club'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
     

      const eventJson = JSON.stringify({
        title: values.title,
        description: values.description,
        location:values.location,
        date: values.date, 
        clubId: values.clubId 
      });

      const eventBlob = new Blob([eventJson], { type: 'application/json' });
      formData.append('event', eventBlob);

      if (values.file) {
        formData.append('image', values.file);
      }

      try {
         await dataService.createEvent(Number(values.clubId), formData); 
         
         dispatch(getAllEvents());
         navigate('/dashboard');
      } catch (error) {
        console.error(error);
        alert("Failed to create event.");
      }
    },
  });
  return (
      <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Create a New Event</h2>

        {myClubs.length === 0 ? (
            <p style={{textAlign:'center', color:'red'}}>You need to be an admin of a club to create events.</p>
        ) : (
            <form onSubmit={formik.handleSubmit} className="modal-form">
            <div className="form-group">
                <label>Select Hosting Club</label>
                <select name="clubId" onChange={formik.handleChange} value={formik.values.clubId}>
                {myClubs.map(club => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                ))}
                </select>
            </div>

            <div className="form-group">
                <label>Event Title</label>
                <input name="title" onChange={formik.handleChange} value={formik.values.title} />
            </div>

            <div className="form-group">
                <label>Location</label>
                <input name="location" onChange={formik.handleChange} value={formik.values.location} />
            </div>

            <div className="form-group">
                <label>Date & Time</label>
                <input type="datetime-local" name="date" onChange={formik.handleChange} value={formik.values.date} />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea name="description" rows={4} onChange={formik.handleChange} value={formik.values.description} />
            </div>

            <div className="form-group">
                <label>Event Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{width: 100, height: 100, objectFit: 'cover', marginTop: 10, borderRadius: '10px'}} />
                )}
            </div>

            <button type="submit" className="modal-submit-btn">Create Event</button>
            </form>
        )}
      </div>
    </div>
  );
};

export default CreateEventModal;