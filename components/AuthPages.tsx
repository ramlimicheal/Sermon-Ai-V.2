import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Check,
  Church,
  Clock,
  FileText,
  Lightbulb,
  Link2,
  Download,
  Star,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AuthPagesProps {
  onComplete: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ onComplete, initialMode = 'signup' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    church: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const benefits = [
    {
      icon: Clock,
      title: 'Save 10+ hours weekly',
      description: 'Reduce sermon prep from 15 hours to just 3-4 hours'
    },
    {
      icon: BookOpen,
      title: 'Deep commentary synthesis',
      description: 'Insights from multiple theological perspectives'
    },
    {
      icon: Lightbulb,
      title: 'Fresh illustrations',
      description: 'Historical, scientific, and modern stories'
    },
    {
      icon: Link2,
      title: 'Cross-references',
      description: 'Connected passages with theological context'
    }
  ];

  const stats = [
    { value: '2,500+', label: 'Pastors' },
    { value: '10,000+', label: 'Sermons' },
    { value: '4.9/5', label: 'Rating' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left Panel - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 border border-white rounded-full" />
          <div className="absolute bottom-40 right-10 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-white rounded-full" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-white text-stone-900 p-2 rounded">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-semibold text-white text-xl">Preachr</span>
          </div>

          {/* Main Message */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-800 rounded-full mb-6">
              <Zap className="h-3.5 w-3.5 text-stone-400" />
              <span className="text-xs text-stone-400">14-day free trial</span>
            </div>
            
            <h1 className="text-4xl font-serif font-medium text-white leading-tight mb-4">
              Prepare powerful sermons in half the time
            </h1>
            <p className="text-stone-400 text-lg leading-relaxed mb-10">
              Join thousands of pastors using intelligent research tools to create more impactful messages.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-stone-800">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-2xl font-medium text-white">{stat.value}</p>
                  <p className="text-xs text-stone-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-5">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-stone-700 transition-colors">
                    <benefit.icon className="h-5 w-5 text-stone-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-0.5">{benefit.title}</h3>
                    <p className="text-sm text-stone-500">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 border-t border-stone-800 pt-8">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-stone-500 text-stone-500" />
            ))}
          </div>
          <p className="text-stone-400 italic mb-4">
            "Preachr has transformed how I prepare sermons. What used to take 15 hours now takes 4."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center text-white text-sm font-medium">
              DC
            </div>
            <div>
              <p className="text-white text-sm font-medium">Pastor David Chen</p>
              <p className="text-stone-500 text-xs">Grace Community Church</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-stone-900 text-white p-2 rounded">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-semibold text-stone-900 text-xl">Preachr</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-medium text-stone-900 mb-2">
              {mode === 'signup' ? 'Start your free trial' : 'Welcome back'}
            </h2>
            <p className="text-stone-500">
              {mode === 'signup' 
                ? 'No credit card required. Cancel anytime.' 
                : 'Sign in to continue to your dashboard.'}
            </p>
          </div>

          {/* Trust badges for signup */}
          {mode === 'signup' && (
            <div className="flex items-center justify-center gap-6 mb-8 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>14-day trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                <span>No card needed</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Pastor John Smith"
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all bg-white text-stone-900 placeholder:text-stone-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Church Name <span className="text-stone-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Church className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                      type="text"
                      value={formData.church}
                      onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                      placeholder="Grace Community Church"
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all bg-white text-stone-900 placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="pastor@church.com"
                  className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all bg-white text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                  className="w-full pl-10 pr-12 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all bg-white text-stone-900 placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {mode === 'signin' && (
                <div className="mt-2 text-right">
                  <button type="button" className="text-sm text-stone-500 hover:text-stone-900">
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div className="bg-stone-100 rounded-lg p-4">
                <p className="text-sm font-medium text-stone-700 mb-3">What you'll get:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Unlimited sermons',
                    'Commentary synthesis',
                    'Illustration finder',
                    'Cross-references',
                    'Export to PDF/Word',
                    'Priority support'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-stone-600" />
                      <span className="text-xs text-stone-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-stone-900 hover:bg-stone-800 py-3 text-base"
            >
              {mode === 'signup' ? 'Start Free Trial' : 'Sign In'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {mode === 'signup' && (
              <p className="text-center text-xs text-stone-400 mt-3">
                No credit card required • Cancel anytime
              </p>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-stone-50 text-stone-400">or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-stone-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors">
              <svg className="h-5 w-5 text-stone-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-sm font-medium text-stone-700">Apple</span>
            </button>
          </div>

          {/* Toggle Mode */}
          <p className="text-center mt-6 text-sm text-stone-500">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setMode('signin')} 
                  className="font-medium text-stone-900 hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button 
                  onClick={() => setMode('signup')} 
                  className="font-medium text-stone-900 hover:underline"
                >
                  Start free trial
                </button>
              </>
            )}
          </p>

          {/* Terms */}
          {mode === 'signup' && (
            <p className="text-center mt-4 text-xs text-stone-400">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-stone-600">Terms</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-stone-600">Privacy Policy</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
