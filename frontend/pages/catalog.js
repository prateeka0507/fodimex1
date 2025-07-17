import { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import SearchFilterBar from '../components/SearchFilterBar';
import { productsAPI } from '../services/api';

export default function Catalog() {
  // Static product list for the catalog
  const products = [
    {
      id: 1,
      name: 'Soap',
      image: '/soap box design.png',
      price: 199,
      description: 'Gentle, nourishing soap made with natural ingredients.'
    },
    {
      id: 2,
      name: 'Tooth Powder',
      image: '/tubes.png',
      price: 149,
      description: 'Mineral-rich tooth powder for oral health.'
    },
    {
      id: 3,
      name: 'Face Scrub',
      image: '/cover.jpeg',
      price: 249,
      description: 'Exfoliate naturally for smooth, radiant skin.'
    },
    {
      id: 4,
      name: 'Face Wash',
      image: '/cover.jpeg',
      price: 199,
      description: 'A refreshing face wash that cleanses deeply.'
    },
    {
      id: 5,
      name: 'Raw Egg Shell Powder',
      image: '/tubes.png',
      price: 99,
      description: 'Pure, finely ground egg shell powder for versatile use.'
    }
  ];

  return (
    <div className="py-8 min-h-screen" style={{ background: '#f5eee6' }}>
      <h1 className="text-3xl font-bold mb-6 text-center">Product Catalog</h1>
      <ProductList products={products} />
    </div>
  );
} 