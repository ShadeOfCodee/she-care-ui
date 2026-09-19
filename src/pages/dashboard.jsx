import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./dashboard.module.css";
import { getDashboardSummary } from "../services/dashboardService";
import ProfileIcon from "../components/ProfileIcon";
import ProfileSidebar from "../components/ProfileSidebar";

const moodOptions = ["Great", "Good", "Okay", "Low", "Stressed"];
const sleepQualityLabels = ["Poor", "Average", "Good", "Excellent"];
const activityLabels = ["Walking", "Yoga", "Gym", "Running", "Stretching", "Other"];
const symptomLabels = ["Headache", "Fatigue", "Cramps", "Bloating", "Back pain", "Acne", "None"];
const flowLevelLabels = ["Light", "Medium", "Heavy"];

const quickActions = [
  { id: "cycle", title: "Cycle", subtitle: "Track cycle details", path: "/cycle", icon: "CY" },
  { id: "symptoms", title: "Symptoms", subtitle: "Log body signals", path: "/symptoms", icon: "SY" },
  { id: "diet", title: "Diet", subtitle: "See meal guidance", path: "/diet-plan", icon: "DI" },
  { id: "yoga", title: "Yoga", subtitle: "Start a routine", path: "/yoga", icon: "YO" }
];

const navItems = [
  { label: "Home", path: "/dashboard", icon: "HM" },
  { label: "Cycle", path: "/cycle", icon: "CY" },
  { label: "Journal", path: "/symptoms", icon: "JR" },
  { label: "Profile", path: "/profile-setup", icon: "PR" }
];

const fallbackSummary = {
  userName: "SheCare Member",
  // moodLabel: "Great",
  cycle: {
    nextPeriodInDays: 15,
    cycleDay: 12
  },
  hydration: {
    current: 1.5,
    goal: 2.0
  },
  pinned: [
    { id: "sleep", label: "Sleep", value: "7h 20m", note: "Last night" },
    { id: "steps", label: "Activity", value: "6,420", note: "Steps" },
    { id: "heart", label: "Resting HR", value: "71 bpm", note: "Average" },
    { id: "cycle", label: "Cycle", value: "Day 12", note: "Luteal phase" }
  ],
  highlights: [
    {
      id: "h1",
      title: "Resting Heart Rate",
      detail: "3 bpm lower than last week",
      trend: "improving"
    },
    {
      id: "h2",
      title: "Sleep Consistency",
      detail: "5 of 7 nights over 7 hours",
      trend: "stable"
    },
    {
      id: "h3",
      title: "Hydration",
      detail: "75% of daily goal by evening",
      trend: "improving"
    }
  ],
  trends: [
    { id: "t1", label: "Energy", value: "+12%" },
    { id: "t2", label: "Sleep", value: "+8%" },
    { id: "t3", label: "Stress", value: "-10%" }
  ]
};

const toFiniteNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const isDailyEntryShape = (data) => {
  return Boolean(
    data &&
      typeof data === "object" &&
      (Object.prototype.hasOwnProperty.call(data, "mood") ||
        Object.prototype.hasOwnProperty.call(data, "sleep") ||
        Object.prototype.hasOwnProperty.call(data, "hydrationLiters"))
  );
};

const formatSleepHours = (bedtime, wakeTime) => {
  if (!bedtime || !wakeTime || typeof bedtime !== "string" || typeof wakeTime !== "string") {
    return "N/A";
  }

  const [bedH, bedM] = bedtime.split(":").map(Number);
  const [wakeH, wakeM] = wakeTime.split(":").map(Number);

  if (![bedH, bedM, wakeH, wakeM].every(Number.isFinite)) {
    return "N/A";
  }

  const bedtimeMinutes = bedH * 60 + bedM;
  const wakeMinutes = wakeH * 60 + wakeM;
  let diff = wakeMinutes - bedtimeMinutes;

  if (diff < 0) {
    diff += 24 * 60;
  }

  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${hours}h ${mins}m`;
};

const normalizeFromDailyEntry = (data) => {
  const moodIndex = toFiniteNumber(data?.mood, 0);
  const moodLabel = moodOptions[moodIndex] ?? fallbackSummary.moodLabel;
  const sleepHours = formatSleepHours(data?.sleep?.bedtime, data?.sleep?.wakeTime);
  const sleepQuality = sleepQualityLabels[toFiniteNumber(data?.sleep?.quality, 0)] ?? "N/A";
  const hydrationCurrent = toFiniteNumber(data?.hydrationLiters, fallbackSummary.hydration.current);
  const symptoms = Array.isArray(data?.symptoms) ? data.symptoms : [];
  const mappedSymptoms = symptoms
    .map((symptomIndex) => symptomLabels[toFiniteNumber(symptomIndex, -1)])
    .filter(Boolean)
    .filter((label) => label !== "None");
  const symptomText = mappedSymptoms.length > 0 ? mappedSymptoms.join(", ") : "None";
  const activityType = activityLabels[toFiniteNumber(data?.activity?.type, 0)] ?? "Other";
  const activityDuration = toFiniteNumber(data?.activity?.durationMinutes, 0);
  const flowLevel = flowLevelLabels[toFiniteNumber(data?.flowLevel, 1)] ?? "Medium";
  const systolic = toFiniteNumber(data?.bloodPressure?.systolic, 0);
  const diastolic = toFiniteNumber(data?.bloodPressure?.diastolic, 0);

  return {
    userName: data?.userName ?? data?.name ?? fallbackSummary.userName,
    moodLabel,
    cycle: {
      nextPeriodInDays:
        data?.cycle?.nextPeriodInDays ?? data?.nextPeriodInDays ?? fallbackSummary.cycle.nextPeriodInDays,
      cycleDay: data?.cycle?.cycleDay ?? data?.cycleDay ?? fallbackSummary.cycle.cycleDay
    },
    hydration: {
      current: hydrationCurrent,
      goal: data?.hydration?.goal ?? data?.waterGoal ?? fallbackSummary.hydration.goal
    },
    pinned: [
      { id: "sleep", label: "Sleep", value: sleepHours, note: `Quality: ${sleepQuality}` },
      {
        id: "activity",
        label: "Activity",
        value: `${activityDuration} min`,
        note: activityType
      },
      {
        id: "bp",
        label: "Blood Pressure",
        value: `${systolic}/${diastolic}`,
        note: "mmHg"
      },
      { id: "mood", label: "Mood", value: moodLabel, note: "Latest entry" }
    ],
    highlights: [
      {
        id: "h1",
        title: "Stress & Anxiety",
        detail: `Stress ${toFiniteNumber(data?.stressLevel, 0)}/10, Anxiety ${toFiniteNumber(data?.anxietyLevel, 0)}/10`,
        trend: "stable"
      },
      {
        id: "h2",
        title: "Diet Check",
        detail: `Breakfast ${data?.diet?.breakfast ? "Yes" : "No"}, Lunch ${data?.diet?.lunch ? "Yes" : "No"}, Dinner ${
          data?.diet?.dinner ? "Yes" : "No"
        }`,
        trend: "stable"
      },
      {
        id: "h3",
        title: "Symptoms",
        detail: symptomText,
        trend: mappedSymptoms.length > 0 ? "attention" : "improving"
      }
    ],
    trends: [
      { id: "t1", label: "Energy", value: `${toFiniteNumber(data?.energyLevel, 0)}/10` },
      { id: "t2", label: "Workload", value: `${toFiniteNumber(data?.workloadPressure, 0)}/10` },
      { id: "t3", label: "Meditation", value: `${toFiniteNumber(data?.meditationMinutes, 0)} min` }
    ],
    periodStarted: Boolean(data?.periodStarted),
    flowLevel,
    notes: data?.notes ?? ""
  };
};

const normalizeSummary = (data) => {
  if (!data || typeof data !== "object") {
    return fallbackSummary;
  }

  if (isDailyEntryShape(data)) {
    return normalizeFromDailyEntry(data);
  }

  return {
    userName: data.userName ?? data.name ?? fallbackSummary.userName,
    moodLabel: data.moodLabel ?? fallbackSummary.moodLabel,
    cycle: {
      nextPeriodInDays:
        data?.cycle?.nextPeriodInDays ?? data.nextPeriodInDays ?? fallbackSummary.cycle.nextPeriodInDays,
      cycleDay: data?.cycle?.cycleDay ?? data.cycleDay ?? fallbackSummary.cycle.cycleDay
    },
    hydration: {
      current: data?.hydration?.current ?? data.waterIntake ?? fallbackSummary.hydration.current,
      goal: data?.hydration?.goal ?? data.waterGoal ?? fallbackSummary.hydration.goal
    },
    pinned: Array.isArray(data.pinned) && data.pinned.length > 0 ? data.pinned : fallbackSummary.pinned,
    highlights:
      Array.isArray(data.highlights) && data.highlights.length > 0
        ? data.highlights
        : fallbackSummary.highlights,
    trends: Array.isArray(data.trends) && data.trends.length > 0 ? data.trends : fallbackSummary.trends
  };
};

const Dashboard = ({ theme, onThemeChange }) => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState("Great");
  const [summary, setSummary] = useState(fallbackSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHydrationModalOpen, setIsHydrationModalOpen] = useState(false);
  const [waterAmount, setWaterAmount] = useState(250);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));

  useEffect(() => {
    let active = true;

    const loadSummary = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const data = await getDashboardSummary();

        if (!active) {
          return;
        }

        setSummary(normalizeSummary(data));
      } catch (error) {
        if (!active) {
          return;
        }

        setSummary(fallbackSummary);
        setLoadError("Live dashboard data is temporarily unavailable.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (summary?.moodLabel && moodOptions.includes(summary.moodLabel)) {
      setSelectedMood(summary.moodLabel);
    }
  }, [summary]);

  const hydrationPercent = useMemo(() => {
    const safeGoal = Number(summary?.hydration?.goal ?? 0);
    const safeCurrent = Number(summary?.hydration?.current ?? 0);

    if (safeGoal <= 0) {
      return 0;
    }

    return Math.min(100, Math.round((safeCurrent / safeGoal) * 100));
  }, [summary]);

  useEffect(() => {
    if (!isHydrationModalOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsHydrationModalOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isHydrationModalOpen]);

  const addWater = () => {
    setSummary((current) => ({
      ...current,
      hydration: {
        ...current.hydration,
        current: Math.min(Number(current.hydration.goal), Number((current.hydration.current + waterAmount / 1000).toFixed(2)))
      }
    }));
    setIsHydrationModalOpen(false);
  };

  const cycleProgress = useMemo(() => {
    const day = Number(summary?.cycle?.cycleDay ?? 0);
    return Math.max(0, Math.min(100, Math.round((day / 28) * 100)));
  }, [summary]);

  const handleAddEntry = () => {
    navigate("/add-entry");
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsSidebarOpen(false);
    navigate("/login");
  };

  return (
    <div className={`page ${styles.pageWrapper}`}>
      <div className={styles.aurora} aria-hidden="true" />
      <div className={styles.blobLeft} aria-hidden="true" />
      <div className={styles.blobRight} aria-hidden="true" />

      <header className={`${styles.heroCard} ${styles.reveal}`}>
        <div className="flex items-center justify-between w-full">
          <div>
            <p className={styles.kicker}>SheCare Dashboard</p>
            <h1 className={styles.title}>Hello, {summary.userName}</h1>
            <p className={styles.subtitle}>Your wellness rhythm for today.</p>
          </div>
          <div className="ml-auto">
            <ProfileIcon isOpen={isSidebarOpen} onClick={handleToggleSidebar} />
          </div>
        </div>
      </header>

      <ProfileSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        user={{ name: summary.userName, email: "member@shecare.app" }}
        theme={theme}
        onThemeChange={onThemeChange}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {(loadError || isLoading) && (
        <p className={styles.infoBanner}>{isLoading ? "Loading dashboard..." : loadError}</p>
      )}

      <section className={`${styles.cycleSpotlight} ${styles.reveal}`}>
        <div>
          <p className={styles.cardLabel}>Cycle Status</p>
          <h2 className={styles.metric}>{summary.cycle.nextPeriodInDays} days</h2>
          <p className={styles.metricMeta}>until expected next period</p>
          <p className={styles.metricHint}>Cycle day {summary.cycle.cycleDay}</p>
        </div>
        <div className={styles.ringWrap}>
          <div className={styles.ringMeter} style={{ "--progress": `${cycleProgress}%` }}>
            <span>{summary.cycle.cycleDay}</span>
            <small>day</small>
          </div>
        </div>
      </section>

      <section className={`${styles.sectionCard} ${styles.reveal}`}>
        <div className={styles.sectionHeader}>
          <h3>Pinned Metrics</h3>
          <span>Today</span>
        </div>
        <div className={styles.pinnedGrid}>
          {summary.pinned.map((item, idx) => (
            <article key={item.id} className={styles.pinnedItem} style={{ animationDelay: `${idx * 60}ms` }}>
              <p className={styles.pinnedLabel}>{item.label}</p>
              <p className={styles.pinnedValue}>{item.value}</p>
              <p className={styles.pinnedNote}>{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.sectionCard} ${styles.reveal}`}>
        <div className={styles.sectionHeader}>
          <h3>Highlights</h3>
          <span>Trends</span>
        </div>
        <div className={styles.highlightList}>
          {summary.highlights.map((item) => (
            <article key={item.id} className={styles.highlightItem}>
              <div>
                <p className={styles.highlightTitle}>{item.title}</p>
                <p className={styles.highlightDetail}>{item.detail}</p>
              </div>
              <span
                className={`${styles.trendBadge} ${
                  item.trend === "improving"
                    ? styles.trendUp
                    : item.trend === "stable"
                    ? styles.trendStable
                    : styles.trendDown
                }`}
              >
                {item.trend}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.sectionCard} ${styles.reveal}`}>
        <div className={styles.sectionHeader}>
          <h3>Trend Snapshot</h3>
          <span>7 days</span>
        </div>
        <div className={styles.chipRow}>
          {summary.trends.map((item) => (
            <span key={item.id} className={styles.dataChip}>
              {item.label}: {item.value}
            </span>
          ))}
        </div>
      </section>

      <section className={`${styles.sectionCard} ${styles.reveal}`}>
        <div className={styles.sectionHeader}>
          <h3>Hydration</h3>
          <div className={styles.hydrationHeaderActions}>
            <span>{hydrationPercent}%</span>
            <button type="button" className={styles.addHydrationButton} onClick={() => setIsHydrationModalOpen(true)} aria-label="Add water">
              +
            </button>
          </div>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${hydrationPercent}%` }} />
        </div>
        <p className={styles.progressLabel}>
          {summary.hydration.current}L / {summary.hydration.goal}L
        </p>
      </section>

      {isHydrationModalOpen && (
        <div className={styles.modalOverlay} onMouseDown={() => setIsHydrationModalOpen(false)}>
          <div className={styles.waterModal} role="dialog" aria-modal="true" aria-labelledby="water-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.modalTitleRow}>
              <div className={styles.waterIcon}>◆</div>
              <div>
                <h2 id="water-modal-title">Log Water Intake</h2>
                <p>Keep yourself hydrated <span aria-hidden="true">♥</span></p>
              </div>
              <button type="button" className={styles.closeModalButton} onClick={() => setIsHydrationModalOpen(false)} aria-label="Close">×</button>
            </div>

            <div className={styles.intakeSummary}>
              <div><span>Today's Intake</span><strong>{summary.hydration.current} L</strong><small>of {summary.hydration.goal} L goal</small></div>
              <div className={styles.modalProgress}><b>{hydrationPercent}%</b><small>reached</small></div>
            </div>

            <div className={styles.addWaterHeading}><h3>Add Water</h3><span>1 cup = 250 ml</span></div>
            <div className={styles.waterPresets}>
              {[250, 500, 750, 1000].map((amount) => (
                <button key={amount} type="button" className={`${styles.waterPreset} ${waterAmount === amount ? styles.waterPresetActive : ""}`} onClick={() => setWaterAmount(amount)}>
                  <span className={styles.glassIcon} aria-hidden="true"><span className={styles.glassWater} /></span><b>{amount >= 1000 ? "1 L" : `${amount} ml`}</b>
                </button>
              ))}
            </div>
            <div className={styles.orDivider}><span>or</span></div>
            <h3 className={styles.customAmountTitle}>Custom Amount</h3>
            <div className={styles.customAmount}><button type="button" onClick={() => setWaterAmount((amount) => Math.max(50, amount - 50))}>−</button><strong>{waterAmount} <small>ml</small></strong><button type="button" onClick={() => setWaterAmount((amount) => amount + 50)}>+</button></div>
            <div className={styles.goalNote}><span>♧</span><div><b>Daily goal: {summary.hydration.goal} L</b><small>You're doing great!</small></div></div>
            <div className={styles.modalActions}><button type="button" className={styles.cancelButton} onClick={() => setIsHydrationModalOpen(false)}>Cancel</button><button type="button" className={styles.confirmButton} onClick={addWater}>Add</button></div>
          </div>
        </div>
      )}

      <section className={`${styles.sectionCard} ${styles.reveal}`}>
        <div className={styles.sectionHeader}>
          <h3>How are you feeling?</h3>
          <span>Quick check-in</span>
        </div>
        <div className={styles.chipRow}>
          {moodOptions.map((mood) => (
            <button
              key={mood}
              type="button"
              className={`${styles.moodButton} ${selectedMood === mood ? styles.moodActive : ""}`}
              onClick={() => setSelectedMood(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </section>

      <section className={`${styles.actionsSection} ${styles.reveal}`}>
        {quickActions.map((action, idx) => (
          <button
            key={action.title}
            type="button"
            className={styles.actionCard}
            style={{ animationDelay: `${idx * 80}ms` }}
            onClick={() => navigate(action.path)}
          >
            <span className={styles.actionIcon} aria-hidden="true">
              {action.icon}
            </span>
            <p className={styles.actionTitle}>{action.title}</p>
            <p className={styles.actionSubtitle}>{action.subtitle}</p>
          </button>
        ))}
      </section>

      <div className={styles.ctaRow}>
        <button type="button" className={styles.primaryButton} onClick={handleAddEntry}>
          Add Daily Entry
        </button>
      </div>

      <nav className={styles.bottomNav}>
        {navItems.map((item) => {
          const active = item.path === "/dashboard";
          return (
            <button
              key={item.label}
              type="button"
              className={`${styles.navButton} ${active ? styles.navActive : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.navIcon} aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Dashboard;
