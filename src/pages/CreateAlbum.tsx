
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AlbumForm from "@/components/social/AlbumForm";
import { useAuth } from '@/hooks/use-auth';

const CreateAlbum = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-greentrail-50 dark:bg-greentrail-950 py-8">
        <div className="container max-w-3xl mx-auto px-4">
          <AlbumForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateAlbum;
