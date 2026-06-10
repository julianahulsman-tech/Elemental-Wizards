// Client helper for friends management
(function(exports){
  async function getFriends(user){
    try{
      const res = await fetch('/api/friends/' + encodeURIComponent(user));
      if(!res.ok) return { list: [], pending: [] };
      return await res.json();
    }catch(e){ console.error('getFriends', e); return { list: [], pending: [] }; }
  }

  async function sendFriendRequest(user, target){
    try{
      const res = await fetch('/api/friends/' + encodeURIComponent(user) + '/request', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ target })
      });
      return res.ok;
    }catch(e){ console.error('sendFriendRequest', e); return false; }
  }

  async function acceptFriendRequest(user, from){
    try{
      const res = await fetch('/api/friends/' + encodeURIComponent(user) + '/accept', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ from })
      });
      return res.ok;
    }catch(e){ console.error('acceptFriendRequest', e); return false; }
  }

  async function declineFriendRequest(user, from){
    try{
      const res = await fetch('/api/friends/' + encodeURIComponent(user) + '/decline', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ from })
      });
      return res.ok;
    }catch(e){ console.error('declineFriendRequest', e); return false; }
  }

  async function removeFriend(user, friend){
    try{
      const res = await fetch('/api/friends/' + encodeURIComponent(user) + '/' + encodeURIComponent(friend), { method:'DELETE' });
      return res.ok;
    }catch(e){ console.error('removeFriend', e); return false; }
  }

  window.EWFriends = { getFriends, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend };
})(this);
