'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, Users, IndianRupee, Activity, Check } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('floor');
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Modal State
  const [manageTable, setManageTable] = useState(null);
  const [walkInForm, setWalkInForm] = useState({ name: '', phone: '', email: 'walkin@kalp.com', guests: '2' });
  const [modalStatus, setModalStatus] = useState('');

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);

    const h = String(today.getHours()).padStart(2, '0');
    const m = today.getMinutes() >= 30 ? '30' : '00';
    setSelectedTime(`${h}:${m}`);
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedDate || !selectedTime) return;
    
    try {
      const [tableRes, resRes, waitlistRes, eventRes, analyticsRes] = await Promise.all([
        fetch(`/api/availability?date=${selectedDate}&time=${selectedTime}`),
        fetch('/api/reservations'),
        fetch('/api/waitlist'),
        fetch('/api/events'),
        fetch('/api/analytics')
      ]);
      
      if (tableRes.ok) setTables(await tableRes.json());
      if (resRes.ok) setReservations(await resRes.json());
      if (waitlistRes.ok) setWaitlist(await waitlistRes.json());
      if (eventRes.ok) setEvents(await eventRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10 seconds to not spam too much
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      const res = await fetch('/api/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, status: newStatus })
      });
      if (res.ok) {
        setManageTable(null);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update table status', err);
    }
  };

  const handleWalkInSubmit = async (e) => {
    e.preventDefault();
    setModalStatus('Submitting...');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...walkInForm,
          date: selectedDate,
          time: selectedTime,
          tableId: manageTable._id,
          otpVerified: true
        })
      });
      if (res.ok) {
        setManageTable(null);
        fetchData();
        setModalStatus('');
      } else {
        const data = await res.json();
        setModalStatus(data.error || 'Failed to create walk-in');
      }
    } catch (err) {
      setModalStatus('Network Error');
    }
  };

  const handleWaitlistStatus = async (id, status) => {
    try {
      await fetch(`/api/waitlist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error('Failed to update waitlist', err);
    }
  };

  const handleEventStatus = async (id, status) => {
    try {
      await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error('Failed to update event status', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Failed to logout', err);
    }
  };

  if (loading) return <div className="p-12 text-center text-white">Loading Admin Dashboard...</div>;

  return (
    <div className="admin-dashboard container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 0 }}>Admin Control Panel</h1>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem', textDecoration: 'underline' }}>Logout</button>
        </div>
        
        {/* TABS */}
        <div style={{ display: 'flex', gap: '10px', background: 'var(--color-bg-tertiary)', padding: '5px', borderRadius: '12px' }}>
          <button onClick={() => setActiveTab('floor')} className={`glass-button ${activeTab === 'floor' ? 'active-tab' : ''}`} style={{ border: activeTab === 'floor' ? '1px solid var(--color-accent-gold)' : 'none' }}>Floor Plan</button>
          <button onClick={() => setActiveTab('waitlist')} className={`glass-button ${activeTab === 'waitlist' ? 'active-tab' : ''}`} style={{ border: activeTab === 'waitlist' ? '1px solid var(--color-accent-gold)' : 'none' }}>Waitlist & Events</button>
          <button onClick={() => setActiveTab('analytics')} className={`glass-button ${activeTab === 'analytics' ? 'active-tab' : ''}`} style={{ border: activeTab === 'analytics' ? '1px solid var(--color-accent-gold)' : 'none' }}>Analytics</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* FLOOR PLAN TAB */}
        {activeTab === 'floor' && (
          <motion.div key="floor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--glass-bg)', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Date Filter</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'white', padding: '8px 12px', borderRadius: '8px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Time Filter</label>
                <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} step="1800" style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'white', padding: '8px 12px', borderRadius: '8px' }} />
              </div>
              <div className="blueprint-legend" style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                <div className="legend-item"><span className="legend-color free"></span> Free</div>
                <div className="legend-item"><span className="legend-color reserved"></span> Reserved</div>
                <div className="legend-item"><span className="legend-color occupied"></span> Occupied</div>
              </div>
            </div>

            <div className="admin-grid">
              <div className="admin-panel blueprint-panel">
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-gold)', marginBottom: '1rem' }}>Floor Plan ({selectedDate} @ {selectedTime})</h2>
                <div className="blueprint-canvas admin-canvas">
                  <div className="blueprint-label kitchen-label">KITCHEN</div>
                  <div className="blueprint-lobby"><span className="lobby-text">WALKWAY / LOBBY</span></div>
                  <div className="blueprint-label entrance-label">ENTRANCE</div>
                  {tables.map(table => (
                    <motion.div
                      key={table._id}
                      className={`blueprint-table shape-${table.shape} status-${table.status} admin-table-interactive`}
                      style={{ left: `${table.position.x}%`, top: `${table.position.y}%`, cursor: 'pointer' }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setManageTable(table);
                        setWalkInForm({ name: '', phone: '', email: 'walkin@kalp.com', guests: String(Math.min(2, table.capacity)) });
                        setModalStatus('');
                      }}
                    >
                      <span className="table-number">{table.tableNumber}</span>
                      <span className="table-capacity">{table.capacity} Seats</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="admin-panel reservations-panel">
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-gold)', marginBottom: '1rem' }}>Recent Reservations</h2>
                <div className="reservations-list">
                  {reservations.length === 0 ? <p>No reservations found.</p> : reservations.map(res => {
                    const tableInfo = tables.find(t => t._id === res.tableId);
                    return (
                      <div key={res._id} className="reservation-card">
                        <div className="res-header">
                          <strong>{res.name}</strong>
                          <span className={`status-badge ${res.status}`}>{res.status}</span>
                        </div>
                        <div className="res-details">
                          <p><strong>Table:</strong> {tableInfo ? tableInfo.tableNumber : 'Unassigned'}</p>
                          <p><strong>Date:</strong> {new Date(res.date).toLocaleDateString()} @ {res.time}</p>
                          <p><strong>Guests:</strong> {res.guests}</p>
                          <p><strong>Phone:</strong> {res.phone} {res.otpVerified && <span style={{color: 'green', fontSize: '0.8rem'}}>✓</span>}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* WAITLIST & EVENTS TAB */}
        {activeTab === 'waitlist' && (
          <motion.div key="waitlist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              
              {/* Waitlist */}
              <div className="admin-panel">
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-gold)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={24} /> Live Waitlist
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {waitlist.length === 0 ? <p>Waitlist is empty.</p> : waitlist.map(entry => (
                    <div key={entry._id} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>{entry.name}</h3>
                        <span className={`status-badge ${entry.status}`}>{entry.status}</span>
                      </div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
                        <p>{entry.date} @ {entry.time} • {entry.guests} Guests</p>
                        <p>{entry.phone} • {entry.email}</p>
                      </div>
                      {entry.status === 'waiting' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleWaitlistStatus(entry._id, 'notified')} className="glass-button" style={{ flex: 1, fontSize: '0.8rem' }}>Notify</button>
                          <button onClick={() => handleWaitlistStatus(entry._id, 'seated')} className="glass-button-solid" style={{ flex: 1, fontSize: '0.8rem' }}>Mark Seated</button>
                        </div>
                      )}
                      {entry.status === 'notified' && (
                        <button onClick={() => handleWaitlistStatus(entry._id, 'seated')} className="glass-button-solid" style={{ width: '100%', fontSize: '0.8rem' }}>Mark Seated</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Inquiries */}
              <div className="admin-panel">
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-gold)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={24} /> Event Inquiries
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {events.length === 0 ? <p>No event inquiries.</p> : events.map(evt => (
                    <div key={evt._id} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>{evt.name}</h3>
                        <span className={`status-badge ${evt.status}`}>{evt.status}</span>
                      </div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
                        <p><strong>Type:</strong> {evt.eventType}</p>
                        <p><strong>Date:</strong> {evt.date}</p>
                        <p><strong>Guests:</strong> {evt.guests}+</p>
                        <p><strong>Contact:</strong> {evt.phone}</p>
                        {evt.specialRequests && <p style={{ marginTop: '10px', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>"{evt.specialRequests}"</p>}
                      </div>
                      {evt.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleEventStatus(evt._id, 'declined')} className="glass-button" style={{ flex: 1, fontSize: '0.8rem' }}>Decline</button>
                          <button onClick={() => handleEventStatus(evt._id, 'approved')} className="glass-button-solid" style={{ flex: 1, fontSize: '0.8rem', background: '#4ade80', color: 'black' }}>Approve</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && analytics && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="admin-panel" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CalendarIcon size={32} style={{ color: 'var(--color-accent-gold)', margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: '2.5rem', margin: 0, color: 'white' }}>{analytics.totalReservations}</h3>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Total Bookings</p>
              </div>
              <div className="admin-panel" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Users size={32} style={{ color: '#4ade80', margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: '2.5rem', margin: 0, color: 'white' }}>{analytics.totalGuests}</h3>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Guests Served</p>
              </div>
              <div className="admin-panel" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Activity size={32} style={{ color: 'var(--color-accent-rose)', margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: '2.5rem', margin: 0, color: 'white' }}>{analytics.totalWaitlist}</h3>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Waitlist Signups</p>
              </div>
              <div className="admin-panel" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <IndianRupee size={32} style={{ color: 'var(--color-accent-amber)', margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: '2.5rem', margin: 0, color: 'white' }}>{analytics.estimatedRevenue.toLocaleString('en-IN')}</h3>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Est. Revenue</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              {/* Reservations by Date Chart */}
              <div className="admin-panel">
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', marginBottom: '2rem' }}>Bookings Over Time</h2>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '300px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)', position: 'relative' }}>
                  {analytics.reservationsByDate.map((day, i) => {
                    // Max height 250px relative to max count
                    const maxCount = Math.max(...analytics.reservationsByDate.map(d => d.count), 1);
                    const height = (day.count / maxCount) * 250;
                    return (
                      <div key={day._id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>{day.count}</span>
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: `${height}px` }} 
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          style={{ width: '100%', background: 'linear-gradient(to top, var(--color-accent-gold), var(--color-accent-amber))', borderRadius: '4px 4px 0 0' }}
                        ></motion.div>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>{day._id.split('-').slice(1).join('/')}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Popular Times */}
              <div className="admin-panel">
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', marginBottom: '2rem' }}>Peak Dining Hours</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {analytics.popularTimes.map((time, i) => {
                    const maxCount = Math.max(...analytics.popularTimes.map(t => t.count), 1);
                    const width = (time.count / maxCount) * 100;
                    return (
                      <div key={time._id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                          <span style={{ color: 'white' }}>{time._id}</span>
                          <span style={{ color: 'var(--color-text-muted)' }}>{time.count} bookings</span>
                        </div>
                        <div style={{ width: '100%', background: 'var(--color-bg-tertiary)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${width}%` }} 
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            style={{ height: '100%', background: 'var(--color-accent-gold)' }}
                          ></motion.div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {manageTable && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ background: 'var(--color-bg-secondary)', padding: '30px', borderRadius: '16px', border: '1px solid var(--color-border)', width: '100%', maxWidth: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <button 
                onClick={() => setManageTable(null)}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
              
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-gold)', marginBottom: '5px' }}>Manage Table {manageTable.tableNumber}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Current Status: <strong className={`status-badge ${manageTable.status}`}>{manageTable.status}</strong></p>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <button type="button" className="glass-button" style={{ flex: 1 }} onClick={() => handleStatusChange(manageTable._id, 'free')}>
                  Mark as Free
                </button>
                <button type="button" className="glass-button" style={{ flex: 1 }} onClick={() => handleStatusChange(manageTable._id, 'occupied')}>
                  Mark as Occupied
                </button>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: 'white' }}>Walk-in Reservation</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '15px' }}>
                Create a reservation for <strong>{selectedDate} @ {selectedTime}</strong>
              </p>

              <form onSubmit={handleWalkInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Name</label>
                    <input type="text" required value={walkInForm.name} onChange={e => setWalkInForm({...walkInForm, name: e.target.value})} style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', color: 'white' }} placeholder="Walk-in Customer" />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Phone</label>
                    <input type="tel" required value={walkInForm.phone} onChange={e => setWalkInForm({...walkInForm, phone: e.target.value})} style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', color: 'white' }} placeholder="Phone" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Email (Optional)</label>
                    <input type="email" value={walkInForm.email} onChange={e => setWalkInForm({...walkInForm, email: e.target.value})} style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Guests</label>
                    <input type="number" min="1" max={manageTable.capacity} value={walkInForm.guests} onChange={e => setWalkInForm({...walkInForm, guests: e.target.value})} style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', color: 'white' }} />
                  </div>
                </div>

                <button type="submit" className="glass-button-solid" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
                  Book Walk-in
                </button>
                {modalStatus && <p style={{ color: modalStatus.includes('Failed') || modalStatus.includes('Error') ? '#ef4444' : '#4ade80', textAlign: 'center', fontSize: '0.9rem', marginTop: '5px' }}>{modalStatus}</p>}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
