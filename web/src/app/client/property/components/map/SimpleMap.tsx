import { MapPin, Navigation } from 'lucide-react';

interface SimpleMapProps {
  property: any;
}

export default function SimpleMap({ property }: SimpleMapProps) {
  const location = encodeURIComponent(property.location || 'Dubai');
  
  return (
    <div>
      <iframe
        src={`https://maps.google.com/maps?q=${location}&output=embed`}
        width="100%"
        height="300"
        className="rounded-lg border"
        loading="lazy"
      />
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-1" />
          {property.location}
        </div>
        
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${location}`}
          target="_blank"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <Navigation size={14} className="mr-1" />
          Directions
        </a>
      </div>
    </div>
  );
}