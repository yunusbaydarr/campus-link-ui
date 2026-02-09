import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../css/CardStyles.css';

interface SectionSliderProps {
    title: string;
    items: React.ReactNode[];
}

const SectionSlider: React.FC<SectionSliderProps> = ({ title, items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 3; 
    const nextSlide = () => {
        if (currentIndex + itemsPerPage < items.length) {
            setCurrentIndex(prev => prev + itemsPerPage);
        }
    };

    const prevSlide = () => {
        if (currentIndex - itemsPerPage >= 0) {
            setCurrentIndex(prev => prev - itemsPerPage);
        }
    };

    const isPrevDisabled = currentIndex === 0;
    const isNextDisabled = currentIndex + itemsPerPage >= items.length;

    return (
        <div className="slider-section">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
            </div>

            {!isPrevDisabled && (
                <button className="slider-btn btn-prev" onClick={prevSlide}>
                    <ChevronLeft size={24} />
                </button>
            )}

            <div className="slider-container">
                <div 
                    className="slider-track"
                    style={{ 
                        transform: `translateX(-${(currentIndex * (100 / itemsPerPage))}%)`
                    }}
                >
                    {items.map((item, index) => (
                        <div key={index} className="card-wrapper" style={{ minWidth: 'calc(33.3333% - 15px)' }}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {!isNextDisabled && (
                <button className="slider-btn btn-next" onClick={nextSlide}>
                    <ChevronRight size={24} />
                </button>
            )}
        </div>
    );
};

export default SectionSlider;