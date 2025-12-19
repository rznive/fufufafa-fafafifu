# BE-Skripshit
Backend RESTful untuk aplikasi reservasi dan pembayaran kamar, dibangun dengan Node.js dan Express.

**Fitur utama**
- Autentikasi pengguna (login/register)
- Manajemen booking kamar
- Pembuatan dan pengelolaan tagihan
- Integrasi pembayaran (Midtrans)
- Riwayat kamar dan keluhan pelanggan

**Teknologi**
- Node.js
- Express
- Sequelize MySQL
- Midtrans (payment gateway)

**Struktur proyek**
- [app.js](app.js)
- [package.json](package.json)
- [src/configs/db.js](src/configs/db.js) — konfigurasi database
- [src/controllers](src/controllers/) — logic endpoint
- [src/models](src/models/) — definisi model database
- [src/routes](src/routes/) — definisi route/endpoint
- [src/middlewares](src/middlewares/) — handler middleware (error, response, logger)
