
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  children?: React.ReactNode;
}

const SEOProvider: React.FC<SEOProps> = ({
  title = 'GreenTrails - Discover Nature\'s Path',
  description = 'Discover and share amazing hiking trails and outdoor adventures with the GreenTrails community. Find your perfect trail today.',
  image = '/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png',
  type = 'website',
  children,
}) => {
  const { pathname } = useLocation();
  const baseUrl = window.location.origin;
  const url = `${baseUrl}${pathname}`;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${baseUrl}${image}`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${baseUrl}${image}`} />
      
      {children}
    </Helmet>
  );
};

export default SEOProvider;
