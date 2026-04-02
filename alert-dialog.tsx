import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Activity, LogOut, Stethoscope } from 'lucide-react';

export default function DoctorDashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [specialization, setSpecialization] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [consultationFee, setConsultationFee] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
        setSpecialization(data.specialization);
        setHospitalName(data.hospital_name);
        setHospitalAddress(data.hospital_address);
        setConsultationFee(data.consultation_fee?.toString() || '');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, patient:profiles!appointments_patient_id_fkey(full_name, email)')
        .eq('doctor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData: any = {
        user_id: user?.id,
        specialization: specialization as any,
        hospital_name: hospitalName,
        hospital_address: hospitalAddress,
        consultation_fee: parseFloat(consultationFee) || 0,
      };

      const { error } = profile
        ? await supabase
            .from('doctor_profiles')
            .update(profileData)
            .eq('user_id', user?.id)
        : await supabase
            .from('doctor_profiles')
            .insert(profileData);

      if (error) throw error;

      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully",
      });
      
      fetchProfile();
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
          <h1 className="text-3xl font-bold gradient-text">Doctor Dashboard</h1>
        </div>
        <Button onClick={signOut} variant="outline" className="glass-card">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Card className="glass-card glow-border">
        <CardHeader>
          <CardTitle className="text-primary flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Select value={specialization} onValueChange={setSpecialization} required>
                <SelectTrigger className="glass-card glow-border">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general_medicine">General Medicine</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="psychiatry">Psychiatry</SelectItem>
                  <SelectItem value="gynecology">Gynecology</SelectItem>
                  <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
                  <SelectItem value="ent">ENT</SelectItem>
                  <SelectItem value="dentistry">Dentistry</SelectItem>
                  <SelectItem value="oncology">Oncology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required
                className="glass-card glow-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospitalAddress">Hospital Address</Label>
              <Input
                id="hospitalAddress"
                value={hospitalAddress}
                onChange={(e) => setHospitalAddress(e.target.value)}
                required
                className="glass-card glow-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
              <Input
                id="consultationFee"
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                required
                className="glass-card glow-border"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full hover-glow">
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-card glow-border">
        <CardHeader>
          <CardTitle className="text-primary">Your Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-foreground/60 text-center py-4">No appointments yet</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="glass-card p-4 space-y-2">
                  <p className="text-secondary font-semibold">
                    Patient: {appointment.patient?.full_name || 'Unknown'}
                  </p>
                  <p className="text-sm text-foreground/80">
                    Symptoms: {appointment.symptoms}
                  </p>
                  <p className="text-sm text-accent">
                    Status: {appointment.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
