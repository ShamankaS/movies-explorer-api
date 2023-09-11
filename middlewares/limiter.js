const rateLimit = require('express-rate-limit');

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Слишком много запросов отправлено с этого IP-адреса, пожалуйста, повторите попытку через 15 минут',
});
