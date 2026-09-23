import { 
  Scholarship, 
  StudentProfile, 
  ConflictRule, 
  EligibilityResult, 
  ActiveRouteAnalysis,
  SafeRoute,
  GraphNode,
  GraphEdge
} from '../types';
import { DEMO_SCHOLARSHIPS } from '../data/scholarships';
import { INITIAL_CONFLICT_RULES } from '../data/conflictRules';
import { DEMO_STUDENT_AARAV } from '../data/demoStudents';
import { checkScholarshipEligibility } from '../algorithms/eligibilityEngine';
import { analyzeSelectedRoute } from '../algorithms/conflictEngine';
import { generateOptimizedRoutes, RouteOptimizationResult } from '../algorithms/routeOptimizer';

// Mock storage in-memory with localStorage synchronization
const STORAGE_KEY_RULES = 'scholarmatch_rules_v1';
const STORAGE_KEY_SAVED = 'scholarmatch_saved_v1';

function getStoredRules(): ConflictRule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RULES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading rules from storage', e);
  }
  return INITIAL_CONFLICT_RULES;
}

function saveRulesToStore(rules: ConflictRule[]) {
  try {
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
  } catch (e) {
    console.error('Failed writing rules to storage', e);
  }
}

/**
 * Clean Service API Layer
 */
export const ApiService = {
  // GET /api/scholarships
  async getScholarships(query?: string, filters?: any): Promise<Scholarship[]> {
    await new Promise(r => setTimeout(r, 100)); // slight async simulation
    let list = [...DEMO_SCHOLARSHIPS];

    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.provider.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.benefits.toLowerCase().includes(q)
      );
    }

    if (filters) {
      if (filters.state && filters.state !== 'All') {
        list = list.filter(s => s.state === 'All India' || s.state === filters.state);
      }
      if (filters.providerType && filters.providerType !== 'All') {
        list = list.filter(s => s.providerType === filters.providerType);
      }
      if (filters.category && filters.category !== 'All') {
        list = list.filter(s => s.categoryEligibility.includes(filters.category as any));
      }
      if (filters.maxIncome && filters.maxIncome > 0) {
        list = list.filter(s => s.incomeLimit === 0 || s.incomeLimit >= filters.maxIncome);
      }
    }

    return list;
  },

  // GET /api/scholarships/:id
  async getScholarshipById(id: string): Promise<Scholarship | undefined> {
    await new Promise(r => setTimeout(r, 50));
    return DEMO_SCHOLARSHIPS.find(s => s.id === id);
  },

  // POST /api/profile
  async saveProfile(profile: StudentProfile): Promise<StudentProfile> {
    await new Promise(r => setTimeout(r, 150));
    return profile;
  },

  // GET /api/profile/:id
  async getProfile(id: string): Promise<StudentProfile> {
    await new Promise(r => setTimeout(r, 50));
    return DEMO_STUDENT_AARAV;
  },

  // POST /api/match
  async matchScholarships(profile: StudentProfile): Promise<{ scholarship: Scholarship; result: EligibilityResult }[]> {
    await new Promise(r => setTimeout(r, 200));
    return DEMO_SCHOLARSHIPS.map(scholarship => ({
      scholarship,
      result: checkScholarshipEligibility(profile, scholarship)
    })).sort((a, b) => b.result.score - a.result.score);
  },

  // POST /api/check-conflicts
  async checkConflicts(selectedIds: string[], rules?: ConflictRule[]): Promise<ActiveRouteAnalysis> {
    await new Promise(r => setTimeout(r, 100));
    const activeRules = rules || getStoredRules();
    const selected = DEMO_SCHOLARSHIPS.filter(s => selectedIds.includes(s.id));
    return analyzeSelectedRoute(selected, DEMO_SCHOLARSHIPS, activeRules);
  },

  // GET /api/recommendations/:userId
  async getRecommendations(profile: StudentProfile, rules?: ConflictRule[]): Promise<RouteOptimizationResult> {
    await new Promise(r => setTimeout(r, 250));
    const activeRules = rules || getStoredRules();
    return generateOptimizedRoutes(profile, DEMO_SCHOLARSHIPS, activeRules);
  },

  // GET /api/rules
  async getRules(): Promise<ConflictRule[]> {
    await new Promise(r => setTimeout(r, 80));
    return getStoredRules();
  },

  // POST /api/rules
  async saveRule(rule: ConflictRule): Promise<ConflictRule[]> {
    await new Promise(r => setTimeout(r, 100));
    const current = getStoredRules();
    const idx = current.findIndex(r => r.id === rule.id);
    let updated: ConflictRule[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = rule;
    } else {
      updated = [rule, ...current];
    }
    saveRulesToStore(updated);
    return updated;
  },

  // Toggle rule status
  async toggleRuleActive(ruleId: string): Promise<ConflictRule[]> {
    const current = getStoredRules();
    const updated = current.map(r => r.id === ruleId ? { ...r, active: !r.active } : r);
    saveRulesToStore(updated);
    return updated;
  },

  // GET /api/conflict-graph
  async getConflictGraphData(rules?: ConflictRule[]): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const activeRules = (rules || getStoredRules()).filter(r => r.active);
    
    // Create nodes for top scholarships
    const nodes: GraphNode[] = DEMO_SCHOLARSHIPS.map((s, i) => {
      // Calculate circular layout coordinates for crisp visual presentation
      const angle = (i / DEMO_SCHOLARSHIPS.length) * 2 * Math.PI;
      const radius = 220;
      return {
        id: s.id,
        label: s.code || s.name.substring(0, 18) + '...',
        provider: s.provider,
        type: s.providerType,
        amount: s.awardAmount,
        eligibility: 85,
        x: Math.round(350 + radius * Math.cos(angle)),
        y: Math.round(280 + radius * Math.sin(angle))
      };
    });

    const edges: GraphEdge[] = activeRules.map(r => ({
      id: `edge-${r.id}`,
      source: r.scholarshipAId,
      target: r.scholarshipBId,
      relationship: r.relationship,
      severity: r.severity,
      reason: r.reason
    }));

    return { nodes, edges };
  }
};
