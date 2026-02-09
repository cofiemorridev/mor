require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`✅ Products: http://localhost:${PORT}/api/products`);
  console.log(`✅ Admin test: http://localhost:${PORT}/api/admin/test`);
  console.log(`✅ Payment test: http://localhost:${PORT}/api/payment/test`);
});
