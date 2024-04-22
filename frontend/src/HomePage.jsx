import React, { useEffect, useState } from 'react'
import { PerfectNumber } from './components/PerfectNumber';

export const HomePage = () => {

  //se utiliza local storage para almacenar los datos que ingreso el usuario por ultima vez
  const [minRange, setMinRange] = useState(() => {

    const savedMinRange = localStorage.getItem('minRange');
    //Si no encuentra un valor de rango maximo por defecto coloca 6
    return savedMinRange ? parseInt(savedMinRange, 10) : 6;

  });

  const [maxRange, setMaxRange] = useState(() => {

    const savedMaxRange = localStorage.getItem('maxRange');
    //Si no encuentra un valor de rango maximo por defecto coloca 500
    return savedMaxRange ? parseInt(savedMaxRange, 10) : 500;
  });

  //Actualización de los estados de los input
  const handleMinRangeChange = (e) => {
    const newValue = parseInt(e.target.value);
    setMinRange(newValue);
    localStorage.setItem('minRange', newValue);
  };

  const handleMaxRangeChange = (e) => {
    const newValue = parseInt(e.target.value);
    setMaxRange(newValue);
    localStorage.setItem('maxRange', newValue);
  };

  const perfectNumbersData = PerfectNumber(minRange,maxRange)

  const [dataApi, setDataApi]=useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  const saveDataToDatabase = async () => {
    try {
      const response = await fetch('http://localhost:8081/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          minRange: minRange,
          maxRange: maxRange,
          resultado: perfectNumbersData.join(', ') // Convertir el array de números perfectos a una cadena separada por comas
        })
      });
      if (response.ok) {
        console.log('Datos guardados exitosamente.');
      } else {
        throw new Error(`Error al guardar datos: ${response.statusText}`);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  
  const viewDataFromDatabase = async () => {
    try {
      const response = await fetch('http://localhost:8081/data');
      if (!response.ok) {
        throw new Error(`Error al obtener datos de la base de datos: ${response.statusText}`);
      }
      const data = await response.json();
      setDataApi(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <div>

        <input
          class="form-control mb-3" 
          placeholder="Default input" 
          type="number"
          value={minRange}
          onChange={handleMinRangeChange}
        />

        <input
          class="form-control mb-3" 
          placeholder="Default input" 
          type="number"
          value={maxRange}
          onChange={handleMaxRangeChange}
        />

      </div>
      
      <div>
        <button button type="button" class="btn btn-dark mb-3" onClick={saveDataToDatabase}>Guardar datos</button>
        <button button type="button" class="btn btn-dark mb-3" onClick={viewDataFromDatabase}>Ver datos guardados</button>
      </div>

      <div>
      <ul>
        {perfectNumbersData.length > 0 ? (
          <>
            <h3>Resultados</h3>
            {perfectNumbersData.map((number, index) => (
              <li key={index}>{number}</li>
            ))}
          </>
        ) : (
          <li>No hay números perfectos en el rango dado.</li>
        )}
      </ul>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="d-flex justify-content-center">
        {dataApi.length> 0 ?(
          <table className="table">
          <thead>
            <th scope="col" className="pl-4"># registro</th>
            <th scope="col" className="pl-4"> fecha</th>
            <th scope="col" className="pl-4"> Rango minimo</th>
            <th scope="col" className="pl-4"> Rango maximo</th>
            <th scope="col" className="pl-4">resultados</th>
          </thead>
          <tbody>
            {dataApi.map((d, i)=>(
              <tr key = {i}>
                <td scope="row">{i+1}</td>
                <td scope="row">{d.fecha}</td>
                <td scope="row">{d.minRange}</td>
                <td scope="row">{d.maxRange}</td>
                <td scope="row">{d.resultado}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ):(<br/>)}
        
      </div>
    </>
  )
}