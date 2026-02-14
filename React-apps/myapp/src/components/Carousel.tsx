import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";


import "swiper/swiper-bundle.css";

import "./Carousel.css";

interface CarouselProps {
  images: string[];
  autoplay?: boolean;
  autoplayDelay?: number;
  effect?: "slide" | "fade";
  loop?: boolean;
}

export default function Carousel({
  images,
  autoplay = true,
  autoplayDelay = 3000,
  effect = "slide",
  loop = true,
}: CarouselProps) {
  return (
    <div className="carousel-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={16}
        slidesPerView={1}
        centeredSlides={false}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
              }
            : false
        }
        breakpoints={{
          0: { spaceBetween: 8 },
          768: { spaceBetween: 12 },
          1024: { spaceBetween: 16 },
        }}
        effect={effect}
        loop={loop}
        resistanceRatio={0.85}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="carousel-slide">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="carousel-image"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
