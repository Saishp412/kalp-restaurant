'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar as CalendarIcon, Clock, Users, CheckCircle, Hash, Phone } from 'lucide-react';
import TableBlueprint from './TableBlueprint';

export default function ReservationForm() {
  const [step, setStep] = useState(1);
  
  // Custom Dropdowns Open States
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // Refs for closing dropdowns on click outside
  const guestsRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    date: '', // format YYYY-MM-DD
    time: '19:30',
    specialRequests: '',
  });

  // Event & Waitlist State
  const [eventForm, setEventForm] = useState({ eventType: 'Birthday Party', specialRequests: '' });

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState(''); // 'email' or 'sms'

  const fetchTables = async () => {
    try {
      const url = formData.date && formData.time 
        ? `/api/availability?date=${formData.date}&time=${formData.time}` 
        : '/api/tables';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (err) {
      console.error('Failed to fetch tables', err);
    }
  };

  useEffect(() => {
    if (step === 3) {
      fetchTables();
      const interval = setInterval(fetchTables, 5000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setGuestsOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setDateOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target)) {
        setTimeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.date) {
      setStatus({ type: 'error', message: 'Please select a date' });
      return;
    }
    
    if (formData.guests === '11+') {
      setStep(5); // Jump directly to Event Inquiry
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'send', 
          method: verificationMethod, 
          contact: verificationMethod === 'email' ? formData.email : formData.phone 
        })
      });
      if (res.ok) {
        setStep(2); // Go to OTP verification
      } else {
        setStatus({ type: 'error', message: 'Failed to send OTP.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOtpError('');
    try {
      const contact = verificationMethod === 'email' ? formData.email : formData.phone;
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', contact, otp })
      });
      if (res.ok) {
        setStep(3); // Go to blueprint
      } else {
        const data = await res.json();
        setOtpError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setOtpError('Network error during verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedTable) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tableId: selectedTable._id,
          otpVerified: true
        })
      });
      if (res.ok) {
        setStep(4); // Success screen
      } else {
        const data = await res.json();
        setStatus({ type: 'error', message: data.error || 'Failed to book table.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lunch & Dinner time options helper
  const lunchSlots = [
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '01:00 PM' },
    { value: '13:30', label: '01:30 PM' },
    { value: '14:00', label: '02:00 PM' },
    { value: '14:30', label: '02:30 PM' },
    { value: '15:00', label: '03:00 PM' },
    { value: '15:30', label: '03:30 PM' },
    { value: '16:00', label: '04:00 PM' },
  ];

  const dinnerSlots = [
    { value: '19:00', label: '07:00 PM' },
    { value: '19:30', label: '07:30 PM' },
    { value: '20:00', label: '08:00 PM' },
    { value: '20:30', label: '08:30 PM' },
    { value: '21:00', label: '09:00 PM' },
    { value: '21:30', label: '09:30 PM' },
    { value: '22:00', label: '10:00 PM' },
    { value: '22:30', label: '10:30 PM' },
    { value: '23:00', label: '11:00 PM' },
    { value: '23:30', label: '11:30 PM' },
    { value: '00:00', label: '12:00 AM' },
  ];

  const allTimeSlots = [...lunchSlots, ...dinnerSlots];

  const [mounted, setMounted] = useState(false);
  const [availableLunchSlots, setAvailableLunchSlots] = useState(lunchSlots);
  const [availableDinnerSlots, setAvailableDinnerSlots] = useState(dinnerSlots);
  const [next14Days, setNext14Days] = useState([]);
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = new Date();
    
    // Generate 14 days
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate);
    }
    setNext14Days(dates);

    // Filter time slots
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isCurrentlyToday = formData.date === todayStr;
    setIsToday(isCurrentlyToday);

    if (!formData.date || !isCurrentlyToday) {
      setAvailableLunchSlots(lunchSlots);
      setAvailableDinnerSlots(dinnerSlots);
      return;
    }
    
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const filterSlots = (slots) => slots.filter(slot => {
      const [slotHour, slotMinute] = slot.value.split(':').map(Number);
      const slotTimeInMinutes = slotHour * 60 + slotMinute;
      return slotTimeInMinutes > currentTimeInMinutes;
    });

    setAvailableLunchSlots(filterSlots(lunchSlots));
    setAvailableDinnerSlots(filterSlots(dinnerSlots));
  }, [formData.date]);

  // Formatted date string helper
  const formatDateLabel = (dateStr) => {
    if (!dateStr) return 'Select Date';
    const dateObj = new Date(dateStr);
    // Don't format with locale string on server to avoid hydration mismatches
    if (!mounted) return dateStr;
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section id="reserve" className="reservation">
      <div className="container">
        <motion.div 
          className="reservation-wrapper"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="reservation-image">
            <img src="/images/hero-bg.png" alt="Kalp Ambiance" />
            <div className="reservation-image-overlay"></div>
          </div>
          
          <div className="reservation-form-wrapper">
            <AnimatePresence mode="wait">
              {/* STEP 1: BASIC DETAILS */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="section-label">Stage 1 of 3</span>
                  <h2 className="section-title">Reservation Details</h2>
                  <p className="section-subtitle">Enter your details to begin the booking process.</p>
                  
                  <form className="reservation-form" onSubmit={handleSendOtp}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number (For OTP)</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" />
                      </div>
                      
                      {/* CUSTOM GUESTS DROPDOWN */}
                      <div className="form-group" ref={guestsRef}>
                        <label>Number of Guests</label>
                        <div className="custom-dropdown-container">
                          <button
                            type="button"
                            className={`custom-dropdown-trigger ${guestsOpen ? 'open' : ''}`}
                            onClick={() => setGuestsOpen(!guestsOpen)}
                          >
                            <span className="dropdown-trigger-val">
                              <Users size={16} className="dropdown-icon-left" />
                              {formData.guests} {parseInt(formData.guests) === 1 ? 'Guest' : 'Guests'}
                            </span>
                            <ChevronDown size={16} className="dropdown-chevron" />
                          </button>
                          
                          <AnimatePresence>
                            {guestsOpen && (
                              <motion.div 
                                className="custom-dropdown-menu"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                              >
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11+'].map(n => (
                                  <button
                                    key={n}
                                    type="button"
                                    className={`custom-dropdown-option ${formData.guests === n ? 'active' : ''}`}
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, guests: n }));
                                      setGuestsOpen(false);
                                    }}
                                  >
                                    {n} {n === '1' ? 'Guest' : 'Guests'}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      {/* CUSTOM DATE DROPDOWN */}
                      <div className="form-group" ref={dateRef}>
                        <label>Date</label>
                        <div className="custom-dropdown-container">
                          <button
                            type="button"
                            className={`custom-dropdown-trigger ${dateOpen ? 'open' : ''}`}
                            onClick={() => setDateOpen(!dateOpen)}
                          >
                            <span className="dropdown-trigger-val">
                              <CalendarIcon size={16} className="dropdown-icon-left" />
                              {formatDateLabel(formData.date)}
                            </span>
                            <ChevronDown size={16} className="dropdown-chevron" />
                          </button>
                          
                          <AnimatePresence>
                            {dateOpen && (
                              <motion.div 
                                className="custom-dropdown-menu date-menu"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="date-options-grid">
                                  {next14Days.map((d, index) => {
                                    const yyyy = d.getFullYear();
                                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                                    const dd = String(d.getDate()).padStart(2, '0');
                                    const valueStr = `${yyyy}-${mm}-${dd}`;
                                    const isActive = formData.date === valueStr;
                                    
                                    return (
                                      <button
                                        key={index}
                                        type="button"
                                        className={`date-option-card ${isActive ? 'active' : ''}`}
                                        onClick={() => {
                                          setFormData(prev => ({ ...prev, date: valueStr }));
                                          setDateOpen(false);
                                        }}
                                      >
                                        <span className="day-name">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <span className="day-num">{d.getDate()}</span>
                                        <span className="month-name">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* CUSTOM TIME SLOT DROPDOWN (LUNCH / DINNER) */}
                      <div className="form-group" ref={timeRef}>
                        <label>Time</label>
                        <div className="custom-dropdown-container">
                          <button
                            type="button"
                            className={`custom-dropdown-trigger ${timeOpen ? 'open' : ''}`}
                            onClick={() => setTimeOpen(!timeOpen)}
                          >
                            <span className="dropdown-trigger-val">
                              <Clock size={16} className="dropdown-icon-left" />
                              {allTimeSlots.find(slot => slot.value === formData.time)?.label || 'Select Time'}
                            </span>
                            <ChevronDown size={16} className="dropdown-chevron" />
                          </button>
                          
                          <AnimatePresence>
                            {timeOpen && (
                              <motion.div 
                                className="custom-dropdown-menu time-menu"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                              >
                                {/* LUNCH SECTION */}
                                <div className="time-section-header">LUNCH (12 PM - 4 PM)</div>
                                <div className="time-slots-grid">
                                  {availableLunchSlots.length > 0 ? availableLunchSlots.map(slot => (
                                    <button
                                      key={slot.value}
                                      type="button"
                                      className={`time-slot-btn ${formData.time === slot.value ? 'active' : ''}`}
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, time: slot.value }));
                                        setTimeOpen(false);
                                      }}
                                    >
                                      {slot.label}
                                    </button>
                                  )) : (
                                    <div style={{gridColumn: '1/-1', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>
                                      {isToday ? 'No slots available' : 'Not available'}
                                    </div>
                                  )}
                                </div>

                                {/* DINNER SECTION */}
                                <div className="time-section-header" style={{ marginTop: '12px' }}>DINNER (7 PM - 12 AM)</div>
                                <div className="time-slots-grid">
                                  {availableDinnerSlots.length > 0 ? availableDinnerSlots.map(slot => (
                                    <button
                                      key={slot.value}
                                      type="button"
                                      className={`time-slot-btn ${formData.time === slot.value ? 'active' : ''}`}
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, time: slot.value }));
                                        setTimeOpen(false);
                                      }}
                                    >
                                      {slot.label}
                                    </button>
                                  )) : (
                                    <div style={{gridColumn: '1/-1', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>
                                      {isToday ? 'No slots available' : 'Not available'}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-submit mt-4" style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        type="submit" 
                        className="glass-button" 
                        style={{ flex: 1 }} 
                        disabled={isSubmitting}
                        onClick={() => setVerificationMethod('email')}
                      >
                        {isSubmitting && verificationMethod === 'email' ? 'Sending...' : 'Verify via Email'}
                      </button>
                      <button 
                        type="submit" 
                        className="glass-button-solid" 
                        style={{ flex: 1 }} 
                        disabled={isSubmitting}
                        onClick={() => setVerificationMethod('sms')}
                      >
                        {isSubmitting && verificationMethod === 'sms' ? 'Sending...' : 'Verify via SMS'}
                      </button>
                    </div>
                    {status.message && <div className={`form-message ${status.type} mt-4`}>{status.message}</div>}
                  </form>
                </motion.div>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="section-label">Stage 2 of 3</span>
                  <h2 className="section-title">Verify {verificationMethod === 'email' ? 'Email' : 'Phone'}</h2>
                  <p className="section-subtitle">
                    We've sent an OTP to {verificationMethod === 'email' ? formData.email : formData.phone}. (Use 1234 for testing)
                  </p>
                  
                  <form className="reservation-form" onSubmit={handleVerifyOtp}>
                    <div className="form-group">
                      <label htmlFor="otp">Enter 4-digit OTP</label>
                      <input 
                        type="text" 
                        id="otp" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        maxLength={4} 
                        required 
                        style={{ letterSpacing: '0.5em', fontSize: '1.5rem', textAlign: 'center' }} 
                      />
                    </div>
                    
                    <div className="form-submit mt-4" style={{ display: 'flex', gap: '1rem' }}>
                      <button type="button" className="glass-button" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
                      <button type="submit" className="glass-button-solid" style={{ flex: 2 }} disabled={isSubmitting}>
                        {isSubmitting ? 'Verifying...' : 'Verify & Select Table'}
                      </button>
                    </div>
                    {otpError && <div className="form-message error mt-4">{otpError}</div>}
                  </form>
                </motion.div>
              )}

              {/* STEP 3: BLUEPRINT SELECTION */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <span className="section-label">Stage 3 of 3</span>
                  <h2 className="section-title">Select Your Table</h2>
                  <p className="section-subtitle">Choose from our available seating layout.</p>
                  
                  <div style={{ flex: 1, minHeight: '350px', position: 'relative', marginTop: '1rem' }}>
                    <TableBlueprint 
                      tables={tables} 
                      onSelectTable={setSelectedTable} 
                      selectedTableId={selectedTable?._id}
                      guestCount={formData.guests}
                    />
                  </div>
                  
                  <div className="form-submit mt-4" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                     <button type="button" className="glass-button" onClick={() => setStep(1)} style={{ flex: 1 }}>Cancel</button>
                     {!hasAvailableTables ? (
                        <button 
                          type="button" 
                          className="glass-button-solid" 
                          onClick={handleWaitlistSubmit} 
                          disabled={isSubmitting}
                          style={{ flex: 2, background: 'var(--color-accent-amber)' }}
                        >
                          {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                        </button>
                     ) : (
                        <button 
                          type="button" 
                          className="glass-button-solid" 
                          onClick={handleFinalSubmit} 
                          disabled={!selectedTable || isSubmitting}
                          style={{ flex: 2 }}
                        >
                          {isSubmitting ? 'Booking...' : selectedTable ? `Confirm Table ${selectedTable.tableNumber}` : 'Select a table'}
                        </button>
                     )}
                  </div>
                  {status.message && <div className={`form-message ${status.type} mt-4`}>{status.message}</div>}
                </motion.div>
              )}

              {/* STEP 4: SUCCESS */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    style={{ marginBottom: '1.5rem', color: 'var(--color-accent-gold)' }}
                  >
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path 
                        d="M22 11.08V12a10 10 0 1 1-5.93-9.14" 
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                      />
                      <motion.path 
                        d="M22 4L12 14.01l-3-3" 
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.8 }}
                      />
                    </svg>
                  </motion.div>
                  
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
                    Booking Confirmed
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Thank you, <span style={{ color: 'white' }}>{formData.name}</span>. We've sent a receipt to your email.
                  </p>
                  
                  {/* Digital Ticket */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    style={{
                      background: 'linear-gradient(145deg, rgba(30,30,40,0.9) 0%, rgba(18,18,26,0.95) 100%)',
                      border: '1px solid rgba(212, 168, 83, 0.3)',
                      borderRadius: '16px',
                      padding: '2rem',
                      width: '100%',
                      maxWidth: '450px',
                      position: 'relative',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                  >
                    {/* Ticket notches */}
                    <div style={{ position: 'absolute', top: '50%', left: '-12px', width: '24px', height: '24px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '50%', transform: 'translateY(-50%)', borderRight: '1px solid rgba(212, 168, 83, 0.3)' }}></div>
                    <div style={{ position: 'absolute', top: '50%', right: '-12px', width: '24px', height: '24px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '50%', transform: 'translateY(-50%)', borderLeft: '1px solid rgba(212, 168, 83, 0.3)' }}></div>
                    
                    <div style={{ borderBottom: '2px dashed rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                      <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-gold)', fontSize: '1.5rem', fontStyle: 'italic', margin: 0 }}>Kalp.</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>Reservation Pass</p>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>
                          <CalendarIcon size={14} /> Date
                        </div>
                        <div style={{ color: 'white', fontWeight: '500' }}>{formatDateLabel(formData.date)}</div>
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>
                          <Clock size={14} /> Time
                        </div>
                        <div style={{ color: 'white', fontWeight: '500' }}>
                          {allTimeSlots.find(slot => slot.value === formData.time)?.label || formData.time}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>
                          <Users size={14} /> Guests
                        </div>
                        <div style={{ color: 'white', fontWeight: '500' }}>{formData.guests} People</div>
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>
                          <Hash size={14} /> Table
                        </div>
                        <div style={{ color: 'var(--color-accent-gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedTable?.tableNumber}</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    type="button" 
                    className="glass-button mt-8" 
                    onClick={() => window.location.reload()}
                    style={{ width: '100%', maxWidth: '450px' }}
                  >
                    Done
                  </motion.button>
                </motion.div>
              )}

              {/* STEP 5: EVENT INQUIRY */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ width: '100%' }}
                >
                  <span className="section-label">Event Inquiry</span>
                  <h2 className="section-title">Host Your Event</h2>
                  <p className="section-subtitle">For groups larger than 10, please provide some details about your event.</p>
                  
                  <form className="reservation-form mt-6" onSubmit={handleEventSubmit}>
                    <div className="form-group">
                      <label>Event Type</label>
                      <select 
                        value={eventForm.eventType} 
                        onChange={(e) => setEventForm({...eventForm, eventType: e.target.value})}
                        style={{ width: '100%', padding: '12px', background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '8px' }}
                      >
                        <option>Birthday Party</option>
                        <option>Corporate Event</option>
                        <option>Anniversary</option>
                        <option>Private Dining</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Special Requests / Details</label>
                      <textarea 
                        rows="4"
                        value={eventForm.specialRequests}
                        onChange={(e) => setEventForm({...eventForm, specialRequests: e.target.value})}
                        placeholder="Tell us about decorations, dietary requirements, or any specific arrangements..."
                        style={{ width: '100%', padding: '12px', background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '8px', resize: 'none' }}
                      />
                    </div>
                    
                    <div className="form-submit mt-4" style={{ display: 'flex', gap: '1rem' }}>
                      <button type="button" className="glass-button" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
                      <button type="submit" className="glass-button-solid" style={{ flex: 2 }} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 6: WAITLIST/EVENT SUCCESS */}
              {step === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div style={{ fontSize: '4rem', color: 'var(--color-accent-amber)', marginBottom: '1rem' }}>✓</div>
                  <h2 className="section-title">{formData.guests === '11+' ? 'Inquiry Sent!' : 'You\'re on the Waitlist!'}</h2>
                  <p className="section-subtitle">
                    {formData.guests === '11+' 
                      ? 'Our events team will contact you shortly to confirm your booking.' 
                      : `We'll notify you as soon as a table becomes available for ${formData.date} at ${formData.time}.`}
                  </p>
                  
                  <button type="button" className="glass-button mt-8" onClick={() => window.location.reload()}>
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

