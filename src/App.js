import React, { useState, useEffect } from "react";
import { productsData } from "./products";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const whatsappNumber = "79202276898";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const categories = [
    "Все",
    "Есть в наличии",
    "Женская одежда",
    "Мужская одежда",
    "Детская одежда",
    "Обувь",
    "Продукты",
    "Сумки",
    "Текстиль",
    "Головные уборы",
    "Красота и уход",
  ];

  const filteredProducts =
    selectedCategory === "Все"
      ? productsData
      : selectedCategory === "Есть в наличии"
      ? productsData.filter((p) => p.status === "в наличии")
      : productsData.filter((p) => p.category === selectedCategory);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: isMobile ? 10 : 20,
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>🛍 PruzanShop</h1>

      {/* Категории */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
          justifyContent: "center",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              background: selectedCategory === cat ? "#667eea" : "white",
              color: selectedCategory === cat ? "white" : "black",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Сетка товаров */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, 1fr)"
            : "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, isMobile }) {
  const [swiperRef, setSwiperRef] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const images =
    product.images && product.images.length
      ? product.images
      : ["/images/placeholder.jpg"];

  const openModal = (img) => {
    if (isMobile && !modalOpen) {
      setModalImage(img);
      setModalOpen(true);
      window.history.pushState({ modal: true }, "");
    }
  };

  const closeModal = () => {
    if (modalOpen) {
      setModalOpen(false);
      if (isMobile && window.history.state && window.history.state.modal) {
        window.history.back();
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (modalOpen) setModalOpen(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [modalOpen]);

  return (
    <>
      <div
        style={{
          background: "white",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          minHeight: 360,
        }}
      >
        {/* Слайдер */}
        <Swiper
          onSwiper={setSwiperRef}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          style={{ width: "100%", height: "220px" }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt=""
                onClick={() => openModal(img)}
                style={{ width: "100%", height: "220px", objectFit: "cover" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Миниатюры */}
        <div
          style={{
            display: "flex",
            gap: 5,
            padding: 5,
            justifyContent: "center",
          }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              onClick={() => swiperRef?.slideTo(index)}
              style={{
                width: 36,
                height: 36,
                objectFit: "cover",
                cursor: "pointer",
                border:
                  activeIndex === index
                    ? "2px solid #667eea"
                    : "1px solid #ccc",
                borderRadius: 6,
              }}
            />
          ))}
        </div>

        {/* Информация */}
        <div
          style={{
            padding: 10,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <h3 style={{ fontSize: 16, margin: 0 }}>{product.name}</h3>

          <span
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: product.status === "в наличии" ? "green" : "orange",
              marginTop: 4,
            }}
          >
            {product.status === "в наличии" ? "В наличии" : "Под заказ"}
          </span>

          <p
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#555",
              whiteSpace: "pre-wrap",
              marginTop: 6,
              flexGrow: 1,
            }}
          >
            {product.description}
          </p>

          {/* Нижний блок: цена + кнопка на одном уровне */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <b style={{ fontSize: 14 }}>{product.price} ₽</b>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Хочу ${encodeURIComponent(
                product.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px",
                background: "#25D366",
                color: "white",
                textAlign: "center",
                borderRadius: 6,
                fontWeight: "bold",
                fontSize: 13,
                textDecoration: "none",
                display: "block",
              }}
            >
              Связаться
            </a>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={modalImage}
            alt=""
            style={{ maxWidth: "95%", maxHeight: "95%", objectFit: "contain" }}
          />
        </div>
      )}
    </>
  );
}
