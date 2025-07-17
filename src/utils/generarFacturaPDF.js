const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function generarFacturaPDF(orden) {
  const idStr = orden._id.toString();

  // Crear HTML con datos de la orden
  const html = `
  <html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      background-color: #f9f9f9;
    }
    
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 30px;
      background-color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #4CAF50;
    }
    
    .header h1 {
      color: #4CAF50;
      margin: 0;
      font-size: 28px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .header p {
      margin: 5px 0;
      color: #666;
    }
    
    .invoice-title {
      color: #4CAF50;
      font-size: 24px;
      margin: 20px 0 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
    }
    
    .client-info {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    
    .client-info p {
      margin: 5px 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th {
      background-color: #4CAF50;
      color: white;
      padding: 12px;
      text-align: left;
    }
    
    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    tr:hover {
      background-color: #f1f1f1;
    }
    
    .total {
      font-size: 18px;
      font-weight: bold;
      text-align: right;
      margin-top: 20px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
    
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #777;
      font-size: 14px;
    }
    
    .invoice-number {
      float: right;
      color: #777;
      font-weight: normal;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>Papelería Globanet <span class="invoice-number">Factura #${idStr.substring(18, 24).toUpperCase()}</span></h1>
      <p>Matriz Av. Leopoldo Freire 726</p>
      <p>Teléfono: 0963257177 | Email: carmen.molina@unach.edu.ec</p>
    </div>

    <h2 class="invoice-title">Nota de Venta</h2>

    <div class="client-info">
      <p><strong>Cliente:</strong> ${orden.comprador.nombre}</p>
      <p><strong>Correo:</strong> ${orden.comprador.correo}</p>
      <p><strong>Dirección:</strong> ${orden.comprador.direccion}</p>
      <p><strong>Fecha:</strong> ${new Date(orden.fecha).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${orden.items.map(item => {
          const nombre = item.producto?.nombreProdu || 'Producto no disponible';
          const cantidad = item.cantidad;
          const precio = item.producto?.precioUnitario || 0;
          const subtotal = (precio * cantidad).toFixed(2);
          return `
            <tr>
              <td>${nombre}</td>
              <td>${cantidad}</td>
              <td>$${precio.toFixed(2)}</td>
              <td>$${subtotal}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <p class="total">Total: $${orden.total.toFixed(2)}</p>

    <div class="footer">
      <p>¡Gracias por su compra!</p>
      <p>Papelería Globanet usará sus datos personales para facturación y comunicaciones de servicio, los cuales se mantendrán para cumplir con las obligaciones legales.</p>
      <p>Ejerce tus derechos de acceso, rectificación, eliminación, y oposición al correo: carmen.molina@unach.edu.ec</p>
    </div>
  </div>
</body>
</html>
  `;

  // Ruta para guardar el PDF
  const pdfPath = path.join(__dirname, '../../uploads/facturas', `factura-${idStr}.pdf`);

  // Asegurarse que la carpeta exista
  fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

  // Lanzar puppeteer para generar PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Cargar el HTML
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Generar PDF
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

  await browser.close();

  return pdfPath;
}

module.exports = generarFacturaPDF;

