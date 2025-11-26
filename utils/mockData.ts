import { Template, TemplateCategory } from '../types';

export const CATEGORIES = Object.values(TemplateCategory);

export const generateMockTemplates = (): Template[] => {
  return Array.from({ length: 32 }).map((_, i) => {
    const category = CATEGORIES[i % CATEGORIES.length];
    const id = `tpl-${i}`;
    
    const dslCode = `// ${id} Configuration
import { Layout, Theme } from '@zelpis/core';

export const config = {
  theme: {
    mode: 'dark',
    primary: '#${Math.floor(Math.random()*16777215).toString(16)}',
    font: 'Inter'
  },
  layout: {
    type: '${category.toLowerCase().replace(' ', '-')}',
    gridCols: ${i % 2 === 0 ? 12 : 4},
    gap: '2rem',
    fluid: true
  },
  features: [
    'seo-optimized',
    'lazy-loading',
    'accessibility-v2'
  ]
};`;

    const titles = [
      "Lumina 筑梦集", "Apex 极速电商", "Zenith 博客", "Nexus 仪表盘", "Flux 落地页", 
      "Orbit 创意代理", "Stellar 个人主页", "Vortex SaaS系统", "Echo 资讯网", "Pulse 后台管理",
      "Aether 精品店", "Mono 极简文稿", "Quantum UI 套件", "Velvet 社交中心", "Prism 数据分析"
    ];
    
    const authors = ["Studio K", "DesignFlow", "MinimalistCo", "PixelPerfect", "Avanti"];
    const descriptions = [
      "一款为现代创作者精心打造的模版。具备响应式布局，支持深色模式，以及干净的排版。",
      "专为高转化率设计的电商界面，流畅的动画效果和极致的性能优化。",
      "极简主义风格的博客主题，专注于内容阅读体验，SEO 友好。",
      "功能强大的后台管理系统，内置丰富的数据可视化组件。",
    ];

    const tagsList = [
      ["React", "Tailwind", "极简风格", "深色模式"],
      ["Vue", "GSAP", "创意交互", "3D效果"],
      ["NextJS", "Framer", "作品集", "动画"],
      ["Dashboard", "图表", "数据分析", "Admin"]
    ];

    const reviewsList = [
      { user: 'Alex M.', comment: '设计简直太惊艳了，代码质量也是一流。' },
      { user: 'Sarah J.', comment: '易于定制，文档如果再详细一点就完美了。' },
      { user: '李明', comment: '交互非常流畅，这就是我一直在寻找的风格。' },
      { user: 'DesignPro', comment: '作为设计师，我对这个模版的细节处理印象深刻。' }
    ];

    return {
      id: id,
      title: titles[i % titles.length] + ` ${Math.floor(i / titles.length) + 1}`,
      author: authors[i % authors.length],
      price: 29 + (i % 8) * 10 + (i % 2 === 0 ? 9 : 0),
      category: category,
      description: `这是一个${category}类别的顶级模版。${descriptions[i % descriptions.length]} 完美适合希望提升数字形象的专业人士。`,
      imageUrl: `https://picsum.photos/1200/750?random=${i + 100}`,
      tags: tagsList[i % tagsList.length],
      rating: 4 + (i % 10) / 10,
      dslCode: dslCode,
      previewUrl: '#',
      reviews: [
        {
          id: 'r1',
          user: reviewsList[i % 4].user,
          rating: 5,
          date: '2 天前',
          comment: reviewsList[i % 4].comment
        },
        {
          id: 'r2',
          user: reviewsList[(i + 1) % 4].user,
          rating: 4.5,
          date: '1 周前',
          comment: reviewsList[(i + 1) % 4].comment
        }
      ]
    };
  });
};

export const MOCK_TEMPLATES = generateMockTemplates();
