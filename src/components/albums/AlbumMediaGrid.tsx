
interface MediaItem {
  id: string;
  url: string;
  file_type: string;
  caption?: string;
}

interface AlbumMediaGridProps {
  media: MediaItem[];
}

const AlbumMediaGrid = ({ media }: AlbumMediaGridProps) => {
  if (media.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No photos or videos in this album yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {media.map((item) => (
          <div 
            key={item.id} 
            className="aspect-square bg-muted rounded-md overflow-hidden"
          >
            {item.file_type.startsWith('image/') ? (
              <img 
                src={item.url} 
                alt={item.caption || 'Album photo'} 
                className="w-full h-full object-cover"
              />
            ) : item.file_type.startsWith('video/') ? (
              <video 
                src={item.url} 
                controls 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Unsupported media type</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumMediaGrid;
