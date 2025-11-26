

async function testCreateBusiness() {
  const form = new FormData();
  form.append('name', 'Test Business ' + Date.now());
  form.append('category', 'Restaurantes');
  form.append('specialty', 'Testing');
  form.append('deliveryTime', '30 min');
  form.append('hours', '09:00 - 18:00');
  form.append('opening_time', '09:00');
  form.append('closing_time', '18:00');
  form.append('distances', JSON.stringify({ walk: '5 min', car: '2 min', bike: '3 min' }));
  form.append('keywords', JSON.stringify(['test', 'api']));
  form.append('description', 'A test business');
  form.append('gallery', JSON.stringify([]));
  form.append('payment_methods', JSON.stringify({ cash: true, card: false }));
  form.append('is_popular', 'false');
  form.append('is_nearby', 'false');

  try {
    const response = await fetch('http://localhost:3001/api/businesses', {
      method: 'POST',
      body: form
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testCreateBusiness();
