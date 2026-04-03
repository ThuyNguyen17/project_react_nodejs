// controllers/geocodeController.js
const axios = require('axios');

exports.reverseGeocode = async (req, res) => {
    const { lat, lon } = req.query;

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=vi`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'project-management-class/1.0'
            }
        });

        let address = '';

        if (response.data && response.data.display_name) {
            address = response.data.display_name;
        }

        res.json({
            lat,
            lon,
            address
        });

    } catch (err) {
        // 🔥 giống Java: không fail hệ thống nếu lỗi API
        res.json({
            lat,
            lon,
            address: ""
        });
    }
};