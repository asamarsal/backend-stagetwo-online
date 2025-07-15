import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100,
    limit: 3,
    message: {
      message: 'Terlalu banyak permintaan, silahkan coba lagi setelah 15 menit'
    },
  });

export default limiter;