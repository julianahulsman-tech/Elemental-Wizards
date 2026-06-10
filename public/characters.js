// Client helper for character CRUD operations
(function(exports){
  async function listCharacters(user){
    try{
      const res = await fetch('/api/characters/' + encodeURIComponent(user));
      if(!res.ok) return [];
      const j = await res.json();
      return j.characters || [];
    }catch(e){ console.error('listCharacters', e); return []; }
  }

  async function createCharacter(user, char){
    try{
      const res = await fetch('/api/characters/' + encodeURIComponent(user), {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(char)
      });
      if(!res.ok) throw new Error('create failed');
      return await res.json();
    }catch(e){ console.error('createCharacter', e); throw e; }
  }

  async function getCharacter(user, id){
    try{
      const res = await fetch('/api/characters/' + encodeURIComponent(user) + '/' + encodeURIComponent(id));
      if(!res.ok) return null;
      return await res.json();
    }catch(e){ console.error('getCharacter', e); return null; }
  }

  async function updateCharacter(user, id, update){
    try{
      const res = await fetch('/api/characters/' + encodeURIComponent(user) + '/' + encodeURIComponent(id), {
        method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(update)
      });
      if(!res.ok) throw new Error('update failed');
      return await res.json();
    }catch(e){ console.error('updateCharacter', e); throw e; }
  }

  async function deleteCharacter(user, id){
    try{
      const res = await fetch('/api/characters/' + encodeURIComponent(user) + '/' + encodeURIComponent(id), { method:'DELETE' });
      return res.ok;
    }catch(e){ console.error('deleteCharacter', e); return false; }
  }

  window.EWCharacters = { listCharacters, createCharacter, getCharacter, updateCharacter, deleteCharacter };
})(this);
