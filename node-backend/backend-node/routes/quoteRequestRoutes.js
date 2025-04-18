// routes/quoteRequestRoutes.js
import { Router } from 'express';
import { pool } from '../db/pool.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

// Налаштування Nodemailer для відправки email-повідомлень
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Ендпоінт для створення нового запиту на розрахунок
router.post('/', async (req, res) => {
  const { 
    name, phone, email, 
    address, consumption, 
    applicantType, reason, 
    productId, productName, 
    source, timestamp 
  } = req.body;

  try {
    // Перевірка на дублювання заявок (за email та телефоном для одного продукту протягом доби)
    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 1);
    
    const duplicateCheck = await pool.query(
      `SELECT * FROM quote_requests 
       WHERE (email = $1 OR phone = $2) 
       AND product_id = $3 
       AND created_at > $4`,
      [email, phone, productId, lastDay.toISOString()]
    );

    // Якщо знайдено дублікат, відповідаємо з відповідним повідомленням
    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        message: 'Ви вже надіслали запит на цей продукт. Наші менеджери зв\'яжуться з вами найближчим часом.'
      });
    }

    // Створення нового запиту в базі даних
    const result = await pool.query(
      `INSERT INTO quote_requests 
       (name, phone, email, address, consumption, applicant_type, reason, product_id, product_name, source, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [name, phone, email, address, consumption, applicantType, reason, productId, productName, source, timestamp]
    );

    // Формування тексту листа для надсилання на пошту
    let emailText = `Новий запит на розрахунок\n\n`;
    emailText += `Ім'я: ${name}\n`;
    emailText += `Телефон: ${phone}\n`;
    emailText += `Email: ${email}\n`;
    emailText += `Продукт: ${productName} (ID: ${productId})\n`;
    emailText += `Джерело: ${source}\n\n`;

    // Додаємо специфічні поля залежно від типу продукту
    if (address) emailText += `Адреса: ${address}\n`;
    if (consumption) emailText += `Споживання (кВт): ${consumption}\n`;
    if (applicantType) emailText += `Тип заявника: ${applicantType}\n`;
    if (reason) emailText += `Причина зацікавленості: ${reason}\n`;

    // Відправлення email-повідомлення
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Новий запит на розрахунок: ${productName}`,
      text: emailText
    });

    // Відправлення успішної відповіді клієнту
    res.status(201).json({
      message: 'Запит успішно створено',
      requestId: result.rows[0].id
    });
    
  } catch (err) {
    console.error('Помилка створення запиту:', err);
    res.status(500).json({
      message: 'Сталася помилка при обробці запиту',
      error: err.message
    });
  }
});

// Ендпоінт для отримання всіх запитів (для адмін-панелі)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM quote_requests ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Помилка отримання запитів:', err);
    res.status(500).json({
      message: 'Сталася помилка при отриманні запитів',
      error: err.message
    });
  }
});

export default router;