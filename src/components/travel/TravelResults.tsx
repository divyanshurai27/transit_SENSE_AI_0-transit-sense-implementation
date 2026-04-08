import { TravelOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, Wifi, Utensils, Zap, Luggage } from 'lucide-react';

interface TravelResultsProps {
  options: TravelOption[];
  loading: boolean;
  error: string | null;
  onBookOption: (option: TravelOption) => void;
}

const TravelResults = ({ options, loading, error, onBookOption }: TravelResultsProps) => {
  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4 flex-shrink-0" />;
      case 'meals': return <Utensils className="h-4 w-4 flex-shrink-0" />;
      case 'charging points': return <Zap className="h-4 w-4 flex-shrink-0" />;
      case 'extra baggage': return <Luggage className="h-4 w-4 flex-shrink-0" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-sm text-muted-foreground">Searching for travel options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-800">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (options.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No travel options found for your search criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 min-h-[400px]">
      <h3 className="text-lg font-semibold">Available Travel Options</h3>
      <div className="space-y-4">
        {options.map((option) => (
          <Card 
            key={option.id} 
            className="border border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
          >
            <CardContent className="p-6">
              {/* Provider and Mode Row */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-lg">{option.provider}</h4>
                  <Badge variant="outline" className="capitalize">
                    {option.mode}
                  </Badge>
                  <Badge className={getCrowdLevelColor(option.crowdLevel)}>
                    {option.crowdLevel}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ₹{option.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    per person
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{option.departureTime} - {option.arrivalTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span>{option.availableSeats} seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 flex-shrink-0" />
                  <span>{option.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Duration: {option.duration}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {option.amenities.slice(0, 4).map((amenity, amenityIndex) => (
                  <div key={amenityIndex} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
                {option.amenities.length > 4 && (
                  <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    +{option.amenities.length - 4} more
                  </div>
                )}
              </div>

              {/* Book Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={() => onBookOption(option)}
                  disabled={option.availableSeats === 0}
                  className="min-w-[120px]"
                  variant={option.availableSeats === 0 ? "secondary" : "default"}
                >
                  {option.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TravelResults;
