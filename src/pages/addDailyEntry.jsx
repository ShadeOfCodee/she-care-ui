import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveDailyEntry } from "../services/dashboardService";
import styles from "./addDailyEntry.module.css";

const moodOptions = ["Great", "Good", "Okay", "Low", "Stressed"];
const sleepQualityOptions = ["Poor", "Average", "Good", "Excellent"];
const activityOptions = ["Walking", "Yoga", "Gym", "Running", "Stretching", "Other"];
const symptomOptions = ["Headache", "Fatigue", "Cramps", "Bloating", "Back pain", "Acne", "None"];
const flowLevels = ["Light", "Medium", "Heavy"];

const moodEnumMap = {
  Great: 0,
  Good: 1,
  Okay: 2,
  Low: 3,
  Stressed: 4
};

const sleepQualityEnumMap = {
  Poor: 0,
  Average: 1,
  Good: 2,
  Excellent: 3
};

const activityEnumMap = {
  Walking: 0,
  Yoga: 1,
  Gym: 2,
  Running: 3,
  Stretching: 4,
  Other: 5
};

const symptomEnumMap = {
  Headache: 0,
  Fatigue: 1,
  Cramps: 2,
  Bloating: 3,
  "Back pain": 4,
  Acne: 5,
  None: 6
};

const flowLevelEnumMap = {
  Light: 0,
  Medium: 1,
  Heavy: 2
};

const IconBadge = ({ children }) => <span className={styles.iconBadge}>{children}</span>;

const iconPaths = {
  mood: "M12 3a9 9 0 1 1 0 18a9 9 0 0 1 0-18m-3.5 8.3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m7 0a1 1 0 1 0 0-2a1 1 0 0 0 0 2M8 14a4 4 0 0 0 8 0H8Z",
  sleep: "M14.7 3.1a7.8 7.8 0 1 0 6.2 10.9a8.1 8.1 0 0 1-3.4.8a8 8 0 0 1-8-8c0-1.2.3-2.4.8-3.4c1.2-.6 2.5-.8 3.8-.3Z",
  energy: "M13.5 2L6 13h4l-1.5 9L18 10h-4l-.5-8Z",
  stress: "M4 12h3l2-5l3 10l2-5h6",
  health: "M12 21s-7-4.4-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.6-7 11-7 11Z",
  hydration: "M12 2s5 5.5 5 9a5 5 0 1 1-10 0c0-3.5 5-9 5-9Z",
  activity: "M14.5 5a1.8 1.8 0 1 1 0 3.6a1.8 1.8 0 0 1 0-3.6M8 10l2.8-1.5l2.5 1.2l2.2 3.8h-2.3l-1.4-2.4l-1.8.9l-1 3.2H6.8L8 10m7 4.8l2.8 3.2h-2.4l-2.1-2.4",
  diet: "M7 3v8a2 2 0 1 1-4 0V3h1v3h1V3h1v3h1V3h1m6 0c1.6 0 3 1.4 3 3.3V21h-2V13h-2V3h1Z",
  symptoms: "M12 3l2.2 4.5L19 8l-3.4 3.3L16.4 16L12 13.7L7.6 16l.8-4.7L5 8l4.8-.5L12 3Z",
  cycle: "M7 2h2v2h6V2h2v2h3v18H4V4h3V2m11 7H6v11h12V9m-8 3h4v2h-4v-2Z",
  notes: "M6 3h9l4 4v14H6V3m8 1.5V8h3.5L14 4.5M8 11h8v1.8H8V11m0 3.5h8v1.8H8v-1.8Z"
};

const HeaderIcon = ({ icon }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d={iconPaths[icon]} fill="currentColor" />
  </svg>
);

const SectionHeader = ({ icon, title }) => (
  <div className={styles.sectionHeader}>
    <h2>
      <IconBadge>
        <HeaderIcon icon={icon} />
      </IconBadge>
      {title}
    </h2>
  </div>
);

const toDateTimeLocalValue = (date) => {
  const pad = (value) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
};

const toNumberOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const AddDailyEntryPage = () => {
  const navigate = useNavigate();
  const [entryDateTime, setEntryDateTime] = useState(() => toDateTimeLocalValue(new Date()));
  const [selectedMood, setSelectedMood] = useState("Good");
  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepQuality, setSleepQuality] = useState("Good");
  const [energyLevel, setEnergyLevel] = useState(7);
  const [stressLevel, setStressLevel] = useState(3);
  const [sexualActivity, setSexualActivity] = useState(false);
  const [caffeineIntake, setCaffeineIntake] = useState("");
  const [meditationMinutes, setMeditationMinutes] = useState("");
  const [workloadPressure, setWorkloadPressure] = useState(4);
  const [anxietyLevel, setAnxietyLevel] = useState(3);
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState("");
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState("");
  const [hydration, setHydration] = useState(1.5);
  const [activity, setActivity] = useState("Walking");
  const [duration, setDuration] = useState("");
  const [diet, setDiet] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    fruitsVeg: false,
    junkFood: false
  });
  const [symptoms, setSymptoms] = useState([]);
  const [periodStarted, setPeriodStarted] = useState(false);
  const [flowLevel, setFlowLevel] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const hydrationPercent = useMemo(() => Math.max(0, Math.min(100, (hydration / 3) * 100)), [hydration]);

  const energyLabel = useMemo(() => {
    if (energyLevel <= 2) return "Very Low";
    if (energyLevel <= 4) return "Low";
    if (energyLevel <= 6) return "Balanced";
    if (energyLevel <= 8) return "High";
    return "Very High";
  }, [energyLevel]);

  const completionPercent = useMemo(() => {
    let score = 0;
    if (selectedMood) score += 1;
    if (bedtime && wakeTime) score += 1;
    if (sleepQuality) score += 1;
    if (hydration > 0) score += 1;
    if (activity) score += 1;
    if (duration) score += 1;
    if (symptoms.length > 0) score += 1;
    if (notes.trim()) score += 1;

    return Math.round((score / 8) * 100);
  }, [selectedMood, bedtime, wakeTime, sleepQuality, hydration, activity, duration, symptoms, notes]);

  const toggleDietItem = (key) => {
    setDiet((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSymptom = (symptom) => {
    if (symptom === "None") {
      setSymptoms((prev) => (prev.includes("None") ? [] : ["None"]));
      return;
    }

    setSymptoms((prev) => {
      const withoutNone = prev.filter((item) => item !== "None");
      if (withoutNone.includes(symptom)) {
        return withoutNone.filter((item) => item !== symptom);
      }
      return [...withoutNone, symptom];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    const selectedDate = entryDateTime ? new Date(entryDateTime) : new Date();
    const date = Number.isNaN(selectedDate.getTime()) ? new Date().toISOString() : selectedDate.toISOString();

    const payload = {
      date,
      mood: moodEnumMap[selectedMood],
      sleep: {
        bedtime,
        wakeTime,
        quality: sleepQualityEnumMap[sleepQuality]
      },
      energyLevel,
      stressLevel,
      sexualActivity,
      caffeineIntakeCups: toNumberOrZero(caffeineIntake),
      meditationMinutes: toNumberOrZero(meditationMinutes),
      workloadPressure,
      anxietyLevel,
      bloodPressure: {
        systolic: toNumberOrZero(bloodPressureSystolic),
        diastolic: toNumberOrZero(bloodPressureDiastolic)
      },
      hydrationLiters: hydration,
      activity: {
        type: activityEnumMap[activity],
        durationMinutes: toNumberOrZero(duration)
      },
      diet,
      symptoms: symptoms.map((symptom) => symptomEnumMap[symptom]),
      periodStarted,
      flowLevel: flowLevelEnumMap[flowLevel],
      notes
    };

    try {
      setIsSubmitting(true);
      const response = await saveDailyEntry(payload);
      const successText = response?.message ?? "Daily entry saved successfully.";
      setSubmitMessage(successText);
      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        "Failed to save daily entry. Please try again.";
      setSubmitError(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`page ${styles.pageWrapper}`}>
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <form className={styles.form} onSubmit={handleSubmit}>
        <header className={styles.topBar}>
          <button type="button" className={styles.backButton} onClick={() => navigate("/dashboard")}>
            Back
          </button>
          <p className={styles.kicker}>Daily Log</p>
          <h1 className={styles.title}>Add Daily Entry</h1>
          <p className={styles.subtitle}>Capture your wellness signals for SheCare.</p>
        </header>

        <section className={styles.heroCard}>
          <div>
            <p className={styles.heroLabel}>Entry Progress</p>
            <p className={styles.heroValue}>{completionPercent}%</p>
            <p className={styles.heroHint}>Complete this log for smarter insights in dashboard, cycle and diet plans.</p>
          </div>
          <div className={styles.heroRing} style={{ "--progress": `${completionPercent}%` }}>
            <span>{completionPercent}%</span>
          </div>
        </section>

        <section className={styles.card}>
          <SectionHeader icon="cycle" title="Entry Date & Time" />
          <label className={styles.field}>
            <span>Date & Time</span>
            <input
              type="datetime-local"
              value={entryDateTime}
              onChange={(event) => setEntryDateTime(event.target.value)}
              max={toDateTimeLocalValue(new Date())}
            />
          </label>
        </section>

        <section className={styles.card}>
          <SectionHeader icon="mood" title="Mood" />
          <div className={styles.chipWrap}>
            {moodOptions.map((mood) => (
              <button
                key={mood}
                type="button"
                className={`${styles.pillButton} ${selectedMood === mood ? styles.pillActive : ""}`}
                onClick={() => setSelectedMood(mood)}
                aria-pressed={selectedMood === mood}
              >
                {mood}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <SectionHeader icon="sleep" title="Sleep" />
          <div className={styles.gridTwo}>
            <label className={styles.field}>
              <span>Bedtime</span>
              <input type="time" value={bedtime} onChange={(event) => setBedtime(event.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Wake-up Time</span>
              <input type="time" value={wakeTime} onChange={(event) => setWakeTime(event.target.value)} />
            </label>
          </div>
          <label className={styles.field}>
            <span>Sleep Quality</span>
            <select value={sleepQuality} onChange={(event) => setSleepQuality(event.target.value)}>
              {sleepQualityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className={styles.card}>
          <SectionHeader icon="energy" title="Energy" />
          <div className={styles.sliderHeader}>
            <span>Very Low</span>
            <strong>{energyLabel}</strong>
            <span>Very High</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={energyLevel}
            onChange={(event) => setEnergyLevel(Number(event.target.value))}
            className={styles.slider}
            aria-label="Energy level from very low to very high"
          />
        </section>

        <section className={styles.card}>
          <SectionHeader icon="stress" title="Stress" />
          <div className={styles.sliderHeader}>
            <span>Low</span>
            <strong>{stressLevel}/10</strong>
            <span>High</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={stressLevel}
            onChange={(event) => setStressLevel(Number(event.target.value))}
            className={styles.slider}
            aria-label="Stress level from low to high"
          />
        </section>

        <section className={styles.card}>
          <SectionHeader icon="health" title="Additional Health Inputs" />
          <label className={styles.toggleRow}>
            <span>Sexual activity today</span>
            <input
              type="checkbox"
              role="switch"
              checked={sexualActivity}
              onChange={(event) => setSexualActivity(event.target.checked)}
            />
          </label>
          <div className={styles.gridTwo}>
            <label className={styles.field}>
              <span>Caffeine intake (cups)</span>
              <input
                type="number"
                min="0"
                placeholder="e.g. 2"
                value={caffeineIntake}
                onChange={(event) => setCaffeineIntake(event.target.value)}
                inputMode="numeric"
              />
            </label>
            <label className={styles.field}>
              <span>Meditation (minutes)</span>
              <input
                type="number"
                min="0"
                placeholder="e.g. 15"
                value={meditationMinutes}
                onChange={(event) => setMeditationMinutes(event.target.value)}
                inputMode="numeric"
              />
            </label>
          </div>
          <div className={styles.sliderHeader}>
            <span>Workload Pressure</span>
            <strong>{workloadPressure}/10</strong>
            <span>High</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={workloadPressure}
            onChange={(event) => setWorkloadPressure(Number(event.target.value))}
            className={styles.slider}
            aria-label="Workload pressure from low to high"
          />
          <div className={styles.sliderHeader}>
            <span>Anxiety</span>
            <strong>{anxietyLevel}/10</strong>
            <span>High</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={anxietyLevel}
            onChange={(event) => setAnxietyLevel(Number(event.target.value))}
            className={styles.slider}
            aria-label="Anxiety level from low to high"
          />
          <div className={styles.gridTwo}>
            <label className={styles.field}>
              <span>Blood Pressure (Systolic)</span>
              <input
                type="number"
                min="0"
                placeholder="e.g. 120"
                value={bloodPressureSystolic}
                onChange={(event) => setBloodPressureSystolic(event.target.value)}
                inputMode="numeric"
              />
            </label>
            <label className={styles.field}>
              <span>Blood Pressure (Diastolic)</span>
              <input
                type="number"
                min="0"
                placeholder="e.g. 80"
                value={bloodPressureDiastolic}
                onChange={(event) => setBloodPressureDiastolic(event.target.value)}
                inputMode="numeric"
              />
            </label>
          </div>
        </section>

        {/* <section className={styles.card}>
          <SectionHeader icon="hydration" title="Hydration" />
          <div className={styles.sliderHeader}>
            <span>0L</span>
            <strong>{hydration.toFixed(1)}L</strong>
            <span>3L</span>
          </div>
          <div className={styles.progressTrack} aria-hidden="true">
            <div className={styles.progressFill} style={{ width: `${hydrationPercent}%` }} />
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={hydration}
            onChange={(event) => setHydration(Number(event.target.value))}
            className={styles.slider}
            aria-label="Hydration amount from 0 to 3 liters"
          />
        </section> */}

        <section className={styles.card}>
          <SectionHeader icon="activity" title="Activity" />
          <div className={styles.gridTwo}>
            <label className={styles.field}>
              <span>Activity Type</span>
              <select value={activity} onChange={(event) => setActivity(event.target.value)}>
                {activityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Duration (minutes)</span>
              <input
                type="number"
                min="0"
                placeholder="e.g. 30"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                inputMode="numeric"
              />
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <SectionHeader icon="diet" title="Diet" />
          <div className={styles.checkboxList}>
            <label className={styles.checkboxItem}>
              <input type="checkbox" checked={diet.breakfast} onChange={() => toggleDietItem("breakfast")} />
              <span>Breakfast completed</span>
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" checked={diet.lunch} onChange={() => toggleDietItem("lunch")} />
              <span>Lunch completed</span>
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" checked={diet.dinner} onChange={() => toggleDietItem("dinner")} />
              <span>Dinner completed</span>
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" checked={diet.fruitsVeg} onChange={() => toggleDietItem("fruitsVeg")} />
              <span>Fruits/vegetables taken</span>
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" checked={diet.junkFood} onChange={() => toggleDietItem("junkFood")} />
              <span>Junk food consumed</span>
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <SectionHeader icon="symptoms" title="Symptoms" />
          <div className={styles.chipWrap}>
            {symptomOptions.map((symptom) => (
              <button
                key={symptom}
                type="button"
                className={`${styles.pillButton} ${symptoms.includes(symptom) ? styles.pillActive : ""}`}
                onClick={() => toggleSymptom(symptom)}
                aria-pressed={symptoms.includes(symptom)}
              >
                {symptom}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <SectionHeader icon="cycle" title="Cycle" />
          <label className={styles.toggleRow}>
            <span>Period started today</span>
            <input
              type="checkbox"
              role="switch"
              checked={periodStarted}
              onChange={(event) => setPeriodStarted(event.target.checked)}
            />
          </label>
          <div className={styles.chipWrap}>
            {flowLevels.map((level) => (
              <button
                key={level}
                type="button"
                className={`${styles.pillButton} ${flowLevel === level ? styles.pillActive : ""}`}
                onClick={() => setFlowLevel(level)}
                aria-pressed={flowLevel === level}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <SectionHeader icon="notes" title="Notes" />
          <label className={styles.field}>
            <span className={styles.screenReaderOnly}>Daily notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add details about your day..."
              rows="4"
            />
          </label>
        </section>

        <div className={styles.footerAction}>
          {submitError && <p className={styles.errorText}>{submitError}</p>}
          {submitMessage && <p className={styles.successText}>{submitMessage}</p>}
          <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default AddDailyEntryPage;
