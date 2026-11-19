import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Input } from '../../components/ui';
import { SampleTask } from '../../data/sampleTasks';
import { X, Tag, CheckCircle2, AlertCircle, History } from 'lucide-react';
import {
  getTodayDateString,
  getSevenDaysAgoDateString,
  getCurrentTimeString,
  getDefaultDueTime,
  validateChronologicalDeadline,
} from '../../utils/dateUtils';

export interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask?: (task: SampleTask) => void;
  initialDueDate?: string;
  initialDueTime?: string;
}

export const TaskCreateModal: React.FC<TaskCreateModalProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  initialDueDate,
  initialDueTime,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => initialDueDate || getTodayDateString());
  const [dueTime, setDueTime] = useState(() => initialDueTime || getDefaultDueTime());
  const [isBackdated, setIsBackdated] = useState(false);
  const [startDate, setStartDate] = useState(() => getTodayDateString());
  const [startTime, setStartTime] = useState(() => getCurrentTimeString());
  const [priority, setPriority] = useState<'high' | 'medium' | 'low' | ''>('medium');
  const [category, setCategory] = useState<'personal' | 'home' | 'work'>('personal');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const todayStr = getTodayDateString();
  const sevenDaysAgoStr = getSevenDaysAgoDateString();
  const currentTimeStr = getCurrentTimeString();

  // Compute live validation using useMemo
  const validation = useMemo(() => {
    return validateChronologicalDeadline({
      dueDate,
      dueTime,
      isBackdated,
      startDate,
      startTime,
    });
  }, [dueDate, dueTime, isBackdated, startDate, startTime]);

  const isFormValid = Boolean(title.trim()) && validation.isValid;

  const isSelectedDateToday = dueDate === todayStr;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setSubmittedNotice(false);

      const today = getTodayDateString();
      if (!dueDate) {
        setDueDate(today);
      }
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdateToggle = (checked: boolean) => {
    setIsBackdated(checked);
    if (checked) {
      // Default backdate start date to yesterday or today if not set
      if (!startDate) {
        setStartDate(getTodayDateString());
      }
      if (!startTime) {
        setStartTime('09:00');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !validation.isValid) return;

    const newTask: SampleTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: validation.effectiveDueDate,
      dueTime: validation.effectiveDueTime,
      priority: (priority as 'high' | 'medium' | 'low') || undefined,
      state: 'active',
      category,
      createdAt: validation.effectiveCreatedAt,
      checkpoints: [
        {
          id: `cp-${Date.now()}`,
          timestamp: validation.effectiveCreatedAt,
          note: isBackdated
            ? 'Task initialized in workspace (retrospective entry).'
            : 'Task initialized in workspace.',
        },
      ],
    };

    setSubmittedNotice(true);
    onCreateTask?.(newTask);

    // Reset inputs
    setTitle('');
    setDescription('');
    setIsBackdated(false);
    setStartDate(getTodayDateString());
    setStartTime(getCurrentTimeString());
    setDueDate(getTodayDateString());
    setDueTime(getDefaultDueTime());
    setPriority('medium');
    setCategory('personal');

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close create task modal"
          className="absolute top-5 right-5 text-[var(--muted)] hover:text-[var(--ink)] p-1 rounded-lg hover:bg-[var(--canvas)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="create-task-title" className="text-xl font-bold text-[var(--ink)]">
          Create New Task
        </h2>
        <p className="text-xs text-[var(--muted)] mt-1 mb-5">
          Define exact deadlines and chronological ownership for your next responsibility.
        </p>

        {submittedNotice && (
          <div className="mb-5 p-3.5 rounded-xl bg-[var(--green-soft)] border border-[var(--green)]/30 text-xs text-[var(--green)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">
              Task successfully saved to your workspace.
            </p>
          </div>
        )}

        {validation.generalError && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-[var(--red-soft)] border border-[var(--red)]/30 text-xs text-[var(--red)] flex items-start gap-2.5 animate-in fade-in duration-150"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Invalid Chronological Combination</p>
              <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">{validation.generalError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={titleInputRef}
            label="Task Title *"
            required
            placeholder="e.g., Finalize customer onboarding slide deck"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add key context, requirements, or links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-[var(--surface)] text-[var(--ink)] placeholder-[var(--faint)] border border-[var(--line)] rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1 resize-none"
            />
          </div>

          {/* Backdate Start Option (1-Week Grace Period) */}
          <div className="p-3 bg-[var(--canvas)] border border-[var(--line)] rounded-xl space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                aria-label="Backdate task start"
                checked={isBackdated}
                onChange={(e) => handleBackdateToggle(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--line)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
              />
              <span className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[var(--muted)]" />
                Backdate task start (1-week grace period for retrospective logging)
              </span>
            </label>

            {isBackdated ? (
              <div className="pt-2 border-t border-[var(--line)] space-y-2 animate-in fade-in duration-150">
                <p className="text-[11px] text-[var(--muted)]">
                  Log work that started within the last 7 days. Dates older than {sevenDaysAgoStr} are blocked.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Started Date *"
                    type="date"
                    required
                    min={sevenDaysAgoStr}
                    max={todayStr}
                    value={startDate}
                    error={validation.startError}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Input
                    label="Started Time (Optional)"
                    type="time"
                    value={startTime}
                    helperText="Defaults to 00:00 if omitted"
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-[var(--muted)] pl-6">
                Starts automatically at current time ({todayStr} {currentTimeStr}).
              </p>
            )}
          </div>

          {/* Target Due Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Target Due Date *"
              type="date"
              required
              min={isBackdated ? startDate || sevenDaysAgoStr : sevenDaysAgoStr}
              value={dueDate}
              error={validation.dateError}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <Input
              label="Due Time (Optional)"
              type="time"
              value={dueTime}
              error={validation.timeError}
              helperText={
                isSelectedDateToday && !isBackdated
                  ? `Must be after ${currentTimeStr} (defaults to 11:59 PM if omitted)`
                  : 'Defaults to 11:59 PM if omitted'
              }
              onChange={(e) => setDueTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-[var(--faint)]" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded-lg focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <option value="personal">Personal</option>
                <option value="home">Household / Living</option>
                <option value="work">Work / Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded-lg focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--line)] flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!isFormValid}
              aria-label="Create Task"
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
