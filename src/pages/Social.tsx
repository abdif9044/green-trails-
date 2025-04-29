
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialHeader from "@/components/social/SocialHeader";
import SocialFeed from "@/components/social/SocialFeed";

const Social = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <SocialHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <SocialFeed />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Social;
