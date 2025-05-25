
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialHeader from "@/components/social/SocialHeader";
import SocialFeed from "@/components/social/SocialFeed";
import SEOProvider from "@/components/SEOProvider";

const Social = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider
        title="Nature Feed - GreenTrails"
        description="Connect with fellow nature lovers, share your trail adventures, and discover amazing outdoor experiences through the GreenTrails community."
        type="website"
      />
      
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <SocialHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <SocialFeed searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Social;
