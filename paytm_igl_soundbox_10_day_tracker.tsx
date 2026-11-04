import React, { useState, useEffect, useMemo } from 'react';
import {
  Volume2,
  Plus,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  MapPin,
  User,
  Cpu,
  Calendar,
  TrendingUp,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Signal,
  QrCode,
  Trash2,
  Edit3,
  RefreshCw,
  Sparkles,
  Store,
  Users
} from 'lucide-react';

// Helper to get YYYY-MM-DD relative to today
const getRelativeDateStr = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

// Format date nicely (e.g., "04 Nov")
const formatShortDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

// Add days to a YYYY-MM-DD string
const addDays = (dateStr, days) => {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

// Calculate which day (1 to 10+) a merchant is currently on relative to today
const getDaysSinceDeployment = (deployDateStr) => {
  const today = new Date(getRelativeDateStr(0) + 'T00:00:00');
  const deploy = new Date(deployDateStr + 'T00:00:00');
  const diffTime = today - deploy;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
};

const INITIAL_MERCHANTS = [
  {
    id: 'm-101',
    shopName: 'Sri Sai Ram Kirana & General Stores',
    ownerName: 'Ramesh Babu',
    mobile: '9848012345',
    serialNumber: 'PTM-SB4G-884920',
    model: 'Soundbox 3.0 (4G)',
    area: 'Suryaraopeta Main Rd',
    fseName: 'Karthik V',
    deployDate: getRelativeDateStr(-6), // Currently on Day 7
    hardwareChecks: {
      speakerOk: true,
      simSignalOk: true,
      qrPlaced: true
    },
    days: {
      1: { status: 'active', txnCount: 18, amount: 2450, note: 'Installed & tested ₹1 QR' },
      2: { status: 'active', txnCount: 24, amount: 3120, note: 'Loud & clear broadcast' },
      3: { status: 'active', txnCount: 31, amount: 4890, note: '' },
      4: { status: 'active', txnCount: 22, amount: 2900, note: '' },
      5: { status: 'active', txnCount: 29, amount: 4100, note: '' },
      6: { status: 'active', txnCount: 35, amount: 5300, note: '' },
      7: { status: 'active', txnCount: 14, amount: 1850, note: 'Morning check done' }
    }
  },
  {
    id: 'm-102',
    shopName: 'Annapurna Tiffin & Coffee Center',
    ownerName: 'Srinivas Rao',
    mobile: '9440198765',
    serialNumber: 'PTM-SB4G-773104',
    model: 'Soundbox 3.0 (4G)',
    area: 'MG Road Beat 2',
    fseName: 'Naveen Kumar',
    deployDate: getRelativeDateStr(-4), // Currently on Day 5 (At Risk!)
    hardwareChecks: {
      speakerOk: true,
      simSignalOk: false,
      qrPlaced: true
    },
    days: {
      1: { status: 'active', txnCount: 42, amount: 1890, note: 'Good morning rush' },
      2: { status: 'active', txnCount: 38, amount: 1720, note: '' },
      3: { status: 'inactive', txnCount: 0, amount: 0, note: 'Box switched off due to low charge' },
      4: { status: 'inactive', txnCount: 0, amount: 0, note: 'Customer used another QR' },
      5: { status: 'pending', txnCount: 0, amount: 0, note: '' }
    }
  },
  {
    id: 'm-103',
    shopName: 'LakshmiGanapathi Medical & Fancy',
    ownerName: 'Venkateswara Rao',
    mobile: '9989054321',
    serialNumber: 'PTM-CSB-992011',
    model: 'Card Soundbox (NFC/Tap)',
    area: 'Gandhi Nagar',
    fseName: 'Karthik V',
    deployDate: getRelativeDateStr(-9), // Currently on Day 10 (Completed!)
    hardwareChecks: {
      speakerOk: true,
      simSignalOk: true,
      qrPlaced: true
    },
    days: {
      1: { status: 'active', txnCount: 15, amount: 4200, note: 'First day active' },
      2: { status: 'active', txnCount: 19, amount: 5600, note: '' },
      3: { status: 'active', txnCount: 22, amount: 6100, note: '' },
      4: { status: 'active', txnCount: 18, amount: 4950, note: '' },
      5: { status: 'active', txnCount: 25, amount: 7300, note: '' },
      6: { status: 'active', txnCount: 21, amount: 5800, note: '' },
      7: { status: 'active', txnCount: 14, amount: 3900, note: 'Sunday half day' },
      8: { status: 'active', txnCount: 27, amount: 8100, note: '' },
      9: { status: 'active', txnCount: 23, amount: 6450, note: '' },
      10: { status: 'active', txnCount: 20, amount: 5900, note: '10-Day target achieved!' }
    }
  },
  {
    id: 'm-104',
    shopName: 'Royal Bakers & Cool Drinks',
    ownerName: 'Mohammed Irfan',
    mobile: '9000112233',
    serialNumber: 'PTM-PSB-551928',
    model: 'Pocket Soundbox',
    area: 'Bus Stand Complex',
    fseName: 'Suresh P',
    deployDate: getRelativeDateStr(-2), // Currently on Day 3
    hardwareChecks: {
      speakerOk: true,
      simSignalOk: true,
      qrPlaced: false
    },
    days: {
      1: { status: 'active', txnCount: 28, amount: 3400, note: 'Setup completed' },
      2: { status: 'inactive', txnCount: 0, amount: 0, note: 'Counter staff kept device inside drawer' },
      3: { status: 'pending', txnCount: 0, amount: 0, note: '' }
    }
  },
  {
    id: 'm-105',
    shopName: 'Balaji Hair Salon & Mens Parlour',
    ownerName: 'Ravi Teja',
    mobile: '9701234567',
    serialNumber: 'PTM-SB4G-330192',
    model: 'Soundbox 3.0 (4G)',
    area: 'Suryaraopeta Main Rd',
    fseName: 'Naveen Kumar',
    deployDate: getRelativeDateStr(0), // Deployed Today (Day 1)
    hardwareChecks: {
      speakerOk: true,
      simSignalOk: true,
      qrPlaced: true
    },
    days: {
      1: { status: 'active', txnCount: 6, amount: 750, note: 'Deployed today morning, 6 broadcasts done' }
    }
  }
];

const SOUNDBOX_MODELS = [
  'Soundbox 3.0 (4G)',
  'Card Soundbox (NFC/Tap)',
  'Soundbox 4.7 (4G)',
  'Soundbox_Pebble (4G)',
  'Soundbox 5.0 (4G)',
  'Music Soundbox (Bluetooth)'
];

export default function App() {
  const [merchants, setMerchants] = useState(() => {
    try {
      const saved = localStorage.getItem('paytm_igl_soundbox_tracker_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
    }
    return INITIAL_MERCHANTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, NEEDS_FOLLOWUP, ON_TRACK, COMPLETED
  const [fseFilter, setFseFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDayCell, setSelectedDayCell] = useState(null); // { merchantId, dayNum }
  const [toastMessage, setToastMessage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // New Merchant Form State
  const [newMerchant, setNewMerchant] = useState({
    shopName: '',
    ownerName: '',
    mobile: '',
    serialNumber: '',
    model: 'Soundbox 3.0 (4G)',
    area: '',
    fseName: '',
    deployDate: getRelativeDateStr(0),
    firstDayActive: true,
    firstDayTxns: '5',
    firstDayAmount: '500'
  });

  // Day Edit Modal State
  const [dayEditForm, setDayEditForm] = useState({
    status: 'active',
    txnCount: '',
    amount: '',
    note: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem('paytm_igl_soundbox_tracker_v1', JSON.stringify(merchants));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [merchants]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Compute rich status & analytics for each merchant
  const enrichedMerchants = useMemo(() => {
    return merchants.map((m) => {
      const currentDayNum = getDaysSinceDeployment(m.deployDate);
      const cappedCurrentDay = Math.min(10, Math.max(1, currentDayNum));

      let activeDaysCount = 0;
      let inactiveDaysCount = 0;
      let totalTxns = 0;
      let totalAmount = 0;

      for (let d = 1; d <= 10; d++) {
        const dayEntry = m.days[d];
        if (dayEntry?.status === 'active') {
          activeDaysCount++;
          totalTxns += Number(dayEntry.txnCount || 0);
          totalAmount += Number(dayEntry.amount || 0);
        } else if (dayEntry?.status === 'inactive') {
          inactiveDaysCount++;
        }
      }

      // Check if today (if within 1..10) is logged active
      const isTodayInWindow = currentDayNum >= 1 && currentDayNum <= 10;
      const todayStatus = isTodayInWindow ? (m.days[currentDayNum]?.status || 'pending') : 'completed_window';
      const isActiveToday = todayStatus === 'active';

      // Determine overall category:
      // 1. COMPLETED: Day >= 10 and at least 7 active days (or all 10 logged & >=7 active)
      // 2. NEEDS_FOLLOWUP: Any inactive day in the last 2 elapsed days, OR today is pending/inactive after Day 2 with recent inactive, OR hardware issue
      // 3. ON_TRACK: Otherwise
      const prevDayStatus = currentDayNum > 1 ? (m.days[Math.min(10, currentDayNum - 1)]?.status || 'pending') : null;
      const hasHardwareIssue = !m.hardwareChecks?.speakerOk || !m.hardwareChecks?.simSignalOk || !m.hardwareChecks?.qrPlaced;

      let category = 'ON_TRACK';
      if (currentDayNum >= 10 && activeDaysCount >= 8) {
        category = 'COMPLETED';
      } else if (
        todayStatus === 'inactive' ||
        prevDayStatus === 'inactive' ||
        inactiveDaysCount >= 2 ||
        hasHardwareIssue
      ) {
        category = 'NEEDS_FOLLOWUP';
      }

      return {
        ...m,
        currentDayNum,
        cappedCurrentDay,
        activeDaysCount,
        inactiveDaysCount,
        totalTxns,
        totalAmount,
        isActiveToday,
        todayStatus,
        hasHardwareIssue,
        category
      };
    });
  }, [merchants]);

  // Unique FSE list for filtering
  const fseList = useMemo(() => {
    const names = new Set();
    merchants.forEach((m) => {
      if (m.fseName && m.fseName.trim()) names.add(m.fseName.trim());
    });
    return Array.from(names);
  }, [merchants]);

  // Dashboard KPI Summary
  const kpiStats = useMemo(() => {
    const totalDeployed = enrichedMerchants.length;
    const activeToday = enrichedMerchants.filter((m) => m.isActiveToday).length;
    const needsFollowup = enrichedMerchants.filter((m) => m.category === 'NEEDS_FOLLOWUP').length;
    const completed10Days = enrichedMerchants.filter((m) => m.category === 'COMPLETED').length;
    const totalBroadcasts = enrichedMerchants.reduce((acc, m) => acc + m.totalTxns, 0);

    return {
      totalDeployed,
      activeToday,
      needsFollowup,
      completed10Days,
      totalBroadcasts
    };
  }, [enrichedMerchants]);

  // Filtered merchants list
  const filteredMerchants = useMemo(() => {
    return enrichedMerchants.filter((m) => {
      if (statusFilter !== 'ALL' && m.category !== statusFilter) return false;
      if (fseFilter !== 'ALL' && m.fseName !== fseFilter) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchShop = m.shopName.toLowerCase().includes(q);
        const matchOwner = m.ownerName.toLowerCase().includes(q);
        const matchPhone = m.mobile.toLowerCase().includes(q);
        const matchSerial = m.serialNumber.toLowerCase().includes(q);
        const matchArea = m.area.toLowerCase().includes(q);
        const matchFse = (m.fseName || '').toLowerCase().includes(q);
        return matchShop || matchOwner || matchPhone || matchSerial || matchArea || matchFse;
      }
      return true;
    });
  }, [enrichedMerchants, statusFilter, fseFilter, searchQuery]);

  // Open Day Cell Modal
  const handleOpenDayModal = (merchant, dayNum) => {
    const existing = merchant.days[dayNum] || {
      status: dayNum <= merchant.currentDayNum ? 'active' : 'pending',
      txnCount: '',
      amount: '',
      note: ''
    };
    setSelectedDayCell({ merchantId: merchant.id, dayNum });
    setDayEditForm({
      status: existing.status || 'active',
      txnCount: existing.txnCount !== undefined ? String(existing.txnCount) : '',
      amount: existing.amount !== undefined ? String(existing.amount) : '',
      note: existing.note || ''
    });
  };

  // Quick One-Click Mark Active for Today
  const handleQuickMarkTodayActive = (merchantId) => {
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id !== merchantId) return m;
        const curDay = Math.min(10, Math.max(1, getDaysSinceDeployment(m.deployDate)));
        const existingDay = m.days[curDay] || {};
        return {
          ...m,
          days: {
            ...m.days,
            [curDay]: {
              status: 'active',
              txnCount: existingDay.txnCount || 15,
              amount: existingDay.amount || 1800,
              note: existingDay.note || 'Broadcast verified today'
            }
          }
        };
      })
    );
    showToast(`Day broadcast marked ACTIVE!`);
  };

  // Save Day Log from Modal
  const handleSaveDayModal = (e) => {
    e.preventDefault();
    if (!selectedDayCell) return;

    const { merchantId, dayNum } = selectedDayCell;
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id !== merchantId) return m;
        return {
          ...m,
          days: {
            ...m.days,
            [dayNum]: {
              status: dayEditForm.status,
              txnCount: dayEditForm.status === 'active' ? Number(dayEditForm.txnCount || 0) : 0,
              amount: dayEditForm.status === 'active' ? Number(dayEditForm.amount || 0) : 0,
              note: dayEditForm.note.trim()
            }
          }
        };
      })
    );
    setSelectedDayCell(null);
    showToast(`Updated D${dayNum} broadcast log`);
  };

  // Toggle Hardware Check
  const handleToggleHardware = (merchantId, checkKey) => {
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id !== merchantId) return m;
        return {
          ...m,
          hardwareChecks: {
            ...m.hardwareChecks,
            [checkKey]: !m.hardwareChecks[checkKey]
          }
        };
      })
    );
  };

  // Add New Merchant Deployment
  const handleAddMerchant = (e) => {
    e.preventDefault();
    if (!newMerchant.shopName.trim() || !newMerchant.mobile.trim()) return;

    const initialDays = {};
    if (newMerchant.firstDayActive) {
      initialDays[1] = {
        status: 'active',
        txnCount: Number(newMerchant.firstDayTxns || 5),
        amount: Number(newMerchant.firstDayAmount || 500),
        note: 'Installation test broadcast verified'
      };
    } else {
      initialDays[1] = {
        status: 'pending',
        txnCount: 0,
        amount: 0,
        note: ''
      };
    }

    const created = {
      id: 'm-' + Date.now(),
      shopName: newMerchant.shopName.trim(),
      ownerName: newMerchant.ownerName.trim() || 'Merchant Owner',
      mobile: newMerchant.mobile.replace(/\D/g, '').slice(-10),
      serialNumber: newMerchant.serialNumber.trim() || `PTM-SB4G-${Math.floor(100000 + Math.random() * 900000)}`,
      model: newMerchant.model,
      area: newMerchant.area.trim() || 'General Beat',
      fseName: newMerchant.fseName.trim() || 'Self (IGL)',
      deployDate: newMerchant.deployDate || getRelativeDateStr(0),
      hardwareChecks: {
        speakerOk: true,
        simSignalOk: true,
        qrPlaced: true
      },
      days: initialDays
    };

    setMerchants((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewMerchant({
      shopName: '',
      ownerName: '',
      mobile: '',
      serialNumber: '',
      model: 'Soundbox 3.0 (4G)',
      area: '',
      fseName: '',
      deployDate: getRelativeDateStr(0),
      firstDayActive: true,
      firstDayTxns: '5',
      firstDayAmount: '500'
    });
    showToast(`Added ${created.shopName} to 10-Day Tracker!`);
  };

  // Delete Merchant
  const handleDeleteMerchant = (id) => {
    setMerchants((prev) => prev.filter((m) => m.id !== id));
    setDeleteConfirmId(null);
    showToast('Merchant deployment removed.');
  };

  // Reset Sample Data
  const handleResetDemoData = () => {
    setMerchants(INITIAL_MERCHANTS);
    showToast('Sample merchant data restored.');
  };

  // Export CSV for IGL Daily Reporting
  const handleExportCSV = () => {
    const headers = [
      'Shop Name',
      'Owner Name',
      'Mobile',
      'Soundbox Serial',
      'Model',
      'Area/Beat',
      'FSE Name',
      'Deployment Date',
      'Current Day',
      'Active Days (of 10)',
      'Total Broadcast Txns',
      'Total Broadcast Value (INR)',
      'Status Category',
      'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'
    ];

    const rows = enrichedMerchants.map((m) => {
      const dayCols = [];
      for (let d = 1; d <= 10; d++) {
        const st = m.days[d]?.status || 'pending';
        const tx = m.days[d]?.txnCount || 0;
        dayCols.push(st === 'active' ? `OK(${tx})` : st === 'inactive' ? 'ZERO' : '-');
      }
      return [
        `"${m.shopName.replace(/"/g, '""')}"`,
        `"${m.ownerName.replace(/"/g, '""')}"`,
        m.mobile,
        m.serialNumber,
        `"${m.model}"`,
        `"${m.area}"`,
        `"${m.fseName}"`,
        m.deployDate,
        `D${m.cappedCurrentDay}`,
        m.activeDaysCount,
        m.totalTxns,
        m.totalAmount,
        m.category,
        ...dayCols
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Paytm_IGL_Soundbox_D1_D10_Report_${getRelativeDateStr(0)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded CSV Report!');
  };

  // Build WhatsApp URL with contextual message
  const getWhatsAppUrl = (merchant) => {
    const cleanPhone = merchant.mobile.replace(/\D/g, '');
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const isAtRisk = merchant.category === 'NEEDS_FOLLOWUP';
    const message = isAtRisk
      ? `Namaste ${merchant.ownerName} garu (${merchant.shopName}), I am calling from Paytm Soundbox Team. We noticed low payment broadcast activity on your new Paytm ${merchant.model} (${merchant.serialNumber}) on Day ${merchant.cappedCurrentDay}. Please keep the Soundbox charged & turned ON for instant voice confirmation. Let me know if you need any support!`
      : `Namaste ${merchant.ownerName} garu (${merchant.shopName}), greetings from Paytm Team! Checking in on your new Paytm ${merchant.model} (Day ${merchant.cappedCurrentDay}/10 onboarding check). Hope the voice broadcast is loud and clear!`;

    return `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`;
  };

  const selectedMerchantObj = useMemo(() => {
    if (!selectedDayCell) return null;
    return enrichedMerchants.find((m) => m.id === selectedDayCell.merchantId) || null;
  }, [selectedDayCell, enrichedMerchants]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {/* Top Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#002970] text-white px-4 py-3 rounded-xl shadow-xl border border-[#00BAF2]/40 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#00BAF2]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Paytm-styled Header */}
      <header className="bg-gradient-to-r from-[#002970] via-[#00338d] to-[#002970] text-white sticky top-0 z-30 shadow-md border-b-4 border-[#00BAF2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-inner shrink-0">
              <div className="relative flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-[#002970]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00BAF2] rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00BAF2] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg sm:text-xl text-white">
                  Paytm <span className="text-[#00BAF2]">Soundbox</span>
                </span>
                <span className="bg-[#00BAF2]/20 text-[#00BAF2] border border-[#00BAF2]/40 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  IGL Portal
                </span>
              </div>
              <p className="text-xs text-blue-100/80">
                First 10-Day (D1–D10) Deployment & Broadcast Activation Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition border border-white/15"
              title="Export 10-Day Activation Report to CSV"
            >
              <Download className="w-4 h-4 text-[#00BAF2]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#00a6d9] text-[#002970] font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Soundbox Deploy</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* 1. KPI Summary Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            onClick={() => setStatusFilter('ALL')}
            className={`bg-white rounded-2xl p-4 border transition cursor-pointer shadow-sm ${
              statusFilter === 'ALL'
                ? 'border-[#002970] ring-2 ring-[#002970]/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Deployed
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#002970] flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#002970]">
                {kpiStats.totalDeployed}
              </span>
              <span className="text-xs text-slate-500 font-medium">in 10-Day window</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>{kpiStats.totalBroadcasts} total broadcasts logged</span>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('ON_TRACK')}
            className={`bg-white rounded-2xl p-4 border transition cursor-pointer shadow-sm ${
              statusFilter === 'ON_TRACK'
                ? 'border-emerald-600 ring-2 ring-emerald-600/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Today
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {kpiStats.activeToday}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / {kpiStats.totalDeployed} broadcasting
              </span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Voice broadcast verified today</span>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('NEEDS_FOLLOWUP')}
            className={`bg-white rounded-2xl p-4 border transition cursor-pointer shadow-sm ${
              statusFilter === 'NEEDS_FOLLOWUP'
                ? 'border-red-600 ring-2 ring-red-600/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                At-Risk / Follow-up
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-red-600">
                {kpiStats.needsFollowup}
              </span>
              <span className="text-xs text-slate-500 font-medium">zero broadcast / issue</span>
            </div>
            <div className="mt-2 text-[11px] text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Needs urgent FSE/IGL visit or call</span>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('COMPLETED')}
            className={`bg-white rounded-2xl p-4 border transition cursor-pointer shadow-sm ${
              statusFilter === 'COMPLETED'
                ? 'border-[#00BAF2] ring-2 ring-[#00BAF2]/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                D10 Qualified
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#008bb5] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#008bb5]">
                {kpiStats.completed10Days}
              </span>
              <span className="text-xs text-slate-500 font-medium">payout eligible</span>
            </div>
            <div className="mt-2 text-[11px] text-[#008bb5] font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Completed 10-Day active window</span>
            </div>
          </div>
        </section>

        {/* 2. Search, Filters & Legend Bar */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Shop Name, Mobile, Serial No, Area Beat, or FSE..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: 'All Merchants', count: enrichedMerchants.length },
                {
                  id: 'NEEDS_FOLLOWUP',
                  label: 'Needs Follow-up',
                  count: kpiStats.needsFollowup
                },
                {
                  id: 'ON_TRACK',
                  label: 'On Track',
                  count: enrichedMerchants.filter((m) => m.category === 'ON_TRACK').length
                },
                { id: 'COMPLETED', label: 'D10 Completed', count: kpiStats.completed10Days }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-[#002970] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      statusFilter === tab.id
                        ? 'bg-[#00BAF2] text-[#002970] font-bold'
                        : 'bg-white text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}

              {/* FSE Dropdown Filter */}
              {fseList.length > 0 && (
                <select
                  value={fseFilter}
                  onChange={(e) => setFseFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
                >
                  <option value="ALL">All FSEs ({fseList.length})</option>
                  {fseList.map((fse) => (
                    <option key={fse} value={fse}>
                      FSE: {fse}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-slate-700">10-Day Matrix Guide (Tap any D1–D10 box to update):</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                <span>Broadcast Verified (Active)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-500 inline-block" />
                <span>0 Broadcast (Inactive Alert)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border-2 border-[#00BAF2] bg-blue-50 inline-block" />
                <span>Current Day Today</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
                <span>Pending / Upcoming Day</span>
              </span>
            </div>

            <button
              onClick={handleResetDemoData}
              className="text-[11px] text-slate-400 hover:text-[#002970] flex items-center gap-1 ml-auto"
              title="Reset sample data"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </section>

        {/* 3. Merchant 10-Day Tracker Cards */}
        <section className="space-y-4">
          {filteredMerchants.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#002970] flex items-center justify-center mx-auto mb-3">
                <Volume2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Soundbox deployments match your filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Try clearing your search query or switching the status filter tab, or deploy a new Paytm Soundbox.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setStatusFilter('ALL');
                    setFseFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Show All Merchants
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#002970] hover:bg-[#00338d] text-white flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Merchant</span>
                </button>
              </div>
            </div>
          ) : (
            filteredMerchants.map((merchant) => {
              const isAtRisk = merchant.category === 'NEEDS_FOLLOWUP';
              const isCompleted = merchant.category === 'COMPLETED';

              return (
                <div
                  key={merchant.id}
                  className={`bg-white rounded-2xl border transition shadow-sm overflow-hidden ${
                    isAtRisk
                      ? 'border-red-300 ring-1 ring-red-100'
                      : isCompleted
                      ? 'border-cyan-300'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Card Top Bar */}
                  <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Badge */}
                        {isAtRisk && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            Follow-up Needed
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 text-[#002970] border border-cyan-300">
                            <Award className="w-3 h-3 text-[#008bb5]" />
                            10-Day Qualified
                          </span>
                        )}
                        {!isAtRisk && !isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            On Track (Day {merchant.cappedCurrentDay}/10)
                          </span>
                        )}

                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#002970] border border-blue-100">
                          {merchant.model}
                        </span>

                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          SN: {merchant.serialNumber}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <span>{merchant.shopName}</span>
                      </h2>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <strong className="font-medium text-slate-800">{merchant.ownerName}</strong> ({merchant.mobile})
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{merchant.area}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deployed: {formatShortDate(merchant.deployDate)}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>FSE: <strong className="text-slate-700">{merchant.fseName}</strong></span>
                        </span>
                      </div>
                    </div>

                    {/* Right Side Quick Stats & Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      {/* 10-Day Broadcast Stats */}
                      <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Active Days</div>
                          <div className="text-sm font-extrabold text-[#002970]">
                            {merchant.activeDaysCount} <span className="text-xs font-normal text-slate-500">/ 10</span>
                          </div>
                        </div>
                        <div className="h-6 w-px bg-slate-200" />
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Broadcasts</div>
                          <div className="text-sm font-extrabold text-emerald-600">
                            {merchant.totalTxns} <span className="text-[11px] font-normal text-slate-500">txns</span>
                          </div>
                        </div>
                        <div className="h-6 w-px bg-slate-200" />
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Volume</div>
                          <div className="text-sm font-extrabold text-slate-800">
                            ₹{merchant.totalAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {/* Quick Call / WhatsApp / Today Check-in */}
                      <div className="flex items-center gap-2">
                        {!merchant.isActiveToday && merchant.currentDayNum <= 10 && (
                          <button
                            onClick={() => handleQuickMarkTodayActive(merchant.id)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                            title={`Mark Today (D${merchant.cappedCurrentDay}) Broadcast Active`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Verify D{merchant.cappedCurrentDay}</span>
                          </button>
                        )}

                        <a
                          href={`tel:${merchant.mobile}`}
                          className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#002970] transition border border-blue-200"
                          title={`Call ${merchant.ownerName} (${merchant.mobile})`}
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <a
                          href={getWhatsAppUrl(merchant)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs flex items-center gap-1.5 transition border border-emerald-200"
                          title="Send WhatsApp Follow-up Message"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>

                        {deleteConfirmId === merchant.id ? (
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-1 rounded-xl">
                            <button
                              onClick={() => handleDeleteMerchant(merchant.id)}
                              className="text-[11px] font-bold text-red-600 hover:underline px-1"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-[11px] text-slate-500 px-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(merchant.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete Merchant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 10-Day Broadcast Matrix Grid (D1 to D10) */}
                  <div className="p-4 sm:p-5 bg-slate-50/60">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-[#00BAF2]" />
                        10-Day Payment Broadcast Matrix (Click any day to log txns or issues)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Current Stage: <strong className="text-[#002970]">Day {merchant.cappedCurrentDay} of 10</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {Array.from({ length: 10 }, (_, idx) => {
                        const dayNum = idx + 1;
                        const dayDateStr = addDays(merchant.deployDate, idx);
                        const dayEntry = merchant.days[dayNum];
                        const status = dayEntry?.status || 'pending';
                        const isToday = dayNum === merchant.currentDayNum;
                        const isPastUnlogged = dayNum < merchant.currentDayNum && status === 'pending';

                        let cellStyle =
                          'bg-white border-slate-200 text-slate-500 hover:border-slate-300';
                        if (status === 'active') {
                          cellStyle =
                            'bg-emerald-500/10 border-emerald-500 text-emerald-900 hover:bg-emerald-500/20';
                        } else if (status === 'inactive') {
                          cellStyle =
                            'bg-red-500/10 border-red-500 text-red-900 hover:bg-red-500/20';
                        } else if (isPastUnlogged) {
                          cellStyle =
                            'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100';
                        }

                        return (
                          <button
                            key={dayNum}
                            type="button"
                            onClick={() => handleOpenDayModal(merchant, dayNum)}
                            className={`relative rounded-xl p-2 border text-left transition flex flex-col justify-between min-h-[76px] cursor-pointer ${cellStyle} ${
                              isToday ? 'ring-2 ring-[#00BAF2] ring-offset-1' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs font-extrabold">D{dayNum}</span>
                              {isToday && (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 bg-[#00BAF2] text-[#002970] rounded-full">
                                  Today
                                </span>
                              )}
                            </div>

                            <div className="my-1 flex items-center justify-center">
                              {status === 'active' ? (
                                <div className="flex flex-col items-center">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                  <span className="text-[10px] font-bold text-emerald-700 mt-0.5">
                                    {dayEntry?.txnCount ? `${dayEntry.txnCount} txns` : 'Active'}
                                  </span>
                                </div>
                              ) : status === 'inactive' ? (
                                <div className="flex flex-col items-center">
                                  <AlertTriangle className="w-5 h-5 text-red-600" />
                                  <span className="text-[10px] font-bold text-red-700 mt-0.5">
                                    0 Broadcast
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <span className="text-[10px] text-slate-400 mt-0.5">
                                    {isPastUnlogged ? 'Unlogged' : 'Pending'}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="text-[10px] text-slate-400 text-center w-full truncate">
                              {formatShortDate(dayDateStr)}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Bottom Hardware & Placement Audit Strip */}
                    <div className="mt-3 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500 mr-1">
                          Device Health Check:
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleHardware(merchant.id, 'speakerOk')}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            merchant.hardwareChecks?.speakerOk
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-red-50 border-red-300 text-red-700 font-bold'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Speaker: {merchant.hardwareChecks?.speakerOk ? 'Loud OK' : 'Muted/Low'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleHardware(merchant.id, 'simSignalOk')}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            merchant.hardwareChecks?.simSignalOk
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-red-50 border-red-300 text-red-700 font-bold'
                          }`}
                        >
                          <Signal className="w-3.5 h-3.5" />
                          <span>4G SIM: {merchant.hardwareChecks?.simSignalOk ? 'Strong' : 'Weak/No Net'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleHardware(merchant.id, 'qrPlaced')}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            merchant.hardwareChecks?.qrPlaced
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                          }`}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Front QR: {merchant.hardwareChecks?.qrPlaced ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </div>

                      {/* Latest Day Note Preview */}
                      {merchant.days[merchant.cappedCurrentDay]?.note && (
                        <div className="text-xs text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                          <Edit3 className="w-3 h-3 text-[#00BAF2]" />
                          <span>
                            <strong>D{merchant.cappedCurrentDay} Note:</strong>{' '}
                            {merchant.days[merchant.cappedCurrentDay].note}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      {/* Modal 1: Update Day (D1-D10) Broadcast Status */}
      {selectedDayCell && selectedMerchantObj && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#002970]">
                  Day {selectedDayCell.dayNum} of 10 •{' '}
                  {formatShortDate(addDays(selectedMerchantObj.deployDate, selectedDayCell.dayNum - 1))}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedMerchantObj.shopName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedMerchantObj.model} ({selectedMerchantObj.serialNumber})
                </p>
              </div>
              <button
                onClick={() => setSelectedDayCell(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDayModal} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Broadcast Status on Day {selectedDayCell.dayNum}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDayEditForm({ ...dayEditForm, status: 'active' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      dayEditForm.status === 'active'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active Broadcast</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDayEditForm({ ...dayEditForm, status: 'inactive' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      dayEditForm.status === 'inactive'
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>0 Broadcast</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDayEditForm({ ...dayEditForm, status: 'pending' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      dayEditForm.status === 'pending'
                        ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Pending</span>
                  </button>
                </div>
              </div>

              {dayEditForm.status === 'active' && (
                <div className="grid grid-cols-2 gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Broadcast Txn Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 25"
                      value={dayEditForm.txnCount}
                      onChange={(e) => setDayEditForm({ ...dayEditForm, txnCount: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Approx Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 3200"
                      value={dayEditForm.amount}
                      onChange={(e) => setDayEditForm({ ...dayEditForm, amount: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Field Remark / Issue Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder={
                    dayEditForm.status === 'inactive'
                      ? 'e.g., Box battery discharged / Competitor QR on desk'
                      : 'e.g., Verified loud broadcast at shop'
                  }
                  value={dayEditForm.note}
                  onChange={(e) => setDayEditForm({ ...dayEditForm, note: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedDayCell(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#002970] hover:bg-[#00338d] text-white shadow-sm cursor-pointer"
                >
                  Save Day {selectedDayCell.dayNum} Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add New Merchant Soundbox Deployment */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#002970] text-[#00BAF2] flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    New Soundbox Deployment
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enroll merchant into 10-Day (D1–D10) broadcast tracking
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMerchant} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Merchant / Shop Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sri Venkateswara Kirana & General"
                    value={newMerchant.shopName}
                    onChange={(e) => setNewMerchant({ ...newMerchant, shopName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Narayana Rao"
                    value={newMerchant.ownerName}
                    onChange={(e) => setNewMerchant({ ...newMerchant, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Merchant Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={newMerchant.mobile}
                    onChange={(e) => setNewMerchant({ ...newMerchant, mobile: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Soundbox Model
                  </label>
                  <select
                    value={newMerchant.model}
                    onChange={(e) => setNewMerchant({ ...newMerchant, model: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white"
                  >
                    {SOUNDBOX_MODELS.map((mdl) => (
                      <option key={mdl} value={mdl}>
                        {mdl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Device Serial / DSN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., PTM-SB4G-902311"
                    value={newMerchant.serialNumber}
                    onChange={(e) =>
                      setNewMerchant({ ...newMerchant, serialNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Market Area / Beat Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Suryaraopeta Main Rd"
                    value={newMerchant.area}
                    onChange={(e) => setNewMerchant({ ...newMerchant, area: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deployed By (FSE Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Karthik V / Self"
                    value={newMerchant.fseName}
                    onChange={(e) => setNewMerchant({ ...newMerchant, fseName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deployment Date (Day 1 Start)
                  </label>
                  <input
                    type="date"
                    value={newMerchant.deployDate}
                    max={getRelativeDateStr(0)}
                    onChange={(e) => setNewMerchant({ ...newMerchant, deployDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white"
                  />
                </div>
              </div>

              {/* Day 1 Test Broadcast Verification Box */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMerchant.firstDayActive}
                    onChange={(e) =>
                      setNewMerchant({ ...newMerchant, firstDayActive: e.target.checked })
                    }
                    className="rounded text-[#002970] focus:ring-[#00BAF2] w-4 h-4"
                  />
                  <span className="text-xs font-bold text-[#002970]">
                    Day 1 Installation Test Broadcast Verified at Shop
                  </span>
                </label>

                {newMerchant.firstDayActive && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        D1 Initial Txns
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newMerchant.firstDayTxns}
                        onChange={(e) =>
                          setNewMerchant({ ...newMerchant, firstDayTxns: e.target.value })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        D1 Initial Amount (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newMerchant.firstDayAmount}
                        onChange={(e) =>
                          setNewMerchant({ ...newMerchant, firstDayAmount: e.target.value })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#00BAF2] hover:bg-[#00a6d9] text-[#002970] shadow-sm cursor-pointer"
                >
                  Save & Start 10-Day Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}