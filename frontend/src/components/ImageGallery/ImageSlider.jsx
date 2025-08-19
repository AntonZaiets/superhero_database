import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './ImageSlider.css';

export const ImageSlider = ({ images, nickname, id }) => {
  if (!images?.length) {
    return (
      <div className="image-slider-empty">
        <div>
          <div>📸</div>
          <div>No images available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-slider">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        }}
        loop={images.length > 1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="slide"
        speed={600}
        grabCursor
        a11y={{
          prevSlideMessage: 'Previous image',
          nextSlideMessage: 'Next image',
          paginationBulletMessage: 'Go to slide {{index}}',
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image?.fileId || image || index} className="image-item">
            <img
              src={(() => {
                if (image.isLocal) return image.previewUrl;
                if (id) return `/api/superheroes/${id}/images/${image.fileId}`;
                return image;
              })()}
              alt={`${nickname} ${index + 1}`}
              loading="lazy"
              onError={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
                e.target.alt = 'Image failed to load';
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
