import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Activity, LogOut, FileText } from 'lucide-react';

export default function StaffDashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [hospitalName, setHospitalName] = useState('');
  const [department, setDepartment] = useState('');
  
  // Bill creation form
  const [patientEmail, setPatientEmail] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [treatmentDetails, setTreatmentDetails] = useState('');
  const [doctorFee, setDoctorFee] = useState('');
  const [medicineCost, setMedicineCost] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
        setHospitalName(data.hospital_name);
        setDepartment(data.department);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        user_id: user?.id,
        hospital_name: hospitalName,
        department,
      };

      const { error } = profile
        ? await supabase
            .from('staff_profiles')
            .update(profileData)
            .eq('user_id', user?.id)
        : await supabase
            .from('staff_profiles')
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

  const createBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get patient ID from email
      const { data: patientData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', patientEmail)
        .single();

      if (!patientData) {
        throw new Error('Patient not found');
      }

      // Get doctor ID from email (optional)
      let doctorId = null;
      if (doctorEmail) {
        const { data: doctorData } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', doctorEmail)
          .single();
        doctorId = doctorData?.id;
      }

      const docFee = parseFloat(doctorFee) || 0;
      const medCost = parseFloat(medicineCost) || 0;
      const gstPercentage = 18;
      const subtotal = docFee + medCost;
      const totalAmount = subtotal + (subtotal * gstPercentage / 100);

      const { error } = await supabase
        .from('bills')
        .insert({
          patient_id: patientData.id,
          doctor_id: doctorId,
          staff_id: user?.id,
          treatment_details: treatmentDetails,
          doctor_fee: docFee,
          medicine_cost: medCost,
          gst_percentage: gstPercentage,
          total_amount: totalAmount,
        });

      if (error) throw error;

      toast({
        title: "Bill created",
        description: `Total amount: ₹${totalAmount.toFixed(2)}`,
      });

      // Reset form
      setPatientEmail('');
      setDoctorEmail('');
      setTreatmentDetails('');
      setDoctorFee('');
      setMedicineCost('');
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
          <h1 className="text-3xl font-bold gradient-text">Staff Dashboard</h1>
        </div>
        <Button onClick={signOut} variant="outline" className="glass-card">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card glow-border">
          <CardHeader>
            <CardTitle className="text-primary">Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-4">
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
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
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
            <CardTitle className="text-primary flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Create Bill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createBill} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientEmail">Patient Email</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  required
                  className="glass-card glow-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorEmail">Doctor Email (Optional)</Label>
                <Input
                  id="doctorEmail"
                  type="email"
                  value={doctorEmail}
                  onChange={(e) => setDoctorEmail(e.target.value)}
                  className="glass-card glow-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatmentDetails">Treatment Details</Label>
                <Input
                  id="treatmentDetails"
                  value={treatmentDetails}
                  onChange={(e) => setTreatmentDetails(e.target.value)}
                  required
                  className="glass-card glow-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorFee">Doctor Fee (₹)</Label>
                <Input
                  id="doctorFee"
                  type="number"
                  value={doctorFee}
                  onChange={(e) => setDoctorFee(e.target.value)}
                  required
                  className="glass-card glow-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicineCost">Medicine Cost (₹)</Label>
                <Input
                  id="medicineCost"
                  type="number"
                  value={medicineCost}
                  onChange={(e) => setMedicineCost(e.target.value)}
                  required
                  className="glass-card glow-border"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full hover-glow">
                {loading ? 'Creating...' : 'Create Bill (18% GST)'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
