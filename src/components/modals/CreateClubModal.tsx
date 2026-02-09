import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { dataService } from '../../api/dataService';
import { useDispatch } from 'react-redux';
import { getAllClubs } from '../../store/clubSlice'; 
import type { AppDispatch } from '../../store/store';
import './Modal.css';

interface Props {
  onClose: () => void;
}

const CreateClubModal: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      file: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Club name is required'),
      description: Yup.string().max(1000, 'Max 1000 characters').required('Description is required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      
      const clubJson = JSON.stringify({
        name: values.name,
        description: values.description,
      });
      
      const clubBlob = new Blob([clubJson], { type: 'application/json' });
      formData.append('club', clubBlob);

      if (values.file) {
        formData.append('file', values.file);
      }

      try {
        await dataService.createClub(formData);
        dispatch(getAllClubs());
        window.location.href = '/dashboard'; 
      } catch (error) {
        console.error("Club creation failed", error);
        alert("Failed to create club.");
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      formik.setFieldValue('file', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Create a New Club</h2>
        
        <form onSubmit={formik.handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Club Name</label>
            <input name="name" onChange={formik.handleChange} value={formik.values.name} placeholder="Ex: Astronomy Club" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows={4} onChange={formik.handleChange} value={formik.values.description} placeholder="What is this club about?" />
          </div>

          <div className="form-group">
            <label>Club Logo</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" style={{width: 100, height: 100, objectFit: 'cover', marginTop: 10, borderRadius: '10px'}} />}
          </div>

          <button type="submit" className="modal-submit-btn">Create Club</button>
        </form>
      </div>
    </div>
  );
};

export default CreateClubModal;