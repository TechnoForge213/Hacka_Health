# 🩺 CareGlow - Intelligent Healthcare System

A next-generation futuristic healthcare facilities web application that connects Patients, Doctors, and Staff within one unified system.

## ✨ Features

### 🎨 Futuristic UI/UX
- **Dark Theme with Neon Glows**: Immersive cyberpunk-inspired interface with cyan, purple, and pink accents
- **3D Animations**: Interactive Three.js background with floating geometric shapes
- **Glassmorphism Design**: Modern frosted glass effect cards with backdrop blur
- **Smooth Transitions**: Buttery smooth animations and hover effects
- **Fully Responsive**: Works flawlessly on mobile, tablet, and desktop devices

### 🔐 Secure Authentication
- Role-based authentication system (Patient, Doctor, Staff)
- Email/password authentication with Lovable Cloud (Supabase)
- Auto-confirmation for seamless onboarding
- JWT-based session management
- Row-Level Security (RLS) policies for data protection

### 👨‍⚕️ Doctor Interface
- Profile management with specialization and hospital details
- View all patient appointments and consultations
- Track patient history and medical records
- Set consultation fees
- Manage prescriptions

### 🏥 Staff Interface
- Hospital and department profile setup
- Create detailed bills with automatic GST calculation (18%)
- Generate invoices with doctor fees and medicine costs
- Access patient and doctor data for hospital operations
- Comprehensive billing management

### 🧑‍🦱 Patient Interface
- Symptom-based doctor search
- Auto-detect location for nearby doctor suggestions
- View doctor specializations, hospitals, and distances
- Access prescribed medicines and treatment costs
- Medical history tracking for future visits
- Real-time distance calculation from patient location

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for styling with custom design system
- **Three.js** via `@react-three/fiber` and `@react-three/drei` for 3D graphics
- **shadcn/ui** for accessible component primitives
- **Lucide Icons** for beautiful iconography

### Backend (Lovable Cloud)
- **Supabase** (PostgreSQL database)
- **Row-Level Security (RLS)** for data protection
- **Real-time capabilities** for instant updates
- **Authentication & Authorization**
- **Edge Functions** for serverless backend logic

## 🗄️ Database Schema

### Core Tables
- **profiles**: User information (email, name, phone)
- **user_roles**: Role assignments (patient, doctor, staff) - separate for security
- **doctor_profiles**: Doctor specialization, hospital details, location, fees
- **staff_profiles**: Hospital name, department information
- **patient_profiles**: Medical history, allergies, blood group, location
- **appointments**: Patient-doctor appointments with symptoms and status
- **prescriptions**: Medicines, dosage, and costs
- **bills**: Treatment billing with GST calculations

### Security Features
- Separate `user_roles` table (prevents privilege escalation)
- RLS policies on all tables
- Security definer functions for role checking
- Automatic profile creation on user signup
- Foreign key constraints with cascade deletes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with WebGL support

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### First Time Setup

1. **Sign Up**: Create an account and select your role (Patient, Doctor, or Staff)
2. **Complete Profile**: Fill in your role-specific information
3. **Enable Location** (Patients): Allow location access for nearby doctor search
4. **Start Using**: Access your role-based dashboard

## 📱 Usage Guide

### For Patients
1. Navigate to "Find Doctors"
2. Describe your symptoms
3. Click "Search Doctors" to find specialists
4. View nearby doctors with distance, fees, and contact info
5. Book appointments and track medical history

### For Doctors
1. Complete your profile with specialization and hospital details
2. Set consultation fees
3. View and manage patient appointments
4. Access patient medical records
5. Create prescriptions

### For Staff
1. Set up hospital and department information
2. Create bills for patient treatments
3. Enter doctor fees and medicine costs
4. System automatically calculates 18% GST
5. Generate invoices and manage billing

## 🔒 Security

- **No SQL Injection**: Parameterized queries via Supabase SDK
- **XSS Protection**: React's built-in XSS prevention
- **CSRF Protection**: SameSite cookies and CORS configuration
- **Password Hashing**: Automatic via Supabase Auth (bcrypt)
- **Role-Based Access Control**: RLS policies enforce data access rules
- **Secure by Default**: All sensitive operations require authentication

## 🎨 Design System

### Color Palette
- **Primary (Cyan)**: `hsl(177 100% 50%)` - Main brand color, glows
- **Secondary (Purple)**: `hsl(264 100% 65%)` - Accent color
- **Accent (Pink)**: `hsl(310 100% 60%)` - Highlights
- **Background**: `hsl(240 10% 3.9%)` - Dark base

### Animations
- `animate-float`: Smooth floating motion (3s loop)
- `animate-glow-pulse`: Pulsing glow effect (2s loop)
- `animate-fade-in`: Fade in with translate (0.5s)

### Utility Classes
- `.glass-card`: Glassmorphism card effect
- `.glow-border`: Neon border glow
- `.glow-text`: Text shadow glow
- `.hover-glow`: Interactive glow on hover
- `.gradient-text`: Rainbow gradient text

## 📦 Deployment

### Lovable Cloud
1. Click "Publish" in the Lovable interface
2. Your app will be deployed to `<your-app>.lovable.app`
3. Custom domains available on paid plans

### Manual Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `dist` folder to any static hosting service (Vercel, Netlify, etc.)

## 🧩 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn UI components
│   ├── dashboard/       # Role-specific dashboards
│   └── ThreeBackground.tsx  # 3D animated background
├── hooks/
│   └── useAuth.tsx      # Authentication hook
├── pages/
│   ├── Auth.tsx         # Login/Signup page
│   ├── Dashboard.tsx    # Main dashboard router
│   └── Index.tsx        # Landing page
├── integrations/
│   └── supabase/        # Auto-generated Supabase client
└── index.css            # Design system & Tailwind config
```

## 🤝 Contributing

This project was built with Lovable. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) - AI-powered web app builder
- UI components from [shadcn/ui](https://ui.shadcn.com)
- 3D graphics powered by [Three.js](https://threejs.org)
- Backend by [Supabase](https://supabase.com)

## 📞 Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Join our community Discord
- Email: support@careglow.dev

---

**Made with 💙 using Lovable** | [Live Demo](https://lovable.dev) | [Documentation](https://docs.lovable.dev)
