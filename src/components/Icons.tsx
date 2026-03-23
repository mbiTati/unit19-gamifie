import { BookOpen, Layers, GitBranch, Route, FileText, Shield, Building2, Puzzle, Link2, TreePine, Bug, BarChart3, Gauge, Scale, Crown, Gamepad2, GraduationCap, FileDown, ChevronDown, ChevronUp, Zap, Trophy, Brain, Target, Wrench, ArrowLeft, Play, RotateCcw, Timer, Lock, Eye, MessageSquare, Factory, Blocks, Plug, ChevronRight, Server, Hash, ListTree, Search, Code2, Calculator, FlaskConical, Bike, Building, HardDrive, Cpu, Database, Network, Workflow, Binary, TestTube, AlertTriangle, CheckCircle, XCircle, Lightbulb, Skull, Swords, Flag, Settings, Microscope, Pencil, Castle, ScrollText, Rocket, FolderOpen, Users, Clock, Monitor, Shuffle, ArrowDown } from "lucide-react";

// Professional icon mapping - replaces emojis throughout the app
export const ICONS = {
  // Worlds
  world1: Layers,
  world2: ScrollText, 
  world3: Code2,
  world4: BarChart3,
  
  // Chapter types
  quiz: Brain,
  simulator: Monitor,
  race: Zap,
  builder: Blocks,
  debug: Bug,
  boss: Skull,
  
  // Navigation
  back: ArrowLeft,
  next: ChevronRight,
  down: ChevronDown,
  up: ChevronUp,
  play: Play,
  reset: RotateCcw,
  
  // Content
  book: BookOpen,
  code: Code2,
  tree: TreePine,
  link: Link2,
  hash: Hash,
  search: Search,
  sort: Shuffle,
  
  // Status
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  hint: Lightbulb,
  trophy: Trophy,
  target: Target,
  flag: Flag,
  
  // Actions
  download: FileDown,
  file: FileText,
  settings: Settings,
  wrench: Wrench,
  test: TestTube,
  flask: FlaskConical,
  
  // Concepts
  lock: Lock,
  shield: Shield,
  eye: Eye,
  factory: Factory,
  plug: Plug,
  network: Network,
  workflow: Workflow,
  binary: Binary,
  database: Database,
  cpu: Cpu,
  server: Server,
  gauge: Gauge,
  scale: Scale,
  calculator: Calculator,
  timer: Timer,
  
  // People/Places
  building: Building2,
  bike: Bike,
  graduation: GraduationCap,
  gamepad: Gamepad2,
  crown: Crown,
  users: Users,
  
  // Misc
  puzzle: Puzzle,
  rocket: Rocket,
  microscope: Microscope,
  pencil: Pencil,
  castle: Castle,
  folder: FolderOpen,
  clock: Clock,
  message: MessageSquare,
  listTree: ListTree,
  hardDrive: HardDrive,
};

export type IconName = keyof typeof ICONS;
