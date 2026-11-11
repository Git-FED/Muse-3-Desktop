const switcher = document.getElementById('switcher');
const status = document.getElementById('status');
const tabs = [];
function buildTabs(slots) { switcher.replaceChildren(); slots.forEach((slot, index) => { const button=document.createElement('button'); button.className='tab'; button.innerHTML=`<span class="dot"></span><span>${slot.label}</span>`; button.addEventListener('click',()=>window.desktopBuddy.selectSlot(index)); switcher.appendChild(button); tabs.push(button); }); }
function setActive(index, label) { tabs.forEach((tab,i)=>tab.classList.toggle('active',i===index)); status.textContent=label; }
window.desktopBuddy.getState().then(state=>{ buildTabs(state.slots); setActive(state.currentIndex,state.slots[state.currentIndex].label); });
window.desktopBuddy.onSlotSelected(value=>setActive(value.index,value.label));
window.desktopBuddy.onSlotLoadState(value=>{ if(value.loading) document.body.classList.add('loading'); else document.body.classList.remove('loading'); });
document.getElementById('back').addEventListener('click',()=>window.desktopBuddy.navigateSlot('back'));
document.getElementById('forward').addEventListener('click',()=>window.desktopBuddy.navigateSlot('forward'));
document.getElementById('reload').addEventListener('click',()=>window.desktopBuddy.reloadSlot());
