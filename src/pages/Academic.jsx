import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import api from '../api/axios';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const Modal = ({ title, subtitle, onClose, onSubmit, children, submitLabel = 'Save', submitColor = '#232051' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#232051]/20 backdrop-blur-[4px] animate-in fade-in duration-200">
    <div className="bg-white rounded-[2rem] p-10 w-full max-w-[520px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] relative">
      <button onClick={onClose} className="absolute top-8 right-8 text-[#A5A8B6] hover:text-[#232051] transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <h4 className="text-[10px] font-[800] text-[#3658C9] uppercase tracking-widest mb-1">Academic Management</h4>
      <h3 className="text-[#232051] text-[24px] font-bold mb-1">{title}</h3>
      {subtitle && <p className="text-[#848795] text-[14px] font-medium mb-8">{subtitle}</p>}
      <div className="flex flex-col gap-5 mt-6">{children}</div>
      <div className="mt-6 flex gap-3">
        <button onClick={onClose} className="flex-1 h-[54px] rounded-2xl text-[14px] font-bold text-[#848795] hover:text-[#232051] transition-colors">Cancel</button>
        <button onClick={onSubmit} className="flex-1 h-[54px] text-white rounded-2xl text-[14px] font-bold transition-colors shadow-md" style={{ backgroundColor: submitColor }}>
          {submitLabel}
        </button>
      </div>
    </div>
  </div>
);

const FieldInput = ({ label, value, onChange, placeholder, type = 'text', required }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[15px] text-[#232051] font-bold outline-none border border-transparent focus:border-[#232051]/10 transition-all"
    />
  </div>
);

const FieldSelect = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[15px] text-[#232051] font-bold outline-none appearance-none cursor-pointer"
    >
      <option value="">Select {label}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const Academic = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data state per tab
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Form state
  const [form, setForm] = useState({});

  const tabs = [
    { id: 'departments', label: 'Departments', icon: '🏛️' },
    { id: 'semesters',   label: 'Semesters',   icon: '📅' },
    { id: 'classes',     label: 'Classes',     icon: '👥' },
    { id: 'subjects',    label: 'Subjects',    icon: '📚' },
  ];

  // ─── Fetch per tab ───────────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [deptRes, semRes, clsRes, subRes] = await Promise.all([
        api.get('/academic/departments'),
        api.get('/academic/semesters'),
        api.get('/academic/classes'),
        api.get('/academic/subjects'),
      ]);
      setDepartments(deptRes.data?.data || []);
      setSemesters(semRes.data?.data || []);
      setClasses(clsRes.data?.data || []);
      setSubjects(subRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch academic data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ─── Get current data for active tab ─────────────────────────────────────
  const getCurrentData = () => {
    switch (activeTab) {
      case 'departments': return departments;
      case 'semesters':   return semesters;
      case 'classes':     return classes;
      case 'subjects':    return subjects;
      default:            return [];
    }
  };

  // ─── Open modal with fresh form ───────────────────────────────────────────
  const handleOpenModal = () => {
    setForm({});
    setShowModal(true);
  };

  // ─── Submit per tab ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      switch (activeTab) {
        case 'departments':
          await api.post('/academic/departments', { name: form.name });
          break;
        case 'semesters':
          await api.post('/academic/semesters', {
            name: form.name,
            startDate: form.startDate,
            endDate: form.endDate,
          });
          break;
        case 'classes':
          await api.post('/academic/classes', {
            name: form.name,
            departmentId: form.departmentId,
          });
          break;
        case 'subjects':
          await api.post('/academic/subjects', {
            code: form.code,
            name: form.name,
            departmentId: form.departmentId,
            semesterId: form.semesterId,
          });
          break;
        default:
          break;
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error('Failed to create entity:', err);
      alert(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete per tab ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const entityName = activeTab.slice(0, -1);
    if (!window.confirm(`Are you sure you want to delete this ${entityName}? This cannot be undone.`)) return;
    try {
      if (activeTab === 'departments') await api.delete(`/academic/departments/${id}`);
      // Semesters/classes/subjects backend may not have delete — handle gracefully
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete. It may be referenced by other records.');
    }
  };

  // ─── Render modal content per tab ────────────────────────────────────────
  const renderModalContent = () => {
    const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));
    const semOptions  = semesters.map((s) => ({ value: s.id, label: s.name }));

    switch (activeTab) {
      case 'departments':
        return (
          <FieldInput label="Department Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Computer Science" required />
        );
      case 'semesters':
        return (
          <>
            <FieldInput label="Semester Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Fall 2025" required />
            <div className="grid grid-cols-2 gap-4">
              <FieldInput label="Start Date" type="date" value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
              <FieldInput label="End Date" type="date" value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </>
        );
      case 'classes':
        return (
          <>
            <FieldInput label="Class Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., CS-4A" required />
            <FieldSelect label="Department" value={form.departmentId || ''} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} options={deptOptions} />
          </>
        );
      case 'subjects':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FieldInput label="Subject Code" value={form.code || ''} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g., CS401" required />
              <FieldInput label="Subject Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Data Structures" required />
            </div>
            <FieldSelect label="Department" value={form.departmentId || ''} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} options={deptOptions} />
            <FieldSelect label="Semester" value={form.semesterId || ''} onChange={(e) => setForm({ ...form, semesterId: e.target.value })} options={semOptions} />
          </>
        );
      default:
        return null;
    }
  };

  // ─── Table metadata ───────────────────────────────────────────────────────
  const getMetadata = (item) => {
    switch (activeTab) {
      case 'classes':   return `Dept: ${item.department?.name || '—'}`;
      case 'subjects':  return `${item.department?.name || '—'} · ${item.semester?.name || '—'}`;
      case 'semesters': return `${new Date(item.startDate).getFullYear()} – ${new Date(item.endDate).getFullYear()} term`;
      default:          return 'Institutional Faculty';
    }
  };

  const data = getCurrentData();

  return (
    <div className="flex min-h-screen bg-[#EAEFF7] font-manrope selection:bg-[#232051] selection:text-white">
      <Sidebar />

      <div className="flex-1 p-10 md:p-14 h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h4 className="text-[11px] font-[800] text-[#3658C9] uppercase tracking-[0.15em] mb-1">Administrative Center</h4>
            <h2 className="text-[34px] font-[800] text-[#232051] tracking-tight leading-none">Academic Management</h2>
          </div>

          <div className="flex flex-col items-end gap-5">
            <span className="text-[#848795] text-[13px] font-semibold">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="flex items-center gap-4">
              <div className="bg-[#DCE4F0] h-[42px] px-5 rounded-full flex items-center justify-center">
                <span className="text-[11px] font-[800] text-[#232051] tracking-wider uppercase">
                  Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <NotificationBell />
              <button
                onClick={handleOpenModal}
                className="bg-[#232051] text-white px-6 h-[44px] rounded-full flex items-center gap-2 font-bold text-[13px] hover:bg-[#343568] transition-all shadow-md active:scale-95"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add {activeTab.slice(0, -1)}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-[1.5rem] font-bold text-[14px] transition-all flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'bg-white text-[#232051] shadow-sm ring-1 ring-[#232051]/5'
                  : 'text-[#848795] hover:text-[#232051] hover:bg-white/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              <span className={`text-[10px] font-[800] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[#EAEFF7] text-[#3658C9]' : 'bg-transparent text-[#A5A8B6]'}`}>
                {activeTab === tab.id && !loading ? data.length : ''}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-transparent hover:border-[#EAEFF7] transition-all duration-300">
          {loading ? (
            <div className="py-20 text-center text-[#848795] font-medium">Loading academic data...</div>
          ) : data.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-4xl mb-4">{tabs.find((t) => t.id === activeTab)?.icon}</div>
              <p className="text-[16px] font-bold text-[#232051] mb-1">No {activeTab} found</p>
              <p className="text-[13px] text-[#848795]">Click "Add {activeTab.slice(0, -1)}" to create the first one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-[1.5px] border-[#F4F5F8]">
                    <th className="pb-6 text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] px-4">Name</th>
                    {activeTab === 'subjects' && (
                      <th className="pb-6 text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] px-4">Code</th>
                    )}
                    <th className="pb-6 text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] px-4 text-center">ID</th>
                    <th className="pb-6 text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] px-4">Metadata</th>
                    <th className="pb-6 text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] px-4 text-right">Created</th>
                    <th className="pb-6 text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={item.id || idx} className="group hover:bg-[#F9FAFC] transition-colors border-b border-[#F4F5F8] last:border-b-0">
                      <td className="py-5 px-4">
                        <span className="text-[#232051] font-bold text-[15px]">{item.name}</span>
                      </td>
                      {activeTab === 'subjects' && (
                        <td className="py-5 px-4">
                          <span className="inline-block px-3 py-1 bg-[#EAEFF7] rounded-lg text-[11px] font-bold text-[#3658C9] uppercase">
                            {item.code || '—'}
                          </span>
                        </td>
                      )}
                      <td className="py-5 px-4 text-center">
                        <span className="inline-block px-3 py-1 bg-[#F4F5F8] rounded-lg text-[10px] font-bold text-[#848795] font-mono truncate max-w-[100px]" title={item.id}>
                          {item.id?.slice(0, 8)}…
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <span className="text-[#848795] text-[13px] font-medium italic">{getMetadata(item)}</span>
                      </td>
                      <td className="py-5 px-4 text-right">
                        <span className="text-[#A5A8B6] text-[12px] font-bold">
                          {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-right">
                        {activeTab === 'departments' && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#D9534F] hover:bg-[#D9534F]/10 border border-[#D9534F]/30"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          title={`Add ${activeTab.slice(0, -1)}`}
          subtitle={`Fill in the details to create a new ${activeTab.slice(0, -1)}.`}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          submitLabel={submitting ? 'Saving...' : 'Save'}
        >
          {renderModalContent()}
        </Modal>
      )}
    </div>
  );
};

export default Academic;
