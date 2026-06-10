// Simple client helper to save/load player progress to the local backend
(function(exports){
  async function saveProgress(id, progress){
    try{
      const res = await fetch('/api/progress', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ id, progress })
      });
      return await res.json();
    }catch(e){ console.error('saveProgress error', e); throw e; }
  }

  async function loadProgress(id){
    try{
      const res = await fetch('/api/progress/' + encodeURIComponent(id));
      if(!res.ok) return null;
      const j = await res.json();
      return j.progress;
    }catch(e){ console.error('loadProgress error', e); return null; }
  }

  // expose globally
  window.EWProgress = { saveProgress, loadProgress };
})(this);
