import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getText, markTextViewed } from '@/lib/storage';

const RawText = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;
    const entry = getText(id);
    if (entry) {
      markTextViewed(id);
      document.title = 'Raw - FastText.io';
      // Replace entire page with raw text
      document.body.style.background = '#0a0a0b';
      document.body.style.color = '#ededed';
      document.body.style.fontFamily = 'monospace';
      document.body.style.whiteSpace = 'pre-wrap';
      document.body.style.padding = '1rem';
      document.body.style.margin = '0';
      const root = document.getElementById('root');
      if (root) root.innerText = entry.content;
    } else {
      const root = document.getElementById('root');
      if (root) root.innerText = '404 - Not found or expired';
    }
  }, [id]);

  return null;
};

export default RawText;
