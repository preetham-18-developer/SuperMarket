import Link from 'next/link';
import { ShoppingCart, MapPin, Phone, Mail, Globe, Link as LinkIcon, Share2, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const footerLinks = {
  'Shop': [
    { label: 'Fruits & Vegetables', href: '/products?category=fruits-vegetables' },
    { label: 'Dairy & Bakery', href: '/products?category=dairy-bakery' },
    { label: 'Snacks', href: '/products?category=snacks' },
    { label: 'Beverages', href: '/products?category=beverages' },
    { label: 'Staples & Grains', href: '/products?category=staples' },
    { label: "Today's Deals", href: '/products?tag=deals' },
  ],
  'Account': [
    { label: 'Sign In', href: '/login' },
    { label: 'Create Account', href: '/signup' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Saved Addresses', href: '/account/addresses' },
    { label: 'Profile Settings', href: '/account' },
  ],
  'Company': [
    { label: 'About Supermarket', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Partner with us', href: '#' },
    { label: 'Press & Media', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  'Help': [
    { label: 'Help Center', href: '#' },
    { label: 'Track your Order', href: '/orders' },
    { label: 'Returns & Refunds', href: '#' },
    { label: 'Delivery Policy', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-espresso text-white mt-24 content-visibility-auto">
      {/* Delivery promise strip */}
      <div className="border-b border-white/8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '⚡', title: 'Express Delivery', sub: 'In as fast as 15 mins' },
              { icon: '🌿', title: 'Farm Fresh', sub: '100% quality guaranteed' },
              { icon: '💳', title: 'Secure Payment', sub: 'Razorpay & COD accepted' },
              { icon: '🔄', title: 'Easy Returns', sub: 'Hassle-free return policy' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-bold text-sm text-white">{item.title}</p>
                  <p className="text-xs text-white/50">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Image 
                  src="/assets/brand/logo-premium.png"
                  alt="SuperMarket Premium Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <div className="font-black text-xl leading-none text-white italic" style={{ fontFamily: 'Times New Roman, serif' }}>
                  Super<span className="text-primary">market</span>
                </div>
                <div className="text-[9px] font-semibold text-white/40 tracking-widest uppercase mt-1">
                  Premium Experience
                </div>
              </div>
            </Link>

            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              Your premium neighbourhood supermarket. Farm-fresh produce, daily essentials, and gourmet finds — delivered with love in minutes.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <MapPin size={14} className="text-primary shrink-0" />
                <span>Nellore, Andhra Pradesh 524001</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Phone size={14} className="text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Mail size={14} className="text-primary shrink-0" />
                <span>hello@supermarket.in</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {[
                { icon: Globe, href: '#instagram', label: 'Instagram' },
                { icon: LinkIcon, href: '#twitter', label: 'Twitter' },
                { icon: Share2, href: '#facebook', label: 'Facebook' },
                { icon: MessageCircle, href: '#youtube', label: 'Youtube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-primary flex items-center justify-center transition-all group"
                >
                  <Icon size={15} className="text-white/60 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-white/40">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-primary transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/admin/login" className="text-xs text-white/35 font-medium hover:text-white/40 transition-colors">
            © 2026 Supermarket Group Pvt. Ltd. All rights reserved.
          </Link>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-xs text-white/35 hover:text-white/60 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
