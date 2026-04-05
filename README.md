# 🌌 SuperMarket — Premium Grocery SaaS ✨

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-blueviolet?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Performance](https://img.shields.io/badge/UI%20Performance-60FPS-orange?style=for-the-badge)](/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Spontaneous. Premium. Scalable.** A full-stack E-commerce engine for modern supermarket operations, engineered for high-concurrency traffic and a lag-free user experience.

---

## 🚀 The Vision

**SuperMarket** is not just another e-commerce template. It's a production-grade **SaaS powerhouse** designed to bridge the gap between local retail and high-end digital shopping. Built with a "Mobile-First, Spontaneous-Next" philosophy, every tap, scroll, and transition is optimized to feel premium and alive.

### 🌟 Key Pillars
*   **Performance First**: Sub-200ms latency for all API requests and 60fps animations.
*   **Security Lock-down**: Hardened administrative portal with Brute-Force protection and Role-Based Access Control (RBAC).
*   **Developer Experience**: Typed models, clean folder architecture, and unified state management with Zustand.

---

## 🔥 Features at a Glance

### 🛍️ Customer Experience
- **🚀 Instant Search (CTRL + K)**: Universal, type-ahead search across thousands of SKUs.
- **🛒 Optimistic Cart**: Spontaneous updates with no loading spinners (Cart is always ready).
- **💳 Payment Mastery**: Native Razorpay integration for UPI, Cards, and Netbanking.
- **📍 Smart Addresses**: Profile-based "Home" and "Office" delivery hubs with real-time switching.
- **🎁 Loyalty Engine**: Automated points calculation and "Savings" tracker for repeat customers.

### 🔐 Administrative Command Center
- **📊 Live Insights**: Real-time revenue charts (24h/7d/30d) via specialized analytical slicing.
- **📦 Inventory Lifecycle**: Health monitoring for low-stock and out-of-stock items.
- **🚚 Order Fulfillment**: Interactive pipeline from 'Pending' to 'Delivered' statuses.
- **🔔 Proactive Notifications**: On-screen alerts for critical stock levels and incoming orders.

---

## 🛠️ Tech Stack Architecture

| Layer | Technology |
| :--- | :--- |
| **Front-end** | Next.js (App Router), React 18, Framer Motion |
| **Styling** | Vanilla CSS Modern Tokens, TailwindCSS (for utility) |
| **Backend / Auth** | Supabase (PostgreSQL), Edge Functions |
| **Payments** | Razorpay SDK |
| **State Management**| Zustand (Persistence & Granular Selectors) |
| **Documentation** | Mermaid.js Diagrams |

---

## 🏁 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/preetham-18-developer/SuperMarket.git
cd SuperMarket
```

### 2. Environment Setup
Create a `.env` file in the root and add your secrets:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_id
NEXT_PUBLIC_ADMIN_EMAIL=connectwithpreetham@gmail.com
```

### 3. Install & Launch
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the magic.

---

## 🏗️ Folder Structure

```
├── app/               # Next.js App Router (Pages & API)
├── components/        # Reusable UI Components
│   ├── ui/            # Atomic Base Components
│   └── (modules)/     # Featured-based components
├── lib/               # Business Logic, Store, & Data Layer
├── public/            # Static Assets
└── styles/             # Global CSS & Design Tokens
```

---

## 🛡️ Security
This project is built with a **Zero-Trust Administrative Model**. Access to `/admin` routes requires an verified administrative role in the Supabase `profiles` table. Client-side brute-force protection is implemented on all login gateways.

---

## 🤝 Contributing
We love contributors! Please check out [CONTRIBUTING.md](./CONTRIBUTING.md) for our coding standards.

Made with ❤️ by [Preetham Kumar](https://github.com/preetham-18-developer)
