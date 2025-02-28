// Initialize Supabase client
const supabaseClient = supabase.createClient(
  'https://xxqyareohehpwfsxdnbk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXlhcmVvaGVocHdmc3hkbmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODkwNDgsImV4cCI6MjA1NjI2NTA0OH0.LhfgV84xufdxrlF1TMY5nLgZ5M661PdcpmRWO_VDwD8'
);

// Leaderboard functions
async function submitScore(initials, email, score) {
  console.log('Attempting to submit score:', { initials, email, score });
  
  try {
    // Validate data before sending
    if (!initials || initials.length > 3) {
      throw new Error('Invalid initials');
    }
    
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    if (typeof score !== 'number' || score < 0) {
      throw new Error('Invalid score');
    }

    // Format data
    const formattedData = {
      initials: initials.toUpperCase().slice(0, 3),
      email: email.toLowerCase().trim(),
      score: Math.floor(score)
    };

    console.log('Submitting formatted data:', formattedData);

    // Submit to Supabase
    const { data, error } = await supabaseClient
      .from('leaderboard')
      .insert([formattedData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Score submitted successfully:', data);
    return true;

  } catch (error) {
    console.error('Error in submitScore:', error.message);
    return false;
  }
}

async function getTopScores(limit = 10) {
  try {
    console.log('Fetching top scores...');
    
    const { data, error } = await supabaseClient
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }

    console.log('Retrieved scores:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getTopScores:', error.message);
    return [];
  }
} 