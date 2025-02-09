import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const [invoiceData, setInvoiceData] = useState({
    sellerName: 'Adam Floors',
    sellerAddress: 'de Favaugeplein 21F/5 TN Zandvoort',
    sellerPhone: '+31 (0) 684892629',
    sellerEmail: 'adacho99-15@o2.pl',
    clientName: 'Wurks BV',
    clientAddress: 'Meridiaan 63 2801DA Gouda',
    invoiceNumber: '2024-045',
    invoiceDate: '15.12.2024',
    ratePerHour: 35,
    hoursWorked: 8,
    description: '',
    amount: 280.00,
  });
  const [logo, setLogo] = useState(null);
  const [logoURL, setLogoURL] = useState(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const newAmount = invoiceData.ratePerHour * invoiceData.hoursWorked;
    setInvoiceData(prevData => ({
      ...prevData,
      amount: newAmount,
      description: `${invoiceData.hoursWorked} hours at €${invoiceData.ratePerHour} per hour`
    }));
  }, [invoiceData.ratePerHour, invoiceData.hoursWorked]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prevData => ({
      ...prevData,
      [name]: parseFloat(name) === name ? parseFloat(value) : value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoURL(url);
      setLogo(file);
    }
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF();

    let y = 20;

    if (logoURL) {
      doc.addImage(logoURL, 'PNG', 10, y, 50, 20);
      y += 30;
    }

    doc.setFontSize(20);
    doc.text('Invoice', 105, y, { align: 'center' });
    y += 10;

    doc.setFontSize(12);
    doc.text(`Seller: ${invoiceData.sellerName}`, 20, y);
    y += 7;
    doc.text(`Address: ${invoiceData.sellerAddress}`, 20, y);
    y += 7;
    doc.text(`Phone: ${invoiceData.sellerPhone}`, 20, y);
    y += 7;
    doc.text(`Email: ${invoiceData.sellerEmail}`, 20, y);
    y += 15;

    doc.text(`Client: ${invoiceData.clientName}`, 20, y);
    y += 7;
    doc.text(`Address: ${invoiceData.clientAddress}`, 20, y);
    y += 15;

    doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 20, y);
    y += 7;
    doc.text(`Invoice Date: ${invoiceData.invoiceDate}`, 20, y);
    y += 15;

    doc.text(`Description: ${invoiceData.description}`, 20, y);
    y += 15;

    doc.setFontSize(14);
    doc.text(`Total: €${invoiceData.amount.toFixed(2)}`, 20, y);

    doc.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
  };

  const handleDownloadWord = () => {
    const wordContent = `
      Invoice

      Seller: ${invoiceData.sellerName}
      Address: ${invoiceData.sellerAddress}
      Phone: ${invoiceData.sellerPhone}
      Email: ${invoiceData.sellerEmail}

      Client: ${invoiceData.clientName}
      Address: ${invoiceData.clientAddress}

      Invoice Number: ${invoiceData.invoiceNumber}
      Invoice Date: ${invoiceData.invoiceDate}

      Description: ${invoiceData.description}

      Total: €${invoiceData.amount.toFixed(2)}
    `;

    const blob = new Blob([wordContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceData.invoiceNumber}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  return (
    <div className="invoice-generator">
      <header className="header">
        <h1>AI Invoice Generator</h1>
        <p>Create professional invoices quickly and easily.</p>
      </header>
      <section className="form-section">
        <form className="invoice-form">
          <div className="form-group">
            <label htmlFor="logo">Upload Logo:</label>
            <input type="file" id="logo" name="logo" accept="image/*" onChange={handleLogoChange} />
          </div>
          <div className="form-group">
            <label htmlFor="sellerName">Seller Name:</label>
            <input type="text" id="sellerName" name="sellerName" value={invoiceData.sellerName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="sellerAddress">Seller Address:</label>
            <input type="text" id="sellerAddress" name="sellerAddress" value={invoiceData.sellerAddress} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="sellerPhone">Seller Phone:</label>
            <input type="text" id="sellerPhone" name="sellerPhone" value={invoiceData.sellerPhone} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="sellerEmail">Seller Email:</label>
            <input type="text" id="sellerEmail" name="sellerEmail" value={invoiceData.sellerEmail} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="clientName">Client Name:</label>
            <input type="text" id="clientName" name="clientName" value={invoiceData.clientName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="clientAddress">Client Address:</label>
            <input type="text" id="clientAddress" name="clientAddress" value={invoiceData.clientAddress} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="invoiceNumber">Invoice Number:</label>
            <input type="text" id="invoiceNumber" name="invoiceNumber" value={invoiceData.invoiceNumber} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="invoiceDate">Invoice Date:</label>
            <input type="text" id="invoiceDate" name="invoiceDate" value={invoiceData.invoiceDate} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="ratePerHour">Rate per Hour (€):</label>
            <input
              type="number"
              id="ratePerHour"
              name="ratePerHour"
              value={invoiceData.ratePerHour}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="hoursWorked">Hours Worked:</label>
            <input
              type="number"
              id="hoursWorked"
              name="hoursWorked"
              value={invoiceData.hoursWorked}
              onChange={handleInputChange}
            />
          </div>
        </form>
        <div className="button-group">
          <button className="preview-button" onClick={togglePreview}>
            {preview ? 'Hide Preview' : 'Preview Invoice'}
          </button>
          <button className="download-pdf-button" onClick={handleGeneratePdf}>
            Download as PDF
          </button>
          <button className="download-word-button" onClick={handleDownloadWord}>
            Download as Word
          </button>
        </div>
      </section>
      {preview && (
        <section className="preview-section">
          <h2>Invoice Preview</h2>
          <div className="invoice-preview">
            <div className="invoice-header">
              {logoURL && <img src={logoURL} alt="Logo" className="logo-preview" />}
              <div className="company-info">
                <h3>{invoiceData.sellerName}</h3>
                <p>{invoiceData.sellerAddress}</p>
                <p>{invoiceData.sellerPhone}</p>
                <p>{invoiceData.sellerEmail}</p>
              </div>
            </div>

            <div className="invoice-details">
              <div className="detail-section">
                <h4>Bill To:</h4>
                <p>{invoiceData.clientName}</p>
                <p>{invoiceData.clientAddress}</p>
              </div>
              <div className="detail-section">
                <h4>Invoice Number:</h4>
                <p>{invoiceData.invoiceNumber}</p>
                <h4>Invoice Date:</h4>
                <p>{invoiceData.invoiceDate}</p>
              </div>
            </div>

            <div className="invoice-items">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Rate</th>
                    <th>Hours</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{invoiceData.description}</td>
                    <td>€{invoiceData.ratePerHour}</td>
                    <td>{invoiceData.hoursWorked}</td>
                    <td>€{invoiceData.amount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="invoice-total">
              <h4>Total: €{invoiceData.amount.toFixed(2)}</h4>
            </div>
          </div>
        </section>
      )}
      <footer className="footer">
        <p>&copy; 2024 AI Invoice Generator</p>
      </footer>
    </div>
  );
}

export default App;
