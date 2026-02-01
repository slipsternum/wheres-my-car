import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Settings, Trash2, Truck, ChevronDown, Plus, Grid, Key, Link, Copy, Check, X } from 'lucide-react';
import { CarSuvSvg } from './CarIcons';
import { CAR_COMPONENTS } from './CarIcons';
import { CAR_TYPES } from '../constants';
import { apiFetch } from '../services/api';

const DeleteButton = ({ onDelete }) => {
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        if (confirming) {
            const timer = setTimeout(() => setConfirming(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [confirming]);

    if (confirming) {
        return (
            <div className="flex bg-slate-100 rounded-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <button
                    onClick={() => setConfirming(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                    <X size={16} />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 bg-red-500 text-white hover:bg-red-600 transition flex items-center gap-1 text-xs font-bold px-3"
                >
                    <Trash2 size={14} /> Confirm
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Revoke Access"
        >
            <Trash2 size={16} />
        </button>
    );
};

const AccessKeysManager = ({ showNotification }) => {
    const [users, setUsers] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await apiFetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error("Failed to load users", err);
        }
    };

    const handleCreateUser = async () => {
        if (!newName.trim()) return;
        setLoading(true);
        const randomKey = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

        try {
            const res = await apiFetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, key: randomKey })
            });

            if (res.ok) {
                showNotification("User Created");
                setNewName('');
                loadUsers();
            }
        } catch (err) {
            showNotification("Failed to create user");
        }
        setLoading(false);
    };

    const handleDelete = async (key) => {
        try {
            await apiFetch(`/api/users/${key}`, { method: 'DELETE' });
            loadUsers();
            showNotification("Access Revoked");
        } catch (err) {
            showNotification("Failed to delete");
        }
    };

    const copyMagicLink = async (user) => {
        const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;
        const link = `${window.location.origin}${baseUrl}/?key=${user.key}&user=${encodeURIComponent(user.name)}`;
        try {
            await navigator.clipboard.writeText(link);
            showNotification("Link Copied!");
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = link;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification("Link Copied!");
            } catch (e) {
                showNotification("Copy failed");
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-400 mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
                <Key size={14} /> Access Keys
            </h3>

            <div className="space-y-4 mb-6">
                {users.length === 0 && <div className="text-center text-slate-400 text-sm py-4">No active keys. Create one below.</div>}

                {users.map(u => (
                    <div key={u.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <div className="font-bold text-slate-700 text-sm">{u.name}</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-[120px]">
                                {u.key}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => copyMagicLink(u)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                title="Copy Magic Link"
                            >
                                <Link size={16} />
                            </button>
                            <DeleteButton onDelete={() => handleDelete(u.key)} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New User Name"
                    className="flex-1 bg-slate-50 border-none rounded-xl px-3 py-2 text-sm font-bold"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateUser()}
                />
                <button
                    onClick={handleCreateUser}
                    disabled={loading || !newName.trim()}
                    className="bg-slate-800 text-white px-3 rounded-xl flex items-center justify-center disabled:opacity-50"
                >
                    <Plus size={18} />
                </button>
            </div>
        </section>
    );
};

const AdminPanel = ({ config, saveConfig, currentUser, saveUserIdentity, setView, showNotification }) => {
    const [localConfig, setLocalConfig] = useState(JSON.parse(JSON.stringify(config)));
    const [localUser, setLocalUser] = useState(currentUser);
    const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');

    // Local View Settings (Grid)
    const [localGridCols, setLocalGridCols] = useState(() => {
        // Default to 2, use currentUser for key
        return parseInt(localStorage.getItem(`pt_grid_columns_${currentUser}`) || '2');
    });

    const updateConfig = () => {
        // Sync local grid preference to storage (user-specific)
        localStorage.setItem(`pt_grid_columns_${localUser}`, localGridCols);

        // Save User Identity
        saveUserIdentity(localUser);

        // Save Global Config (only if unlocked)
        if (isAdminUnlocked) {
            saveConfig(localConfig);
        } else {
            showNotification("Saved Preferences");
        }

        setView('dashboard');
    };

    const handleUnlock = () => {
        const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
        if (passwordInput === adminPass) {
            setIsAdminUnlocked(true);
            showNotification("Unlocked & Authenticated");

            // Derive root key from password
            const rootKey = btoa(adminPass);
            localStorage.setItem('pt_api_key', rootKey);


        } else {
            showNotification("Incorrect Password");
        }
    };

    const handleArrayInput = (key, val) => {
        const arr = val.split(',').map(s => s.trim()).filter(s => s !== '');
        setLocalConfig({ ...localConfig, [key]: arr });
    };

    // --- Cycle Helpers ---

    const cycleType = (idx) => {
        const newCars = [...localConfig.cars];
        const currentType = newCars[idx].iconType || 'suv';

        let typeIndex = CAR_TYPES.indexOf(currentType);
        if (typeIndex === -1) typeIndex = 0;

        const nextType = CAR_TYPES[(typeIndex + 1) % CAR_TYPES.length];
        newCars[idx].iconType = nextType;
        setLocalConfig({ ...localConfig, cars: newCars });
    };

    const incrementGrid = () => {
        let cols = localGridCols;
        cols = cols >= 4 ? 1 : cols + 1;
        setLocalGridCols(cols);
    };

    const handleCopyLink = async (carId) => {
        const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;
        const url = `${window.location.origin}${baseUrl}/?car=${carId}`;
        try {
            await navigator.clipboard.writeText(url);
            showNotification("Copied!");
        } catch (err) {
            // Fallback for limited execution environments
            const textArea = document.createElement("textarea");
            textArea.value = url;
            textArea.style.position = "fixed";  // Avoid scrolling to bottom
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification("Copied!");
            } catch (e) {
                showNotification("Copy failed");
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="flex items-center gap-3 mb-6 pt-6 px-6">
                <button onClick={() => setView('dashboard')} className="p-2 -ml-2 text-slate-400">
                    <ArrowLeft />
                </button>
                <h2 className="text-xl font-bold text-slate-800">Settings</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 px-6 pb-20 scrollbar-hide">

                {/* Identity */}
                <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-400 mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
                        <User size={14} /> My Identity
                    </h3>
                    <input
                        type="text"
                        value={localUser}
                        onChange={(e) => setLocalUser(e.target.value)}
                        placeholder="e.g. Dad"
                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                    />
                </section>

                {/* --- ADMIN SECTION --- */}
                <div>
                    <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4">Administration</h3>

                    {!isAdminUnlocked ? (
                        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Settings size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2">Admin Locked</h3>
                            <p className="text-xs text-slate-400 mb-4">Enter password to see all settings.</p>

                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold"
                                    placeholder="Password"
                                />
                                <button
                                    onClick={handleUnlock}
                                    className="bg-slate-800 text-white px-4 rounded-xl font-bold text-xs"
                                >
                                    Unlock
                                </button>
                            </div>
                        </section>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            {/* Vehicle Editor */}
                            <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Vehicles</h3>

                                    <span className="text-xs font-bold text-slate-300 bg-slate-100 px-2 py-0.5 rounded-full">{localConfig.cars.length}</span>
                                </div>

                                <div className="space-y-6">
                                    {localConfig.cars.map((car, idx) => {
                                        const CarIcon = CAR_COMPONENTS[car.iconType] || CarSuvSvg;
                                        return (
                                            <div key={car.id} className="flex flex-col gap-3 pb-8 border-b border-slate-100 last:border-0 last:pb-0">
                                                <div className="flex gap-3 items-center">
                                                    {/* Icon Preview */}
                                                    <div className="w-14 h-10 flex-none" style={{ color: car.color }}>
                                                        <CarIcon className="w-full h-full" idPrefix={car.id} />
                                                    </div>
                                                    {/* Name Input */}
                                                    <input
                                                        type="text"
                                                        value={car.name}
                                                        onChange={(e) => {
                                                            const newCars = [...localConfig.cars];
                                                            newCars[idx] = { ...newCars[idx], name: e.target.value };
                                                            setLocalConfig({ ...localConfig, cars: newCars });
                                                        }}
                                                        className="flex-1 bg-slate-50 border-none rounded-xl px-3 py-2 text-sm font-bold placeholder:text-slate-300"
                                                        placeholder="Car Name"
                                                    />
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => {
                                                            const newCars = localConfig.cars.filter((_, i) => i !== idx);
                                                            setLocalConfig({ ...localConfig, cars: newCars });
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                {/* Controls Row 1: Type & Color Display */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => cycleType(idx)}
                                                        className="flex-1 bg-slate-50 hover:bg-slate-100 py-2 rounded-xl flex items-center justify-center gap-2 transition border border-slate-100"
                                                    >
                                                        <Truck size={14} className="text-slate-400" />
                                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{car.iconType || 'suv'}</span>
                                                        <ChevronDown size={12} className="text-slate-300 ml-1" />
                                                    </button>
                                                </div>

                                                {/* Color Picker */}
                                                <div className="pt-1">
                                                    <div className="flex gap-2">
                                                        {/* Visual Picker */}
                                                        <div className="relative w-14 h-11 flex-none cursor-pointer overflow-hidden rounded-xl border-2 border-slate-100 bg-white p-1">
                                                            <input
                                                                type="color"
                                                                value={car.color || '#94a3b8'}
                                                                onChange={(e) => {
                                                                    const newCars = [...localConfig.cars];
                                                                    newCars[idx] = {
                                                                        ...newCars[idx],
                                                                        color: e.target.value,
                                                                        textColor: e.target.value
                                                                    };
                                                                    setLocalConfig({ ...localConfig, cars: newCars });
                                                                }}
                                                                className="absolute -top-2 -left-2 w-[200%] h-[200%] cursor-pointer p-0 m-0 border-0"
                                                            />
                                                        </div>
                                                        {/* Hex Input */}
                                                        <input
                                                            type="text"
                                                            value={car.color || '#94a3b8'}
                                                            onChange={(e) => {
                                                                const newCars = [...localConfig.cars];
                                                                newCars[idx] = {
                                                                    ...newCars[idx],
                                                                    color: e.target.value,
                                                                    textColor: e.target.value
                                                                };
                                                                setLocalConfig({ ...localConfig, cars: newCars });
                                                            }}
                                                            className="flex-1 bg-slate-50 border-none rounded-xl px-3 py-2 text-sm font-mono font-bold uppercase text-slate-600 focus:ring-2 focus:ring-blue-500"
                                                            placeholder="#HEX"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Add Car Button */}
                                <button
                                    onClick={() => {
                                        const newCar = {
                                            id: `c${Date.now()}`,
                                            name: 'New Car',
                                            iconType: 'sedan',
                                            color: '#94a3b8',
                                            textColor: '#94a3b8'
                                        };
                                        setLocalConfig({ ...localConfig, cars: [...localConfig.cars, newCar] });
                                    }}
                                    className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold hover:border-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
                                >
                                    <Plus size={18} /> Add Vehicle
                                </button>
                            </section>

                            {/* Layout & Grid */}
                            <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-400 mb-4 text-xs uppercase tracking-wider">Layout</h3>

                                <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                        <Grid size={16} /> Grid Columns
                                    </span>
                                    <button
                                        onClick={incrementGrid}
                                        className="bg-white shadow-sm px-4 py-1.5 rounded-lg text-sm font-black text-slate-800 active:scale-95 transition"
                                    >
                                        {localGridCols} x
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">Levels</label>
                                    <textarea
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                        rows={1}
                                        defaultValue={localConfig.floors.join(', ')}
                                        onBlur={(e) => handleArrayInput('floors', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">Zones</label>
                                    <textarea
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                        rows={1}
                                        defaultValue={localConfig.sections.join(', ')}
                                        onBlur={(e) => handleArrayInput('sections', e.target.value)}
                                    />
                                </div>
                            </section>

                            {/* Access Keys Section */}
                            <AccessKeysManager showNotification={showNotification} />

                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 pt-0">
                <button
                    onClick={updateConfig}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-lg shadow-slate-200"
                >
                    {isAdminUnlocked ? 'Save All Changes' : 'Save Preferences'}
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;
