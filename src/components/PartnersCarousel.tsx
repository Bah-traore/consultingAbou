import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Ajoutez ici les chemins de vos logos partenaires
const partners = [
  { src: "/img/partner1.png", alt: "Partenaire 1" },
  { src: "/img/partner2.png", alt: "Partenaire 2" },
  { src: "/img/partner3.png", alt: "Partenaire 3" },
  { src: "/img/partner4.png", alt: "Partenaire 4" },
  { src: "/img/partner5.png", alt: "Partenaire 5" },
];

export default function PartnersCarousel() {
  return (
    <div className="mx-auto w-[700px] max-w-full py-8">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={3}
        spaceBetween={30}
        loop
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        speed={3500}
        allowTouchMove={true}
        className="w-full"
      >
        {partners.map((partner, idx) => (
          <SwiperSlide key={idx} className="flex justify-center items-center">
            <img
              src={partner.src}
              alt={partner.alt}
              className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
