const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const config = {
    user: 'sl',
    password: '12345',
    server: 'DESKTOP-J9L4N0S',
    database: 'perfectNumbersBD',
    options: {
        trustServerCertificate: true
    }
};

const app = express();
app.use(cors());

// Ruta para obtener datos de la base de datos
app.get('/data', async (req, res) => {
    try {
        // Intentar conectar a la base de datos
        await sql.connect(config);

        // Consultar la base de datos
        const result = await sql.query('SELECT * FROM dataTable');
        
        // Cerrar la conexión
        await sql.close();

        // Enviar resultados como respuesta
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});

app.post('/data', express.json(), async (req, res) => {
    try {
        const { minRange, maxRange, resultado } = req.body;
    
        // Intentar conectar a la base de datos
        await sql.connect(config);
  
        // Insertar datos en la base de datos
        await sql.query`INSERT INTO dataTable (fecha, minRange, maxRange, resultado) VALUES (GETDATE(), ${minRange}, ${maxRange}, ${resultado})`;
        
        // Cerrar la conexión
        await sql.close();
    
        res.status(201).json({ message: 'Datos guardados exitosamente.' });
      } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
      }
  });



app.get('/', (re , res)=>{
    res.json("From backend side")
})

app.listen(8081, () => {
    console.log("Escuchando en el puerto 8081");
});

