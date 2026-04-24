import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import api from '../api/axios';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const SUBJECT_PALETTE = [
  { bg: '#232051', text: '#ffffff' },
  { bg: '#3658C9', text: '#ffffff' },
  { bg: '#5B85E8', text: '#ffffff' },
  { bg: '#E09B3D', text: '#ffffff' },
  { bg: '#4CAF50', text: '#ffffff' },
  { bg: '#8E44AD', text: '#ffffff' },
  { bg: '#D9534F', text: '#ffffff' },
  { bg: '#667B9E', text: '#ffffff' },
];

// Assign consistent color by subject name hash
const getSubjectColor = (name) => {
  if (!name) return SUBJECT_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return SUBJECT_PALETTE[Math.abs(hash) % SUBJECT_PALETTE.length];
};

// ─── OCR Upload Modal ─────────────────────────────────────────────────────────
const OcrModal = ({ onClose, onUploadSuccess }) => {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleOcrSubmit = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('timetable', file);
    try {
      const response = await api.post('/timetable/ocr', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onUploadSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('OCR upload failed:', error);
      alert(error.response?.data?.error || 'OCR processing failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#232051]/20 backdrop-blur-[4px]">
      <div className="bg-white rounded-[2rem] p-10 w-full max-w-[520px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-[#A5A8B6] hover:text-[#232051] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <h4 className="text-[10px] font-[800] text-[#3658C9] uppercase tracking-widest mb-1">OCR Processing</h4>
        <h3 className="text-[#232051] text-[24px] font-bold mb-1">Upload Timetable</h3>
        <p className="text-[#848795] text-[13px] font-medium mb-8">Upload an image or PDF. The system will extract timetable data automatically.</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          onClick={() => inputRef.current.click()}
          className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all h-[180px] ${dragging ? 'border-[#232051] bg-[#EAEFF7]' : 'border-[#DCE4F0] bg-[#F9FAFC] hover:border-[#3658C9]'}`}
        >
          <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          {file ? (
            <div className="text-center">
              <p className="text-[14px] font-bold text-[#232051]">{file.name}</p>
              <p className="text-[12px] text-[#848795] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-[14px] font-bold text-[#232051]">Drop your file here</p>
              <p className="text-[12px] text-[#848795] mt-1">or click to browse · PNG, JPG, PDF</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 h-[54px] rounded-2xl text-[14px] font-bold text-[#848795] hover:text-[#232051] transition-colors">Cancel</button>
          <button disabled={!file || uploading} onClick={handleOcrSubmit} className="flex-1 h-[54px] bg-[#232051] text-white rounded-2xl text-[14px] font-bold hover:bg-[#343568] transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed">
            {uploading ? 'Processing...' : file ? 'Process with OCR' : 'Select a File First'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Manual Entry Modal ───────────────────────────────────────────────────────
const EntryModal = ({ onClose, existing, onSuccess, classes, faculties, rooms, subjects }) => {
  const [form, setForm] = useState(existing || { classId: '', subjectId: '', facultyId: '', roomId: '', day: 'Monday', startTime: '08:00', endTime: '09:00' });
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayIndex = daysArray.indexOf(form.day);
      const payload = { classId: form.classId, dayOfWeek: dayIndex, subjectId: form.subjectId, facultyId: form.facultyId, roomId: form.roomId };
      if (existing?.id) {
        await api.patch(`/timetable/${existing.id}`, payload);
      } else {
        await api.post('/timetable', payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save timetable entry.');
    } finally {
      setSubmitting(false);
    }
  };

  const SelectField = ({ label, fieldKey, options }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">{label}</label>
      <select className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[14px] text-[#232051] font-bold outline-none appearance-none cursor-pointer" value={form[fieldKey]} onChange={(e) => set(fieldKey, e.target.value)}>
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#232051]/20 backdrop-blur-[4px]">
      <div className="bg-white rounded-[2rem] p-10 w-full max-w-[520px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-8 right-8 text-[#A5A8B6] hover:text-[#232051] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <h4 className="text-[10px] font-[800] text-[#3658C9] uppercase tracking-widest mb-1">{existing ? 'Edit Entry' : 'Manual Entry'}</h4>
        <h3 className="text-[#232051] text-[24px] font-bold mb-6">{existing ? 'Update Timetable Entry' : 'Create Timetable Entry'}</h3>
        <div className="flex flex-col gap-5">
          <SelectField label="Class" fieldKey="classId" options={classes.map((c) => ({ value: c.id, label: c.name }))} />
          <SelectField label="Subject" fieldKey="subjectId" options={subjects.map((s) => ({ value: s.id, label: s.name }))} />
          <SelectField label="Faculty" fieldKey="facultyId" options={faculties.map((f) => ({ value: f.id, label: f.name }))} />
          <SelectField label="Room" fieldKey="roomId" options={rooms.map((r) => ({ value: r.id, label: r.name }))} />
          <SelectField label="Day" fieldKey="day" options={DAYS.map((d) => ({ value: d, label: d }))} />
          <div className="grid grid-cols-2 gap-4">
            {[{ label: 'Start Time', key: 'startTime' }, { label: 'End Time', key: 'endTime' }].map(({ label, key }) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">{label}</label>
                <input type="time" className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[14px] text-[#232051] font-bold outline-none" value={form[key]} onChange={(e) => set(key, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3">
            <button onClick={onClose} className="flex-1 h-[54px] rounded-2xl text-[14px] font-bold text-[#848795] hover:text-[#232051] transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} className={`flex-1 h-[54px] text-white rounded-2xl text-[14px] font-bold shadow-md transition-colors disabled:opacity-50 ${existing ? 'bg-[#3658C9] hover:bg-[#2643A3]' : 'bg-[#232051] hover:bg-[#343568]'}`}>
              {submitting ? 'Saving...' : existing ? 'Update Entry' : 'Create Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Timetable = () => {
  const [viewBy, setViewBy] = useState('class');
  const [filterValue, setFilterValue] = useState('');
  const [showOcr, setShowOcr] = useState(false);
  const [showEntry, setShowEntry] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reference data for dropdowns
  const [classes, setClasses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Load reference data once
  useEffect(() => {
    const loadRefData = async () => {
      try {
        const [clsRes, subRes, roomsRes, facRes] = await Promise.all([
          api.get('/academic/classes'),
          api.get('/academic/subjects'),
          api.get('/rooms'),
          api.get('/users/faculty'),
        ]);
        const cls = clsRes.data?.data || [];
        setClasses(cls);
        setSubjects(subRes.data?.data || []);
        setRooms(roomsRes.data?.rooms || roomsRes.data || []);
        setFaculties((facRes.data || []).map(f => ({ id: f.id, name: f.user?.name || 'Faculty' })));
        
        // Set default filter to "General (Auto)" if available, else first class
        if (cls.length > 0) {
          const defaultCls = cls.find(c => c.name.includes('General')) || cls[0];
          setFilterValue(defaultCls.id);
        }
      } catch (err) {
        console.error('Failed to load reference data:', err);
      }
    };
    loadRefData();
  }, []);

  // Fetch timetable when viewBy or filterValue changes
  useEffect(() => {
    if (!filterValue) return;
    const fetchTimetable = async () => {
      setLoading(true);
      try {
        // Routes: /timetable/class/:id | /timetable/faculty/:id | /timetable/room/:id
        const endpoint = `/timetable/${viewBy}/${filterValue}`;
        const response = await api.get(endpoint);
        const data = response.data || [];
        const mapped = data.map((item) => ({
          id: item.id,
          day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][item.dayOfWeek],
          start: Math.floor((item.timeSlot?.startMinutes ?? 0) / 60) - 8,
          end: Math.floor((item.timeSlot?.endMinutes ?? 0) / 60) - 8,
          subject: item.subject?.name || 'Unknown',
          faculty: item.faculty?.name || 'Unassigned',
          room: item.room?.name || 'TBA',
          rawId: item.id,
        }));
        setEntries(mapped);
      } catch (err) {
        console.error('Failed to fetch timetable:', err);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [viewBy, filterValue]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this timetable entry?')) return;
    try {
      await api.delete(`/timetable/${id}`);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert('Failed to delete entry.');
    }
  };

  // Build filter options based on current viewBy
  const filterOptions = viewBy === 'class' ? classes : viewBy === 'faculty' ? faculties : rooms;

  // Build grid map
  const gridMap = {};
  DAYS.forEach((d) => { gridMap[d] = {}; });
  entries.forEach((e) => { if (e.day && e.start >= 0) gridMap[e.day][e.start] = e; });

  return (
    <div className="flex min-h-screen bg-[#EAEFF7] font-manrope selection:bg-[#232051] selection:text-white">
      <Sidebar />
      <div className="flex-1 p-10 md:p-14 h-screen overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h4 className="text-[11px] font-[800] text-[#3658C9] uppercase tracking-[0.15em] mb-1">Schedule Registry</h4>
            <h2 className="text-[34px] font-[800] text-[#232051] tracking-tight leading-none">Timetable</h2>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button onClick={() => setShowOcr(true)} className="h-[44px] px-6 rounded-full bg-white text-[#232051] font-bold text-[13px] border border-[#DCE4F0] hover:border-[#232051]/30 hover:shadow-sm transition-all flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              Upload via OCR
            </button>
            <button onClick={() => { setEditEntry(null); setShowEntry(true); }} className="h-[44px] px-6 rounded-full bg-[#232051] text-white font-bold text-[13px] hover:bg-[#343568] transition-all flex items-center gap-2 shadow-md">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Manual Entry
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex bg-white rounded-2xl p-1.5 gap-1 shadow-sm border border-[#F4F5F8]">
            {[{ id: 'class', label: 'By Class' }, { id: 'faculty', label: 'By Faculty' }, { id: 'room', label: 'By Room' }].map((t) => (
              <button key={t.id} onClick={() => { setViewBy(t.id); setFilterValue(''); }}
                className={`px-5 py-2.5 rounded-xl font-bold text-[12px] transition-all ${viewBy === t.id ? 'bg-[#232051] text-white shadow-sm' : 'text-[#848795] hover:text-[#232051]'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}
            className="h-[44px] px-5 bg-white rounded-2xl text-[14px] font-bold text-[#232051] outline-none border border-[#F4F5F8] shadow-sm cursor-pointer appearance-none pr-10">
            <option value="">Select {viewBy}…</option>
            {filterOptions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>

          {loading && (
            <div className="w-5 h-5 border-2 border-[#232051] border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Timetable Grid */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-transparent hover:border-[#EAEFF7] transition-colors overflow-hidden">
          <div className="grid border-b border-[#F4F5F8]" style={{ gridTemplateColumns: '80px repeat(5, 1fr)' }}>
            <div className="p-5 border-r border-[#F4F5F8]"><span className="text-[9px] font-[800] text-[#C0C3CE] uppercase tracking-wider">Time</span></div>
            {DAYS.map((day) => (
              <div key={day} className="p-5 text-center border-r border-[#F4F5F8] last:border-r-0">
                <span className="text-[12px] font-[800] text-[#232051]">{day}</span>
              </div>
            ))}
          </div>

          {TIME_SLOTS.map((slot, rowIdx) => (
            <div key={slot} className="grid border-b border-[#F4F5F8] last:border-b-0 min-h-[72px]" style={{ gridTemplateColumns: '80px repeat(5, 1fr)' }}>
              <div className="p-4 border-r border-[#F4F5F8] flex items-start pt-5">
                <span className="text-[11px] font-bold text-[#A5A8B6]">{slot}</span>
              </div>
              {DAYS.map((day) => {
                const entry = gridMap[day]?.[rowIdx];
                const isSpanned = entries.some((e) => e.day === day && e.start < rowIdx && e.end > rowIdx);
                if (isSpanned) return <div key={day} className="border-r border-[#F4F5F8] last:border-r-0" />;
                if (!entry) return (
                  <div key={day} className="border-r border-[#F4F5F8] last:border-r-0 p-2 group cursor-pointer hover:bg-[#F9FAFC] transition-colors"
                    onClick={() => { setEditEntry(null); setShowEntry(true); }}>
                    <div className="h-full min-h-[52px] rounded-xl border-2 border-dashed border-transparent group-hover:border-[#DCE4F0] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A5A8B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    </div>
                  </div>
                );
                const colors = getSubjectColor(entry.subject);
                const spanRows = Math.max(1, entry.end - entry.start);
                return (
                  <div key={day} className="border-r border-[#F4F5F8] last:border-r-0 p-2" style={{ gridRow: `span ${spanRows}` }}>
                    <div className="h-full min-h-[52px] rounded-2xl p-3 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all hover:brightness-110 hover:shadow-md" style={{ backgroundColor: colors.bg }}>
                      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }} />
                      <div className="relative z-10">
                        <p className="text-[12px] font-[800] leading-tight" style={{ color: colors.text }}>{entry.subject}</p>
                        <p className="text-[10px] font-medium mt-1 opacity-75" style={{ color: colors.text }}>{entry.faculty}</p>
                      </div>
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-[10px] font-bold opacity-70" style={{ color: colors.text }}>{entry.room}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setEditEntry({ ...entry, id: entry.rawId || entry.id }); setShowEntry(true); }} className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(entry.rawId || entry.id); }} className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center hover:bg-red-400/50 transition-colors">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="h-12" />
      </div>

      {showOcr && <OcrModal onClose={() => setShowOcr(false)} onUploadSuccess={() => { if (filterValue) setFilterValue((v) => v); }} />}
      {showEntry && <EntryModal onClose={() => setShowEntry(false)} existing={editEntry} onSuccess={() => setFilterValue((v) => v)} classes={classes} faculties={faculties} rooms={rooms} subjects={subjects} />}
    </div>
  );
};

export default Timetable;
