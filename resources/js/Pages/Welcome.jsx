import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };


    
    const [currentSlide, setCurrentSlide] = useState(0);
  
  const newsItems = [
    {
      location: 'Policiaca',
      date: '11/11/2025',
      title: 'Levantan a un hombre en la Riveras',
      author: 'Gabriel Reyes',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80'
    },
    {
      location: 'Juárez',
      date: '10/11/2025',
      title: 'Incrementan operativos de seguridad en la zona centro',
      author: 'María López',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80'
    },
    {
      location: 'Estado',
      date: '09/11/2025',
      title: 'Anuncian nuevas medidas de prevención',
      author: 'Carlos Mendoza',
      image: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=400&q=80'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  return (
    <div className="container rounded p-5 my-5 bg-accent2" style={{ 
      backgroundColor: '#c4a57b',
      fontFamily: 'Georgia, serif',
      
    }}>
      {/* Sección principal */}
      <div className="row g-0 align-items-center" style={{ 
        minHeight: '220px',
        backgroundColor: '#c4a57b'
      }}>
        <div className="col-md-5">
          <img 
            src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&q=80" 
            alt="Escena en Juárez" 
            className="img-fluid w-100"
            style={{ 
              height: '220px',
              objectFit: 'cover'
            }}
          />
        </div>
        
        <div className="col-md-7 p-4 ps-md-5">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span style={{ 
              fontSize: '0.95rem',
              color: '#333',
              fontWeight: '500'
            }}>
              Juárez
            </span>
            <span style={{ 
              fontSize: '0.85rem',
              color: '#666'
            }}>
              23 Sep, 2025
            </span>
          </div>
          
          <h1 className="mb-3" style={{ 
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#2d2d2d',
            lineHeight: '1.2'
          }}>
            Vincularon a 86 policías municipales en casi 11 años
          </h1>
          
          <p className="mb-0" style={{ 
            fontSize: '0.9rem',
            color: '#444'
          }}>
            <span style={{ fontWeight: '600' }}>Autor:</span> Sandra Rodríguez
          </p>
        </div>
      </div>

      {/* Carrusel de Noticias del día */}
      <div style={{ 
        backgroundColor: '#d4b896',
        padding: '20px 0'
      }}>
        <div className="container">
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#2d2d2d',
            marginBottom: '20px',
            paddingLeft: '15px'
          }}>
            Noticias del día
          </h2>

          <div className="position-relative">
            <div className="row g-0 align-items-center">
              {/* Botón anterior */}
              <div className="col-1 d-flex justify-content-center">
                <button className='bg-danger'
                  onClick={prevSlide}
                  style={{
                    border: 'none',
                    color: 'white',
                    fontSize: '2rem',
                    width: '50px',
                    height: '130px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ‹
                </button>
              </div>

              {/* Contenido del carrusel */}
              <div className="col-10">
                <div className="row g-0 align-items-center" style={{
                  backgroundColor: '#d4b896',
                  minHeight: '130px'
                }}>
                  <div className="col-md-3">
                    <img
                      src={newsItems[currentSlide].image}
                      alt={newsItems[currentSlide].title}
                      style={{
                        width: '100%',
                        height: '130px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div className="col-md-9 p-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{
                        fontSize: '0.9rem',
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        {newsItems[currentSlide].location}
                      </span>
                      <span style={{
                        fontSize: '0.85rem',
                        color: '#666'
                      }}>
                        {newsItems[currentSlide].date}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#2d2d2d',
                      marginBottom: '10px'
                    }}>
                      {newsItems[currentSlide].title}
                    </h3>
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#444',
                      margin: 0
                    }}>
                      <span style={{ fontWeight: '600' }}>Autor:</span> {newsItems[currentSlide].author}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón siguiente */}
              <div className="col-1 d-flex justify-content-center">
                <button className='bg-danger'
                  onClick={nextSlide}
                  style={{
                    border: 'none',
                    color: 'white',
                    fontSize: '2rem',
                    width: '50px',
                    height: '130px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}