
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MapPin, Calendar, MoreHorizontal, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Album } from '@/hooks/use-albums';
import EnhancedReactions from './EnhancedReactions';

interface EnhancedAlbumCardProps {
  album: Album;
}

const EnhancedAlbumCard: React.FC<EnhancedAlbumCardProps> = ({ album }) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 100) + 10);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <Card className="overflow-hidden bg-white/5 backdrop-blur-luxury border border-white/10 hover:border-gold-500/30 transition-all duration-500 hover:shadow-luxury-lg group">
      {/* User Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-gold-500/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gold-gradient text-luxury-900 font-luxury font-semibold">
                  {album.user?.email?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-greentrail-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-luxury font-semibold text-white">{album.user?.email || 'Adventure Seeker'}</h3>
              <div className="flex items-center text-sm text-luxury-300">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(album.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-luxury-400 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Album Content */}
      <div className="relative group cursor-pointer">
        <Link to={`/albums/${album.id}`}>
          <div className="aspect-video relative overflow-hidden">
            <img
              src={album.coverImage || "/placeholder.svg"}
              alt={album.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Luxury Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* View Count */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-1 bg-luxury-900/50 backdrop-blur-sm rounded-full px-3 py-1">
                <Eye className="h-4 w-4 text-white" />
                <span className="text-white text-sm luxury-text font-medium">{Math.floor(Math.random() * 500) + 50}</span>
              </div>
            </div>

            {/* Album Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-xl luxury-heading text-white mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {album.title}
              </h3>
              {album.location && (
                <div className="flex items-center text-luxury-200 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="luxury-text text-sm">{album.location}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Album Details */}
      <div className="p-6 pt-4">
        <div className="mb-4">
          <h3 className="text-lg luxury-heading text-white mb-2">{album.title}</h3>
          {album.description && (
            <p className="text-luxury-300 luxury-text leading-relaxed">{album.description}</p>
          )}
          {album.location && (
            <div className="flex items-center text-luxury-400 mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="luxury-text text-sm">{album.location}</span>
            </div>
          )}
        </div>

        {/* Enhanced Reactions */}
        <EnhancedReactions
          itemId={album.id}
          itemType="album"
          initialReactions={{ heart: likesCount, thumbs_up: Math.floor(Math.random() * 50) }}
          initialUserReaction={isLiked ? '❤️' : null}
          commentCount={Math.floor(Math.random() * 20)}
          onCommentClick={() => setShowComments(!showComments)}
        />

        {/* Engagement Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4 text-sm text-luxury-400">
            <span className="luxury-text">{likesCount} reactions</span>
            <span className="luxury-text">{Math.floor(Math.random() * 20)} comments</span>
          </div>
          <Badge variant="outline" className="bg-greentrail-500/20 border-greentrail-500/30 text-greentrail-300 luxury-text">
            Adventure
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedAlbumCard;
