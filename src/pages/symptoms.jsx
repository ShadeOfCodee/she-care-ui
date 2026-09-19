import { useEffect, useMemo, useState } from "react";
import styles from "./symptoms.module.css";
import { updateConceptionMode } from "../services/cycleService";

const MOODS = ["Happy", "Neutral", "Sad", "Irritated", "Tired", "Anxious"];

const SYMPTOM_CATEGORIES = [
  {
    title: "Physical",
    items: ["Cramps", "Headache", "Back Pain", "Breast Tenderness"],
  },
  {
    title: "Emotional",
    items: ["Mood Swings", "Anxiety", "Irritability", "Low Motivation"],
  },
  {
    title: "Other",
    items: ["Bloating", "Acne", "Fatigue", "Food Cravings"],
  },
];

const FLOW_OPTIONS = ["None", "Light", "Medium", "Heavy"];
const MODE_OPTIONS = [
  { label: "Trying to Conceive", value: "TryingToConceive" },
  { label: "Avoid Pregnancy", value: "AvoidPregnancy" },
  { label: "Track Health Only", value: "TrackHealthOnly" },
];

const CERVICAL_FLUID_OPTIONS = ["None", "Sticky", "Creamy", "Watery", "Egg-white (Fertile)"];
const OVULATION_TEST_OPTIONS = ["Not Taken", "Negative", "Faint Positive", "Peak Positive"];
const BREAST_CHANGES_OPTIONS = ["Tenderness", "Swelling", "Pain", "No Change"];
const VAGINAL_HEALTH_OPTIONS = ["Dryness", "Itching", "Odor Change", "Discharge Change", "Normal"];
const DIGESTIVE_CHANGES_OPTIONS = ["Bloating", "Constipation", "Diarrhea", "Nausea", "Appetite Increase", "Appetite Loss"];
const SKIN_CHANGES_OPTIONS = ["Acne", "Oily Skin", "Dry Skin", "Glow Increase", "Rash"];
const HAIR_CHANGES_OPTIONS = ["Hair Fall Increase", "Greasy Scalp", "Dry Scalp", "No Change"];
const COGNITIVE_STATE_OPTIONS = ["Brain Fog", "Low Focus", "Forgetfulness", "High Clarity"];
const SOCIAL_BEHAVIOR_OPTIONS = ["Social Withdrawal", "High Confidence", "Irritability", "Romantic Mood"];
const PELVIC_PAIN_ZONES_OPTIONS = ["Left Pelvic", "Right Pelvic", "Central Cramps", "Lower Back", "Thigh Pain"];
const PERIOD_MEDICATION_OPTIONS = ["Painkiller", "Antispasmodic", "Hormonal Pill", "Birth Control", "Iron Supplement", "Herbal Relief"];
const ALLERGY_SYMPTOMS_OPTIONS = ["Skin Rash", "Itching", "Sneezing", "Sinus Reaction", "Food Reaction", "Medicine Reaction"];
const ALLERGY_TRIGGER_OPTIONS = ["Food", "Medicine", "Environment", "Hormonal", "Unknown"];
const PREGNANCY_INDICATORS_OPTIONS = ["Implantation Spotting", "Nausea", "Breast Heaviness", "Fatigue Spike"];

const MODE_STORAGE_KEY = "shecareConceptionMode";
const SYMPTOMS_DRAFT_KEY = "shecareSymptomsPageDraftV2";

const advancedDefaults = {
  cervicalFluid: "",
  ovulationTestResult: "Not Taken",
  breastSymptoms: [],
  vaginalHealth: [],
  digestiveSymptoms: [],
  skinChanges: [],
  hairChanges: [],
  cognitiveState: [],
  socialBehavior: [],
  libidoLevel: 2,
  pelvicPainZones: [],
  periodMedication: [],
  allergySymptoms: [],
  allergyTrigger: "Unknown",
  spotting: false,
  pregnancyIndicators: [],
};

const readDraft = () => {
  try {
    const raw = localStorage.getItem(SYMPTOMS_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      advanced: {
        ...advancedDefaults,
        ...(parsed?.advanced ?? {}),
        breastSymptoms: Array.isArray(parsed?.advanced?.breastSymptoms) ? parsed.advanced.breastSymptoms : [],
        vaginalHealth: Array.isArray(parsed?.advanced?.vaginalHealth) ? parsed.advanced.vaginalHealth : [],
        digestiveSymptoms: Array.isArray(parsed?.advanced?.digestiveSymptoms) ? parsed.advanced.digestiveSymptoms : [],
        skinChanges: Array.isArray(parsed?.advanced?.skinChanges) ? parsed.advanced.skinChanges : [],
        hairChanges: Array.isArray(parsed?.advanced?.hairChanges) ? parsed.advanced.hairChanges : [],
        cognitiveState: Array.isArray(parsed?.advanced?.cognitiveState) ? parsed.advanced.cognitiveState : [],
        socialBehavior: Array.isArray(parsed?.advanced?.socialBehavior) ? parsed.advanced.socialBehavior : [],
        pelvicPainZones: Array.isArray(parsed?.advanced?.pelvicPainZones) ? parsed.advanced.pelvicPainZones : [],
        periodMedication: Array.isArray(parsed?.advanced?.periodMedication) ? parsed.advanced.periodMedication : [],
        allergySymptoms: Array.isArray(parsed?.advanced?.allergySymptoms) ? parsed.advanced.allergySymptoms : [],
        pregnancyIndicators: Array.isArray(parsed?.advanced?.pregnancyIndicators) ? parsed.advanced.pregnancyIndicators : [],
      },
    };
  } catch {
    return null;
  }
};

const SelectableChips = ({ options, selectedValues, onSelect, multi = false }) => (
  <div className={styles.chipsRow}>
    {options.map((option) => {
      const isSelected = multi ? selectedValues.includes(option) : selectedValues === option;
      return (
        <button
          key={option}
          type="button"
          className={`${styles.chip} ${styles.chipAnimated} ${isSelected ? styles.chipActive : ""}`}
          onClick={() => onSelect(option)}
          aria-pressed={isSelected}
        >
          {option}
        </button>
      );
    })}
  </div>
);

const SegmentedControl = ({ options, selectedValue, onChange, ariaLabel }) => (
  <div className={styles.segmentedWrap} role="tablist" aria-label={ariaLabel}>
    {options.map((option) => {
      const isSelected = selectedValue === option;
      return (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={isSelected}
          className={`${styles.segmentedButton} ${isSelected ? styles.segmentedButtonActive : ""}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      );
    })}
  </div>
);

const SliderControl = ({ min, max, value, onChange, leftLabel, rightLabel, valueLabel, ariaLabel }) => (
  <div className={styles.sliderBlock}>
    <div className={styles.sliderLabelRow}>
      <span>{leftLabel}</span>
      <strong>{valueLabel}</strong>
      <span>{rightLabel}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`${styles.slider} ${styles.premiumSlider}`}
      aria-label={ariaLabel}
    />
  </div>
);

const ToggleSwitch = ({ label, checked, onChange }) => (
  <label className={styles.switchRow}>
    <span>{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`${styles.switchButton} ${checked ? styles.switchButtonOn : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.switchKnob} />
    </button>
  </label>
);

const CollapsibleSection = ({ title, isEmpty, children }) => {
  const [isOpen, setIsOpen] = useState(!isEmpty);

  useEffect(() => {
    if (isEmpty) setIsOpen(false);
  }, [isEmpty]);

  return (
    <section className={`${styles.card} ${styles.advancedCard}`}>
      <button
        type="button"
        className={styles.collapseTrigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className={styles.sectionTitle}>{title}</span>
        <span className={`${styles.collapseCaret} ${isOpen ? styles.collapseCaretOpen : ""}`}>?</span>
      </button>
      <div className={`${styles.collapseBody} ${isOpen ? styles.collapseBodyOpen : ""}`}>{children}</div>
    </section>
  );
};

const MoodSelector = ({ selectedMood, onSelect }) => (
  <div className={styles.moodGrid}>
    {MOODS.map((mood) => (
      <button
        key={mood}
        type="button"
        className={`${styles.moodButton} ${selectedMood === mood ? styles.moodButtonActive : ""}`}
        onClick={() => onSelect(mood)}
      >
        {mood}
      </button>
    ))}
  </div>
);

const SymptomChips = ({ categories, selectedSymptoms, onToggle }) => (
  <div className={styles.categoriesWrapper}>
    {categories.map(({ title, items }) => (
      <div className={styles.categoryBlock} key={title}>
        <p className={styles.categoryTitle}>{title}</p>
        <div className={styles.chipsRow}>
          {items.map((label) => {
            const isSelected = selectedSymptoms.includes(label);
            return (
              <button
                key={label}
                type="button"
                className={`${styles.chip} ${styles.chipAnimated} ${isSelected ? styles.chipActive : ""}`}
                onClick={() => onToggle(label)}
                aria-pressed={isSelected}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const FlowSelector = ({ selectedFlow, onChange }) => (
  <SegmentedControl options={FLOW_OPTIONS} selectedValue={selectedFlow} onChange={onChange} ariaLabel="Flow" />
);

const SymptomsPage = () => {
  const savedDraft = useMemo(() => readDraft(), []);

  const [mode, setMode] = useState(localStorage.getItem(MODE_STORAGE_KEY) ?? "TrackHealthOnly");
  const [modeSaving, setModeSaving] = useState(false);
  const [modeStatus, setModeStatus] = useState("");
  const [mood, setMood] = useState(savedDraft?.mood ?? MOODS[0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState(savedDraft?.selectedSymptoms ?? []);
  const [flow, setFlow] = useState(savedDraft?.flow ?? "Light");
  const [painLevel, setPainLevel] = useState(savedDraft?.painLevel ?? 3);
  const [notes, setNotes] = useState(savedDraft?.notes ?? "");
  const [advanced, setAdvanced] = useState(savedDraft?.advanced ?? advancedDefaults);
  const [saveStatus, setSaveStatus] = useState("");

  const getPainEmoji = (level) => {
    if (level <= 2) return ":)";
    if (level <= 4) return ":|";
    if (level <= 6) return ":/";
    if (level <= 8) return ":(";
    return ">:(";
  };

  const currentPainEmoji = getPainEmoji(painLevel);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom]));
  };

  const handleModeChange = async (nextMode) => {
    setMode(nextMode);
    setModeSaving(true);
    setModeStatus("");
    localStorage.setItem(MODE_STORAGE_KEY, nextMode);

    try {
      await updateConceptionMode(nextMode);
      setModeStatus("Mode updated");
    } catch {
      setModeStatus("Unable to update mode");
    } finally {
      setModeSaving(false);
    }
  };

  const updateAdvanced = (key, value) => {
    setAdvanced((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAdvancedMulti = (key, value) => {
    setAdvanced((prev) => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
      };
    });
  };

  const selectSingleArray = (key, value) => {
    setAdvanced((prev) => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      return { ...prev, [key]: current[0] === value ? [] : [value] };
    });
  };

  useEffect(() => {
    localStorage.setItem(
      SYMPTOMS_DRAFT_KEY,
      JSON.stringify({
        mood,
        selectedSymptoms,
        flow,
        painLevel,
        notes,
        advanced,
      })
    );
  }, [mood, selectedSymptoms, flow, painLevel, notes, advanced]);

  const handleSave = () => {
    localStorage.setItem(
      SYMPTOMS_DRAFT_KEY,
      JSON.stringify({
        mood,
        selectedSymptoms,
        flow,
        painLevel,
        notes,
        advanced,
      })
    );
    setSaveStatus("Entry saved locally");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  return (
    <main className={`page ${styles.symptomsRoot}`}>
      <div className={styles.content}>
        <header className={styles.headerCard}>
          <p className={styles.title}>Symptoms</p>
          <p className={styles.subtitle}>Log what matters today</p>

          <div className={styles.headerMeta}>
            <p><b>Day 12 - Luteal Phase</b></p>
          </div>
        </header>

        <section className={styles.card}>
          <p className={styles.sectionTitle}>Conception Mode</p>
          <div className={styles.modeControl} role="tablist" aria-label="Conception Mode">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={mode === option.value}
                className={`${styles.modeButton} ${mode === option.value ? styles.modeButtonActive : ""}`}
                onClick={() => handleModeChange(option.value)}
                disabled={modeSaving}
              >
                {option.label}
              </button>
            ))}
          </div>
          {modeStatus ? <p className={styles.modeStatus}>{modeStatus}</p> : null}
        </section>

        <section className={styles.card}>
          <p className={styles.sectionTitle}>How are you feeling?</p>
          <MoodSelector selectedMood={mood} onSelect={setMood} />
        </section>

        <section className={styles.card}>
          <p className={styles.sectionTitle}>Symptoms</p>
          <p className={styles.sectionSubtitle}>Select anything you noticed today</p>
          <SymptomChips categories={SYMPTOM_CATEGORIES} selectedSymptoms={selectedSymptoms} onToggle={toggleSymptom} />
        </section>

        <CollapsibleSection title="Cervical Fluid" isEmpty={!advanced.cervicalFluid}>
          <SelectableChips
            options={CERVICAL_FLUID_OPTIONS}
            selectedValues={advanced.cervicalFluid}
            onSelect={(value) => updateAdvanced("cervicalFluid", value)}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Ovulation Test Result" isEmpty={advanced.ovulationTestResult === "Not Taken"}>
          <SegmentedControl
            options={OVULATION_TEST_OPTIONS}
            selectedValue={advanced.ovulationTestResult}
            onChange={(value) => updateAdvanced("ovulationTestResult", value)}
            ariaLabel="Ovulation test result"
          />
        </CollapsibleSection>

        <CollapsibleSection title="Breast Changes" isEmpty={advanced.breastSymptoms.length === 0}>
          <SelectableChips
            options={BREAST_CHANGES_OPTIONS}
            selectedValues={advanced.breastSymptoms}
            onSelect={(value) => toggleAdvancedMulti("breastSymptoms", value)}
            multi
          />
        </CollapsibleSection>

        <CollapsibleSection title="Vaginal Health" isEmpty={advanced.vaginalHealth.length === 0}>
          <SelectableChips
            options={VAGINAL_HEALTH_OPTIONS}
            selectedValues={advanced.vaginalHealth}
            onSelect={(value) => toggleAdvancedMulti("vaginalHealth", value)}
            multi
          />
        </CollapsibleSection>

        <CollapsibleSection title="Digestive Changes" isEmpty={advanced.digestiveSymptoms.length === 0}>
          <SelectableChips
            options={DIGESTIVE_CHANGES_OPTIONS}
            selectedValues={advanced.digestiveSymptoms}
            onSelect={(value) => toggleAdvancedMulti("digestiveSymptoms", value)}
            multi
          />
        </CollapsibleSection>

        <CollapsibleSection title="Skin Changes" isEmpty={advanced.skinChanges.length === 0}>
          <SelectableChips
            options={SKIN_CHANGES_OPTIONS}
            selectedValues={advanced.skinChanges}
            onSelect={(value) => toggleAdvancedMulti("skinChanges", value)}
            multi
          />
        </CollapsibleSection>

        <CollapsibleSection title="Hair Changes" isEmpty={advanced.hairChanges.length === 0}>
          <SelectableChips
            options={HAIR_CHANGES_OPTIONS}
            selectedValues={advanced.hairChanges}
            onSelect={(value) => toggleAdvancedMulti("hairChanges", value)}
            multi
          />
        </CollapsibleSection>

        <CollapsibleSection title="Cognitive State" isEmpty={advanced.cognitiveState.length === 0}>
          <SelectableChips
            options={COGNITIVE_STATE_OPTIONS}
            selectedValues={advanced.cognitiveState}
            onSelect={(value) => selectSingleArray("cognitiveState", value)}
            multi
          />
        </CollapsibleSection>

        <CollapsibleSection title="Social Behavior" isEmpty={advanced.socialBehavior.length === 0}>
          <SelectableChips
            options={SOCIAL_BEHAVIOR_OPTIONS}
            selectedValues={advanced.socialBehavior}
            onSelect={(value) => selectSingleArray("socialBehavior", value)}
            multi
          />
        </CollapsibleSection>

        <CollapsibleSection title="Libido Level" isEmpty={advanced.libidoLevel === 2}>
          <SliderControl
            min={0}
            max={4}
            value={advanced.libidoLevel}
            onChange={(value) => updateAdvanced("libidoLevel", value)}
            leftLabel="Very Low"
            rightLabel="Very High"
            valueLabel={`${advanced.libidoLevel}/4`}
            ariaLabel="Libido level"
          />
        </CollapsibleSection>

        <CollapsibleSection title="Pelvic Pain Zones" isEmpty={advanced.pelvicPainZones.length === 0}>
          <SelectableChips
            options={PELVIC_PAIN_ZONES_OPTIONS}
            selectedValues={advanced.pelvicPainZones}
            onSelect={(value) => toggleAdvancedMulti("pelvicPainZones", value)}
            multi
          />
        </CollapsibleSection>

        <CollapsibleSection title="Period Medication Taken" isEmpty={advanced.periodMedication.length === 0}>
          <SelectableChips
            options={PERIOD_MEDICATION_OPTIONS}
            selectedValues={advanced.periodMedication}
            onSelect={(value) => toggleAdvancedMulti("periodMedication", value)}
            multi
          />
        </CollapsibleSection>

        <CollapsibleSection title="Allergy Symptoms" isEmpty={advanced.allergySymptoms.length === 0}>
          <SelectableChips
            options={ALLERGY_SYMPTOMS_OPTIONS}
            selectedValues={advanced.allergySymptoms}
            onSelect={(value) => toggleAdvancedMulti("allergySymptoms", value)}
            multi
          />
        </CollapsibleSection>

        <CollapsibleSection title="Allergy Trigger" isEmpty={advanced.allergyTrigger === "Unknown"}>
          <SegmentedControl
            options={ALLERGY_TRIGGER_OPTIONS}
            selectedValue={advanced.allergyTrigger}
            onChange={(value) => updateAdvanced("allergyTrigger", value)}
            ariaLabel="Allergy trigger"
          />
        </CollapsibleSection>

        <CollapsibleSection title="Spotting" isEmpty={!advanced.spotting}>
          <ToggleSwitch
            label="Spotting detected today"
            checked={advanced.spotting}
            onChange={(value) => updateAdvanced("spotting", value)}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Pregnancy Indicators" isEmpty={advanced.pregnancyIndicators.length === 0}>
          <SelectableChips
            options={PREGNANCY_INDICATORS_OPTIONS}
            selectedValues={advanced.pregnancyIndicators}
            onSelect={(value) => toggleAdvancedMulti("pregnancyIndicators", value)}
            multi
          />
        </CollapsibleSection>

        <section className={styles.card}>
          <p className={styles.sectionTitle}>Flow</p>
          <FlowSelector selectedFlow={flow} onChange={setFlow} />
        </section>

        <section className={styles.card}>
          <div className={styles.painHeader}>
            <span>{currentPainEmoji} Pain Level</span>
            <span>{painLevel}</span>
          </div>
          <div className={styles.painSliderWrapper}>
            <input
              type="range"
              min="0"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className={`${styles.slider} ${styles.painSlider}`}
              aria-label="Pain level slider"
            />
          </div>
        </section>

        <section className={styles.card}>
          <p className={styles.sectionTitle}>Notes</p>
          <textarea
            className={styles.notesArea}
            placeholder="Add anything you want to remember..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        <div className={styles.footerAction}>
          {saveStatus ? <p className={styles.saveStatus}>{saveStatus}</p> : null}
          <button className={styles.saveButton} type="button" onClick={handleSave}>
            Save Entry
          </button>
        </div>
      </div>
    </main>
  );
};

export default SymptomsPage;
