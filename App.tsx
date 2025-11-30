import React, { useState, useEffect, useRef } from 'react';
import { User, Medicine, MedicineType } from './types';
import * as api from './services/api';
import InputField from './components/InputField';
import Button from './components/Button';
import MedicineCard from './components/MedicineCard';

enum View {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD,
  DASHBOARD,
  PROFILE
}

const AVATARS = ['👨‍⚕️','👩‍⚕️','🧑‍⚕️','💊','🏥','❤️','🩺','🧬'];
const MEDICINE_TYPES: MedicineType[] = ['Tablet','Capsule','Syrup','Injection','Drops','Inhaler','Cream','Other'];
const QUOTES = [
  "The greatest wealth is health.",
  "Take care of your body. It's the only place you have to live.",
  "Health is a duty."
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('');

  // Auth State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [fpEmail, setFpEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Dashboard
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('');
  const [medType, setMedType] = useState<MedicineType>('Tablet');
  const [editingId, setEditingId] = useState('');
  const [isMedLoading, setIsMedLoading] = useState(false);
  const [loadingMeds, setLoadingMeds] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  // Profile
  const [avatar, setAvatar] = useState(AVATARS[0]);

  /* ==== Dark Mode Startup ==== */
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const mode = !darkMode;
    setDarkMode(mode);
    localStorage.setItem('darkMode', mode.toString());
    document.documentElement.classList.toggle('dark', mode);
  };

  /* ==== App Startup ==== */
  useEffect(() => {
    setDailyQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        const u = JSON.parse(storedUser);
        setUser(u);

        const savedAvatar = localStorage.getItem(`avatar_${u._id || u.id}`);
        if (savedAvatar) setAvatar(savedAvatar);

        setCurrentView(View.DASHBOARD);
      } catch {
        localStorage.clear();
      }
    }
  }, []);

  /* ==== Load Medicines on Dashboard ==== */
  useEffect(() => {
    if (user && currentView === View.DASHBOARD) loadMedicines();
  }, [user, currentView]);

  /* ==== Load Medicines ==== */
  const loadMedicines = async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingMeds(true);
    try {
      const data = await api.getMedicines(token);
      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load medicines", err);
    } finally {
      setLoadingMeds(false);
    }
  };

  /* ==== Login ==== */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    try {
      const res = await api.login({
        email: loginIdentifier.trim(),
        password: loginPassword
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);

      const id = res.user._id || res.user.id;
      const savedAvatar = localStorage.getItem(`avatar_${id}`);
      if (savedAvatar) setAvatar(savedAvatar);

      setCurrentView(View.DASHBOARD);
      setLoginIdentifier('');
      setLoginPassword('');
    } catch (err: any) {
      setAuthError(err.message || "Login failed");
    } finally {
      setIsAuthLoading(false);
    }
  };

  /* ==== Register ==== */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    let email = undefined;
    if (regContact.includes("@")) email = regContact.trim();

    try {
      const res = await api.register({
        name: regUsername.trim(),
        email,
        password: regPassword
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      setCurrentView(View.DASHBOARD);

      setRegUsername('');
      setRegContact('');
      setRegPassword('');
    } catch (err: any) {
      setAuthError(err.message || "Registration failed");
    } finally {
      setIsAuthLoading(false);
    }
  };

  /* ==== Forgot Password ==== */
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsAuthLoading(true);

    try {
      const res = await api.forgotPassword(fpEmail);
      setAuthSuccess(res.message || "If an account exists, a reset link was sent.");
      setFpEmail('');
    } catch (err: any) {
      setAuthError(err.message || "Failed to process.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  /* ==== Logout ==== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMedicines([]);
    setCurrentView(View.LOGIN);
  };

  /* ==== Edit Medicine ==== */
  const handleEditClick = (m: Medicine) => {
    setEditingId(m._id || '');
    setMedName(m.name);
    setMedDosage(m.dosage);
    setMedFrequency(m.frequency);
    setMedType(m.type || 'Tablet');
  };

  const handleCancelEdit = () => {
    setEditingId('');
    setMedName('');
    setMedDosage('');
    setMedFrequency('');
    setMedType('Tablet');
  };

  /* ==== Save Medicine ==== */
  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const token = localStorage.getItem("token");
    const userId = user._id || user.id;

    setIsMedLoading(true);
    try {
      if (editingId) {
        const updated = await api.updateMedicine(token!, editingId, {
          name: medName,
          dosage: medDosage,
          frequency: medFrequency,
          type: medType,
          user: userId
        });

        setMedicines(prev =>
          prev.map(m => (m._id === editingId ? updated : m))
        );
      } else {
        const created = await api.addMedicine(token!, {
          name: medName,
          dosage: medDosage,
          frequency: medFrequency,
          type: medType,
          user: userId
        });

        setMedicines(prev => [...prev, created]);
      }

      handleCancelEdit();
    } catch (err: any) {
      alert(err.message || "Failed to save medicine");
    } finally {
      setIsMedLoading(false);
    }
  };

  /* ==== Delete Medicine ==== */
  const handleDeleteMedicine = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure?")) return;

    setDeletingId(id);
    try {
      await api.deleteMedicine(token!, id);
      setMedicines(prev => prev.filter(m => m._id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err: any) {
      alert(err.message || "Delete failed");
    } finally {
      setDeletingId('');
    }
  };

  /* ==== Save Profile ==== */
  const saveProfile = () => {
    const id = user?._id || user?.id;
    localStorage.setItem(`avatar_${id}`, avatar);
    alert("Profile saved!");
  };

  // ============================
  //  UI SCREEN RENDERING BELOW
  //  (Unchanged from your design)
  // ============================

  if (currentView === View.LOGIN) {
    return (
      <>
        {/* LOGIN UI — unchanged */}
      </>
    );
  }

  if (currentView === View.REGISTER) {
    return (
      <>
        {/* REGISTER UI — unchanged */}
      </>
    );
  }

  if (currentView === View.FORGOT_PASSWORD) {
    return (
      <>
        {/* FORGOT PASSWORD UI — unchanged */}
      </>
    );
  }

  return (
    <>
      {/* DASHBOARD + PROFILE UI — unchanged */}
    </>
  );
};

export default App;
