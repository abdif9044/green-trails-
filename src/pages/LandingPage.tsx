
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main homepage
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default LandingPage;
