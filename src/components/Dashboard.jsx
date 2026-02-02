import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Clock, MapPin } from 'lucide-react';
import { CarSuvSvg } from './CarIcons';
import { CAR_COMPONENTS } from './CarIcons';
import { formatTime } from '../utils/format';
import SkeletonField from './SkeletonField';

const Dashboard = ({ config, parkingStatus, handleStartParking, currentUser, setView, loading }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            className="flex flex-col h-full pt-8 bg-slate-50"
        >

            <div className="flex justify-between items-start px-6 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                        Hi, {currentUser || 'Driver'}
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">
                        Family Parking Tracker
                    </p>
                </div>
                <button onClick={() => setView('admin')} className="p-2 -mr-2 text-slate-300 hover:text-slate-600 transition bg-white rounded-full shadow-sm">
                    <Settings size={20} />
                </button>
            </div>


            <motion.div
                className="flex-1 flex flex-col gap-5 px-6 pb-12 overflow-y-auto"
                initial="visible"
                animate="visible"
                exit="hidden"
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                }}
            >
                {config.cars.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center mt-20 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                            <CarSuvSvg className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No Vehicles</h3>
                        <p className="text-slate-400 text-sm max-w-[200px] mb-6">
                            You haven't added any cars yet.
                        </p>
                        <button
                            onClick={() => setView('admin')}
                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 hover:scale-105 transition active:scale-95"
                        >
                            Add Your First Car
                        </button>
                    </div>
                )}

                {config.cars.map(car => {
                    const status = parkingStatus[car.id];
                    const CarIcon = CAR_COMPONENTS[car.iconType] || CarSuvSvg;

                    return (
                        <motion.div
                            key={car.id}
                            layoutId={`car-card-${car.id}`}
                            variants={{
                                visible: { y: 0, opacity: 1 },
                                hidden: { y: 20, opacity: 0 }
                            }}
                            onClick={() => handleStartParking(car.id)}
                            className="relative bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden transition-all active:scale-[0.98] cursor-pointer group"
                        >
                            <div
                                className={`absolute left-0 top-0 bottom-0 w-1.5 ${!status ? 'bg-slate-200' : ''}`}
                                style={status ? { backgroundColor: car.color } : {}}
                            ></div>

                            <div className="p-5 pl-7">
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col justify-center">
                                            <div className="w-24 h-16 -ml-3 mb-2" style={{ color: car.color }}>
                                                <CarIcon className="w-full h-full drop-shadow-md" idPrefix={car.id} />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">{car.name}</h3>

                                        </div>

                                        <div className="text-right mt-1">
                                            {status ? (
                                                <>
                                                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                                        Location
                                                    </span>
                                                    <span className="text-7xl font-black text-slate-800 leading-none tracking-tight">
                                                        {status.location}
                                                    </span>
                                                </>
                                            ) : (
                                                loading ? (
                                                    <div className="flex flex-col items-end gap-2">
                                                        <SkeletonField width="60px" height="12px" className="mt-1" />
                                                        <SkeletonField width="80px" height="64px" className="mt-2" />
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-400">
                                                        No Data
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {status ? (
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                <Clock size={12} className="text-slate-300" />
                                                {formatTime(status.timestamp)}
                                            </div>

                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                                <User size={12} className="text-slate-300" />
                                                <span>
                                                    {status.user || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        loading ? (
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                                <SkeletonField width="180px" height="12px" className="mt-1" />
                                                <SkeletonField width="50px" height="12px" className="mt-1" />
                                            </div>
                                        ) : (
                                            <div className="text-slate-400 text-sm font-medium flex items-center gap-2 pb-1 border-t border-slate-50 pt-3">
                                                <MapPin size={14} />
                                                Tap to record location
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div >
        </motion.div >
    );
};

export default Dashboard;
