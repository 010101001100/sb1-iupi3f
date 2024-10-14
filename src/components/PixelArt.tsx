import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Palette, Eraser, Clock, Users, UserCheck, Home } from 'lucide-react';
import { ArtPage } from '../App';

const GRID_SIZE = 32;
const CELL_SIZE = 20;
const TIME_LIMIT = 3 * 60 * 60 * 1000; // 3時間をミリ秒で表現

interface Pixel {
  x: number;
  y: number;
  color: string;
  timestamp: number;
}

interface PixelArtProps {
  artPages: ArtPage[];
  updateArtPage: (updatedPage: ArtPage) => void;
  onlineUsers: number;
  totalVisitors: number;
}

function PixelArt({ artPages, updateArtPage, onlineUsers, totalVisitors }: PixelArtProps) {
  const { id } = useParams<{ id: string }>();
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [isErasing, setIsErasing] = useState(false);
  const [lastDrawTime, setLastDrawTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [totalDrawers, setTotalDrawers] = useState(0);

  useEffect(() => {
    const currentPage = artPages.find(page => page.id === id);
    if (currentPage) {
      setPixels(currentPage.pixels.map(p => ({ ...p, timestamp: Date.now() })));
    }

    const savedLastDrawTime = localStorage.getItem(`lastDrawTime_${id}`);
    const savedTotalDrawers = localStorage.getItem(`totalDrawers_${id}`);

    if (savedLastDrawTime) {
      setLastDrawTime(Number(savedLastDrawTime));
    }
    if (savedTotalDrawers) {
      setTotalDrawers(Number(savedTotalDrawers));
    }
  }, [id, artPages]);

  useEffect(() => {
    if (lastDrawTime) {
      localStorage.setItem(`lastDrawTime_${id}`, lastDrawTime.toString());
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastDrawTime;
        if (elapsed >= TIME_LIMIT) {
          setTimeRemaining(null);
          clearInterval(interval);
        } else {
          setTimeRemaining(TIME_LIMIT - elapsed);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lastDrawTime, id]);

  const handleCellClick = (x: number, y: number) => {
    const now = Date.now();
    if (lastDrawTime && now - lastDrawTime < TIME_LIMIT) {
      alert('3時間経過するまで新しいピクセルを追加できません。');
      return;
    }

    const newPixel: Pixel = { x, y, color: isErasing ? 'transparent' : currentColor, timestamp: now };
    const updatedPixels = pixels.filter(p => p.x !== x || p.y !== y).concat(newPixel);
    setPixels(updatedPixels);
    setLastDrawTime(now);

    // Update the art page
    const currentPage = artPages.find(page => page.id === id);
    if (currentPage) {
      const updatedPage = { ...currentPage, pixels: updatedPixels };
      updateArtPage(updatedPage);
    }

    // Increment total drawers
    const newTotalDrawers = totalDrawers + 1;
    setTotalDrawers(newTotalDrawers);
    localStorage.setItem(`totalDrawers_${id}`, newTotalDrawers.toString());
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}時間${minutes}分${seconds}秒`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="text-blue-500 hover:text-blue-600 flex items-center">
            <Home className="mr-1" size={18} />
            ホームに戻る
          </Link>
          <h1 className="text-3xl font-bold">ピクセルアート落書きサイト</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex space-x-4 items-center">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-10 h-10 rounded-full"
            />
            <button
              onClick={toggleEraser}
              className={`p-2 rounded ${isErasing ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <Eraser size={24} />
            </button>
            {timeRemaining !== null && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={18} className="mr-1" />
                次の描画まで: {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          <div
            className="grid bg-white border border-gray-300 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const pixel = pixels.find((p) => p.x === x && p.y === y);
              return (
                <div
                  key={index}
                  className="border border-gray-200"
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: pixel ? pixel.color : 'transparent',
                  }}
                  onClick={() => handleCellClick(x, y)}
                />
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Users size={18} className="mr-1" />
              オンライン: {onlineUsers}人
            </div>
            <div className="flex items-center">
              <UserCheck size={18} className="mr-1" />
              訪問者数: {totalVisitors}人
            </div>
            <div className="flex items-center">
              <Palette size={18} className="mr-1" />
              落書き参加者: {totalDrawers}人
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            色を選んでグリッドをクリックして描画してください。消しゴムを使用するには消しゴムアイコンをクリックしてください。
            3時間経過するまで新しいピクセルを追加できません。
          </p>
        </div>
      </div>
    </div>
  );
}

export default PixelArt;