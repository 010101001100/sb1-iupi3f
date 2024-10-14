import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import PixelArt from './components/PixelArt';

export interface ArtPage {
  id: string;
  name: string;
  pixels: Array<{ x: number; y: number; color: string }>;
}

function App() {
  const [artPages, setArtPages] = useState<ArtPage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    const savedArtPages = localStorage.getItem('artPages');
    if (savedArtPages) {
      setArtPages(JSON.parse(savedArtPages));
    } else {
      const initialPage = { id: '1', name: 'みんなのアート', pixels: [] };
      setArtPages([initialPage]);
      localStorage.setItem('artPages', JSON.stringify([initialPage]));
    }

    const savedTotalVisitors = localStorage.getItem('totalVisitors');
    if (savedTotalVisitors) {
      setTotalVisitors(Number(savedTotalVisitors));
    } else {
      setTotalVisitors(1);
      localStorage.setItem('totalVisitors', '1');
    }

    // Increment total visitors
    const newTotalVisitors = Number(savedTotalVisitors || 0) + 1;
    setTotalVisitors(newTotalVisitors);
    localStorage.setItem('totalVisitors', newTotalVisitors.toString());

    // Simulate online users (実際のアプリケーションでは、リアルタイムの接続数を使用します)
    const updateOnlineUsers = () => {
      const randomOnlineUsers = Math.floor(Math.random() * 10) + 1;
      setOnlineUsers(randomOnlineUsers);
    };
    updateOnlineUsers();
    const interval = setInterval(updateOnlineUsers, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, []);

  const addNewArtPage = (name: string) => {
    const newPage = { id: Date.now().toString(), name, pixels: [] };
    const updatedPages = [...artPages, newPage];
    setArtPages(updatedPages);
    localStorage.setItem('artPages', JSON.stringify(updatedPages));
  };

  const updateArtPage = (updatedPage: ArtPage) => {
    const updatedPages = artPages.map(page => 
      page.id === updatedPage.id ? updatedPage : page
    );
    setArtPages(updatedPages);
    localStorage.setItem('artPages', JSON.stringify(updatedPages));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home artPages={artPages} addNewArtPage={addNewArtPage} onlineUsers={onlineUsers} totalVisitors={totalVisitors} />} />
          <Route path="/draw/:id" element={<PixelArt artPages={artPages} updateArtPage={updateArtPage} onlineUsers={onlineUsers} totalVisitors={totalVisitors} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;