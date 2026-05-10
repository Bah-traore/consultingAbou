import React from "react";
import { useSwiperSlide } from "swiper/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    image: "/img/slide1.jpg",
    title: "Conseil & Formation",
    subtitle: "Un accompagnement sur-mesure pour vos projets.",
  },
  {
    image: "/img/slide2.jpg",
    title: "Coaching personnalisé",
    subtitle: "Développez votre potentiel avec nos experts.",
  },
  {
    image: "/img/slide3.jpg",
    title: "Méthode & Rigueur",
    subtitle: "Des résultats concrets et mesurables.",
  },
];

export default function Slideshow() {
  return (
    <div className="w-full h-[350px] md:h-[500px] rounded-xl overflow-hidden shadow-lg mb-8">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        // effect="fade"
        // fadeEffect={{ crossFade: true }}
        speed={1200}
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <SlideContent slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function SlideContent({ slide }: { slide: { image: string; title: string; subtitle: string } }) {
  const swiperSlide = useSwiperSlide();
  // Masquer le contenu si la slide n'est pas active
  if (!swiperSlide.isActive) return null;
  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${slide.image})` }}
    >
      <div className="bg-black/60 p-6 rounded-xl text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
          {slide.title}
        </h2>
        <p className="text-lg md:text-2xl text-white drop-shadow">
          {slide.subtitle}
        </p>
      </div>
      <div className="absolute inset-0 bg-black/70 z-0" />
    </div>
  );
}
