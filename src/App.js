import React, { useState } from "react";

// Función de debounce
const debounce = (func, delay) => {
  let timeoutId; //Variable para almacenar el id del temporizador
  return (...args) => {
    clearTimeout(timeoutId);//Si se llama de nuevo, se cancela el temporizador anterior
    timeoutId = setTimeout(() => { // Establece un nuevo temporizador
      func(...args);  // Ejecuta la función original después del retraso
    }, delay);
  };
};

const App = () => {
  const [query, setQuery] = useState(""); // Texto ingresado por el usuario
  const [images, setImages] = useState([]); // Imágenes de perros obtenidas
  const [error, setError] = useState(null); // Mensaje de error si ocurre

  // Función para buscar imágenes por raza
  const fetchDogImages = async (breed) => {
    if (breed.trim() === "") { // Si no escribe nada, limpiamos las imágenes y el error
      setImages([]);
      setError(null);
      return;
    }

    try {
      const response = await fetch(
       `https://dog.ceo/api/breed/${breed.toLowerCase()}/images`
      );

      const data = await response.json();

      if (data.status === "error") {
        throw new Error("No se encontró esta raza de perro");
      }

      setImages(data.message.slice(0, 5)); // Muestra las primeras 5 imágenes
      setError(null); // Resetea los errores
    } catch (err) {
      setImages([]);
      setError(err.message); // Muestra el mensaje de error
    }
  };

  // Aplica debounce a la función de búsqueda
  const debouncedFetch = debounce(fetchDogImages, 500);

  // Maneja el cambio en el campo de texto
  const handleInputChange = (e) => {
    const value = e.target.value; // Guarda lo que se escribe 
    setQuery(value);// Actualiza  el estado con lo que se ha escrito
    debouncedFetch(value); // Llama a la función de búsqueda con debounce
  };

  return (


    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh", 
      textAlign: "center" 
    }}>
      <h1>Buscar imágenes de perros</h1>
      <input
        type="text"
        placeholder="Escribir una raza de perro (bulldog, husky, beagle, pug, terrier, poodle, akita)"
        value={query}
        onChange={handleInputChange}
        style={{
          width: "50%",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />
      <div>
        {images.length > 0 ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "10px" 
          }}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="Dog"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            ))}
          </div>
        ) : error ? (
          <p style={{ color: "green" }}>{error}</p>
        ) : (
          <p>PERROS BONITOS Y SUS RAZAS</p>
        )}
      </div>
    </div>
    
  );
};

export default App;
