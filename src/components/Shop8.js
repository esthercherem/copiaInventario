import React, { useState, useEffect } from 'react';
 
import Sidebar from './Sidebar';
import Modal from './Modal'
import '../styles/Shop.css'

const Shop = ({ items,  onSellItem }) => {
  const [searchText, setSearchText] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [inputValue, setInputValue] = useState('');
    const [clientInfo, setClientInfo] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [saleInfo, setSaleInfo] = useState('');
    const [soldItems, setSoldItems] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [exchangeRate, setExchangeRate] = useState(1); 




  const handleTextSearch = () => {
    const sanitizedSearchText = searchText
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúüñ\s]/g, ''); // Eliminar caracteres especiales

    const filtered = items.filter((item) => {
      for (const key in item) {
        if (item[key].toString().toLowerCase().includes(sanitizedSearchText)) {
          return true;
        }
      }
      return false;
    });

    setFilteredItems(filtered);
  };

  const handlePriceSearch = () => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    const filtered = items.filter((item) => {
      const itemPrice = parseFloat(item.price);
      return itemPrice >= min && itemPrice <= max;
    });

    setFilteredItems(filtered);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setMinPrice('');
    setMaxPrice('');
    setFilteredItems(items);
  };

  const getTotalCost = () => {
    const totalCost = filteredItems.reduce(
      (acc, item) => acc + parseFloat(item.cost),
      0
    );
    return totalCost.toFixed(2);
  };

  const getCompanyCounts = (company) => {
    const companyCount = filteredItems.filter(
      (item) => item.company === company
    ).length;
    return companyCount;
  };

  const getCompanyTotalCost = (company) => {
    const companyTotalCost = filteredItems
      .filter((item) => item.company === company)
      .reduce((acc, item) => acc + parseFloat(item.cost), 0);
    return companyTotalCost.toFixed(2);
  };

  const getTypeCounts = (type) => {
    const typeCount = filteredItems.filter((item) => item.type === type).length;
    return typeCount;
  };

  const getPlaceCounts = (place) => {
    const placeCount = filteredItems.filter(
      (item) => item.placeOfPurchase === place
    ).length;
    return placeCount;
  };

  const handleSell = (item) => {
    
    // Agregar el artículo a la lista de artículos vendidos
    onSellItem(item);

    // Eliminar el artículo del inventario filtrado y de los elementos mostrados
    const updatedItems = filteredItems.filter((i) => i.code !== item.code);
    setFilteredItems(updatedItems);
    fetchExchangeRate(); 
  };


//   const handleSell = (item) => {
//     // Agregar el artículo a la lista de artículos vendidos
//     setSoldItems((prevSoldItems) => [...prevSoldItems, item]);
  
//     // Eliminar el artículo del inventario filtrado y de los elementos mostrados
//     const updatedItems = filteredItems.filter((i) => i.code !== item.code);
//     setFilteredItems(updatedItems);
  
//     // Actualizar el resumen para incluir el contador de artículos vendidos
//     const updatedSummary = {
//       ...summary,
//       soldItemsCount: soldItems.length + 1, // Agregar 1 al contador de artículos vendidos
//     };}

  const calculateSummary = () => {
    return {
      totalProducts: filteredItems.length,
      totalCost: getTotalCost(),
      companies: {
        Param: { count: getCompanyCounts('Param'), totalCost: getCompanyTotalCost('Param') },
        Dina: { count: getCompanyCounts('Dina'), totalCost: getCompanyTotalCost('Dina') },
        Kine: { count: getCompanyCounts('Kine'), totalCost: getCompanyTotalCost('Kine') },
        Bat: { count: getCompanyCounts('Bat'), totalCost: getCompanyTotalCost('Bat') },
      },
      types: {
        Collar: getTypeCounts('Collar'),
        Pulsera: getTypeCounts('Pulsera'),
        Aretes: getTypeCounts('Aretes'),
      },
      places: {
        MIA: getPlaceCounts('MIA'),
        NY: getPlaceCounts('NY'),
        LA: getPlaceCounts('LA'),
      },
    };
  };

  const summary = calculateSummary();

  // modal

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    fetchExchangeRate();
  };

  
  


// input de cliente y precio de venta
const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSalePriceChange = (event) => {
      setSalePrice(event.target.value);
    };
  
  const handleKeyPress = (event, item) => {
      if (event.key === 'Enter' && inputValue.trim() !== '') {
          const updatedItem = {
              ...item,
              cliente: inputValue,
              vendido: true,
              clientInfo: `cliente: ${inputValue}`, 
             
            };
      
            setClientInfo(`cliente: ${inputValue}`);
            setInputValue('');
            setSaleInfo(`Precio de Venta: ${salePrice}`);
            setSoldItems((prevSoldItems) => [...prevSoldItems, updatedItem]);
          }
        };
  

    const handleSalePriceKeyPress = (event, item) => {
      if (event.key === 'Enter' && salePrice.trim() !== '') {

           const updatedItem = {
      ...item,
      precioVenta: salePrice,
      vendido: true,
      saleInfo: `Precio de Venta: ${salePrice}`
    };

    setClientInfo(`cliente: ${inputValue}`);
    setInputValue('');
    setSaleInfo(`Precio de Venta: ${salePrice}`);
    setSoldItems((prevSoldItems) => [...prevSoldItems, updatedItem]);
  }
};


// API CONVERTIR DLS A PESOS

const fetchExchangeRate = async () => {
    try {
      const response = await fetch('https://v6.exchangerate-api.com/v6/349c9b42e2cecb69a2b799c1/latest/USD');
      const data = await response.json();
      setExchangeRate(data.conversion_rates['MXN']); 
      
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);
  

  return (
    <div><div class="sticky-top"> 
<nav class={`hstack gap-3 bg-light ${isModalOpen ? 'hide-nav' : ''}`}>
            
      
      <div class="p-2">
        {/* Buscador de texto */}
        <input class="p-2"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Buscar en toda la tienda..."
        />
        <button class="btn btn-dark" onClick={handleTextSearch}>Buscar Texto</button>
      </div>
      <div >
        {/* Buscador de rango de precios */}
        <input class="p-2 ms-auto"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Precio mínimo"
        />
        <input class="p-2"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Precio máximo"
        />
        <button class="btn btn-dark" onClick={handlePriceSearch}>Buscar por Precio</button>
      </div>
      <button class="btn btn-dark" onClick={handleClearSearch}>Limpiar</button>
    </nav>
    <nav class={`hstack gap-3 bg-light ${isModalOpen ? 'hide-nav' : ''}`}>
     <br></br><br></br>
  
      <div className="content">
        <Sidebar summary={summary} />
        </div>
</nav>
 </div>
      <div className="product-container">
        {filteredItems.map((item) => (
            <div class="product-card">
          <div key={item.code} className="product">
              {/* <img src="..." class="card-img-top" alt="..."></img> */}
            <h5 class="card-title">Tipo de item: {item.type}</h5>

            <p >Código: {item.code}</p>
            <p >Tipo de Oro: {item.goldType}</p>
            <p >Compañía: {item.company}</p>
            <p >Costo: {item.cost}</p>
            <p >Precio: {item.price}</p>
            <p >Fecha de Compra: {item.purchaseDate}</p>
            <p >Lugar de Compra: {item.placeOfPurchase}</p>
            <p >Especificaciones: {item.specifications}</p>
            <p>Costo en Pesos: {parseFloat(item.cost * exchangeRate).toFixed(2)}</p>
<p>Precio en Pesos: {parseFloat(item.price * exchangeRate).toFixed(2)}</p>

            <button class="btn btn-primary" onClick={() => handleOpenModal(item)}>Ver Detalles</button>
            {isModalOpen && selectedItem && (
  <Modal item={selectedItem} onClose={() => setIsModalOpen(false)} />
)}
            <button class="btn btn-primary" onClick={() => handleSell(item)}>Vendido</button>
        
            {clientInfo && <p>{clientInfo}</p>}
      {!clientInfo && (
        <div>
          <label htmlFor="clientInput">Cliente:</label>
          <input
            type="text"
            id="clientInput"
            value={inputValue}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      )}
   
      {saleInfo && <p>{saleInfo}</p>}
      {!saleInfo && (
          
          <div>
        <label htmlFor="salePriceInput">Precio de Venta:</label>
        <input
          type="text"
          id="salePriceInput"
          value={salePrice}
          onChange={handleSalePriceChange}
          onKeyPress={handleSalePriceKeyPress}
        />
      </div>
      
      
      )}

          </div></div>
        ))}
      </div>
    </div>
  );
};

export default Shop;