const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfmake');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/api/generate-pdf', upload.single('logo'), (req, res) => {
  const invoiceData = JSON.parse(req.body.invoiceData);
  const logoPath = req.file ? `/public/uploads/${req.file.originalname}` : null;

  const fonts = {
    Roboto: {
      normal: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
      bold: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
    }
  };

  const pdfDoc = new PDFDocument({
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  }, {
    fontFiles: fonts
  });

  let content = [
    { text: 'Invoice', style: 'header' },
  ];

  if (logoPath) {
    content.push({
      image: path.join(__dirname, logoPath),
      width: 150,
      alignment: 'center',
    });
  }

  content.push({
    columns: [
      [
        { text: invoiceData.sellerName, style: 'subheader' },
        { text: invoiceData.sellerAddress },
        { text: invoiceData.sellerPhone },
        { text: invoiceData.sellerEmail },
      ],
      [
        { text: invoiceData.clientName, style: 'subheader' },
        { text: invoiceData.clientAddress },
      ],
    ],
  });

  content.push({
    style: 'invoiceTable',
    table: {
      body: [
        [
          { text: 'Description', style: 'invoiceTableHeader' },
          { text: 'Amount', style: 'invoiceTableHeader' },
        ],
        [invoiceData.description, invoiceData.amount.toFixed(2)],
        [{}, { text: `Total: €${invoiceData.amount.toFixed(2)}`, style: 'bold' }],
      ],
    },
  });

  content.push({ text: `Invoice Number: ${invoiceData.invoiceNumber}`, style: 'footer' });
  content.push({ text: `Invoice Date: ${invoiceData.invoiceDate}`, style: 'footer' });

  const docDefinition = {
    content: content,
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      invoiceTable: {
        margin: [0, 30, 0, 30],
      },
      invoiceTableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black',
      },
      footer: {
        fontSize: 10,
        color: 'gray',
      },
    },
  };

  const pdfDocGenerator = pdfDoc.createPdfKitDocument(docDefinition, {});
  const chunks = [];

  pdfDocGenerator.on('data', (chunk) => {
    chunks.push(chunk);
  });

  pdfDocGenerator.on('end', () => {
    const result = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceData.invoiceNumber}.pdf`);
    res.send(result);
  });

  pdfDocGenerator.end();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
