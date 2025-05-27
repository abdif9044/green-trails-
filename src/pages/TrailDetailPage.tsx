
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Trail from '@/pages/Trail';

const TrailDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Trail />
      </main>
      <Footer />
    </div>
  );
};

export default TrailDetailPage;
