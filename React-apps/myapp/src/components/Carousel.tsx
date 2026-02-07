import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
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
        spaceBetween={30}
        slidesPerView={"auto"}
        centeredSlides={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
              }
            : false
        }
        effect={effect}
        loop={loop}
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
