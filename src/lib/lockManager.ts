import { supabase, isSupabaseConfigured } from './supabase';

let _locks: Record<string, boolean> = {};
let _loaded = false;
let _isTeacher = false;

export async function loadLocks() {
  if (!isSupabaseConfigured || _loaded) return _locks;
  const { data } = await supabase.from("cq_locks").select("*");
  if (data) data.forEach((r: any) => { _locks[r.section] = r.locked; });
  _loaded = true;
  return _locks;
}

export function setTeacher(val: boolean) { _isTeacher = val; }

export function isLocked(section: string): boolean {
  if (_isTeacher) return false; // prof sees everything
  return _locks[section] === true;
}

export function getLocks() { return _locks; }
