import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Users, UserCheck, Plus } from 'lucide-react';
import { ArtPage } from '../App';

interface HomeProps {
  artPages: ArtPage[];
  addNewArtPage: (name: string) => void;
  onlineUsers: number;
  totalVisitors: number;
}

function Home({ artPages, addNewArtPage, onlineUsers, totalVisitors }: HomeProps) {
  const [newPageName, setNewPageName] = useState('');

  const handleAddPage = () => {
    if (newPageName.trim()) {
      addNewArtPage(newPageName.trim());
      setNewPageName('');
    }
  };

  const renderPreview = (pixels: ArtPage['pixels']) => {
    const size = 8;
    const previewPixels = new Array(size * size).fill(null);
    pixels.forEach(pixel => {
      const index = (pixel.y % size) * size + (pixel.x % size);
      previewPixels[index] = pixel.color;
    });

    return (
      <div className="grid grid-cols-8 gap-0 w-16 h-16 border border-gray-300">
        {previewPixels.map((color, index) => (
          <div
            key={index}
            className="w-2 h-2"
            style={{ backgroundColor: color || 'transparent' }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">ピクセルアート落書きサイト</h1>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">アートページ一覧</h2>
          <ul className="space-y-2">
            {artPages.map((page) => (
              <li key={page.id}>
                <Link
                  to={`/draw/${page.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
                >
                  <span>{page.name}</span>
                  <div className="flex items-center">
                    {renderPreview(page.pixels)}
                    <Palette className="ml-2" size={18} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="新しいページ名"
              className="flex-grow border rounded-l px-3 py-2"
            />
            <button
              onClick={handleAddPage}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-r flex items-center"
            >
              <Plus size={18} className="mr-1" />
              追加
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Users size={18} className="mr-1" />
              オンライン: {onlineUsers}人
            </div>
            <div className="flex items-center">
              <UserCheck size={18} className="mr-1" />
              訪問者数: {totalVisitors}人
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;