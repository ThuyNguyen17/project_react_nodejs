const express = require('express');
const router = express.Router();

router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ message: 'lat và lon là bắt buộc' });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'class-management-app/1.0'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Không thể lấy địa chỉ' });
    }

    const data = await response.json();
    res.json({ address: data.display_name || '' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi reverse geocode' });
  }
});

module.exports = router;
