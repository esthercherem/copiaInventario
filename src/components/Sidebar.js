// En Sidebar.js
import React from 'react';

const Sidebar = ({ summary }) => {
  return (

        
    <nav class="sticky-top" >
      <div class="hstack gap-3" >
      <div class="p-2" >
        <p>Cantidad de productos:</p>
        <p>{summary.totalProducts}</p>
      </div>
      <div class="p-2">
        <p>Costo total:</p>
        <p>${summary.totalCost}</p>
      </div>
      <div class="p-2">
        <p>Productos de cada compañía:</p>
        <ul>
          <li>
            Param: {summary.companies.Param.count} (Costo total: ${summary.companies.Param.totalCost})
          </li>
          <li>
            Dina: {summary.companies.Dina.count} (Costo total: ${summary.companies.Dina.totalCost})
          </li>
          <li>
            Kine: {summary.companies.Kine.count} (Costo total: ${summary.companies.Kine.totalCost})
          </li>
          <li>
            Bat: {summary.companies.Bat.count} (Costo total: ${summary.companies.Bat.totalCost})
          </li>
        </ul>
      </div>
      <div class="p-2">
        <p>Tipo de artículo:</p>
        <ul>
          <li>Collar: {summary.types.Collar}</li>
          <li>Pulsera: {summary.types.Pulsera}</li>
          <li>Aretes: {summary.types.Aretes}</li>
        </ul>
      </div>
      <div class="p-2">
        <p>Lugar de compra:</p>
        <ul>
          <li>MIA: {summary.places.MIA}</li>
          <li>NY: {summary.places.NY}</li>
          <li>LA: {summary.places.LA}</li>
        </ul>
      </div>
    </div></nav>
  );
};

export default Sidebar;

