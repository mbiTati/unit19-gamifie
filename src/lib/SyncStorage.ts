import { supabase } from './supabase';

let _studentId: string | null = null;
let _syncEnabled = false;

export function initSyncStorage(studentId: string) {
  _studentId = studentId;
  _syncEnabled = !!studentId;
}

export function setupSyncStorage() {
  if (typeof window === 'undefined') return;
  const origSet = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function(key: string, value: string) {
    origSet(key, value);
    syncToSupabase(key, value);
  };
}

function keyToModuleCode(key: string): string | null {
  const match = key.match(/^u19-(ch\d+)/i);
  if (!match) return null;
  return match[1].toUpperCase();
}

async function getModuleId(moduleCode: string) {
  const { data } = await supabase
    .from('cq_modules')
    .select('id')
    .eq('code', moduleCode)
    .single();
  return data?.id || null;
}

async function syncToSupabase(key: string, value: string) {
  if (!_syncEnabled || !_studentId) return;
  const moduleCode = keyToModuleCode(key);
  if (!moduleCode) return;

  try {
    const data = JSON.parse(value);
    const moduleId = await getModuleId(moduleCode);
    if (!moduleId) return;

    await supabase.from('cq_student_progress').upsert({
      student_id: _studentId,
      module_id: moduleId,
      completed_steps: data.completedSteps || {},
      quiz_score: data.score || 0,
      total_questions: data.total || 0,
      credits: data.credits || 0,
      completed: data.completed || false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'student_id,module_id' });
  } catch (e) {
    console.error('Sync error:', e);
  }
}

export async function loadFromSupabase(studentId: string): Promise<void> {
  if (!studentId) return;
  const { data } = await supabase
    .from('cq_student_progress')
    .select('*, cq_modules(code)')
    .eq('student_id', studentId);
  if (!data) return;

  for (const row of data) {
    const code = (row as any).cq_modules?.code;
    if (!code) continue;
    const key = `u19-${code.toLowerCase()}`;
    const existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, JSON.stringify({
        completedSteps: row.completed_steps || {},
        score: row.quiz_score || 0,
        total: row.total_questions || 0,
        credits: row.credits || 0,
        completed: row.completed || false,
      }));
    }
  }
}
