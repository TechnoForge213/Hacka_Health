import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Activity, LogOut, MapPin, Search } from 'lucide-react';

export default function PatientDashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState('');
  const [nearbyDoctors, setNearbyDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location access denied",
            description: "Please enable location to find nearby doctors",
            variant: "destructive",
          });
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const searchDoctors = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please enter symptoms",
        description: "Describe your symptoms to find relevant doctors",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: doctors, error } = await supabase
        .from('doctor_profiles')
        .select('*, profiles!inner(full_name, email)');

      if (error) throw error;

      let doctorsList = doctors || [];
      
      if (userLocation && doctorsList.length > 0) {
        doctorsList = doctorsList.map((doctor) => ({
          ...doctor,
          distance: doctor.latitude && doctor.longitude
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                parseFloat(doctor.latitude.toString()),
                parseFloat(doctor.longitude.toString())
              )
            : null,
        })).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      }

      setNearbyDoctors(doctorsList);
      
      if (doctorsList.length === 0) {
        toast({
          title: "No doctors found",
          description: "Try adjusting your search criteria",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary animate-glow-pulse" />
          <h1 className="text-3xl font-bold gradient-text">Patient Dashboard</h1>
        </div>
        <Button onClick={signOut} variant="outline" className="glass-card">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Card className="glass-card glow-border">
        <CardHeader>
          <CardTitle className="text-primary">Find Doctors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms" className="text-foreground">Describe your symptoms</Label>
            <Input
              id="symptoms"
              placeholder="e.g., Headache, fever, chest pain..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="glass-card glow-border"
            />
          </div>
          <Button onClick={searchDoctors} disabled={loading} className="w-full hover-glow">
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Searching...' : 'Search Doctors'}
          </Button>
        </CardContent>
      </Card>

      {nearbyDoctors.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {nearbyDoctors.map((doctor) => (
            <Card key={doctor.id} className="glass-card glow-border hover-glow">
              <CardHeader>
                <CardTitle className="text-primary">{doctor.profiles?.full_name || 'Doctor'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-foreground/80">
                  <span className="text-secondary font-semibold">Specialization:</span> {doctor.specialization}
                </p>
                <p className="text-sm text-foreground/80">
                  <span className="text-secondary font-semibold">Hospital:</span> {doctor.hospital_name}
                </p>
                <p className="text-sm text-foreground/80">
                  <span className="text-secondary font-semibold">Address:</span> {doctor.hospital_address}
                </p>
                {doctor.distance && (
                  <p className="text-sm text-accent font-semibold flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {doctor.distance.toFixed(2)} km away
                  </p>
                )}
                <p className="text-sm text-primary font-semibold">
                  Consultation Fee: ₹{doctor.consultation_fee || 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
