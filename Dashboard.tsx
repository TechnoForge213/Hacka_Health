@tailwind base;
@tailwind components;
@tailwind utilities;

/* Definition of the design system. All colors, gradients, fonts, etc should be defined here. 
All colors MUST be HSL.
*/

@layer base {
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;

    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;

    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;

    --primary: 177 100% 50%;
    --primary-foreground: 240 10% 3.9%;
    
    --primary-glow: 177 100% 65%;

    --secondary: 264 100% 65%;
    --secondary-foreground: 0 0% 98%;

    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;

    --accent: 310 100% 60%;
    --accent-foreground: 0 0% 98%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 177 100% 50%;

    --radius: 0.75rem;

    /* Futuristic effects */
    --glow-cyan: 177 100% 50%;
    --glow-purple: 264 100% 65%;
    --glow-pink: 310 100% 60%;
    
    --gradient-primary: linear-gradient(135deg, hsl(177 100% 50%), hsl(264 100% 65%));
    --gradient-accent: linear-gradient(135deg, hsl(264 100% 65%), hsl(310 100% 60%));
    
    --shadow-glow: 0 0 20px hsl(177 100% 50% / 0.5);
    --shadow-glow-strong: 0 0 40px hsl(177 100% 50% / 0.8);
    
    --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    background: radial-gradient(ellipse at top, hsl(240 10% 8%), hsl(240 10% 3.9%));
    min-height: 100vh;
  }
}

@layer components {
  .glass-card {
    @apply rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl;
  }
  
  .glow-border {
    @apply border-primary/50 shadow-[0_0_15px_rgba(0,255,255,0.3)];
  }
  
  .glow-text {
    text-shadow: 0 0 20px hsl(var(--primary) / 0.5);
  }
  
  .hover-glow {
    @apply transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)];
  }
  
  .gradient-text {
    @apply bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent;
  }
}
