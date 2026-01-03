const db = require('../src/database/models');

async function checkData() {
  try {
    const categories = await db.Category.findAll();
    console.log('Categories found:', categories.length);
    categories.forEach(c => console.log(` - ${c.name} (${c.id})`));

    const products = await db.Product.findAll();
    console.log('Products found:', products.length);
    if (products.length > 0) {
      console.log('Sample Product:', products[0].name, '- CategoryId:', products[0].categoryId);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

checkData();
