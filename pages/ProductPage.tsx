import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_TEMPLATES } from '../utils/mockData';
import { ProductDetail } from '../components/ProductDetail';
import { Template } from '../types';

interface ProductPageProps {
  favorites: string[];
  onToggleFavorite: (template: Template) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ favorites, onToggleFavorite }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const template = useMemo(() => {
    return MOCK_TEMPLATES.find(t => t.id === id);
  }, [id]);

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf8]">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">404</h1>
        <p className="text-lg text-gray-500 mb-8">未找到该模版</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  const handleRelatedClick = (t: Template) => {
    navigate(`/template/${t.id}`);
  };

  return (
    <ProductDetail 
      template={template} 
      allTemplates={MOCK_TEMPLATES} 
      onRelatedClick={handleRelatedClick}
      isFavorite={favorites.includes(template.id)}
      onToggleFavorite={() => onToggleFavorite(template)}
    />
  );
};
