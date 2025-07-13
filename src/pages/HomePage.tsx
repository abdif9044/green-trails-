
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to GreenTrails
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing outdoor adventures and connect with the hiking community. 
            Your next trail awaits!
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-3">Find Trails</h3>
            <p className="text-muted-foreground">
              Explore thousands of trails with detailed maps, difficulty ratings, and user reviews.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-3">Share Adventures</h3>
            <p className="text-muted-foreground">
              Document your hikes with photos and connect with fellow outdoor enthusiasts.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-3">Stay Safe</h3>
            <p className="text-muted-foreground">
              Get real-time weather updates and safety information for your planned routes.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="/admin/import-debug" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Admin: Debug Import System
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
