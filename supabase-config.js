const supabaseUrl = 'https://xxqyareohehpwfsxdnbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXlhcmVvaGVocHdmc3hkbmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODkwNDgsImV4cCI6MjA1NjI2NTA0OH0.LhfgV84xufdxrlF1TMY5nLgZ5M661PdcpmRWO_VDwD8';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

async function submitScore(initials, score, email) {
  try {
    const { error } = await supabaseClient
      .from('leaderboard')
      .insert([{ initials: initials, score: score, email: email }]);
    if (error) throw error;
  } catch (error) {
    console.error('Error submitting score:', error);
  }
}

async function getLeaderboard() {
  try {
    const { data, error } = await supabaseClient
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

async function getTotalSaved() {
  try {
    const { data, error } = await supabaseClient
      .from('leaderboard')
      .select('score');
    if (error) throw error;
    const total = data.reduce((sum, entry) => sum + entry.score, 0);
    return total;
  } catch (error) {
    console.error('Error getting total saved:', error);
    return 0;
  }
}