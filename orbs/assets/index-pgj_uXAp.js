var Nm=Object.defineProperty;var Fm=(i,e,t)=>e in i?Nm(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var Ft=(i,e,t)=>Fm(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const ph=7,Sf=i=>i%2===0?8:9,cn=i=>`${i.c},${i.r}`,ra=(i,e)=>i.c===e.c&&i.r===e.r;function wf(i){return i.r>=0&&i.r<ph&&i.c>=0&&i.c<Sf(i.r)}const Ro=i=>2*i.c+(i.r%2===0?1:0),Bm=(i,e)=>({c:(i-(e%2===0?1:0))/2,r:e});function Qn(i,e){const t=Math.abs(i.r-e.r),n=Math.abs(Ro(i)-Ro(e));return t+Math.max(0,(n-t)/2)}const zm=[[2,0],[-2,0],[1,1],[-1,1],[1,-1],[-1,-1]];function ol(i){const e=Ro(i),t=[];for(const[n,s]of zm){const r=Bm(e+n,i.r+s);wf(r)&&t.push(r)}return t}const aa=(()=>{const i=[];for(let e=0;e<ph;e++)for(let t=0;t<Sf(e);t++)i.push({c:t,r:e});return i})(),lu=1;function ms(i){const e=Math.sqrt(3)*lu,t=(Ro(i)/2-4)*e,n=(3-i.r)*1.5*lu;return{x:t,z:n}}const Ts=i=>i===0?[0,1]:[5,6],Hm=i=>i===0?0:ph-1,Vm=i=>Hm(1-i),mh=(i,e)=>Ts(1-i).includes(e.r),Co=(i,e,t)=>e>1?mh(i,t):t.r===Vm(i),Gm=i=>i===0?[0,1,2,3]:[3,4,5,6],ya=[{c:1,r:3},{c:4,r:3},{c:7,r:3}],gh=i=>ya.some(e=>ra(e,i)),$m={c:4,r:3},vh=i=>ra($m,i),Fs=(i="Choose a friendly unit")=>({kind:"unit",side:"friendly",prompt:i}),rs=(i="Choose an enemy unit")=>({kind:"unit",side:"enemy",prompt:i}),kr=(i="Choose a unit")=>({kind:"unit",side:"any",prompt:i}),lc=i=>i&&"c"in i?{c:i.c,r:i.r}:void 0,Wm=(i,e,t,n)=>{const s=lc(n[0]);return!!s&&Qn(s,e)===1},Mf=[{id:"e_spark_imp",name:"Spark Imp",color:"ember",type:"unit",cost:1,atk:2,hp:1,kw:["swift"],icon:"👺",text:"",flavor:"It has never once considered the consequences."},{id:"e_cinder_scout",name:"Cinder Scout",color:"ember",type:"unit",cost:1,atk:1,hp:2,speed:3,icon:"🏃",text:"Arrival: Deal 1 damage to the enemy Sanctum.",onPlay:(i,{p:e})=>i.damageSanctum(1-e,1)},{id:"e_firebolt",name:"Firebolt",color:"ember",type:"spell",cost:1,icon:"☄️",text:"Deal 2 damage to a unit.",targets:[kr()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.dealDamage(t,2,null,"fire")}},{id:"e_torch_raider",name:"Torch Raider",color:"ember",type:"unit",cost:2,atk:2,hp:2,kw:["swift","siege"],icon:"🔥",text:"",flavor:"Burn the gates. Then burn what is behind them."},{id:"e_ashfang",name:"Ashfang Wolf",color:"ember",type:"unit",cost:2,atk:3,hp:2,speed:3,icon:"🐺",text:""},{id:"e_powder_goblin",name:"Powder Goblin",color:"ember",type:"unit",cost:2,atk:2,hp:1,kw:["swift"],icon:"💣",text:"Last Breath: Deal 2 damage to all adjacent units.",onDeath:(i,e)=>{i.fx("explosion",e);for(const t of i.adjacentUnits(e))i.dealDamage(t,2,null)}},{id:"e_flame_dancer",name:"Flame Dancer",color:"ember",type:"unit",cost:2,atk:2,hp:2,icon:"💃",text:"Whenever you cast a spell or order, deal 1 damage to the enemy Sanctum.",onSpellCast:(i,e)=>i.damageSanctum(1-e.owner,1,e)},{id:"e_berserker",name:"Bloodrage Berserker",color:"ember",type:"unit",cost:3,atk:3,hp:3,icon:"🪓",text:"When this survives damage, it gets +2 power.",onDamaged:(i,e)=>i.buff(e,2,0)},{id:"e_pyromancer",name:"Pyromancer",color:"ember",type:"unit",cost:3,atk:2,hp:2,range:2,icon:"🧙",text:"Arrival: Deal 1 damage to an enemy unit.",targets:[{...rs(),optional:!0}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.dealDamage(t,1,null,"fire")}},{id:"e_war_cry",name:"War Cry",color:"ember",type:"order",cost:2,icon:"📯",text:"Ready a friendly unit. It gets +2 power this round.",targets:[Fs()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.ready(t),i.tempBuff(t,2))}},{id:"e_blitz",name:"Blitz",color:"ember",type:"order",cost:1,icon:"⚡",text:"Give a friendly unit Swift and +1/+0.",targets:[Fs()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.giveKw(t,"swift"),i.buff(t,1,0))}},{id:"e_warlord",name:"Ember Warlord",color:"ember",type:"unit",cost:4,atk:4,hp:3,icon:"👹",text:"Arrival: Other friendly units get +1/+0.",onPlay:(i,{p:e,self:t})=>{for(const n of i.unitsOf(e))n!==t&&i.buff(n,1,0)}},{id:"e_scorch",name:"Scorch the Earth",color:"ember",type:"spell",cost:3,icon:"🌋",text:"Deal 3 damage to the enemy Sanctum.",onPlay:(i,{p:e})=>i.damageSanctum(1-e,3)},{id:"e_fireball",name:"Fireball",color:"ember",type:"spell",cost:4,icon:"💥",text:"Deal 4 damage to a unit and 1 damage to units adjacent to it.",targets:[kr()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);if(!t)return;const n=i.adjacentUnits(t);i.dealDamage(t,4,null,"explosion");for(const s of n)i.dealDamage(s,1,null)}},{id:"e_phoenix",name:"Ashen Phoenix",color:"ember",type:"unit",cost:5,atk:4,hp:3,kw:["flying","swift"],icon:"🐦‍🔥",text:"Last Breath: Return a copy of this to your hand. It costs 1 more.",onDeath:(i,e)=>i.addToHand(e.owner,"e_phoenix",1)},{id:"e_colossus",name:"Magma Colossus",color:"ember",type:"unit",cost:6,atk:6,hp:6,kw:["siege"],icon:"🗿",text:"Arrival: Deal 2 damage to all adjacent enemy units.",onPlay:(i,{self:e})=>{if(e){i.fx("explosion",e);for(const t of i.adjacentUnits(e))t.owner!==e.owner&&i.dealDamage(t,2,null)}}},{id:"t_coral_sentry",name:"Coral Sentry",color:"tide",type:"unit",cost:1,atk:1,hp:3,kw:["guardian"],icon:"🐚",text:""},{id:"t_undertow",name:"Undertow",color:"tide",type:"spell",cost:1,icon:"🌀",text:"Move a unit to an empty adjacent hex.",targets:[kr(),{kind:"hex",prompt:"Choose an adjacent empty hex",hexFilter:(i,e,t,n)=>{const s=i.tUnit(n[0]);return!!s&&Qn(s,e)===1}}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]),n=lc(e[1]);t&&n&&i.teleport(t,n)}},{id:"t_frostbolt",name:"Frostbolt",color:"tide",type:"spell",cost:2,icon:"❄️",text:"Deal 1 damage to a unit and Freeze it.",targets:[kr()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.dealDamage(t,1,null,"frost"),t.hp>0&&i.freeze(t))}},{id:"t_mistling",name:"Mistling",color:"tide",type:"unit",cost:2,atk:1,hp:2,kw:["flying"],icon:"🫧",text:"Arrival: Draw a card.",onPlay:(i,{p:e})=>i.draw(e,1)},{id:"t_wave_rider",name:"Wave Rider",color:"tide",type:"unit",cost:2,atk:2,hp:2,kw:["flying"],speed:3,icon:"🐬",text:""},{id:"t_insight",name:"Arcane Insight",color:"tide",type:"spell",cost:3,icon:"📘",text:"Draw 2 cards.",onPlay:(i,{p:e})=>i.draw(e,2)},{id:"t_riptide",name:"Riptide",color:"tide",type:"spell",cost:3,icon:"🌊",text:"Return a unit to its owner's hand.",targets:[kr()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.bounce(t)}},{id:"t_mirror_mage",name:"Mirror Mage",color:"tide",type:"unit",cost:3,atk:2,hp:3,range:2,icon:"🔮",text:"Arrival: Draw a card.",onPlay:(i,{p:e})=>i.draw(e,1)},{id:"t_sea_witch",name:"Sea Witch",color:"tide",type:"unit",cost:3,atk:2,hp:4,icon:"🧜‍♀️",text:"Your spells and orders cost 1 less.",spellDiscount:1},{id:"t_glacial",name:"Glacial Elemental",color:"tide",type:"unit",cost:4,atk:3,hp:5,kw:["guardian"],icon:"🧊",text:"When a unit attacks this, Freeze the attacker.",onAttacked:(i,e,t)=>{t.hp>0&&i.freeze(t)}},{id:"t_deep_freeze",name:"Deep Freeze",color:"tide",type:"spell",cost:4,icon:"🥶",text:"Freeze an enemy unit and all enemy units adjacent to it.",targets:[rs()],onPlay:(i,{targets:e,p:t})=>{const n=i.tUnit(e[0]);if(n){i.fx("frost",n);for(const s of[n,...i.adjacentUnits(n)])s.owner!==t&&i.freeze(s)}}},{id:"t_stormcaller",name:"Storm Caller",color:"tide",type:"unit",cost:5,atk:3,hp:4,range:3,icon:"⛈️",text:"Arrival: Deal 2 damage to an enemy unit.",targets:[{...rs(),optional:!0}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.dealDamage(t,2,null,"lightning")}},{id:"t_time_warp",name:"Time Warp",color:"tide",type:"order",cost:6,icon:"⏳",text:"Ready all friendly units.",onPlay:(i,{p:e})=>{for(const t of i.unitsOf(e))i.ready(t)}},{id:"t_tidal_wave",name:"Tidal Wave",color:"tide",type:"spell",cost:6,icon:"🌊",text:"Return all units with 3 or less power to their owners' hands.",onPlay:i=>{i.fx("wave",null);for(const e of[...i.s.units])i.power(e)<=3&&i.bounce(e)}},{id:"t_leviathan",name:"Abyssal Leviathan",color:"tide",type:"unit",cost:8,atk:7,hp:8,icon:"🐋",text:"Arrival: Freeze all enemy units.",onPlay:(i,{p:e})=>{i.fx("wave",null);for(const t of i.unitsOf(1-e))i.freeze(t)}},{id:"g_sproutling",name:"Sproutling",color:"grove",type:"unit",cost:1,atk:0,hp:3,kw:["guardian"],icon:"🌱",text:"Last Breath: Gain an empty mana crystal.",onDeath:(i,e)=>i.gainMaxMana(e.owner,1)},{id:"g_entangle",name:"Entangle",color:"grove",type:"spell",cost:1,icon:"🕸️",text:"Root an enemy unit until the end of next round (it can't move).",targets:[rs()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.root(t,2)}},{id:"g_druid",name:"Grove Druid",color:"grove",type:"unit",cost:2,atk:1,hp:3,icon:"🧝",text:"Arrival: Gain an empty mana crystal.",onPlay:(i,{p:e})=>i.gainMaxMana(e,1)},{id:"g_boar",name:"Thornback Boar",color:"grove",type:"unit",cost:2,atk:2,hp:3,icon:"🐗",text:"When a unit attacks this, deal 1 damage to the attacker.",onAttacked:(i,e,t)=>{t.hp>0&&i.dealDamage(t,1,null)}},{id:"g_feral",name:"Feral Growth",color:"grove",type:"order",cost:2,icon:"💪",text:"Give a friendly unit +2/+2.",targets:[Fs()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.buff(t,2,2)}},{id:"g_pounce",name:"Predator's Pounce",color:"grove",type:"order",cost:2,icon:"🐾",text:"A friendly unit and an enemy unit within 2 hexes of it deal damage to each other.",targets:[Fs(),{...rs(),filter:(i,e,t,n)=>{const s=i.tUnit(n[0]);return!!s&&Qn(s,e)<=2}}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]),n=i.tUnit(e[1]);t&&n&&i.fight(t,n)}},{id:"g_overgrowth",name:"Overgrowth",color:"grove",type:"spell",cost:3,icon:"🌿",text:"Gain an empty mana crystal. Draw a card.",onPlay:(i,{p:e})=>{i.gainMaxMana(e,1),i.draw(e,1)}},{id:"g_treant",name:"Treant Warden",color:"grove",type:"unit",cost:3,atk:2,hp:5,kw:["guardian","regenerate"],icon:"🌳",text:""},{id:"g_sporecap",name:"Sporecap Shaman",color:"grove",type:"unit",cost:3,atk:2,hp:3,icon:"🍄",text:"At the end of each round, give another random friendly unit +1/+1.",onRoundEnd:(i,e)=>{const t=i.unitsOf(e.owner).filter(n=>n!==e);t.length&&i.buff(i.pick(t),1,1)}},{id:"g_stag",name:"Elder Stag",color:"grove",type:"unit",cost:4,atk:4,hp:4,speed:3,icon:"🦌",text:"Arrival: Other friendly units get +1/+1.",onPlay:(i,{p:e,self:t})=>{for(const n of i.unitsOf(e))n!==t&&i.buff(n,1,1)}},{id:"g_packmother",name:"Packmother",color:"grove",type:"unit",cost:4,atk:3,hp:3,icon:"🦊",text:"Arrival: Summon two 2/1 Wolf Pups next to this.",onPlay:(i,{self:e})=>{if(e)for(let t=0;t<2;t++){const n=i.randomEmptyNeighbor(e);n&&i.summon("g_pup",e.owner,n)}}},{id:"g_pup",name:"Wolf Pup",color:"grove",type:"unit",cost:1,atk:2,hp:1,icon:"🐕",text:"",token:!0},{id:"g_behemoth",name:"Moss Behemoth",color:"grove",type:"unit",cost:5,atk:5,hp:6,kw:["regenerate"],icon:"🦍",text:""},{id:"g_dragon",name:"Verdant Dragon",color:"grove",type:"unit",cost:7,atk:6,hp:6,kw:["flying"],icon:"🐉",text:"Arrival: Heal your Sanctum by 5.",onPlay:(i,{p:e})=>i.healSanctum(e,5)},{id:"g_titan",name:"Worldroot Titan",color:"grove",type:"unit",cost:9,atk:10,hp:10,kw:["guardian","regenerate"],icon:"🌲",text:"Arrival: Root all enemy units until the end of next round.",onPlay:(i,{p:e})=>{i.fx("roots",null);for(const t of i.unitsOf(1-e))i.root(t,2)}},{id:"d_recruit",name:"Militia Recruit",color:"dawn",type:"unit",cost:1,atk:1,hp:1,icon:"🪖",text:"",token:!0},{id:"d_squire",name:"Eager Squire",color:"dawn",type:"unit",cost:1,atk:1,hp:2,icon:"🧑‍🌾",text:"Arrival: Summon a 1/1 Militia Recruit next to this.",onPlay:(i,{self:e})=>{if(!e)return;const t=i.randomEmptyNeighbor(e);t&&i.summon("d_recruit",e.owner,t)}},{id:"d_holy_light",name:"Holy Light",color:"dawn",type:"spell",cost:1,icon:"✨",text:"Heal a friendly unit by 3 and give it Barrier.",targets:[Fs()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.heal(t,3),i.giveKw(t,"barrier"))}},{id:"d_shieldmaiden",name:"Shieldmaiden",color:"dawn",type:"unit",cost:2,atk:2,hp:2,kw:["guardian","barrier"],icon:"🛡️",text:""},{id:"d_archer",name:"Lightwarden Archer",color:"dawn",type:"unit",cost:2,atk:2,hp:1,range:2,icon:"🏹",text:""},{id:"d_banner",name:"Banner Knight",color:"dawn",type:"unit",cost:3,atk:2,hp:3,icon:"🚩",text:"Arrival: Give adjacent friendly units +1/+1.",onPlay:(i,{self:e})=>{if(e)for(const t of i.adjacentUnits(e))t.owner===e.owner&&i.buff(t,1,1)}},{id:"d_captain",name:"Captain of the Guard",color:"dawn",type:"unit",cost:3,atk:3,hp:3,icon:"🎖️",text:"Whenever you summon another unit, give it +1/+1.",onFriendlySummon:(i,e,t)=>i.buff(t,1,1)},{id:"d_call_arms",name:"Call to Arms",color:"dawn",type:"spell",cost:3,icon:"📣",text:"Summon three 1/1 Militia Recruits in your deployment zone.",onPlay:(i,{p:e})=>i.summonInDeploy("d_recruit",e,3)},{id:"d_smite",name:"Smite",color:"dawn",type:"spell",cost:3,icon:"⚖️",text:"Destroy an enemy unit with 4 or more power.",targets:[{...rs("Choose an enemy unit with 4+ power"),filter:(i,e)=>i.power(e)>=4}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.fx("holy",t),i.destroy(t))}},{id:"d_divine_aegis",name:"Divine Aegis",color:"dawn",type:"spell",cost:3,icon:"🔆",text:"Give all friendly units Barrier.",onPlay:(i,{p:e})=>{for(const t of i.unitsOf(e))i.giveKw(t,"barrier")}},{id:"d_glorious",name:"Glorious Charge",color:"dawn",type:"order",cost:4,icon:"🎺",text:"Friendly units get +2 power this round.",onPlay:(i,{p:e})=>{for(const t of i.unitsOf(e))i.tempBuff(t,2)}},{id:"d_paladin",name:"Dawnblade Paladin",color:"dawn",type:"unit",cost:4,atk:3,hp:4,kw:["firstStrike"],icon:"⚔️",text:"Arrival: Heal your Sanctum by 3.",onPlay:(i,{p:e})=>i.healSanctum(e,3)},{id:"d_bastion",name:"Bastion Golem",color:"dawn",type:"unit",cost:5,atk:2,hp:8,kw:["guardian"],icon:"🏛️",text:"At the start of each round, give adjacent friendly units Barrier.",onRoundStart:(i,e)=>{for(const t of i.adjacentUnits(e))t.owner===e.owner&&i.giveKw(t,"barrier")}},{id:"d_seraph",name:"Seraph of Dawn",color:"dawn",type:"unit",cost:6,atk:5,hp:5,kw:["flying","barrier"],icon:"👼",text:"Arrival: Heal all friendly units and your Sanctum by 3.",onPlay:(i,{p:e})=>{i.fx("holy",null,{p:e});for(const t of i.unitsOf(e))i.heal(t,3);i.healSanctum(e,3)}},{id:"k_skeleton",name:"Skeleton",color:"dusk",type:"unit",cost:1,atk:1,hp:1,icon:"💀",text:"",token:!0},{id:"k_grave_imp",name:"Grave Imp",color:"dusk",type:"unit",cost:1,atk:1,hp:1,icon:"😈",text:"Last Breath: Deal 1 damage to the enemy Sanctum.",onDeath:(i,e)=>i.damageSanctum(1-e.owner,1)},{id:"k_dark_pact",name:"Dark Pact",color:"dusk",type:"spell",cost:1,icon:"📜",text:"Sacrifice a friendly unit. Draw 2 cards.",targets:[Fs("Choose a unit to sacrifice")],onPlay:(i,{targets:e,p:t})=>{const n=i.tUnit(e[0]);n&&(i.destroy(n),i.draw(t,2))}},{id:"k_plague_rat",name:"Plague Rat",color:"dusk",type:"unit",cost:2,atk:1,hp:1,kw:["deadly"],icon:"🐀",text:""},{id:"k_cultist",name:"Blood Cultist",color:"dusk",type:"unit",cost:2,atk:2,hp:2,icon:"🩸",text:"Arrival: You may sacrifice an adjacent friendly unit. If you do, this gets +3/+3.",targets:[{kind:"unit",side:"friendly",optional:!0,prompt:"Sacrifice an adjacent ally? (optional)",filter:Wm}],onPlay:(i,{targets:e,self:t})=>{const n=i.tUnit(e[0]);n&&t&&(i.destroy(n),i.buff(t,3,3))}},{id:"k_bone_horde",name:"Bone Horde",color:"dusk",type:"spell",cost:2,icon:"🦴",text:"Summon two 1/1 Skeletons in your deployment zone.",onPlay:(i,{p:e})=>i.summonInDeploy("k_skeleton",e,2)},{id:"k_siphon",name:"Soul Siphon",color:"dusk",type:"unit",cost:3,atk:1,hp:4,range:2,icon:"🕯️",text:"Whenever another friendly unit dies, deal 1 damage to the enemy Sanctum and heal yours by 1.",onUnitDeath:(i,e,t)=>{t.owner===e.owner&&(i.damageSanctum(1-e.owner,1,null),i.healSanctum(e.owner,1))}},{id:"k_assassin",name:"Shadow Assassin",color:"dusk",type:"unit",cost:3,atk:2,hp:2,kw:["deadly","infiltrate"],icon:"🥷",text:""},{id:"k_wraith",name:"Hungering Wraith",color:"dusk",type:"unit",cost:3,atk:2,hp:3,kw:["flying","drain"],icon:"👻",text:""},{id:"k_embrace",name:"Death's Embrace",color:"dusk",type:"spell",cost:2,icon:"🖤",text:"Destroy a damaged enemy unit.",targets:[{...rs("Choose a damaged enemy unit"),filter:(i,e)=>e.hp<e.maxHp}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.fx("shadow",t),i.destroy(t))}},{id:"k_necromancer",name:"Necromancer",color:"dusk",type:"unit",cost:4,atk:2,hp:4,icon:"🧟",text:"Whenever another friendly non-Skeleton unit dies, summon a 1/1 Skeleton in its place.",onUnitDeath:(i,e,t)=>{t.owner===e.owner&&t.cardId!=="k_skeleton"&&i.isEmpty(t)&&i.summon("k_skeleton",e.owner,t)}},{id:"k_vampire",name:"Vampire Noble",color:"dusk",type:"unit",cost:4,atk:4,hp:4,kw:["drain"],icon:"🧛",text:""},{id:"k_raise_dead",name:"Raise Dead",color:"dusk",type:"spell",cost:3,icon:"⚰️",text:"Summon a copy of the last friendly unit that died this game in your deployment zone.",targets:[{kind:"hex",prompt:"Choose a hex in your deployment zone",hexFilter:(i,e,t)=>i.isDeployHex(t,e)&&i.s.players[t].graveyard.length>0}],onPlay:(i,{targets:e,p:t})=>{const n=lc(e[0]),s=i.s.players[t].graveyard;n&&s.length&&(i.fx("shadow",n),i.summon(s[s.length-1],t,n))}},{id:"k_final_rite",name:"Final Rite",color:"dusk",type:"spell",cost:4,icon:"🌑",text:"Sacrifice all friendly units. Deal 2 damage to the enemy Sanctum for each.",onPlay:(i,{p:e})=>{const t=i.unitsOf(e);i.fx("shadow",null,{p:e});for(const n of t)i.destroy(n);i.damageSanctum(1-e,2*t.length)}},{id:"k_lich",name:"Lich Queen",color:"dusk",type:"unit",cost:7,atk:5,hp:6,kw:["drain"],icon:"👑",text:"Arrival: Destroy all other units with 2 or less health.",onPlay:(i,{self:e})=>{i.fx("shadow",null);for(const t of[...i.s.units])t!==e&&t.hp<=2&&i.destroy(t)}},{id:"c_pyra",name:"Pyra, the Wildfire",color:"ember",type:"unit",cost:2,atk:2,hp:2,kw:["swift"],icon:"🎇",text:"Level up: You have dealt 8+ damage to the enemy Sanctum this game.",champion:{to:"c_pyra2",label:"Sanctum damage dealt",progress:(i,e)=>[i.s.players[e.owner].sanctumDamageDealt,8]}},{id:"c_pyra2",name:"Pyra, Living Inferno",color:"ember",type:"unit",cost:2,atk:4,hp:3,kw:["swift","siege","flying"],icon:"☀️",text:"Leveled up! Flies over everything to burn Sanctums.",levelOf:"c_pyra",token:!0},{id:"c_nerith",name:"Nerith, Tidecaller",color:"tide",type:"unit",cost:3,atk:2,hp:4,range:2,icon:"🧜‍♂️",text:"Level up: You have cast 5+ spells or orders this game.",champion:{to:"c_nerith2",label:"Spells and orders cast",progress:(i,e)=>[i.s.players[e.owner].spellsCast,5]}},{id:"c_nerith2",name:"Nerith, Maelstrom Lord",color:"tide",type:"unit",cost:3,atk:4,hp:6,range:3,icon:"🌪️",text:"At the start of each round, Freeze the strongest enemy unit.",levelOf:"c_nerith",token:!0,onRoundStart:(i,e)=>{const t=i.unitsOf(1-e.owner);if(!t.length)return;const n=t.reduce((s,r)=>i.power(r)>i.power(s)?r:s);i.fx("frost",n),i.freeze(n)}},{id:"c_thornak",name:"Thornak, the Rooted",color:"grove",type:"unit",cost:4,atk:4,hp:5,kw:["regenerate"],icon:"🐻",text:"Level up: You have 8+ max mana.",champion:{to:"c_thornak2",label:"Max mana",progress:(i,e)=>[i.s.players[e.owner].maxMana,8]}},{id:"c_thornak2",name:"Thornak, Ancient King",color:"grove",type:"unit",cost:4,atk:8,hp:8,kw:["regenerate","guardian"],icon:"🦣",text:"At the start of each round, other friendly units get +1/+1.",levelOf:"c_thornak",token:!0,onRoundStart:(i,e)=>{for(const t of i.unitsOf(e.owner))t!==e&&i.buff(t,1,1)}},{id:"c_sera",name:"Sera, Shield of Dawn",color:"dawn",type:"unit",cost:3,atk:2,hp:4,kw:["guardian"],icon:"👸",text:"Level up: You control 5+ units.",champion:{to:"c_sera2",label:"Units you control",progress:(i,e)=>[i.unitsOf(e.owner).length,5]}},{id:"c_sera2",name:"Sera, Dawn's Bulwark",color:"dawn",type:"unit",cost:3,atk:4,hp:6,kw:["guardian","barrier","firstStrike"],icon:"🌅",text:"At the start of each round, summon a 1/1 Militia Recruit next to this and give adjacent allies Barrier.",levelOf:"c_sera",token:!0,onRoundStart:(i,e)=>{const t=i.randomEmptyNeighbor(e);t&&i.summon("d_recruit",e.owner,t);for(const n of i.adjacentUnits(e))n.owner===e.owner&&i.giveKw(n,"barrier")}},{id:"c_morvath",name:"Morvath, Gravecaller",color:"dusk",type:"unit",cost:3,atk:3,hp:3,kw:["drain"],icon:"🦇",text:"Level up: 5+ of your units have died this game.",champion:{to:"c_morvath2",label:"Allies fallen",progress:(i,e)=>[i.s.players[e.owner].alliesLost,5]}},{id:"c_morvath2",name:"Morvath, Soul Reaper",color:"dusk",type:"unit",cost:3,atk:5,hp:5,kw:["drain","deadly"],icon:"☠️",text:"Whenever another friendly unit dies, deal 1 damage to the enemy Sanctum.",levelOf:"c_morvath",token:!0,onUnitDeath:(i,e,t)=>{t.owner===e.owner&&i.damageSanctum(1-e.owner,1,null)}}],$o=Object.fromEntries(Mf.map(i=>[i.id,i])),Ef=Mf,bn={ember:{name:"Ember",hex:"#ff5a2a",orb:"Orb of Passion",ideals:"Freedom, fury, the thrill of the moment.",style:"Swift units that act immediately, Siege, and burn that goes straight for the enemy Sanctum."},tide:{name:"Tide",hex:"#2aa8ff",orb:"Orb of Insight",ideals:"Knowledge, patience, control.",style:"Freezes, bounces and repositions enemies, draws cards, and wins late with huge sea monsters."},grove:{name:"Grove",hex:"#4fd16a",orb:"Orb of Life",ideals:"Growth, instinct, endurance.",style:"Ramps extra mana into enormous creatures, Regenerates, and makes its units fight."},dawn:{name:"Dawn",hex:"#ffd34d",orb:"Orb of Order",ideals:"Unity, justice, protection.",style:"Guardians and Barriers, healing, and a wide army of soldiers that buff each other."},dusk:{name:"Dusk",hex:"#b05cff",orb:"Orb of Ambition",ideals:"Power at any price.",style:"Sacrifices its own units for value, Drains life, Deadly assassins, and death-trigger combos."},neutral:{name:"Neutral",hex:"#aaaaaa",orb:"",ideals:"",style:""}},As={swift:{name:"Swift",text:"Can be ordered the round it is summoned.",icon:"💨"},guardian:{name:"Guardian",text:"Enemy units that move next to it must stop. Flying units ignore this.",icon:"🛡️"},flying:{name:"Flying",text:"Moves over other units and ignores Guardians.",icon:"🪽"},firstStrike:{name:"First Strike",text:"Deals its combat damage first. If that kills, it takes none back.",icon:"🗡️"},drain:{name:"Drain",text:"Damage it deals heals your Sanctum.",icon:"🩸"},regenerate:{name:"Regenerate",text:"Fully heals at the end of each round.",icon:"♻️"},barrier:{name:"Barrier",text:"Negates the next damage it would take, then breaks.",icon:"🔰"},siege:{name:"Siege",text:"Deals double damage to Sanctums.",icon:"🏰"},deadly:{name:"Deadly",text:"Destroys any unit it damages.",icon:"☠️"},infiltrate:{name:"Infiltrate",text:"Can be summoned on any empty hex in your half of the board, including Ley Orbs.",icon:"👁️"}};function Ye(i){const e=$o[i];if(!e)throw new Error(`Unknown card ${i}`);return e}const _i=(...i)=>i.map(e=>[e,2]),Vn=[{id:"wildfire",name:"Wildfire",archetype:"Aggro",colors:["ember"],signature:"e_torch_raider",blurb:"Swift units and burn. Hit the Sanctum before the enemy gets going.",howToPlay:"Flood the board early, grab the Ley Orbs, and use Firebolts to clear blockers. Save Scorch the Earth and War Cry to finish.",cards:_i("e_spark_imp","e_cinder_scout","e_firebolt","e_torch_raider","e_ashfang","e_powder_goblin","e_flame_dancer","e_berserker","e_pyromancer","e_war_cry","c_pyra","e_warlord","e_scorch","e_fireball","e_phoenix")},{id:"frozen_tide",name:"Frozen Bastion",archetype:"Control",colors:["tide","dawn"],signature:"t_leviathan",blurb:"Freeze, bounce and wall up until the Leviathan rises.",howToPlay:"Hold the line with Guardians, answer threats with Frostbolt, Smite and Riptide, draw cards, then take over late with Storm Callers and the Leviathan.",cards:_i("t_coral_sentry","t_undertow","t_frostbolt","d_holy_light","d_shieldmaiden","c_nerith","t_insight","t_riptide","t_mirror_mage","d_smite","t_glacial","t_deep_freeze","t_stormcaller","t_tidal_wave","t_leviathan")},{id:"ancient_awakening",name:"Ancient Awakening",archetype:"Ramp",colors:["grove","tide"],signature:"g_titan",blurb:"Grow your mana absurdly fast and drop titans nobody can answer.",howToPlay:"Play Druids, Sproutlings and Overgrowth early to gain extra mana crystals, stall with Treants and Entangle, then land Dragons, Leviathans and the Worldroot Titan.",cards:_i("g_sproutling","g_entangle","g_druid","c_thornak","t_frostbolt","g_overgrowth","g_treant","t_mirror_mage","t_insight","g_packmother","g_behemoth","t_stormcaller","g_dragon","t_leviathan","g_titan")},{id:"silver_vanguard",name:"Silver Vanguard",archetype:"Midrange",colors:["dawn","grove"],signature:"d_paladin",blurb:"Efficient, sturdy units that buff each other and trade up.",howToPlay:"Curve out with solid units every round, win fights with Feral Growth and Predator's Pounce, and out-value the enemy with Paladins and the Seraph.",cards:_i("c_sera","d_archer","d_shieldmaiden","g_boar","g_feral","d_holy_light","d_banner","d_captain","g_treant","g_pounce","d_paladin","g_stag","d_smite","d_bastion","d_seraph")},{id:"grave_pact",name:"Grave Pact",archetype:"Combo",colors:["dusk","ember"],signature:"k_final_rite",blurb:"Every death drains the enemy. Then sacrifice everything at once.",howToPlay:"Assemble Soul Siphons and Necromancers, fill the board with Imps and Skeletons, then cast Final Rite: each sacrificed unit deals 2, plus 1 more per Siphon.",cards:_i("k_grave_imp","e_spark_imp","e_firebolt","k_dark_pact","c_morvath","k_bone_horde","e_powder_goblin","k_cultist","e_flame_dancer","k_siphon","k_raise_dead","k_assassin","k_necromancer","e_war_cry","k_final_rite")},{id:"storm_raiders",name:"Storm Raiders",archetype:"Tempo",colors:["ember","tide"],signature:"t_wave_rider",blurb:"Fliers and cheap tricks. Always one step ahead.",howToPlay:"Fly over blockers to reach enemy territory, and use cheap spells to push, freeze and bounce defenders at the perfect moment. Sea Witch makes everything cheaper.",cards:_i("e_spark_imp","e_firebolt","t_undertow","t_wave_rider","t_mistling","e_torch_raider","c_nerith","t_frostbolt","e_war_cry","t_sea_witch","e_pyromancer","t_riptide","e_powder_goblin","e_phoenix","t_stormcaller")},{id:"legion_of_dawn",name:"Legion of Dawn",archetype:"Go-Wide",colors:["dawn","dusk"],signature:"d_glorious",blurb:"An endless army of soldiers and skeletons, then one glorious charge.",howToPlay:"Spread out across the board with Recruits and Skeletons, protect them with Barriers, and swing with everything after Glorious Charge.",cards:_i("d_squire","k_grave_imp","k_bone_horde","d_archer","d_shieldmaiden","d_call_arms","d_captain","c_sera","k_siphon","d_divine_aegis","k_necromancer","d_glorious","k_vampire","d_paladin","d_seraph")},{id:"wild_hunt",name:"Wild Hunt",archetype:"Stompy",colors:["grove","ember"],signature:"e_colossus",blurb:"Big beasts, bigger fights. Smash through the front line.",howToPlay:"Play the biggest body you can every round, use Pounce and Fireball to clear the way, and trample in with Colossi and Behemoths.",cards:_i("g_boar","c_thornak","e_torch_raider","g_feral","g_pounce","e_berserker","g_treant","e_firebolt","g_stag","g_packmother","e_warlord","g_behemoth","e_fireball","e_colossus","g_dragon")},{id:"night_court",name:"Night Court",archetype:"Attrition",colors:["dusk","tide"],signature:"k_lich",blurb:"Drain life, kill everything, and outlast the opponent.",howToPlay:"Trade efficiently with Deadly units and removal, heal with Drain, and reset the board with the Lich Queen when you fall behind.",cards:_i("t_coral_sentry","k_plague_rat","t_frostbolt","k_embrace","k_wraith","c_morvath","t_mirror_mage","t_insight","k_vampire","t_glacial","k_raise_dead","t_riptide","t_deep_freeze","k_lich","t_leviathan")}],dr=30,Zr=3,_s=2;function cu(i){return i.reduce((e,[,t])=>e+t,0)}function oa(i){var t;const e=[];for(const[n]of i){const s=(t=$o[n])==null?void 0:t.color;s&&!e.includes(s)&&e.push(s)}return e}function Tf(i){var n;const e=i.map(([s])=>$o[s]).filter(Boolean),t=e.find(s=>s.champion);return t?t.icon:((n=e.sort((s,r)=>r.cost-s.cost)[0])==null?void 0:n.icon)??"🔮"}function Po(i){if(!Array.isArray(i))return"Deck must be a list.";let e=0;for(const t of i){if(!Array.isArray(t)||t.length!==2)return"Bad deck entry.";const[n,s]=t,r=$o[n];if(!r||r.token)return`Unknown card ${String(n)}.`;if(!Number.isInteger(s)||s<1||s>Zr)return`Max ${Zr} copies of ${r.name}.`;e+=s}return e!==dr?`Decks need exactly ${dr} cards (this one has ${e}).`:oa(i).length>_s?`Decks can use at most ${_s} colors.`:null}function la(i){const e=Vn.find(t=>t.id===i)??Vn[0];return{id:e.id,name:e.name,cards:e.cards}}const Af={C:0,D:2,E:4,F:5,G:7,A:9,B:11};function Xm(i){const e=/^([A-G])(#|b)?(-?\d)$/.exec(i);if(!e)throw new Error(`Bad note ${i}`);return 12*(Number(e[3])+1)+Af[e[1]]+(e[2]==="#"?1:e[2]==="b"?-1:0)}function or(i,e,t,n,s,r=.7){let a=t*n;e.split("|").forEach((o,c)=>{let l=0;for(const d of o.trim().split(/\s+/).filter(Boolean)){const[h,f]=d.split(":"),p=Number(f);if(h!=="r")for(const _ of h.split("+"))i.push({beat:a+l,dur:p,midi:Xm(_),vel:r,inst:s});l+=p}if(Math.abs(l-n)>1e-6)throw new Error(`${s} bar ${t+c+1} has ${l} beats`);a+=n})}const qm={"":[0,4,7],m:[0,3,7],m7:[0,3,7,10],m9:[0,3,7,10,14],maj7:[0,4,7,11],sus4:[0,5,7],m7b5:[0,3,6,10],7:[0,4,7,10]};function Rf(i){const e=/^([A-G][b#]?)(.*)$/.exec(i);return{root:(Af[e[1][0]]+(e[1][1]==="#"?1:e[1][1]==="b"?-1:0)+12)%12,iv:qm[e[2]]}}const Qr=(i,e)=>e+((i-e)%12+12)%12;function jm(){const e=[],t=["Dm9","Dm9","Bbmaj7","Bbmaj7","G","Gm","Asus4","A","Dm9","Dm9","Bbmaj7","C","Fmaj7","G","Asus4","Dm","Bbmaj7","C","Am7","Dm","Gm7","C","Fmaj7","A","Dm9","Bbmaj7","G","Gm","Fmaj7","Em7b5","Asus4","A"];or(e,`r:2 A4:1 | D5:1.5 E5:.5 F5:1 | E5:2 C5:1 | D5:3 | r:1 B4:1 D5:1 | G5:1.5 F5:.5 D5:1 | E5:2 D5:1 | C#5:3 |
    r:2 A4:1 | D5:1.5 E5:.5 F5:1 | A5:2 G5:1 | E5:2 C5:1 | F5:1.5 E5:.5 C5:1 | D5:2 B4:1 | D5:1 E5:2 | D5:3 |
    F5:1 A5:1 D6:1 | C6:2 G5:1 | E5:1 A5:1 C6:1 | A5:3 | Bb5:1 A5:1 G5:1 | E5:2 G5:1 | A5:1.5 G5:.5 F5:1 | E5:3 |
    r:1 A4:1 D5:1 | E5:1 F5:1 A5:1 | B5:2 A5:1 | G5:2 F5:1 | E5:1.5 F5:.5 E5:1 | D5:2 Bb4:1 | D5:1 E5:2 | C#5:2 r:1`,0,3,"celesta",.62),t.forEach((s,r)=>{const{root:a,iv:o}=Rf(s),c=r*3,l=Qr(a,50),d=o.length>3?l+12+o[3]:l+12+o[2];[l-12,l+o[2],l+12,l+12+o[1],d,l+12+o[1]].forEach((p,_)=>e.push({beat:c+_*.5,dur:1.5,midi:p,vel:_===0?.55:.36,inst:"harp"}));const f=Qr(a,55);for(const p of o.slice(1,4))e.push({beat:c,dur:3,midi:f+p,vel:.32,inst:"pad"});(r<8||r>=24)&&e.push({beat:c,dur:3,midi:Qr(a,38),vel:.34,inst:"bass"}),r%4===0&&e.push({beat:c+1,dur:3,midi:f+o[o.length-1]+12,vel:.22,inst:"bell"})});const n=t.map((s,r)=>r>=16&&r<24?1:.88);return{name:"menu",bpm:66,beatsPerBar:3,bars:t.length,events:e,dyn:n,level:1}}function Ym(){const e=[],t=["Dm","Dm","Bb","Bb","Gm","Gm","A","A","Dm","Bb","Gm","A","Dm","Bb","C","A","Bb","C","Dm","Dm","Bb","C","A","A","Gm","Gm","Dm","Dm","Eb","Eb","A","A"];or(e,"r:4 | r:4 | r:4 | r:4 | D5:4 | D5:4 | E5:4 | C#5:4",0,4,"violin",.42),or(e,`A3:1 D4:1.5 E4:.5 F4:1 | F4:2 D4:1 C4:1 | D4:4 | r:1 C#4:1 E4:1 A4:1 |
    A4:1.5 G4:.5 F4:1 E4:1 | F4:2 D4:2 | E4:1.5 F4:.5 G4:2 | E4:4`,8,4,"horn",.62),or(e,"D5:4 | E5:2 G5:2 | F5:3 E5:1 | D5:2 A5:2 | Bb5:3 A5:1 | G5:2 C6:2 | A5:2 G5:1 E5:1 | C#6:4",16,4,"violin",.6),or(e,"D4:4 | E4:4 | F4:4 | A4:4 | F4:4 | G4:4 | E4:4 | E4:4",16,4,"horn",.45),or(e,"r:4 | r:4 | r:3 A4:1 | D5:1.5 E5:.5 F5:2 | G5:3 F5:1 | Eb5:4 | E5:2 C#5:2 | A4:4",24,4,"flute",.5);const n=[1,.45,.5,.85,.45,.5,.8,.5];t.forEach((r,a)=>{const{root:o,iv:c}=Rf(r),l=a*4,d=Math.floor(a/8),h=Qr(o,38);if(d<3)[h,h,h+7,h,h,h+12,h,h+7].forEach((y,x)=>e.push({beat:l+x*.5,dur:.4,midi:y,vel:n[x]*(d===0?.5:.62),inst:"spicc"}));else for(let _=0;_<4;_++)e.push({beat:l+_,dur:.8,midi:_%2?h+7:h,vel:_===0?.5:.32,inst:"spicc"});const f=Qr(o,53);for(const _ of c)e.push({beat:l,dur:4,midi:f+_,vel:d===2?.42:.3,inst:"pad"});e.push({beat:l,dur:4,midi:h-12<28?h:h-12,vel:.4,inst:"bass"}),d===2&&(e.push({beat:l,dur:4,midi:h,vel:.3,inst:"brass"}),e.push({beat:l,dur:4,midi:h+7,vel:.24,inst:"brass"}));const p=(_,y,x=h)=>e.push({beat:_,dur:1.5,midi:x,vel:y,inst:"timp"});if(d<3&&p(l,d===0?.42:.55),d===2&&p(l+2.5,.38,h+7),a===23)for(let _=0;_<16;_++)p(l+_*.25,.18+_*.035);a===15&&(p(l+3,.45,h+7),p(l+3.5,.5,h+7)),d===3&&a%4===0&&p(l,.35)});const s=[.62,.64,.67,.7,.72,.75,.8,.84,.82,.84,.86,.9,.86,.88,.92,.95,.9,.93,.97,1,.97,1,1.05,1.1,.72,.7,.68,.66,.7,.72,.68,.64];return{name:"battle",bpm:84,beatsPerBar:4,bars:t.length,events:e,dyn:s,level:1.15}}const Cf={menu:jm(),battle:Ym()},Km=i=>440*2**((i-69)/12),Jm={celesta:{gain:.32,pan:.15,send:.55},harp:{gain:.3,pan:-.25,send:.45},pad:{gain:.16,pan:0,send:.6},bass:{gain:.3,pan:.05,send:.35},bell:{gain:.12,pan:.35,send:.8},spicc:{gain:.3,pan:-.15,send:.3},horn:{gain:.3,pan:-.3,send:.5},violin:{gain:.2,pan:.3,send:.55},flute:{gain:.22,pan:.25,send:.6},timp:{gain:.5,pan:0,send:.4},brass:{gain:.2,pan:-.1,send:.45}},hu=new WeakMap;function Zm(i){let e=hu.get(i);if(e)return e;const t=Math.floor(i.sampleRate*3.4);e=i.createBuffer(2,t,i.sampleRate);for(let n=0;n<2;n++){const s=e.getChannelData(n);let r=0;for(let a=0;a<t;a++){const o=a/t;r+=.32*(Math.random()*2-1-r),s[a]=r*(1-o)**2.6*(a<i.sampleRate*.012?a/(i.sampleRate*.012):1)}}return hu.set(i,e),e}function Qm(i,e){const t=i.createGain(),n=i.createGain(),s=i.createGain(),r=i.createGain(),a=i.createConvolver();a.buffer=Zm(i);const o=i.createGain();o.gain.value=.55;const c=i.createDynamicsCompressor();c.threshold.value=-20,c.ratio.value=3,c.attack.value=.05,c.release.value=.4,s.connect(n),r.connect(a).connect(o).connect(n),n.connect(c).connect(t).connect(e);const l=new Map;for(const[d,h]of Object.entries(Jm)){const f=i.createGain();f.gain.value=h.gain;const p=i.createStereoPanner();p.pan.value=h.pan;const _=i.createGain();_.gain.value=h.send,f.connect(p),p.connect(s),p.connect(_),_.connect(r),l.set(d,f)}return{input:s,send:r,dyn:n,fade:t,ch:l}}function as(i,e,t,n,s,r){const a=i.createGain();return a.gain.setValueAtTime(0,e),a.gain.linearRampToValueAtTime(n,e+t),a.gain.setValueAtTime(n,e+Math.max(t,s)),a.gain.setTargetAtTime(0,e+Math.max(t,s),r/4),a}let hc=null;function Tn(i,e,t,n,s,r=0){const a=i.createOscillator();return a.type=e,a.frequency.value=t,a.detune.value=r,a.start(n),a.stop(s),hc=a,a}function Da(i,e,t,n,s,r,a){const o=Tn(i,"sine",n,e,t),c=i.createGain();c.gain.setValueAtTime(0,e),c.gain.linearRampToValueAtTime(s,e+r),o.connect(c);for(const l of a)c.connect(l.detune)}function eg(i,e,t,n,s){const r=i.createGain();r.connect(e.ch.get(t.inst)),hc=null;const a=Km(t.midi),o=t.vel;switch(t.inst){case"celesta":{const l=n+2.6,d=as(i,n,.004,o,.01,2.2);[[1,1],[2,.18],[4.02,.09]].forEach(([h,f])=>{const p=Tn(i,"sine",a*h,n,l),_=i.createGain();_.gain.setValueAtTime(f,n),_.gain.setTargetAtTime(f*.15,n,h>1?.12:.9),p.connect(_).connect(d)}),d.connect(r);break}case"harp":{const l=n+2,d=as(i,n,.003,o,.01,1.6),h=i.createBiquadFilter();h.type="lowpass",h.frequency.setValueAtTime(Math.min(6e3,a*7),n),h.frequency.setTargetAtTime(a*2,n,.25),Tn(i,"triangle",a,n,l).connect(h);const f=Tn(i,"sine",a*2,n,l),p=i.createGain();p.gain.value=.25,f.connect(p).connect(h),h.connect(d).connect(r);break}case"pad":case"violin":case"bass":case"brass":{const l=t.inst==="violin",d=t.inst==="bass"?.5:l?.35:t.inst==="brass"?.6:.9,h=l?.9:1.2,f=n+s+h*1.5,p=as(i,n,d,o,s*.92,h),_=i.createBiquadFilter();_.type="lowpass",_.Q.value=.6;const y=t.inst==="brass"?700:t.inst==="bass"?500:l?2600:1500;_.frequency.setValueAtTime(y*.45,n),_.frequency.linearRampToValueAtTime(y*(.7+o*.5),n+d+s*.4),_.frequency.setTargetAtTime(y*.45,n+s,.5);const x=(t.inst==="bass"?[-5,5]:[-9,0,8]).map(T=>Tn(i,"sawtooth",a,n,f,T));l?Da(i,n,f,5.4,14,.5,x):t.inst!=="bass"&&Da(i,n,f,4.6,5,.8,x);const g=i.createGain();g.gain.value=1/x.length;for(const T of x)T.connect(g);g.connect(_).connect(p).connect(r);break}case"spicc":{const l=n+.6,d=i.createGain();d.gain.setValueAtTime(0,n),d.gain.linearRampToValueAtTime(o,n+.012),d.gain.setTargetAtTime(0,n+.04,Math.min(.09,s*.25));const h=i.createBiquadFilter();h.type="lowpass",h.frequency.setValueAtTime(1400,n),h.frequency.setTargetAtTime(350,n,.06);const f=i.createGain();f.gain.value=.5;for(const p of[-6,6])Tn(i,"sawtooth",a,n,l,p).connect(f);f.connect(h).connect(d).connect(r);break}case"horn":{const l=n+s+1.2,d=as(i,n,.09,o,s*.95,.5),h=i.createBiquadFilter();h.type="lowpass",h.Q.value=1.1,h.frequency.setValueAtTime(260,n),h.frequency.linearRampToValueAtTime(700+o*700,n+.18),h.frequency.setTargetAtTime(600+o*300,n+.3,.6);const f=Tn(i,"sawtooth",a,n,l,-4),p=Tn(i,"square",a,n,l,4);Da(i,n,l,4.8,6,.6,[f,p]);const _=i.createGain();_.gain.value=.45,f.connect(_),p.connect(_),_.connect(h).connect(d).connect(r);break}case"flute":{const l=n+s+1,d=as(i,n,.12,o,s*.9,.4),h=Tn(i,"sine",a,n,l),f=Tn(i,"triangle",a*2,n,l);Da(i,n,l,5,12,.4,[h,f]);const p=i.createGain();p.gain.value=.08,f.connect(p).connect(d);const _=i.createBuffer(1,Math.floor(i.sampleRate*(s+.5)),i.sampleRate),y=_.getChannelData(0);for(let A=0;A<y.length;A++)y[A]=Math.random()*2-1;const x=i.createBufferSource();x.buffer=_;const g=i.createBiquadFilter();g.type="bandpass",g.frequency.value=a*2,g.Q.value=4;const T=i.createGain();T.gain.value=.05,x.connect(g).connect(T).connect(d),x.start(n),x.stop(n+s+.5),h.connect(d),d.connect(r);break}case"bell":{const l=n+4.5,d=as(i,n,.005,o,.01,4),h=Tn(i,"sine",a,n,l),f=Tn(i,"sine",a*3.5,n,l),p=i.createGain();p.gain.setValueAtTime(a*2.2,n),p.gain.setTargetAtTime(a*.1,n,.5),f.connect(p).connect(h.frequency),h.connect(d).connect(r);break}case"timp":{const l=n+2.2,d=as(i,n,.004,o,.02,1.6),h=Tn(i,"sine",a*1.04,n,l);h.frequency.setTargetAtTime(a,n,.05);const f=Tn(i,"sine",a*1.5,n,l),p=i.createGain();p.gain.setValueAtTime(.25,n),p.gain.setTargetAtTime(0,n,.25),h.connect(d),f.connect(p).connect(d);const _=i.createBuffer(1,Math.floor(i.sampleRate*.15),i.sampleRate),y=_.getChannelData(0);for(let A=0;A<y.length;A++)y[A]=(Math.random()*2-1)*(1-A/y.length)**3;const x=i.createBufferSource();x.buffer=_;const g=i.createBiquadFilter();g.type="lowpass",g.frequency.value=900;const T=i.createGain();T.gain.value=.5,x.connect(g).connect(T).connect(d),x.start(n),d.connect(r);break}}const c=hc;c&&(c.onended=()=>r.disconnect())}const Pf=i=>60/i.bpm,tg=i=>i.bars*i.beatsPerBar*Pf(i);class If{constructor(e,t,n,s){this.ctx=e,this.song=n,this.t0=s,this.next=0,this.loop=0,this.dynLoopBar=0,this.timer=null,this.bus=Qm(e,t),this.events=[...n.events].sort((r,a)=>r.beat-a.beat)}pump(e){const t=this.song,n=tg(t),s=Pf(t);for(;;){const r=this.t0+this.loop*n;for(;this.dynLoopBar<t.bars&&r+this.dynLoopBar*t.beatsPerBar*s<e;){const a=r+this.dynLoopBar*t.beatsPerBar*s,o=t.dyn[this.dynLoopBar]*t.level;this.loop===0&&this.dynLoopBar===0?this.bus.dyn.gain.setValueAtTime(o,Math.max(a,this.ctx.currentTime)):this.bus.dyn.gain.linearRampToValueAtTime(o,a+t.beatsPerBar*s*.9),this.dynLoopBar++}for(;this.next<this.events.length;){const a=this.events[this.next],o=r+a.beat*s;if(o>=e)return;o>=this.ctx.currentTime-.02&&eg(this.ctx,this.bus,a,Math.max(o,this.ctx.currentTime),a.dur*s),this.next++}if(this.loop++,this.next=0,this.dynLoopBar=0,this.t0+this.loop*n>=e)return}}start(e){const t=()=>this.pump(e.currentTime+1.6);t(),this.timer=setInterval(t,250)}stop(e){setTimeout(()=>{this.timer&&clearInterval(this.timer);try{this.bus.fade.disconnect()}catch{}},e*1e3+200)}}let $i=(()=>{try{return localStorage.getItem("oom-music")!=="0"}catch{return!0}})(),Ti=null,Bs=null,Wi=null,ca=null;function ng(i){ca=i}function La(i,e=3,t=4){if(!ca)return;Wi??(Wi=ca());const{ctx:n}=Wi;if(n.state!=="running")return;const s=n.currentTime;if(Ti){const a=Ti.bus.fade.gain;a.cancelScheduledValues(s),a.setValueAtTime(a.value,s),a.linearRampToValueAtTime(0,s+e),Ti.stop(e),Ti=null}if(!i||!$i)return;const r=new If(n,Wi.dest,Cf[i],s+Math.min(1.2,e*.4));r.bus.fade.gain.setValueAtTime(0,s),r.bus.fade.gain.linearRampToValueAtTime(1,s+t),r.start(n),Ti=r}const li={play(i){Bs===i&&Ti||(Bs=i,La(i))},duck(i,e=2){if(!Ti||!Wi)return;const t=Ti.bus.fade.gain,n=Wi.ctx.currentTime;t.cancelScheduledValues(n),t.setValueAtTime(t.value,n),t.linearRampToValueAtTime(i,n+e)},isOn:()=>$i,toggle(){$i=!$i;try{localStorage.setItem("oom-music",$i?"1":"0")}catch{}return $i&&Bs?La(Bs,.5,2.5):La(null,1.2),$i},unlock(){if(!ca)return;Wi??(Wi=ca());const i=()=>{Bs&&!Ti&&$i&&La(Bs,.1,3)};Wi.ctx.state==="running"?i():Wi.ctx.resume().then(i).catch(()=>{})}};async function ig(i,e,t=44100){const n=new OfflineAudioContext(2,Math.floor(e*t),t),s=new If(n,n.destination,Cf[i],.05);s.bus.fade.gain.value=.5,s.pump(e);const r=await n.startRendering();return[r.getChannelData(0),r.getChannelData(1)]}let os=null,Ji=null,xs=(()=>{try{return localStorage.getItem("oom-muted")==="1"}catch{return!1}})();function _h(){return os||(os=new AudioContext,Ji=os.createGain(),Ji.gain.value=xs?0:.5,Ji.connect(os.destination)),os.state==="suspended"&&os.resume(),os}ng(()=>({ctx:_h(),dest:Ji}));function sg(){return xs}function rg(){xs=!xs;try{localStorage.setItem("oom-muted",xs?"1":"0")}catch{}return Ji&&(Ji.gain.value=xs?0:.5),xs}function Pt(i,e,t="sine",n=.3,s,r=0){const a=_h(),o=a.currentTime+r,c=a.createOscillator(),l=a.createGain();c.type=t,c.frequency.setValueAtTime(i,o),s&&c.frequency.exponentialRampToValueAtTime(s,o+e),l.gain.setValueAtTime(1e-4,o),l.gain.exponentialRampToValueAtTime(n,o+.01),l.gain.exponentialRampToValueAtTime(1e-4,o+e),c.connect(l).connect(Ji),c.start(o),c.stop(o+e+.05)}function zs(i,e=.3,t=1200,n=0){const s=_h(),r=s.currentTime+n,a=s.createBuffer(1,Math.floor(s.sampleRate*i),s.sampleRate),o=a.getChannelData(0);for(let h=0;h<o.length;h++)o[h]=(Math.random()*2-1)*(1-h/o.length);const c=s.createBufferSource();c.buffer=a;const l=s.createBiquadFilter();l.type="lowpass",l.frequency.value=t;const d=s.createGain();d.gain.value=e,c.connect(l).connect(d).connect(Ji),c.start(r)}const Je={click:()=>Pt(660,.06,"triangle",.15),hover:()=>Pt(1200,.03,"sine",.04),select:()=>{Pt(520,.08,"triangle",.18),Pt(780,.1,"triangle",.12,void 0,.05)},play:()=>{zs(.25,.15,3e3),Pt(300,.25,"sine",.2,600)},summon:()=>{Pt(220,.3,"triangle",.25,440),Pt(330,.35,"sine",.15,660,.05)},spell:()=>{for(let i=0;i<4;i++)Pt(600+i*200,.15,"sine",.12,1200+i*200,i*.04)},move:()=>zs(.12,.12,600),hit:()=>{zs(.15,.35,1800),Pt(140,.15,"square",.12,70)},bigHit:()=>{zs(.4,.5,900),Pt(90,.5,"sawtooth",.25,40)},death:()=>{Pt(300,.5,"sawtooth",.15,60),zs(.3,.2,500)},heal:()=>{Pt(660,.2,"sine",.15,990),Pt(880,.25,"sine",.1,1320,.08)},barrier:()=>Pt(1500,.3,"triangle",.15,700),freeze:()=>{for(let i=0;i<3;i++)Pt(2e3-i*300,.12,"sine",.08,void 0,i*.05)},buff:()=>Pt(440,.2,"triangle",.15,880),pass:()=>Pt(330,.12,"triangle",.15,250),yourTurn:()=>{Pt(523,.15,"sine",.2),Pt(784,.25,"sine",.2,void 0,.1)},round:()=>{Pt(392,.3,"triangle",.2),Pt(523,.3,"triangle",.2,void 0,.12),Pt(659,.4,"triangle",.2,void 0,.24)},orb:()=>{Pt(880,.6,"sine",.15,440),Pt(1320,.5,"sine",.08,660)},victory:()=>[523,659,784,1046].forEach((i,e)=>Pt(i,.5,"triangle",.25,void 0,e*.15)),defeat:()=>[392,349,311,262].forEach((i,e)=>Pt(i,.6,"sawtooth",.12,void 0,e*.2)),levelUp:()=>{[392,523,659,784,1046].forEach((i,e)=>Pt(i,.35,"triangle",.2,void 0,e*.07)),zs(.6,.15,4e3,.3)},error:()=>Pt(160,.15,"square",.1),emote:()=>Pt(990,.1,"sine",.12,1320)},at=i=>i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),ag=["Arrival","Last Breath","Freeze","Root","Barrier","Swift","Ready","Sacrifice","Drain","Siege","Flying","Guardian","Deadly","Regenerate"];function og(i){let e=at(i);for(const t of ag)e=e.replace(new RegExp(`\\b(${t})\\b`,"g"),"<b>$1</b>");return e}function lg(i){return i.map(e=>`<span class="kw" title="${at(As[e].text)}">${As[e].icon} ${As[e].name}</span>`).join(" ")}function An(i,e={}){const t=bn[i.color],n=e.cost??i.cost,s=n<i.cost?"cheaper":n>i.cost?"pricier":"",r=(e.unit?e.unit.kw:i.kw)??[],a=!!(i.champion||i.levelOf),o=a?i.levelOf?"★★ Champion":"★ Champion":i.type==="unit"?"Unit":i.type==="spell"?"Spell":"Order";let c="";if(i.type==="unit"){const l=e.unit?e.unit.atk+e.unit.tempAtk:i.atk,d=e.unit?e.unit.hp:i.hp,h=l>i.atk?"up":l<i.atk?"down":"",f=e.unit&&d<e.unit.maxHp?"down":d>i.hp?"up":"",p=i.speed??2,_=i.range??1;c=`<div class="stats">
      <span class="atk ${h}">${l}</span>
      <span class="mini">${p!==2?`<i title="Speed">👣${p}</i>`:""}${_>1?`<i title="Range">🎯${_}</i>`:""}</span>
      <span class="hp ${f}">${d}</span></div>`}return`<div class="card ${i.color} ${i.type} ${a?"champion":""} ${e.extraClass??""}" style="--col:${t.hex}" ${e.iid!==void 0?`data-iid="${e.iid}"`:""}>
    <div class="cost ${s}">${n}</div>
    <div class="art"><span>${i.icon}</span></div>
    <div class="name">${at(i.name)}</div>
    <div class="type">${o} · ${t.name}${i.token&&!i.levelOf?" · Token":""}</div>
    <div class="text">${r.length?`<div class="kws">${lg(r)}</div>`:""}${og(i.text)}${!i.text&&!r.length&&i.flavor?`<i class="flavor">${at(i.flavor)}</i>`:""}</div>
    ${c}
  </div>`}function cg(){return'<div class="card back"><div class="back-orb"></div></div>'}function hg(i){return i.map(e=>`<div class="kwhelp"><b>${As[e].icon} ${As[e].name}</b> ${at(As[e].text)}</div>`).join("")}const ug=[[/\bArrival\b/,"✨ Arrival","Happens when you play this unit from your hand."],[/\bLast Breath\b/,"🕯️ Last Breath","Happens when this unit dies."],[/\bFreeze\b/,"❄️ Freeze","The unit loses its next order (this round if it hasn't acted yet, otherwise next round)."],[/\bRoot\b/,"🕸️ Root","The unit can't move, but can still attack."],[/\bReady\b/,"🔁 Ready","The unit can be ordered again this round, even if it already acted or was just summoned."],[/\b[Ss]acrifice\b/,"🩸 Sacrifice","Destroy one of your own units."],[/\bReturn\b.*\bhand\b/,"🌊 Return","Send the unit back to its owner's hand. Damage and buffs are lost."],[/empty mana crystal/,"💎 Empty mana crystal","Raises your max mana by 1 (up to 10). It refills next round."],[/\bLevel up\b/,"⭐ Level up","When the condition is met while this champion is on the board, it transforms into its stronger form and fully heals."]];function uc(i,e=i.kw??[]){const t=ug.filter(([s])=>s.test(i.text)).map(([,s,r])=>`<div class="kwhelp"><b>${s}</b> ${at(r)}</div>`).join(""),n=[];return(i.range??1)>1&&n.push(`<div class="kwhelp"><b>🏹 Ranged ${i.range}</b> Attacks units up to ${i.range} hexes away. Melee units can't strike back.</div>`),i.speed&&i.speed!==2&&n.push(`<div class="kwhelp"><b>👣 Speed ${i.speed}</b> Moves up to ${i.speed} hexes per order (normal is 2).</div>`),i.type==="order"&&n.push('<div class="kwhelp"><b>📜 Order</b> Like a spell, but it commands your units. Can be paid with spell mana.</div>'),hg(e)+n.join("")+t}function dg(i,e){const t=document.createElement("div");t.className="hover-card floating",document.body.appendChild(t);let n=null;const s=a=>{const o=a.dataset.id;if(!o)return;n=a;const c=Ye(o),l=c.champion?An(Ye(c.champion.to),{extraClass:"big"}):"";t.innerHTML=`<div class="hc-row">${An(c,{extraClass:"big"})}${l}</div><div class="hc-help">${uc(c)}</div>`,t.classList.add("show");const d=a.getBoundingClientRect(),h=t.offsetWidth,f=t.offsetHeight,p=d.right+12+h<=innerWidth?d.right+12:Math.max(8,d.left-12-h);t.style.left=`${p}px`,t.style.top=`${Math.min(Math.max(8,d.top+d.height/2-f/2),innerHeight-f-8)}px`},r=()=>{n=null,t.classList.remove("show")};return i.addEventListener("mouseover",a=>{const o=a.target.closest(e);o&&o!==n&&i.contains(o)?s(o):o||r()}),i.addEventListener("mouseleave",r),i.addEventListener("click",()=>requestAnimationFrame(()=>{n&&!n.isConnected&&r()})),()=>t.remove()}const Df="oom-custom-decks";function xh(){try{const i=JSON.parse(localStorage.getItem(Df)??"[]");return Array.isArray(i)?i.filter(e=>e&&e.id&&Array.isArray(e.cards)):[]}catch{return[]}}function Lf(i){try{localStorage.setItem(Df,JSON.stringify(i))}catch{}}function fg(i){const e=xh().filter(t=>t.id!==i.id);e.push(i),Lf(e)}function pg(i){Lf(xh().filter(e=>e.id!==i))}function yh(){const i=Vn.map(t=>({id:t.id,name:t.name,archetype:t.archetype,colors:t.colors,icon:Ye(t.signature).icon,cards:t.cards,custom:!1,blurb:t.blurb,howToPlay:t.howToPlay})),e=xh().map(t=>({id:t.id,name:t.name,archetype:"Custom",colors:oa(t.cards),icon:Tf(t.cards),cards:t.cards,custom:!0,blurb:"Your own creation.",howToPlay:"Build it, battle with it, tweak it, repeat."}));return[...i,...e]}function bh(i){const e=yh();return e.find(t=>t.id===i)??e[0]}function kf(i){const e=bh(i);return e.custom?{customDeck:{id:e.id,name:e.name,cards:e.cards}}:{deckId:e.id}}const mg=["ember","tide","grove","dawn","dusk"];function uu(i,e,t){const n=e?structuredClone(e):{id:`custom_${Date.now()}`,name:"My Deck",cards:[]};let s="all",r=-1,a="";const o=document.createElement("div");o.className="builder",i.appendChild(o);const c=dg(o,".b-card, .b-row"),l=y=>{c(),o.remove(),t(y)},d=y=>{var x;return((x=n.cards.find(([g])=>g===y))==null?void 0:x[1])??0};function h(y){const x=Ye(y);if(cu(n.cards)>=dr)return p(`Decks hold exactly ${dr} cards.`);if(d(y)>=Zr)return p(`Max ${Zr} copies per card.`);const g=oa(n.cards);if(!g.includes(x.color)&&g.length>=_s)return p(`Decks can use at most ${_s} colors.`);const T=n.cards.find(([A])=>A===y);T?T[1]++:n.cards.push([y,1]),Je.click(),_()}function f(y){const x=n.cards.find(([g])=>g===y);x&&(x[1]--,x[1]<=0&&(n.cards=n.cards.filter(([g])=>g!==y)),Je.pass(),_())}function p(y){Je.error();const x=o.querySelector(".b-msg");x.textContent=y,x.classList.remove("flash"),x.offsetWidth,x.classList.add("flash")}function _(){const y=oa(n.cards),x=Ef.filter(P=>!P.token).filter(P=>s==="all"||P.color===s).filter(P=>r<0||(r>=7?P.cost>=7:P.cost===r)).filter(P=>!a||(P.name+" "+P.text+" "+(P.kw??[]).join(" ")).toLowerCase().includes(a)).sort((P,E)=>P.cost-E.cost||P.name.localeCompare(E.name)),g=cu(n.cards),T=Array.from({length:8},(P,E)=>n.cards.reduce((R,[B,Z])=>R+(Math.min(7,Ye(B).cost)===E?Z:0),0)),A=Math.max(4,...T),S={unit:0,spell:0,order:0};for(const[P,E]of n.cards)S[Ye(P).type]+=E;const O=Po(n.cards),k=[...n.cards].sort((P,E)=>Ye(P[0]).cost-Ye(E[0]).cost||Ye(P[0]).name.localeCompare(Ye(E[0]).name));o.innerHTML=`
      <div class="panel b-pool">
        <div class="b-filters">
          <button class="btn small ${s==="all"?"":"ghost"}" data-color="all">All</button>
          ${mg.map(P=>`<button class="btn small ${s===P?"":"ghost"} ${y.length>=_s&&!y.includes(P)?"locked":""}" data-color="${P}"><i class="dot" style="--c:${bn[P].hex}"></i> ${bn[P].name}</button>`).join("")}
          <span class="b-costs">${[-1,0,1,2,3,4,5,6,7].map(P=>`<button class="cost-btn ${r===P?"on":""}" data-cost="${P}">${P<0?"Any":P>=7?"7+":P}</button>`).join("")}</span>
          <input class="b-search" placeholder="Search name or text…" value="${at(a)}">
        </div>
        <div class="b-hint dim">Click a card to add it. Right-click (or click its row on the right) to remove. ${Zr} copies max, ${_s} colors max.</div>
        <div class="b-grid">${x.map(P=>{const E=d(P.id);return`<div class="b-card ${!y.includes(P.color)&&y.length>=_s?"blocked":""} ${E?"in":""}" data-id="${P.id}">${An(P)}${E?`<span class="count">×${E}</span>`:""}</div>`}).join("")}</div>
      </div>
      <div class="panel b-deck">
        <input class="b-name" maxlength="30" value="${at(n.name)}">
        <div class="b-summary">
          <span class="b-total ${g===dr?"ok":""}">${g}/${dr}</span>
          <span>${y.map(P=>`<i class="dot" style="--c:${bn[P].hex}"></i>`).join(" ")}</span>
          <span class="dim">${S.unit} units · ${S.spell} spells · ${S.order} orders</span>
        </div>
        <div class="b-curve">${T.map((P,E)=>`<div class="bar"><div class="fill" style="height:${P/A*100}%"></div><span>${P||""}</span><b>${E>=7?"7+":E}</b></div>`).join("")}</div>
        <div class="b-list">${k.map(([P,E])=>{const R=Ye(P);return`<div class="b-row" data-id="${P}" style="--col:${bn[R.color].hex}"><span class="c">${R.cost}</span><span class="nm">${R.icon} ${at(R.name)}</span><span class="n">×${E}</span></div>`}).join("")||'<p class="dim">Your deck is empty. Click cards on the left to add them, or start from a prebuilt deck below.</p>'}</div>
        <div class="b-msg"></div>
        <div class="b-actions">
          <select class="b-template"><option value="">Start from a prebuilt deck…</option>${Vn.map(P=>`<option value="${P.id}">${at(P.name)} (${P.archetype})</option>`).join("")}</select>
          <div class="row">
            <button class="btn ghost small b-clear">Clear</button>
            <button class="btn ghost b-cancel">Cancel</button>
            <button class="btn b-save" ${O?"disabled":""} title="${at(O??"Save deck")}">Save Deck</button>
          </div>
          ${O&&g>0?`<div class="dim small-note">${at(O)}</div>`:""}
        </div>
      </div>`,o.querySelectorAll("[data-color]").forEach(P=>P.onclick=()=>{s=P.dataset.color,_()}),o.querySelectorAll("[data-cost]").forEach(P=>P.onclick=()=>{r=Number(P.dataset.cost),_()});const U=o.querySelector(".b-search");U.oninput=()=>{a=U.value.toLowerCase();const P=U.selectionStart;_();const E=o.querySelector(".b-search");E.focus(),E.setSelectionRange(P,P)},o.querySelectorAll(".b-card").forEach(P=>{P.onclick=()=>h(P.dataset.id),P.oncontextmenu=E=>{E.preventDefault(),f(P.dataset.id)}}),o.querySelectorAll(".b-row").forEach(P=>{P.onclick=()=>f(P.dataset.id),P.oncontextmenu=E=>{E.preventDefault(),h(P.dataset.id)}}),o.querySelector(".b-name").oninput=P=>{n.name=P.target.value||"My Deck"},o.querySelector(".b-template").onchange=P=>{const E=Vn.find(R=>R.id===P.target.value);E&&(n.cards=E.cards.map(([R,B])=>[R,B]),n.name=`${E.name} Remix`,Je.select(),_())},o.querySelector(".b-clear").onclick=()=>{n.cards=[],_()},o.querySelector(".b-cancel").onclick=()=>l(null),o.querySelector(".b-save").onclick=()=>{Po(n.cards)||(fg(n),Je.select(),l(n.id))}}_()}const du=20,fu=10,Of=3,pu=10,gg=4;function mu(i,e){for(let t=i.length-1;t>0;t--){const n=Math.floor(e()*(t+1));[i[t],i[n]]=[i[n],i[t]]}return i}const vg=i=>!!i&&"uid"in i;class gu extends Error{}class gr{constructor(e){this.events=[],this.s=e}static create(e,t,n=Math.random()*2**31|0){const s={round:0,phase:"mulligan",turn:0,initiative:0,passes:0,players:[],units:[],nextId:1,winner:null,seed:n,log:[],lastPlayed:null},r=new gr(s);for(const a of[e,t]){let o=typeof a.deck=="string"?la(a.deck):a.deck;Po(o.cards)&&(o=la(""));const c=[];for(const[d,h]of o.cards)for(let f=0;f<h;f++)c.push(d);const l={name:a.name,deckId:o.id,deckName:o.name,deckColors:oa(o.cards),deckIcon:Tf(o.cards),deck:mu(c,()=>r.rand()),hand:[],mana:0,maxMana:0,spellMana:0,sanctum:du,fatigue:0,mulliganDone:!1,graveyard:[],isAI:a.isAI,spellsCast:0,sanctumDamageDealt:0,alliesLost:0};s.players.push(l)}s.initiative=r.rand()<.5?0:1,s.turn=s.initiative;for(let a=0;a<2;a++)r.draw(a,gg,!0);return r.events=[],r}clone(){return new gr(structuredClone(this.s))}rand(){let e=this.s.seed=this.s.seed+1831565813|0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}pick(e){return e[Math.floor(this.rand()*e.length)]}unit(e){return this.s.units.find(t=>t.uid===e)}unitAt(e){return this.s.units.find(t=>t.c===e.c&&t.r===e.r&&t.hp>0)}isEmpty(e){return wf(e)&&!this.unitAt(e)}unitsOf(e){return this.s.units.filter(t=>t.owner===e&&t.hp>0)}adjacentUnits(e){return ol(e).map(t=>this.unitAt(t)).filter(t=>!!t)}power(e){return Math.max(0,e.atk+e.tempAtk)}has(e,t){return e.kw.includes(t)}tUnit(e){return vg(e)?this.unit(e.uid):void 0}isRooted(e){return e.rootedUntil>=this.s.round}isFrozen(e){return e.frozenUntil>=this.s.round}canAct(e){return e.hp>0&&!e.exhausted&&(e.summonedRound!==this.s.round||this.has(e,"swift"))}isDeployHex(e,t){return Ts(e).includes(t.r)&&this.isEmpty(t)}emptyDeployHexes(e){return aa.filter(t=>this.isDeployHex(e,t))}randomEmptyNeighbor(e){const t=ol(e).filter(n=>this.isEmpty(n));return t.length?this.pick(t):void 0}cost(e,t){const n=Ye(t.cardId);let s=n.cost+t.costMod;if(n.type!=="unit")for(const r of this.unitsOf(e))s-=Ye(r.cardId).spellDiscount??0;return Math.max(0,s)}canAfford(e,t){const n=this.s.players[e],s=this.cost(e,t);return Ye(t.cardId).type==="unit"?n.mana>=s:n.mana+n.spellMana>=s}specs(e){var r;const t=e.targets??[];if(e.type!=="unit")return t;const n=(r=e.kw)==null?void 0:r.includes("infiltrate");return[{kind:"hex",prompt:n?"Summon anywhere in your half":"Choose a hex in your deployment zone",hexFilter:n?(a,o,c)=>Gm(c).includes(o.r):(a,o,c)=>Ts(c).includes(o.r)},...t]}candidates(e,t,n,s){const r=this.specs(t)[s];return r.kind==="hex"?aa.filter(a=>this.isEmpty(a)&&(!r.hexFilter||r.hexFilter(this,a,e,n))).map(a=>({c:a.c,r:a.r})):this.s.units.filter(a=>a.hp>0).filter(a=>r.side==="any"||!r.side||(r.side==="friendly"?a.owner===e:a.owner!==e)).filter(a=>!r.filter||r.filter(this,a,e,n)).map(a=>({uid:a.uid}))}validTarget(e,t,n,s,r){const a=this.specs(t)[s];return r===null?!!a.optional:this.candidates(e,t,n,s).some(o=>JSON.stringify(o)===JSON.stringify(r))}playable(e,t){if(this.s.phase!=="action"||this.s.turn!==e||!this.canAfford(e,t))return!1;const n=Ye(t.cardId),s=this.specs(n);if(s.length===0)return!0;const r=this.candidates(e,n,[],0);return r.length===0&&!s[0].optional?!1:s.length>1&&!s[1].optional&&n.type!=="unit"?r.some(a=>this.candidates(e,n,[a],1).length>0):!0}reachable(e){const t=new Map;if(this.isRooted(e))return t;const n=this.has(e,"flying"),s=c=>!n&&this.adjacentUnits(c).some(l=>l.owner!==e.owner&&this.has(l,"guardian")),r={c:e.c,r:e.r},a=new Map([[cn(r),[r]]]);let o=[r];for(let c=0;c<e.speed;c++){const l=[];for(const d of o)if(!(c>0&&s(d)))for(const h of ol(d)){const f=cn(h);if(a.has(f))continue;const p=this.unitAt(h);p&&p.owner!==e.owner&&!n||(a.set(f,[...a.get(cn(d)),h]),l.push(h))}o=l}for(const[c,l]of a){const d=l[l.length-1];l.length>1&&this.isEmpty(d)&&t.set(c,l)}return t}attackTargets(e,t){if(this.power(e)<=0)return[];const n=this.s.units.filter(s=>s.owner!==e.owner&&s.hp>0&&Qn(t,s)<=e.range).map(s=>({uid:s.uid}));return Co(e.owner,e.range,t)&&n.push({sanctum:1-e.owner}),n}act(e,t){this.events=[];try{return this.doAct(e,t)}catch(n){if(n instanceof gu)return{ok:!0,events:this.events};throw n}}doAct(e,t){var s,r,a;const n=this.s;if(n.phase==="over")return{ok:!1,error:"The game is over."};if(t.type==="concede")return this.log(e,`${n.players[e].name} conceded.`),this.endGame(1-e),{ok:!0,events:this.events};if(n.phase==="mulligan"){if(t.type!=="mulligan")return{ok:!1,error:"Choose cards to replace first."};const o=n.players[e];if(o.mulliganDone)return{ok:!1,error:"Already done."};const c=o.hand.filter(d=>t.iids.includes(d.iid));o.hand=o.hand.filter(d=>!t.iids.includes(d.iid));const l=c.length;this.draw(e,l,!0);for(const d of c)o.deck.push(d.cardId);return mu(o.deck,()=>this.rand()),o.mulliganDone=!0,n.players.every(d=>d.mulliganDone)&&this.startRound(),{ok:!0,events:this.events}}if(t.type==="mulligan")return{ok:!1,error:"Not mulligan time."};if(n.turn!==e)return{ok:!1,error:"It's not your action."};if(t.type==="pass")return n.passes++,this.emit({t:"pass",p:e}),n.passes>=2?this.endRound():n.turn=1-e,{ok:!0,events:this.events};if(t.type==="play"){const o=n.players[e],c=o.hand.find(p=>p.iid===t.iid);if(!c)return{ok:!1,error:"Card not in hand."};if(!this.playable(e,c))return{ok:!1,error:"You can't play that now."};const l=Ye(c.cardId),d=this.specs(l),h=t.targets??[];if(h.length!==d.length)return{ok:!1,error:"Wrong number of targets."};for(let p=0;p<d.length;p++)if(!this.validTarget(e,l,h.slice(0,p),p,h[p]))return{ok:!1,error:"Invalid target."};let f=this.cost(e,c);if(l.type!=="unit"){const p=Math.min(o.spellMana,f);o.spellMana-=p,f-=p}if(o.mana-=f,o.hand=o.hand.filter(p=>p!==c),n.lastPlayed={player:e,cardId:l.id},this.emit({t:"play",p:e,cardId:l.id,targets:h}),l.type==="unit"){const p=h[0],_=this.summon(l.id,e,p);this.log(e,`${o.name} summoned {{${l.id}}}.`),_&&l.onPlay&&l.onPlay(this,{p:e,targets:h.slice(1),self:_})}else{this.log(e,`${o.name} played {{${l.id}}}.`),o.spellsCast++,(s=l.onPlay)==null||s.call(l,this,{p:e,targets:h});for(const p of this.unitsOf(e))(a=(r=Ye(p.cardId)).onSpellCast)==null||a.call(r,this,p,l.id)}return this.resolveDeaths(),this.afterAction(e),{ok:!0,events:this.events}}if(t.type==="order"){const o=this.unit(t.uid);if(!o||o.owner!==e)return{ok:!1,error:"Not your unit."};if(!this.canAct(o))return{ok:!1,error:"That unit cannot act right now."};if(!t.to&&!t.attack)return{ok:!1,error:"Nothing to do."};let c={c:o.c,r:o.r},l;if(t.to&&!ra(t.to,c)){if(l=this.reachable(o).get(cn(t.to)),!l)return{ok:!1,error:"Can't move there."};c=t.to}if(t.attack&&!this.attackTargets(o,c).some(h=>JSON.stringify(h)===JSON.stringify(t.attack)))return{ok:!1,error:"Can't attack that from there."};l&&(o.c=c.c,o.r=c.r,this.emit({t:"move",uid:o.uid,path:l})),o.exhausted=!0;const d=`${n.players[e].name}'s {{${o.cardId}}}`;if(t.attack?"sanctum"in t.attack?this.log(e,`${d} attacked the enemy Sanctum.`):this.log(e,`${d} attacked {{${this.unit(t.attack.uid).cardId}}}.`):this.log(e,`${d} moved.`),t.attack)if("sanctum"in t.attack)this.attackSanctum(o,t.attack.sanctum);else{const h=this.unit(t.attack.uid);this.combat(o,h)}return this.resolveDeaths(),this.afterAction(e),{ok:!0,events:this.events}}return{ok:!1,error:"Unknown action."}}checkLevelUps(){for(const e of this.s.units){const t=Ye(e.cardId);if(!t.champion||e.hp<=0)continue;const[n,s]=t.champion.progress(this,e);if(n<s)continue;const r=Ye(t.champion.to),a=e.atk-(t.atk??0),o=e.maxHp-(t.hp??0);e.cardId=r.id,e.atk=(r.atk??0)+a,e.maxHp=(r.hp??1)+o,e.hp=e.maxHp,e.speed=r.speed??2,e.range=r.range??1;for(const c of r.kw??[])e.kw.includes(c)||e.kw.push(c);this.emit({t:"levelUp",uid:e.uid,unit:structuredClone(e)}),this.log(e.owner,`{{${t.id}}} leveled up into {{${r.id}}}!`)}}afterAction(e){this.checkLevelUps(),this.s.phase==="action"&&(this.s.passes=0,this.s.turn=1-e)}startRound(){var t,n;const e=this.s;e.phase="action",e.round++,e.round>1&&(e.initiative=1-e.initiative),e.turn=e.initiative,e.passes=0,this.emit({t:"round",round:e.round,initiative:e.initiative});for(const s of e.players)s.maxMana=Math.min(fu,s.maxMana+1),s.mana=s.maxMana;for(const s of e.units)s.exhausted=this.isFrozen(s);this.draw(e.initiative,1),this.draw(1-e.initiative,1);for(const s of ya){const r=this.unitAt(s);r&&(vh(s)?(e.players[r.owner].mana+=1,this.emit({t:"orbPulse",p:r.owner,orb:s,kind:"mana"})):(this.emit({t:"orbPulse",p:r.owner,orb:s,kind:"attack"}),this.damageSanctum(1-r.owner,1,null)))}for(const s of[...e.units])s.hp>0&&((n=(t=Ye(s.cardId)).onRoundStart)==null||n.call(t,this,s));this.resolveDeaths(),this.checkLevelUps(),e.phase==="action"&&this.log(-1,`Round ${e.round} begins. ${e.players[e.initiative].name} has the initiative.`)}endRound(){var t,n;const e=this.s;for(const s of e.players)s.spellMana=Math.min(Of,s.spellMana+s.mana),s.mana=0;for(const s of[...e.units])s.hp>0&&((n=(t=Ye(s.cardId)).onRoundEnd)==null||n.call(t,this,s));for(const s of e.units)if(s.tempAtk=0,this.has(s,"regenerate")&&s.hp>0&&s.hp<s.maxHp){const r=s.maxHp-s.hp;s.hp=s.maxHp,this.emit({t:"heal",uid:s.uid,amount:r})}this.resolveDeaths(),e.phase==="action"&&this.startRound()}combat(e,t){var r,a;const n=Qn(e,t);this.emit({t:"attack",uid:e.uid,target:{uid:t.uid},ranged:n>1});const s=t.range>=n;this.exchange(e,t,s),(a=(r=Ye(t.cardId)).onAttacked)==null||a.call(r,this,t,e)}fight(e,t){this.emit({t:"attack",uid:e.uid,target:{uid:t.uid},ranged:!1}),this.exchange(e,t,!0)}exchange(e,t,n){const s=this.has(e,"firstStrike"),r=this.has(t,"firstStrike");if(s&&!r)this.dealDamage(t,this.power(e),e),n&&t.hp>0&&this.dealDamage(e,this.power(t),t);else if(r&&!s&&n)this.dealDamage(e,this.power(t),t),e.hp>0&&this.dealDamage(t,this.power(e),e);else{const a=this.power(e),o=this.power(t);this.dealDamage(t,a,e),n&&this.dealDamage(e,o,t)}}attackSanctum(e,t){this.emit({t:"attack",uid:e.uid,target:{sanctum:t},ranged:!1});const n=this.power(e)*(this.has(e,"siege")?2:1);this.damageSanctum(t,n,e)}dealDamage(e,t,n,s){var r,a;return t<=0||e.hp<=0?0:(s&&this.fx(s,e),this.has(e,"barrier")?(e.kw=e.kw.filter(o=>o!=="barrier"),this.emit({t:"barrier",uid:e.uid}),0):(e.hp-=t,this.emit({t:"damage",uid:e.uid,amount:t}),n&&this.has(n,"deadly")&&e.hp>0&&(e.hp=0,this.fx("poison",e)),n&&this.has(n,"drain")&&this.healSanctum(n.owner,t),e.hp>0&&((a=(r=Ye(e.cardId)).onDamaged)==null||a.call(r,this,e,t)),t))}damageSanctum(e,t,n=null){t<=0||this.s.phase==="over"||(this.s.players[e].sanctum-=t,this.s.players[1-e].sanctumDamageDealt+=t,this.emit({t:"sanctumDamage",p:e,amount:t}),n&&this.has(n,"drain")&&this.healSanctum(n.owner,t),this.checkWin())}healSanctum(e,t){const n=this.s.players[e],s=Math.min(t,du-n.sanctum);s<=0||(n.sanctum+=s,this.emit({t:"sanctumHeal",p:e,amount:s}))}heal(e,t){const n=Math.min(t,e.maxHp-e.hp);n<=0||(e.hp+=n,this.emit({t:"heal",uid:e.uid,amount:n}))}buff(e,t,n){e.atk+=t,e.hp+=n,e.maxHp+=n,this.emit({t:"buff",uid:e.uid,atk:t,hp:n})}tempBuff(e,t){e.tempAtk+=t,this.emit({t:"buff",uid:e.uid,atk:t,hp:0})}giveKw(e,t){e.kw.includes(t)||e.kw.push(t),this.emit({t:"buff",uid:e.uid,atk:0,hp:0})}destroy(e){e.hp>0&&(e.hp=0)}freeze(e){e.frozenUntil=this.canAct(e)?this.s.round:this.s.round+1,e.exhausted=!0,this.emit({t:"freeze",uid:e.uid}),this.log(e.owner,`{{${e.cardId}}} was Frozen.`)}root(e,t){e.rootedUntil=Math.max(e.rootedUntil,this.s.round+t-1),this.fx("roots",e)}ready(e){e.exhausted=!1,e.frozenUntil=0,e.summonedRound===this.s.round&&(e.summonedRound=-1),this.emit({t:"ready",uid:e.uid})}bounce(e){this.s.units=this.s.units.filter(n=>n!==e),this.emit({t:"bounce",uid:e.uid});const t=Ye(e.cardId);t.levelOf?this.addToHand(e.owner,t.levelOf,0):t.token||this.addToHand(e.owner,e.cardId,0)}teleport(e,t){this.isEmpty(t)&&(e.c=t.c,e.r=t.r,this.emit({t:"teleport",uid:e.uid,to:t}))}summon(e,t,n){var a,o;if(!this.isEmpty(n))return null;const s=Ye(e),r={uid:this.s.nextId++,cardId:e,owner:t,c:n.c,r:n.r,atk:s.atk??0,hp:s.hp??1,maxHp:s.hp??1,speed:s.speed??2,range:s.range??1,kw:[...s.kw??[]],exhausted:!1,summonedRound:this.s.round,frozenUntil:0,rootedUntil:0,tempAtk:0};this.s.units.push(r),this.emit({t:"summon",uid:r.uid,unit:structuredClone(r)});for(const c of this.unitsOf(t))c!==r&&((o=(a=Ye(c.cardId)).onFriendlySummon)==null||o.call(a,this,c,r));return r}summonInDeploy(e,t,n){for(let s=0;s<n;s++){const r=this.emptyDeployHexes(t);if(!r.length)return;const a=r.filter(o=>o.r===Ts(t)[t===0?1:0]);this.summon(e,t,this.pick(a.length?a:r))}}draw(e,t,n=!1){const s=this.s.players[e];for(let r=0;r<t;r++){const a=s.deck.pop();if(!a){s.fatigue++,this.log(e,`${s.name} has no cards left and takes ${s.fatigue} fatigue damage.`),this.damageSanctum(e,s.fatigue);continue}if(s.hand.length>=pu){n||this.emit({t:"draw",p:e,burned:a});continue}s.hand.push({iid:this.s.nextId++,cardId:a,costMod:0}),n||this.emit({t:"draw",p:e})}}addToHand(e,t,n){const s=this.s.players[e];s.hand.length>=pu||(s.hand.push({iid:this.s.nextId++,cardId:t,costMod:n}),this.emit({t:"draw",p:e}))}gainMaxMana(e,t){const n=this.s.players[e];n.maxMana=Math.min(fu,n.maxMana+t),this.emit({t:"mana",p:e})}fx(e,t,n={}){this.emit({t:"fx",kind:e,at:t?{c:t.c,r:t.r}:null,...n})}resolveDeaths(){var e,t,n;for(let s=0;s<50;s++){const r=this.s.units.filter(a=>a.hp<=0);if(!r.length)break;this.s.units=this.s.units.filter(a=>a.hp>0);for(const a of r){this.emit({t:"death",uid:a.uid});const o=Ye(a.cardId);this.log(a.owner,`${this.s.players[a.owner].name}'s {{${a.cardId}}} died.`),!o.token&&!o.levelOf&&this.s.players[a.owner].graveyard.push(a.cardId),o.levelOf&&this.s.players[a.owner].graveyard.push(o.levelOf),this.s.players[a.owner].alliesLost++,(e=o.onDeath)==null||e.call(o,this,a);for(const c of[...this.s.units])c.hp>0&&((n=(t=Ye(c.cardId)).onUnitDeath)==null||n.call(t,this,c,a))}}this.checkWin()}checkWin(){if(this.s.phase==="over")return;const[e,t]=this.s.players.map(n=>n.sanctum<=0);e&&t?this.endGame(-1):e?this.endGame(1):t&&this.endGame(0)}endGame(e){throw this.s.phase="over",this.s.winner=e,this.emit({t:"gameOver",winner:e}),this.log(-1,e===-1?"The game is a draw!":`${this.s.players[e].name} wins!`),new gu}log(e,t){this.s.log.push({p:e,text:t,round:this.s.round}),this.s.log.length>150&&this.s.log.shift()}emit(e){this.events.push(e)}}function _g(i,e){const t=structuredClone(i);return t.seed=0,t.players.forEach((n,s)=>{n.deck=n.deck.map(()=>"?"),s!==e&&(n.hand=n.hand.map(r=>({iid:r.iid,cardId:"?",costMod:0})))}),t}function xg(i,e){return i.map(t=>t.t==="draw"&&t.p!==e&&t.burned?{...t,burned:t.burned}:t)}const ht=(i,e)=>i.querySelector(e);class yg{constructor(e,t,n,s,r){this.room=e,this.scene=t,this.onExit=s,this.currentDeckId=r,this.seat=0,this.view=null,this.queue=[],this.animating=!1,this.mode={kind:"idle"},this.deadline=0,this.connected=[!0,!0],this.emotes=[],this.vsAI=!1,this.roomId="",this.hoverHex=null,this.hoverSanctum=null,this.mulliganPick=new Set,this.mullOld=null,this.mullReplaced=new Set,this.mullSent=!1,this.mullRevealTimer=null,this.disposed=!1,this.rematchSent=!1,this.seenCards=new Set,this.previewCard=null,this.keyHandler=()=>{},this.wheelHandler=a=>{var _,y;const o=this.root.querySelector(".hover-card.show"),c=a.target;if(!o||(_=c==null?void 0:c.closest)!=null&&_.call(c,".modal, .emote-list")||(y=c==null?void 0:c.closest)!=null&&y.call(c,".log")&&!c.closest(".logcard"))return;const l=[...o.querySelectorAll(".card.big .text")].filter(x=>x.scrollHeight>x.clientHeight+1),d=o.querySelector(".hc-help"),h=a.deltaMode===1?a.deltaY*16:a.deltaY,f=x=>h>0?x.scrollTop+x.clientHeight<x.scrollHeight-1:x.scrollTop>0,p=l.some(f)?l:d&&f(d)?[d]:[];if(p.length){a.preventDefault();for(const x of p)x.scrollTop+=h*.5;this.markOverflow(o)}},this.canActUnit=a=>!!this.view&&this.view.phase==="action"&&this.g.canAct(a),this.root=document.createElement("div"),this.root.className="game",n.innerHTML="",n.appendChild(this.root),this.root.innerHTML=`
      <div class="pinfo opp"></div>
      <div class="opp-hand"></div>
      <div class="corner-btns">
        <div class="round-info"></div>
        <button class="icon-btn btn-log" title="Battle log">📜</button>
        <button class="icon-btn btn-music ${li.isOn()?"":"off"}" title="Music">🎵</button>
        <button class="icon-btn btn-mute" title="Sound">${sg()?"🔇":"🔊"}</button>
        <button class="icon-btn btn-help" title="How to play">❔</button>
        <button class="icon-btn btn-menu" title="Concede / leave">🏳️</button>
      </div>
      <div class="prompt hidden"><span class="prompt-text"></span><button class="btn small btn-skip hidden">Skip</button><button class="btn small ghost btn-cancel">Cancel</button></div>
      <div class="banner"></div>
      <div class="cast-show"></div>
      <div class="pass-wrap"><svg class="timer" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46"></circle></svg><button class="pass-btn"></button><div class="timer-num"></div><div class="init" title="The player with the initiative acts first this round. It swaps every round."></div></div>
      <div class="pinfo me"></div>
      <div class="hand"></div>
      <div class="hover-card"></div>
      <div class="forecast hidden"></div>
      <div class="log hidden"></div>
      <div class="emote-wrap"><button class="icon-btn btn-emote" title="Emotes">💬</button><div class="emote-list hidden"></div></div>
      <div class="bubble opp-bubble hidden"></div>
      <div class="bubble me-bubble hidden"></div>
      <div class="toast"></div>
      <div class="overlay hidden"></div>
      <div class="help-modal hidden"></div>`,this.bindDOM(),this.bindRoom(),this.bindScene(),this.timerInt=setInterval(()=>this.renderTimer(),250),this.showOverlay('<div class="panel waiting"><h2>Connecting…</h2></div>')}bindDOM(){const e=this.root;ht(e,".pass-btn").onclick=()=>this.pass(),ht(e,".btn-cancel").onclick=()=>{this.setMode({kind:"idle"}),Je.click()},ht(e,".btn-skip").onclick=()=>this.pickTarget(null),ht(e,".btn-log").onclick=()=>ht(e,".log").classList.toggle("hidden"),ht(e,".btn-mute").onclick=t=>{t.target.textContent=rg()?"🔇":"🔊"},ht(e,".btn-music").onclick=t=>{t.target.classList.toggle("off",!li.toggle())},ht(e,".btn-help").onclick=()=>this.toggleHelp(),ht(e,".btn-menu").onclick=()=>this.confirmLeave(),ht(e,".btn-emote").onclick=()=>ht(e,".emote-list").classList.toggle("hidden"),this.keyHandler=t=>{var n;((n=t.target)==null?void 0:n.tagName)!=="INPUT"&&(t.code==="Space"&&(t.preventDefault(),this.pass()),t.code==="Escape"&&(ht(this.root,".help-modal").classList.add("hidden"),this.setMode({kind:"idle"})))},window.addEventListener("keydown",this.keyHandler),window.addEventListener("wheel",this.wheelHandler,{passive:!1})}markOverflow(e){for(const t of e.querySelectorAll(".card.big .text"))t.classList.toggle("more-below",t.scrollTop+t.clientHeight<t.scrollHeight-1),t.classList.toggle("more-above",t.scrollTop>0)}bindRoom(){const e=this.room;e.onMessage("seat",t=>{this.seat=t.seat,this.vsAI=t.vsAI,this.roomId=t.roomId,this.emotes=t.emotes,this.scene.setSeat(t.seat),ht(this.root,".emote-list").innerHTML=t.emotes.map((n,s)=>`<button data-i="${s}">${at(n)}</button>`).join(""),ht(this.root,".emote-list").querySelectorAll("button").forEach(n=>n.onclick=()=>{e.send("emote",Number(n.dataset.i)),ht(this.root,".emote-list").classList.add("hidden")})}),e.onMessage("waiting",t=>{this.showOverlay(`<div class="panel waiting">
        <div class="spinner"></div>
        <h2>Waiting for an opponent…</h2>
        <p>Share this match code with a friend:</p>
        <div class="code" title="Click to copy">${at(t.roomId)}</div>
        <p class="dim">Or keep waiting for someone to join from Quick Match.</p>
        <button class="btn ghost btn-leave">Cancel</button></div>`);const n=this.root.querySelector(".code");n.onclick=()=>{var s;(s=navigator.clipboard)==null||s.writeText(t.roomId),this.toast("Code copied!")},this.root.querySelector(".btn-leave").onclick=()=>this.exit()}),e.onMessage("state",t=>{this.queue.push(t),this.pump()}),e.onMessage("deadline",t=>{this.deadline=t}),e.onMessage("error",t=>{Je.error(),this.toast(t)}),e.onMessage("emote",t=>this.showEmote(t.seat,t.text)),e.onMessage("opponentStatus",t=>{t.seat!==this.seat&&this.toast(t.connected?"Opponent reconnected.":"Opponent disconnected… waiting up to 60s.")}),e.onMessage("opponentLeft",()=>this.toast("Your opponent left the room.")),e.onMessage("rematchStatus",t=>{const n=this.root.querySelector(".rematch-status");n&&(n.textContent=t[1-this.seat]?"Opponent wants a rematch!":t[this.seat]?"Waiting for opponent…":"")}),e.onLeave(()=>{this.disposed||this.toast("Disconnected from server.")})}bindScene(){const e=this.scene;e.setMenuMode(!1),li.play("battle"),e.onHexClick=t=>this.hexClick(t),e.onHexHover=t=>{this.hoverHex=t,this.updateHover(),this.updateHighlights()},e.onSanctumClick=t=>this.sanctumClick(t),e.onSanctumHover=t=>{this.hoverSanctum=t,this.updateHover(),this.updateGuide()},e.onRightClick=()=>{this.mode.kind!=="idle"&&(this.setMode({kind:"idle"}),Je.click())}}dispose(){this.disposed=!0,clearInterval(this.timerInt),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("wheel",this.wheelHandler),this.scene.onHexClick=()=>{},this.scene.onHexHover=()=>{},this.scene.onSanctumClick=()=>{},this.scene.onSanctumHover=()=>{},this.scene.setMenuMode(!0)}exit(){this.dispose();try{sessionStorage.removeItem("oom-reconnect")}catch{}this.room.leave(!0).catch(()=>{}),this.onExit()}get g(){return new gr(this.view)}get me(){return this.view.players[this.seat]}get opp(){return this.view.players[1-this.seat]}get myTurn(){return!!this.view&&this.view.phase==="action"&&this.view.turn===this.seat&&!this.animating}async pump(){var e,t;if(!this.animating)for(;this.queue.length;){const n=this.queue.shift(),s=!this.view;if(this.seat=n.seat,this.deadline=n.deadline,this.connected=n.connected,s){this.scene.setSeat(n.seat),this.hideOverlay();let o="1";try{o=localStorage.getItem("oom-help-seen")??"",localStorage.setItem("oom-help-seen","1")}catch{}o||setTimeout(()=>this.toggleHelp(),300)}const r=(e=this.view)==null?void 0:e.turn,a=(t=this.view)==null?void 0:t.phase;if(this.view&&n.events.length&&!s){this.animating=!0,this.setMode({kind:"idle"},!1),this.render();for(const o of n.events){if(this.disposed)return;await this.beforeEvent(o,n.view),await this.scene.play(o,n.view,this.seat)}this.animating=!1}if(n.events.some(o=>o.t==="fx"&&o.kind==="start")&&(this.rematchSent=!1,this.mullSent=!1,this.mullOld=null,this.hideOverlay(),li.duck(1,3),this.scene.setMenuMode(!0),this.scene.setMenuMode(!1)),this.view=n.view,this.scene.sync(this.view,this.seat,this.myTurn,this.canActUnit),this.mode.kind!=="idle"&&this.setMode({kind:"idle"},!1),this.render(),this.view.phase==="action"&&this.view.turn===this.seat&&(r!==this.seat||a!=="action")&&!s&&Je.yourTurn(),s&&this.view.phase==="action"&&this.banner(`Round ${this.view.round}`,this.view.initiative===this.seat?"You have the initiative":"Opponent has the initiative"),this.room.reconnectionToken)try{sessionStorage.setItem("oom-reconnect",this.room.reconnectionToken)}catch{}}}async beforeEvent(e,t){switch(e.t){case"round":Je.round(),this.banner(`Round ${e.round}`,e.initiative===this.seat?"You have the initiative":"Opponent has the initiative"),await this.scene.wait(900);break;case"play":{Je.play();const n=Ye(e.cardId);e.p!==this.seat?(this.castShow(e.cardId,"Opponent played"),await this.scene.wait(n.type==="unit"?900:1300)):n.type!=="unit"&&(this.castShow(e.cardId,"You cast"),await this.scene.wait(450));break}case"pass":Je.pass(),e.p!==this.seat&&this.toast(t.phase==="action"&&t.round===this.view.round?"Opponent passed. Your move: act, or pass to end the round.":"Opponent passed.");break;case"draw":e.burned&&this.toast(`${e.p===this.seat?"Your":"Opponent's"} hand is full! ${Ye(e.burned).name} was burned.`);break;case"levelUp":this.banner(Ye(e.unit.cardId).name,`${e.unit.owner===this.seat?"Your":"Opponent's"} champion leveled up!`);break;case"gameOver":await this.scene.wait(500);break}}pass(){this.myTurn&&this.send({type:"pass"})}send(e){this.setMode({kind:"idle"},!1),this.room.send("action",e),Je.click()}setMode(e,t=!0){this.mode=e,t&&this.render(),this.updateHighlights(),this.updatePrompt()}clickCard(e){if(!this.view||this.view.phase==="mulligan")return;if(this.mode.kind==="card"&&this.mode.iid===e){const n=this.me.hand.find(s=>s.iid===e);if(this.g.specs(Ye(n.cardId)).length===0){this.send({type:"play",iid:e,targets:[]});return}this.setMode({kind:"idle"});return}if(!this.myTurn){this.toast("Wait for your action."),Je.error();return}const t=this.me.hand.find(n=>n.iid===e);if(t){if(!this.g.playable(this.seat,t)){Je.error(),this.toast(this.g.canAfford(this.seat,t)?"No valid targets.":"Not enough mana.");return}Je.select(),this.setMode({kind:"card",iid:e,targets:[]})}}currentSpec(){if(this.mode.kind!=="card")return null;const e=this.me.hand.find(r=>r.iid===this.mode.iid);if(!e)return null;const t=Ye(e.cardId),n=this.g.specs(t),s=this.mode.targets.length;return{d:t,specs:n,i:s,spec:n[s],cands:s<n.length?this.g.candidates(this.seat,t,this.mode.targets,s):[]}}pickTarget(e){if(this.mode.kind!=="card")return;const t=this.currentSpec();if(!t)return;const n=[...this.mode.targets,e];if(Je.select(),n.length>=t.specs.length){this.send({type:"play",iid:this.mode.iid,targets:n});return}if(this.g.candidates(this.seat,t.d,n,n.length).length===0&&t.specs[n.length].optional){const r=[...n];for(;r.length<t.specs.length&&t.specs[r.length].optional&&this.g.candidates(this.seat,t.d,r,r.length).length===0;)r.push(null);if(r.length>=t.specs.length){this.send({type:"play",iid:this.mode.iid,targets:r});return}this.setMode({kind:"card",iid:this.mode.iid,targets:r});return}this.setMode({kind:"card",iid:this.mode.iid,targets:n})}hexClick(e){if(!this.view||this.view.phase!=="action")return;const t=this.g,n=t.unitAt(e);if(this.mode.kind==="card"){const s=this.currentSpec();if(!s)return;const r=s.cands.find(a=>a&&"uid"in a?n&&a.uid===n.uid:a&&"c"in a&&ra(a,e));r?this.pickTarget(r):Je.error();return}if(this.myTurn){if(this.mode.kind==="unit"){const s=t.unit(this.mode.uid);if(!s){this.setMode({kind:"idle"});return}const r=this.mode.moveTo??{c:s.c,r:s.r},a=t.reachable(s);if(n&&n.owner!==this.seat){if(t.attackTargets(s,r).some(l=>"uid"in l&&l.uid===n.uid)){this.send({type:"order",uid:s.uid,to:this.mode.moveTo,attack:{uid:n.uid}});return}let o=null,c=99;for(const[,l]of a){const d=l[l.length-1];t.attackTargets(s,d).some(h=>"uid"in h&&h.uid===n.uid)&&l.length<c&&(o=d,c=l.length)}if(o){this.send({type:"order",uid:s.uid,to:o,attack:{uid:n.uid}});return}Je.error(),this.toast("Can't reach that unit this action.");return}if(n&&n.uid===s.uid){this.mode.moveTo?this.setMode({kind:"unit",uid:s.uid}):this.setMode({kind:"idle"});return}if(n&&n.owner===this.seat){t.canAct(n)?(Je.select(),this.setMode({kind:"unit",uid:n.uid})):this.setMode({kind:"idle"});return}if(a.has(cn(e))){if(this.mode.moveTo&&ra(this.mode.moveTo,e)){this.send({type:"order",uid:s.uid,to:e});return}if(t.attackTargets(s,e).length===0){this.send({type:"order",uid:s.uid,to:e});return}Je.select(),this.setMode({kind:"unit",uid:s.uid,moveTo:e});return}this.setMode({kind:"idle"});return}n&&n.owner===this.seat&&(t.canAct(n)?(Je.select(),this.setMode({kind:"unit",uid:n.uid})):(Je.error(),this.toast(t.isFrozen(n)?"That unit is Frozen.":n.exhausted?"That unit has already acted this round.":"Units can't act the round they are summoned (unless Swift).")))}}sanctumClick(e){if(!this.myTurn||this.mode.kind!=="unit"||e===this.seat)return;const t=this.g,n=t.unit(this.mode.uid);if(!n)return;const s=this.mode.moveTo??{c:n.c,r:n.r};if(t.attackTargets(n,s).some(r=>"sanctum"in r)){this.send({type:"order",uid:n.uid,to:this.mode.moveTo,attack:{sanctum:e}});return}for(const[,r]of t.reachable(n)){const a=r[r.length-1];if(Co(this.seat,n.range,a)){this.send({type:"order",uid:n.uid,to:a,attack:{sanctum:e}});return}}Je.error(),this.toast("To attack the enemy Sanctum, melee units must stand on its back row. Ranged units can attack from either red row.")}updateGuide(){if(!this.view||this.mode.kind!=="unit"||!this.myTurn){this.scene.showGuide(null,null);return}const e=this.g,t=e.unit(this.mode.uid);if(!t){this.scene.showGuide(null,null);return}const n={c:t.c,r:t.r},s=e.reachable(t),r=c=>c?s.get(cn(c))??[n]:[n],a=this.mode.moveTo,o=this.hoverHex?e.unitAt(this.hoverHex):void 0;if(this.hoverSanctum!==null&&this.hoverSanctum!==this.seat){const c=a??n;if(e.attackTargets(t,c).some(l=>"sanctum"in l)){this.scene.showGuide(r(a),this.scene.sanctumPos(this.hoverSanctum));return}for(const[,l]of s)if(Co(this.seat,t.range,l[l.length-1])){this.scene.showGuide(l,this.scene.sanctumPos(this.hoverSanctum));return}}if(o&&o.owner!==this.seat){const c=a??n;if(e.attackTargets(t,c).some(d=>"uid"in d&&d.uid===o.uid)){this.scene.showGuide(r(a),this.scene.hexPos(o,.7));return}let l=null;for(const[,d]of s)e.attackTargets(t,d[d.length-1]).some(h=>"uid"in h&&h.uid===o.uid)&&(!l||d.length<l.length)&&(l=d);if(l&&!a){this.scene.showGuide(l,this.scene.hexPos(o,.7));return}}if(this.hoverHex&&s.has(cn(this.hoverHex))&&!a){this.scene.showGuide(s.get(cn(this.hoverHex)),null);return}this.scene.showGuide(a?r(a):null,null)}updateHighlights(){if(this.updateGuide(),!this.view)return;const e=new Map;let t=null;const n=this.g;if(this.mode.kind==="card"){const s=this.currentSpec();if(s)for(const r of s.cands)if(r&&"uid"in r){const a=n.unit(r.uid);e.set(cn(a),a.owner===this.seat?"friendly":"enemy")}else r&&"c"in r&&e.set(cn(r),"deploy")}else if(this.mode.kind==="unit"){const s=n.unit(this.mode.uid);if(s){const r=n.reachable(s);for(const o of r.keys())e.set(o,"move");if(!this.mode.moveTo)for(const[,o]of r)for(const c of n.attackTargets(s,o[o.length-1]))if("uid"in c){const l=n.unit(c.uid);e.set(cn(l),"attackFar")}else t=c.sanctum;const a=this.mode.moveTo??{c:s.c,r:s.r};for(const o of n.attackTargets(s,a))"uid"in o?e.set(cn(n.unit(o.uid)),"attack"):t=o.sanctum;e.set(cn(s),"selected"),this.mode.moveTo&&e.set(cn(this.mode.moveTo),"dest")}}else if(this.hoverHex){const s=n.unitAt(this.hoverHex);if(s){if(n.canAct(s))for(const r of n.reachable(s).keys())e.set(r,"move");for(const r of aa)Qn(r,s)<=s.range&&Qn(r,s)>0&&e.set(cn(r),"attackFar")}}this.scene.setHighlights(e,t)}updateHover(){const e=ht(this.root,".hover-card"),t=a=>{e.dataset.html!==a&&(e.innerHTML=a,e.dataset.html=a)};if(ht(this.root,".forecast").classList.add("hidden"),!this.view)return;const s=this.g;if(this.previewCard){const a=Ye(this.previewCard.cardId),o=a.champion?An(Ye(a.champion.to),{extraClass:"big"}):"";t(`<div class="hc-row">${An(a,{extraClass:"big",cost:this.previewCard.cost})}${o}</div><div class="hc-help">${uc(a)}</div>`),e.classList.add("show"),this.markOverflow(e);return}if(this.hoverSanctum!==null){const a=this.view.players[this.hoverSanctum];t(`<div class="sanctum-card ${this.hoverSanctum===this.seat?"mine":"theirs"}"><h3>${at(a.name)}'s Sanctum</h3><div class="big">${a.sanctum} / 20</div><p>If it reaches 0, ${this.hoverSanctum===this.seat?"you lose":"you win"}. Melee units on ${this.hoverSanctum===this.seat?"your":"the enemy"} back row can attack it, and ranged units can attack it from either of ${this.hoverSanctum===this.seat?"your":"the enemy"} two back rows.</p></div>`),e.classList.add("show"),this.markOverflow(e),this.showForecast(null);return}const r=this.hoverHex?s.unitAt(this.hoverHex):void 0;if(r){const a=Ye(r.cardId),o=[],c=s.isFrozen(r);if(c&&o.push(r.frozenUntil>this.view.round?"❄️ Frozen: can't act this round or next":"❄️ Frozen: can't act this round"),s.isRooted(r)&&o.push("🕸️ Rooted: can't move"),r.exhausted&&!c?o.push("✓ Already acted this round"):r.summonedRound===this.view.round&&!r.kw.includes("swift")?o.push("💤 Just summoned: can't act until next round"):c||o.push("⚡ Ready to act"),r.tempAtk&&o.push(`🔥 +${r.tempAtk} power this round`),a.champion){const[d,h]=a.champion.progress(s,r);o.push(`⭐ Level up: ${a.champion.label} ${Math.min(d,h)}/${h}`)}const l=a.champion?An(Ye(a.champion.to),{extraClass:"big"}):"";t(`<div class="hc-row">${An(a,{unit:r,extraClass:"big"})}${l}</div><div class="hc-help"><div class="unit-status">${r.owner===this.seat?'<b class="mine">Your unit</b>':'<b class="theirs">Enemy unit</b>'}${o.map(d=>`<div>${d}</div>`).join("")}</div>${uc(a,r.kw)}</div>`),e.classList.add("show"),this.markOverflow(e)}else this.hoverHex&&this.view&&gh(this.hoverHex)?(t(vh(this.hoverHex)?'<div class="sanctum-card"><h3>💎 Mana Orb</h3><p>At the start of each round, a unit standing here gives its owner <b>+1 mana</b> for that round.</p></div>':'<div class="sanctum-card"><h3>⚔️ War Orb</h3><p>At the start of each round, a unit standing here deals <b>1 damage</b> to the enemy Sanctum.</p></div>'),e.classList.add("show"),this.markOverflow(e)):e.classList.remove("show");this.showForecast(r??null)}showForecast(e){const t=ht(this.root,".forecast");if(this.mode.kind!=="unit"||!this.myTurn)return;const n=this.g,s=n.unit(this.mode.uid);if(!s)return;let r=null;const a=this.mode.moveTo??{c:s.c,r:s.r};if(e&&e.owner!==this.seat)if(n.attackTargets(s,a).some(h=>"uid"in h&&h.uid===e.uid))r={type:"order",uid:s.uid,to:this.mode.moveTo,attack:{uid:e.uid}};else for(const[,h]of n.reachable(s)){const f=h[h.length-1];if(n.attackTargets(s,f).some(p=>"uid"in p&&p.uid===e.uid)){r={type:"order",uid:s.uid,to:f,attack:{uid:e.uid}};break}}else this.hoverSanctum!==null&&this.hoverSanctum!==this.seat&&n.attackTargets(s,a).some(h=>"sanctum"in h)&&(r={type:"order",uid:s.uid,to:this.mode.moveTo,attack:{sanctum:1-this.seat}});if(!r)return;const o=n.clone();if(!o.act(this.seat,r).ok)return;const l=o.unit(s.uid);let d="";if(e&&r.type==="order"&&r.attack&&"uid"in r.attack){const h=o.unit(e.uid);d=`<div>⚔️ ${at(Ye(s.cardId).name)} ${l?`<b>${l.hp}</b> hp left`:'<b class="dies">dies</b>'}</div>
              <div>🎯 ${at(Ye(e.cardId).name)} ${h?`<b>${h.hp}</b> hp left`:'<b class="dies">dies</b>'}</div>`}else d=`<div>🏰 Sanctum takes <b>${this.opp.sanctum-o.s.players[1-this.seat].sanctum}</b> damage</div>`;t.innerHTML=d,t.classList.remove("hidden")}render(){if(!this.view)return;const e=this.view;this.renderPlayer(ht(this.root,".pinfo.me"),this.seat),this.renderPlayer(ht(this.root,".pinfo.opp"),1-this.seat),ht(this.root,".opp-hand").innerHTML=this.opp.hand.map(()=>cg()).join("");const t=ht(this.root,".round-info");t.innerHTML=e.phase==="mulligan"?"<b>Mulligan</b>":`<b>Round ${e.round}</b>`;const n=ht(this.root,".pass-wrap .init");n.className=`init ${e.initiative===this.seat?"mine":"theirs"}`,n.textContent=`⚜ ${e.initiative===this.seat?"Your":"Opponent's"} initiative`,this.renderHand(),this.renderPass(),this.renderLog(),this.updatePrompt(),e.phase==="mulligan"?this.renderMulligan():e.phase==="over"?this.renderGameOver():this.root.querySelector(".overlay .mulligan")&&this.finishMulligan(),this.scene.myTurn=this.myTurn;for(const s of e.units){const r=this.scene.units.get(s.uid);r&&(r.canActNow=this.canActUnit(s))}}renderPlayer(e,t){const n=this.view.players[t],s=t===this.seat,r=Math.max(0,n.mana-n.maxMana);let a="";for(let d=0;d<n.maxMana;d++)a+=`<i class="gem ${d<n.mana?"full":""}"></i>`;for(let d=0;d<r;d++)a+='<i class="gem full bonus" title="Mana Orb bonus mana"></i>';let o="";for(let d=0;d<Of;d++)o+=`<i class="sgem ${d<n.spellMana?"full":""}"></i>`;const c=this.view.phase==="action"&&this.view.turn===t,l=Math.max(0,n.sanctum)/20*100;e.classList.toggle("active",c),e.innerHTML=`
      <div class="avatar" style="background:${n.deckColors.map((d,h)=>`radial-gradient(circle at ${h?"70% 70%":"30% 30%"}, ${bn[d].hex}, transparent 70%)`).join(",")}">${n.deckIcon}</div>
      <div class="pdata">
        <div class="pname">${at(n.name)} ${this.connected[t]?"":'<span class="dc">disconnected</span>'}${this.view.passes===1&&this.view.turn!==t&&this.view.phase==="action"?'<span class="passed">passed</span>':""}</div>
        <div class="hpbar"><div class="fill ${s?"mine":"theirs"}" style="width:${l}%"></div><span>🔮 ${n.sanctum}</span></div>
        <div class="mana" title="Mana ${n.mana}/${n.maxMana}">${a}<span class="mana-num">${n.mana}/${n.maxMana}</span></div>
        <div class="spellmana" title="Spell mana: unspent mana carried over (spells and orders only)">${o}</div>
        <div class="counts"><span title="Cards in hand">🂠 ${n.hand.length}</span><span title="Cards in deck">📚 ${n.deck.length}</span><span title="Deck">${at(n.deckName)}</span></div>
      </div>`}renderHand(){const e=ht(this.root,".hand"),t=this.me.hand,n=this.g,s=t.length;this.previewCard&&!this.root.querySelector(".logcard:hover")&&(this.previewCard=null,this.updateHover()),e.innerHTML=t.map((r,a)=>{const o=Ye(r.cardId),c=this.myTurn&&n.playable(this.seat,r),l=this.mode.kind==="card"&&this.mode.iid===r.iid,d=(s-1)/2,h=(a-d)*Math.min(5,30/s),f=Math.abs(a-d)*Math.abs(a-d)*3,p=!this.seenCards.has(r.iid);return`<div class="hand-slot ${c?"playable":""} ${l?"selected":""} ${p?"fresh":""}" style="--rot:${h}deg; --lift:${f}px; --i:${a}" data-iid="${r.iid}">
        ${An(o,{cost:n.cost(this.seat,r)})}</div>`}).join("");for(const r of t)this.seenCards.add(r.iid);e.querySelectorAll(".hand-slot").forEach(r=>{r.onclick=a=>{a.stopPropagation(),this.clickCard(Number(r.dataset.iid))},r.onmouseenter=()=>{Je.hover();const a=t.find(o=>o.iid===Number(r.dataset.iid));a&&(this.previewCard={cardId:a.cardId,cost:n.cost(this.seat,a)},this.updateHover())},r.onmouseleave=()=>{this.previewCard=null,this.updateHover()}})}renderPass(){const e=ht(this.root,".pass-btn"),t=this.view;if(ht(this.root,".pass-wrap").classList.toggle("hidden",t.phase!=="action"),t.turn===this.seat&&t.phase==="action"){const s=t.passes===1;e.innerHTML=s?"End<br>Round":"Pass",e.className=`pass-btn ready ${s?"end":""}`,e.disabled=this.animating}else e.innerHTML=`<span class="small">Opponent's<br>action</span>`,e.className="pass-btn waiting",e.disabled=!0}renderTimer(){if(!this.view||this.view.phase==="over"||!this.deadline){ht(this.root,".timer-num").textContent="";return}const e=Math.max(0,(this.deadline-Date.now())/1e3),t=this.view.phase==="mulligan"?45:75,n=this.root.querySelector(".timer circle"),s=2*Math.PI*46;if(n.style.strokeDasharray=`${s}`,n.style.strokeDashoffset=`${s*(1-e/t)}`,n.classList.toggle("urgent",e<15),ht(this.root,".timer-num").textContent=e<20&&this.view.phase==="action"?`${Math.ceil(e)}`:"",this.view.phase==="mulligan"){const r=this.root.querySelector(".mull-timer");r&&(r.textContent=this.me.mulliganDone||this.mullSent?"":`${Math.ceil(e)}s`)}}renderLog(){const e=ht(this.root,".log"),t=n=>at(n).replace(/\{\{(\w+)\}\}/g,(s,r)=>{try{return`<span class="logcard" data-card="${r}">${at(Ye(r).name)}</span>`}catch{return r}});e.innerHTML="<h4>Battle Log</h4>"+this.view.log.slice(-60).reverse().map(n=>`<div class="${n.p===this.seat?"mine":n.p===-1?"sys":"theirs"}">${t(n.text)}</div>`).join(""),e.querySelectorAll(".logcard").forEach(n=>{n.onmouseenter=()=>{this.previewCard={cardId:n.dataset.card},this.updateHover()},n.onmouseleave=()=>{this.previewCard=null,this.updateHover()}})}updatePrompt(){const e=ht(this.root,".prompt"),t=ht(this.root,".btn-skip");if(this.view)if(this.mode.kind==="card"){const n=this.currentSpec();if(!n){e.classList.add("hidden");return}const s=n.specs.length===0?`Click <b>${at(n.d.name)}</b> again to cast it`:`<b>${at(n.d.name)}</b>: ${at(n.spec.prompt)}`;ht(e,".prompt-text").innerHTML=s,t.classList.toggle("hidden",!(n.spec&&n.spec.optional)),e.classList.remove("hidden")}else if(this.mode.kind==="unit"){const n=this.g.unit(this.mode.uid);ht(e,".prompt-text").innerHTML=n?`<b>${at(Ye(n.cardId).name)}</b>: ${this.mode.moveTo?"Click a red target to attack, or the glowing hex again to just move":"Click a blue hex to move, or a red target to attack"}`:"",t.classList.add("hidden"),e.classList.remove("hidden")}else e.classList.add("hidden")}mulliganResultHTML(e){const t=this.mullOld??[],n=new Set(t.map(c=>c.iid)),s=this.me.hand.filter(c=>!n.has(c.iid));let r=0;const a=t.map(c=>{if(!this.mullReplaced.has(c.iid))return`<div class="mull-card kept">${An(Ye(c.cardId))}</div>`;const l=s[r++];return!l||e&&!this.me.mulliganDone?'<div class="mull-card pending"><div class="card back"></div></div>':`<div class="mull-card fresh" style="--i:${r}">${An(Ye(l.cardId))}<div class="new-tag">New</div></div>`}).join(""),o=this.mullReplaced.size;return`<div class="panel mulligan wide">
      <h2>${o?`Replaced ${o} card${o>1?"s":""}`:"Keeping your hand"}</h2>
      <div class="mull-cards">${a}</div>
      ${e?'<div class="mull-wait"><div class="spinner small"></div> Waiting for your opponent…</div>':`<button class="btn big btn-mull-go">Let's go ▸</button>`}
    </div>`}finishMulligan(){if(!this.mullOld||!this.mullReplaced.size){this.hideOverlay(),this.mullOld=null;return}if(this.mullRevealTimer)return;this.showOverlay(this.mulliganResultHTML(!1));const e=()=>{this.mullRevealTimer&&clearTimeout(this.mullRevealTimer),this.mullRevealTimer=null,this.mullOld=null,this.root.querySelector(".overlay .mulligan")&&this.hideOverlay()};this.root.querySelector(".btn-mull-go").onclick=()=>{Je.click(),e()},this.mullRevealTimer=setTimeout(e,3200)}renderMulligan(){if(this.me.mulliganDone||this.mullSent){this.showOverlay(this.mullOld?this.mulliganResultHTML(!0):'<div class="panel mulligan"><div class="spinner"></div><h2>Waiting for your opponent…</h2></div>');return}const e=this.me.hand.map(n=>`<div class="mull-card ${this.mulliganPick.has(n.iid)?"replace":""}" data-iid="${n.iid}">${An(Ye(n.cardId))}<div class="x">↻ Replace</div></div>`).join(""),t=this.view.initiative===this.seat;this.showOverlay(`<div class="panel mulligan wide">
      <h2>Your Opening Hand</h2>
      <p>Click any cards you want to replace, then confirm. ${t?"<b>You</b> will have the initiative in round 1.":"Your <b>opponent</b> will have the initiative in round 1."}</p>
      <div class="mull-cards">${e}</div>
      <button class="btn big btn-keep">${this.mulliganPick.size?`Replace ${this.mulliganPick.size} card${this.mulliganPick.size>1?"s":""}`:"Keep all"}</button>
      <div class="mull-timer dim"></div></div>`),this.root.querySelectorAll(".mull-card").forEach(n=>n.onclick=()=>{const s=Number(n.dataset.iid);this.mulliganPick.has(s)?this.mulliganPick.delete(s):this.mulliganPick.add(s),Je.click(),this.renderMulligan()}),this.root.querySelector(".btn-keep").onclick=()=>{this.mullOld=this.me.hand.map(n=>({iid:n.iid,cardId:n.cardId})),this.mullReplaced=new Set(this.mulliganPick),this.mullSent=!0,this.room.send("action",{type:"mulligan",iids:[...this.mulliganPick]}),this.mulliganPick.clear(),Je.select(),this.renderMulligan()}}renderGameOver(){const e=this.view;if(this.root.querySelector(".overlay .gameover"))return;const t=e.winner===this.seat,n=e.winner===-1;t?Je.victory():n?Je.pass():Je.defeat(),li.duck(.35,2.5);const s=this.currentDeckId(),r=yh().map(a=>`<option value="${a.id}" ${a.id===s?"selected":""}>${at(a.name)} (${a.archetype})</option>`).join("");this.showOverlay(`<div class="panel gameover ${t?"win":n?"draw":"lose"}">
      <div class="go-orb"></div>
      <h1>${t?"Victory!":n?"Draw":"Defeat"}</h1>
      <p>${t?"The enemy Sanctum shatters into a thousand stars.":n?"Both Sanctums fall together.":"Your Sanctum has fallen."} The battle lasted ${e.round} round${e.round===1?"":"s"}.</p>
      <div class="row"><label>Deck for the rematch: <select class="rematch-deck">${r}</select></label></div>
      <div class="row">
        <button class="btn big btn-rematch">⚔️ Rematch</button>
        <button class="btn ghost btn-home">Main Menu</button>
      </div>
      <div class="rematch-status dim"></div></div>`),this.root.querySelector(".btn-rematch").onclick=a=>{const o=this.root.querySelector(".rematch-deck").value;this.room.send("rematch",kf(o)),a.target.disabled=!0,this.root.querySelector(".rematch-status").textContent=this.vsAI?"Shuffling…":"Waiting for opponent…"},this.root.querySelector(".btn-home").onclick=()=>this.exit()}showOverlay(e){const t=ht(this.root,".overlay");(t.dataset.html!==e||t.classList.contains("hidden"))&&(t.innerHTML=e,t.dataset.html=e),t.classList.remove("hidden")}hideOverlay(){const e=ht(this.root,".overlay");e.classList.add("hidden"),e.innerHTML="",delete e.dataset.html}toast(e){const t=ht(this.root,".toast"),n=document.createElement("div");n.className="toast-item",n.textContent=e,t.appendChild(n),setTimeout(()=>n.classList.add("out"),2600),setTimeout(()=>n.remove(),3200)}banner(e,t){const n=ht(this.root,".banner");n.innerHTML=`<div class="b-title">${at(e)}</div><div class="b-sub">${at(t)}</div>`,n.classList.remove("show"),n.offsetWidth,n.classList.add("show")}castShow(e,t){const n=ht(this.root,".cast-show");n.innerHTML=`<div class="cast-label">${at(t)}</div>${An(Ye(e),{extraClass:"big"})}`,n.classList.remove("show"),n.offsetWidth,n.classList.add("show")}showEmote(e,t){Je.emote();const n=ht(this.root,e===this.seat?".me-bubble":".opp-bubble");n.textContent=t,n.classList.remove("hidden"),clearTimeout(n._t),n._t=window.setTimeout(()=>n.classList.add("hidden"),2600)}confirmLeave(){if(!this.view||this.view.phase==="over"){this.exit();return}this.showOverlay(`<div class="panel"><h2>Concede the match?</h2><p>Your opponent will be awarded the victory.</p>
      <div class="row"><button class="btn danger btn-yes">Concede</button><button class="btn ghost btn-no">Keep fighting</button></div></div>`),this.root.querySelector(".btn-yes").onclick=()=>{this.room.send("action",{type:"concede"}),this.hideOverlay()},this.root.querySelector(".btn-no").onclick=()=>{this.hideOverlay(),this.render()}}toggleHelp(){const e=ht(this.root,".help-modal");if(!e.classList.contains("hidden")){e.classList.add("hidden");return}e.innerHTML=`<div class="panel help"><button class="close btn-close-help" title="Close (Esc)">✕</button>${Uf}</div>`,e.classList.remove("hidden"),e.querySelector(".btn-close-help").onclick=()=>e.classList.add("hidden"),e.onclick=t=>{t.target===e&&e.classList.add("hidden")}}}const Uf=`
<h2>How to Play</h2>
<div class="help-grid">
  <div><h4>🎯 Goal</h4><p>Reduce the enemy <b>Sanctum</b> (the big orb behind their side) from 20 to 0.</p></div>
  <div><h4>🔁 Rounds</h4><p>Each round you gain a mana crystal (up to 10) and draw a card. Players take turns doing <b>one action at a time</b>. The player with the <b>initiative</b> goes first; it swaps every round. The round ends when both players <b>pass in a row</b>, so passing just to see what your opponent does is a real tactic.</p></div>
  <div><h4>🃏 Actions</h4><p><b>Play a card</b>: Units are summoned onto your two back rows. Spells and Orders take effect immediately.<br><b>Order a unit</b>: Move it up to its speed (usually 2 hexes) and/or attack something in range. Each unit can be ordered once per round, starting the round after it is summoned.<br><b>Pass</b>.</p></div>
  <div><h4>⚔️ Combat</h4><p>Attacker and defender damage each other at the same time, unless the defender can't reach back (ranged attacks). Damage stays on units between rounds. To attack the enemy Sanctum directly, melee units must reach the enemy's <b>back row</b>. Ranged units can attack it from either of the enemy's two back rows.</p></div>
  <div><h4>🔮 Ley Orbs</h4><p>Three orbs float over the center row. At the start of each round, holding the <b>middle Mana Orb</b> gives you <b>+1 mana</b> for that round, and each <b>outer War Orb</b> you hold deals <b>1 damage</b> to the enemy Sanctum.</p></div>
  <div><h4>💧 Spell mana</h4><p>Up to 3 unspent mana carries over as <b>spell mana</b>, which can only pay for Spells and Orders.</p></div>
</div>
<h4>Keywords</h4>
<div class="kw-grid">
  <div><b>💨 Swift</b> acts the round it's summoned</div><div><b>🛡️ Guardian</b> enemies moving next to it must stop</div>
  <div><b>🪽 Flying</b> moves over units, ignores Guardians</div><div><b>🗡️ First Strike</b> hits first in combat</div>
  <div><b>🩸 Drain</b> damage dealt heals your Sanctum</div><div><b>♻️ Regenerate</b> fully heals each round end</div>
  <div><b>🔰 Barrier</b> blocks the next damage</div><div><b>🏰 Siege</b> double damage to Sanctums</div>
  <div><b>☠️ Deadly</b> destroys any unit it damages</div><div><b>👁️ Infiltrate</b> summon anywhere in your half</div>
  <div><b>❄️ Freeze</b> the unit loses its next order</div><div><b>🕸️ Root</b> the unit can't move</div>
</div>
<h4>Controls</h4>
<p>Click a card, then a highlighted target. Click your unit, then a blue hex to move or a red target to attack (it will walk into range automatically). <b>Space</b> passes, <b>Esc</b> or right-click cancels, the mouse wheel scrolls the text of a hovered card. Hover anything for details.</p>`,bg={guardian:.6,flying:1.2,firstStrike:1,drain:1.2,regenerate:1.2,barrier:1.4,siege:.8,deadly:2.5,swift:0,infiltrate:0},Sg={k_siphon:3,k_necromancer:3,d_captain:2,t_sea_witch:2,e_flame_dancer:1.5,g_sporecap:2.5,d_bastion:1.5,c_pyra:1.5,c_nerith:2,c_thornak:1.5,c_sera:2,c_morvath:2,c_nerith2:3,c_thornak2:3,c_sera2:3,c_morvath2:2,t_glacial:1,g_boar:.5,e_berserker:.8,k_grave_imp:.8,e_powder_goblin:1,g_sproutling:.6,e_phoenix:1.5};function wg(i,e){let t=i.power(e)*1+e.hp*.8+e.atk*.2;for(const n of e.kw)t+=bg[n]??0;return t+=Sg[e.cardId]??0,e.range>1&&(t+=.8),t}function Mg(i,e){let t=0;const n=e.owner===0?e.r:6-e.r;t+=n*.25,gh(e)?t+=3:t+=Math.max(0,2-Math.min(...ya.map(r=>Qn(r,e))))*.4;const s=e.kw.includes("siege")?1.6:.8;return Co(e.owner,e.range,e)?t+=i.power(e)*s:mh(e.owner,e)&&(t+=i.power(e)*s*.5),t}function vu(i,e){const t=i.s;if(t.phase==="over")return t.winner===e?1e5:t.winner===-1?-500:-1e5;const n=t.players[e],s=t.players[1-e];let r=0;const a=c=>c*3+(c<=8?(8-c)*-2:0);r+=a(n.sanctum)-a(s.sanctum),r+=(Math.min(n.hand.length,8)-Math.min(s.hand.length,8))*1.6,r+=(n.maxMana-s.maxMana)*1.5,r+=(n.spellMana-s.spellMana)*.3;const o=t.units.filter(c=>c.hp>0);for(const c of o){const l=c.owner===e?1:-1,d=wg(i,c);r+=l*(d+Mg(i,c));const h=o.filter(f=>f.owner!==c.owner&&i.canAct(f)&&Qn(f,c)<=(i.isRooted(f)?0:f.speed)+f.range);if(h.length){const f=h.reduce((y,x)=>y+i.power(x),0),p=c.kw.includes("barrier")?!1:f>=c.hp||h.some(y=>y.kw.includes("deadly")),_=t.turn!==c.owner;p&&(r-=l*d*(_?.55:.25))}}return r}function Eg(i,e,t){if(t.length<=5)return t;const n=i.unitsOf(1-e),s=Ts(e)[0],r=t.map(a=>{const o=a;let c=0;return o.r===s&&(c+=2),gh(o)&&(c+=6),c-=Math.min(...ya.map(l=>Qn(l,o)))*.5,n.length&&(c-=Math.min(...n.map(l=>Qn(l,o)))*.3),mh(e,o)&&(c+=1),{t:a,sc:c+Math.random()*.3}});return r.sort((a,o)=>o.sc-a.sc),r.slice(0,5).map(a=>a.t)}function Tg(i,e){const t=[{type:"pass"}],n=i.s.players[e],s=new Set;for(const r of n.hand){if(s.has(r.cardId+":"+r.costMod)||(s.add(r.cardId+":"+r.costMod),!i.playable(e,r)))continue;const a=Ye(r.cardId),o=i.specs(a),c=l=>{const d=l.length;if(d===o.length){t.push({type:"play",iid:r.iid,targets:l});return}let h=i.candidates(e,a,l,d);a.type==="unit"&&d===0?h=Eg(i,e,h):h.length>10&&(h=h.slice(0,10)),o[d].optional&&(h=[...h,null]);for(const f of h)c([...l,f])};c([])}for(const r of i.unitsOf(e)){if(!i.canAct(r))continue;const a={c:r.c,r:r.r};for(const o of i.attackTargets(r,a))t.push({type:"order",uid:r.uid,attack:o});for(const[,o]of i.reachable(r)){const c=o[o.length-1];t.push({type:"order",uid:r.uid,to:c});for(const l of i.attackTargets(r,c))t.push({type:"order",uid:r.uid,to:c,attack:l})}}return t}function Ag(i){const{log:e,...t}=i.s;return new gr(structuredClone({...t,log:[]}))}function _u(i,e){var a;if(i.s.phase==="mulligan")return{type:"mulligan",iids:Rg(i,e)};const n=vu(i,e);let s={type:"pass"},r=n+.4;for(const o of Tg(i,e)){if(o.type==="pass")continue;const c=Ag(i);if(!c.act(e,o).ok)continue;let d=vu(c,e);if(o.type==="play"){const h=Ye(((a=c.s.lastPlayed)==null?void 0:a.cardId)??"");d+=h.aiBias??0}d+=Math.random()*.15,d>r&&(r=d,s=o)}return s}function Rg(i,e){return i.s.players[e].hand.filter(n=>Ye(n.cardId).cost>=5).map(n=>n.iid)}const xu=["Well played!","Good luck!","Hmm...","Oops!","Wow!","Thanks!","Not today!","Behold!"];function yu(i){const e=i==null?void 0:i.customDeck;return e&&typeof e.name=="string"&&!Po(e.cards)?{id:"custom",name:e.name.slice(0,30)||"Custom Deck",cards:e.cards}:la((i==null?void 0:i.deckId)??"")}function bu(i){return Vn.find(e=>e.id===i)??Vn[Math.floor(Math.random()*Vn.length)]}const Cg=i=>700+Math.min(i,12)*220,xi=0,Un=1;class Pg{constructor(e){this.opts=e,this.roomId="local",this.reconnectionToken="",this.handlers=new Map,this.aiTimer=null,this.closed=!1;const t=bu(e.aiDeckId);this.decks=[yu(e),la(t.id)],this.names=[e.name,`${t.name} AI`],setTimeout(()=>{this.emit("seat",{seat:xi,roomId:this.roomId,vsAI:!0,emotes:xu}),this.start()},0)}onMessage(e,t){const n=this.handlers.get(e)??[];n.push(t),this.handlers.set(e,n)}onLeave(e){}leave(){return this.closed=!0,this.aiTimer&&clearTimeout(this.aiTimer),Promise.resolve()}send(e,t){if(!this.closed){if(e==="action")this.act(xi,t,!0);else if(e==="emote"){const n=xu[t];n&&this.emit("emote",{seat:xi,text:n})}else if(e==="rematch"){if(this.game.s.phase!=="over")return;const n=t;(n!=null&&n.deckId||n!=null&&n.customDeck)&&(this.decks[xi]=yu(n));const s=bu(this.opts.aiDeckId);this.decks[Un]=la(s.id),this.names[Un]=`${s.name} AI`,this.start()}}}emit(e,t){const n=t===void 0?t:structuredClone(t);for(const s of this.handlers.get(e)??[])s(n)}start(){this.game=gr.create({name:this.names[xi],deck:this.decks[xi],isAI:!1},{name:this.names[Un],deck:this.decks[Un],isAI:!0}),this.sendState([{t:"fx",kind:"start",at:null}]),this.maybeAI()}act(e,t,n=!1){const s=this.game.act(e,t);return s.ok?(this.sendState(s.events),this.maybeAI(s.events.length),s):(n&&this.emit("error",s.error),s)}sendState(e){this.emit("state",{view:_g(this.game.s,xi),events:xg(e,xi),seat:xi,deadline:0,names:this.names,connected:[!0,!0]})}maybeAI(e=0){const t=this.game;if(!(this.closed||t.s.phase==="over")){if(t.s.phase==="mulligan"){t.s.players[Un].mulliganDone||(t.act(Un,_u(t,Un)),t.s.phase==="action"&&this.sendState(t.events));return}t.s.turn===Un&&(this.aiTimer&&clearTimeout(this.aiTimer),this.aiTimer=setTimeout(()=>{if(this.closed||this.game!==t||t.s.turn!==Un||t.s.phase!=="action")return;this.act(Un,_u(t,Un)).ok||this.act(Un,{type:"pass"})},Cg(e)))}}}function Sh(i){if(Object.prototype.hasOwnProperty.call(i,"__esModule"))return i;var e=i.default;if(typeof e=="function"){var t=function n(){return this instanceof n?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};t.prototype=e.prototype}else t={};return Object.defineProperty(t,"__esModule",{value:!0}),Object.keys(i).forEach(function(n){var s=Object.getOwnPropertyDescriptor(i,n);Object.defineProperty(t,n,s.get?s:{enumerable:!0,get:function(){return i[n]}})}),t}var ll={},Su={},wu;function Ig(){return wu||(wu=1,ArrayBuffer.isView||(ArrayBuffer.isView=i=>i!==null&&typeof i=="object"&&i.buffer instanceof ArrayBuffer),typeof globalThis>"u"&&typeof window<"u"&&(window.globalThis=window),typeof FormData>"u"&&(globalThis.FormData=class{})),Su}var ka={},dc=function(i,e){return dc=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=n[s])},dc(i,e)};function Nf(i,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");dc(i,e);function t(){this.constructor=i}i.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}var Io=function(){return Io=Object.assign||function(e){for(var t,n=1,s=arguments.length;n<s;n++){t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},Io.apply(this,arguments)};function Ff(i,e){var t={};for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&e.indexOf(n)<0&&(t[n]=i[n]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,n=Object.getOwnPropertySymbols(i);s<n.length;s++)e.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(i,n[s])&&(t[n[s]]=i[n[s]]);return t}function Bf(i,e,t,n){var s=arguments.length,r=s<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,t):n,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(i,e,t,n);else for(var o=i.length-1;o>=0;o--)(a=i[o])&&(r=(s<3?a(r):s>3?a(e,t,r):a(e,t))||r);return s>3&&r&&Object.defineProperty(e,t,r),r}function zf(i,e){return function(t,n){e(t,n,i)}}function Hf(i,e,t,n,s,r){function a(g){if(g!==void 0&&typeof g!="function")throw new TypeError("Function expected");return g}for(var o=n.kind,c=o==="getter"?"get":o==="setter"?"set":"value",l=!e&&i?n.static?i:i.prototype:null,d=e||(l?Object.getOwnPropertyDescriptor(l,n.name):{}),h,f=!1,p=t.length-1;p>=0;p--){var _={};for(var y in n)_[y]=y==="access"?{}:n[y];for(var y in n.access)_.access[y]=n.access[y];_.addInitializer=function(g){if(f)throw new TypeError("Cannot add initializers after decoration has completed");r.push(a(g||null))};var x=(0,t[p])(o==="accessor"?{get:d.get,set:d.set}:d[c],_);if(o==="accessor"){if(x===void 0)continue;if(x===null||typeof x!="object")throw new TypeError("Object expected");(h=a(x.get))&&(d.get=h),(h=a(x.set))&&(d.set=h),(h=a(x.init))&&s.unshift(h)}else(h=a(x))&&(o==="field"?s.unshift(h):d[c]=h)}l&&Object.defineProperty(l,n.name,d),f=!0}function Vf(i,e,t){for(var n=arguments.length>2,s=0;s<e.length;s++)t=n?e[s].call(i,t):e[s].call(i);return n?t:void 0}function Gf(i){return typeof i=="symbol"?i:"".concat(i)}function $f(i,e,t){return typeof e=="symbol"&&(e=e.description?"[".concat(e.description,"]"):""),Object.defineProperty(i,"name",{configurable:!0,value:t?"".concat(t," ",e):e})}function Wf(i,e){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(i,e)}function Xf(i,e,t,n){function s(r){return r instanceof t?r:new t(function(a){a(r)})}return new(t||(t=Promise))(function(r,a){function o(d){try{l(n.next(d))}catch(h){a(h)}}function c(d){try{l(n.throw(d))}catch(h){a(h)}}function l(d){d.done?r(d.value):s(d.value).then(o,c)}l((n=n.apply(i,e||[])).next())})}function qf(i,e){var t={label:0,sent:function(){if(r[0]&1)throw r[1];return r[1]},trys:[],ops:[]},n,s,r,a=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return a.next=o(0),a.throw=o(1),a.return=o(2),typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function o(l){return function(d){return c([l,d])}}function c(l){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,l[0]&&(t=0)),t;)try{if(n=1,s&&(r=l[0]&2?s.return:l[0]?s.throw||((r=s.return)&&r.call(s),0):s.next)&&!(r=r.call(s,l[1])).done)return r;switch(s=0,r&&(l=[l[0]&2,r.value]),l[0]){case 0:case 1:r=l;break;case 4:return t.label++,{value:l[1],done:!1};case 5:t.label++,s=l[1],l=[0];continue;case 7:l=t.ops.pop(),t.trys.pop();continue;default:if(r=t.trys,!(r=r.length>0&&r[r.length-1])&&(l[0]===6||l[0]===2)){t=0;continue}if(l[0]===3&&(!r||l[1]>r[0]&&l[1]<r[3])){t.label=l[1];break}if(l[0]===6&&t.label<r[1]){t.label=r[1],r=l;break}if(r&&t.label<r[2]){t.label=r[2],t.ops.push(l);break}r[2]&&t.ops.pop(),t.trys.pop();continue}l=e.call(i,t)}catch(d){l=[6,d],s=0}finally{n=r=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:!0}}}var Wo=Object.create?(function(i,e,t,n){n===void 0&&(n=t);var s=Object.getOwnPropertyDescriptor(e,t);(!s||("get"in s?!e.__esModule:s.writable||s.configurable))&&(s={enumerable:!0,get:function(){return e[t]}}),Object.defineProperty(i,n,s)}):(function(i,e,t,n){n===void 0&&(n=t),i[n]=e[t]});function jf(i,e){for(var t in i)t!=="default"&&!Object.prototype.hasOwnProperty.call(e,t)&&Wo(e,i,t)}function Do(i){var e=typeof Symbol=="function"&&Symbol.iterator,t=e&&i[e],n=0;if(t)return t.call(i);if(i&&typeof i.length=="number")return{next:function(){return i&&n>=i.length&&(i=void 0),{value:i&&i[n++],done:!i}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function wh(i,e){var t=typeof Symbol=="function"&&i[Symbol.iterator];if(!t)return i;var n=t.call(i),s,r=[],a;try{for(;(e===void 0||e-- >0)&&!(s=n.next()).done;)r.push(s.value)}catch(o){a={error:o}}finally{try{s&&!s.done&&(t=n.return)&&t.call(n)}finally{if(a)throw a.error}}return r}function Yf(){for(var i=[],e=0;e<arguments.length;e++)i=i.concat(wh(arguments[e]));return i}function Kf(){for(var i=0,e=0,t=arguments.length;e<t;e++)i+=arguments[e].length;for(var n=Array(i),s=0,e=0;e<t;e++)for(var r=arguments[e],a=0,o=r.length;a<o;a++,s++)n[s]=r[a];return n}function Jf(i,e,t){if(t||arguments.length===2)for(var n=0,s=e.length,r;n<s;n++)(r||!(n in e))&&(r||(r=Array.prototype.slice.call(e,0,n)),r[n]=e[n]);return i.concat(r||Array.prototype.slice.call(e))}function vr(i){return this instanceof vr?(this.v=i,this):new vr(i)}function Zf(i,e,t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=t.apply(i,e||[]),s,r=[];return s=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),o("next"),o("throw"),o("return",a),s[Symbol.asyncIterator]=function(){return this},s;function a(p){return function(_){return Promise.resolve(_).then(p,h)}}function o(p,_){n[p]&&(s[p]=function(y){return new Promise(function(x,g){r.push([p,y,x,g])>1||c(p,y)})},_&&(s[p]=_(s[p])))}function c(p,_){try{l(n[p](_))}catch(y){f(r[0][3],y)}}function l(p){p.value instanceof vr?Promise.resolve(p.value.v).then(d,h):f(r[0][2],p)}function d(p){c("next",p)}function h(p){c("throw",p)}function f(p,_){p(_),r.shift(),r.length&&c(r[0][0],r[0][1])}}function Qf(i){var e,t;return e={},n("next"),n("throw",function(s){throw s}),n("return"),e[Symbol.iterator]=function(){return this},e;function n(s,r){e[s]=i[s]?function(a){return(t=!t)?{value:vr(i[s](a)),done:!1}:r?r(a):a}:r}}function ep(i){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=i[Symbol.asyncIterator],t;return e?e.call(i):(i=typeof Do=="function"?Do(i):i[Symbol.iterator](),t={},n("next"),n("throw"),n("return"),t[Symbol.asyncIterator]=function(){return this},t);function n(r){t[r]=i[r]&&function(a){return new Promise(function(o,c){a=i[r](a),s(o,c,a.done,a.value)})}}function s(r,a,o,c){Promise.resolve(c).then(function(l){r({value:l,done:o})},a)}}function tp(i,e){return Object.defineProperty?Object.defineProperty(i,"raw",{value:e}):i.raw=e,i}var Dg=Object.create?(function(i,e){Object.defineProperty(i,"default",{enumerable:!0,value:e})}):function(i,e){i.default=e},fc=function(i){return fc=Object.getOwnPropertyNames||function(e){var t=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[t.length]=n);return t},fc(i)};function np(i){if(i&&i.__esModule)return i;var e={};if(i!=null)for(var t=fc(i),n=0;n<t.length;n++)t[n]!=="default"&&Wo(e,i,t[n]);return Dg(e,i),e}function ip(i){return i&&i.__esModule?i:{default:i}}function sp(i,e,t,n){if(t==="a"&&!n)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?i!==e||!n:!e.has(i))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?n:t==="a"?n.call(i):n?n.value:e.get(i)}function rp(i,e,t,n,s){if(n==="m")throw new TypeError("Private method is not writable");if(n==="a"&&!s)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?i!==e||!s:!e.has(i))throw new TypeError("Cannot write private member to an object whose class did not declare it");return n==="a"?s.call(i,t):s?s.value=t:e.set(i,t),t}function ap(i,e){if(e===null||typeof e!="object"&&typeof e!="function")throw new TypeError("Cannot use 'in' operator on non-object");return typeof i=="function"?e===i:i.has(e)}function op(i,e,t){if(e!=null){if(typeof e!="object"&&typeof e!="function")throw new TypeError("Object expected.");var n,s;if(t){if(!Symbol.asyncDispose)throw new TypeError("Symbol.asyncDispose is not defined.");n=e[Symbol.asyncDispose]}if(n===void 0){if(!Symbol.dispose)throw new TypeError("Symbol.dispose is not defined.");n=e[Symbol.dispose],t&&(s=n)}if(typeof n!="function")throw new TypeError("Object not disposable.");s&&(n=function(){try{s.call(this)}catch(r){return Promise.reject(r)}}),i.stack.push({value:e,dispose:n,async:t})}else t&&i.stack.push({async:!0});return e}var Lg=typeof SuppressedError=="function"?SuppressedError:function(i,e,t){var n=new Error(t);return n.name="SuppressedError",n.error=i,n.suppressed=e,n};function lp(i){function e(r){i.error=i.hasError?new Lg(r,i.error,"An error was suppressed during disposal."):r,i.hasError=!0}var t,n=0;function s(){for(;t=i.stack.pop();)try{if(!t.async&&n===1)return n=0,i.stack.push(t),Promise.resolve().then(s);if(t.dispose){var r=t.dispose.call(t.value);if(t.async)return n|=2,Promise.resolve(r).then(s,function(a){return e(a),s()})}else n|=1}catch(a){e(a)}if(n===1)return i.hasError?Promise.reject(i.error):Promise.resolve();if(i.hasError)throw i.error}return s()}function cp(i,e){return typeof i=="string"&&/^\.\.?\//.test(i)?i.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,function(t,n,s,r,a){return n?e?".jsx":".js":s&&(!r||!a)?t:s+r+"."+a.toLowerCase()+"js"}):i}const kg={__extends:Nf,__assign:Io,__rest:Ff,__decorate:Bf,__param:zf,__esDecorate:Hf,__runInitializers:Vf,__propKey:Gf,__setFunctionName:$f,__metadata:Wf,__awaiter:Xf,__generator:qf,__createBinding:Wo,__exportStar:jf,__values:Do,__read:wh,__spread:Yf,__spreadArrays:Kf,__spreadArray:Jf,__await:vr,__asyncGenerator:Zf,__asyncDelegator:Qf,__asyncValues:ep,__makeTemplateObject:tp,__importStar:np,__importDefault:ip,__classPrivateFieldGet:sp,__classPrivateFieldSet:rp,__classPrivateFieldIn:ap,__addDisposableResource:op,__disposeResources:lp,__rewriteRelativeImportExtension:cp},Og=Object.freeze(Object.defineProperty({__proto__:null,__addDisposableResource:op,get __assign(){return Io},__asyncDelegator:Qf,__asyncGenerator:Zf,__asyncValues:ep,__await:vr,__awaiter:Xf,__classPrivateFieldGet:sp,__classPrivateFieldIn:ap,__classPrivateFieldSet:rp,__createBinding:Wo,__decorate:Bf,__disposeResources:lp,__esDecorate:Hf,__exportStar:jf,__extends:Nf,__generator:qf,__importDefault:ip,__importStar:np,__makeTemplateObject:tp,__metadata:Wf,__param:zf,__propKey:Gf,__read:wh,__rest:Ff,__rewriteRelativeImportExtension:cp,__runInitializers:Vf,__setFunctionName:$f,__spread:Yf,__spreadArray:Jf,__spreadArrays:Kf,__values:Do,default:kg},Symbol.toStringTag,{value:"Module"})),Xo=Sh(Og);var cl={},Mu;function qo(){return Mu||(Mu=1,(function(i){i.CloseCode=void 0,(function(n){n[n.CONSENTED=4e3]="CONSENTED",n[n.DEVMODE_RESTART=4010]="DEVMODE_RESTART"})(i.CloseCode||(i.CloseCode={}));class e extends Error{constructor(s,r){super(r),this.name="ServerError",this.code=s}}class t extends Error{constructor(s){super(s),this.name="AbortError"}}i.AbortError=t,i.ServerError=e})(cl)),cl}var hl={},ul={},dl={},Yr={exports:{}},Ug=Yr.exports,Eu;function Mh(){return Eu||(Eu=1,(function(i,e){(function(t,n){n(e)})(Ug,(function(t){t.OPERATION=void 0,(function(w){w[w.ADD=128]="ADD",w[w.REPLACE=0]="REPLACE",w[w.DELETE=64]="DELETE",w[w.DELETE_AND_MOVE=96]="DELETE_AND_MOVE",w[w.MOVE_AND_ADD=160]="MOVE_AND_ADD",w[w.DELETE_AND_ADD=192]="DELETE_AND_ADD",w[w.CLEAR=10]="CLEAR",w[w.REVERSE=15]="REVERSE",w[w.MOVE=32]="MOVE",w[w.DELETE_BY_REFID=33]="DELETE_BY_REFID",w[w.ADD_BY_REFID=129]="ADD_BY_REFID"})(t.OPERATION||(t.OPERATION={})),Symbol.metadata??(Symbol.metadata=Symbol.for("Symbol.metadata"));const r="~track",a="~encoder",o="~decoder",c="~filter",l="~getByIndex",d="~deleteByIndex",h="~changes",f="~childType",p="~onEncodeEnd",_="~onDecodeEnd",y="~descriptors",x="~__numFields",g="~__refTypeFieldIndexes",T="~__viewFieldIndexes",A="$__fieldIndexesByViewTag";let S;try{S=new TextEncoder}catch{}const O=new ArrayBuffer(8),k=new Int32Array(O),U=new Float32Array(O),P=new Float64Array(O),E=new BigInt64Array(O),B=typeof Buffer<"u"&&Buffer.byteLength?Buffer.byteLength:function(w,u){for(var m=0,v=0,b=0,D=w.length;b<D;b++)m=w.charCodeAt(b),m<128?v+=1:m<2048?v+=2:m<55296||m>=57344?v+=3:(b++,v+=4);return v};function Z(w,u,m){for(var v=0,b=0,D=u.length;b<D;b++)v=u.charCodeAt(b),v<128?w[m.offset++]=v:v<2048?(w[m.offset]=192|v>>6,w[m.offset+1]=128|v&63,m.offset+=2):v<55296||v>=57344?(w[m.offset]=224|v>>12,w[m.offset+1]=128|v>>6&63,w[m.offset+2]=128|v&63,m.offset+=3):(b++,v=65536+((v&1023)<<10|u.charCodeAt(b)&1023),w[m.offset]=240|v>>18,w[m.offset+1]=128|v>>12&63,w[m.offset+2]=128|v>>6&63,w[m.offset+3]=128|v&63,m.offset+=4)}function I(w,u,m){w[m.offset++]=u&255}function $(w,u,m){w[m.offset++]=u&255}function H(w,u,m){w[m.offset++]=u&255,w[m.offset++]=u>>8&255}function z(w,u,m){w[m.offset++]=u&255,w[m.offset++]=u>>8&255}function W(w,u,m){w[m.offset++]=u&255,w[m.offset++]=u>>8&255,w[m.offset++]=u>>16&255,w[m.offset++]=u>>24&255}function X(w,u,m){const v=u>>24,b=u>>16,D=u>>8,G=u;w[m.offset++]=G&255,w[m.offset++]=D&255,w[m.offset++]=b&255,w[m.offset++]=v&255}function de(w,u,m){const v=Math.floor(u/Math.pow(2,32)),b=u>>>0;X(w,b,m),X(w,v,m)}function fe(w,u,m){const v=u/Math.pow(2,32)>>0,b=u>>>0;X(w,b,m),X(w,v,m)}function Se(w,u,m){E[0]=BigInt.asIntN(64,u),W(w,k[0],m),W(w,k[1],m)}function Ne(w,u,m){E[0]=BigInt.asIntN(64,u),W(w,k[0],m),W(w,k[1],m)}function ct(w,u,m){U[0]=u,W(w,k[0],m)}function mt(w,u,m){P[0]=u,W(w,k[0],m),W(w,k[1],m)}function pt(w,u,m){w[m.offset++]=u?1:0}function ue(w,u,m){u||(u="");let v=B(u,"utf8"),b=0;if(v<32)w[m.offset++]=v|160,b=1;else if(v<256)w[m.offset++]=217,w[m.offset++]=v%255,b=2;else if(v<65536)w[m.offset++]=218,z(w,v,m),b=3;else if(v<4294967296)w[m.offset++]=219,X(w,v,m),b=5;else throw new Error("String too long");return Z(w,u,m),b+v}function pe(w,u,m){if(isNaN(u))return pe(w,0,m);if(isFinite(u)){if(u!==(u|0))return Math.abs(u)<=34028235e31&&(U[0]=u,Math.abs(Math.abs(U[0])-Math.abs(u))<1e-4)?(w[m.offset++]=202,ct(w,u,m),5):(w[m.offset++]=203,mt(w,u,m),9)}else return pe(w,u>0?Number.MAX_SAFE_INTEGER:-Number.MAX_SAFE_INTEGER,m);return u>=0?u<128?(w[m.offset++]=u&255,1):u<256?(w[m.offset++]=204,w[m.offset++]=u&255,2):u<65536?(w[m.offset++]=205,z(w,u,m),3):u<4294967296?(w[m.offset++]=206,X(w,u,m),5):(w[m.offset++]=207,fe(w,u,m),9):u>=-32?(w[m.offset++]=224|u+32,1):u>=-128?(w[m.offset++]=208,I(w,u,m),2):u>=-32768?(w[m.offset++]=209,H(w,u,m),3):u>=-2147483648?(w[m.offset++]=210,W(w,u,m),5):(w[m.offset++]=211,de(w,u,m),9)}const Ae={int8:I,uint8:$,int16:H,uint16:z,int32:W,uint32:X,int64:de,uint64:fe,bigint64:Se,biguint64:Ne,float32:ct,float64:mt,boolean:pt,string:ue,number:pe,utf8Write:Z,utf8Length:B},nt=new ArrayBuffer(8),Ge=new Int32Array(nt),gt=new Float32Array(nt),rn=new Float64Array(nt),F=new BigUint64Array(nt),zt=new BigInt64Array(nt);function ot(w,u,m){m>w.length-u.offset&&(m=w.length-u.offset);for(var v="",b=0,D=u.offset,G=u.offset+m;D<G;D++){var Q=w[D];if((Q&128)===0){v+=String.fromCharCode(Q);continue}if((Q&224)===192){v+=String.fromCharCode((Q&31)<<6|w[++D]&63);continue}if((Q&240)===224){v+=String.fromCharCode((Q&15)<<12|(w[++D]&63)<<6|(w[++D]&63)<<0);continue}if((Q&248)===240){b=(Q&7)<<18|(w[++D]&63)<<12|(w[++D]&63)<<6|(w[++D]&63)<<0,b>=65536?(b-=65536,v+=String.fromCharCode((b>>>10)+55296,(b&1023)+56320)):v+=String.fromCharCode(b);continue}console.error("decode.utf8Read(): Invalid byte "+Q+" at offset "+D+". Skip to end of string: "+(u.offset+m));break}return u.offset+=m,v}function it(w,u){return Be(w,u)<<24>>24}function Be(w,u){return w[u.offset++]}function Ut(w,u){return ze(w,u)<<16>>16}function ze(w,u){return w[u.offset++]|w[u.offset++]<<8}function Qe(w,u){return w[u.offset++]|w[u.offset++]<<8|w[u.offset++]<<16|w[u.offset++]<<24}function $t(w,u){return Qe(w,u)>>>0}function Wt(w,u){return Ge[0]=Qe(w,u),gt[0]}function L(w,u){return Ge[0]=Qe(w,u),Ge[1]=Qe(w,u),rn[0]}function M(w,u){const m=$t(w,u);return Qe(w,u)*Math.pow(2,32)+m}function ee(w,u){const m=$t(w,u);return $t(w,u)*Math.pow(2,32)+m}function ce(w,u){return Ge[0]=Qe(w,u),Ge[1]=Qe(w,u),zt[0]}function me(w,u){return Ge[0]=Qe(w,u),Ge[1]=Qe(w,u),F[0]}function re(w,u){return Be(w,u)>0}function je(w,u){const m=w[u.offset++];let v;return m<192?v=m&31:m===217?v=Be(w,u):m===218?v=ze(w,u):m===219&&(v=$t(w,u)),ot(w,u,v)}function we(w,u){const m=w[u.offset++];if(m<128)return m;if(m===202)return Wt(w,u);if(m===203)return L(w,u);if(m===204)return Be(w,u);if(m===205)return ze(w,u);if(m===206)return $t(w,u);if(m===207)return ee(w,u);if(m===208)return it(w,u);if(m===209)return Ut(w,u);if(m===210)return Qe(w,u);if(m===211)return M(w,u);if(m>223)return(255-m+1)*-1}function Xe(w,u){const m=w[u.offset];return m<192&&m>160||m===217||m===218||m===219}const Ue={utf8Read:ot,int8:it,uint8:Be,int16:Ut,uint16:ze,int32:Qe,uint32:$t,float32:Wt,float64:L,int64:M,uint64:ee,bigint64:ce,biguint64:me,boolean:re,string:je,number:we,stringCheck:Xe},ye={},ke=new Map;function qe(w,u){u.constructor&&(ke.set(u.constructor,w),ye[w]=u),u.encode&&(Ae[w]=u.encode),u.decode&&(Ue[w]=u.decode)}function We(w){return ye[w]}function Re(w){for(const u in w)qe(u,w[u]);return u=>Ee(u)}const ti=class ti{static register(u){const m=Object.getPrototypeOf(u);if(m!==De){let v=ti.inheritedTypes.get(m);v||(v=new Set,ti.inheritedTypes.set(m,v)),v.add(u)}}static cache(u){let m=ti.cachedContexts.get(u);return m||(m=new ti(u),ti.cachedContexts.set(u,m)),m}constructor(u){this.types={},this.schemas=new Map,this.hasFilters=!1,this.parentFiltered={},u&&this.discoverTypes(u)}has(u){return this.schemas.has(u)}get(u){return this.types[u]}add(u,m=this.schemas.size){return this.schemas.has(u)?!1:(this.types[m]=u,u[Symbol.metadata]===void 0&&xe.initialize(u),this.schemas.set(u,m),!0)}getTypeId(u){return this.schemas.get(u)}discoverTypes(u,m,v,b){var Q,J;if(b&&this.registerFilteredByParent(u,m,v),!this.add(u))return;(Q=ti.inheritedTypes.get(u))==null||Q.forEach(se=>{this.discoverTypes(se,m,v,b)});let D=u;for(;(D=Object.getPrototypeOf(D))&&D!==De&&D!==Function.prototype;)this.discoverTypes(D);const G=u[J=Symbol.metadata]??(u[J]={});G[T]&&(this.hasFilters=!0);for(const se in G){const le=se,ae=G[le].type,he=G[le].tag!==void 0;if(typeof ae!="string")if(typeof ae=="function")this.discoverTypes(ae,u,le,b||he);else{const Le=Object.values(ae)[0];if(typeof Le=="string")continue;this.discoverTypes(Le,u,le,b||he)}}}registerFilteredByParent(u,m,v){let D=`${this.schemas.get(u)??this.schemas.size}`;m&&(D+=`-${this.schemas.get(m)}`),D+=`-${v}`,this.parentFiltered[D]=!0}debug(){let u="";for(const m in this.parentFiltered){const v=m.split("-").map(Number),b=v.pop();u+=`
		`,u+=`${m}: ${v.reverse().map((D,G)=>{const Q=this.types[D],J=Q[Symbol.metadata];let se=Q.name;return G===0&&(se+=`[${J[b].name}]`),`${se}`}).join(" -> ")}`}return`TypeContext ->
	Schema types: ${this.schemas.size}
	hasFilters: ${this.hasFilters}
	parentFiltered:${u}`}};ti.inheritedTypes=new Map,ti.cachedContexts=new Map;let et=ti;function V(w){if(Array.isArray(w))return{array:V(w[0])};if(typeof w.type<"u")return w.type;if(be(w))return Object.keys(w).every(u=>typeof w[u]=="string")?"string":"number";if(typeof w=="object"&&w!==null){const u=Object.keys(w).find(m=>ye[m]!==void 0);if(u)return w[u]=V(w[u]),w}return w}function be(w){if(typeof w=="function"&&w[Symbol.metadata])return!1;const u=Object.keys(w),m=u.filter(v=>/\d+/.test(v));return!!(m.length>0&&m.length===u.length/2&&w[w[m[0]]]==m[0]||u.length>0&&u.every(v=>typeof w[v]=="string"&&w[v]===v))}const xe={addField(w,u,m,v,b){if(u>64)throw new Error(`Can't define field '${m}'.
Schema instances may only have up to 64 fields.`);w[u]=Object.assign(w[u]||{},{type:V(v),index:u,name:m}),Object.defineProperty(w,y,{value:w[y]||{},enumerable:!1,configurable:!0}),b?(w[y][m]=b,w[y][`_${m}`]={value:void 0,writable:!0,enumerable:!1,configurable:!0}):w[y][m]={value:void 0,writable:!0,enumerable:!0,configurable:!0},Object.defineProperty(w,x,{value:u,enumerable:!1,configurable:!0}),Object.defineProperty(w,m,{value:u,enumerable:!1,configurable:!0}),typeof w[u].type!="string"&&(w[g]===void 0&&Object.defineProperty(w,g,{value:[],enumerable:!1,configurable:!0}),w[g].push(u))},setTag(w,u,m){const v=w[u],b=w[v];b.tag=m,w[T]||(Object.defineProperty(w,T,{value:[],enumerable:!1,configurable:!0}),Object.defineProperty(w,A,{value:{},enumerable:!1,configurable:!0})),w[T].push(v),w[A][m]||(w[A][m]=[]),w[A][m].push(v)},setFields(w,u){const m=w.prototype.constructor;et.register(m);const v=Object.getPrototypeOf(m),b=v&&v[Symbol.metadata],D=xe.initialize(m);m[r]||(m[r]=De[r]),m[a]||(m[a]=De[a]),m[o]||(m[o]=De[o]),m.prototype.toJSON||(m.prototype.toJSON=De.prototype.toJSON);let G=D[x]??(b&&b[x])??-1;G++;for(const Q in u){const J=V(u[Q]),se=typeof Object.keys(J)[0]=="string"&&We(Object.keys(J)[0]),le=se?Object.values(J)[0]:J;xe.addField(D,G,Q,J,tt(`_${Q}`,G,le,se)),G++}return w},isDeprecated(w,u){return w[u].deprecated===!0},init(w){const u={};w[Symbol.metadata]=u,Object.defineProperty(u,x,{value:0,enumerable:!1,configurable:!0})},initialize(w){const u=Object.getPrototypeOf(w),m=u[Symbol.metadata];let v=w[Symbol.metadata]??Object.create(null);return u!==De&&v===m&&(v=Object.create(null),m&&(Object.setPrototypeOf(v,m),Object.defineProperty(v,x,{value:m[x],enumerable:!1,configurable:!0,writable:!0}),m[T]!==void 0&&(Object.defineProperty(v,T,{value:[...m[T]],enumerable:!1,configurable:!0,writable:!0}),Object.defineProperty(v,A,{value:{...m[A]},enumerable:!1,configurable:!0,writable:!0})),m[g]!==void 0&&Object.defineProperty(v,g,{value:[...m[g]],enumerable:!1,configurable:!0,writable:!0}),Object.defineProperty(v,y,{value:{...m[y]},enumerable:!1,configurable:!0,writable:!0}))),Object.defineProperty(w,Symbol.metadata,{value:v,writable:!1,configurable:!0}),v},isValidInstance(w){return w.constructor[Symbol.metadata]&&Object.prototype.hasOwnProperty.call(w.constructor[Symbol.metadata],x)},getFields(w){const u=w[Symbol.metadata],m={};for(let v=0;v<=u[x];v++)m[u[v].name]=u[v].type;return m},hasViewTagAtIndex(w,u){var m;return(m=w==null?void 0:w[T])==null?void 0:m.includes(u)}};function Oe(w){return{indexes:{},operations:[],queueRootNode:w}}function _e(){return{next:void 0,tail:void 0}}function oe(w,u){const m=w.indexes[u];m===void 0?w.indexes[u]=w.operations.push(u)-1:w.operations[m]=u}function $e(w,u){var v;let m=w.indexes[u];m===void 0&&(m=Object.values(w.indexes).at(-1),u=(v=Object.entries(w.indexes).find(([b,D])=>D===m))==null?void 0:v[0]),w.operations[m]=void 0,delete w.indexes[u]}class st{constructor(u){var m;this.isFiltered=!1,this.indexedOperations={},this.changes={indexes:{},operations:[]},this.allChanges={indexes:{},operations:[]},this.isNew=!0,this.ref=u,this.metadata=u.constructor[Symbol.metadata],(m=this.metadata)!=null&&m[T]&&(this.allFilteredChanges={indexes:{},operations:[]},this.filteredChanges={indexes:{},operations:[]})}setRoot(u){this.root=u;const m=this.root.add(this);this.checkIsFiltered(this.parent,this.parentIndex,m),m&&this.forEachChild((v,b)=>{v.root!==u?v.setRoot(u):u.add(v)})}setParent(u,m,v){if(this.addParent(u,v),!m)return;const b=m.add(this);m!==this.root&&(this.root=m,this.checkIsFiltered(u,v,b)),b&&this.forEachChild((D,G)=>{if(D.root===m){m.add(D),m.moveNextToParent(D);return}D.setParent(this.ref,m,G)})}forEachChild(u){var m,v;if(this.ref[f]){if(typeof this.ref[f]!="string")for(const[b,D]of this.ref.entries())D&&u(D[h],((m=this.indexes)==null?void 0:m[b])??b)}else for(const b of((v=this.metadata)==null?void 0:v[g])??[]){const D=this.metadata[b],G=this.ref[D.name];G&&u(G[h],b)}}operation(u){var m,v;this.filteredChanges!==void 0?(this.filteredChanges.operations.push(-u),(m=this.root)==null||m.enqueueChangeTree(this,"filteredChanges")):(this.changes.operations.push(-u),(v=this.root)==null||v.enqueueChangeTree(this,"changes"))}change(u,m=t.OPERATION.ADD){var G,Q,J;const v=this.isFiltered||((Q=(G=this.metadata)==null?void 0:G[u])==null?void 0:Q.tag)!==void 0,b=v?this.filteredChanges:this.changes,D=this.indexedOperations[u];if(!D||D===t.OPERATION.DELETE){const se=D&&D===t.OPERATION.DELETE?t.OPERATION.DELETE_AND_ADD:m;this.indexedOperations[u]=se}oe(b,u),v?(oe(this.allFilteredChanges,u),this.root&&(this.root.enqueueChangeTree(this,"filteredChanges"),this.root.enqueueChangeTree(this,"allFilteredChanges"))):(oe(this.allChanges,u),(J=this.root)==null||J.enqueueChangeTree(this,"changes"))}shiftChangeIndexes(u){const m=this.isFiltered?this.filteredChanges:this.changes,v={},b={};for(const D in this.indexedOperations)v[Number(D)+u]=this.indexedOperations[D],b[Number(D)+u]=m.indexes[D];this.indexedOperations=v,m.indexes=b,m.operations=m.operations.map(D=>D+u)}shiftAllChangeIndexes(u,m=0){this.filteredChanges!==void 0?(this._shiftAllChangeIndexes(u,m,this.allFilteredChanges),this._shiftAllChangeIndexes(u,m,this.allChanges)):this._shiftAllChangeIndexes(u,m,this.allChanges)}_shiftAllChangeIndexes(u,m=0,v){const b={};let D=0;for(const G in v.indexes)b[D++]=v.indexes[G];v.indexes=b;for(let G=0;G<v.operations.length;G++){const Q=v.operations[G];Q>m&&(v.operations[G]=Q+u)}}indexedOperation(u,m,v=u){var b,D;this.indexedOperations[u]=m,this.filteredChanges!==void 0?(oe(this.allFilteredChanges,v),oe(this.filteredChanges,u),(b=this.root)==null||b.enqueueChangeTree(this,"filteredChanges")):(oe(this.allChanges,v),oe(this.changes,u),(D=this.root)==null||D.enqueueChangeTree(this,"changes"))}getType(u){return this.ref[f]||this.metadata[u].type}getChange(u){return this.indexedOperations[u]}getValue(u,m=!1){return this.ref[l](u,m)}delete(u,m,v=u){var G,Q,J;if(u===void 0){try{throw new Error(`@colyseus/schema ${this.ref.constructor.name}: trying to delete non-existing index '${u}'`)}catch(se){console.warn(se)}return}const b=this.filteredChanges!==void 0?this.filteredChanges:this.changes;this.indexedOperations[u]=m??t.OPERATION.DELETE,oe(b,u),$e(this.allChanges,v);const D=this.getValue(u);return D&&D[h]&&((G=this.root)==null||G.remove(D[h])),this.filteredChanges!==void 0?($e(this.allFilteredChanges,v),(Q=this.root)==null||Q.enqueueChangeTree(this,"filteredChanges")):(J=this.root)==null||J.enqueueChangeTree(this,"changes"),D}endEncode(u){var m,v;this.indexedOperations={},this[u]=Oe(),(v=(m=this.ref)[p])==null||v.call(m),this.isNew=!1}discard(u=!1){var m,v;(v=(m=this.ref)[p])==null||v.call(m),this.indexedOperations={},this.changes=Oe(this.changes.queueRootNode),this.filteredChanges!==void 0&&(this.filteredChanges=Oe(this.filteredChanges.queueRootNode)),u&&(this.allChanges=Oe(this.allChanges.queueRootNode),this.allFilteredChanges!==void 0&&(this.allFilteredChanges=Oe(this.allFilteredChanges.queueRootNode)))}discardAll(){const u=Object.keys(this.indexedOperations);for(let m=0,v=u.length;m<v;m++){const b=this.getValue(Number(u[m]));b&&b[h]&&b[h].discardAll()}this.discard()}get changed(){return Object.entries(this.indexedOperations).length>0}checkIsFiltered(u,m,v){var b,D,G,Q;this.root.types.hasFilters&&(this._checkFilteredByParent(u,m),this.filteredChanges!==void 0&&((b=this.root)==null||b.enqueueChangeTree(this,"filteredChanges"),v&&((D=this.root)==null||D.enqueueChangeTree(this,"allFilteredChanges")))),this.isFiltered||((G=this.root)==null||G.enqueueChangeTree(this,"changes"),v&&((Q=this.root)==null||Q.enqueueChangeTree(this,"allChanges")))}_checkFilteredByParent(u,m){if(!u)return;const v=xe.isValidInstance(this.ref)?this.ref.constructor:this.ref[f];let b,D=!xe.isValidInstance(u);D?(b=u[h],u=b.parent,m=b.parentIndex):b=u[h];const G=u.constructor;let Q=`${this.root.types.getTypeId(v)}`;G&&(Q+=`-${this.root.types.schemas.get(G)}`),Q+=`-${m}`;const J=xe.hasViewTagAtIndex(G==null?void 0:G[Symbol.metadata],m);this.isFiltered=u[h].isFiltered||this.root.types.parentFiltered[Q]||J,this.isFiltered&&(this.isVisibilitySharedWithParent=b.isFiltered&&typeof v!="string"&&!J&&D,this.filteredChanges||(this.filteredChanges=Oe(),this.allFilteredChanges=Oe()),this.changes.operations.length>0&&(this.changes.operations.forEach(se=>oe(this.filteredChanges,se)),this.allChanges.operations.forEach(se=>oe(this.allFilteredChanges,se)),this.changes=Oe(),this.allChanges=Oe()))}get parent(){var u;return(u=this.parentChain)==null?void 0:u.ref}get parentIndex(){var u;return(u=this.parentChain)==null?void 0:u.index}addParent(u,m){if(this.hasParent((v,b)=>v[h]===u[h])){this.parentChain.index=m;return}this.parentChain={ref:u,index:m,next:this.parentChain}}removeParent(u=this.parent){let m=this.parentChain,v=null;for(;m;){if(m.ref[h]===u[h])return v?v.next=m.next:this.parentChain=m.next,!0;v=m,m=m.next}return this.parentChain===void 0}findParent(u){let m=this.parentChain;for(;m;){if(u(m.ref,m.index))return m;m=m.next}}hasParent(u){return this.findParent(u)!==void 0}getAllParents(){const u=[];let m=this.parentChain;for(;m;)u.push({ref:m.ref,index:m.index}),m=m.next;return u}}function Tt(w,u,m,v,b,D){var G;typeof m=="string"?(G=Ae[m])==null||G.call(Ae,u,v,D):m[Symbol.metadata]!==void 0?(Ae.number(u,v[h].refId,D),(b&t.OPERATION.ADD)===t.OPERATION.ADD&&w.tryEncodeTypeId(u,m,v.constructor,D)):Ae.number(u,v[h].refId,D)}const yt=function(w,u,m,v,b,D,G,Q,J){if(u[D.offset++]=(v|b)&255,b===t.OPERATION.DELETE)return;const se=m.ref,le=J[v];Tt(w,u,J[v].type,se[le.name],b,D)},En=function(w,u,m,v,b,D){if(u[D.offset++]=b&255,Ae.number(u,v,D),b===t.OPERATION.DELETE)return;const G=m.ref;if((b&t.OPERATION.ADD)===t.OPERATION.ADD&&typeof G.set=="function"){const se=m.ref.$indexes.get(v);Ae.string(u,se,D)}const Q=G[f],J=G[l](v);Tt(w,u,Q,J,b,D)},Pn=function(w,u,m,v,b,D,G,Q){const J=m.ref,se=Q&&m.isFiltered&&typeof m.getType(v)!="string";let le;if(se){const Le=J.tmpItems[v];if(!Le)return;le=Le[h].refId,b===t.OPERATION.DELETE?b=t.OPERATION.DELETE_BY_REFID:b===t.OPERATION.ADD&&(b=t.OPERATION.ADD_BY_REFID)}else le=v;if(u[D.offset++]=b&255,Ae.number(u,le,D),b===t.OPERATION.DELETE||b===t.OPERATION.DELETE_BY_REFID)return;const ae=m.getType(v),he=m.getValue(v,G);Tt(w,u,ae,he,b,D)},Cr=-1;function Gn(w,u,m,v,b,D,G,Q){const J=w.root,se=m[l](v);let le;if((u&t.OPERATION.DELETE)===t.OPERATION.DELETE){const ae=J.refIds.get(se);ae!==void 0&&J.removeRef(ae),u!==t.OPERATION.DELETE_AND_ADD&&m[d](v),le=void 0}if(u!==t.OPERATION.DELETE)if(De.is(b)){const ae=Ue.number(D,G);if(le=J.refs.get(ae),(u&t.OPERATION.ADD)===t.OPERATION.ADD){const he=w.getInstanceType(D,G,b);le||(le=w.createInstanceOfType(he)),J.addRef(ae,le,le!==se||u===t.OPERATION.DELETE_AND_ADD&&le===se)}}else if(typeof b=="string")le=Ue[b](D,G);else{const ae=We(Object.keys(b)[0]),he=Ue.number(D,G),Le=J.refs.has(he)?se||J.refs.get(he):new ae.constructor;if(le=Le.clone(!0),le[f]=Object.values(b)[0],se){let Fe=J.refIds.get(se);if(Fe!==void 0&&he!==Fe){const Me=se.entries();let ve;for(;(ve=Me.next())&&!ve.done;){const[Ve,Rt]=ve.value;typeof Rt=="object"&&(Fe=J.refIds.get(Rt),J.removeRef(Fe)),Q.push({ref:se,refId:Fe,op:t.OPERATION.DELETE,field:Ve,value:void 0,previousValue:Rt})}}}J.addRef(he,le,Le!==se||u===t.OPERATION.DELETE_AND_ADD&&Le===se)}return{value:le,previousValue:se}}const ks=function(w,u,m,v,b){const D=u[m.offset++],G=v.constructor[Symbol.metadata],Q=D>>6<<6,J=D%(Q||255),se=G[J];if(se===void 0)return console.warn("@colyseus/schema: field not defined at",{index:J,ref:v.constructor.name,metadata:G}),Cr;const{value:le,previousValue:ae}=Gn(w,Q,v,J,se.type,u,m,b);le!=null&&(v[se.name]=le),ae!==le&&b.push({ref:v,refId:w.currentRefId,op:Q,field:se.name,value:le,previousValue:ae})},ns=function(w,u,m,v,b){const D=u[m.offset++];if(D===t.OPERATION.CLEAR){w.removeChildRefs(v,b),v.clear();return}const G=Ue.number(u,m),Q=v[f];let J;(D&t.OPERATION.ADD)===t.OPERATION.ADD?typeof v.set=="function"?(J=Ue.string(u,m),v.setIndex(G,J)):J=G:J=v.getIndex(G);const{value:se,previousValue:le}=Gn(w,D,v,G,Q,u,m,b);if(se!=null){if(typeof v.set=="function")v.$items.set(J,se);else if(typeof v.$setAt=="function")v.$setAt(G,se,D);else if(typeof v.add=="function"){const ae=v.add(se);typeof ae=="number"&&v.setIndex(ae,ae)}}le!==se&&b.push({ref:v,refId:w.currentRefId,op:D,field:"",dynamicIndex:J,value:se,previousValue:le})},Ta=function(w,u,m,v,b){let D=u[m.offset++],G;if(D===t.OPERATION.CLEAR){w.removeChildRefs(v,b),v.clear();return}else if(D===t.OPERATION.REVERSE){v.reverse();return}else if(D===t.OPERATION.DELETE_BY_REFID){const ae=Ue.number(u,m),he=w.root.refs.get(ae);G=v.findIndex(Le=>Le===he),v[d](G),b.push({ref:v,refId:w.currentRefId,op:t.OPERATION.DELETE,field:"",dynamicIndex:G,value:void 0,previousValue:he});return}else if(D===t.OPERATION.ADD_BY_REFID){const ae=Ue.number(u,m),he=w.root.refs.get(ae);he&&(G=v.findIndex(Le=>Le===he)),(G===-1||G===void 0)&&(G=v.length)}else G=Ue.number(u,m);const Q=v[f];let J=G;const{value:se,previousValue:le}=Gn(w,D,v,G,Q,u,m,b);se!=null&&se!==le&&v.$setAt(G,se,D),le!==se&&b.push({ref:v,refId:w.currentRefId,op:D,field:"",dynamicIndex:J,value:se,previousValue:le})};class is extends Error{}function Aa(w,u,m,v){let b,D=!1;switch(u){case"number":case"int8":case"uint8":case"int16":case"uint16":case"int32":case"uint32":case"int64":case"uint64":case"float32":case"float64":b="number",isNaN(w)&&console.log(`trying to encode "NaN" in ${m.constructor.name}#${v}`);break;case"bigint64":case"biguint64":b="bigint";break;case"string":b="string",D=!0;break;case"boolean":return;default:return}if(typeof w!==b&&(!D||D&&w!==null)){let G=`'${JSON.stringify(w)}'${w&&w.constructor&&` (${w.constructor.name})`||""}`;throw new is(`a '${b}' was expected, but ${G} was provided in ${m.constructor.name}#${v}`)}}function mi(w,u,m,v){if(!(w instanceof u))throw new is(`a '${u.name}' was expected, but '${w&&w.constructor.name}' was provided in ${m.constructor.name}#${v}`)}var Pr,Ir;const al=(w,u)=>{const m=w.toString(),v=u.toString();return m<v?-1:m>v?1:0},Wn=class Wn{static[(Pr=a,Ir=o,c)](u,m,v){var b;return!v||typeof u[f]=="string"||v.isChangeTreeVisible((b=u.tmpItems[m])==null?void 0:b[h])}static is(u){return Array.isArray(u)||u.array!==void 0}static from(u){return new Wn(...Array.from(u))}constructor(...u){this.items=[],this.tmpItems=[],this.deletedIndexes={},this.isMovingItems=!1,Object.defineProperty(this,f,{value:void 0,enumerable:!1,writable:!0,configurable:!0});const m=new Proxy(this,{get:(v,b)=>typeof b!="symbol"&&!isNaN(b)?this.items[b]:Reflect.get(v,b),set:(v,b,D)=>{var G;if(typeof b!="symbol"&&!isNaN(b)){if(D==null)v.$deleteAt(b);else{if(D[h]){mi(D,v[f],v,b);const Q=v.items[b];v.isMovingItems?(Q!==void 0?D[h].isNew?v[h].indexedOperation(Number(b),t.OPERATION.MOVE_AND_ADD):(v[h].getChange(Number(b))&t.OPERATION.DELETE)===t.OPERATION.DELETE?v[h].indexedOperation(Number(b),t.OPERATION.DELETE_AND_MOVE):v[h].indexedOperation(Number(b),t.OPERATION.MOVE):D[h].isNew&&v[h].indexedOperation(Number(b),t.OPERATION.ADD),D[h].setParent(this,v[h].root,b)):v.$changeAt(Number(b),D),Q!==void 0&&((G=Q[h].root)==null||G.remove(Q[h]))}else v.$changeAt(Number(b),D);v.items[b]=D,v.tmpItems[b]=D}return!0}else return Reflect.set(v,b,D)},deleteProperty:(v,b)=>(typeof b=="number"?v.$deleteAt(b):delete v[b],!0),has:(v,b)=>typeof b!="symbol"&&!isNaN(Number(b))?Reflect.has(this.items,b):Reflect.has(v,b)});return Object.defineProperty(this,h,{value:new st(m),enumerable:!1,writable:!0}),u.length>0&&this.push(...u),m}set length(u){u===0?this.clear():u<this.items.length?this.splice(u,this.length-u):console.warn("ArraySchema: can't set .length to a higher value than its length.")}get length(){return this.items.length}push(...u){var b;let m=this.tmpItems.length;const v=this[h];for(let D=0,G=u.length;D<G;D++,m++){const Q=u[D];if(Q==null)return;typeof Q=="object"&&this[f]&&mi(Q,this[f],this,D),v.indexedOperation(m,t.OPERATION.ADD,this.items.length),this.items.push(Q),this.tmpItems.push(Q),(b=Q[h])==null||b.setParent(this,v.root,m)}return m}pop(){let u=-1;for(let m=this.tmpItems.length-1;m>=0;m--)if(this.deletedIndexes[m]!==!0){u=m;break}if(!(u<0))return this[h].delete(u,void 0,this.items.length-1),this.deletedIndexes[u]=!0,this.items.pop()}at(u){return u<0&&(u+=this.length),this.items[u]}$changeAt(u,m){var D;if(m==null){console.error("ArraySchema items cannot be null nor undefined; Use `deleteAt(index)` instead.");return}if(this.items[u]===m)return;const v=this.items[u]!==void 0?typeof m=="object"?t.OPERATION.DELETE_AND_ADD:t.OPERATION.REPLACE:t.OPERATION.ADD,b=this[h];b.change(u,v),(D=m[h])==null||D.setParent(this,b.root,u)}$deleteAt(u,m){this[h].delete(u,m)}$setAt(u,m,v){u===0&&v===t.OPERATION.ADD&&this.items[u]!==void 0?this.items.unshift(m):v===t.OPERATION.DELETE_AND_MOVE?(this.items.splice(u,1),this.items[u]=m):this.items[u]=m}clear(){if(this.items.length===0)return;const u=this[h];u.forEachChild((m,v)=>{var b;(b=u.root)==null||b.remove(m)}),u.discard(!0),u.operation(t.OPERATION.CLEAR),this.items.length=0,this.tmpItems.length=0}concat(...u){return new Wn(...this.items.concat(...u))}join(u){return this.items.join(u)}reverse(){return this[h].operation(t.OPERATION.REVERSE),this.items.reverse(),this.tmpItems.reverse(),this}shift(){if(this.items.length===0)return;const u=this[h],m=this.tmpItems.findIndex(b=>b===this.items[0]),v=this.items.findIndex(b=>b===this.items[0]);return u.delete(m,t.OPERATION.DELETE,v),u.shiftAllChangeIndexes(-1,v),this.deletedIndexes[m]=!0,this.items.shift()}slice(u,m){const v=new Wn;return v.push(...this.items.slice(u,m)),v}sort(u=al){this.isMovingItems=!0;const m=this[h];return this.items.sort(u).forEach((b,D)=>m.change(D,t.OPERATION.REPLACE)),this.tmpItems.sort(u),this.isMovingItems=!1,this}splice(u,m,...v){var se,le,ae;const b=this[h],D=this.items.length,G=this.tmpItems.length,Q=v.length,J=[];for(let he=0;he<G;he++)this.deletedIndexes[he]!==!0&&J.push(he);if(D>u){m===void 0&&(m=D-u);for(let he=u;he<u+m;he++){const Le=J[he];b.delete(Le,t.OPERATION.DELETE),this.deletedIndexes[Le]=!0}}else m=0;if(Q>0){if(Q>m)throw console.error("Inserting more elements than deleting during ArraySchema#splice()"),new Error("ArraySchema#splice(): insertCount must be equal or lower than deleteCount.");for(let he=0;he<Q;he++){const Le=(J[u]??D)+he;b.indexedOperation(Le,this.deletedIndexes[Le]?t.OPERATION.DELETE_AND_ADD:t.OPERATION.ADD),(se=v[he][h])==null||se.setParent(this,b.root,Le)}}return m>Q&&b.shiftAllChangeIndexes(-(m-Q),J[u+Q]),b.filteredChanges!==void 0?(le=b.root)==null||le.enqueueChangeTree(b,"filteredChanges"):(ae=b.root)==null||ae.enqueueChangeTree(b,"changes"),this.items.splice(u,m,...v)}unshift(...u){const m=this[h];return m.shiftChangeIndexes(u.length),m.isFiltered?oe(m.filteredChanges,this.items.length):oe(m.allChanges,this.items.length),u.forEach((v,b)=>{m.change(b,t.OPERATION.ADD)}),this.tmpItems.unshift(...u),this.items.unshift(...u)}indexOf(u,m){return this.items.indexOf(u,m)}lastIndexOf(u,m=this.length-1){return this.items.lastIndexOf(u,m)}every(u,m){return this.items.every(u,m)}some(u,m){return this.items.some(u,m)}forEach(u,m){return this.items.forEach(u,m)}map(u,m){return this.items.map(u,m)}filter(u,m){return this.items.filter(u,m)}reduce(u,m){return this.items.reduce(u,m)}reduceRight(u,m){return this.items.reduceRight(u,m)}find(u,m){return this.items.find(u,m)}findIndex(u,m){return this.items.findIndex(u,m)}fill(u,m,v){throw new Error("ArraySchema#fill() not implemented")}copyWithin(u,m,v){throw new Error("ArraySchema#copyWithin() not implemented")}toString(){return this.items.toString()}toLocaleString(){return this.items.toLocaleString()}[Symbol.iterator](){return this.items[Symbol.iterator]()}static get[Symbol.species](){return Wn}entries(){return this.items.entries()}keys(){return this.items.keys()}values(){return this.items.values()}includes(u,m){return this.items.includes(u,m)}flatMap(u,m){throw new Error("ArraySchema#flatMap() is not supported.")}flat(u){throw new Error("ArraySchema#flat() is not supported.")}findLast(){return this.items.findLast.apply(this.items,arguments)}findLastIndex(...u){return this.items.findLastIndex.apply(this.items,arguments)}with(u,m){const v=this.items.slice();return u<0&&(u+=this.length),v[u]=m,new Wn(...v)}toReversed(){return this.items.slice().reverse()}toSorted(u){return this.items.slice().sort(u)}toSpliced(u,m,...v){return this.items.toSpliced.apply(copy,arguments)}shuffle(){return this.move(u=>{let m=this.items.length;for(;m!=0;){let v=Math.floor(Math.random()*m);m--,[this[m],this[v]]=[this[v],this[m]]}})}move(u){return this.isMovingItems=!0,u(this),this.isMovingItems=!1,this}[l](u,m=!1){return m?this.items[u]:this.deletedIndexes[u]?this.items[u]:this.tmpItems[u]||this.items[u]}[d](u){this.items[u]=void 0,this.tmpItems[u]=void 0}[p](){this.tmpItems=this.items.slice(),this.deletedIndexes={}}[_](){this.items=this.items.filter(u=>u!==void 0),this.tmpItems=this.items.slice()}toArray(){return this.items.slice(0)}toJSON(){return this.toArray().map(u=>typeof u.toJSON=="function"?u.toJSON():u)}clone(u){let m;return u?(m=new Wn,m.push(...this.items)):m=new Wn(...this.map(v=>v[h]?v.clone():v)),m}};Wn[Pr]=Pn,Wn[Ir]=Ta;let In=Wn;qe("array",{constructor:In});var Ra,Ca;const Ui=class Ui{static[(Ra=a,Ca=o,c)](u,m,v){return!v||typeof u[f]=="string"||v.isChangeTreeVisible((u[l](m)??u.deletedItems[m])[h])}static is(u){return u.map!==void 0}constructor(u){this.$items=new Map,this.$indexes=new Map,this.deletedItems={};const m=new st(this);if(m.indexes={},Object.defineProperty(this,h,{value:m,enumerable:!1,writable:!0}),u)if(u instanceof Map||u instanceof Ui)u.forEach((v,b)=>this.set(b,v));else for(const v in u)this.set(v,u[v]);Object.defineProperty(this,f,{value:void 0,enumerable:!1,writable:!0,configurable:!0})}[Symbol.iterator](){return this.$items[Symbol.iterator]()}get[Symbol.toStringTag](){return this.$items[Symbol.toStringTag]}static get[Symbol.species](){return Ui}set(u,m){var Q;if(m==null)throw new Error(`MapSchema#set('${u}', ${m}): trying to set ${m} value on '${u}'.`);typeof m=="object"&&this[f]&&mi(m,this[f],this,u),u=u.toString();const v=this[h],b=m[h]!==void 0;let D,G;if(typeof v.indexes[u]<"u"){D=v.indexes[u],G=t.OPERATION.REPLACE;const J=this.$items.get(u);if(J===m)return;b&&(G=t.OPERATION.DELETE_AND_ADD,J!==void 0&&((Q=J[h].root)==null||Q.remove(J[h]))),this.deletedItems[D]&&delete this.deletedItems[D]}else D=v.indexes[x]??0,G=t.OPERATION.ADD,this.$indexes.set(D,u),v.indexes[u]=D,v.indexes[x]=D+1;return this.$items.set(u,m),v.change(D,G),b&&m[h].setParent(this,v.root,D),this}get(u){return this.$items.get(u)}delete(u){if(!this.$items.has(u))return!1;const m=this[h].indexes[u];return this.deletedItems[m]=this[h].delete(m),this.$items.delete(u)}clear(){const u=this[h];u.discard(!0),u.indexes={},u.forEachChild((m,v)=>{var b;(b=u.root)==null||b.remove(m)}),this.$indexes.clear(),this.$items.clear(),u.operation(t.OPERATION.CLEAR)}has(u){return this.$items.has(u)}forEach(u){this.$items.forEach(u)}entries(){return this.$items.entries()}keys(){return this.$items.keys()}values(){return this.$items.values()}get size(){return this.$items.size}setIndex(u,m){this.$indexes.set(u,m)}getIndex(u){return this.$indexes.get(u)}[l](u){return this.$items.get(this.$indexes.get(u))}[d](u){const m=this.$indexes.get(u);this.$items.delete(m),this.$indexes.delete(u)}[p](){const u=this[h];for(const m in this.deletedItems){const v=parseInt(m),b=this.$indexes.get(v);delete u.indexes[b],this.$indexes.delete(v)}this.deletedItems={}}toJSON(){const u={};return this.forEach((m,v)=>{u[v]=typeof m.toJSON=="function"?m.toJSON():m}),u}clone(u){let m;return u?m=Object.assign(new Ui,this):(m=new Ui,this.forEach((v,b)=>{v[h]?m.set(b,v.clone()):m.set(b,v)})),m}};Ui[Ra]=En,Ui[Ca]=ns;let $n=Ui;qe("map",{constructor:$n});var Pa,C;const Os=class Os{static[(Pa=a,C=o,c)](u,m,v){return!v||typeof u[f]=="string"||v.isChangeTreeVisible((u[l](m)??u.deletedItems[m])[h])}static is(u){return u.collection!==void 0}constructor(u){this.$items=new Map,this.$indexes=new Map,this.deletedItems={},this.$refId=0,this[h]=new st(this),this[h].indexes={},u&&u.forEach(m=>this.add(m)),Object.defineProperty(this,f,{value:void 0,enumerable:!1,writable:!0,configurable:!0})}add(u){const m=this.$refId++;return u[h]!==void 0&&u[h].setParent(this,this[h].root,m),this[h].indexes[m]=m,this.$indexes.set(m,m),this.$items.set(m,u),this[h].change(m),m}at(u){const m=Array.from(this.$items.keys())[u];return this.$items.get(m)}entries(){return this.$items.entries()}delete(u){const m=this.$items.entries();let v,b;for(;(b=m.next())&&!b.done;)if(u===b.value[1]){v=b.value[0];break}return v===void 0?!1:(this.deletedItems[v]=this[h].delete(v),this.$indexes.delete(v),this.$items.delete(v))}clear(){const u=this[h];u.discard(!0),u.indexes={},u.forEachChild((m,v)=>{var b;(b=u.root)==null||b.remove(m)}),this.$indexes.clear(),this.$items.clear(),u.operation(t.OPERATION.CLEAR)}has(u){return Array.from(this.$items.values()).some(m=>m===u)}forEach(u){this.$items.forEach((m,v,b)=>u(m,v,this))}values(){return this.$items.values()}get size(){return this.$items.size}[Symbol.iterator](){return this.$items.values()}setIndex(u,m){this.$indexes.set(u,m)}getIndex(u){return this.$indexes.get(u)}[l](u){return this.$items.get(this.$indexes.get(u))}[d](u){const m=this.$indexes.get(u);this.$items.delete(m),this.$indexes.delete(u)}[p](){this.deletedItems={}}toArray(){return Array.from(this.$items.values())}toJSON(){const u=[];return this.forEach((m,v)=>{u.push(typeof m.toJSON=="function"?m.toJSON():m)}),u}clone(u){let m;return u?m=Object.assign(new Os,this):(m=new Os,this.forEach(v=>{v[h]?m.add(v.clone()):m.add(v)})),m}};Os[Pa]=En,Os[C]=ns;let j=Os;qe("collection",{constructor:j});var ne,ie;const Us=class Us{static[(ne=a,ie=o,c)](u,m,v){return!v||typeof u[f]=="string"||v.visible.has((u[l](m)??u.deletedItems[m])[h])}static is(u){return u.set!==void 0}constructor(u){this.$items=new Map,this.$indexes=new Map,this.deletedItems={},this.$refId=0,this[h]=new st(this),this[h].indexes={},u&&u.forEach(m=>this.add(m)),Object.defineProperty(this,f,{value:void 0,enumerable:!1,writable:!0,configurable:!0})}add(u){var b;if(this.has(u))return!1;const m=this.$refId++;u[h]!==void 0&&u[h].setParent(this,this[h].root,m);const v=((b=this[h].indexes[m])==null?void 0:b.op)??t.OPERATION.ADD;return this[h].indexes[m]=m,this.$indexes.set(m,m),this.$items.set(m,u),this[h].change(m,v),m}entries(){return this.$items.entries()}delete(u){const m=this.$items.entries();let v,b;for(;(b=m.next())&&!b.done;)if(u===b.value[1]){v=b.value[0];break}return v===void 0?!1:(this.deletedItems[v]=this[h].delete(v),this.$indexes.delete(v),this.$items.delete(v))}clear(){const u=this[h];u.discard(!0),u.indexes={},this.$indexes.clear(),this.$items.clear(),u.operation(t.OPERATION.CLEAR)}has(u){const m=this.$items.values();let v=!1,b;for(;(b=m.next())&&!b.done;)if(u===b.value){v=!0;break}return v}forEach(u){this.$items.forEach((m,v,b)=>u(m,v,this))}values(){return this.$items.values()}get size(){return this.$items.size}[Symbol.iterator](){return this.$items.values()}setIndex(u,m){this.$indexes.set(u,m)}getIndex(u){return this.$indexes.get(u)}[l](u){return this.$items.get(this.$indexes.get(u))}[d](u){const m=this.$indexes.get(u);this.$items.delete(m),this.$indexes.delete(u)}[p](){this.deletedItems={}}toArray(){return Array.from(this.$items.values())}toJSON(){const u=[];return this.forEach((m,v)=>{u.push(typeof m.toJSON=="function"?m.toJSON():m)}),u}clone(u){let m;return u?m=Object.assign(new Us,this):(m=new Us,this.forEach(v=>{v[h]?m.add(v.clone()):m.add(v)})),m}};Us[ne]=En,Us[ie]=ns;let K=Us;qe("set",{constructor:K});const ge=-1;function Ie(w){return et.register(w),w}function He(w=ge){return function(u,m){var Q;const v=u.constructor,D=Object.getPrototypeOf(v)[Symbol.metadata],G=v[Q=Symbol.metadata]??(v[Q]=Object.assign({},v[Symbol.metadata],D??Object.create(null)));xe.setTag(G,m,w)}}function Ee(w,u){return function(m,v){const b=m.constructor;if(!w)throw new Error(`${b.name}: @type() reference provided for "${v}" is undefined. Make sure you don't have any circular dependencies.`);w=V(w),et.register(b);const G=Object.getPrototypeOf(b)[Symbol.metadata],Q=xe.initialize(b);let J=Q[v];if(Q[J]!==void 0){if(Q[J].deprecated)return;if(Q[J].type!==void 0)try{throw new Error(`@colyseus/schema: Duplicate '${v}' definition on '${b.name}'.
Check @type() annotation`)}catch(se){const le=se.stack.split(`
`)[4].trim();throw new Error(`${se.message} ${le}`)}}else J=Q[x]??(G&&G[x])??-1,J++;if(u&&u.manual)xe.addField(Q,J,v,w,{enumerable:!0,configurable:!0,writable:!0});else{const se=typeof Object.keys(w)[0]=="string"&&We(Object.keys(w)[0]),le=se?Object.values(w)[0]:w;xe.addField(Q,J,v,w,tt(`_${v}`,J,le,se))}}}function tt(w,u,m,v){return{get:function(){return this[w]},set:function(b){var G,Q;const D=this[w]??void 0;if(b!==D){if(b!=null){v?(v.constructor===In&&!(b instanceof In)&&(b=new In(...b)),v.constructor===$n&&!(b instanceof $n)&&(b=new $n(b)),b[f]=m):typeof m!="string"?mi(b,m,this,w.substring(1)):Aa(b,m,this,w.substring(1));const J=this[h];D!==void 0&&D[h]?((G=J.root)==null||G.remove(D[h]),this.constructor[r](J,u,t.OPERATION.DELETE_AND_ADD)):this.constructor[r](J,u,t.OPERATION.ADD),(Q=b[h])==null||Q.setParent(this,J.root,u)}else D!==void 0&&this[h].delete(u);this[w]=b}},enumerable:!0,configurable:!0}}function rt(w=!0){return function(u,m){var J;const v=u.constructor,D=Object.getPrototypeOf(v)[Symbol.metadata],G=v[J=Symbol.metadata]??(v[J]=Object.assign({},v[Symbol.metadata],D??Object.create(null))),Q=G[m];G[Q].deprecated=!0,w&&(G[y]??(G[y]={}),G[y][m]={get:function(){throw new Error(`${m} is deprecated.`)},set:function(se){},enumerable:!1,configurable:!0}),Object.defineProperty(G,Q,{value:G[Q],enumerable:!1,configurable:!0})}}function Ke(w,u,m){for(let v in u)Ee(u[v],m)(w.prototype,v);return w}function dt(w,u,m=De){const v={},b={},D={},G={};for(let le in w){const ae=w[le];typeof ae=="object"?(ae.view!==void 0&&(G[le]=typeof ae.view=="boolean"?ge:ae.view),v[le]=V(ae),Object.prototype.hasOwnProperty.call(ae,"default")?D[le]=ae.default:Array.isArray(ae)||ae.array!==void 0?D[le]=new In:ae.map!==void 0?D[le]=new $n:ae.collection!==void 0?D[le]=new j:ae.set!==void 0?D[le]=new K:ae.type!==void 0&&De.is(ae.type)&&(!ae.type.prototype.initialize||ae.type.prototype.initialize.length===0)&&(D[le]=new ae.type)):typeof ae=="function"?De.is(ae)?((!ae.prototype.initialize||ae.prototype.initialize.length===0)&&(D[le]=new ae),v[le]=V(ae)):b[le]=ae:v[le]=V(ae)}const Q=()=>{const le={};for(const ae in D){const he=D[ae];he&&typeof he.clone=="function"?le[ae]=he.clone():le[ae]=he}return le},J=le=>{const ae=Object.keys(v),he={};for(const Le in le)ae.includes(Le)||(he[Le]=le[Le]);return he},se=xe.setFields(class extends m{constructor(...le){b.initialize&&typeof b.initialize=="function"?(super(Object.assign({},Q(),J(le[0]||{}))),new.target===se&&b.initialize.apply(this,le)):super(Object.assign({},Q(),le[0]||{}))}},v);se._getDefaultValues=Q,Object.assign(se.prototype,b);for(let le in G)He(G[le])(se.prototype,le);return u&&Object.defineProperty(se,"name",{value:u}),se.extends=(le,ae)=>dt(le,ae,se),se}function bt(w){return new Array(w).fill(0).map((u,m)=>m===w-1?"└─ ":"   ").join("")}function Xt(w){const u=w[h].root,m={ops:{},refs:[]};let v=u.changes.next;for(;v;){const b=v.changeTree;if(b===void 0){v=v.next;continue}const D=b.indexedOperations;m.refs.push(`refId#${b.refId}`);for(const G in D){const Q=D[G],J=t.OPERATION[Q];m.ops[J]||(m.ops[J]=0),m.ops[t.OPERATION[Q]]++}v=v.next}return m}var kt,At;const Ns=class Ns{static initialize(u){var m;Object.defineProperty(u,h,{value:new st(u),enumerable:!1,writable:!0}),Object.defineProperties(u,((m=u.constructor[Symbol.metadata])==null?void 0:m[y])||{})}static is(u){return typeof u[Symbol.metadata]=="object"}static[(kt=a,At=o,r)](u,m,v=t.OPERATION.ADD){u.change(m,v)}static[c](u,m,v){var G,Q;const D=(G=u.constructor[Symbol.metadata][m])==null?void 0:G.tag;if(v===void 0)return D===void 0;if(D===void 0)return!0;if(D===ge)return v.isChangeTreeVisible(u[h]);{const J=(Q=v.tags)==null?void 0:Q.get(u[h]);return J&&J.has(D)}}constructor(u){Ns.initialize(this),u&&Object.assign(this,u)}assign(u){return Object.assign(this,u),this}setDirty(u,m){const v=this.constructor[Symbol.metadata];this[h].change(v[v[u]].index,m)}clone(){var v;const u=Object.create(this.constructor.prototype);Ns.initialize(u);const m=this.constructor[Symbol.metadata];for(const b in m){const D=m[b].name;typeof this[D]=="object"&&typeof((v=this[D])==null?void 0:v.clone)=="function"?u[D]=this[D].clone():u[D]=this[D]}return u}toJSON(){const u={},m=this.constructor[Symbol.metadata];for(const v in m){const b=m[v],D=b.name;!b.deprecated&&this[D]!==null&&typeof this[D]<"u"&&(u[D]=typeof this[D].toJSON=="function"?this[D].toJSON():this[D])}return u}discardAllChanges(){this[h].discardAll()}[l](u){const m=this.constructor[Symbol.metadata];return this[m[u].name]}[d](u){const m=this.constructor[Symbol.metadata];this[m[u].name]=void 0}static debugRefIds(u,m=!1,v=0,b,D=""){var he;const G=m?` - ${JSON.stringify(u.toJSON())}`:"",Q=u[h],J=b?b.root.refIds.get(u):Q.refId,se=b?b.root:Q.root,le=((he=se==null?void 0:se.refCount)==null?void 0:he[J])>1?` [×${se.refCount[J]}]`:"";let ae=`${bt(v)}${D}${u.constructor.name} (refId: ${J})${le}${G}
`;return Q.forEachChild((Le,Fe)=>{let Me=Fe;typeof Fe=="number"&&u.$indexes&&(Me=u.$indexes.get(Fe)??Fe);const ve=u.forEach!==void 0&&Me!==void 0?`["${Me}"]: `:"";ae+=this.debugRefIds(Le.ref,m,v+1,b,ve)}),ae}static debugRefIdEncodingOrder(u,m="allChanges"){let v=[],b=u[h].root[m].next;for(;b;)b.changeTree&&v.push(b.changeTree.refId),b=b.next;return v}static debugRefIdsFromDecoder(u){return this.debugRefIds(u.state,!1,0,u)}static debugChanges(u,m=!1){const v=u[h],b=m?v.allChanges:v.changes,D=m?"allChanges":"changes";let G=`${u.constructor.name} (${v.refId}) -> .${D}:
`;function Q(J){J.operations.filter(se=>se).forEach(se=>{const le=v.indexedOperations[se];G+=`- [${se}]: ${t.OPERATION[le]} (${JSON.stringify(v.getValue(Number(se),m))})
`})}return Q(b),!m&&v.filteredChanges&&v.filteredChanges.operations.filter(J=>J).length>0&&(G+=`${u.constructor.name} (${v.refId}) -> .filteredChanges:
`,Q(v.filteredChanges)),m&&v.allFilteredChanges&&v.allFilteredChanges.operations.filter(J=>J).length>0&&(G+=`${u.constructor.name} (${v.refId}) -> .allFilteredChanges:
`,Q(v.allFilteredChanges)),G}static debugChangesDeep(u,m="changes"){var le,ae;let v="";const b=u[h],D=b.root,G=new Map,Q=[];let J=0;for(const[he,Le]of Object.entries(D[m])){const Fe=D.changeTrees[he];if(!Fe)continue;let Me=!1,ve=[],Ve=(le=Fe.parent)==null?void 0:le[h];if(Fe===b)Me=!0;else for(;Ve!==void 0;){if(ve.push(Ve),Ve.ref===u){Me=!0;break}Ve=(ae=Ve.parent)==null?void 0:ae[h]}Me&&(Q.push(Fe.refId),J+=Object.keys(Le).length,G.set(Fe,ve.reverse()))}v+=`---
`,v+=`root refId: ${b.refId}
`,v+=`Total instances: ${Q.length} (refIds: ${Q.join(", ")})
`,v+=`Total changes: ${J}
`,v+=`---
`;const se=new WeakSet;for(const[he,Le]of G.entries()){Le.forEach((Rt,Ht)=>{se.has(Rt)||(v+=`${bt(Ht)}${Rt.ref.constructor.name} (refId: ${Rt.refId})
`,se.add(Rt))});const Fe=he.indexedOperations,Me=Le.length,ve=bt(Me),Ve=Me>0?`(${he.parentIndex}) `:"";v+=`${ve}${Ve}${he.ref.constructor.name} (refId: ${he.refId}) - changes: ${Object.keys(Fe).length}
`;for(const Rt in Fe){const Ht=Fe[Rt];v+=`${bt(Me+1)}${t.OPERATION[Ht]}: ${Rt}
`}}return`${v}`}};Ns[kt]=yt,Ns[At]=ks;let De=Ns;function Mt(w,u,m,v){var b=arguments.length,D=b<3?u:v,G;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")D=Reflect.decorate(w,u,m,v);else for(var Q=w.length-1;Q>=0;Q--)(G=w[Q])&&(D=(b<3?G(D):b>3?G(u,m,D):G(u,m))||D);return b>3&&D&&Object.defineProperty(u,m,D),D}typeof SuppressedError=="function"&&SuppressedError;class xt{constructor(u){this.types=u,this.nextUniqueId=0,this.refCount={},this.changeTrees={},this.allChanges=_e(),this.allFilteredChanges=_e(),this.changes=_e(),this.filteredChanges=_e()}getNextUniqueId(){return this.nextUniqueId++}add(u){u.refId===void 0&&(u.refId=this.getNextUniqueId());const m=this.changeTrees[u.refId]===void 0;m&&(this.changeTrees[u.refId]=u);const v=this.refCount[u.refId];if(v===0){const b=u.allChanges.operations;let D=b.length;for(;D--;)u.indexedOperations[b[D]]=t.OPERATION.ADD,oe(u.changes,D)}return this.refCount[u.refId]=(v||0)+1,m}remove(u){const m=this.refCount[u.refId]-1;return m<=0?(u.root=void 0,delete this.changeTrees[u.refId],this.removeChangeFromChangeSet("allChanges",u),this.removeChangeFromChangeSet("changes",u),u.filteredChanges&&(this.removeChangeFromChangeSet("allFilteredChanges",u),this.removeChangeFromChangeSet("filteredChanges",u)),this.refCount[u.refId]=0,u.forEachChild((v,b)=>{v.removeParent(u.ref)&&(v.parentChain===void 0||v.parentChain&&this.refCount[v.refId]>0?this.remove(v):v.parentChain&&this.moveNextToParent(v))})):(this.refCount[u.refId]=m,this.recursivelyMoveNextToParent(u)),m}recursivelyMoveNextToParent(u){this.moveNextToParent(u),u.forEachChild((m,v)=>this.recursivelyMoveNextToParent(m))}moveNextToParent(u){u.filteredChanges?(this.moveNextToParentInChangeTreeList("filteredChanges",u),this.moveNextToParentInChangeTreeList("allFilteredChanges",u)):(this.moveNextToParentInChangeTreeList("changes",u),this.moveNextToParentInChangeTreeList("allChanges",u))}moveNextToParentInChangeTreeList(u,m){var se;const v=this[u],b=m[u].queueRootNode;if(!b)return;const D=m.parent;if(!D||!D[h])return;const G=(se=D[h][u])==null?void 0:se.queueRootNode;if(!G||G===b)return;const Q=G.position;b.position>Q||(b.prev?b.prev.next=b.next:v.next=b.next,b.next?b.next.prev=b.prev:v.tail=b.prev,b.prev=G,b.next=G.next,G.next?G.next.prev=b:v.tail=b,G.next=b,this.updatePositionsAfterMove(v,b,Q+1))}enqueueChangeTree(u,m,v=u[m].queueRootNode){v||(u[m].queueRootNode=this.addToChangeTreeList(this[m],u))}addToChangeTreeList(u,m){const v={changeTree:m,next:void 0,prev:void 0,position:u.tail?u.tail.position+1:0};return u.next?(v.prev=u.tail,u.tail.next=v,u.tail=v):(u.next=v,u.tail=v),v}updatePositionsAfterRemoval(u,m){let v=u.next,b=0;for(;v;)b>=m&&(v.position=b),v=v.next,b++}updatePositionsAfterMove(u,m,v){let b=u.next,D=0;for(;b;)b.position=D,b=b.next,D++}removeChangeFromChangeSet(u,m){const v=this[u],b=m[u].queueRootNode;if(b&&b.changeTree===m){const D=b.position;return b.prev?b.prev.next=b.next:v.next=b.next,b.next?b.next.prev=b.prev:v.tail=b.prev,this.updatePositionsAfterRemoval(v,D),m[u].queueRootNode=void 0,!0}return!1}}const Ia=class Ia{constructor(u){this.sharedBuffer=Buffer.allocUnsafe(Ia.BUFFER_SIZE),this.context=et.cache(u.constructor),this.root=new xt(this.context),this.setState(u)}setState(u){this.state=u,this.state[h].setRoot(this.root)}encode(u={offset:0},m,v=this.sharedBuffer,b="changes",D=b==="allChanges",G=u.offset){const Q=m!==void 0,J=this.state[h];let se=this.root[b];for(;se=se.next;){const le=se.changeTree;if(Q){if(!m.isChangeTreeVisible(le)){m.invisible.add(le);continue}m.invisible.delete(le)}const ae=le[b],he=le.ref,Le=ae.operations.length;if(Le===0)continue;const Fe=he.constructor,Me=Fe[a],ve=Fe[c],Ve=Fe[Symbol.metadata];(Q||u.offset>G||le!==J)&&(v[u.offset++]=255,Ae.number(v,le.refId,u));for(let Rt=0;Rt<Le;Rt++){const Ht=ae.operations[Rt];if(Ht<0){v[u.offset++]=Math.abs(Ht)&255;continue}const vn=D?t.OPERATION.ADD:le.indexedOperations[Ht];Ht===void 0||vn===void 0||ve&&!ve(he,Ht,m)||Me(this,v,le,Ht,vn,u,D,Q,Ve)}}if(u.offset>v.byteLength){const le=Math.ceil(u.offset/(Buffer.poolSize??8192))*(Buffer.poolSize??8192);return console.warn(`@colyseus/schema buffer overflow. Encoded state is higher than default BUFFER_SIZE. Use the following to increase default BUFFER_SIZE:

    import { Encoder } from "@colyseus/schema";
    Encoder.BUFFER_SIZE = ${Math.round(le/1024)} * 1024; // ${Math.round(le/1024)} KB
`),v=Buffer.alloc(le,v),v===this.sharedBuffer&&(this.sharedBuffer=v),this.encode({offset:G},m,v,b,D)}else return v.subarray(0,u.offset)}encodeAll(u={offset:0},m=this.sharedBuffer){return this.encode(u,void 0,m,"allChanges",!0)}encodeAllView(u,m,v,b=this.sharedBuffer){const D=v.offset;return this.encode(v,u,b,"allFilteredChanges",!0,D),Buffer.concat([b.subarray(0,m),b.subarray(D,v.offset)])}encodeView(u,m,v,b=this.sharedBuffer){const D=v.offset;for(const[G,Q]of u.changes){const J=this.root.changeTrees[G];if(J===void 0){u.changes.delete(G);continue}const se=Object.keys(Q);if(se.length===0)continue;const ae=J.ref.constructor,he=ae[a],Le=ae[Symbol.metadata];b[v.offset++]=255,Ae.number(b,J.refId,v);for(let Fe=0,Me=se.length;Fe<Me;Fe++){const ve=Number(se[Fe]),Rt=J.ref[l](ve)!==void 0&&Q[ve]||t.OPERATION.DELETE;he(this,b,J,ve,Rt,v,!1,!0,Le)}}return u.changes.clear(),this.encode(v,u,b,"filteredChanges",!1,D),Buffer.concat([b.subarray(0,m),b.subarray(D,v.offset)])}discardChanges(){let u=this.root.changes.next;for(;u;)u.changeTree.endEncode("changes"),u=u.next;for(this.root.changes=_e(),u=this.root.filteredChanges.next;u;)u.changeTree.endEncode("filteredChanges"),u=u.next;this.root.filteredChanges=_e()}tryEncodeTypeId(u,m,v,b){const D=this.context.getTypeId(m),G=this.context.getTypeId(v);if(G===void 0){console.warn(`@colyseus/schema WARNING: Class "${v.name}" is not registered on TypeRegistry - Please either tag the class with @entity or define a @type() field.`);return}D!==G&&(u[b.offset++]=213,Ae.number(u,G,b))}get hasChanges(){return this.root.changes.next!==void 0||this.root.filteredChanges.next!==void 0}};Ia.BUFFER_SIZE=typeof Buffer<"u"&&Buffer.poolSize||8*1024;let an=Ia;function gi(w,u){if(u===-1||u>=w.length)return!1;const m=w.length-1;for(let v=u;v<m;v++)w[v]=w[v+1];return w.length=m,!0}class dn extends Error{constructor(u){super(u),this.name="DecodingWarning"}}class ss{constructor(){this.refs=new Map,this.refIds=new WeakMap,this.refCount={},this.deletedRefs=new Set,this.callbacks={},this.nextUniqueId=0}getNextUniqueId(){return this.nextUniqueId++}addRef(u,m,v=!0){this.refs.set(u,m),this.refIds.set(m,u),v&&(this.refCount[u]=(this.refCount[u]||0)+1),this.deletedRefs.has(u)&&this.deletedRefs.delete(u)}removeRef(u){const m=this.refCount[u];if(m===void 0){try{throw new dn("trying to remove refId that doesn't exist: "+u)}catch(v){console.warn(v)}return}if(m===0){try{const v=this.refs.get(u);throw new dn(`trying to remove refId '${u}' with 0 refCount (${v.constructor.name}: ${JSON.stringify(v)})`)}catch(v){console.warn(v)}return}(this.refCount[u]=m-1)<=0&&this.deletedRefs.add(u)}clearRefs(){this.refs.clear(),this.deletedRefs.clear(),this.callbacks={},this.refCount={}}garbageCollectDeletedRefs(){this.deletedRefs.forEach(u=>{if(this.refCount[u]>0)return;const m=this.refs.get(u);if(m.constructor[Symbol.metadata]!==void 0){const v=m.constructor[Symbol.metadata];for(const b in v){const D=v[b].name,G=typeof m[D]=="object"&&this.refIds.get(m[D]);G&&!this.deletedRefs.has(G)&&this.removeRef(G)}}else typeof m[f]=="function"&&Array.from(m.values()).forEach(v=>{const b=this.refIds.get(v);this.deletedRefs.has(b)||this.removeRef(b)});this.refs.delete(u),delete this.refCount[u],delete this.callbacks[u]}),this.deletedRefs.clear()}addCallback(u,m,v){if(u===void 0){const b=typeof m=="number"?t.OPERATION[m]:m;throw new Error(`Can't addCallback on '${b}' (refId is undefined)`)}return this.callbacks[u]||(this.callbacks[u]={}),this.callbacks[u][m]||(this.callbacks[u][m]=[]),this.callbacks[u][m].push(v),()=>this.removeCallback(u,m,v)}removeCallback(u,m,v){var D,G,Q;const b=(Q=(G=(D=this.callbacks)==null?void 0:D[u])==null?void 0:G[m])==null?void 0:Q.indexOf(v);b!==void 0&&b!==-1&&gi(this.callbacks[u][m],b)}}class Nt{constructor(u,m){this.currentRefId=0,this.setState(u),this.context=m||new et(u.constructor)}setState(u){this.state=u,this.root=new ss,this.root.addRef(0,u)}decode(u,m={offset:0},v=this.state){var J,se,le;const b=[],D=this.root,G=u.byteLength;let Q=v.constructor[o];for(this.currentRefId=0;m.offset<G;){if(u[m.offset]==255){m.offset++,(J=v[_])==null||J.call(v);const he=Ue.number(u,m),Le=D.refs.get(he);Le?(v=Le,Q=v.constructor[o],this.currentRefId=he):(console.error(`"refId" not found: ${he}`,{previousRef:v,previousRefId:this.currentRefId}),console.warn("Please report this issue to the developers."),this.skipCurrentStructure(u,m,G));continue}if(Q(this,u,m,v,b)===Cr){console.warn("@colyseus/schema: definition mismatch"),this.skipCurrentStructure(u,m,G);continue}}return(se=v[_])==null||se.call(v),(le=this.triggerChanges)==null||le.call(this,b),D.garbageCollectDeletedRefs(),b}skipCurrentStructure(u,m,v){const b={offset:m.offset};for(;m.offset<v&&!(u[m.offset]===255&&(b.offset=m.offset+1,this.root.refs.has(Ue.number(u,b))));)m.offset++}getInstanceType(u,m,v){let b;if(u[m.offset]===213){m.offset++;const D=Ue.number(u,m);b=this.context.get(D)}return b||v}createInstanceOfType(u){return new u}removeChildRefs(u,m){const v=typeof u[f]!="string",b=this.root.refIds.get(u);u.forEach((D,G)=>{m.push({ref:u,refId:b,op:t.OPERATION.DELETE,field:G,value:void 0,previousValue:D}),v&&this.root.removeRef(this.root.refIds.get(D))})}}class Qt extends De{}Mt([Ee("string")],Qt.prototype,"name",void 0),Mt([Ee("string")],Qt.prototype,"type",void 0),Mt([Ee("number")],Qt.prototype,"referencedType",void 0);class en extends De{constructor(){super(...arguments),this.fields=new In}}Mt([Ee("number")],en.prototype,"id",void 0),Mt([Ee("number")],en.prototype,"extendsId",void 0),Mt([Ee([Qt])],en.prototype,"fields",void 0);class jt extends De{constructor(){super(...arguments),this.types=new In}static encode(u,m={offset:0}){const v=u.context,b=new jt,D=new an(b),G=v.schemas.get(u.state.constructor);G>0&&(b.rootType=G);const Q=new Set,J={},se=ae=>{if(ae.extendsId===void 0||Q.has(ae.extendsId)){Q.add(ae.id),b.types.push(ae);const he=J[ae.id];he!==void 0&&(delete J[ae.id],he.forEach(Le=>se(Le)))}else J[ae.extendsId]===void 0&&(J[ae.extendsId]=[]),J[ae.extendsId].push(ae)};v.schemas.forEach((ae,he)=>{const Le=new en;Le.id=Number(ae);const Fe=Object.getPrototypeOf(he);Fe!==De&&(Le.extendsId=v.schemas.get(Fe));const Me=he[Symbol.metadata];if(Me!==Fe[Symbol.metadata])for(const ve in Me){const Ve=Number(ve),Rt=Me[Ve].name;if(!Object.prototype.hasOwnProperty.call(Me,Rt))continue;const Ht=new Qt;Ht.name=Rt;let vn;const ni=Me[Ve];if(typeof ni.type=="string")vn=ni.type;else{let Lr;De.is(ni.type)?(vn="ref",Lr=ni.type):(vn=Object.keys(ni.type)[0],typeof ni.type[vn]=="string"?vn+=":"+ni.type[vn]:Lr=ni.type[vn]),Ht.referencedType=Lr?v.getTypeId(Lr):-1}Ht.type=vn,Le.fields.push(Ht)}se(Le)});for(const ae in J)J[ae].forEach(he=>b.types.push(he));return D.encodeAll(m).slice(0,m.offset)}static decode(u,m){const v=new jt;new Nt(v).decode(u,m);const D=new et;v.types.forEach(J=>{const se=D.get(J.extendsId)??De,le=class extends se{};et.register(le),D.add(le,J.id)},{});const G=(J,se,le)=>{se.fields.forEach((ae,he)=>{const Le=le+he;if(ae.referencedType!==void 0){let Fe=ae.type,Me=D.get(ae.referencedType);if(!Me){const ve=ae.type.split(":");Fe=ve[0],Me=ve[1]}Fe==="ref"?xe.addField(J,Le,ae.name,Me):xe.addField(J,Le,ae.name,{[Fe]:Me})}else xe.addField(J,Le,ae.name,ae.type)})};v.types.forEach(J=>{const se=D.get(J.id),le=xe.initialize(se),ae=[];let he=J;do ae.push(he),he=v.types.find(Fe=>Fe.id===he.extendsId);while(he);let Le=0;ae.reverse().forEach(Fe=>{G(le,Fe,Le),Le+=Fe.fields.length})});const Q=new(D.get(v.rootType||0));return new Nt(Q,D)}}Mt([Ee([en])],jt.prototype,"types",void 0),Mt([Ee("number")],jt.prototype,"rootType",void 0);function fn(w){const u=w.root,m=u.callbacks,v=new WeakMap;let b;w.triggerChanges=function(Q){var se;const J=new Set;for(let le=0,ae=Q.length;le<ae;le++){const he=Q[le],Le=he.refId,Fe=he.ref,Me=m[Le];if(Me){if((he.op&t.OPERATION.DELETE)===t.OPERATION.DELETE&&he.previousValue instanceof De){const ve=(se=m[u.refIds.get(he.previousValue)])==null?void 0:se[t.OPERATION.DELETE];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve]()}if(Fe instanceof De){if(!J.has(Le)){const ve=Me==null?void 0:Me[t.OPERATION.REPLACE];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve]()}if(Me.hasOwnProperty(he.field)){const ve=Me[he.field];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve](he.value,he.previousValue)}}else{if((he.op&t.OPERATION.DELETE)===t.OPERATION.DELETE){if(he.previousValue!==void 0){const ve=Me[t.OPERATION.DELETE];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve](he.previousValue,he.dynamicIndex??he.field)}if((he.op&t.OPERATION.ADD)===t.OPERATION.ADD){const ve=Me[t.OPERATION.ADD];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve](he.value,he.dynamicIndex??he.field)}}else if((he.op&t.OPERATION.ADD)===t.OPERATION.ADD&&he.previousValue!==he.value){const ve=Me[t.OPERATION.ADD];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve](he.value,he.dynamicIndex??he.field)}if(he.value!==he.previousValue&&(he.value!==void 0||he.previousValue!==void 0)){const ve=Me[t.OPERATION.REPLACE];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve](he.value,he.dynamicIndex??he.field)}}J.add(Le)}}};function D(Q,J){var ae;let se=((ae=J.instance)==null?void 0:ae.constructor[Symbol.metadata])||Q,le=J.instance&&typeof J.instance.forEach=="function"||Q&&typeof Q[Symbol.metadata]>"u";if(se&&!le){const he=function(Le,Fe,Me,ve){return ve&&J.instance[Fe]!==void 0&&!v.has(b)&&Me(J.instance[Fe],void 0),u.addCallback(u.refIds.get(Le),Fe,Me)};return new Proxy({listen:function(Fe,Me,ve=!0){if(J.instance)return he(J.instance,Fe,Me,ve);{let Ve=()=>{};return J.onInstanceAvailable((Rt,Ht)=>{Ve=he(Rt,Fe,Me,ve&&Ht&&!v.has(b))}),()=>Ve()}},onChange:function(Fe){return u.addCallback(u.refIds.get(J.instance),t.OPERATION.REPLACE,Fe)},bindTo:function(Fe,Me){return Me||(Me=Object.keys(se).map(ve=>se[ve].name)),u.addCallback(u.refIds.get(J.instance),t.OPERATION.REPLACE,()=>{Me.forEach(ve=>Fe[ve]=J.instance[ve])})}},{get(Le,Fe){var ve;const Me=se[se[Fe]];if(Me){const Ve=(ve=J.instance)==null?void 0:ve[Fe],Rt=(Ht=>{const vn=G(J.instance).listen(Fe,(ni,Lr)=>{Ht(ni,!1),vn==null||vn()},!1);u.refIds.get(Ve)!==void 0&&Ht(Ve,!0)});return D(Me.type,{instance:u.refIds.get(Ve)&&Ve,parentInstance:J.instance,onInstanceAvailable:Rt})}else return Le[Fe]},has(Le,Fe){return se[Fe]!==void 0},set(Le,Fe,Me){throw new Error("not allowed")},deleteProperty(Le,Fe){throw new Error("not allowed")}})}else{const he=function(Me,ve,Ve){return Ve&&Me.forEach((Rt,Ht)=>ve(Rt,Ht)),u.addCallback(u.refIds.get(Me),t.OPERATION.ADD,(Rt,Ht)=>{v.set(ve,!0),b=ve,ve(Rt,Ht),v.delete(ve),b=void 0})},Le=function(Me,ve){return u.addCallback(u.refIds.get(Me),t.OPERATION.DELETE,ve)},Fe=function(Me,ve){return u.addCallback(u.refIds.get(Me),t.OPERATION.REPLACE,ve)};return new Proxy({onAdd:function(Me,ve=!0){if(J.instance)return he(J.instance,Me,ve&&!v.has(b));if(J.onInstanceAvailable){let Ve=()=>{};return J.onInstanceAvailable((Rt,Ht)=>{Ve=he(Rt,Me,ve&&Ht&&!v.has(b))}),()=>Ve()}},onRemove:function(Me){if(J.instance)return Le(J.instance,Me);if(J.onInstanceAvailable){let ve=()=>{};return J.onInstanceAvailable(Ve=>{ve=Le(Ve,Me)}),()=>ve()}},onChange:function(Me){if(J.instance)return Fe(J.instance,Me);if(J.onInstanceAvailable){let ve=()=>{};return J.onInstanceAvailable(Ve=>{ve=Fe(Ve,Me)}),()=>ve()}}},{get(Me,ve){if(!Me[ve])throw new Error(`Can't access '${ve}' through callback proxy. access the instance directly.`);return Me[ve]},has(Me,ve){return Me[ve]!==void 0},set(Me,ve,Ve){throw new Error("not allowed")},deleteProperty(Me,ve){throw new Error("not allowed")}})}}function G(Q){return D(void 0,{instance:Q})}return G}function Dr(w,u){w.triggerChanges=u}class vi{constructor(u=!1){this.iterable=u,this.visible=new WeakSet,this.invisible=new WeakSet,this.changes=new Map,u&&(this.items=[])}add(u,m=ge,v=!0){var se,le;const b=u==null?void 0:u[h],D=b.parent;if(b){if(!D&&b.refId!==0)throw new Error(`Cannot add a detached instance to the StateView. Make sure to assign the "${b.ref.constructor.name}" instance to the state before calling view.add()`)}else return console.warn("StateView#add(), invalid object:",u),!1;const G=u.constructor[Symbol.metadata];this.visible.add(b),this.iterable&&v&&this.items.push(u),v&&D&&this.addParentOf(b,m);let Q=this.changes.get(b.refId);Q===void 0&&(Q={},this.changes.set(b.refId,Q));let J=!1;if(b.forEachChild((ae,he)=>{G&&G[he].tag!==void 0&&G[he].tag!==m||this.add(ae.ref,m,!1)&&(J=!0)}),m!==ge){this.tags||(this.tags=new WeakMap);let ae;this.tags.has(b)?ae=this.tags.get(b):(ae=new Set,this.tags.set(b,ae)),ae.add(m),(le=(se=G==null?void 0:G[A])==null?void 0:se[m])==null||le.forEach(he=>{b.getChange(he)!==t.OPERATION.DELETE&&(Q[he]=t.OPERATION.ADD)})}else if(!b.isNew||J){const ae=b.filteredChanges!==void 0?b.allFilteredChanges:b.allChanges,he=this.invisible.has(b);for(let Le=0,Fe=ae.operations.length;Le<Fe;Le++){const Me=ae.operations[Le];if(Me===void 0)continue;const ve=b.indexedOperations[Me]??t.OPERATION.ADD,Ve=G==null?void 0:G[Me].tag;ve!==t.OPERATION.DELETE&&(he||Ve===void 0||Ve===m)&&(Q[Me]=ve,J=!0)}}return J}addParentOf(u,m){var D;const v=u.parent[h],b=u.parentIndex;if(!this.visible.has(v)){this.visible.add(v);const G=(D=v.parent)==null?void 0:D[h];G&&G.filteredChanges!==void 0&&this.addParentOf(v,m)}if(v.getChange(b)!==t.OPERATION.DELETE){let G=this.changes.get(v.refId);G===void 0&&(G={},this.changes.set(v.refId,G)),this.tags||(this.tags=new WeakMap);let Q;this.tags.has(v)?Q=this.tags.get(v):(Q=new Set,this.tags.set(v,Q)),Q.add(m),G[b]=t.OPERATION.ADD}}remove(u,m=ge,v=!1){var J;const b=u[h];if(!b)return console.warn("StateView#remove(), invalid object:",u),this;this.visible.delete(b),this.iterable&&!v&&gi(this.items,this.items.indexOf(u));const G=b.ref.constructor[Symbol.metadata];let Q=this.changes.get(b.refId);if(Q===void 0&&(Q={},this.changes.set(b.refId,Q)),m===ge){const se=b.parent;if(se&&!xe.isValidInstance(se)&&b.isFiltered){const le=se[h];let ae=this.changes.get(le.refId);ae===void 0?(ae={},this.changes.set(le.refId,ae)):ae[b.parentIndex]===t.OPERATION.ADD&&this.changes.delete(b.refId),ae[b.parentIndex]=t.OPERATION.DELETE,this._recursiveDeleteVisibleChangeTree(b)}else(J=G==null?void 0:G[T])==null||J.forEach(le=>Q[le]=t.OPERATION.DELETE)}else G==null||G[A][m].forEach(se=>Q[se]=t.OPERATION.DELETE);if(this.tags&&this.tags.has(b)){const se=this.tags.get(b);m===void 0?this.tags.delete(b):(se.delete(m),se.size===0&&this.tags.delete(b))}return this}has(u){return this.visible.has(u[h])}hasTag(u,m=ge){var b;const v=(b=this.tags)==null?void 0:b.get(u[h]);return(v==null?void 0:v.has(m))??!1}clear(){if(!this.iterable)throw new Error("StateView#clear() is only available for iterable StateView's. Use StateView(iterable: true) constructor.");for(let u=0,m=this.items.length;u<m;u++)this.remove(this.items[u],ge,!0);this.items.length=0}isChangeTreeVisible(u){let m=this.visible.has(u);return!m&&u.isVisibilitySharedWithParent&&this.visible.has(u.parent[h])&&(this.visible.add(u),m=!0),m}_recursiveDeleteVisibleChangeTree(u){u.forEachChild(m=>{this.visible.delete(m),this._recursiveDeleteVisibleChangeTree(m)})}}qe("map",{constructor:$n}),qe("array",{constructor:In}),qe("set",{constructor:K}),qe("collection",{constructor:j}),t.$changes=h,t.$childType=f,t.$decoder=o,t.$deleteByIndex=d,t.$encoder=a,t.$filter=c,t.$getByIndex=l,t.$track=r,t.ArraySchema=In,t.ChangeTree=st,t.CollectionSchema=j,t.Decoder=Nt,t.Encoder=an,t.MapSchema=$n,t.Metadata=xe,t.Reflection=jt,t.ReflectionField=Qt,t.ReflectionType=en,t.Schema=De,t.SetSchema=K,t.StateView=vi,t.TypeContext=et,t.decode=Ue,t.decodeKeyValueOperation=ns,t.decodeSchemaOperation=ks,t.defineCustomTypes=Re,t.defineTypes=Ke,t.deprecated=rt,t.dumpChanges=Xt,t.encode=Ae,t.encodeArray=Pn,t.encodeKeyValueOperation=En,t.encodeSchemaOperation=yt,t.entity=Ie,t.getDecoderStateCallbacks=fn,t.getRawChangesCallback=Dr,t.registerType=qe,t.schema=dt,t.type=Ee,t.view=He}))})(Yr,Yr.exports)),Yr.exports}var Tu;function Ng(){if(Tu)return dl;Tu=1;var i=Xo,e=Mh();class t{constructor(s){this.events=s,this.isOpen=!1,this.lengthPrefixBuffer=new Uint8Array(9)}connect(s,r={}){const a=r.fingerprint&&{serverCertificateHashes:[{algorithm:"sha-256",value:new Uint8Array(r.fingerprint).buffer}]}||void 0;this.wt=new WebTransport(s,a),this.wt.ready.then(o=>{console.log("WebTransport ready!",o),this.isOpen=!0,this.unreliableReader=this.wt.datagrams.readable.getReader(),this.unreliableWriter=this.wt.datagrams.writable.getWriter(),this.wt.incomingBidirectionalStreams.getReader().read().then(l=>{this.reader=l.value.readable.getReader(),this.writer=l.value.writable.getWriter(),this.sendSeatReservation(r.room.roomId,r.sessionId,r.reconnectionToken),this.readIncomingData(),this.readIncomingUnreliableData()}).catch(l=>{console.error("failed to read incoming stream",l),console.error("TODO: close the connection")})}).catch(o=>{console.log("WebTransport not ready!",o),this._close()}),this.wt.closed.then(o=>{console.log("WebTransport closed w/ success",o),this.events.onclose({code:o.closeCode,reason:o.reason})}).catch(o=>{console.log("WebTransport closed w/ error",o),this.events.onerror(o),this.events.onclose({code:o.closeCode,reason:o.reason})}).finally(()=>{this._close()})}send(s){const r=e.encode.number(this.lengthPrefixBuffer,s.length,{offset:0}),a=new Uint8Array(r+s.length);a.set(this.lengthPrefixBuffer.subarray(0,r),0),a.set(s,r),this.writer.write(a)}sendUnreliable(s){const r=e.encode.number(this.lengthPrefixBuffer,s.length,{offset:0}),a=new Uint8Array(r+s.length);a.set(this.lengthPrefixBuffer.subarray(0,r),0),a.set(s,r),this.unreliableWriter.write(a)}close(s,r){try{this.wt.close({closeCode:s,reason:r})}catch(a){console.error(a)}}readIncomingData(){return i.__awaiter(this,void 0,void 0,function*(){let s;for(;this.isOpen;){try{s=yield this.reader.read();const r=s.value,a={offset:0};do{const o=e.decode.number(r,a);this.events.onmessage({data:r.subarray(a.offset,a.offset+o)}),a.offset+=o}while(a.offset<r.length)}catch(r){r.message.indexOf("session is closed")===-1&&console.error("H3Transport: failed to read incoming data",r);break}if(s.done)break}})}readIncomingUnreliableData(){return i.__awaiter(this,void 0,void 0,function*(){let s;for(;this.isOpen;){try{s=yield this.unreliableReader.read();const r=s.value,a={offset:0};do{const o=e.decode.number(r,a);this.events.onmessage({data:r.subarray(a.offset,a.offset+o)}),a.offset+=o}while(a.offset<r.length)}catch(r){r.message.indexOf("session is closed")===-1&&console.error("H3Transport: failed to read incoming data",r);break}if(s.done)break}})}sendSeatReservation(s,r,a){const o={offset:0},c=[];e.encode.string(c,s,o),e.encode.string(c,r,o),a&&e.encode.string(c,a,o),this.writer.write(new Uint8Array(c).buffer)}_close(){this.isOpen=!1}}return dl.H3TransportTransport=t,dl}var fl={},pl,Au;function Fg(){return Au||(Au=1,pl=function(){throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object")}),pl}var Ru;function Bg(){if(Ru)return fl;Ru=1;var i=Fg();const e=globalThis.WebSocket||i;let t=class{constructor(s){this.events=s}send(s){this.ws.send(s)}sendUnreliable(s){console.warn("colyseus.js: The WebSocket transport does not support unreliable messages")}connect(s,r){try{this.ws=new e(s,{headers:r,protocols:this.protocols})}catch{this.ws=new e(s,this.protocols)}this.ws.binaryType="arraybuffer",this.ws.onopen=this.events.onopen,this.ws.onmessage=this.events.onmessage,this.ws.onclose=this.events.onclose,this.ws.onerror=this.events.onerror}close(s,r){this.ws.close(s,r)}get isOpen(){return this.ws.readyState===e.OPEN}};return fl.WebSocketTransport=t,fl}var Cu;function zg(){if(Cu)return ul;Cu=1;var i=Ng(),e=Bg();let t=class{constructor(s){switch(this.events={},s){case"h3":this.transport=new i.H3TransportTransport(this.events);break;default:this.transport=new e.WebSocketTransport(this.events);break}}connect(s,r){this.transport.connect.call(this.transport,s,r)}send(s){this.transport.send(s)}sendUnreliable(s){this.transport.sendUnreliable(s)}close(s,r){this.transport.close(s,r)}get isOpen(){return this.transport.isOpen}};return ul.Connection=t,ul}var ml={},Pu;function hp(){return Pu||(Pu=1,(function(i){i.Protocol=void 0,(function(e){e[e.HANDSHAKE=9]="HANDSHAKE",e[e.JOIN_ROOM=10]="JOIN_ROOM",e[e.ERROR=11]="ERROR",e[e.LEAVE_ROOM=12]="LEAVE_ROOM",e[e.ROOM_DATA=13]="ROOM_DATA",e[e.ROOM_STATE=14]="ROOM_STATE",e[e.ROOM_STATE_PATCH=15]="ROOM_STATE_PATCH",e[e.ROOM_DATA_SCHEMA=16]="ROOM_DATA_SCHEMA",e[e.ROOM_DATA_BYTES=17]="ROOM_DATA_BYTES"})(i.Protocol||(i.Protocol={})),i.ErrorCode=void 0,(function(e){e[e.MATCHMAKE_NO_HANDLER=4210]="MATCHMAKE_NO_HANDLER",e[e.MATCHMAKE_INVALID_CRITERIA=4211]="MATCHMAKE_INVALID_CRITERIA",e[e.MATCHMAKE_INVALID_ROOM_ID=4212]="MATCHMAKE_INVALID_ROOM_ID",e[e.MATCHMAKE_UNHANDLED=4213]="MATCHMAKE_UNHANDLED",e[e.MATCHMAKE_EXPIRED=4214]="MATCHMAKE_EXPIRED",e[e.AUTH_FAILED=4215]="AUTH_FAILED",e[e.APPLICATION_ERROR=4216]="APPLICATION_ERROR"})(i.ErrorCode||(i.ErrorCode={}))})(ml)),ml}var Oa={},Iu;function up(){if(Iu)return Oa;Iu=1;const i={};function e(n,s){i[n]=s}function t(n){const s=i[n];if(!s)throw new Error("missing serializer: "+n);return s}return Oa.getSerializer=t,Oa.registerSerializer=e,Oa}var gl={},Du;function dp(){if(Du)return gl;Du=1;const i=()=>({emit(e,...t){let n=this.events[e]||[];for(let s=0,r=n.length;s<r;s++)n[s](...t)},events:{},on(e,t){var n;return!((n=this.events[e])===null||n===void 0)&&n.push(t)||(this.events[e]=[t]),()=>{var s;this.events[e]=(s=this.events[e])===null||s===void 0?void 0:s.filter(r=>t!==r)}}});return gl.createNanoEvents=i,gl}var Ua={},Lu;function Hg(){if(Lu)return Ua;Lu=1;class i{constructor(){this.handlers=[]}register(n,s=!1){return this.handlers.push(n),this}invoke(...n){this.handlers.forEach(s=>s.apply(this,n))}invokeAsync(...n){return Promise.all(this.handlers.map(s=>s.apply(this,n)))}remove(n){const s=this.handlers.indexOf(n);this.handlers[s]=this.handlers[this.handlers.length-1],this.handlers.pop()}clear(){this.handlers=[]}}function e(){const t=new i;function n(s){return t.register(s,this===null)}return n.once=s=>{const r=function(...a){s.apply(this,a),t.remove(r)};t.register(r)},n.remove=s=>t.remove(s),n.invoke=(...s)=>t.invoke(...s),n.invokeAsync=(...s)=>t.invokeAsync(...s),n.clear=()=>t.clear(),n}return Ua.EventEmitter=i,Ua.createSignal=e,Ua}var Na={},ku;function fp(){if(ku)return Na;ku=1;var i=Mh();function e(n){try{return i.getDecoderStateCallbacks(n.serializer.decoder)}catch{return}}let t=class{setState(s,r){this.decoder.decode(s,r)}getState(){return this.state}patch(s,r){return this.decoder.decode(s,r)}teardown(){this.decoder.root.clearRefs()}handshake(s,r){this.state?(i.Reflection.decode(s,r),this.decoder=new i.Decoder(this.state)):(this.decoder=i.Reflection.decode(s,r),this.state=this.decoder.state)}};return Na.SchemaSerializer=t,Na.getStateCallbacks=e,Na}var pc;try{pc=new TextDecoder}catch{}var Pe,di,q=0,Vt={},_t,ji,Fn=0,ci=0,hn,Pi,gn=[],vt,Ou={useRecords:!1,mapsAsObjects:!0};class pp{}const Eh=new pp;Eh.name="MessagePack 0xC1";var Zi=!1,mp=2,Vg;try{new Function("")}catch{mp=1/0}class es{constructor(e){e&&(e.useRecords===!1&&e.mapsAsObjects===void 0&&(e.mapsAsObjects=!0),e.sequential&&e.trusted!==!1&&(e.trusted=!0,!e.structures&&e.useRecords!=!1&&(e.structures=[],e.maxSharedStructures||(e.maxSharedStructures=0))),e.structures?e.structures.sharedLength=e.structures.length:e.getStructures&&((e.structures=[]).uninitialized=!0,e.structures.sharedLength=0),e.int64AsNumber&&(e.int64AsType="number")),Object.assign(this,e)}unpack(e,t){if(Pe)return bp(()=>(Lo(),this?this.unpack(e,t):es.prototype.unpack.call(Ou,e,t)));!e.buffer&&e.constructor===ArrayBuffer&&(e=typeof Buffer<"u"?Buffer.from(e):new Uint8Array(e)),typeof t=="object"?(di=t.end||e.length,q=t.start||0):(q=0,di=t>-1?t:e.length),ci=0,ji=null,hn=null,Pe=e;try{vt=e.dataView||(e.dataView=new DataView(e.buffer,e.byteOffset,e.byteLength))}catch(n){throw Pe=null,e instanceof Uint8Array?n:new Error("Source must be a Uint8Array or Buffer but was a "+(e&&typeof e=="object"?e.constructor.name:typeof e))}if(this instanceof es){if(Vt=this,this.structures)return _t=this.structures,Fa(t);(!_t||_t.length>0)&&(_t=[])}else Vt=Ou,(!_t||_t.length>0)&&(_t=[]);return Fa(t)}unpackMultiple(e,t){let n,s=0;try{Zi=!0;let r=e.length,a=this?this.unpack(e,r):Yo.unpack(e,r);if(t){if(t(a,s,q)===!1)return;for(;q<r;)if(s=q,t(Fa(),s,q)===!1)return}else{for(n=[a];q<r;)s=q,n.push(Fa());return n}}catch(r){throw r.lastPosition=s,r.values=n,r}finally{Zi=!1,Lo()}}_mergeStructures(e,t){e=e||[],Object.isFrozen(e)&&(e=e.map(n=>n.slice(0)));for(let n=0,s=e.length;n<s;n++){let r=e[n];r&&(r.isShared=!0,n>=32&&(r.highByte=n-32>>5))}e.sharedLength=e.length;for(let n in t||[])if(n>=0){let s=e[n],r=t[n];r&&(s&&((e.restoreStructures||(e.restoreStructures=[]))[n]=s),e[n]=r)}return this.structures=e}decode(e,t){return this.unpack(e,t)}}function Fa(i){try{if(!Vt.trusted&&!Zi){let t=_t.sharedLength||0;t<_t.length&&(_t.length=t)}let e;if(Vt.randomAccessStructure&&Pe[q]<64&&Pe[q]>=32&&Vg||(e=Yt()),hn&&(q=hn.postBundlePosition,hn=null),Zi&&(_t.restoreStructures=null),q==di)_t&&_t.restoreStructures&&Uu(),_t=null,Pe=null,Pi&&(Pi=null);else{if(q>di)throw new Error("Unexpected end of MessagePack data");if(!Zi){let t;try{t=JSON.stringify(e,(n,s)=>typeof s=="bigint"?`${s}n`:s).slice(0,100)}catch(n){t="(JSON view not available "+n+")"}throw new Error("Data read, but end of buffer not reached "+t)}}return e}catch(e){throw _t&&_t.restoreStructures&&Uu(),Lo(),(e instanceof RangeError||e.message.startsWith("Unexpected end of buffer")||q>di)&&(e.incomplete=!0),e}}function Uu(){for(let i in _t.restoreStructures)_t[i]=_t.restoreStructures[i];_t.restoreStructures=null}function Yt(){let i=Pe[q++];if(i<160)if(i<128){if(i<64)return i;{let e=_t[i&63]||Vt.getStructures&&gp()[i&63];return e?(e.read||(e.read=Th(e,i&63)),e.read()):i}}else if(i<144)if(i-=128,Vt.mapsAsObjects){let e={};for(let t=0;t<i;t++){let n=_p();n==="__proto__"&&(n="__proto_"),e[n]=Yt()}return e}else{let e=new Map;for(let t=0;t<i;t++)e.set(Yt(),Yt());return e}else{i-=144;let e=new Array(i);for(let t=0;t<i;t++)e[t]=Yt();return Vt.freezeData?Object.freeze(e):e}else if(i<192){let e=i-160;if(ci>=q)return ji.slice(q-Fn,(q+=e)-Fn);if(ci==0&&di<140){let t=e<16?Ah(e):vp(e);if(t!=null)return t}return mc(e)}else{let e;switch(i){case 192:return null;case 193:return hn?(e=Yt(),e>0?hn[1].slice(hn.position1,hn.position1+=e):hn[0].slice(hn.position0,hn.position0-=e)):Eh;case 194:return!1;case 195:return!0;case 196:if(e=Pe[q++],e===void 0)throw new Error("Unexpected end of buffer");return vl(e);case 197:return e=vt.getUint16(q),q+=2,vl(e);case 198:return e=vt.getUint32(q),q+=4,vl(e);case 199:return ls(Pe[q++]);case 200:return e=vt.getUint16(q),q+=2,ls(e);case 201:return e=vt.getUint32(q),q+=4,ls(e);case 202:if(e=vt.getFloat32(q),Vt.useFloat32>2){let t=jo[(Pe[q]&127)<<1|Pe[q+1]>>7];return q+=4,(t*e+(e>0?.5:-.5)>>0)/t}return q+=4,e;case 203:return e=vt.getFloat64(q),q+=8,e;case 204:return Pe[q++];case 205:return e=vt.getUint16(q),q+=2,e;case 206:return e=vt.getUint32(q),q+=4,e;case 207:return Vt.int64AsType==="number"?(e=vt.getUint32(q)*4294967296,e+=vt.getUint32(q+4)):Vt.int64AsType==="string"?e=vt.getBigUint64(q).toString():Vt.int64AsType==="auto"?(e=vt.getBigUint64(q),e<=BigInt(2)<<BigInt(52)&&(e=Number(e))):e=vt.getBigUint64(q),q+=8,e;case 208:return vt.getInt8(q++);case 209:return e=vt.getInt16(q),q+=2,e;case 210:return e=vt.getInt32(q),q+=4,e;case 211:return Vt.int64AsType==="number"?(e=vt.getInt32(q)*4294967296,e+=vt.getUint32(q+4)):Vt.int64AsType==="string"?e=vt.getBigInt64(q).toString():Vt.int64AsType==="auto"?(e=vt.getBigInt64(q),e>=BigInt(-2)<<BigInt(52)&&e<=BigInt(2)<<BigInt(52)&&(e=Number(e))):e=vt.getBigInt64(q),q+=8,e;case 212:if(e=Pe[q++],e==114)return Vu(Pe[q++]&63);{let t=gn[e];if(t)return t.read?(q++,t.read(Yt())):t.noBuffer?(q++,t()):t(Pe.subarray(q,++q));throw new Error("Unknown extension "+e)}case 213:return e=Pe[q],e==114?(q++,Vu(Pe[q++]&63,Pe[q++])):ls(2);case 214:return ls(4);case 215:return ls(8);case 216:return ls(16);case 217:return e=Pe[q++],ci>=q?ji.slice(q-Fn,(q+=e)-Fn):$g(e);case 218:return e=vt.getUint16(q),q+=2,ci>=q?ji.slice(q-Fn,(q+=e)-Fn):Wg(e);case 219:return e=vt.getUint32(q),q+=4,ci>=q?ji.slice(q-Fn,(q+=e)-Fn):Xg(e);case 220:return e=vt.getUint16(q),q+=2,Fu(e);case 221:return e=vt.getUint32(q),q+=4,Fu(e);case 222:return e=vt.getUint16(q),q+=2,Bu(e);case 223:return e=vt.getUint32(q),q+=4,Bu(e);default:if(i>=224)return i-256;if(i===void 0){let t=new Error("Unexpected end of MessagePack data");throw t.incomplete=!0,t}throw new Error("Unknown MessagePack token "+i)}}}const Gg=/^[a-zA-Z_$][a-zA-Z\d_$]*$/;function Th(i,e){function t(){if(t.count++>mp){let s=i.read=new Function("r","return function(){return "+(Vt.freezeData?"Object.freeze":"")+"({"+i.map(r=>r==="__proto__"?"__proto_:r()":Gg.test(r)?r+":r()":"["+JSON.stringify(r)+"]:r()").join(",")+"})}")(Yt);return i.highByte===0&&(i.read=Nu(e,i.read)),s()}let n={};for(let s=0,r=i.length;s<r;s++){let a=i[s];a==="__proto__"&&(a="__proto_"),n[a]=Yt()}return Vt.freezeData?Object.freeze(n):n}return t.count=0,i.highByte===0?Nu(e,t):t}const Nu=(i,e)=>function(){let t=Pe[q++];if(t===0)return e();let n=i<32?-(i+(t<<5)):i+(t<<5),s=_t[n]||gp()[n];if(!s)throw new Error("Record id is not defined for "+n);return s.read||(s.read=Th(s,i)),s.read()};function gp(){let i=bp(()=>(Pe=null,Vt.getStructures()));return _t=Vt._mergeStructures(i,_t)}var mc=ba,$g=ba,Wg=ba,Xg=ba;let qg=!1;function ba(i){let e;if(i<16&&(e=Ah(i)))return e;if(i>64&&pc)return pc.decode(Pe.subarray(q,q+=i));const t=q+i,n=[];for(e="";q<t;){const s=Pe[q++];if((s&128)===0)n.push(s);else if((s&224)===192){const r=Pe[q++]&63;n.push((s&31)<<6|r)}else if((s&240)===224){const r=Pe[q++]&63,a=Pe[q++]&63;n.push((s&31)<<12|r<<6|a)}else if((s&248)===240){const r=Pe[q++]&63,a=Pe[q++]&63,o=Pe[q++]&63;let c=(s&7)<<18|r<<12|a<<6|o;c>65535&&(c-=65536,n.push(c>>>10&1023|55296),c=56320|c&1023),n.push(c)}else n.push(s);n.length>=4096&&(e+=ln.apply(String,n),n.length=0)}return n.length>0&&(e+=ln.apply(String,n)),e}function Fu(i){let e=new Array(i);for(let t=0;t<i;t++)e[t]=Yt();return Vt.freezeData?Object.freeze(e):e}function Bu(i){if(Vt.mapsAsObjects){let e={};for(let t=0;t<i;t++){let n=_p();n==="__proto__"&&(n="__proto_"),e[n]=Yt()}return e}else{let e=new Map;for(let t=0;t<i;t++)e.set(Yt(),Yt());return e}}var ln=String.fromCharCode;function vp(i){let e=q,t=new Array(i);for(let n=0;n<i;n++){const s=Pe[q++];if((s&128)>0){q=e;return}t[n]=s}return ln.apply(String,t)}function Ah(i){if(i<4)if(i<2){if(i===0)return"";{let e=Pe[q++];if((e&128)>1){q-=1;return}return ln(e)}}else{let e=Pe[q++],t=Pe[q++];if((e&128)>0||(t&128)>0){q-=2;return}if(i<3)return ln(e,t);let n=Pe[q++];if((n&128)>0){q-=3;return}return ln(e,t,n)}else{let e=Pe[q++],t=Pe[q++],n=Pe[q++],s=Pe[q++];if((e&128)>0||(t&128)>0||(n&128)>0||(s&128)>0){q-=4;return}if(i<6){if(i===4)return ln(e,t,n,s);{let r=Pe[q++];if((r&128)>0){q-=5;return}return ln(e,t,n,s,r)}}else if(i<8){let r=Pe[q++],a=Pe[q++];if((r&128)>0||(a&128)>0){q-=6;return}if(i<7)return ln(e,t,n,s,r,a);let o=Pe[q++];if((o&128)>0){q-=7;return}return ln(e,t,n,s,r,a,o)}else{let r=Pe[q++],a=Pe[q++],o=Pe[q++],c=Pe[q++];if((r&128)>0||(a&128)>0||(o&128)>0||(c&128)>0){q-=8;return}if(i<10){if(i===8)return ln(e,t,n,s,r,a,o,c);{let l=Pe[q++];if((l&128)>0){q-=9;return}return ln(e,t,n,s,r,a,o,c,l)}}else if(i<12){let l=Pe[q++],d=Pe[q++];if((l&128)>0||(d&128)>0){q-=10;return}if(i<11)return ln(e,t,n,s,r,a,o,c,l,d);let h=Pe[q++];if((h&128)>0){q-=11;return}return ln(e,t,n,s,r,a,o,c,l,d,h)}else{let l=Pe[q++],d=Pe[q++],h=Pe[q++],f=Pe[q++];if((l&128)>0||(d&128)>0||(h&128)>0||(f&128)>0){q-=12;return}if(i<14){if(i===12)return ln(e,t,n,s,r,a,o,c,l,d,h,f);{let p=Pe[q++];if((p&128)>0){q-=13;return}return ln(e,t,n,s,r,a,o,c,l,d,h,f,p)}}else{let p=Pe[q++],_=Pe[q++];if((p&128)>0||(_&128)>0){q-=14;return}if(i<15)return ln(e,t,n,s,r,a,o,c,l,d,h,f,p,_);let y=Pe[q++];if((y&128)>0){q-=15;return}return ln(e,t,n,s,r,a,o,c,l,d,h,f,p,_,y)}}}}}function zu(){let i=Pe[q++],e;if(i<192)e=i-160;else switch(i){case 217:e=Pe[q++];break;case 218:e=vt.getUint16(q),q+=2;break;case 219:e=vt.getUint32(q),q+=4;break;default:throw new Error("Expected string")}return ba(e)}function vl(i){return Vt.copyBuffers?Uint8Array.prototype.slice.call(Pe,q,q+=i):Pe.subarray(q,q+=i)}function ls(i){let e=Pe[q++];if(gn[e]){let t;return gn[e](Pe.subarray(q,t=q+=i),n=>{q=n;try{return Yt()}finally{q=t}})}else throw new Error("Unknown extension type "+e)}var Hu=new Array(4096);function _p(){let i=Pe[q++];if(i>=160&&i<192){if(i=i-160,ci>=q)return ji.slice(q-Fn,(q+=i)-Fn);if(!(ci==0&&di<180))return mc(i)}else return q--,xp(Yt());let e=(i<<5^(i>1?vt.getUint16(q):i>0?Pe[q]:0))&4095,t=Hu[e],n=q,s=q+i-3,r,a=0;if(t&&t.bytes==i){for(;n<s;){if(r=vt.getUint32(n),r!=t[a++]){n=1879048192;break}n+=4}for(s+=3;n<s;)if(r=Pe[n++],r!=t[a++]){n=1879048192;break}if(n===s)return q=n,t.string;s-=3,n=q}for(t=[],Hu[e]=t,t.bytes=i;n<s;)r=vt.getUint32(n),t.push(r),n+=4;for(s+=3;n<s;)r=Pe[n++],t.push(r);let o=i<16?Ah(i):vp(i);return o!=null?t.string=o:t.string=mc(i)}function xp(i){if(typeof i=="string")return i;if(typeof i=="number"||typeof i=="boolean"||typeof i=="bigint")return i.toString();if(i==null)return i+"";if(Vt.allowArraysInMapKeys&&Array.isArray(i)&&i.flat().every(e=>["string","number","boolean","bigint"].includes(typeof e)))return i.flat().toString();throw new Error(`Invalid property type for record: ${typeof i}`)}const Vu=(i,e)=>{let t=Yt().map(xp),n=i;e!==void 0&&(i=i<32?-((e<<5)+i):(e<<5)+i,t.highByte=e);let s=_t[i];return s&&(s.isShared||Zi)&&((_t.restoreStructures||(_t.restoreStructures=[]))[i]=s),_t[i]=t,t.read=Th(t,n),t.read()};gn[0]=()=>{};gn[0].noBuffer=!0;gn[66]=i=>{let e=i.length,t=BigInt(i[0]&128?i[0]-256:i[0]);for(let n=1;n<e;n++)t<<=BigInt(8),t+=BigInt(i[n]);return t};let jg={Error,TypeError,ReferenceError};gn[101]=()=>{let i=Yt();return(jg[i[0]]||Error)(i[1],{cause:i[2]})};gn[105]=i=>{if(Vt.structuredClone===!1)throw new Error("Structured clone extension is disabled");let e=vt.getUint32(q-4);Pi||(Pi=new Map);let t=Pe[q],n;t>=144&&t<160||t==220||t==221?n=[]:n={};let s={target:n};Pi.set(e,s);let r=Yt();return s.used?Object.assign(n,r):(s.target=r,r)};gn[112]=i=>{if(Vt.structuredClone===!1)throw new Error("Structured clone extension is disabled");let e=vt.getUint32(q-4),t=Pi.get(e);return t.used=!0,t.target};gn[115]=()=>new Set(Yt());const yp=["Int8","Uint8","Uint8Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64","BigInt64","BigUint64"].map(i=>i+"Array");let Yg=typeof globalThis=="object"?globalThis:window;gn[116]=i=>{let e=i[0],t=yp[e];if(!t){if(e===16){let n=new ArrayBuffer(i.length-1);return new Uint8Array(n).set(i.subarray(1)),n}throw new Error("Could not find typed array for code "+e)}return new Yg[t](Uint8Array.prototype.slice.call(i,1).buffer)};gn[120]=()=>{let i=Yt();return new RegExp(i[0],i[1])};const Kg=[];gn[98]=i=>{let e=(i[0]<<24)+(i[1]<<16)+(i[2]<<8)+i[3],t=q;return q+=e-i.length,hn=Kg,hn=[zu(),zu()],hn.position0=0,hn.position1=0,hn.postBundlePosition=q,q=t,Yt()};gn[255]=i=>i.length==4?new Date((i[0]*16777216+(i[1]<<16)+(i[2]<<8)+i[3])*1e3):i.length==8?new Date(((i[0]<<22)+(i[1]<<14)+(i[2]<<6)+(i[3]>>2))/1e6+((i[3]&3)*4294967296+i[4]*16777216+(i[5]<<16)+(i[6]<<8)+i[7])*1e3):i.length==12?new Date(((i[0]<<24)+(i[1]<<16)+(i[2]<<8)+i[3])/1e6+((i[4]&128?-281474976710656:0)+i[6]*1099511627776+i[7]*4294967296+i[8]*16777216+(i[9]<<16)+(i[10]<<8)+i[11])*1e3):new Date("invalid");function bp(i){let e=di,t=q,n=Fn,s=ci,r=ji,a=Pi,o=hn,c=new Uint8Array(Pe.slice(0,di)),l=_t,d=_t.slice(0,_t.length),h=Vt,f=Zi,p=i();return di=e,q=t,Fn=n,ci=s,ji=r,Pi=a,hn=o,Pe=c,Zi=f,_t=l,_t.splice(0,_t.length,...d),Vt=h,vt=new DataView(Pe.buffer,Pe.byteOffset,Pe.byteLength),p}function Lo(){Pe=null,Pi=null,_t=null}function Jg(i){i.unpack?gn[i.type]=i.unpack:gn[i.type]=i}const jo=new Array(147);for(let i=0;i<256;i++)jo[i]=+("1e"+Math.floor(45.15-i*.30103));const Zg=es;var Yo=new es({useRecords:!1});const Qg=Yo.unpack,e0=Yo.unpackMultiple,t0=Yo.unpack,Sp={NEVER:0,ALWAYS:1,DECIMAL_ROUND:3,DECIMAL_FIT:4};let wp=new Float32Array(1),Gu=new Uint8Array(wp.buffer,0,4);function n0(i){wp[0]=i;let e=jo[(Gu[3]&127)<<1|Gu[2]>>7];return(e*i+(i>0?.5:-.5)>>0)/e}let xo;try{xo=new TextEncoder}catch{}let ko,Rh;const Ko=typeof Buffer<"u",Ba=Ko?function(i){return Buffer.allocUnsafeSlow(i)}:Uint8Array,Mp=Ko?Buffer:Uint8Array,$u=Ko?4294967296:2144337920;let te,Or,Bt,Y=0,_n,qt=null,i0;const s0=21760,r0=/[\u0080-\uFFFF]/,Hs=Symbol("record-id");class Sa extends es{constructor(e){super(e),this.offset=0;let t,n,s,r,a=Mp.prototype.utf8Write?function(I,$){return te.utf8Write(I,$,te.byteLength-$)}:xo&&xo.encodeInto?function(I,$){return xo.encodeInto(I,te.subarray($)).written}:!1,o=this;e||(e={});let c=e&&e.sequential,l=e.structures||e.saveStructures,d=e.maxSharedStructures;if(d==null&&(d=l?32:0),d>8160)throw new Error("Maximum maxSharedStructure is 8160");e.structuredClone&&e.moreTypes==null&&(this.moreTypes=!0);let h=e.maxOwnStructures;h==null&&(h=l?32:64),!this.structures&&e.useRecords!=!1&&(this.structures=[]);let f=d>32||h+d>64,p=d+64,_=d+h+64;if(_>8256)throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");let y=[],x=0,g=0;this.pack=this.encode=function(I,$){if(te||(te=new Ba(8192),Bt=te.dataView||(te.dataView=new DataView(te.buffer,0,8192)),Y=0),_n=te.length-10,_n-Y<2048?(te=new Ba(te.length),Bt=te.dataView||(te.dataView=new DataView(te.buffer,0,te.length)),_n=te.length-10,Y=0):Y=Y+7&2147483640,t=Y,$&Rp&&(Y+=$&255),r=o.structuredClone?new Map:null,o.bundleStrings&&typeof I!="string"?(qt=[],qt.size=1/0):qt=null,s=o.structures,s){s.uninitialized&&(s=o._mergeStructures(o.getStructures()));let z=s.sharedLength||0;if(z>d)throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to "+s.sharedLength);if(!s.transitions){s.transitions=Object.create(null);for(let W=0;W<z;W++){let X=s[W];if(!X)continue;let de,fe=s.transitions;for(let Se=0,Ne=X.length;Se<Ne;Se++){let ct=X[Se];de=fe[ct],de||(de=fe[ct]=Object.create(null)),fe=de}fe[Hs]=W+64}this.lastNamedStructuresLength=z}c||(s.nextId=z+64)}n&&(n=!1);let H;try{o.randomAccessStructure&&I&&I.constructor&&I.constructor===Object?Z(I):S(I);let z=qt;if(qt&&qu(t,S,0),r&&r.idsToInsert){let W=r.idsToInsert.sort((Se,Ne)=>Se.offset>Ne.offset?1:-1),X=W.length,de=-1;for(;z&&X>0;){let Se=W[--X].offset+t;Se<z.stringsPosition+t&&de===-1&&(de=0),Se>z.position+t?de>=0&&(de+=6):(de>=0&&(Bt.setUint32(z.position+t,Bt.getUint32(z.position+t)+de),de=-1),z=z.previous,X++)}de>=0&&z&&Bt.setUint32(z.position+t,Bt.getUint32(z.position+t)+de),Y+=W.length*6,Y>_n&&E(Y),o.offset=Y;let fe=o0(te.subarray(t,Y),W);return r=null,fe}return o.offset=Y,$&Tp?(te.start=t,te.end=Y,te):te.subarray(t,Y)}catch(z){throw H=z,z}finally{if(s&&(T(),n&&o.saveStructures)){let z=s.sharedLength||0,W=te.subarray(t,Y),X=c0(s,o);if(!H)return o.saveStructures(X,X.isCompatible)===!1?o.pack(I,$):(o.lastNamedStructuresLength=z,te.length>1073741824&&(te=null),W)}te.length>1073741824&&(te=null),$&Ap&&(Y=t)}};const T=()=>{g<10&&g++;let I=s.sharedLength||0;if(s.length>I&&!c&&(s.length=I),x>1e4)s.transitions=null,g=0,x=0,y.length>0&&(y=[]);else if(y.length>0&&!c){for(let $=0,H=y.length;$<H;$++)y[$][Hs]=0;y=[]}},A=I=>{var $=I.length;$<16?te[Y++]=144|$:$<65536?(te[Y++]=220,te[Y++]=$>>8,te[Y++]=$&255):(te[Y++]=221,Bt.setUint32(Y,$),Y+=4);for(let H=0;H<$;H++)S(I[H])},S=I=>{Y>_n&&(te=E(Y));var $=typeof I,H;if($==="string"){let z=I.length;if(qt&&z>=4&&z<4096){if((qt.size+=z)>s0){let fe,Se=(qt[0]?qt[0].length*3+qt[1].length:0)+10;Y+Se>_n&&(te=E(Y+Se));let Ne;qt.position?(Ne=qt,te[Y]=200,Y+=3,te[Y++]=98,fe=Y-t,Y+=4,qu(t,S,0),Bt.setUint16(fe+t-3,Y-t-fe)):(te[Y++]=214,te[Y++]=98,fe=Y-t,Y+=4),qt=["",""],qt.previous=Ne,qt.size=0,qt.position=fe}let de=r0.test(I);qt[de?0:1]+=I,te[Y++]=193,S(de?-z:z);return}let W;z<32?W=1:z<256?W=2:z<65536?W=3:W=5;let X=z*3;if(Y+X>_n&&(te=E(Y+X)),z<64||!a){let de,fe,Se,Ne=Y+W;for(de=0;de<z;de++)fe=I.charCodeAt(de),fe<128?te[Ne++]=fe:fe<2048?(te[Ne++]=fe>>6|192,te[Ne++]=fe&63|128):(fe&64512)===55296&&((Se=I.charCodeAt(de+1))&64512)===56320?(fe=65536+((fe&1023)<<10)+(Se&1023),de++,te[Ne++]=fe>>18|240,te[Ne++]=fe>>12&63|128,te[Ne++]=fe>>6&63|128,te[Ne++]=fe&63|128):(te[Ne++]=fe>>12|224,te[Ne++]=fe>>6&63|128,te[Ne++]=fe&63|128);H=Ne-Y-W}else H=a(I,Y+W);H<32?te[Y++]=160|H:H<256?(W<2&&te.copyWithin(Y+2,Y+1,Y+1+H),te[Y++]=217,te[Y++]=H):H<65536?(W<3&&te.copyWithin(Y+3,Y+2,Y+2+H),te[Y++]=218,te[Y++]=H>>8,te[Y++]=H&255):(W<5&&te.copyWithin(Y+5,Y+3,Y+3+H),te[Y++]=219,Bt.setUint32(Y,H),Y+=4),Y+=H}else if($==="number")if(I>>>0===I)I<32||I<128&&this.useRecords===!1||I<64&&!this.randomAccessStructure?te[Y++]=I:I<256?(te[Y++]=204,te[Y++]=I):I<65536?(te[Y++]=205,te[Y++]=I>>8,te[Y++]=I&255):(te[Y++]=206,Bt.setUint32(Y,I),Y+=4);else if(I>>0===I)I>=-32?te[Y++]=256+I:I>=-128?(te[Y++]=208,te[Y++]=I+256):I>=-32768?(te[Y++]=209,Bt.setInt16(Y,I),Y+=2):(te[Y++]=210,Bt.setInt32(Y,I),Y+=4);else{let z;if((z=this.useFloat32)>0&&I<4294967296&&I>=-2147483648){te[Y++]=202,Bt.setFloat32(Y,I);let W;if(z<4||(W=I*jo[(te[Y]&127)<<1|te[Y+1]>>7])>>0===W){Y+=4;return}else Y--}te[Y++]=203,Bt.setFloat64(Y,I),Y+=8}else if($==="object"||$==="function")if(!I)te[Y++]=192;else{if(r){let W=r.get(I);if(W){if(!W.id){let X=r.idsToInsert||(r.idsToInsert=[]);W.id=X.push(W)}te[Y++]=214,te[Y++]=112,Bt.setUint32(Y,W.id),Y+=4;return}else r.set(I,{offset:Y-t})}let z=I.constructor;if(z===Object)P(I);else if(z===Array)A(I);else if(z===Map)if(this.mapAsEmptyObject)te[Y++]=128;else{H=I.size,H<16?te[Y++]=128|H:H<65536?(te[Y++]=222,te[Y++]=H>>8,te[Y++]=H&255):(te[Y++]=223,Bt.setUint32(Y,H),Y+=4);for(let[W,X]of I)S(W),S(X)}else{for(let W=0,X=ko.length;W<X;W++){let de=Rh[W];if(I instanceof de){let fe=ko[W];if(fe.write){fe.type&&(te[Y++]=212,te[Y++]=fe.type,te[Y++]=0);let pt=fe.write.call(this,I);pt===I?Array.isArray(I)?A(I):P(I):S(pt);return}let Se=te,Ne=Bt,ct=Y;te=null;let mt;try{mt=fe.pack.call(this,I,pt=>(te=Se,Se=null,Y+=pt,Y>_n&&E(Y),{target:te,targetView:Bt,position:Y-pt}),S)}finally{Se&&(te=Se,Bt=Ne,Y=ct,_n=te.length-10)}mt&&(mt.length+Y>_n&&E(mt.length+Y),Y=a0(mt,te,Y,fe.type));return}}if(Array.isArray(I))A(I);else{if(I.toJSON){const W=I.toJSON();if(W!==I)return S(W)}if($==="function")return S(this.writeFunction&&this.writeFunction(I));P(I)}}}else if($==="boolean")te[Y++]=I?195:194;else if($==="bigint"){if(I<BigInt(1)<<BigInt(63)&&I>=-(BigInt(1)<<BigInt(63)))te[Y++]=211,Bt.setBigInt64(Y,I);else if(I<BigInt(1)<<BigInt(64)&&I>0)te[Y++]=207,Bt.setBigUint64(Y,I);else if(this.largeBigIntToFloat)te[Y++]=203,Bt.setFloat64(Y,Number(I));else{if(this.largeBigIntToString)return S(I.toString());if(this.useBigIntExtension&&I<BigInt(2)**BigInt(1023)&&I>-(BigInt(2)**BigInt(1023))){te[Y++]=199,Y++,te[Y++]=66;let z=[],W;do{let X=I&BigInt(255);W=(X&BigInt(128))===(I<BigInt(0)?BigInt(128):BigInt(0)),z.push(X),I>>=BigInt(8)}while(!((I===BigInt(0)||I===BigInt(-1))&&W));te[Y-2]=z.length;for(let X=z.length;X>0;)te[Y++]=Number(z[--X]);return}else throw new RangeError(I+" was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string")}Y+=8}else if($==="undefined")this.encodeUndefinedAsNil?te[Y++]=192:(te[Y++]=212,te[Y++]=0,te[Y++]=0);else throw new Error("Unknown type: "+$)},O=this.variableMapSize||this.coercibleKeyAsNumber||this.skipValues?I=>{let $;if(this.skipValues){$=[];for(let W in I)(typeof I.hasOwnProperty!="function"||I.hasOwnProperty(W))&&!this.skipValues.includes(I[W])&&$.push(W)}else $=Object.keys(I);let H=$.length;H<16?te[Y++]=128|H:H<65536?(te[Y++]=222,te[Y++]=H>>8,te[Y++]=H&255):(te[Y++]=223,Bt.setUint32(Y,H),Y+=4);let z;if(this.coercibleKeyAsNumber)for(let W=0;W<H;W++){z=$[W];let X=Number(z);S(isNaN(X)?z:X),S(I[z])}else for(let W=0;W<H;W++)S(z=$[W]),S(I[z])}:I=>{te[Y++]=222;let $=Y-t;Y+=2;let H=0;for(let z in I)(typeof I.hasOwnProperty!="function"||I.hasOwnProperty(z))&&(S(z),S(I[z]),H++);if(H>65535)throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');te[$+++t]=H>>8,te[$+t]=H&255},k=this.useRecords===!1?O:e.progressiveRecords&&!f?I=>{let $,H=s.transitions||(s.transitions=Object.create(null)),z=Y++-t,W;for(let X in I)if(typeof I.hasOwnProperty!="function"||I.hasOwnProperty(X)){if($=H[X],$)H=$;else{let de=Object.keys(I),fe=H;H=s.transitions;let Se=0;for(let Ne=0,ct=de.length;Ne<ct;Ne++){let mt=de[Ne];$=H[mt],$||($=H[mt]=Object.create(null),Se++),H=$}z+t+1==Y?(Y--,R(H,de,Se)):B(H,de,z,Se),W=!0,H=fe[X]}S(I[X])}if(!W){let X=H[Hs];X?te[z+t]=X:B(H,Object.keys(I),z,0)}}:I=>{let $,H=s.transitions||(s.transitions=Object.create(null)),z=0;for(let X in I)(typeof I.hasOwnProperty!="function"||I.hasOwnProperty(X))&&($=H[X],$||($=H[X]=Object.create(null),z++),H=$);let W=H[Hs];W?W>=96&&f?(te[Y++]=((W-=96)&31)+96,te[Y++]=W>>5):te[Y++]=W:R(H,H.__keys__||Object.keys(I),z);for(let X in I)(typeof I.hasOwnProperty!="function"||I.hasOwnProperty(X))&&S(I[X])},U=typeof this.useRecords=="function"&&this.useRecords,P=U?I=>{U(I)?k(I):O(I)}:k,E=I=>{let $;if(I>16777216){if(I-t>$u)throw new Error("Packed buffer would be larger than maximum buffer size");$=Math.min($u,Math.round(Math.max((I-t)*(I>67108864?1.25:2),4194304)/4096)*4096)}else $=(Math.max(I-t<<2,te.length-1)>>12)+1<<12;let H=new Ba($);return Bt=H.dataView||(H.dataView=new DataView(H.buffer,0,$)),I=Math.min(I,te.length),te.copy?te.copy(H,0,t,I):H.set(te.slice(t,I)),Y-=t,t=0,_n=H.length-10,te=H},R=(I,$,H)=>{let z=s.nextId;z||(z=64),z<p&&this.shouldShareStructure&&!this.shouldShareStructure($)?(z=s.nextOwnId,z<_||(z=p),s.nextOwnId=z+1):(z>=_&&(z=p),s.nextId=z+1);let W=$.highByte=z>=96&&f?z-96>>5:-1;I[Hs]=z,I.__keys__=$,s[z-64]=$,z<p?($.isShared=!0,s.sharedLength=z-63,n=!0,W>=0?(te[Y++]=(z&31)+96,te[Y++]=W):te[Y++]=z):(W>=0?(te[Y++]=213,te[Y++]=114,te[Y++]=(z&31)+96,te[Y++]=W):(te[Y++]=212,te[Y++]=114,te[Y++]=z),H&&(x+=g*H),y.length>=h&&(y.shift()[Hs]=0),y.push(I),S($))},B=(I,$,H,z)=>{let W=te,X=Y,de=_n,fe=t;te=Or,Y=0,t=0,te||(Or=te=new Ba(8192)),_n=te.length-10,R(I,$,z),Or=te;let Se=Y;if(te=W,Y=X,_n=de,t=fe,Se>1){let Ne=Y+Se-1;Ne>_n&&E(Ne);let ct=H+t;te.copyWithin(ct+Se,ct+1,Y),te.set(Or.slice(0,Se),ct),Y=Ne}else te[H+t]=Or[0]},Z=I=>{let $=i0(I,te,t,Y,s,E,(H,z,W)=>{if(W)return n=!0;Y=z;let X=te;return S(H),T(),X!==te?{position:Y,targetView:Bt,target:te}:Y},this);if($===0)return P(I);Y=$}}useBuffer(e){te=e,te.dataView||(te.dataView=new DataView(te.buffer,te.byteOffset,te.byteLength)),Bt=te.dataView,Y=0}set position(e){Y=e}get position(){return Y}set buffer(e){te=e}get buffer(){return te}clearSharedData(){this.structures&&(this.structures=[]),this.typedStructs&&(this.typedStructs=[])}}Rh=[Date,Set,Error,RegExp,ArrayBuffer,Object.getPrototypeOf(Uint8Array.prototype).constructor,pp];ko=[{pack(i,e,t){let n=i.getTime()/1e3;if((this.useTimestamp32||i.getMilliseconds()===0)&&n>=0&&n<4294967296){let{target:s,targetView:r,position:a}=e(6);s[a++]=214,s[a++]=255,r.setUint32(a,n)}else if(n>0&&n<4294967296){let{target:s,targetView:r,position:a}=e(10);s[a++]=215,s[a++]=255,r.setUint32(a,i.getMilliseconds()*4e6+(n/1e3/4294967296>>0)),r.setUint32(a+4,n)}else if(isNaN(n)){if(this.onInvalidDate)return e(0),t(this.onInvalidDate());let{target:s,targetView:r,position:a}=e(3);s[a++]=212,s[a++]=255,s[a++]=255}else{let{target:s,targetView:r,position:a}=e(15);s[a++]=199,s[a++]=12,s[a++]=255,r.setUint32(a,i.getMilliseconds()*1e6),r.setBigInt64(a+4,BigInt(Math.floor(n)))}}},{pack(i,e,t){if(this.setAsEmptyObject)return e(0),t({});let n=Array.from(i),{target:s,position:r}=e(this.moreTypes?3:0);this.moreTypes&&(s[r++]=212,s[r++]=115,s[r++]=0),t(n)}},{pack(i,e,t){let{target:n,position:s}=e(this.moreTypes?3:0);this.moreTypes&&(n[s++]=212,n[s++]=101,n[s++]=0),t([i.name,i.message,i.cause])}},{pack(i,e,t){let{target:n,position:s}=e(this.moreTypes?3:0);this.moreTypes&&(n[s++]=212,n[s++]=120,n[s++]=0),t([i.source,i.flags])}},{pack(i,e){this.moreTypes?Wu(i,16,e):Xu(Ko?Buffer.from(i):new Uint8Array(i),e)}},{pack(i,e){let t=i.constructor;t!==Mp&&this.moreTypes?Wu(i,yp.indexOf(t.name),e):Xu(i,e)}},{pack(i,e){let{target:t,position:n}=e(1);t[n]=193}}];function Wu(i,e,t,n){let s=i.byteLength;if(s+1<256){var{target:r,position:a}=t(4+s);r[a++]=199,r[a++]=s+1}else if(s+1<65536){var{target:r,position:a}=t(5+s);r[a++]=200,r[a++]=s+1>>8,r[a++]=s+1&255}else{var{target:r,position:a,targetView:o}=t(7+s);r[a++]=201,o.setUint32(a,s+1),a+=4}r[a++]=116,r[a++]=e,i.buffer||(i=new Uint8Array(i)),r.set(new Uint8Array(i.buffer,i.byteOffset,i.byteLength),a)}function Xu(i,e){let t=i.byteLength;var n,s;if(t<256){var{target:n,position:s}=e(t+2);n[s++]=196,n[s++]=t}else if(t<65536){var{target:n,position:s}=e(t+3);n[s++]=197,n[s++]=t>>8,n[s++]=t&255}else{var{target:n,position:s,targetView:r}=e(t+5);n[s++]=198,r.setUint32(s,t),s+=4}n.set(i,s)}function a0(i,e,t,n){let s=i.length;switch(s){case 1:e[t++]=212;break;case 2:e[t++]=213;break;case 4:e[t++]=214;break;case 8:e[t++]=215;break;case 16:e[t++]=216;break;default:s<256?(e[t++]=199,e[t++]=s):s<65536?(e[t++]=200,e[t++]=s>>8,e[t++]=s&255):(e[t++]=201,e[t++]=s>>24,e[t++]=s>>16&255,e[t++]=s>>8&255,e[t++]=s&255)}return e[t++]=n,e.set(i,t),t+=s,t}function o0(i,e){let t,n=e.length*6,s=i.length-n;for(;t=e.pop();){let r=t.offset,a=t.id;i.copyWithin(r+n,r,s),n-=6;let o=r+n;i[o++]=214,i[o++]=105,i[o++]=a>>24,i[o++]=a>>16&255,i[o++]=a>>8&255,i[o++]=a&255,s=r}return i}function qu(i,e,t){if(qt.length>0){Bt.setUint32(qt.position+i,Y+t-qt.position-i),qt.stringsPosition=Y-i;let n=qt;qt=null,e(n[0]),e(n[1])}}function l0(i){if(i.Class){if(!i.pack&&!i.write)throw new Error("Extension has no pack or write function");if(i.pack&&!i.type)throw new Error("Extension has no type (numeric code to identify the extension)");Rh.unshift(i.Class),ko.unshift(i)}Jg(i)}function c0(i,e){return i.isCompatible=t=>{let n=!t||(e.lastNamedStructuresLength||0)===t.length;return n||e._mergeStructures(t),n},i}let Ep=new Sa({useRecords:!1});const h0=Ep.pack,u0=Ep.pack,d0=Sa,{NEVER:f0,ALWAYS:p0,DECIMAL_ROUND:m0,DECIMAL_FIT:g0}=Sp,Tp=512,Ap=1024,Rp=2048;function v0(i,e={}){if(!i||typeof i!="object")throw new Error("first argument must be an Iterable, Async Iterable, or a Promise for an Async Iterable");if(typeof i[Symbol.iterator]=="function")return _0(i,e);if(typeof i.then=="function"||typeof i[Symbol.asyncIterator]=="function")return x0(i,e);throw new Error("first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a Promise")}function*_0(i,e){const t=new Sa(e);for(const n of i)yield t.pack(n)}async function*x0(i,e){const t=new Sa(e);for await(const n of i)yield t.pack(n)}function y0(i,e={}){if(!i||typeof i!="object")throw new Error("first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a promise");const t=new es(e);let n;const s=r=>{let a;n&&(r=Buffer.concat([n,r]),n=void 0);try{a=t.unpackMultiple(r)}catch(o){if(o.incomplete)n=r.slice(o.lastPosition),a=o.values;else throw o}return a};if(typeof i[Symbol.iterator]=="function")return(function*(){for(const a of i)yield*s(a)})();if(typeof i[Symbol.asyncIterator]=="function")return(async function*(){for await(const a of i)yield*s(a)})()}const b0=y0,S0=v0,w0=!1,M0=!0,E0=Object.freeze(Object.defineProperty({__proto__:null,ALWAYS:p0,C1:Eh,DECIMAL_FIT:g0,DECIMAL_ROUND:m0,Decoder:Zg,Encoder:d0,FLOAT32_OPTIONS:Sp,NEVER:f0,Packr:Sa,RESERVE_START_SPACE:Rp,RESET_BUFFER_MODE:Ap,REUSE_BUFFER_MODE:Tp,Unpackr:es,addExtension:l0,clearSource:Lo,decode:t0,decodeIter:b0,encode:u0,encodeIter:S0,isNativeAccelerationEnabled:qg,mapsAsObjects:M0,pack:h0,roundFloat32:n0,unpack:Qg,unpackMultiple:e0,useRecords:w0},Symbol.toStringTag,{value:"Module"})),T0=Sh(E0);var ju;function Pp(){if(ju)return hl;ju=1;var i=zg(),e=hp(),t=up(),n=dp(),s=Hg(),r=Mh(),a=fp(),o=qo(),c=T0;let l=class Cp{constructor(h,f){this.onStateChange=s.createSignal(),this.onError=s.createSignal(),this.onLeave=s.createSignal(),this.onJoin=s.createSignal(),this.hasJoined=!1,this.onMessageHandlers=n.createNanoEvents(),this.roomId=null,this.name=h,this.packr=new c.Packr,this.packr.encode(void 0),f&&(this.serializer=new(t.getSerializer("schema")),this.rootSchema=f,this.serializer.state=new f),this.onError((p,_)=>{var y;return(y=console.warn)===null||y===void 0?void 0:y.call(console,`colyseus.js - onError => (${p}) ${_}`)}),this.onLeave(()=>this.removeAllListeners())}connect(h,f,p=this,_,y){const x=new i.Connection(_.protocol);if(p.connection=x,x.events.onmessage=Cp.prototype.onMessageCallback.bind(p),x.events.onclose=function(g){var T;if(!p.hasJoined){(T=console.warn)===null||T===void 0||T.call(console,`Room connection was closed unexpectedly (${g.code}): ${g.reason}`),p.onError.invoke(g.code,g.reason);return}g.code===o.CloseCode.DEVMODE_RESTART&&f?f():(p.onLeave.invoke(g.code,g.reason),p.destroy())},x.events.onerror=function(g){var T;(T=console.warn)===null||T===void 0||T.call(console,`Room, onError (${g.code}): ${g.reason}`),p.onError.invoke(g.code,g.reason)},_.protocol==="h3"){const g=new URL(h);x.connect(g.origin,_)}else x.connect(h,y)}leave(h=!0){return new Promise(f=>{this.onLeave(p=>f(p)),this.connection?h?(this.packr.buffer[0]=e.Protocol.LEAVE_ROOM,this.connection.send(this.packr.buffer.subarray(0,1))):this.connection.close():this.onLeave.invoke(o.CloseCode.CONSENTED)})}onMessage(h,f){return this.onMessageHandlers.on(this.getMessageHandlerKey(h),f)}send(h,f){const p={offset:1};this.packr.buffer[0]=e.Protocol.ROOM_DATA,typeof h=="string"?r.encode.string(this.packr.buffer,h,p):r.encode.number(this.packr.buffer,h,p),this.packr.position=0;const _=f!==void 0?this.packr.pack(f,2048+p.offset):this.packr.buffer.subarray(0,p.offset);this.connection.send(_)}sendUnreliable(h,f){const p={offset:1};this.packr.buffer[0]=e.Protocol.ROOM_DATA,typeof h=="string"?r.encode.string(this.packr.buffer,h,p):r.encode.number(this.packr.buffer,h,p),this.packr.position=0;const _=f!==void 0?this.packr.pack(f,2048+p.offset):this.packr.buffer.subarray(0,p.offset);this.connection.sendUnreliable(_)}sendBytes(h,f){const p={offset:1};if(this.packr.buffer[0]=e.Protocol.ROOM_DATA_BYTES,typeof h=="string"?r.encode.string(this.packr.buffer,h,p):r.encode.number(this.packr.buffer,h,p),f.byteLength+p.offset>this.packr.buffer.byteLength){const _=new Uint8Array(p.offset+f.byteLength);_.set(this.packr.buffer),this.packr.useBuffer(_)}this.packr.buffer.set(f,p.offset),this.connection.send(this.packr.buffer.subarray(0,p.offset+f.byteLength))}get state(){return this.serializer.getState()}removeAllListeners(){this.onJoin.clear(),this.onStateChange.clear(),this.onError.clear(),this.onLeave.clear(),this.onMessageHandlers.events={},this.serializer instanceof a.SchemaSerializer&&(this.serializer.decoder.root.callbacks={})}onMessageCallback(h){const f=new Uint8Array(h.data),p={offset:1},_=f[0];if(_===e.Protocol.JOIN_ROOM){const y=r.decode.utf8Read(f,p,f[p.offset++]);if(this.serializerId=r.decode.utf8Read(f,p,f[p.offset++]),!this.serializer){const x=t.getSerializer(this.serializerId);this.serializer=new x}f.byteLength>p.offset&&this.serializer.handshake&&this.serializer.handshake(f,p),this.reconnectionToken=`${this.roomId}:${y}`,this.hasJoined=!0,this.onJoin.invoke(),this.packr.buffer[0]=e.Protocol.JOIN_ROOM,this.connection.send(this.packr.buffer.subarray(0,1))}else if(_===e.Protocol.ERROR){const y=r.decode.number(f,p),x=r.decode.string(f,p);this.onError.invoke(y,x)}else if(_===e.Protocol.LEAVE_ROOM)this.leave();else if(_===e.Protocol.ROOM_STATE)this.serializer.setState(f,p),this.onStateChange.invoke(this.serializer.getState());else if(_===e.Protocol.ROOM_STATE_PATCH)this.serializer.patch(f,p),this.onStateChange.invoke(this.serializer.getState());else if(_===e.Protocol.ROOM_DATA){const y=r.decode.stringCheck(f,p)?r.decode.string(f,p):r.decode.number(f,p),x=f.byteLength>p.offset?c.unpack(f,{start:p.offset}):void 0;this.dispatchMessage(y,x)}else if(_===e.Protocol.ROOM_DATA_BYTES){const y=r.decode.stringCheck(f,p)?r.decode.string(f,p):r.decode.number(f,p);this.dispatchMessage(y,f.subarray(p.offset))}}dispatchMessage(h,f){var p;const _=this.getMessageHandlerKey(h);this.onMessageHandlers.events[_]?this.onMessageHandlers.emit(_,f):this.onMessageHandlers.events["*"]?this.onMessageHandlers.emit("*",h,f):(p=console.warn)===null||p===void 0||p.call(console,`colyseus.js: onMessage() not registered for type '${h}'.`)}destroy(){this.serializer&&this.serializer.teardown()}getMessageHandlerKey(h){switch(typeof h){case"string":return h;case"number":return`i${h}`;default:throw new Error("invalid message type.")}}};return hl.Room=l,hl}var _l={};function Yu(i,e){e.headers=i.headers||{},e.statusMessage=i.statusText,e.statusCode=i.status,e.data=i.response}function ei(i,e,t){return new Promise(function(n,s){t=t||{};var r=new XMLHttpRequest,a,o,c,l=t.body,d=t.headers||{};t.timeout&&(r.timeout=t.timeout),r.ontimeout=r.onerror=function(h){h.timeout=h.type=="timeout",s(h)},r.onabort=function(h){h.aborted=!0,s(h)},r.open(i,e.href||e),r.onload=function(){for(c=r.getAllResponseHeaders().trim().split(/[\r\n]+/),Yu(r,r);o=c.shift();)o=o.split(": "),r.headers[o.shift().toLowerCase()]=o.join(": ");if(o=r.headers["content-type"],o&&~o.indexOf("application/json"))try{r.data=JSON.parse(r.data,t.reviver)}catch(h){return Yu(r,h),s(h)}(r.status>=400?s:n)(r)},typeof FormData<"u"&&l instanceof FormData||l&&typeof l=="object"&&(d["content-type"]="application/json",l=JSON.stringify(l)),r.withCredentials=!!t.withCredentials;for(a in d)r.setRequestHeader(a,d[a]);r.send(l),t.signal&&t.signal.addEventListener("abort",function(){r.abort()})})}var A0=ei.bind(ei,"GET"),R0=ei.bind(ei,"POST"),C0=ei.bind(ei,"PATCH"),P0=ei.bind(ei,"DELETE"),I0=ei.bind(ei,"PUT");const D0=Object.freeze(Object.defineProperty({__proto__:null,del:P0,get:A0,patch:C0,post:R0,put:I0,send:ei},Symbol.toStringTag,{value:"Module"})),L0=Sh(D0);var Ku;function k0(){if(Ku)return _l;Ku=1;var i=qo(),e=L0;function t(r){var a=Object.create(null);return r&&Object.keys(r).forEach(function(o){if(o!=="default"){var c=Object.getOwnPropertyDescriptor(r,o);Object.defineProperty(a,o,c.get?c:{enumerable:!0,get:function(){return r[o]}})}}),a.default=r,Object.freeze(a)}var n=t(e);let s=class{constructor(a,o={}){this.client=a,this.headers=o}get(a,o={}){return this.request("get",a,o)}post(a,o={}){return this.request("post",a,o)}del(a,o={}){return this.request("del",a,o)}put(a,o={}){return this.request("put",a,o)}request(a,o,c={}){return n[a](this.client.getHttpEndpoint(o),this.getOptions(c)).catch(l=>{var d;if(l.aborted)throw new i.AbortError("Request aborted");const h=l.statusCode,f=((d=l.data)===null||d===void 0?void 0:d.error)||l.statusMessage||l.message;throw!h&&!f?l:new i.ServerError(h,f)})}getOptions(a){return a.headers=Object.assign({},this.headers,a.headers),this.authToken&&(a.headers.Authorization=`Bearer ${this.authToken}`),typeof cc<"u"&&cc.sys&&cc.sys.isNative||(a.withCredentials=!0),a}};return _l.HTTP=s,_l}var xl={},Ur={},Ju;function O0(){if(Ju)return Ur;Ju=1;var i=Xo;let e;function t(){if(!e)try{e=typeof cc<"u"&&cc.sys&&cc.sys.localStorage?cc.sys.localStorage:window.localStorage}catch{}return!e&&typeof globalThis.indexedDB<"u"&&(e=new a),e||(e={cache:{},setItem:function(o,c){this.cache[o]=c},getItem:function(o){this.cache[o]},removeItem:function(o){delete this.cache[o]}}),e}function n(o,c){t().setItem(o,c)}function s(o){t().removeItem(o)}function r(o,c){const l=t().getItem(o);typeof Promise>"u"||!(l instanceof Promise)?c(l):l.then(d=>c(d))}class a{constructor(){this.dbPromise=new Promise(c=>{const l=indexedDB.open("_colyseus_storage",1);l.onupgradeneeded=()=>l.result.createObjectStore("store"),l.onsuccess=()=>c(l.result)})}tx(c,l){return i.__awaiter(this,void 0,void 0,function*(){const h=(yield this.dbPromise).transaction("store",c).objectStore("store");return l(h)})}setItem(c,l){return this.tx("readwrite",d=>d.put(l,c)).then()}getItem(c){return i.__awaiter(this,void 0,void 0,function*(){const l=yield this.tx("readonly",d=>d.get(c));return new Promise(d=>{l.onsuccess=()=>d(l.result)})})}removeItem(c){return this.tx("readwrite",l=>l.delete(c)).then()}}return Ur.getItem=r,Ur.removeItem=s,Ur.setItem=n,Ur}var Zu;function Ip(){if(Zu)return xl;Zu=1;var i=Xo,e=O0(),t=dp(),n,s,r,a;let o=class{constructor(l){this.http=l,this.settings={path:"/auth",key:"colyseus-auth-token"},n.set(this,!1),s.set(this,void 0),r.set(this,void 0),a.set(this,t.createNanoEvents()),e.getItem(this.settings.key,d=>this.token=d)}set token(l){this.http.authToken=l}get token(){return this.http.authToken}onChange(l){const d=i.__classPrivateFieldGet(this,a,"f").on("change",l);return i.__classPrivateFieldGet(this,n,"f")||i.__classPrivateFieldSet(this,s,new Promise((h,f)=>{this.getUserData().then(p=>{this.emitChange(Object.assign(Object.assign({},p),{token:this.token}))}).catch(p=>{this.emitChange({user:null,token:void 0})}).finally(()=>{h()})}),"f"),i.__classPrivateFieldSet(this,n,!0,"f"),d}getUserData(){return i.__awaiter(this,void 0,void 0,function*(){if(this.token)return(yield this.http.get(`${this.settings.path}/userdata`)).data;throw new Error("missing auth.token")})}registerWithEmailAndPassword(l,d,h){return i.__awaiter(this,void 0,void 0,function*(){const f=(yield this.http.post(`${this.settings.path}/register`,{body:{email:l,password:d,options:h}})).data;return this.emitChange(f),f})}signInWithEmailAndPassword(l,d){return i.__awaiter(this,void 0,void 0,function*(){const h=(yield this.http.post(`${this.settings.path}/login`,{body:{email:l,password:d}})).data;return this.emitChange(h),h})}signInAnonymously(l){return i.__awaiter(this,void 0,void 0,function*(){const d=(yield this.http.post(`${this.settings.path}/anonymous`,{body:{options:l}})).data;return this.emitChange(d),d})}sendPasswordResetEmail(l){return i.__awaiter(this,void 0,void 0,function*(){return(yield this.http.post(`${this.settings.path}/forgot-password`,{body:{email:l}})).data})}signInWithProvider(l){return i.__awaiter(this,arguments,void 0,function*(d,h={}){return new Promise((f,p)=>{const _=h.width||480,y=h.height||768,x=this.token?`?token=${this.token}`:"",g=`Login with ${d[0].toUpperCase()+d.substring(1)}`,T=this.http.client.getHttpEndpoint(`${h.prefix||`${this.settings.path}/provider`}/${d}${x}`),A=screen.width/2-_/2,S=screen.height/2-y/2;i.__classPrivateFieldSet(this,r,window.open(T,g,"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width="+_+", height="+y+", top="+S+", left="+A),"f");const O=U=>{U.data.user===void 0&&U.data.token===void 0||(clearInterval(k),i.__classPrivateFieldGet(this,r,"f").close(),i.__classPrivateFieldSet(this,r,void 0,"f"),window.removeEventListener("message",O),U.data.error!==void 0?p(U.data.error):(f(U.data),this.emitChange(U.data)))},k=setInterval(()=>{(!i.__classPrivateFieldGet(this,r,"f")||i.__classPrivateFieldGet(this,r,"f").closed)&&(i.__classPrivateFieldSet(this,r,void 0,"f"),p("cancelled"),window.removeEventListener("message",O))},200);window.addEventListener("message",O)})})}signOut(){return i.__awaiter(this,void 0,void 0,function*(){this.emitChange({user:null,token:null})})}emitChange(l){l.token!==void 0&&(this.token=l.token,l.token===null?e.removeItem(this.settings.key):e.setItem(this.settings.key,l.token)),i.__classPrivateFieldGet(this,a,"f").emit("change",l)}};return n=new WeakMap,s=new WeakMap,r=new WeakMap,a=new WeakMap,xl.Auth=o,xl}var yl={},Qu;function U0(){if(Qu)return yl;Qu=1;function i(e){var t;const n=((t=window==null?void 0:window.location)===null||t===void 0?void 0:t.hostname)||"localhost",s=e.hostname.split("."),r=!e.hostname.includes("trycloudflare.com")&&!e.hostname.includes("discordsays.com")&&s.length>2?`/${s[0]}`:"";return e.pathname.startsWith("/.proxy")?`${e.protocol}//${n}${r}${e.pathname}${e.search}`:`${e.protocol}//${n}/.proxy/colyseus${r}${e.pathname}${e.search}`}return yl.discordURLBuilder=i,yl}var ed;function N0(){if(ed)return ka;ed=1;var i=Xo,e=qo(),t=Pp(),n=k0(),s=Ip(),r=U0(),a;class o extends Error{constructor(h,f){super(h),this.code=f,this.name="MatchMakeError",Object.setPrototypeOf(this,o.prototype)}}const c=typeof window<"u"&&typeof((a=window==null?void 0:window.location)===null||a===void 0?void 0:a.hostname)<"u"?`${window.location.protocol.replace("http","ws")}//${window.location.hostname}${window.location.port&&`:${window.location.port}`}`:"ws://127.0.0.1:2567";let l=class{constructor(h=c,f){var p,_;if(typeof h=="string"){const y=h.startsWith("/")?new URL(h,c):new URL(h),x=y.protocol==="https:"||y.protocol==="wss:",g=Number(y.port||(x?443:80));this.settings={hostname:y.hostname,pathname:y.pathname,port:g,secure:x,searchParams:y.searchParams.toString()||void 0}}else h.port===void 0&&(h.port=h.secure?443:80),h.pathname===void 0&&(h.pathname=""),this.settings=h;this.settings.pathname.endsWith("/")&&(this.settings.pathname=this.settings.pathname.slice(0,-1)),this.http=new n.HTTP(this,(f==null?void 0:f.headers)||{}),this.auth=new s.Auth(this.http),this.urlBuilder=f==null?void 0:f.urlBuilder,!this.urlBuilder&&typeof window<"u"&&(!((_=(p=window==null?void 0:window.location)===null||p===void 0?void 0:p.hostname)===null||_===void 0)&&_.includes("discordsays.com"))&&(this.urlBuilder=r.discordURLBuilder,console.log("Colyseus SDK: Discord Embedded SDK detected. Using custom URL builder."))}joinOrCreate(h){return i.__awaiter(this,arguments,void 0,function*(f,p={},_){return yield this.createMatchMakeRequest("joinOrCreate",f,p,_)})}create(h){return i.__awaiter(this,arguments,void 0,function*(f,p={},_){return yield this.createMatchMakeRequest("create",f,p,_)})}join(h){return i.__awaiter(this,arguments,void 0,function*(f,p={},_){return yield this.createMatchMakeRequest("join",f,p,_)})}joinById(h){return i.__awaiter(this,arguments,void 0,function*(f,p={},_){return yield this.createMatchMakeRequest("joinById",f,p,_)})}reconnect(h,f){return i.__awaiter(this,void 0,void 0,function*(){if(typeof h=="string"&&typeof f=="string")throw new Error("DEPRECATED: .reconnect() now only accepts 'reconnectionToken' as argument.\nYou can get this token from previously connected `room.reconnectionToken`");const[p,_]=h.split(":");if(!p||!_)throw new Error(`Invalid reconnection token format.
The format should be roomId:reconnectionToken`);return yield this.createMatchMakeRequest("reconnect",p,{reconnectionToken:_},f)})}consumeSeatReservation(h,f,p){return i.__awaiter(this,void 0,void 0,function*(){const _=this.createRoom(h.room.name,f);_.roomId=h.room.roomId,_.sessionId=h.sessionId;const y={sessionId:_.sessionId};h.reconnectionToken&&(y.reconnectionToken=h.reconnectionToken);const x=p||_;return _.connect(this.buildEndpoint(h.room,y,h.protocol),h.devMode&&(()=>i.__awaiter(this,void 0,void 0,function*(){console.info(`[Colyseus devMode]: ${String.fromCodePoint(128260)} Re-establishing connection with room id '${_.roomId}'...`);let g=0,T=8;const A=()=>i.__awaiter(this,void 0,void 0,function*(){g++;try{yield this.consumeSeatReservation(h,f,x),console.info(`[Colyseus devMode]: ${String.fromCodePoint(9989)} Successfully re-established connection with room '${_.roomId}'`)}catch{g<T?(console.info(`[Colyseus devMode]: ${String.fromCodePoint(128260)} retrying... (${g} out of ${T})`),setTimeout(A,2e3)):console.info(`[Colyseus devMode]: ${String.fromCodePoint(10060)} Failed to reconnect. Is your server running? Please check server logs.`)}});setTimeout(A,2e3)})),x,h,this.http.headers),new Promise((g,T)=>{const A=(S,O)=>T(new e.ServerError(S,O));x.onError.once(A),x.onJoin.once(()=>{x.onError.remove(A),g(x)})})})}createMatchMakeRequest(h,f){return i.__awaiter(this,arguments,void 0,function*(p,_,y={},x,g){const T=(yield this.http.post(`matchmake/${p}/${_}`,{headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(y)})).data;if(T.error)throw new o(T.error,T.code);return p==="reconnect"&&(T.reconnectionToken=y.reconnectionToken),yield this.consumeSeatReservation(T,x,g)})}createRoom(h,f){return new t.Room(h,f)}buildEndpoint(h,f={},p="ws"){let _=this.settings.searchParams||"";this.http.authToken&&(f._authToken=this.http.authToken);for(const g in f)f.hasOwnProperty(g)&&(_+=(_?"&":"")+`${g}=${f[g]}`);p==="h3"&&(p="http");let y=this.settings.secure?`${p}s://`:`${p}://`;h.publicAddress?y+=`${h.publicAddress}`:y+=`${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}`;const x=`${y}/${h.processId}/${h.roomId}?${_}`;return this.urlBuilder?this.urlBuilder(new URL(x)):x}getHttpEndpoint(h=""){const f=h.startsWith("/")?h:`/${h}`;let p=`${this.settings.secure?"https":"http"}://${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}${f}`;return this.settings.searchParams&&(p+=`?${this.settings.searchParams}`),this.urlBuilder?this.urlBuilder(new URL(p)):p}getEndpointPort(){return this.settings.port!==80&&this.settings.port!==443?`:${this.settings.port}`:""}};return l.VERSION="0.16.22",ka.Client=l,ka.MatchMakeError=o,ka}var bl={},td;function F0(){if(td)return bl;td=1;let i=class{setState(t){}getState(){return null}patch(t){}teardown(){}handshake(t){}};return bl.NoneSerializer=i,bl}var nd;function B0(){return nd||(nd=1,(function(i){Ig();var e=N0(),t=hp(),n=Pp(),s=Ip(),r=qo(),a=fp(),o=F0(),c=up();c.registerSerializer("schema",a.SchemaSerializer),c.registerSerializer("none",o.NoneSerializer),i.Client=e.Client,i.MatchMakeError=e.MatchMakeError,Object.defineProperty(i,"ErrorCode",{enumerable:!0,get:function(){return t.ErrorCode}}),Object.defineProperty(i,"Protocol",{enumerable:!0,get:function(){return t.Protocol}}),i.Room=n.Room,i.Auth=s.Auth,i.ServerError=r.ServerError,i.SchemaSerializer=a.SchemaSerializer,i.getStateCallbacks=a.getStateCallbacks,i.registerSerializer=c.registerSerializer})(ll)),ll}var Dp=B0();const z0=!0,gc="oom-server",H0=z0;function Lp(i){let e=i.trim();if(!e)return null;/^[a-z]+:\/\//i.test(e)||(e=`${/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[::1\])/i.test(e)?"http":"https"}://${e}`);let t;try{t=new URL(e)}catch{return null}return!["http:","https:","ws:","wss:"].includes(t.protocol)||!t.hostname?null:`${t.protocol}//${t.host}${t.pathname.replace(/\/+$/,"")}`}function V0(i){const e=new URL(i),t=e.protocol==="http:"||e.protocol==="ws:",n=["localhost","127.0.0.1","[::1]"].includes(e.hostname);return location.protocol==="https:"&&t&&!n?"This page is served over https, so browsers only allow https:// (or wss://) servers, apart from localhost.":null}function G0(){try{return localStorage.getItem(gc)}catch{return null}}function kp(i){try{i?localStorage.setItem(gc,i):localStorage.removeItem(gc)}catch{}}let Cs=null;{const i=new URLSearchParams(location.search);if(i.has("serverUrl")){const e=Lp(i.get("serverUrl")??"");e&&kp(e),i.delete("serverUrl");const t=i.toString();history.replaceState(null,"",`${location.pathname}${t?`?${t}`:""}${location.hash}`)}Cs=G0()??null}let Op=Cs?new Dp.Client(Cs):null;function vc(){return Op}function _c(){return Cs}function id(i){Cs=i,kp(i),Op=i?new Dp.Client(i):null}function sd(){const i=new URL(location.href);return i.hash="",i.search="",Cs&&i.searchParams.set("serverUrl",Cs),i.toString()}async function rd(i){const e=i.replace(/^ws/,"http"),t=new AbortController,n=setTimeout(()=>t.abort(),6e3);try{return await fetch(`${e}/health`,{mode:"no-cors",cache:"no-store",signal:t.signal}),!0}catch{return!1}finally{clearTimeout(n)}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ch="180",$0=0,ad=1,W0=2,Up=1,Np=2,Ei=3,ts=0,Rn=1,On=2,Ii=0,pr=1,_r=2,od=3,ld=4,X0=5,ys=100,q0=101,j0=102,Y0=103,K0=104,J0=200,Z0=201,Q0=202,ev=203,xc=204,yc=205,tv=206,nv=207,iv=208,sv=209,rv=210,av=211,ov=212,lv=213,cv=214,bc=0,Sc=1,wc=2,xr=3,Mc=4,Ec=5,Tc=6,Ac=7,Fp=0,hv=1,uv=2,Qi=0,Bp=1,zp=2,Hp=3,Ph=4,Vp=5,Gp=6,$p=7,Wp=300,yr=301,br=302,Rc=303,Cc=304,Jo=306,Pc=1e3,ws=1001,Ic=1002,Jn=1003,dv=1004,za=1005,hi=1006,Sl=1007,Ms=1008,fi=1009,Xp=1010,qp=1011,ha=1012,Ih=1013,Ps=1014,Ai=1015,Di=1016,Dh=1017,Lh=1018,ua=1020,jp=35902,Yp=35899,Kp=1021,Jp=1022,Kn=1023,da=1026,fa=1027,Zp=1028,kh=1029,Qp=1030,Oh=1031,Uh=1033,yo=33776,bo=33777,So=33778,wo=33779,Dc=35840,Lc=35841,kc=35842,Oc=35843,Uc=36196,Nc=37492,Fc=37496,Bc=37808,zc=37809,Hc=37810,Vc=37811,Gc=37812,$c=37813,Wc=37814,Xc=37815,qc=37816,jc=37817,Yc=37818,Kc=37819,Jc=37820,Zc=37821,Qc=36492,eh=36494,th=36495,nh=36283,ih=36284,sh=36285,rh=36286,fv=3200,pv=3201,em=0,mv=1,Xi="",un="srgb",Sr="srgb-linear",Oo="linear",It="srgb",Vs=7680,cd=519,gv=512,vv=513,_v=514,tm=515,xv=516,yv=517,bv=518,Sv=519,ah=35044,hd="300 es",ui=2e3,Uo=2001;class Er{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const pn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ud=1234567;const ea=Math.PI/180,pa=180/Math.PI;function Li(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(pn[i&255]+pn[i>>8&255]+pn[i>>16&255]+pn[i>>24&255]+"-"+pn[e&255]+pn[e>>8&255]+"-"+pn[e>>16&15|64]+pn[e>>24&255]+"-"+pn[t&63|128]+pn[t>>8&255]+"-"+pn[t>>16&255]+pn[t>>24&255]+pn[n&255]+pn[n>>8&255]+pn[n>>16&255]+pn[n>>24&255]).toLowerCase()}function ft(i,e,t){return Math.max(e,Math.min(t,i))}function Nh(i,e){return(i%e+e)%e}function wv(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Mv(i,e,t){return i!==e?(t-i)/(e-i):0}function ta(i,e,t){return(1-t)*i+t*e}function Ev(i,e,t,n){return ta(i,e,1-Math.exp(-t*n))}function Tv(i,e=1){return e-Math.abs(Nh(i,e*2)-e)}function Av(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Rv(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Cv(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Pv(i,e){return i+Math.random()*(e-i)}function Iv(i){return i*(.5-Math.random())}function Dv(i){i!==void 0&&(ud=i);let e=ud+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Lv(i){return i*ea}function kv(i){return i*pa}function Ov(i){return(i&i-1)===0&&i!==0}function Uv(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Nv(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Fv(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),d=a((e+n)/2),h=r((e-n)/2),f=a((e-n)/2),p=r((n-e)/2),_=a((n-e)/2);switch(s){case"XYX":i.set(o*d,c*h,c*f,o*l);break;case"YZY":i.set(c*f,o*d,c*h,o*l);break;case"ZXZ":i.set(c*h,c*f,o*d,o*l);break;case"XZX":i.set(o*d,c*_,c*p,o*l);break;case"YXY":i.set(c*p,o*d,c*_,o*l);break;case"ZYZ":i.set(c*_,c*p,o*d,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Yn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Dt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Bv={DEG2RAD:ea,RAD2DEG:pa,generateUUID:Li,clamp:ft,euclideanModulo:Nh,mapLinear:wv,inverseLerp:Mv,lerp:ta,damp:Ev,pingpong:Tv,smoothstep:Av,smootherstep:Rv,randInt:Cv,randFloat:Pv,randFloatSpread:Iv,seededRandom:Dv,degToRad:Lv,radToDeg:kv,isPowerOfTwo:Ov,ceilPowerOfTwo:Uv,floorPowerOfTwo:Nv,setQuaternionFromProperEuler:Fv,normalize:Dt,denormalize:Yn};class Te{constructor(e=0,t=0){Te.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class wa{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],h=n[s+3];const f=r[a+0],p=r[a+1],_=r[a+2],y=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=d,e[t+3]=h;return}if(o===1){e[t+0]=f,e[t+1]=p,e[t+2]=_,e[t+3]=y;return}if(h!==y||c!==f||l!==p||d!==_){let x=1-o;const g=c*f+l*p+d*_+h*y,T=g>=0?1:-1,A=1-g*g;if(A>Number.EPSILON){const O=Math.sqrt(A),k=Math.atan2(O,g*T);x=Math.sin(x*k)/O,o=Math.sin(o*k)/O}const S=o*T;if(c=c*x+f*S,l=l*x+p*S,d=d*x+_*S,h=h*x+y*S,x===1-o){const O=1/Math.sqrt(c*c+l*l+d*d+h*h);c*=O,l*=O,d*=O,h*=O}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],h=r[a],f=r[a+1],p=r[a+2],_=r[a+3];return e[t]=o*_+d*h+c*p-l*f,e[t+1]=c*_+d*f+l*h-o*p,e[t+2]=l*_+d*p+o*f-c*h,e[t+3]=d*_-o*h-c*f-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),h=o(r/2),f=c(n/2),p=c(s/2),_=c(r/2);switch(a){case"XYZ":this._x=f*d*h+l*p*_,this._y=l*p*h-f*d*_,this._z=l*d*_+f*p*h,this._w=l*d*h-f*p*_;break;case"YXZ":this._x=f*d*h+l*p*_,this._y=l*p*h-f*d*_,this._z=l*d*_-f*p*h,this._w=l*d*h+f*p*_;break;case"ZXY":this._x=f*d*h-l*p*_,this._y=l*p*h+f*d*_,this._z=l*d*_+f*p*h,this._w=l*d*h-f*p*_;break;case"ZYX":this._x=f*d*h-l*p*_,this._y=l*p*h+f*d*_,this._z=l*d*_-f*p*h,this._w=l*d*h+f*p*_;break;case"YZX":this._x=f*d*h+l*p*_,this._y=l*p*h+f*d*_,this._z=l*d*_-f*p*h,this._w=l*d*h-f*p*_;break;case"XZY":this._x=f*d*h-l*p*_,this._y=l*p*h-f*d*_,this._z=l*d*_+f*p*h,this._w=l*d*h+f*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],d=t[6],h=t[10],f=n+o+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>h){const p=2*Math.sqrt(1+n-o-h);this._w=(d-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>h){const p=2*Math.sqrt(1+o-n-h);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+h-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,d=t._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,o),h=Math.sin((1-t)*d)/l,f=Math.sin(t*d)/l;return this._w=a*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,t=0,n=0){N.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(dd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(dd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),d=2*(o*t-r*s),h=2*(r*n-a*t);return this.x=t+c*l+a*h-o*d,this.y=n+c*d+o*l-r*h,this.z=s+c*h+r*d-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return wl.copy(this).projectOnVector(e),this.sub(wl)}reflect(e){return this.sub(wl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const wl=new N,dd=new wa;class lt{constructor(e,t,n,s,r,a,o,c,l){lt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],h=n[7],f=n[2],p=n[5],_=n[8],y=s[0],x=s[3],g=s[6],T=s[1],A=s[4],S=s[7],O=s[2],k=s[5],U=s[8];return r[0]=a*y+o*T+c*O,r[3]=a*x+o*A+c*k,r[6]=a*g+o*S+c*U,r[1]=l*y+d*T+h*O,r[4]=l*x+d*A+h*k,r[7]=l*g+d*S+h*U,r[2]=f*y+p*T+_*O,r[5]=f*x+p*A+_*k,r[8]=f*g+p*S+_*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8];return t*a*d-t*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],h=d*a-o*l,f=o*c-d*r,p=l*r-a*c,_=t*h+n*f+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/_;return e[0]=h*y,e[1]=(s*l-d*n)*y,e[2]=(o*n-s*a)*y,e[3]=f*y,e[4]=(d*t-s*c)*y,e[5]=(s*r-o*t)*y,e[6]=p*y,e[7]=(n*c-l*t)*y,e[8]=(a*t-n*r)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ml.makeScale(e,t)),this}rotate(e){return this.premultiply(Ml.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ml.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ml=new lt;function nm(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function No(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function zv(){const i=No("canvas");return i.style.display="block",i}const fd={};function ma(i){i in fd||(fd[i]=!0,console.warn(i))}function Hv(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const pd=new lt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),md=new lt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Vv(){const i={enabled:!0,workingColorSpace:Sr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===It&&(s.r=ki(s.r),s.g=ki(s.g),s.b=ki(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===It&&(s.r=mr(s.r),s.g=mr(s.g),s.b=mr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Xi?Oo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ma("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ma("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Sr]:{primaries:e,whitePoint:n,transfer:Oo,toXYZ:pd,fromXYZ:md,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:un},outputColorSpaceConfig:{drawingBufferColorSpace:un}},[un]:{primaries:e,whitePoint:n,transfer:It,toXYZ:pd,fromXYZ:md,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:un}}}),i}const St=Vv();function ki(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function mr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Gs;class Gv{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Gs===void 0&&(Gs=No("canvas")),Gs.width=e.width,Gs.height=e.height;const s=Gs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Gs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=No("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ki(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ki(t[n]/255)*255):t[n]=ki(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let $v=0;class Fh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$v++}),this.uuid=Li(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(El(s[a].image)):r.push(El(s[a]))}else r=El(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function El(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Gv.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Wv=0;const Tl=new N;class Mn extends Er{constructor(e=Mn.DEFAULT_IMAGE,t=Mn.DEFAULT_MAPPING,n=ws,s=ws,r=hi,a=Ms,o=Kn,c=fi,l=Mn.DEFAULT_ANISOTROPY,d=Xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wv++}),this.uuid=Li(),this.name="",this.source=new Fh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new lt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Tl).x}get height(){return this.source.getSize(Tl).y}get depth(){return this.source.getSize(Tl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Wp)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Pc:e.x=e.x-Math.floor(e.x);break;case ws:e.x=e.x<0?0:1;break;case Ic:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Pc:e.y=e.y-Math.floor(e.y);break;case ws:e.y=e.y<0?0:1;break;case Ic:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Mn.DEFAULT_IMAGE=null;Mn.DEFAULT_MAPPING=Wp;Mn.DEFAULT_ANISOTROPY=1;class Ot{constructor(e=0,t=0,n=0,s=1){Ot.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],d=c[4],h=c[8],f=c[1],p=c[5],_=c[9],y=c[2],x=c[6],g=c[10];if(Math.abs(d-f)<.01&&Math.abs(h-y)<.01&&Math.abs(_-x)<.01){if(Math.abs(d+f)<.1&&Math.abs(h+y)<.1&&Math.abs(_+x)<.1&&Math.abs(l+p+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(l+1)/2,S=(p+1)/2,O=(g+1)/2,k=(d+f)/4,U=(h+y)/4,P=(_+x)/4;return A>S&&A>O?A<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(A),s=k/n,r=U/n):S>O?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=k/s,r=P/s):O<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(O),n=U/r,s=P/r),this.set(n,s,r,t),this}let T=Math.sqrt((x-_)*(x-_)+(h-y)*(h-y)+(f-d)*(f-d));return Math.abs(T)<.001&&(T=1),this.x=(x-_)/T,this.y=(h-y)/T,this.z=(f-d)/T,this.w=Math.acos((l+p+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this.w=ft(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this.w=ft(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xv extends Er{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:hi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ot(0,0,e,t),this.scissorTest=!1,this.viewport=new Ot(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new Mn(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:hi,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Fh(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zn extends Xv{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class im extends Mn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=ws,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class qv extends Mn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=ws,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ma{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Xn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Xn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Xn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Xn):Xn.fromBufferAttribute(r,a),Xn.applyMatrix4(e.matrixWorld),this.expandByPoint(Xn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ha.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ha.copy(n.boundingBox)),Ha.applyMatrix4(e.matrixWorld),this.union(Ha)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Xn),Xn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Nr),Va.subVectors(this.max,Nr),$s.subVectors(e.a,Nr),Ws.subVectors(e.b,Nr),Xs.subVectors(e.c,Nr),Ni.subVectors(Ws,$s),Fi.subVectors(Xs,Ws),cs.subVectors($s,Xs);let t=[0,-Ni.z,Ni.y,0,-Fi.z,Fi.y,0,-cs.z,cs.y,Ni.z,0,-Ni.x,Fi.z,0,-Fi.x,cs.z,0,-cs.x,-Ni.y,Ni.x,0,-Fi.y,Fi.x,0,-cs.y,cs.x,0];return!Al(t,$s,Ws,Xs,Va)||(t=[1,0,0,0,1,0,0,0,1],!Al(t,$s,Ws,Xs,Va))?!1:(Ga.crossVectors(Ni,Fi),t=[Ga.x,Ga.y,Ga.z],Al(t,$s,Ws,Xs,Va))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Xn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Xn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(yi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),yi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),yi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),yi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),yi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),yi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),yi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),yi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(yi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const yi=[new N,new N,new N,new N,new N,new N,new N,new N],Xn=new N,Ha=new Ma,$s=new N,Ws=new N,Xs=new N,Ni=new N,Fi=new N,cs=new N,Nr=new N,Va=new N,Ga=new N,hs=new N;function Al(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){hs.fromArray(i,r);const o=s.x*Math.abs(hs.x)+s.y*Math.abs(hs.y)+s.z*Math.abs(hs.z),c=e.dot(hs),l=t.dot(hs),d=n.dot(hs);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const jv=new Ma,Fr=new N,Rl=new N;class Zo{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):jv.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Fr.subVectors(e,this.center);const t=Fr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Fr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Rl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Fr.copy(e.center).add(Rl)),this.expandByPoint(Fr.copy(e.center).sub(Rl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const bi=new N,Cl=new N,$a=new N,Bi=new N,Pl=new N,Wa=new N,Il=new N;class Bh{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,bi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=bi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(bi.copy(this.origin).addScaledVector(this.direction,t),bi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Cl.copy(e).add(t).multiplyScalar(.5),$a.copy(t).sub(e).normalize(),Bi.copy(this.origin).sub(Cl);const r=e.distanceTo(t)*.5,a=-this.direction.dot($a),o=Bi.dot(this.direction),c=-Bi.dot($a),l=Bi.lengthSq(),d=Math.abs(1-a*a);let h,f,p,_;if(d>0)if(h=a*c-o,f=a*o-c,_=r*d,h>=0)if(f>=-_)if(f<=_){const y=1/d;h*=y,f*=y,p=h*(h+a*f+2*o)+f*(a*h+f+2*c)+l}else f=r,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*c)+l;else f<=-_?(h=Math.max(0,-(-a*r+o)),f=h>0?-r:Math.min(Math.max(-r,-c),r),p=-h*h+f*(f+2*c)+l):f<=_?(h=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(h=Math.max(0,-(a*r+o)),f=h>0?r:Math.min(Math.max(-r,-c),r),p=-h*h+f*(f+2*c)+l);else f=a>0?-r:r,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Cl).addScaledVector($a,f),p}intersectSphere(e,t){bi.subVectors(e.center,this.origin);const n=bi.dot(this.direction),s=bi.dot(bi)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),d>=0?(r=(e.min.y-f.y)*d,a=(e.max.y-f.y)*d):(r=(e.max.y-f.y)*d,a=(e.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-f.z)*h,c=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,c=(e.min.z-f.z)*h),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,bi)!==null}intersectTriangle(e,t,n,s,r){Pl.subVectors(t,e),Wa.subVectors(n,e),Il.crossVectors(Pl,Wa);let a=this.direction.dot(Il),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Bi.subVectors(this.origin,e);const c=o*this.direction.dot(Wa.crossVectors(Bi,Wa));if(c<0)return null;const l=o*this.direction.dot(Pl.cross(Bi));if(l<0||c+l>a)return null;const d=-o*Bi.dot(Il);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Gt{constructor(e,t,n,s,r,a,o,c,l,d,h,f,p,_,y,x){Gt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,d,h,f,p,_,y,x)}set(e,t,n,s,r,a,o,c,l,d,h,f,p,_,y,x){const g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=c,g[2]=l,g[6]=d,g[10]=h,g[14]=f,g[3]=p,g[7]=_,g[11]=y,g[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Gt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/qs.setFromMatrixColumn(e,0).length(),r=1/qs.setFromMatrixColumn(e,1).length(),a=1/qs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=a*d,p=a*h,_=o*d,y=o*h;t[0]=c*d,t[4]=-c*h,t[8]=l,t[1]=p+_*l,t[5]=f-y*l,t[9]=-o*c,t[2]=y-f*l,t[6]=_+p*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*d,p=c*h,_=l*d,y=l*h;t[0]=f+y*o,t[4]=_*o-p,t[8]=a*l,t[1]=a*h,t[5]=a*d,t[9]=-o,t[2]=p*o-_,t[6]=y+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*d,p=c*h,_=l*d,y=l*h;t[0]=f-y*o,t[4]=-a*h,t[8]=_+p*o,t[1]=p+_*o,t[5]=a*d,t[9]=y-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*d,p=a*h,_=o*d,y=o*h;t[0]=c*d,t[4]=_*l-p,t[8]=f*l+y,t[1]=c*h,t[5]=y*l+f,t[9]=p*l-_,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,p=a*l,_=o*c,y=o*l;t[0]=c*d,t[4]=y-f*h,t[8]=_*h+p,t[1]=h,t[5]=a*d,t[9]=-o*d,t[2]=-l*d,t[6]=p*h+_,t[10]=f-y*h}else if(e.order==="XZY"){const f=a*c,p=a*l,_=o*c,y=o*l;t[0]=c*d,t[4]=-h,t[8]=l*d,t[1]=f*h+y,t[5]=a*d,t[9]=p*h-_,t[2]=_*h-p,t[6]=o*d,t[10]=y*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Yv,e,Kv)}lookAt(e,t,n){const s=this.elements;return Dn.subVectors(e,t),Dn.lengthSq()===0&&(Dn.z=1),Dn.normalize(),zi.crossVectors(n,Dn),zi.lengthSq()===0&&(Math.abs(n.z)===1?Dn.x+=1e-4:Dn.z+=1e-4,Dn.normalize(),zi.crossVectors(n,Dn)),zi.normalize(),Xa.crossVectors(Dn,zi),s[0]=zi.x,s[4]=Xa.x,s[8]=Dn.x,s[1]=zi.y,s[5]=Xa.y,s[9]=Dn.y,s[2]=zi.z,s[6]=Xa.z,s[10]=Dn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],h=n[5],f=n[9],p=n[13],_=n[2],y=n[6],x=n[10],g=n[14],T=n[3],A=n[7],S=n[11],O=n[15],k=s[0],U=s[4],P=s[8],E=s[12],R=s[1],B=s[5],Z=s[9],I=s[13],$=s[2],H=s[6],z=s[10],W=s[14],X=s[3],de=s[7],fe=s[11],Se=s[15];return r[0]=a*k+o*R+c*$+l*X,r[4]=a*U+o*B+c*H+l*de,r[8]=a*P+o*Z+c*z+l*fe,r[12]=a*E+o*I+c*W+l*Se,r[1]=d*k+h*R+f*$+p*X,r[5]=d*U+h*B+f*H+p*de,r[9]=d*P+h*Z+f*z+p*fe,r[13]=d*E+h*I+f*W+p*Se,r[2]=_*k+y*R+x*$+g*X,r[6]=_*U+y*B+x*H+g*de,r[10]=_*P+y*Z+x*z+g*fe,r[14]=_*E+y*I+x*W+g*Se,r[3]=T*k+A*R+S*$+O*X,r[7]=T*U+A*B+S*H+O*de,r[11]=T*P+A*Z+S*z+O*fe,r[15]=T*E+A*I+S*W+O*Se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],d=e[2],h=e[6],f=e[10],p=e[14],_=e[3],y=e[7],x=e[11],g=e[15];return _*(+r*c*h-s*l*h-r*o*f+n*l*f+s*o*p-n*c*p)+y*(+t*c*p-t*l*f+r*a*f-s*a*p+s*l*d-r*c*d)+x*(+t*l*h-t*o*p-r*a*h+n*a*p+r*o*d-n*l*d)+g*(-s*o*d-t*c*h+t*o*f+s*a*h-n*a*f+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],h=e[9],f=e[10],p=e[11],_=e[12],y=e[13],x=e[14],g=e[15],T=h*x*l-y*f*l+y*c*p-o*x*p-h*c*g+o*f*g,A=_*f*l-d*x*l-_*c*p+a*x*p+d*c*g-a*f*g,S=d*y*l-_*h*l+_*o*p-a*y*p-d*o*g+a*h*g,O=_*h*c-d*y*c-_*o*f+a*y*f+d*o*x-a*h*x,k=t*T+n*A+s*S+r*O;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/k;return e[0]=T*U,e[1]=(y*f*r-h*x*r-y*s*p+n*x*p+h*s*g-n*f*g)*U,e[2]=(o*x*r-y*c*r+y*s*l-n*x*l-o*s*g+n*c*g)*U,e[3]=(h*c*r-o*f*r-h*s*l+n*f*l+o*s*p-n*c*p)*U,e[4]=A*U,e[5]=(d*x*r-_*f*r+_*s*p-t*x*p-d*s*g+t*f*g)*U,e[6]=(_*c*r-a*x*r-_*s*l+t*x*l+a*s*g-t*c*g)*U,e[7]=(a*f*r-d*c*r+d*s*l-t*f*l-a*s*p+t*c*p)*U,e[8]=S*U,e[9]=(_*h*r-d*y*r-_*n*p+t*y*p+d*n*g-t*h*g)*U,e[10]=(a*y*r-_*o*r+_*n*l-t*y*l-a*n*g+t*o*g)*U,e[11]=(d*o*r-a*h*r-d*n*l+t*h*l+a*n*p-t*o*p)*U,e[12]=O*U,e[13]=(d*y*s-_*h*s+_*n*f-t*y*f-d*n*x+t*h*x)*U,e[14]=(_*o*s-a*y*s-_*n*c+t*y*c+a*n*x-t*o*x)*U,e[15]=(a*h*s-d*o*s+d*n*c-t*h*c-a*n*f+t*o*f)*U,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,d=a+a,h=o+o,f=r*l,p=r*d,_=r*h,y=a*d,x=a*h,g=o*h,T=c*l,A=c*d,S=c*h,O=n.x,k=n.y,U=n.z;return s[0]=(1-(y+g))*O,s[1]=(p+S)*O,s[2]=(_-A)*O,s[3]=0,s[4]=(p-S)*k,s[5]=(1-(f+g))*k,s[6]=(x+T)*k,s[7]=0,s[8]=(_+A)*U,s[9]=(x-T)*U,s[10]=(1-(f+y))*U,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=qs.set(s[0],s[1],s[2]).length();const a=qs.set(s[4],s[5],s[6]).length(),o=qs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],qn.copy(this);const l=1/r,d=1/a,h=1/o;return qn.elements[0]*=l,qn.elements[1]*=l,qn.elements[2]*=l,qn.elements[4]*=d,qn.elements[5]*=d,qn.elements[6]*=d,qn.elements[8]*=h,qn.elements[9]*=h,qn.elements[10]*=h,t.setFromRotationMatrix(qn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=ui,c=!1){const l=this.elements,d=2*r/(t-e),h=2*r/(n-s),f=(t+e)/(t-e),p=(n+s)/(n-s);let _,y;if(c)_=r/(a-r),y=a*r/(a-r);else if(o===ui)_=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===Uo)_=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=_,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=ui,c=!1){const l=this.elements,d=2/(t-e),h=2/(n-s),f=-(t+e)/(t-e),p=-(n+s)/(n-s);let _,y;if(c)_=1/(a-r),y=a/(a-r);else if(o===ui)_=-2/(a-r),y=-(a+r)/(a-r);else if(o===Uo)_=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=_,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const qs=new N,qn=new Gt,Yv=new N(0,0,0),Kv=new N(1,1,1),zi=new N,Xa=new N,Dn=new N,gd=new Gt,vd=new wa;class pi{constructor(e=0,t=0,n=0,s=pi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],h=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(ft(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ft(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ft(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return gd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(gd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return vd.setFromEuler(this),this.setFromQuaternion(vd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}pi.DEFAULT_ORDER="XYZ";class zh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Jv=0;const _d=new N,js=new wa,Si=new Gt,qa=new N,Br=new N,Zv=new N,Qv=new wa,xd=new N(1,0,0),yd=new N(0,1,0),bd=new N(0,0,1),Sd={type:"added"},e_={type:"removed"},Ys={type:"childadded",child:null},Dl={type:"childremoved",child:null};class tn extends Er{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Jv++}),this.uuid=Li(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=tn.DEFAULT_UP.clone();const e=new N,t=new pi,n=new wa,s=new N(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Gt},normalMatrix:{value:new lt}}),this.matrix=new Gt,this.matrixWorld=new Gt,this.matrixAutoUpdate=tn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return js.setFromAxisAngle(e,t),this.quaternion.multiply(js),this}rotateOnWorldAxis(e,t){return js.setFromAxisAngle(e,t),this.quaternion.premultiply(js),this}rotateX(e){return this.rotateOnAxis(xd,e)}rotateY(e){return this.rotateOnAxis(yd,e)}rotateZ(e){return this.rotateOnAxis(bd,e)}translateOnAxis(e,t){return _d.copy(e).applyQuaternion(this.quaternion),this.position.add(_d.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(xd,e)}translateY(e){return this.translateOnAxis(yd,e)}translateZ(e){return this.translateOnAxis(bd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Si.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?qa.copy(e):qa.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Br.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Si.lookAt(Br,qa,this.up):Si.lookAt(qa,Br,this.up),this.quaternion.setFromRotationMatrix(Si),s&&(Si.extractRotation(s.matrixWorld),js.setFromRotationMatrix(Si),this.quaternion.premultiply(js.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Sd),Ys.child=e,this.dispatchEvent(Ys),Ys.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(e_),Dl.child=e,this.dispatchEvent(Dl),Dl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Si.multiply(e.parent.matrixWorld)),e.applyMatrix4(Si),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Sd),Ys.child=e,this.dispatchEvent(Ys),Ys.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Br,e,Zv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Br,Qv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),d=a(e.images),h=a(e.shapes),f=a(e.skeletons),p=a(e.animations),_=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}tn.DEFAULT_UP=new N(0,1,0);tn.DEFAULT_MATRIX_AUTO_UPDATE=!0;tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const jn=new N,wi=new N,Ll=new N,Mi=new N,Ks=new N,Js=new N,wd=new N,kl=new N,Ol=new N,Ul=new N,Nl=new Ot,Fl=new Ot,Bl=new Ot;class Hn{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),jn.subVectors(e,t),s.cross(jn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){jn.subVectors(s,t),wi.subVectors(n,t),Ll.subVectors(e,t);const a=jn.dot(jn),o=jn.dot(wi),c=jn.dot(Ll),l=wi.dot(wi),d=wi.dot(Ll),h=a*l-o*o;if(h===0)return r.set(0,0,0),null;const f=1/h,p=(l*c-o*d)*f,_=(a*d-o*c)*f;return r.set(1-p-_,_,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Mi)===null?!1:Mi.x>=0&&Mi.y>=0&&Mi.x+Mi.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,Mi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Mi.x),c.addScaledVector(a,Mi.y),c.addScaledVector(o,Mi.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return Nl.setScalar(0),Fl.setScalar(0),Bl.setScalar(0),Nl.fromBufferAttribute(e,t),Fl.fromBufferAttribute(e,n),Bl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Nl,r.x),a.addScaledVector(Fl,r.y),a.addScaledVector(Bl,r.z),a}static isFrontFacing(e,t,n,s){return jn.subVectors(n,t),wi.subVectors(e,t),jn.cross(wi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return jn.subVectors(this.c,this.b),wi.subVectors(this.a,this.b),jn.cross(wi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Hn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Hn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Ks.subVectors(s,n),Js.subVectors(r,n),kl.subVectors(e,n);const c=Ks.dot(kl),l=Js.dot(kl);if(c<=0&&l<=0)return t.copy(n);Ol.subVectors(e,s);const d=Ks.dot(Ol),h=Js.dot(Ol);if(d>=0&&h<=d)return t.copy(s);const f=c*h-d*l;if(f<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(Ks,a);Ul.subVectors(e,r);const p=Ks.dot(Ul),_=Js.dot(Ul);if(_>=0&&p<=_)return t.copy(r);const y=p*l-c*_;if(y<=0&&l>=0&&_<=0)return o=l/(l-_),t.copy(n).addScaledVector(Js,o);const x=d*_-p*h;if(x<=0&&h-d>=0&&p-_>=0)return wd.subVectors(r,s),o=(h-d)/(h-d+(p-_)),t.copy(s).addScaledVector(wd,o);const g=1/(x+y+f);return a=y*g,o=f*g,t.copy(n).addScaledVector(Ks,a).addScaledVector(Js,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const sm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hi={h:0,s:0,l:0},ja={h:0,s:0,l:0};function zl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ze{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=un){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,St.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=St.workingColorSpace){return this.r=e,this.g=t,this.b=n,St.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=St.workingColorSpace){if(e=Nh(e,1),t=ft(t,0,1),n=ft(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=zl(a,r,e+1/3),this.g=zl(a,r,e),this.b=zl(a,r,e-1/3)}return St.colorSpaceToWorking(this,s),this}setStyle(e,t=un){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=un){const n=sm[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ki(e.r),this.g=ki(e.g),this.b=ki(e.b),this}copyLinearToSRGB(e){return this.r=mr(e.r),this.g=mr(e.g),this.b=mr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=un){return St.workingToColorSpace(mn.copy(this),e),Math.round(ft(mn.r*255,0,255))*65536+Math.round(ft(mn.g*255,0,255))*256+Math.round(ft(mn.b*255,0,255))}getHexString(e=un){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=St.workingColorSpace){St.workingToColorSpace(mn.copy(this),t);const n=mn.r,s=mn.g,r=mn.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const h=a-o;switch(l=d<=.5?h/(a+o):h/(2-a-o),a){case n:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-n)/h+2;break;case r:c=(n-s)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=St.workingColorSpace){return St.workingToColorSpace(mn.copy(this),t),e.r=mn.r,e.g=mn.g,e.b=mn.b,e}getStyle(e=un){St.workingToColorSpace(mn.copy(this),e);const t=mn.r,n=mn.g,s=mn.b;return e!==un?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Hi),this.setHSL(Hi.h+e,Hi.s+t,Hi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Hi),e.getHSL(ja);const n=ta(Hi.h,ja.h,t),s=ta(Hi.s,ja.s,t),r=ta(Hi.l,ja.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const mn=new Ze;Ze.NAMES=sm;let t_=0;class Ds extends Er{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:t_++}),this.uuid=Li(),this.name="",this.type="Material",this.blending=pr,this.side=ts,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=xc,this.blendDst=yc,this.blendEquation=ys,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=xr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Vs,this.stencilZFail=Vs,this.stencilZPass=Vs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==pr&&(n.blending=this.blending),this.side!==ts&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==xc&&(n.blendSrc=this.blendSrc),this.blendDst!==yc&&(n.blendDst=this.blendDst),this.blendEquation!==ys&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==xr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cd&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Vs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Vs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Vs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Bn extends Ds{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.combine=Fp,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Jt=new N,Ya=new Te;let n_=0;class Cn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:n_++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ah,this.updateRanges=[],this.gpuType=Ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ya.fromBufferAttribute(this,t),Ya.applyMatrix3(e),this.setXY(t,Ya.x,Ya.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix3(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix4(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyNormalMatrix(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.transformDirection(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Yn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Dt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Yn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Yn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Yn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Yn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),s=Dt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),s=Dt(s,this.array),r=Dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ah&&(e.usage=this.usage),e}}class rm extends Cn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class am extends Cn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class wt extends Cn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let i_=0;const Nn=new Gt,Hl=new tn,Zs=new N,Ln=new Ma,zr=new Ma,on=new N;class Kt extends Er{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:i_++}),this.uuid=Li(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(nm(e)?am:rm)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new lt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Nn.makeRotationFromQuaternion(e),this.applyMatrix4(Nn),this}rotateX(e){return Nn.makeRotationX(e),this.applyMatrix4(Nn),this}rotateY(e){return Nn.makeRotationY(e),this.applyMatrix4(Nn),this}rotateZ(e){return Nn.makeRotationZ(e),this.applyMatrix4(Nn),this}translate(e,t,n){return Nn.makeTranslation(e,t,n),this.applyMatrix4(Nn),this}scale(e,t,n){return Nn.makeScale(e,t,n),this.applyMatrix4(Nn),this}lookAt(e){return Hl.lookAt(e),Hl.updateMatrix(),this.applyMatrix4(Hl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zs).negate(),this.translate(Zs.x,Zs.y,Zs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new wt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ma);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Ln.setFromBufferAttribute(r),this.morphTargetsRelative?(on.addVectors(this.boundingBox.min,Ln.min),this.boundingBox.expandByPoint(on),on.addVectors(this.boundingBox.max,Ln.max),this.boundingBox.expandByPoint(on)):(this.boundingBox.expandByPoint(Ln.min),this.boundingBox.expandByPoint(Ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const n=this.boundingSphere.center;if(Ln.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];zr.setFromBufferAttribute(o),this.morphTargetsRelative?(on.addVectors(Ln.min,zr.min),Ln.expandByPoint(on),on.addVectors(Ln.max,zr.max),Ln.expandByPoint(on)):(Ln.expandByPoint(zr.min),Ln.expandByPoint(zr.max))}Ln.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)on.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(on));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)on.fromBufferAttribute(o,l),c&&(Zs.fromBufferAttribute(e,l),on.add(Zs)),s=Math.max(s,n.distanceToSquared(on))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Cn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<n.count;P++)o[P]=new N,c[P]=new N;const l=new N,d=new N,h=new N,f=new Te,p=new Te,_=new Te,y=new N,x=new N;function g(P,E,R){l.fromBufferAttribute(n,P),d.fromBufferAttribute(n,E),h.fromBufferAttribute(n,R),f.fromBufferAttribute(r,P),p.fromBufferAttribute(r,E),_.fromBufferAttribute(r,R),d.sub(l),h.sub(l),p.sub(f),_.sub(f);const B=1/(p.x*_.y-_.x*p.y);isFinite(B)&&(y.copy(d).multiplyScalar(_.y).addScaledVector(h,-p.y).multiplyScalar(B),x.copy(h).multiplyScalar(p.x).addScaledVector(d,-_.x).multiplyScalar(B),o[P].add(y),o[E].add(y),o[R].add(y),c[P].add(x),c[E].add(x),c[R].add(x))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let P=0,E=T.length;P<E;++P){const R=T[P],B=R.start,Z=R.count;for(let I=B,$=B+Z;I<$;I+=3)g(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const A=new N,S=new N,O=new N,k=new N;function U(P){O.fromBufferAttribute(s,P),k.copy(O);const E=o[P];A.copy(E),A.sub(O.multiplyScalar(O.dot(E))).normalize(),S.crossVectors(k,E);const B=S.dot(c[P])<0?-1:1;a.setXYZW(P,A.x,A.y,A.z,B)}for(let P=0,E=T.length;P<E;++P){const R=T[P],B=R.start,Z=R.count;for(let I=B,$=B+Z;I<$;I+=3)U(e.getX(I+0)),U(e.getX(I+1)),U(e.getX(I+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Cn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new N,r=new N,a=new N,o=new N,c=new N,l=new N,d=new N,h=new N;if(e)for(let f=0,p=e.count;f<p;f+=3){const _=e.getX(f+0),y=e.getX(f+1),x=e.getX(f+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,x),d.subVectors(a,r),h.subVectors(s,r),d.cross(h),o.fromBufferAttribute(n,_),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,x),o.add(d),c.add(d),l.add(d),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(x,l.x,l.y,l.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),d.subVectors(a,r),h.subVectors(s,r),d.cross(h),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)on.fromBufferAttribute(e,t),on.normalize(),e.setXYZ(t,on.x,on.y,on.z)}toNonIndexed(){function e(o,c){const l=o.array,d=o.itemSize,h=o.normalized,f=new l.constructor(c.length*d);let p=0,_=0;for(let y=0,x=c.length;y<x;y++){o.isInterleavedBufferAttribute?p=c[y]*o.data.stride+o.offset:p=c[y]*d;for(let g=0;g<d;g++)f[_++]=l[p++]}return new Cn(f,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Kt,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,h=l.length;d<h;d++){const f=l[d],p=e(f,n);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let h=0,f=l.length;h<f;h++){const p=l[h];d.push(p.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(t))}const r=e.morphAttributes;for(const l in r){const d=[],h=r[l];for(let f=0,p=h.length;f<p;f++)d.push(h[f].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,d=a.length;l<d;l++){const h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Md=new Gt,us=new Bh,Ka=new Zo,Ed=new N,Ja=new N,Za=new N,Qa=new N,Vl=new N,eo=new N,Td=new N,to=new N;class Et extends tn{constructor(e=new Kt,t=new Bn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){eo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],h=r[c];d!==0&&(Vl.fromBufferAttribute(h,e),a?eo.addScaledVector(Vl,d):eo.addScaledVector(Vl.sub(t),d))}t.add(eo)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ka.copy(n.boundingSphere),Ka.applyMatrix4(r),us.copy(e.ray).recast(e.near),!(Ka.containsPoint(us.origin)===!1&&(us.intersectSphere(Ka,Ed)===null||us.origin.distanceToSquared(Ed)>(e.far-e.near)**2))&&(Md.copy(r).invert(),us.copy(e.ray).applyMatrix4(Md),!(n.boundingBox!==null&&us.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,us)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,h=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,y=f.length;_<y;_++){const x=f[_],g=a[x.materialIndex],T=Math.max(x.start,p.start),A=Math.min(o.count,Math.min(x.start+x.count,p.start+p.count));for(let S=T,O=A;S<O;S+=3){const k=o.getX(S),U=o.getX(S+1),P=o.getX(S+2);s=no(this,g,e,n,l,d,h,k,U,P),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const _=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let x=_,g=y;x<g;x+=3){const T=o.getX(x),A=o.getX(x+1),S=o.getX(x+2);s=no(this,a,e,n,l,d,h,T,A,S),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,y=f.length;_<y;_++){const x=f[_],g=a[x.materialIndex],T=Math.max(x.start,p.start),A=Math.min(c.count,Math.min(x.start+x.count,p.start+p.count));for(let S=T,O=A;S<O;S+=3){const k=S,U=S+1,P=S+2;s=no(this,g,e,n,l,d,h,k,U,P),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const _=Math.max(0,p.start),y=Math.min(c.count,p.start+p.count);for(let x=_,g=y;x<g;x+=3){const T=x,A=x+1,S=x+2;s=no(this,a,e,n,l,d,h,T,A,S),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}}}function s_(i,e,t,n,s,r,a,o){let c;if(e.side===Rn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===ts,o),c===null)return null;to.copy(o),to.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(to);return l<t.near||l>t.far?null:{distance:l,point:to.clone(),object:i}}function no(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Ja),i.getVertexPosition(c,Za),i.getVertexPosition(l,Qa);const d=s_(i,e,t,n,Ja,Za,Qa,Td);if(d){const h=new N;Hn.getBarycoord(Td,Ja,Za,Qa,h),s&&(d.uv=Hn.getInterpolatedAttribute(s,o,c,l,h,new Te)),r&&(d.uv1=Hn.getInterpolatedAttribute(r,o,c,l,h,new Te)),a&&(d.normal=Hn.getInterpolatedAttribute(a,o,c,l,h,new N),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new N,materialIndex:0};Hn.getNormal(Ja,Za,Qa,f.normal),d.face=f,d.barycoord=h}return d}class Tr extends Kt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],h=[];let f=0,p=0;_("z","y","x",-1,-1,n,t,e,a,r,0),_("z","y","x",1,-1,n,t,-e,a,r,1),_("x","z","y",1,1,e,n,t,s,a,2),_("x","z","y",1,-1,e,n,-t,s,a,3),_("x","y","z",1,-1,e,t,n,s,r,4),_("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new wt(l,3)),this.setAttribute("normal",new wt(d,3)),this.setAttribute("uv",new wt(h,2));function _(y,x,g,T,A,S,O,k,U,P,E){const R=S/U,B=O/P,Z=S/2,I=O/2,$=k/2,H=U+1,z=P+1;let W=0,X=0;const de=new N;for(let fe=0;fe<z;fe++){const Se=fe*B-I;for(let Ne=0;Ne<H;Ne++){const ct=Ne*R-Z;de[y]=ct*T,de[x]=Se*A,de[g]=$,l.push(de.x,de.y,de.z),de[y]=0,de[x]=0,de[g]=k>0?1:-1,d.push(de.x,de.y,de.z),h.push(Ne/U),h.push(1-fe/P),W+=1}}for(let fe=0;fe<P;fe++)for(let Se=0;Se<U;Se++){const Ne=f+Se+H*fe,ct=f+Se+H*(fe+1),mt=f+(Se+1)+H*(fe+1),pt=f+(Se+1)+H*fe;c.push(Ne,ct,pt),c.push(ct,mt,pt),X+=6}o.addGroup(p,X,E),p+=X,f+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Tr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function wr(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function yn(i){const e={};for(let t=0;t<i.length;t++){const n=wr(i[t]);for(const s in n)e[s]=n[s]}return e}function r_(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function om(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:St.workingColorSpace}const ga={clone:wr,merge:yn};var a_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,o_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Sn extends Ds{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=a_,this.fragmentShader=o_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=wr(e.uniforms),this.uniformsGroups=r_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class lm extends tn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Gt,this.projectionMatrix=new Gt,this.projectionMatrixInverse=new Gt,this.coordinateSystem=ui,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Vi=new N,Ad=new Te,Rd=new Te;class kn extends lm{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=pa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ea*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return pa*2*Math.atan(Math.tan(ea*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Vi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Vi.x,Vi.y).multiplyScalar(-e/Vi.z),Vi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vi.x,Vi.y).multiplyScalar(-e/Vi.z)}getViewSize(e,t){return this.getViewBounds(e,Ad,Rd),t.subVectors(Rd,Ad)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ea*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Qs=-90,er=1;class l_ extends tn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new kn(Qs,er,e,t);s.layers=this.layers,this.add(s);const r=new kn(Qs,er,e,t);r.layers=this.layers,this.add(r);const a=new kn(Qs,er,e,t);a.layers=this.layers,this.add(a);const o=new kn(Qs,er,e,t);o.layers=this.layers,this.add(o);const c=new kn(Qs,er,e,t);c.layers=this.layers,this.add(c);const l=new kn(Qs,er,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===ui)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Uo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(h,f,p),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class cm extends Mn{constructor(e=[],t=yr,n,s,r,a,o,c,l,d){super(e,t,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class c_ extends Zn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new cm(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Tr(5,5,5),r=new Sn({name:"CubemapFromEquirect",uniforms:wr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Rn,blending:Ii});r.uniforms.tEquirect.value=t;const a=new Et(s,r),o=t.minFilter;return t.minFilter===Ms&&(t.minFilter=hi),new l_(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class Yi extends tn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const h_={type:"move"};class Gl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const y of e.hand.values()){const x=t.getJointPose(y,n),g=this._getHandJoint(l,y);x!==null&&(g.matrix.fromArray(x.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=x.radius),g.visible=x!==null}const d=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=d.position.distanceTo(h.position),p=.02,_=.005;l.inputState.pinching&&f>p+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=p-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(h_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Yi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Hh{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ze(e),this.near=t,this.far=n}clone(){return new Hh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class u_ extends tn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pi,this.environmentIntensity=1,this.environmentRotation=new pi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class d_{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ah,this.updateRanges=[],this.version=0,this.uuid=Li()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Li()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Li()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const xn=new N;class Fo{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.applyMatrix4(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.applyNormalMatrix(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.transformDirection(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Yn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Dt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Yn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Yn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Yn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Yn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),s=Dt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),s=Dt(s,this.array),r=Dt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Cn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Fo(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class bs extends Ds{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ze(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let tr;const Hr=new N,nr=new N,ir=new N,sr=new Te,Vr=new Te,hm=new Gt,io=new N,Gr=new N,so=new N,Cd=new Te,$l=new Te,Pd=new Te;class lr extends tn{constructor(e=new bs){if(super(),this.isSprite=!0,this.type="Sprite",tr===void 0){tr=new Kt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new d_(t,5);tr.setIndex([0,1,2,0,2,3]),tr.setAttribute("position",new Fo(n,3,0,!1)),tr.setAttribute("uv",new Fo(n,2,3,!1))}this.geometry=tr,this.material=e,this.center=new Te(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),nr.setFromMatrixScale(this.matrixWorld),hm.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ir.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&nr.multiplyScalar(-ir.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;ro(io.set(-.5,-.5,0),ir,a,nr,s,r),ro(Gr.set(.5,-.5,0),ir,a,nr,s,r),ro(so.set(.5,.5,0),ir,a,nr,s,r),Cd.set(0,0),$l.set(1,0),Pd.set(1,1);let o=e.ray.intersectTriangle(io,Gr,so,!1,Hr);if(o===null&&(ro(Gr.set(-.5,.5,0),ir,a,nr,s,r),$l.set(0,1),o=e.ray.intersectTriangle(io,so,Gr,!1,Hr),o===null))return;const c=e.ray.origin.distanceTo(Hr);c<e.near||c>e.far||t.push({distance:c,point:Hr.clone(),uv:Hn.getInterpolation(Hr,io,Gr,so,Cd,$l,Pd,new Te),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function ro(i,e,t,n,s,r){sr.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Vr.x=r*sr.x-s*sr.y,Vr.y=s*sr.x+r*sr.y):Vr.copy(sr),i.copy(e),i.x+=Vr.x,i.y+=Vr.y,i.applyMatrix4(hm)}const Wl=new N,f_=new N,p_=new lt;class gs{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Wl.subVectors(n,t).cross(f_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Wl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||p_.getNormalMatrix(e),s=this.coplanarPoint(Wl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ds=new Zo,m_=new Te(.5,.5),ao=new N;class Vh{constructor(e=new gs,t=new gs,n=new gs,s=new gs,r=new gs,a=new gs){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ui,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],h=r[5],f=r[6],p=r[7],_=r[8],y=r[9],x=r[10],g=r[11],T=r[12],A=r[13],S=r[14],O=r[15];if(s[0].setComponents(l-a,p-d,g-_,O-T).normalize(),s[1].setComponents(l+a,p+d,g+_,O+T).normalize(),s[2].setComponents(l+o,p+h,g+y,O+A).normalize(),s[3].setComponents(l-o,p-h,g-y,O-A).normalize(),n)s[4].setComponents(c,f,x,S).normalize(),s[5].setComponents(l-c,p-f,g-x,O-S).normalize();else if(s[4].setComponents(l-c,p-f,g-x,O-S).normalize(),t===ui)s[5].setComponents(l+c,p+f,g+x,O+S).normalize();else if(t===Uo)s[5].setComponents(c,f,x,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ds.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ds.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ds)}intersectsSprite(e){ds.center.set(0,0,0);const t=m_.distanceTo(e.center);return ds.radius=.7071067811865476+t,ds.applyMatrix4(e.matrixWorld),this.intersectsSphere(ds)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(ao.x=s.normal.x>0?e.max.x:e.min.x,ao.y=s.normal.y>0?e.max.y:e.min.y,ao.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ao)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Bo extends Ds{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Id=new Gt,oh=new Bh,oo=new Zo,lo=new N;class lh extends tn{constructor(e=new Kt,t=new Bo){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),oo.copy(n.boundingSphere),oo.applyMatrix4(s),oo.radius+=r,e.ray.intersectsSphere(oo)===!1)return;Id.copy(s).invert(),oh.copy(e.ray).applyMatrix4(Id);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,h=n.attributes.position;if(l!==null){const f=Math.max(0,a.start),p=Math.min(l.count,a.start+a.count);for(let _=f,y=p;_<y;_++){const x=l.getX(_);lo.fromBufferAttribute(h,x),Dd(lo,x,c,s,e,t,this)}}else{const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=f,y=p;_<y;_++)lo.fromBufferAttribute(h,_),Dd(lo,_,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Dd(i,e,t,n,s,r,a){const o=oh.distanceSqToPoint(i);if(o<t){const c=new N;oh.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Es extends Mn{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class um extends Mn{constructor(e,t,n=Ps,s,r,a,o=Jn,c=Jn,l,d=da,h=1){if(d!==da&&d!==fa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:h};super(f,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Fh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class dm extends Mn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Gh extends Kt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new N,d=new Te;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let h=0,f=3;h<=t;h++,f+=3){const p=n+h/t*s;l.x=e*Math.cos(p),l.y=e*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[f]/e+1)/2,d.y=(a[f+1]/e+1)/2,c.push(d.x,d.y)}for(let h=1;h<=t;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new wt(a,3)),this.setAttribute("normal",new wt(o,3)),this.setAttribute("uv",new wt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gh(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Ki extends Kt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const d=[],h=[],f=[],p=[];let _=0;const y=[],x=n/2;let g=0;T(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(d),this.setAttribute("position",new wt(h,3)),this.setAttribute("normal",new wt(f,3)),this.setAttribute("uv",new wt(p,2));function T(){const S=new N,O=new N;let k=0;const U=(t-e)/n;for(let P=0;P<=r;P++){const E=[],R=P/r,B=R*(t-e)+e;for(let Z=0;Z<=s;Z++){const I=Z/s,$=I*c+o,H=Math.sin($),z=Math.cos($);O.x=B*H,O.y=-R*n+x,O.z=B*z,h.push(O.x,O.y,O.z),S.set(H,U,z).normalize(),f.push(S.x,S.y,S.z),p.push(I,1-R),E.push(_++)}y.push(E)}for(let P=0;P<s;P++)for(let E=0;E<r;E++){const R=y[E][P],B=y[E+1][P],Z=y[E+1][P+1],I=y[E][P+1];(e>0||E!==0)&&(d.push(R,B,I),k+=3),(t>0||E!==r-1)&&(d.push(B,Z,I),k+=3)}l.addGroup(g,k,0),g+=k}function A(S){const O=_,k=new Te,U=new N;let P=0;const E=S===!0?e:t,R=S===!0?1:-1;for(let Z=1;Z<=s;Z++)h.push(0,x*R,0),f.push(0,R,0),p.push(.5,.5),_++;const B=_;for(let Z=0;Z<=s;Z++){const $=Z/s*c+o,H=Math.cos($),z=Math.sin($);U.x=E*z,U.y=x*R,U.z=E*H,h.push(U.x,U.y,U.z),f.push(0,R,0),k.x=H*.5+.5,k.y=z*.5*R+.5,p.push(k.x,k.y),_++}for(let Z=0;Z<s;Z++){const I=O+Z,$=B+Z;S===!0?d.push($,$+1,I):d.push($+1,$,I),P+=3}l.addGroup(g,P,S===!0?1:2),g+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ki(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Qo extends Kt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new wt(r,3)),this.setAttribute("normal",new wt(r.slice(),3)),this.setAttribute("uv",new wt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(T){const A=new N,S=new N,O=new N;for(let k=0;k<t.length;k+=3)p(t[k+0],A),p(t[k+1],S),p(t[k+2],O),c(A,S,O,T)}function c(T,A,S,O){const k=O+1,U=[];for(let P=0;P<=k;P++){U[P]=[];const E=T.clone().lerp(S,P/k),R=A.clone().lerp(S,P/k),B=k-P;for(let Z=0;Z<=B;Z++)Z===0&&P===k?U[P][Z]=E:U[P][Z]=E.clone().lerp(R,Z/B)}for(let P=0;P<k;P++)for(let E=0;E<2*(k-P)-1;E++){const R=Math.floor(E/2);E%2===0?(f(U[P][R+1]),f(U[P+1][R]),f(U[P][R])):(f(U[P][R+1]),f(U[P+1][R+1]),f(U[P+1][R]))}}function l(T){const A=new N;for(let S=0;S<r.length;S+=3)A.x=r[S+0],A.y=r[S+1],A.z=r[S+2],A.normalize().multiplyScalar(T),r[S+0]=A.x,r[S+1]=A.y,r[S+2]=A.z}function d(){const T=new N;for(let A=0;A<r.length;A+=3){T.x=r[A+0],T.y=r[A+1],T.z=r[A+2];const S=x(T)/2/Math.PI+.5,O=g(T)/Math.PI+.5;a.push(S,1-O)}_(),h()}function h(){for(let T=0;T<a.length;T+=6){const A=a[T+0],S=a[T+2],O=a[T+4],k=Math.max(A,S,O),U=Math.min(A,S,O);k>.9&&U<.1&&(A<.2&&(a[T+0]+=1),S<.2&&(a[T+2]+=1),O<.2&&(a[T+4]+=1))}}function f(T){r.push(T.x,T.y,T.z)}function p(T,A){const S=T*3;A.x=e[S+0],A.y=e[S+1],A.z=e[S+2]}function _(){const T=new N,A=new N,S=new N,O=new N,k=new Te,U=new Te,P=new Te;for(let E=0,R=0;E<r.length;E+=9,R+=6){T.set(r[E+0],r[E+1],r[E+2]),A.set(r[E+3],r[E+4],r[E+5]),S.set(r[E+6],r[E+7],r[E+8]),k.set(a[R+0],a[R+1]),U.set(a[R+2],a[R+3]),P.set(a[R+4],a[R+5]),O.copy(T).add(A).add(S).divideScalar(3);const B=x(O);y(k,R+0,T,B),y(U,R+2,A,B),y(P,R+4,S,B)}}function y(T,A,S,O){O<0&&T.x===1&&(a[A]=T.x-1),S.x===0&&S.z===0&&(a[A]=O/2/Math.PI+.5)}function x(T){return Math.atan2(T.z,-T.x)}function g(T){return Math.atan2(-T.y,Math.sqrt(T.x*T.x+T.z*T.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qo(e.vertices,e.indices,e.radius,e.details)}}class Oi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],f=n[s+1]-d,p=(a-d)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Te:new N);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new N,s=[],r=[],a=[],o=new N,c=new Gt;for(let p=0;p<=e;p++){const _=p/e;s[p]=this.getTangentAt(_,new N)}r[0]=new N,a[0]=new N;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),h=Math.abs(s[0].y),f=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const _=Math.acos(ft(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,_))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(ft(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let _=1;_<=e;_++)r[_].applyMatrix4(c.makeRotationAxis(s[_],p*_)),a[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class fm extends Oi{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Te){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),h=Math.sin(this.aRotation),f=c-this.aX,p=l-this.aY;c=f*d-p*h+this.aX,l=f*h+p*d+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class g_ extends fm{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function $h(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,h){let f=(a-r)/l-(o-r)/(l+d)+(o-a)/d,p=(o-a)/d-(c-a)/(d+h)+(c-o)/h;f*=d,p*=d,s(a,o,f,p)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const co=new N,Xl=new $h,ql=new $h,jl=new $h;class pm extends Oi{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new N){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(co.subVectors(s[0],s[1]).add(s[0]),l=co);const h=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(co.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=co),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let _=Math.pow(l.distanceToSquared(h),p),y=Math.pow(h.distanceToSquared(f),p),x=Math.pow(f.distanceToSquared(d),p);y<1e-4&&(y=1),_<1e-4&&(_=y),x<1e-4&&(x=y),Xl.initNonuniformCatmullRom(l.x,h.x,f.x,d.x,_,y,x),ql.initNonuniformCatmullRom(l.y,h.y,f.y,d.y,_,y,x),jl.initNonuniformCatmullRom(l.z,h.z,f.z,d.z,_,y,x)}else this.curveType==="catmullrom"&&(Xl.initCatmullRom(l.x,h.x,f.x,d.x,this.tension),ql.initCatmullRom(l.y,h.y,f.y,d.y,this.tension),jl.initCatmullRom(l.z,h.z,f.z,d.z,this.tension));return n.set(Xl.calc(c),ql.calc(c),jl.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new N().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Ld(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function v_(i,e){const t=1-i;return t*t*e}function __(i,e){return 2*(1-i)*i*e}function x_(i,e){return i*i*e}function na(i,e,t,n){return v_(i,e)+__(i,t)+x_(i,n)}function y_(i,e){const t=1-i;return t*t*t*e}function b_(i,e){const t=1-i;return 3*t*t*i*e}function S_(i,e){return 3*(1-i)*i*i*e}function w_(i,e){return i*i*i*e}function ia(i,e,t,n,s){return y_(i,e)+b_(i,t)+S_(i,n)+w_(i,s)}class M_ extends Oi{constructor(e=new Te,t=new Te,n=new Te,s=new Te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Te){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ia(e,s.x,r.x,a.x,o.x),ia(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class E_ extends Oi{constructor(e=new N,t=new N,n=new N,s=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new N){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ia(e,s.x,r.x,a.x,o.x),ia(e,s.y,r.y,a.y,o.y),ia(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class T_ extends Oi{constructor(e=new Te,t=new Te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Te){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class A_ extends Oi{constructor(e=new N,t=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new N){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new N){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class R_ extends Oi{constructor(e=new Te,t=new Te,n=new Te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Te){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(na(e,s.x,r.x,a.x),na(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Wh extends Oi{constructor(e=new N,t=new N,n=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new N){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(na(e,s.x,r.x,a.x),na(e,s.y,r.y,a.y),na(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class C_ extends Oi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Te){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],h=s[a>s.length-3?s.length-1:a+2];return n.set(Ld(o,c.x,l.x,d.x,h.x),Ld(o,c.y,l.y,d.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new Te().fromArray(s))}return this}}var P_=Object.freeze({__proto__:null,ArcCurve:g_,CatmullRomCurve3:pm,CubicBezierCurve:M_,CubicBezierCurve3:E_,EllipseCurve:fm,LineCurve:T_,LineCurve3:A_,QuadraticBezierCurve:R_,QuadraticBezierCurve3:Wh,SplineCurve:C_});class zo extends Qo{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new zo(e.radius,e.detail)}}class el extends Qo{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new el(e.radius,e.detail)}}class tl extends Kt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,h=e/o,f=t/c,p=[],_=[],y=[],x=[];for(let g=0;g<d;g++){const T=g*f-a;for(let A=0;A<l;A++){const S=A*h-r;_.push(S,-T,0),y.push(0,0,1),x.push(A/o),x.push(1-g/c)}}for(let g=0;g<c;g++)for(let T=0;T<o;T++){const A=T+l*g,S=T+l*(g+1),O=T+1+l*(g+1),k=T+1+l*g;p.push(A,S,k),p.push(S,O,k)}this.setIndex(p),this.setAttribute("position",new wt(_,3)),this.setAttribute("normal",new wt(y,3)),this.setAttribute("uv",new wt(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tl(e.width,e.height,e.widthSegments,e.heightSegments)}}class va extends Kt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],d=[];let h=e;const f=(t-e)/s,p=new N,_=new Te;for(let y=0;y<=s;y++){for(let x=0;x<=n;x++){const g=r+x/n*a;p.x=h*Math.cos(g),p.y=h*Math.sin(g),c.push(p.x,p.y,p.z),l.push(0,0,1),_.x=(p.x/t+1)/2,_.y=(p.y/t+1)/2,d.push(_.x,_.y)}h+=f}for(let y=0;y<s;y++){const x=y*(n+1);for(let g=0;g<n;g++){const T=g+x,A=T,S=T+n+1,O=T+n+2,k=T+1;o.push(A,S,k),o.push(S,O,k)}}this.setIndex(o),this.setAttribute("position",new wt(c,3)),this.setAttribute("normal",new wt(l,3)),this.setAttribute("uv",new wt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new va(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class _a extends Kt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const d=[],h=new N,f=new N,p=[],_=[],y=[],x=[];for(let g=0;g<=n;g++){const T=[],A=g/n;let S=0;g===0&&a===0?S=.5/t:g===n&&c===Math.PI&&(S=-.5/t);for(let O=0;O<=t;O++){const k=O/t;h.x=-e*Math.cos(s+k*r)*Math.sin(a+A*o),h.y=e*Math.cos(a+A*o),h.z=e*Math.sin(s+k*r)*Math.sin(a+A*o),_.push(h.x,h.y,h.z),f.copy(h).normalize(),y.push(f.x,f.y,f.z),x.push(k+S,1-A),T.push(l++)}d.push(T)}for(let g=0;g<n;g++)for(let T=0;T<t;T++){const A=d[g][T+1],S=d[g][T],O=d[g+1][T],k=d[g+1][T+1];(g!==0||a>0)&&p.push(A,S,k),(g!==n-1||c<Math.PI)&&p.push(S,O,k)}this.setIndex(p),this.setAttribute("position",new wt(_,3)),this.setAttribute("normal",new wt(y,3)),this.setAttribute("uv",new wt(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _a(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class nl extends Kt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],d=new N,h=new N,f=new N;for(let p=0;p<=n;p++)for(let _=0;_<=s;_++){const y=_/s*r,x=p/n*Math.PI*2;h.x=(e+t*Math.cos(x))*Math.cos(y),h.y=(e+t*Math.cos(x))*Math.sin(y),h.z=t*Math.sin(x),o.push(h.x,h.y,h.z),d.x=e*Math.cos(y),d.y=e*Math.sin(y),f.subVectors(h,d).normalize(),c.push(f.x,f.y,f.z),l.push(_/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let _=1;_<=s;_++){const y=(s+1)*p+_-1,x=(s+1)*(p-1)+_-1,g=(s+1)*(p-1)+_,T=(s+1)*p+_;a.push(y,x,T),a.push(x,g,T)}this.setIndex(a),this.setAttribute("position",new wt(o,3)),this.setAttribute("normal",new wt(c,3)),this.setAttribute("uv",new wt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nl(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Xh extends Kt{constructor(e=1,t=.4,n=64,s=8,r=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:s,p:r,q:a},n=Math.floor(n),s=Math.floor(s);const o=[],c=[],l=[],d=[],h=new N,f=new N,p=new N,_=new N,y=new N,x=new N,g=new N;for(let A=0;A<=n;++A){const S=A/n*r*Math.PI*2;T(S,r,a,e,p),T(S+.01,r,a,e,_),x.subVectors(_,p),g.addVectors(_,p),y.crossVectors(x,g),g.crossVectors(y,x),y.normalize(),g.normalize();for(let O=0;O<=s;++O){const k=O/s*Math.PI*2,U=-t*Math.cos(k),P=t*Math.sin(k);h.x=p.x+(U*g.x+P*y.x),h.y=p.y+(U*g.y+P*y.y),h.z=p.z+(U*g.z+P*y.z),c.push(h.x,h.y,h.z),f.subVectors(h,p).normalize(),l.push(f.x,f.y,f.z),d.push(A/n),d.push(O/s)}}for(let A=1;A<=n;A++)for(let S=1;S<=s;S++){const O=(s+1)*(A-1)+(S-1),k=(s+1)*A+(S-1),U=(s+1)*A+S,P=(s+1)*(A-1)+S;o.push(O,k,P),o.push(k,U,P)}this.setIndex(o),this.setAttribute("position",new wt(c,3)),this.setAttribute("normal",new wt(l,3)),this.setAttribute("uv",new wt(d,2));function T(A,S,O,k,U){const P=Math.cos(A),E=Math.sin(A),R=O/S*A,B=Math.cos(R);U.x=k*(2+B)*.5*P,U.y=k*(2+B)*E*.5,U.z=k*Math.sin(R)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xh(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class qh extends Kt{constructor(e=new Wh(new N(-1,-1,0),new N(-1,1,0),new N(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};const a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new N,c=new N,l=new Te;let d=new N;const h=[],f=[],p=[],_=[];y(),this.setIndex(_),this.setAttribute("position",new wt(h,3)),this.setAttribute("normal",new wt(f,3)),this.setAttribute("uv",new wt(p,2));function y(){for(let A=0;A<t;A++)x(A);x(r===!1?t:0),T(),g()}function x(A){d=e.getPointAt(A/t,d);const S=a.normals[A],O=a.binormals[A];for(let k=0;k<=s;k++){const U=k/s*Math.PI*2,P=Math.sin(U),E=-Math.cos(U);c.x=E*S.x+P*O.x,c.y=E*S.y+P*O.y,c.z=E*S.z+P*O.z,c.normalize(),f.push(c.x,c.y,c.z),o.x=d.x+n*c.x,o.y=d.y+n*c.y,o.z=d.z+n*c.z,h.push(o.x,o.y,o.z)}}function g(){for(let A=1;A<=t;A++)for(let S=1;S<=s;S++){const O=(s+1)*(A-1)+(S-1),k=(s+1)*A+(S-1),U=(s+1)*A+S,P=(s+1)*(A-1)+S;_.push(O,k,P),_.push(k,U,P)}}function T(){for(let A=0;A<=t;A++)for(let S=0;S<=s;S++)l.x=A/t,l.y=S/s,p.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new qh(new P_[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class I_ extends Sn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class zn extends Ds{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=em,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class D_ extends zn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Te(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ft(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ze(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ze(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ze(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class L_ extends Ds{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class k_ extends Ds{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class jh extends tn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class O_ extends jh{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Yl=new Gt,kd=new N,Od=new N;class mm{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.mapType=fi,this.map=null,this.mapPass=null,this.matrix=new Gt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Vh,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new Ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;kd.setFromMatrixPosition(e.matrixWorld),t.position.copy(kd),Od.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Od),t.updateMatrixWorld(),Yl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yl,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Yl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ud=new Gt,$r=new N,Kl=new N;class U_ extends mm{constructor(){super(new kn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Te(4,2),this._viewportCount=6,this._viewports=[new Ot(2,1,1,1),new Ot(0,1,1,1),new Ot(3,1,1,1),new Ot(1,1,1,1),new Ot(3,0,1,1),new Ot(1,0,1,1)],this._cubeDirections=[new N(1,0,0),new N(-1,0,0),new N(0,0,1),new N(0,0,-1),new N(0,1,0),new N(0,-1,0)],this._cubeUps=[new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,0,1),new N(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),$r.setFromMatrixPosition(e.matrixWorld),n.position.copy($r),Kl.copy(n.position),Kl.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Kl),n.updateMatrixWorld(),s.makeTranslation(-$r.x,-$r.y,-$r.z),Ud.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ud,n.coordinateSystem,n.reversedDepth)}}class Jl extends jh{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new U_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Yh extends lm{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class N_ extends mm{constructor(){super(new Yh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Nd extends jh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.target=new tn,this.shadow=new N_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class F_ extends kn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class gm{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Fd=new Gt;class B_{constructor(e,t,n=0,s=1/0){this.ray=new Bh(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new zh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Fd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Fd),this}intersectObject(e,t=!0,n=[]){return ch(e,this,n,t),n.sort(Bd),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)ch(e[s],this,n,t);return n.sort(Bd),n}}function Bd(i,e){return i.distance-e.distance}function ch(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)ch(r[a],e,t,!0)}}function zd(i,e,t,n){const s=z_(n);switch(t){case Kp:return i*e;case Zp:return i*e/s.components*s.byteLength;case kh:return i*e/s.components*s.byteLength;case Qp:return i*e*2/s.components*s.byteLength;case Oh:return i*e*2/s.components*s.byteLength;case Jp:return i*e*3/s.components*s.byteLength;case Kn:return i*e*4/s.components*s.byteLength;case Uh:return i*e*4/s.components*s.byteLength;case yo:case bo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case So:case wo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Lc:case Oc:return Math.max(i,16)*Math.max(e,8)/4;case Dc:case kc:return Math.max(i,8)*Math.max(e,8)/2;case Uc:case Nc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Fc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Bc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case zc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Hc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Vc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Gc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case $c:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Wc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Xc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case qc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case jc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Yc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Kc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Jc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Zc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Qc:case eh:case th:return Math.ceil(i/4)*Math.ceil(e/4)*16;case nh:case ih:return Math.ceil(i/4)*Math.ceil(e/4)*8;case sh:case rh:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function z_(i){switch(i){case fi:case Xp:return{byteLength:1,components:1};case ha:case qp:case Di:return{byteLength:2,components:1};case Dh:case Lh:return{byteLength:2,components:4};case Ps:case Ih:case Ai:return{byteLength:4,components:1};case jp:case Yp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ch}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ch);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function vm(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function H_(i){const e=new WeakMap;function t(o,c){const l=o.array,d=o.usage,h=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,c,l){const d=c.array,h=c.updateRanges;if(i.bindBuffer(l,o),h.length===0)i.bufferSubData(l,0,d);else{h.sort((p,_)=>p.start-_.start);let f=0;for(let p=1;p<h.length;p++){const _=h[f],y=h[p];y.start<=_.start+_.count+1?_.count=Math.max(_.count,y.start+y.count-_.start):(++f,h[f]=y)}h.length=f+1;for(let p=0,_=h.length;p<_;p++){const y=h[p];i.bufferSubData(l,y.start*d.BYTES_PER_ELEMENT,d,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var V_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,G_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,$_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,W_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,X_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,q_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,j_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Y_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,K_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,J_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Z_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Q_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ex=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,nx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ix=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,sx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ax=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ox=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,cx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hx=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ux=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,dx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,fx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,px=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,vx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_x="gl_FragColor = linearToOutputTexel( gl_FragColor );",xx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,yx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,bx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Sx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ex=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Tx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ax=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Cx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Px=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ix=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,kx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ox=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ux=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Nx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Fx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Bx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,zx=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Hx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Gx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,$x=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Wx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Yx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Kx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Jx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ey=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ty=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ny=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,iy=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ry=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ay=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,oy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ly=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hy=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,uy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,fy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,py=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,my=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gy=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,vy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_y=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,yy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,by=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Sy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wy=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,My=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ey=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ty=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ay=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ry=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Cy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Py=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Iy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Dy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ly=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ky=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Oy=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Uy=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ny=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Fy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,By=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,zy=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Hy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vy=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$y=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xy=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,jy=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Yy=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ky=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Jy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Zy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qy=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,eb=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,nb=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ib=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sb=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rb=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ab=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ob=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,lb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,cb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hb=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ub=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,db=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fb=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pb=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,gb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vb=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_b=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,xb=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,yb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ut={alphahash_fragment:V_,alphahash_pars_fragment:G_,alphamap_fragment:$_,alphamap_pars_fragment:W_,alphatest_fragment:X_,alphatest_pars_fragment:q_,aomap_fragment:j_,aomap_pars_fragment:Y_,batching_pars_vertex:K_,batching_vertex:J_,begin_vertex:Z_,beginnormal_vertex:Q_,bsdfs:ex,iridescence_fragment:tx,bumpmap_pars_fragment:nx,clipping_planes_fragment:ix,clipping_planes_pars_fragment:sx,clipping_planes_pars_vertex:rx,clipping_planes_vertex:ax,color_fragment:ox,color_pars_fragment:lx,color_pars_vertex:cx,color_vertex:hx,common:ux,cube_uv_reflection_fragment:dx,defaultnormal_vertex:fx,displacementmap_pars_vertex:px,displacementmap_vertex:mx,emissivemap_fragment:gx,emissivemap_pars_fragment:vx,colorspace_fragment:_x,colorspace_pars_fragment:xx,envmap_fragment:yx,envmap_common_pars_fragment:bx,envmap_pars_fragment:Sx,envmap_pars_vertex:wx,envmap_physical_pars_fragment:kx,envmap_vertex:Mx,fog_vertex:Ex,fog_pars_vertex:Tx,fog_fragment:Ax,fog_pars_fragment:Rx,gradientmap_pars_fragment:Cx,lightmap_pars_fragment:Px,lights_lambert_fragment:Ix,lights_lambert_pars_fragment:Dx,lights_pars_begin:Lx,lights_toon_fragment:Ox,lights_toon_pars_fragment:Ux,lights_phong_fragment:Nx,lights_phong_pars_fragment:Fx,lights_physical_fragment:Bx,lights_physical_pars_fragment:zx,lights_fragment_begin:Hx,lights_fragment_maps:Vx,lights_fragment_end:Gx,logdepthbuf_fragment:$x,logdepthbuf_pars_fragment:Wx,logdepthbuf_pars_vertex:Xx,logdepthbuf_vertex:qx,map_fragment:jx,map_pars_fragment:Yx,map_particle_fragment:Kx,map_particle_pars_fragment:Jx,metalnessmap_fragment:Zx,metalnessmap_pars_fragment:Qx,morphinstance_vertex:ey,morphcolor_vertex:ty,morphnormal_vertex:ny,morphtarget_pars_vertex:iy,morphtarget_vertex:sy,normal_fragment_begin:ry,normal_fragment_maps:ay,normal_pars_fragment:oy,normal_pars_vertex:ly,normal_vertex:cy,normalmap_pars_fragment:hy,clearcoat_normal_fragment_begin:uy,clearcoat_normal_fragment_maps:dy,clearcoat_pars_fragment:fy,iridescence_pars_fragment:py,opaque_fragment:my,packing:gy,premultiplied_alpha_fragment:vy,project_vertex:_y,dithering_fragment:xy,dithering_pars_fragment:yy,roughnessmap_fragment:by,roughnessmap_pars_fragment:Sy,shadowmap_pars_fragment:wy,shadowmap_pars_vertex:My,shadowmap_vertex:Ey,shadowmask_pars_fragment:Ty,skinbase_vertex:Ay,skinning_pars_vertex:Ry,skinning_vertex:Cy,skinnormal_vertex:Py,specularmap_fragment:Iy,specularmap_pars_fragment:Dy,tonemapping_fragment:Ly,tonemapping_pars_fragment:ky,transmission_fragment:Oy,transmission_pars_fragment:Uy,uv_pars_fragment:Ny,uv_pars_vertex:Fy,uv_vertex:By,worldpos_vertex:zy,background_vert:Hy,background_frag:Vy,backgroundCube_vert:Gy,backgroundCube_frag:$y,cube_vert:Wy,cube_frag:Xy,depth_vert:qy,depth_frag:jy,distanceRGBA_vert:Yy,distanceRGBA_frag:Ky,equirect_vert:Jy,equirect_frag:Zy,linedashed_vert:Qy,linedashed_frag:eb,meshbasic_vert:tb,meshbasic_frag:nb,meshlambert_vert:ib,meshlambert_frag:sb,meshmatcap_vert:rb,meshmatcap_frag:ab,meshnormal_vert:ob,meshnormal_frag:lb,meshphong_vert:cb,meshphong_frag:hb,meshphysical_vert:ub,meshphysical_frag:db,meshtoon_vert:fb,meshtoon_frag:pb,points_vert:mb,points_frag:gb,shadow_vert:vb,shadow_frag:_b,sprite_vert:xb,sprite_frag:yb},Ce={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new lt},alphaMap:{value:null},alphaMapTransform:{value:new lt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new lt}},envmap:{envMap:{value:null},envMapRotation:{value:new lt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new lt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new lt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new lt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new lt},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new lt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new lt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new lt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new lt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new lt},alphaTest:{value:0},uvTransform:{value:new lt}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new Te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new lt},alphaMap:{value:null},alphaMapTransform:{value:new lt},alphaTest:{value:0}}},ai={basic:{uniforms:yn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.fog]),vertexShader:ut.meshbasic_vert,fragmentShader:ut.meshbasic_frag},lambert:{uniforms:yn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new Ze(0)}}]),vertexShader:ut.meshlambert_vert,fragmentShader:ut.meshlambert_frag},phong:{uniforms:yn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:ut.meshphong_vert,fragmentShader:ut.meshphong_frag},standard:{uniforms:yn([Ce.common,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.roughnessmap,Ce.metalnessmap,Ce.fog,Ce.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ut.meshphysical_vert,fragmentShader:ut.meshphysical_frag},toon:{uniforms:yn([Ce.common,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.gradientmap,Ce.fog,Ce.lights,{emissive:{value:new Ze(0)}}]),vertexShader:ut.meshtoon_vert,fragmentShader:ut.meshtoon_frag},matcap:{uniforms:yn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,{matcap:{value:null}}]),vertexShader:ut.meshmatcap_vert,fragmentShader:ut.meshmatcap_frag},points:{uniforms:yn([Ce.points,Ce.fog]),vertexShader:ut.points_vert,fragmentShader:ut.points_frag},dashed:{uniforms:yn([Ce.common,Ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ut.linedashed_vert,fragmentShader:ut.linedashed_frag},depth:{uniforms:yn([Ce.common,Ce.displacementmap]),vertexShader:ut.depth_vert,fragmentShader:ut.depth_frag},normal:{uniforms:yn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,{opacity:{value:1}}]),vertexShader:ut.meshnormal_vert,fragmentShader:ut.meshnormal_frag},sprite:{uniforms:yn([Ce.sprite,Ce.fog]),vertexShader:ut.sprite_vert,fragmentShader:ut.sprite_frag},background:{uniforms:{uvTransform:{value:new lt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ut.background_vert,fragmentShader:ut.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new lt}},vertexShader:ut.backgroundCube_vert,fragmentShader:ut.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ut.cube_vert,fragmentShader:ut.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ut.equirect_vert,fragmentShader:ut.equirect_frag},distanceRGBA:{uniforms:yn([Ce.common,Ce.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ut.distanceRGBA_vert,fragmentShader:ut.distanceRGBA_frag},shadow:{uniforms:yn([Ce.lights,Ce.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:ut.shadow_vert,fragmentShader:ut.shadow_frag}};ai.physical={uniforms:yn([ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new lt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new lt},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new lt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new lt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new lt},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new lt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new lt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new lt},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new lt},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new lt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new lt},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new lt}}]),vertexShader:ut.meshphysical_vert,fragmentShader:ut.meshphysical_frag};const ho={r:0,b:0,g:0},fs=new pi,bb=new Gt;function Sb(i,e,t,n,s,r,a){const o=new Ze(0);let c=r===!0?0:1,l,d,h=null,f=0,p=null;function _(A){let S=A.isScene===!0?A.background:null;return S&&S.isTexture&&(S=(A.backgroundBlurriness>0?t:e).get(S)),S}function y(A){let S=!1;const O=_(A);O===null?g(o,c):O&&O.isColor&&(g(O,1),S=!0);const k=i.xr.getEnvironmentBlendMode();k==="additive"?n.buffers.color.setClear(0,0,0,1,a):k==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(A,S){const O=_(S);O&&(O.isCubeTexture||O.mapping===Jo)?(d===void 0&&(d=new Et(new Tr(1,1,1),new Sn({name:"BackgroundCubeMaterial",uniforms:wr(ai.backgroundCube.uniforms),vertexShader:ai.backgroundCube.vertexShader,fragmentShader:ai.backgroundCube.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(k,U,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),fs.copy(S.backgroundRotation),fs.x*=-1,fs.y*=-1,fs.z*=-1,O.isCubeTexture&&O.isRenderTargetTexture===!1&&(fs.y*=-1,fs.z*=-1),d.material.uniforms.envMap.value=O,d.material.uniforms.flipEnvMap.value=O.isCubeTexture&&O.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(bb.makeRotationFromEuler(fs)),d.material.toneMapped=St.getTransfer(O.colorSpace)!==It,(h!==O||f!==O.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,h=O,f=O.version,p=i.toneMapping),d.layers.enableAll(),A.unshift(d,d.geometry,d.material,0,0,null)):O&&O.isTexture&&(l===void 0&&(l=new Et(new tl(2,2),new Sn({name:"BackgroundMaterial",uniforms:wr(ai.background.uniforms),vertexShader:ai.background.vertexShader,fragmentShader:ai.background.fragmentShader,side:ts,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=O,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=St.getTransfer(O.colorSpace)!==It,O.matrixAutoUpdate===!0&&O.updateMatrix(),l.material.uniforms.uvTransform.value.copy(O.matrix),(h!==O||f!==O.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,h=O,f=O.version,p=i.toneMapping),l.layers.enableAll(),A.unshift(l,l.geometry,l.material,0,0,null))}function g(A,S){A.getRGB(ho,om(i)),n.buffers.color.setClear(ho.r,ho.g,ho.b,S,a)}function T(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(A,S=1){o.set(A),c=S,g(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(A){c=A,g(o,c)},render:y,addToRenderList:x,dispose:T}}function wb(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(R,B,Z,I,$){let H=!1;const z=h(I,Z,B);r!==z&&(r=z,l(r.object)),H=p(R,I,Z,$),H&&_(R,I,Z,$),$!==null&&e.update($,i.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,S(R,B,Z,I),$!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function c(){return i.createVertexArray()}function l(R){return i.bindVertexArray(R)}function d(R){return i.deleteVertexArray(R)}function h(R,B,Z){const I=Z.wireframe===!0;let $=n[R.id];$===void 0&&($={},n[R.id]=$);let H=$[B.id];H===void 0&&(H={},$[B.id]=H);let z=H[I];return z===void 0&&(z=f(c()),H[I]=z),z}function f(R){const B=[],Z=[],I=[];for(let $=0;$<t;$++)B[$]=0,Z[$]=0,I[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:Z,attributeDivisors:I,object:R,attributes:{},index:null}}function p(R,B,Z,I){const $=r.attributes,H=B.attributes;let z=0;const W=Z.getAttributes();for(const X in W)if(W[X].location>=0){const fe=$[X];let Se=H[X];if(Se===void 0&&(X==="instanceMatrix"&&R.instanceMatrix&&(Se=R.instanceMatrix),X==="instanceColor"&&R.instanceColor&&(Se=R.instanceColor)),fe===void 0||fe.attribute!==Se||Se&&fe.data!==Se.data)return!0;z++}return r.attributesNum!==z||r.index!==I}function _(R,B,Z,I){const $={},H=B.attributes;let z=0;const W=Z.getAttributes();for(const X in W)if(W[X].location>=0){let fe=H[X];fe===void 0&&(X==="instanceMatrix"&&R.instanceMatrix&&(fe=R.instanceMatrix),X==="instanceColor"&&R.instanceColor&&(fe=R.instanceColor));const Se={};Se.attribute=fe,fe&&fe.data&&(Se.data=fe.data),$[X]=Se,z++}r.attributes=$,r.attributesNum=z,r.index=I}function y(){const R=r.newAttributes;for(let B=0,Z=R.length;B<Z;B++)R[B]=0}function x(R){g(R,0)}function g(R,B){const Z=r.newAttributes,I=r.enabledAttributes,$=r.attributeDivisors;Z[R]=1,I[R]===0&&(i.enableVertexAttribArray(R),I[R]=1),$[R]!==B&&(i.vertexAttribDivisor(R,B),$[R]=B)}function T(){const R=r.newAttributes,B=r.enabledAttributes;for(let Z=0,I=B.length;Z<I;Z++)B[Z]!==R[Z]&&(i.disableVertexAttribArray(Z),B[Z]=0)}function A(R,B,Z,I,$,H,z){z===!0?i.vertexAttribIPointer(R,B,Z,$,H):i.vertexAttribPointer(R,B,Z,I,$,H)}function S(R,B,Z,I){y();const $=I.attributes,H=Z.getAttributes(),z=B.defaultAttributeValues;for(const W in H){const X=H[W];if(X.location>=0){let de=$[W];if(de===void 0&&(W==="instanceMatrix"&&R.instanceMatrix&&(de=R.instanceMatrix),W==="instanceColor"&&R.instanceColor&&(de=R.instanceColor)),de!==void 0){const fe=de.normalized,Se=de.itemSize,Ne=e.get(de);if(Ne===void 0)continue;const ct=Ne.buffer,mt=Ne.type,pt=Ne.bytesPerElement,ue=mt===i.INT||mt===i.UNSIGNED_INT||de.gpuType===Ih;if(de.isInterleavedBufferAttribute){const pe=de.data,Ae=pe.stride,nt=de.offset;if(pe.isInstancedInterleavedBuffer){for(let Ge=0;Ge<X.locationSize;Ge++)g(X.location+Ge,pe.meshPerAttribute);R.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let Ge=0;Ge<X.locationSize;Ge++)x(X.location+Ge);i.bindBuffer(i.ARRAY_BUFFER,ct);for(let Ge=0;Ge<X.locationSize;Ge++)A(X.location+Ge,Se/X.locationSize,mt,fe,Ae*pt,(nt+Se/X.locationSize*Ge)*pt,ue)}else{if(de.isInstancedBufferAttribute){for(let pe=0;pe<X.locationSize;pe++)g(X.location+pe,de.meshPerAttribute);R.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let pe=0;pe<X.locationSize;pe++)x(X.location+pe);i.bindBuffer(i.ARRAY_BUFFER,ct);for(let pe=0;pe<X.locationSize;pe++)A(X.location+pe,Se/X.locationSize,mt,fe,Se*pt,Se/X.locationSize*pe*pt,ue)}}else if(z!==void 0){const fe=z[W];if(fe!==void 0)switch(fe.length){case 2:i.vertexAttrib2fv(X.location,fe);break;case 3:i.vertexAttrib3fv(X.location,fe);break;case 4:i.vertexAttrib4fv(X.location,fe);break;default:i.vertexAttrib1fv(X.location,fe)}}}}T()}function O(){P();for(const R in n){const B=n[R];for(const Z in B){const I=B[Z];for(const $ in I)d(I[$].object),delete I[$];delete B[Z]}delete n[R]}}function k(R){if(n[R.id]===void 0)return;const B=n[R.id];for(const Z in B){const I=B[Z];for(const $ in I)d(I[$].object),delete I[$];delete B[Z]}delete n[R.id]}function U(R){for(const B in n){const Z=n[B];if(Z[R.id]===void 0)continue;const I=Z[R.id];for(const $ in I)d(I[$].object),delete I[$];delete Z[R.id]}}function P(){E(),a=!0,r!==s&&(r=s,l(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:E,dispose:O,releaseStatesOfGeometry:k,releaseStatesOfProgram:U,initAttributes:y,enableAttribute:x,disableUnusedAttributes:T}}function Mb(i,e,t){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),t.update(d,n,1)}function a(l,d,h){h!==0&&(i.drawArraysInstanced(n,l,d,h),t.update(d,n,h))}function o(l,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,h);let p=0;for(let _=0;_<h;_++)p+=d[_];t.update(p,n,1)}function c(l,d,h,f){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<l.length;_++)a(l[_],d[_],f[_]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,h);let _=0;for(let y=0;y<h;y++)_+=d[y]*f[y];t.update(_,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Eb(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const U=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(U){return!(U!==Kn&&n.convert(U)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(U){const P=U===Di&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(U!==fi&&n.convert(U)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&U!==Ai&&!P)}function c(U){if(U==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";U="mediump"}return U==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const h=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),O=_>0,k=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:_,maxTextureSize:y,maxCubemapSize:x,maxAttributes:g,maxVertexUniforms:T,maxVaryings:A,maxFragmentUniforms:S,vertexTextures:O,maxSamples:k}}function Tb(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new gs,o=new lt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||n!==0||s;return s=f,n=h.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=d(h,f,0)},this.setState=function(h,f,p){const _=h.clippingPlanes,y=h.clipIntersection,x=h.clipShadows,g=i.get(h);if(!s||_===null||_.length===0||r&&!x)r?d(null):l();else{const T=r?0:n,A=T*4;let S=g.clippingState||null;c.value=S,S=d(_,f,A,p);for(let O=0;O!==A;++O)S[O]=t[O];g.clippingState=S,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=T}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(h,f,p,_){const y=h!==null?h.length:0;let x=null;if(y!==0){if(x=c.value,_!==!0||x===null){const g=p+y*4,T=f.matrixWorldInverse;o.getNormalMatrix(T),(x===null||x.length<g)&&(x=new Float32Array(g));for(let A=0,S=p;A!==y;++A,S+=4)a.copy(h[A]).applyMatrix4(T,o),a.normal.toArray(x,S),x[S+3]=a.constant}c.value=x,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,x}}function Ab(i){let e=new WeakMap;function t(a,o){return o===Rc?a.mapping=yr:o===Cc&&(a.mapping=br),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Rc||o===Cc)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new c_(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const fr=4,Hd=[.125,.215,.35,.446,.526,.582],Ss=20,Zl=new Yh,Vd=new Ze;let Ql=null,ec=0,tc=0,nc=!1;const vs=(1+Math.sqrt(5))/2,rr=1/vs,Gd=[new N(-vs,rr,0),new N(vs,rr,0),new N(-rr,0,vs),new N(rr,0,vs),new N(0,vs,-rr),new N(0,vs,rr),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],Rb=new N;class $d{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Rb}=r;Ql=this._renderer.getRenderTarget(),ec=this._renderer.getActiveCubeFace(),tc=this._renderer.getActiveMipmapLevel(),nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ql,ec,tc),this._renderer.xr.enabled=nc,e.scissorTest=!1,uo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===yr||e.mapping===br?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ql=this._renderer.getRenderTarget(),ec=this._renderer.getActiveCubeFace(),tc=this._renderer.getActiveMipmapLevel(),nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:hi,minFilter:hi,generateMipmaps:!1,type:Di,format:Kn,colorSpace:Sr,depthBuffer:!1},s=Wd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wd(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Cb(r)),this._blurMaterial=Pb(r,e,t)}return s}_compileMaterial(e){const t=new Et(this._lodPlanes[0],e);this._renderer.compile(t,Zl)}_sceneToCubeUV(e,t,n,s,r){const c=new kn(90,1,t,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor(Vd),h.toneMapping=Qi,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));const y=new Bn({name:"PMREM.Background",side:Rn,depthWrite:!1,depthTest:!1}),x=new Et(new Tr,y);let g=!1;const T=e.background;T?T.isColor&&(y.color.copy(T),e.background=null,g=!0):(y.color.copy(Vd),g=!0);for(let A=0;A<6;A++){const S=A%3;S===0?(c.up.set(0,l[A],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[A],r.y,r.z)):S===1?(c.up.set(0,0,l[A]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[A],r.z)):(c.up.set(0,l[A],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[A]));const O=this._cubeSize;uo(s,S*O,A>2?O:0,O,O),h.setRenderTarget(s),g&&h.render(x,c),h.render(e,c)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=p,h.autoClear=f,e.background=T}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===yr||e.mapping===br;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=qd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Et(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;uo(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Zl)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Gd[(s-r-1)%Gd.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new Et(this._lodPlanes[s],l),f=l.uniforms,p=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Ss-1),y=r/_,x=isFinite(r)?1+Math.floor(d*y):Ss;x>Ss&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Ss}`);const g=[];let T=0;for(let U=0;U<Ss;++U){const P=U/y,E=Math.exp(-P*P/2);g.push(E),U===0?T+=E:U<x&&(T+=2*E)}for(let U=0;U<g.length;U++)g[U]=g[U]/T;f.envMap.value=e.texture,f.samples.value=x,f.weights.value=g,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:A}=this;f.dTheta.value=_,f.mipInt.value=A-n;const S=this._sizeLods[s],O=3*S*(s>A-fr?s-A+fr:0),k=4*(this._cubeSize-S);uo(t,O,k,3*S,2*S),c.setRenderTarget(t),c.render(h,Zl)}}function Cb(i){const e=[],t=[],n=[];let s=i;const r=i-fr+1+Hd.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>i-fr?c=Hd[a-i+fr-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),d=-l,h=1+l,f=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,_=6,y=3,x=2,g=1,T=new Float32Array(y*_*p),A=new Float32Array(x*_*p),S=new Float32Array(g*_*p);for(let k=0;k<p;k++){const U=k%3*2/3-1,P=k>2?0:-1,E=[U,P,0,U+2/3,P,0,U+2/3,P+1,0,U,P,0,U+2/3,P+1,0,U,P+1,0];T.set(E,y*_*k),A.set(f,x*_*k);const R=[k,k,k,k,k,k];S.set(R,g*_*k)}const O=new Kt;O.setAttribute("position",new Cn(T,y)),O.setAttribute("uv",new Cn(A,x)),O.setAttribute("faceIndex",new Cn(S,g)),e.push(O),s>fr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Wd(i,e,t){const n=new Zn(i,e,t);return n.texture.mapping=Jo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function uo(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Pb(i,e,t){const n=new Float32Array(Ss),s=new N(0,1,0);return new Sn({name:"SphericalGaussianBlur",defines:{n:Ss,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Kh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function Xd(){return new Sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Kh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function qd(){return new Sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function Kh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ib(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Rc||c===Cc,d=c===yr||c===br;if(l||d){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new $d(i)),h=l?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return l&&p&&p.height>0||d&&p&&s(p)?(t===null&&(t=new $d(i)),h=l?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Db(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&ma("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Lb(i,e,t,n){const s={},r=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",a),delete s[f.id];const p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(h){const f=h.attributes;for(const p in f)e.update(f[p],i.ARRAY_BUFFER)}function l(h){const f=[],p=h.index,_=h.attributes.position;let y=0;if(p!==null){const T=p.array;y=p.version;for(let A=0,S=T.length;A<S;A+=3){const O=T[A+0],k=T[A+1],U=T[A+2];f.push(O,k,k,U,U,O)}}else if(_!==void 0){const T=_.array;y=_.version;for(let A=0,S=T.length/3-1;A<S;A+=3){const O=A+0,k=A+1,U=A+2;f.push(O,k,k,U,U,O)}}else return;const x=new(nm(f)?am:rm)(f,1);x.version=y;const g=r.get(h);g&&e.remove(g),r.set(h,x)}function d(h){const f=r.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&l(h)}else l(h);return r.get(h)}return{get:o,update:c,getWireframeAttribute:d}}function kb(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,p){i.drawElements(n,p,r,f*a),t.update(p,n,1)}function l(f,p,_){_!==0&&(i.drawElementsInstanced(n,p,r,f*a,_),t.update(p,n,_))}function d(f,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,_);let x=0;for(let g=0;g<_;g++)x+=p[g];t.update(x,n,1)}function h(f,p,_,y){if(_===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let g=0;g<f.length;g++)l(f[g]/a,p[g],y[g]);else{x.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,y,0,_);let g=0;for(let T=0;T<_;T++)g+=p[T]*y[T];t.update(g,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function Ob(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Ub(i,e,t){const n=new WeakMap,s=new Ot;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0;let f=n.get(o);if(f===void 0||f.count!==h){let R=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",R)};var p=R;f!==void 0&&f.texture.dispose();const _=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],T=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let S=0;_===!0&&(S=1),y===!0&&(S=2),x===!0&&(S=3);let O=o.attributes.position.count*S,k=1;O>e.maxTextureSize&&(k=Math.ceil(O/e.maxTextureSize),O=e.maxTextureSize);const U=new Float32Array(O*k*4*h),P=new im(U,O,k,h);P.type=Ai,P.needsUpdate=!0;const E=S*4;for(let B=0;B<h;B++){const Z=g[B],I=T[B],$=A[B],H=O*k*4*B;for(let z=0;z<Z.count;z++){const W=z*E;_===!0&&(s.fromBufferAttribute(Z,z),U[H+W+0]=s.x,U[H+W+1]=s.y,U[H+W+2]=s.z,U[H+W+3]=0),y===!0&&(s.fromBufferAttribute(I,z),U[H+W+4]=s.x,U[H+W+5]=s.y,U[H+W+6]=s.z,U[H+W+7]=0),x===!0&&(s.fromBufferAttribute($,z),U[H+W+8]=s.x,U[H+W+9]=s.y,U[H+W+10]=s.z,U[H+W+11]=$.itemSize===4?s.w:1)}}f={count:h,texture:P,size:new Te(O,k)},n.set(o,f),o.addEventListener("dispose",R)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let _=0;for(let x=0;x<l.length;x++)_+=l[x];const y=o.morphTargetsRelative?1:1-_;c.getUniforms().setValue(i,"morphTargetBaseInfluence",y),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Nb(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,h=e.get(c,d);if(s.get(h)!==l&&(e.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return h}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const _m=new Mn,jd=new um(1,1),xm=new im,ym=new qv,bm=new cm,Yd=[],Kd=[],Jd=new Float32Array(16),Zd=new Float32Array(9),Qd=new Float32Array(4);function Ar(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Yd[s];if(r===void 0&&(r=new Float32Array(s),Yd[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function nn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function sn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function il(i,e){let t=Kd[e];t===void 0&&(t=new Int32Array(e),Kd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Fb(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Bb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;i.uniform2fv(this.addr,e),sn(t,e)}}function zb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(nn(t,e))return;i.uniform3fv(this.addr,e),sn(t,e)}}function Hb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;i.uniform4fv(this.addr,e),sn(t,e)}}function Vb(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(nn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),sn(t,e)}else{if(nn(t,n))return;Qd.set(n),i.uniformMatrix2fv(this.addr,!1,Qd),sn(t,n)}}function Gb(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(nn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),sn(t,e)}else{if(nn(t,n))return;Zd.set(n),i.uniformMatrix3fv(this.addr,!1,Zd),sn(t,n)}}function $b(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(nn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),sn(t,e)}else{if(nn(t,n))return;Jd.set(n),i.uniformMatrix4fv(this.addr,!1,Jd),sn(t,n)}}function Wb(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Xb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;i.uniform2iv(this.addr,e),sn(t,e)}}function qb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(nn(t,e))return;i.uniform3iv(this.addr,e),sn(t,e)}}function jb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;i.uniform4iv(this.addr,e),sn(t,e)}}function Yb(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Kb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;i.uniform2uiv(this.addr,e),sn(t,e)}}function Jb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(nn(t,e))return;i.uniform3uiv(this.addr,e),sn(t,e)}}function Zb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;i.uniform4uiv(this.addr,e),sn(t,e)}}function Qb(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(jd.compareFunction=tm,r=jd):r=_m,t.setTexture2D(e||r,s)}function eS(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ym,s)}function tS(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||bm,s)}function nS(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||xm,s)}function iS(i){switch(i){case 5126:return Fb;case 35664:return Bb;case 35665:return zb;case 35666:return Hb;case 35674:return Vb;case 35675:return Gb;case 35676:return $b;case 5124:case 35670:return Wb;case 35667:case 35671:return Xb;case 35668:case 35672:return qb;case 35669:case 35673:return jb;case 5125:return Yb;case 36294:return Kb;case 36295:return Jb;case 36296:return Zb;case 35678:case 36198:case 36298:case 36306:case 35682:return Qb;case 35679:case 36299:case 36307:return eS;case 35680:case 36300:case 36308:case 36293:return tS;case 36289:case 36303:case 36311:case 36292:return nS}}function sS(i,e){i.uniform1fv(this.addr,e)}function rS(i,e){const t=Ar(e,this.size,2);i.uniform2fv(this.addr,t)}function aS(i,e){const t=Ar(e,this.size,3);i.uniform3fv(this.addr,t)}function oS(i,e){const t=Ar(e,this.size,4);i.uniform4fv(this.addr,t)}function lS(i,e){const t=Ar(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function cS(i,e){const t=Ar(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function hS(i,e){const t=Ar(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function uS(i,e){i.uniform1iv(this.addr,e)}function dS(i,e){i.uniform2iv(this.addr,e)}function fS(i,e){i.uniform3iv(this.addr,e)}function pS(i,e){i.uniform4iv(this.addr,e)}function mS(i,e){i.uniform1uiv(this.addr,e)}function gS(i,e){i.uniform2uiv(this.addr,e)}function vS(i,e){i.uniform3uiv(this.addr,e)}function _S(i,e){i.uniform4uiv(this.addr,e)}function xS(i,e,t){const n=this.cache,s=e.length,r=il(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||_m,r[a])}function yS(i,e,t){const n=this.cache,s=e.length,r=il(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||ym,r[a])}function bS(i,e,t){const n=this.cache,s=e.length,r=il(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||bm,r[a])}function SS(i,e,t){const n=this.cache,s=e.length,r=il(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||xm,r[a])}function wS(i){switch(i){case 5126:return sS;case 35664:return rS;case 35665:return aS;case 35666:return oS;case 35674:return lS;case 35675:return cS;case 35676:return hS;case 5124:case 35670:return uS;case 35667:case 35671:return dS;case 35668:case 35672:return fS;case 35669:case 35673:return pS;case 5125:return mS;case 36294:return gS;case 36295:return vS;case 36296:return _S;case 35678:case 36198:case 36298:case 36306:case 35682:return xS;case 35679:case 36299:case 36307:return yS;case 35680:case 36300:case 36308:case 36293:return bS;case 36289:case 36303:case 36311:case 36292:return SS}}class MS{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=iS(t.type)}}class ES{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=wS(t.type)}}class TS{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const ic=/(\w+)(\])?(\[|\.)?/g;function ef(i,e){i.seq.push(e),i.map[e.id]=e}function AS(i,e,t){const n=i.name,s=n.length;for(ic.lastIndex=0;;){const r=ic.exec(n),a=ic.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){ef(t,l===void 0?new MS(o,i,e):new ES(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new TS(o),ef(t,h)),t=h}}}class Mo{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);AS(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function tf(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const RS=37297;let CS=0;function PS(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const nf=new lt;function IS(i){St._getMatrix(nf,St.workingColorSpace,i);const e=`mat3( ${nf.elements.map(t=>t.toFixed(4))} )`;switch(St.getTransfer(i)){case Oo:return[e,"LinearTransferOETF"];case It:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function sf(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+PS(i.getShaderSource(e),o)}else return r}function DS(i,e){const t=IS(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function LS(i,e){let t;switch(e){case Bp:t="Linear";break;case zp:t="Reinhard";break;case Hp:t="Cineon";break;case Ph:t="ACESFilmic";break;case Gp:t="AgX";break;case $p:t="Neutral";break;case Vp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const fo=new N;function kS(){St.getLuminanceCoefficients(fo);const i=fo.x.toFixed(4),e=fo.y.toFixed(4),t=fo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function OS(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Kr).join(`
`)}function US(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function NS(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Kr(i){return i!==""}function rf(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function af(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const FS=/^[ \t]*#include +<([\w\d./]+)>/gm;function hh(i){return i.replace(FS,zS)}const BS=new Map;function zS(i,e){let t=ut[e];if(t===void 0){const n=BS.get(e);if(n!==void 0)t=ut[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return hh(t)}const HS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function of(i){return i.replace(HS,VS)}function VS(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function lf(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function GS(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Up?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Np?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ei&&(e="SHADOWMAP_TYPE_VSM"),e}function $S(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case yr:case br:e="ENVMAP_TYPE_CUBE";break;case Jo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function WS(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case br:e="ENVMAP_MODE_REFRACTION";break}return e}function XS(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Fp:e="ENVMAP_BLENDING_MULTIPLY";break;case hv:e="ENVMAP_BLENDING_MIX";break;case uv:e="ENVMAP_BLENDING_ADD";break}return e}function qS(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function jS(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=GS(t),l=$S(t),d=WS(t),h=XS(t),f=qS(t),p=OS(t),_=US(r),y=s.createProgram();let x,g,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Kr).join(`
`),x.length>0&&(x+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Kr).join(`
`),g.length>0&&(g+=`
`)):(x=[lf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Kr).join(`
`),g=[lf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qi?"#define TONE_MAPPING":"",t.toneMapping!==Qi?ut.tonemapping_pars_fragment:"",t.toneMapping!==Qi?LS("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ut.colorspace_pars_fragment,DS("linearToOutputTexel",t.outputColorSpace),kS(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Kr).join(`
`)),a=hh(a),a=rf(a,t),a=af(a,t),o=hh(o),o=rf(o,t),o=af(o,t),a=of(a),o=of(o),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,x=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,g=["#define varying in",t.glslVersion===hd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===hd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const A=T+x+a,S=T+g+o,O=tf(s,s.VERTEX_SHADER,A),k=tf(s,s.FRAGMENT_SHADER,S);s.attachShader(y,O),s.attachShader(y,k),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function U(B){if(i.debug.checkShaderErrors){const Z=s.getProgramInfoLog(y)||"",I=s.getShaderInfoLog(O)||"",$=s.getShaderInfoLog(k)||"",H=Z.trim(),z=I.trim(),W=$.trim();let X=!0,de=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,O,k);else{const fe=sf(s,O,"vertex"),Se=sf(s,k,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+H+`
`+fe+`
`+Se)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(z===""||W==="")&&(de=!1);de&&(B.diagnostics={runnable:X,programLog:H,vertexShader:{log:z,prefix:x},fragmentShader:{log:W,prefix:g}})}s.deleteShader(O),s.deleteShader(k),P=new Mo(s,y),E=NS(s,y)}let P;this.getUniforms=function(){return P===void 0&&U(this),P};let E;this.getAttributes=function(){return E===void 0&&U(this),E};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(y,RS)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=CS++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=O,this.fragmentShader=k,this}let YS=0;class KS{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new JS(e),t.set(e,n)),n}}class JS{constructor(e){this.id=YS++,this.code=e,this.usedTimes=0}}function ZS(i,e,t,n,s,r,a){const o=new zh,c=new KS,l=new Set,d=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(E){return l.add(E),E===0?"uv":`uv${E}`}function x(E,R,B,Z,I){const $=Z.fog,H=I.geometry,z=E.isMeshStandardMaterial?Z.environment:null,W=(E.isMeshStandardMaterial?t:e).get(E.envMap||z),X=W&&W.mapping===Jo?W.image.height:null,de=_[E.type];E.precision!==null&&(p=s.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const fe=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Se=fe!==void 0?fe.length:0;let Ne=0;H.morphAttributes.position!==void 0&&(Ne=1),H.morphAttributes.normal!==void 0&&(Ne=2),H.morphAttributes.color!==void 0&&(Ne=3);let ct,mt,pt,ue;if(de){const yt=ai[de];ct=yt.vertexShader,mt=yt.fragmentShader}else ct=E.vertexShader,mt=E.fragmentShader,c.update(E),pt=c.getVertexShaderID(E),ue=c.getFragmentShaderID(E);const pe=i.getRenderTarget(),Ae=i.state.buffers.depth.getReversed(),nt=I.isInstancedMesh===!0,Ge=I.isBatchedMesh===!0,gt=!!E.map,rn=!!E.matcap,F=!!W,zt=!!E.aoMap,ot=!!E.lightMap,it=!!E.bumpMap,Be=!!E.normalMap,Ut=!!E.displacementMap,ze=!!E.emissiveMap,Qe=!!E.metalnessMap,$t=!!E.roughnessMap,Wt=E.anisotropy>0,L=E.clearcoat>0,M=E.dispersion>0,ee=E.iridescence>0,ce=E.sheen>0,me=E.transmission>0,re=Wt&&!!E.anisotropyMap,je=L&&!!E.clearcoatMap,we=L&&!!E.clearcoatNormalMap,Xe=L&&!!E.clearcoatRoughnessMap,Ue=ee&&!!E.iridescenceMap,ye=ee&&!!E.iridescenceThicknessMap,ke=ce&&!!E.sheenColorMap,qe=ce&&!!E.sheenRoughnessMap,We=!!E.specularMap,Re=!!E.specularColorMap,et=!!E.specularIntensityMap,V=me&&!!E.transmissionMap,be=me&&!!E.thicknessMap,xe=!!E.gradientMap,Oe=!!E.alphaMap,_e=E.alphaTest>0,oe=!!E.alphaHash,$e=!!E.extensions;let st=Qi;E.toneMapped&&(pe===null||pe.isXRRenderTarget===!0)&&(st=i.toneMapping);const Tt={shaderID:de,shaderType:E.type,shaderName:E.name,vertexShader:ct,fragmentShader:mt,defines:E.defines,customVertexShaderID:pt,customFragmentShaderID:ue,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:Ge,batchingColor:Ge&&I._colorsTexture!==null,instancing:nt,instancingColor:nt&&I.instanceColor!==null,instancingMorph:nt&&I.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:pe===null?i.outputColorSpace:pe.isXRRenderTarget===!0?pe.texture.colorSpace:Sr,alphaToCoverage:!!E.alphaToCoverage,map:gt,matcap:rn,envMap:F,envMapMode:F&&W.mapping,envMapCubeUVHeight:X,aoMap:zt,lightMap:ot,bumpMap:it,normalMap:Be,displacementMap:f&&Ut,emissiveMap:ze,normalMapObjectSpace:Be&&E.normalMapType===mv,normalMapTangentSpace:Be&&E.normalMapType===em,metalnessMap:Qe,roughnessMap:$t,anisotropy:Wt,anisotropyMap:re,clearcoat:L,clearcoatMap:je,clearcoatNormalMap:we,clearcoatRoughnessMap:Xe,dispersion:M,iridescence:ee,iridescenceMap:Ue,iridescenceThicknessMap:ye,sheen:ce,sheenColorMap:ke,sheenRoughnessMap:qe,specularMap:We,specularColorMap:Re,specularIntensityMap:et,transmission:me,transmissionMap:V,thicknessMap:be,gradientMap:xe,opaque:E.transparent===!1&&E.blending===pr&&E.alphaToCoverage===!1,alphaMap:Oe,alphaTest:_e,alphaHash:oe,combine:E.combine,mapUv:gt&&y(E.map.channel),aoMapUv:zt&&y(E.aoMap.channel),lightMapUv:ot&&y(E.lightMap.channel),bumpMapUv:it&&y(E.bumpMap.channel),normalMapUv:Be&&y(E.normalMap.channel),displacementMapUv:Ut&&y(E.displacementMap.channel),emissiveMapUv:ze&&y(E.emissiveMap.channel),metalnessMapUv:Qe&&y(E.metalnessMap.channel),roughnessMapUv:$t&&y(E.roughnessMap.channel),anisotropyMapUv:re&&y(E.anisotropyMap.channel),clearcoatMapUv:je&&y(E.clearcoatMap.channel),clearcoatNormalMapUv:we&&y(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Xe&&y(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Ue&&y(E.iridescenceMap.channel),iridescenceThicknessMapUv:ye&&y(E.iridescenceThicknessMap.channel),sheenColorMapUv:ke&&y(E.sheenColorMap.channel),sheenRoughnessMapUv:qe&&y(E.sheenRoughnessMap.channel),specularMapUv:We&&y(E.specularMap.channel),specularColorMapUv:Re&&y(E.specularColorMap.channel),specularIntensityMapUv:et&&y(E.specularIntensityMap.channel),transmissionMapUv:V&&y(E.transmissionMap.channel),thicknessMapUv:be&&y(E.thicknessMap.channel),alphaMapUv:Oe&&y(E.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(Be||Wt),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!H.attributes.uv&&(gt||Oe),fog:!!$,useFog:E.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Ae,skinning:I.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Se,morphTextureStride:Ne,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&B.length>0,shadowMapType:i.shadowMap.type,toneMapping:st,decodeVideoTexture:gt&&E.map.isVideoTexture===!0&&St.getTransfer(E.map.colorSpace)===It,decodeVideoTextureEmissive:ze&&E.emissiveMap.isVideoTexture===!0&&St.getTransfer(E.emissiveMap.colorSpace)===It,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===On,flipSided:E.side===Rn,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:$e&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:($e&&E.extensions.multiDraw===!0||Ge)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Tt.vertexUv1s=l.has(1),Tt.vertexUv2s=l.has(2),Tt.vertexUv3s=l.has(3),l.clear(),Tt}function g(E){const R=[];if(E.shaderID?R.push(E.shaderID):(R.push(E.customVertexShaderID),R.push(E.customFragmentShaderID)),E.defines!==void 0)for(const B in E.defines)R.push(B),R.push(E.defines[B]);return E.isRawShaderMaterial===!1&&(T(R,E),A(R,E),R.push(i.outputColorSpace)),R.push(E.customProgramCacheKey),R.join()}function T(E,R){E.push(R.precision),E.push(R.outputColorSpace),E.push(R.envMapMode),E.push(R.envMapCubeUVHeight),E.push(R.mapUv),E.push(R.alphaMapUv),E.push(R.lightMapUv),E.push(R.aoMapUv),E.push(R.bumpMapUv),E.push(R.normalMapUv),E.push(R.displacementMapUv),E.push(R.emissiveMapUv),E.push(R.metalnessMapUv),E.push(R.roughnessMapUv),E.push(R.anisotropyMapUv),E.push(R.clearcoatMapUv),E.push(R.clearcoatNormalMapUv),E.push(R.clearcoatRoughnessMapUv),E.push(R.iridescenceMapUv),E.push(R.iridescenceThicknessMapUv),E.push(R.sheenColorMapUv),E.push(R.sheenRoughnessMapUv),E.push(R.specularMapUv),E.push(R.specularColorMapUv),E.push(R.specularIntensityMapUv),E.push(R.transmissionMapUv),E.push(R.thicknessMapUv),E.push(R.combine),E.push(R.fogExp2),E.push(R.sizeAttenuation),E.push(R.morphTargetsCount),E.push(R.morphAttributeCount),E.push(R.numDirLights),E.push(R.numPointLights),E.push(R.numSpotLights),E.push(R.numSpotLightMaps),E.push(R.numHemiLights),E.push(R.numRectAreaLights),E.push(R.numDirLightShadows),E.push(R.numPointLightShadows),E.push(R.numSpotLightShadows),E.push(R.numSpotLightShadowsWithMaps),E.push(R.numLightProbes),E.push(R.shadowMapType),E.push(R.toneMapping),E.push(R.numClippingPlanes),E.push(R.numClipIntersection),E.push(R.depthPacking)}function A(E,R){o.disableAll(),R.supportsVertexTextures&&o.enable(0),R.instancing&&o.enable(1),R.instancingColor&&o.enable(2),R.instancingMorph&&o.enable(3),R.matcap&&o.enable(4),R.envMap&&o.enable(5),R.normalMapObjectSpace&&o.enable(6),R.normalMapTangentSpace&&o.enable(7),R.clearcoat&&o.enable(8),R.iridescence&&o.enable(9),R.alphaTest&&o.enable(10),R.vertexColors&&o.enable(11),R.vertexAlphas&&o.enable(12),R.vertexUv1s&&o.enable(13),R.vertexUv2s&&o.enable(14),R.vertexUv3s&&o.enable(15),R.vertexTangents&&o.enable(16),R.anisotropy&&o.enable(17),R.alphaHash&&o.enable(18),R.batching&&o.enable(19),R.dispersion&&o.enable(20),R.batchingColor&&o.enable(21),R.gradientMap&&o.enable(22),E.push(o.mask),o.disableAll(),R.fog&&o.enable(0),R.useFog&&o.enable(1),R.flatShading&&o.enable(2),R.logarithmicDepthBuffer&&o.enable(3),R.reversedDepthBuffer&&o.enable(4),R.skinning&&o.enable(5),R.morphTargets&&o.enable(6),R.morphNormals&&o.enable(7),R.morphColors&&o.enable(8),R.premultipliedAlpha&&o.enable(9),R.shadowMapEnabled&&o.enable(10),R.doubleSided&&o.enable(11),R.flipSided&&o.enable(12),R.useDepthPacking&&o.enable(13),R.dithering&&o.enable(14),R.transmission&&o.enable(15),R.sheen&&o.enable(16),R.opaque&&o.enable(17),R.pointsUvs&&o.enable(18),R.decodeVideoTexture&&o.enable(19),R.decodeVideoTextureEmissive&&o.enable(20),R.alphaToCoverage&&o.enable(21),E.push(o.mask)}function S(E){const R=_[E.type];let B;if(R){const Z=ai[R];B=ga.clone(Z.uniforms)}else B=E.uniforms;return B}function O(E,R){let B;for(let Z=0,I=d.length;Z<I;Z++){const $=d[Z];if($.cacheKey===R){B=$,++B.usedTimes;break}}return B===void 0&&(B=new jS(i,R,E,r),d.push(B)),B}function k(E){if(--E.usedTimes===0){const R=d.indexOf(E);d[R]=d[d.length-1],d.pop(),E.destroy()}}function U(E){c.remove(E)}function P(){c.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:S,acquireProgram:O,releaseProgram:k,releaseShaderCache:U,programs:d,dispose:P}}function QS(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function ew(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function cf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function hf(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h,f,p,_,y,x){let g=i[e];return g===void 0?(g={id:h.id,object:h,geometry:f,material:p,groupOrder:_,renderOrder:h.renderOrder,z:y,group:x},i[e]=g):(g.id=h.id,g.object=h,g.geometry=f,g.material=p,g.groupOrder=_,g.renderOrder=h.renderOrder,g.z=y,g.group=x),e++,g}function o(h,f,p,_,y,x){const g=a(h,f,p,_,y,x);p.transmission>0?n.push(g):p.transparent===!0?s.push(g):t.push(g)}function c(h,f,p,_,y,x){const g=a(h,f,p,_,y,x);p.transmission>0?n.unshift(g):p.transparent===!0?s.unshift(g):t.unshift(g)}function l(h,f){t.length>1&&t.sort(h||ew),n.length>1&&n.sort(f||cf),s.length>1&&s.sort(f||cf)}function d(){for(let h=e,f=i.length;h<f;h++){const p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function tw(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new hf,i.set(n,[a])):s>=r.length?(a=new hf,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function nw(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new Ze};break;case"SpotLight":t={position:new N,direction:new N,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new N,halfWidth:new N,halfHeight:new N};break}return i[e.id]=t,t}}}function iw(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let sw=0;function rw(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function aw(i){const e=new nw,t=iw(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new N);const s=new N,r=new Gt,a=new Gt;function o(l){let d=0,h=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let p=0,_=0,y=0,x=0,g=0,T=0,A=0,S=0,O=0,k=0,U=0;l.sort(rw);for(let E=0,R=l.length;E<R;E++){const B=l[E],Z=B.color,I=B.intensity,$=B.distance,H=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)d+=Z.r*I,h+=Z.g*I,f+=Z.b*I;else if(B.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(B.sh.coefficients[z],I);U++}else if(B.isDirectionalLight){const z=e.get(B);if(z.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const W=B.shadow,X=t.get(B);X.shadowIntensity=W.intensity,X.shadowBias=W.bias,X.shadowNormalBias=W.normalBias,X.shadowRadius=W.radius,X.shadowMapSize=W.mapSize,n.directionalShadow[p]=X,n.directionalShadowMap[p]=H,n.directionalShadowMatrix[p]=B.shadow.matrix,T++}n.directional[p]=z,p++}else if(B.isSpotLight){const z=e.get(B);z.position.setFromMatrixPosition(B.matrixWorld),z.color.copy(Z).multiplyScalar(I),z.distance=$,z.coneCos=Math.cos(B.angle),z.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),z.decay=B.decay,n.spot[y]=z;const W=B.shadow;if(B.map&&(n.spotLightMap[O]=B.map,O++,W.updateMatrices(B),B.castShadow&&k++),n.spotLightMatrix[y]=W.matrix,B.castShadow){const X=t.get(B);X.shadowIntensity=W.intensity,X.shadowBias=W.bias,X.shadowNormalBias=W.normalBias,X.shadowRadius=W.radius,X.shadowMapSize=W.mapSize,n.spotShadow[y]=X,n.spotShadowMap[y]=H,S++}y++}else if(B.isRectAreaLight){const z=e.get(B);z.color.copy(Z).multiplyScalar(I),z.halfWidth.set(B.width*.5,0,0),z.halfHeight.set(0,B.height*.5,0),n.rectArea[x]=z,x++}else if(B.isPointLight){const z=e.get(B);if(z.color.copy(B.color).multiplyScalar(B.intensity),z.distance=B.distance,z.decay=B.decay,B.castShadow){const W=B.shadow,X=t.get(B);X.shadowIntensity=W.intensity,X.shadowBias=W.bias,X.shadowNormalBias=W.normalBias,X.shadowRadius=W.radius,X.shadowMapSize=W.mapSize,X.shadowCameraNear=W.camera.near,X.shadowCameraFar=W.camera.far,n.pointShadow[_]=X,n.pointShadowMap[_]=H,n.pointShadowMatrix[_]=B.shadow.matrix,A++}n.point[_]=z,_++}else if(B.isHemisphereLight){const z=e.get(B);z.skyColor.copy(B.color).multiplyScalar(I),z.groundColor.copy(B.groundColor).multiplyScalar(I),n.hemi[g]=z,g++}}x>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ce.LTC_FLOAT_1,n.rectAreaLTC2=Ce.LTC_FLOAT_2):(n.rectAreaLTC1=Ce.LTC_HALF_1,n.rectAreaLTC2=Ce.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=h,n.ambient[2]=f;const P=n.hash;(P.directionalLength!==p||P.pointLength!==_||P.spotLength!==y||P.rectAreaLength!==x||P.hemiLength!==g||P.numDirectionalShadows!==T||P.numPointShadows!==A||P.numSpotShadows!==S||P.numSpotMaps!==O||P.numLightProbes!==U)&&(n.directional.length=p,n.spot.length=y,n.rectArea.length=x,n.point.length=_,n.hemi.length=g,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=A,n.pointShadowMap.length=A,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=A,n.spotLightMatrix.length=S+O-k,n.spotLightMap.length=O,n.numSpotLightShadowsWithMaps=k,n.numLightProbes=U,P.directionalLength=p,P.pointLength=_,P.spotLength=y,P.rectAreaLength=x,P.hemiLength=g,P.numDirectionalShadows=T,P.numPointShadows=A,P.numSpotShadows=S,P.numSpotMaps=O,P.numLightProbes=U,n.version=sw++)}function c(l,d){let h=0,f=0,p=0,_=0,y=0;const x=d.matrixWorldInverse;for(let g=0,T=l.length;g<T;g++){const A=l[g];if(A.isDirectionalLight){const S=n.directional[h];S.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(x),h++}else if(A.isSpotLight){const S=n.spot[p];S.position.setFromMatrixPosition(A.matrixWorld),S.position.applyMatrix4(x),S.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(x),p++}else if(A.isRectAreaLight){const S=n.rectArea[_];S.position.setFromMatrixPosition(A.matrixWorld),S.position.applyMatrix4(x),a.identity(),r.copy(A.matrixWorld),r.premultiply(x),a.extractRotation(r),S.halfWidth.set(A.width*.5,0,0),S.halfHeight.set(0,A.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),_++}else if(A.isPointLight){const S=n.point[f];S.position.setFromMatrixPosition(A.matrixWorld),S.position.applyMatrix4(x),f++}else if(A.isHemisphereLight){const S=n.hemi[y];S.direction.setFromMatrixPosition(A.matrixWorld),S.direction.transformDirection(x),y++}}}return{setup:o,setupView:c,state:n}}function uf(i){const e=new aw(i),t=[],n=[];function s(d){l.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function ow(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new uf(i),e.set(s,[o])):r>=a.length?(o=new uf(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const lw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cw=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function hw(i,e,t){let n=new Vh;const s=new Te,r=new Te,a=new Ot,o=new L_({depthPacking:pv}),c=new k_,l={},d=t.maxTextureSize,h={[ts]:Rn,[Rn]:ts,[On]:On},f=new Sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:lw,fragmentShader:cw}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const _=new Kt;_.setAttribute("position",new Cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Et(_,f),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Up;let g=this.type;this.render=function(k,U,P){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||k.length===0)return;const E=i.getRenderTarget(),R=i.getActiveCubeFace(),B=i.getActiveMipmapLevel(),Z=i.state;Z.setBlending(Ii),Z.buffers.depth.getReversed()===!0?Z.buffers.color.setClear(0,0,0,0):Z.buffers.color.setClear(1,1,1,1),Z.buffers.depth.setTest(!0),Z.setScissorTest(!1);const I=g!==Ei&&this.type===Ei,$=g===Ei&&this.type!==Ei;for(let H=0,z=k.length;H<z;H++){const W=k[H],X=W.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const de=X.getFrameExtents();if(s.multiply(de),r.copy(X.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/de.x),s.x=r.x*de.x,X.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/de.y),s.y=r.y*de.y,X.mapSize.y=r.y)),X.map===null||I===!0||$===!0){const Se=this.type!==Ei?{minFilter:Jn,magFilter:Jn}:{};X.map!==null&&X.map.dispose(),X.map=new Zn(s.x,s.y,Se),X.map.texture.name=W.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const fe=X.getViewportCount();for(let Se=0;Se<fe;Se++){const Ne=X.getViewport(Se);a.set(r.x*Ne.x,r.y*Ne.y,r.x*Ne.z,r.y*Ne.w),Z.viewport(a),X.updateMatrices(W,Se),n=X.getFrustum(),S(U,P,X.camera,W,this.type)}X.isPointLightShadow!==!0&&this.type===Ei&&T(X,P),X.needsUpdate=!1}g=this.type,x.needsUpdate=!1,i.setRenderTarget(E,R,B)};function T(k,U){const P=e.update(y);f.defines.VSM_SAMPLES!==k.blurSamples&&(f.defines.VSM_SAMPLES=k.blurSamples,p.defines.VSM_SAMPLES=k.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),k.mapPass===null&&(k.mapPass=new Zn(s.x,s.y)),f.uniforms.shadow_pass.value=k.map.texture,f.uniforms.resolution.value=k.mapSize,f.uniforms.radius.value=k.radius,i.setRenderTarget(k.mapPass),i.clear(),i.renderBufferDirect(U,null,P,f,y,null),p.uniforms.shadow_pass.value=k.mapPass.texture,p.uniforms.resolution.value=k.mapSize,p.uniforms.radius.value=k.radius,i.setRenderTarget(k.map),i.clear(),i.renderBufferDirect(U,null,P,p,y,null)}function A(k,U,P,E){let R=null;const B=P.isPointLight===!0?k.customDistanceMaterial:k.customDepthMaterial;if(B!==void 0)R=B;else if(R=P.isPointLight===!0?c:o,i.localClippingEnabled&&U.clipShadows===!0&&Array.isArray(U.clippingPlanes)&&U.clippingPlanes.length!==0||U.displacementMap&&U.displacementScale!==0||U.alphaMap&&U.alphaTest>0||U.map&&U.alphaTest>0||U.alphaToCoverage===!0){const Z=R.uuid,I=U.uuid;let $=l[Z];$===void 0&&($={},l[Z]=$);let H=$[I];H===void 0&&(H=R.clone(),$[I]=H,U.addEventListener("dispose",O)),R=H}if(R.visible=U.visible,R.wireframe=U.wireframe,E===Ei?R.side=U.shadowSide!==null?U.shadowSide:U.side:R.side=U.shadowSide!==null?U.shadowSide:h[U.side],R.alphaMap=U.alphaMap,R.alphaTest=U.alphaToCoverage===!0?.5:U.alphaTest,R.map=U.map,R.clipShadows=U.clipShadows,R.clippingPlanes=U.clippingPlanes,R.clipIntersection=U.clipIntersection,R.displacementMap=U.displacementMap,R.displacementScale=U.displacementScale,R.displacementBias=U.displacementBias,R.wireframeLinewidth=U.wireframeLinewidth,R.linewidth=U.linewidth,P.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const Z=i.properties.get(R);Z.light=P}return R}function S(k,U,P,E,R){if(k.visible===!1)return;if(k.layers.test(U.layers)&&(k.isMesh||k.isLine||k.isPoints)&&(k.castShadow||k.receiveShadow&&R===Ei)&&(!k.frustumCulled||n.intersectsObject(k))){k.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,k.matrixWorld);const I=e.update(k),$=k.material;if(Array.isArray($)){const H=I.groups;for(let z=0,W=H.length;z<W;z++){const X=H[z],de=$[X.materialIndex];if(de&&de.visible){const fe=A(k,de,E,R);k.onBeforeShadow(i,k,U,P,I,fe,X),i.renderBufferDirect(P,null,I,fe,k,X),k.onAfterShadow(i,k,U,P,I,fe,X)}}}else if($.visible){const H=A(k,$,E,R);k.onBeforeShadow(i,k,U,P,I,H,null),i.renderBufferDirect(P,null,I,H,k,null),k.onAfterShadow(i,k,U,P,I,H,null)}}const Z=k.children;for(let I=0,$=Z.length;I<$;I++)S(Z[I],U,P,E,R)}function O(k){k.target.removeEventListener("dispose",O);for(const P in l){const E=l[P],R=k.target.uuid;R in E&&(E[R].dispose(),delete E[R])}}}const uw={[bc]:Sc,[wc]:Tc,[Mc]:Ac,[xr]:Ec,[Sc]:bc,[Tc]:wc,[Ac]:Mc,[Ec]:xr};function dw(i,e){function t(){let V=!1;const be=new Ot;let xe=null;const Oe=new Ot(0,0,0,0);return{setMask:function(_e){xe!==_e&&!V&&(i.colorMask(_e,_e,_e,_e),xe=_e)},setLocked:function(_e){V=_e},setClear:function(_e,oe,$e,st,Tt){Tt===!0&&(_e*=st,oe*=st,$e*=st),be.set(_e,oe,$e,st),Oe.equals(be)===!1&&(i.clearColor(_e,oe,$e,st),Oe.copy(be))},reset:function(){V=!1,xe=null,Oe.set(-1,0,0,0)}}}function n(){let V=!1,be=!1,xe=null,Oe=null,_e=null;return{setReversed:function(oe){if(be!==oe){const $e=e.get("EXT_clip_control");oe?$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.ZERO_TO_ONE_EXT):$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.NEGATIVE_ONE_TO_ONE_EXT),be=oe;const st=_e;_e=null,this.setClear(st)}},getReversed:function(){return be},setTest:function(oe){oe?pe(i.DEPTH_TEST):Ae(i.DEPTH_TEST)},setMask:function(oe){xe!==oe&&!V&&(i.depthMask(oe),xe=oe)},setFunc:function(oe){if(be&&(oe=uw[oe]),Oe!==oe){switch(oe){case bc:i.depthFunc(i.NEVER);break;case Sc:i.depthFunc(i.ALWAYS);break;case wc:i.depthFunc(i.LESS);break;case xr:i.depthFunc(i.LEQUAL);break;case Mc:i.depthFunc(i.EQUAL);break;case Ec:i.depthFunc(i.GEQUAL);break;case Tc:i.depthFunc(i.GREATER);break;case Ac:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Oe=oe}},setLocked:function(oe){V=oe},setClear:function(oe){_e!==oe&&(be&&(oe=1-oe),i.clearDepth(oe),_e=oe)},reset:function(){V=!1,xe=null,Oe=null,_e=null,be=!1}}}function s(){let V=!1,be=null,xe=null,Oe=null,_e=null,oe=null,$e=null,st=null,Tt=null;return{setTest:function(yt){V||(yt?pe(i.STENCIL_TEST):Ae(i.STENCIL_TEST))},setMask:function(yt){be!==yt&&!V&&(i.stencilMask(yt),be=yt)},setFunc:function(yt,En,Pn){(xe!==yt||Oe!==En||_e!==Pn)&&(i.stencilFunc(yt,En,Pn),xe=yt,Oe=En,_e=Pn)},setOp:function(yt,En,Pn){(oe!==yt||$e!==En||st!==Pn)&&(i.stencilOp(yt,En,Pn),oe=yt,$e=En,st=Pn)},setLocked:function(yt){V=yt},setClear:function(yt){Tt!==yt&&(i.clearStencil(yt),Tt=yt)},reset:function(){V=!1,be=null,xe=null,Oe=null,_e=null,oe=null,$e=null,st=null,Tt=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},h={},f=new WeakMap,p=[],_=null,y=!1,x=null,g=null,T=null,A=null,S=null,O=null,k=null,U=new Ze(0,0,0),P=0,E=!1,R=null,B=null,Z=null,I=null,$=null;const H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,W=0;const X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(X)[1]),z=W>=1):X.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),z=W>=2);let de=null,fe={};const Se=i.getParameter(i.SCISSOR_BOX),Ne=i.getParameter(i.VIEWPORT),ct=new Ot().fromArray(Se),mt=new Ot().fromArray(Ne);function pt(V,be,xe,Oe){const _e=new Uint8Array(4),oe=i.createTexture();i.bindTexture(V,oe),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let $e=0;$e<xe;$e++)V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?i.texImage3D(be,0,i.RGBA,1,1,Oe,0,i.RGBA,i.UNSIGNED_BYTE,_e):i.texImage2D(be+$e,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_e);return oe}const ue={};ue[i.TEXTURE_2D]=pt(i.TEXTURE_2D,i.TEXTURE_2D,1),ue[i.TEXTURE_CUBE_MAP]=pt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[i.TEXTURE_2D_ARRAY]=pt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ue[i.TEXTURE_3D]=pt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),pe(i.DEPTH_TEST),a.setFunc(xr),it(!1),Be(ad),pe(i.CULL_FACE),zt(Ii);function pe(V){d[V]!==!0&&(i.enable(V),d[V]=!0)}function Ae(V){d[V]!==!1&&(i.disable(V),d[V]=!1)}function nt(V,be){return h[V]!==be?(i.bindFramebuffer(V,be),h[V]=be,V===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=be),V===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=be),!0):!1}function Ge(V,be){let xe=p,Oe=!1;if(V){xe=f.get(be),xe===void 0&&(xe=[],f.set(be,xe));const _e=V.textures;if(xe.length!==_e.length||xe[0]!==i.COLOR_ATTACHMENT0){for(let oe=0,$e=_e.length;oe<$e;oe++)xe[oe]=i.COLOR_ATTACHMENT0+oe;xe.length=_e.length,Oe=!0}}else xe[0]!==i.BACK&&(xe[0]=i.BACK,Oe=!0);Oe&&i.drawBuffers(xe)}function gt(V){return _!==V?(i.useProgram(V),_=V,!0):!1}const rn={[ys]:i.FUNC_ADD,[q0]:i.FUNC_SUBTRACT,[j0]:i.FUNC_REVERSE_SUBTRACT};rn[Y0]=i.MIN,rn[K0]=i.MAX;const F={[J0]:i.ZERO,[Z0]:i.ONE,[Q0]:i.SRC_COLOR,[xc]:i.SRC_ALPHA,[rv]:i.SRC_ALPHA_SATURATE,[iv]:i.DST_COLOR,[tv]:i.DST_ALPHA,[ev]:i.ONE_MINUS_SRC_COLOR,[yc]:i.ONE_MINUS_SRC_ALPHA,[sv]:i.ONE_MINUS_DST_COLOR,[nv]:i.ONE_MINUS_DST_ALPHA,[av]:i.CONSTANT_COLOR,[ov]:i.ONE_MINUS_CONSTANT_COLOR,[lv]:i.CONSTANT_ALPHA,[cv]:i.ONE_MINUS_CONSTANT_ALPHA};function zt(V,be,xe,Oe,_e,oe,$e,st,Tt,yt){if(V===Ii){y===!0&&(Ae(i.BLEND),y=!1);return}if(y===!1&&(pe(i.BLEND),y=!0),V!==X0){if(V!==x||yt!==E){if((g!==ys||S!==ys)&&(i.blendEquation(i.FUNC_ADD),g=ys,S=ys),yt)switch(V){case pr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _r:i.blendFunc(i.ONE,i.ONE);break;case od:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ld:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case pr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _r:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case od:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ld:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}T=null,A=null,O=null,k=null,U.set(0,0,0),P=0,x=V,E=yt}return}_e=_e||be,oe=oe||xe,$e=$e||Oe,(be!==g||_e!==S)&&(i.blendEquationSeparate(rn[be],rn[_e]),g=be,S=_e),(xe!==T||Oe!==A||oe!==O||$e!==k)&&(i.blendFuncSeparate(F[xe],F[Oe],F[oe],F[$e]),T=xe,A=Oe,O=oe,k=$e),(st.equals(U)===!1||Tt!==P)&&(i.blendColor(st.r,st.g,st.b,Tt),U.copy(st),P=Tt),x=V,E=!1}function ot(V,be){V.side===On?Ae(i.CULL_FACE):pe(i.CULL_FACE);let xe=V.side===Rn;be&&(xe=!xe),it(xe),V.blending===pr&&V.transparent===!1?zt(Ii):zt(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),a.setFunc(V.depthFunc),a.setTest(V.depthTest),a.setMask(V.depthWrite),r.setMask(V.colorWrite);const Oe=V.stencilWrite;o.setTest(Oe),Oe&&(o.setMask(V.stencilWriteMask),o.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),o.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),ze(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?pe(i.SAMPLE_ALPHA_TO_COVERAGE):Ae(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(V){R!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),R=V)}function Be(V){V!==$0?(pe(i.CULL_FACE),V!==B&&(V===ad?i.cullFace(i.BACK):V===W0?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ae(i.CULL_FACE),B=V}function Ut(V){V!==Z&&(z&&i.lineWidth(V),Z=V)}function ze(V,be,xe){V?(pe(i.POLYGON_OFFSET_FILL),(I!==be||$!==xe)&&(i.polygonOffset(be,xe),I=be,$=xe)):Ae(i.POLYGON_OFFSET_FILL)}function Qe(V){V?pe(i.SCISSOR_TEST):Ae(i.SCISSOR_TEST)}function $t(V){V===void 0&&(V=i.TEXTURE0+H-1),de!==V&&(i.activeTexture(V),de=V)}function Wt(V,be,xe){xe===void 0&&(de===null?xe=i.TEXTURE0+H-1:xe=de);let Oe=fe[xe];Oe===void 0&&(Oe={type:void 0,texture:void 0},fe[xe]=Oe),(Oe.type!==V||Oe.texture!==be)&&(de!==xe&&(i.activeTexture(xe),de=xe),i.bindTexture(V,be||ue[V]),Oe.type=V,Oe.texture=be)}function L(){const V=fe[de];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function M(){try{i.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ee(){try{i.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ce(){try{i.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function me(){try{i.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function re(){try{i.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function je(){try{i.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function we(){try{i.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Xe(){try{i.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ue(){try{i.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ye(){try{i.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ke(V){ct.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),ct.copy(V))}function qe(V){mt.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),mt.copy(V))}function We(V,be){let xe=l.get(be);xe===void 0&&(xe=new WeakMap,l.set(be,xe));let Oe=xe.get(V);Oe===void 0&&(Oe=i.getUniformBlockIndex(be,V.name),xe.set(V,Oe))}function Re(V,be){const Oe=l.get(be).get(V);c.get(be)!==Oe&&(i.uniformBlockBinding(be,Oe,V.__bindingPointIndex),c.set(be,Oe))}function et(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},de=null,fe={},h={},f=new WeakMap,p=[],_=null,y=!1,x=null,g=null,T=null,A=null,S=null,O=null,k=null,U=new Ze(0,0,0),P=0,E=!1,R=null,B=null,Z=null,I=null,$=null,ct.set(0,0,i.canvas.width,i.canvas.height),mt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:pe,disable:Ae,bindFramebuffer:nt,drawBuffers:Ge,useProgram:gt,setBlending:zt,setMaterial:ot,setFlipSided:it,setCullFace:Be,setLineWidth:Ut,setPolygonOffset:ze,setScissorTest:Qe,activeTexture:$t,bindTexture:Wt,unbindTexture:L,compressedTexImage2D:M,compressedTexImage3D:ee,texImage2D:Ue,texImage3D:ye,updateUBOMapping:We,uniformBlockBinding:Re,texStorage2D:we,texStorage3D:Xe,texSubImage2D:ce,texSubImage3D:me,compressedTexSubImage2D:re,compressedTexSubImage3D:je,scissor:ke,viewport:qe,reset:et}}function fw(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Te,d=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(L,M){return p?new OffscreenCanvas(L,M):No("canvas")}function y(L,M,ee){let ce=1;const me=Wt(L);if((me.width>ee||me.height>ee)&&(ce=ee/Math.max(me.width,me.height)),ce<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const re=Math.floor(ce*me.width),je=Math.floor(ce*me.height);h===void 0&&(h=_(re,je));const we=M?_(re,je):h;return we.width=re,we.height=je,we.getContext("2d").drawImage(L,0,0,re,je),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+me.width+"x"+me.height+") to ("+re+"x"+je+")."),we}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+me.width+"x"+me.height+")."),L;return L}function x(L){return L.generateMipmaps}function g(L){i.generateMipmap(L)}function T(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function A(L,M,ee,ce,me=!1){if(L!==null){if(i[L]!==void 0)return i[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let re=M;if(M===i.RED&&(ee===i.FLOAT&&(re=i.R32F),ee===i.HALF_FLOAT&&(re=i.R16F),ee===i.UNSIGNED_BYTE&&(re=i.R8)),M===i.RED_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.R8UI),ee===i.UNSIGNED_SHORT&&(re=i.R16UI),ee===i.UNSIGNED_INT&&(re=i.R32UI),ee===i.BYTE&&(re=i.R8I),ee===i.SHORT&&(re=i.R16I),ee===i.INT&&(re=i.R32I)),M===i.RG&&(ee===i.FLOAT&&(re=i.RG32F),ee===i.HALF_FLOAT&&(re=i.RG16F),ee===i.UNSIGNED_BYTE&&(re=i.RG8)),M===i.RG_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.RG8UI),ee===i.UNSIGNED_SHORT&&(re=i.RG16UI),ee===i.UNSIGNED_INT&&(re=i.RG32UI),ee===i.BYTE&&(re=i.RG8I),ee===i.SHORT&&(re=i.RG16I),ee===i.INT&&(re=i.RG32I)),M===i.RGB_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.RGB8UI),ee===i.UNSIGNED_SHORT&&(re=i.RGB16UI),ee===i.UNSIGNED_INT&&(re=i.RGB32UI),ee===i.BYTE&&(re=i.RGB8I),ee===i.SHORT&&(re=i.RGB16I),ee===i.INT&&(re=i.RGB32I)),M===i.RGBA_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.RGBA8UI),ee===i.UNSIGNED_SHORT&&(re=i.RGBA16UI),ee===i.UNSIGNED_INT&&(re=i.RGBA32UI),ee===i.BYTE&&(re=i.RGBA8I),ee===i.SHORT&&(re=i.RGBA16I),ee===i.INT&&(re=i.RGBA32I)),M===i.RGB&&(ee===i.UNSIGNED_INT_5_9_9_9_REV&&(re=i.RGB9_E5),ee===i.UNSIGNED_INT_10F_11F_11F_REV&&(re=i.R11F_G11F_B10F)),M===i.RGBA){const je=me?Oo:St.getTransfer(ce);ee===i.FLOAT&&(re=i.RGBA32F),ee===i.HALF_FLOAT&&(re=i.RGBA16F),ee===i.UNSIGNED_BYTE&&(re=je===It?i.SRGB8_ALPHA8:i.RGBA8),ee===i.UNSIGNED_SHORT_4_4_4_4&&(re=i.RGBA4),ee===i.UNSIGNED_SHORT_5_5_5_1&&(re=i.RGB5_A1)}return(re===i.R16F||re===i.R32F||re===i.RG16F||re===i.RG32F||re===i.RGBA16F||re===i.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function S(L,M){let ee;return L?M===null||M===Ps||M===ua?ee=i.DEPTH24_STENCIL8:M===Ai?ee=i.DEPTH32F_STENCIL8:M===ha&&(ee=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Ps||M===ua?ee=i.DEPTH_COMPONENT24:M===Ai?ee=i.DEPTH_COMPONENT32F:M===ha&&(ee=i.DEPTH_COMPONENT16),ee}function O(L,M){return x(L)===!0||L.isFramebufferTexture&&L.minFilter!==Jn&&L.minFilter!==hi?Math.log2(Math.max(M.width,M.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?M.mipmaps.length:1}function k(L){const M=L.target;M.removeEventListener("dispose",k),P(M),M.isVideoTexture&&d.delete(M)}function U(L){const M=L.target;M.removeEventListener("dispose",U),R(M)}function P(L){const M=n.get(L);if(M.__webglInit===void 0)return;const ee=L.source,ce=f.get(ee);if(ce){const me=ce[M.__cacheKey];me.usedTimes--,me.usedTimes===0&&E(L),Object.keys(ce).length===0&&f.delete(ee)}n.remove(L)}function E(L){const M=n.get(L);i.deleteTexture(M.__webglTexture);const ee=L.source,ce=f.get(ee);delete ce[M.__cacheKey],a.memory.textures--}function R(L){const M=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let ce=0;ce<6;ce++){if(Array.isArray(M.__webglFramebuffer[ce]))for(let me=0;me<M.__webglFramebuffer[ce].length;me++)i.deleteFramebuffer(M.__webglFramebuffer[ce][me]);else i.deleteFramebuffer(M.__webglFramebuffer[ce]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[ce])}else{if(Array.isArray(M.__webglFramebuffer))for(let ce=0;ce<M.__webglFramebuffer.length;ce++)i.deleteFramebuffer(M.__webglFramebuffer[ce]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let ce=0;ce<M.__webglColorRenderbuffer.length;ce++)M.__webglColorRenderbuffer[ce]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[ce]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const ee=L.textures;for(let ce=0,me=ee.length;ce<me;ce++){const re=n.get(ee[ce]);re.__webglTexture&&(i.deleteTexture(re.__webglTexture),a.memory.textures--),n.remove(ee[ce])}n.remove(L)}let B=0;function Z(){B=0}function I(){const L=B;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),B+=1,L}function $(L){const M=[];return M.push(L.wrapS),M.push(L.wrapT),M.push(L.wrapR||0),M.push(L.magFilter),M.push(L.minFilter),M.push(L.anisotropy),M.push(L.internalFormat),M.push(L.format),M.push(L.type),M.push(L.generateMipmaps),M.push(L.premultiplyAlpha),M.push(L.flipY),M.push(L.unpackAlignment),M.push(L.colorSpace),M.join()}function H(L,M){const ee=n.get(L);if(L.isVideoTexture&&Qe(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&ee.__version!==L.version){const ce=L.image;if(ce===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ce.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ue(ee,L,M);return}}else L.isExternalTexture&&(ee.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,ee.__webglTexture,i.TEXTURE0+M)}function z(L,M){const ee=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&ee.__version!==L.version){ue(ee,L,M);return}t.bindTexture(i.TEXTURE_2D_ARRAY,ee.__webglTexture,i.TEXTURE0+M)}function W(L,M){const ee=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&ee.__version!==L.version){ue(ee,L,M);return}t.bindTexture(i.TEXTURE_3D,ee.__webglTexture,i.TEXTURE0+M)}function X(L,M){const ee=n.get(L);if(L.version>0&&ee.__version!==L.version){pe(ee,L,M);return}t.bindTexture(i.TEXTURE_CUBE_MAP,ee.__webglTexture,i.TEXTURE0+M)}const de={[Pc]:i.REPEAT,[ws]:i.CLAMP_TO_EDGE,[Ic]:i.MIRRORED_REPEAT},fe={[Jn]:i.NEAREST,[dv]:i.NEAREST_MIPMAP_NEAREST,[za]:i.NEAREST_MIPMAP_LINEAR,[hi]:i.LINEAR,[Sl]:i.LINEAR_MIPMAP_NEAREST,[Ms]:i.LINEAR_MIPMAP_LINEAR},Se={[gv]:i.NEVER,[Sv]:i.ALWAYS,[vv]:i.LESS,[tm]:i.LEQUAL,[_v]:i.EQUAL,[bv]:i.GEQUAL,[xv]:i.GREATER,[yv]:i.NOTEQUAL};function Ne(L,M){if(M.type===Ai&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===hi||M.magFilter===Sl||M.magFilter===za||M.magFilter===Ms||M.minFilter===hi||M.minFilter===Sl||M.minFilter===za||M.minFilter===Ms)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,de[M.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,de[M.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,de[M.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,fe[M.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,fe[M.minFilter]),M.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,Se[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Jn||M.minFilter!==za&&M.minFilter!==Ms||M.type===Ai&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const ee=e.get("EXT_texture_filter_anisotropic");i.texParameterf(L,ee.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function ct(L,M){let ee=!1;L.__webglInit===void 0&&(L.__webglInit=!0,M.addEventListener("dispose",k));const ce=M.source;let me=f.get(ce);me===void 0&&(me={},f.set(ce,me));const re=$(M);if(re!==L.__cacheKey){me[re]===void 0&&(me[re]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,ee=!0),me[re].usedTimes++;const je=me[L.__cacheKey];je!==void 0&&(me[L.__cacheKey].usedTimes--,je.usedTimes===0&&E(M)),L.__cacheKey=re,L.__webglTexture=me[re].texture}return ee}function mt(L,M,ee){return Math.floor(Math.floor(L/ee)/M)}function pt(L,M,ee,ce){const re=L.updateRanges;if(re.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,M.width,M.height,ee,ce,M.data);else{re.sort((ye,ke)=>ye.start-ke.start);let je=0;for(let ye=1;ye<re.length;ye++){const ke=re[je],qe=re[ye],We=ke.start+ke.count,Re=mt(qe.start,M.width,4),et=mt(ke.start,M.width,4);qe.start<=We+1&&Re===et&&mt(qe.start+qe.count-1,M.width,4)===Re?ke.count=Math.max(ke.count,qe.start+qe.count-ke.start):(++je,re[je]=qe)}re.length=je+1;const we=i.getParameter(i.UNPACK_ROW_LENGTH),Xe=i.getParameter(i.UNPACK_SKIP_PIXELS),Ue=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,M.width);for(let ye=0,ke=re.length;ye<ke;ye++){const qe=re[ye],We=Math.floor(qe.start/4),Re=Math.ceil(qe.count/4),et=We%M.width,V=Math.floor(We/M.width),be=Re,xe=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,et),i.pixelStorei(i.UNPACK_SKIP_ROWS,V),t.texSubImage2D(i.TEXTURE_2D,0,et,V,be,xe,ee,ce,M.data)}L.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,we),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ue)}}function ue(L,M,ee){let ce=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(ce=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(ce=i.TEXTURE_3D);const me=ct(L,M),re=M.source;t.bindTexture(ce,L.__webglTexture,i.TEXTURE0+ee);const je=n.get(re);if(re.version!==je.__version||me===!0){t.activeTexture(i.TEXTURE0+ee);const we=St.getPrimaries(St.workingColorSpace),Xe=M.colorSpace===Xi?null:St.getPrimaries(M.colorSpace),Ue=M.colorSpace===Xi||we===Xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ue);let ye=y(M.image,!1,s.maxTextureSize);ye=$t(M,ye);const ke=r.convert(M.format,M.colorSpace),qe=r.convert(M.type);let We=A(M.internalFormat,ke,qe,M.colorSpace,M.isVideoTexture);Ne(ce,M);let Re;const et=M.mipmaps,V=M.isVideoTexture!==!0,be=je.__version===void 0||me===!0,xe=re.dataReady,Oe=O(M,ye);if(M.isDepthTexture)We=S(M.format===fa,M.type),be&&(V?t.texStorage2D(i.TEXTURE_2D,1,We,ye.width,ye.height):t.texImage2D(i.TEXTURE_2D,0,We,ye.width,ye.height,0,ke,qe,null));else if(M.isDataTexture)if(et.length>0){V&&be&&t.texStorage2D(i.TEXTURE_2D,Oe,We,et[0].width,et[0].height);for(let _e=0,oe=et.length;_e<oe;_e++)Re=et[_e],V?xe&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,Re.width,Re.height,ke,qe,Re.data):t.texImage2D(i.TEXTURE_2D,_e,We,Re.width,Re.height,0,ke,qe,Re.data);M.generateMipmaps=!1}else V?(be&&t.texStorage2D(i.TEXTURE_2D,Oe,We,ye.width,ye.height),xe&&pt(M,ye,ke,qe)):t.texImage2D(i.TEXTURE_2D,0,We,ye.width,ye.height,0,ke,qe,ye.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){V&&be&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Oe,We,et[0].width,et[0].height,ye.depth);for(let _e=0,oe=et.length;_e<oe;_e++)if(Re=et[_e],M.format!==Kn)if(ke!==null)if(V){if(xe)if(M.layerUpdates.size>0){const $e=zd(Re.width,Re.height,M.format,M.type);for(const st of M.layerUpdates){const Tt=Re.data.subarray(st*$e/Re.data.BYTES_PER_ELEMENT,(st+1)*$e/Re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,st,Re.width,Re.height,1,ke,Tt)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,0,Re.width,Re.height,ye.depth,ke,Re.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,_e,We,Re.width,Re.height,ye.depth,0,Re.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?xe&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,0,Re.width,Re.height,ye.depth,ke,qe,Re.data):t.texImage3D(i.TEXTURE_2D_ARRAY,_e,We,Re.width,Re.height,ye.depth,0,ke,qe,Re.data)}else{V&&be&&t.texStorage2D(i.TEXTURE_2D,Oe,We,et[0].width,et[0].height);for(let _e=0,oe=et.length;_e<oe;_e++)Re=et[_e],M.format!==Kn?ke!==null?V?xe&&t.compressedTexSubImage2D(i.TEXTURE_2D,_e,0,0,Re.width,Re.height,ke,Re.data):t.compressedTexImage2D(i.TEXTURE_2D,_e,We,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?xe&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,Re.width,Re.height,ke,qe,Re.data):t.texImage2D(i.TEXTURE_2D,_e,We,Re.width,Re.height,0,ke,qe,Re.data)}else if(M.isDataArrayTexture)if(V){if(be&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Oe,We,ye.width,ye.height,ye.depth),xe)if(M.layerUpdates.size>0){const _e=zd(ye.width,ye.height,M.format,M.type);for(const oe of M.layerUpdates){const $e=ye.data.subarray(oe*_e/ye.data.BYTES_PER_ELEMENT,(oe+1)*_e/ye.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,oe,ye.width,ye.height,1,ke,qe,$e)}M.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ye.width,ye.height,ye.depth,ke,qe,ye.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,We,ye.width,ye.height,ye.depth,0,ke,qe,ye.data);else if(M.isData3DTexture)V?(be&&t.texStorage3D(i.TEXTURE_3D,Oe,We,ye.width,ye.height,ye.depth),xe&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ye.width,ye.height,ye.depth,ke,qe,ye.data)):t.texImage3D(i.TEXTURE_3D,0,We,ye.width,ye.height,ye.depth,0,ke,qe,ye.data);else if(M.isFramebufferTexture){if(be)if(V)t.texStorage2D(i.TEXTURE_2D,Oe,We,ye.width,ye.height);else{let _e=ye.width,oe=ye.height;for(let $e=0;$e<Oe;$e++)t.texImage2D(i.TEXTURE_2D,$e,We,_e,oe,0,ke,qe,null),_e>>=1,oe>>=1}}else if(et.length>0){if(V&&be){const _e=Wt(et[0]);t.texStorage2D(i.TEXTURE_2D,Oe,We,_e.width,_e.height)}for(let _e=0,oe=et.length;_e<oe;_e++)Re=et[_e],V?xe&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,ke,qe,Re):t.texImage2D(i.TEXTURE_2D,_e,We,ke,qe,Re);M.generateMipmaps=!1}else if(V){if(be){const _e=Wt(ye);t.texStorage2D(i.TEXTURE_2D,Oe,We,_e.width,_e.height)}xe&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ke,qe,ye)}else t.texImage2D(i.TEXTURE_2D,0,We,ke,qe,ye);x(M)&&g(ce),je.__version=re.version,M.onUpdate&&M.onUpdate(M)}L.__version=M.version}function pe(L,M,ee){if(M.image.length!==6)return;const ce=ct(L,M),me=M.source;t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+ee);const re=n.get(me);if(me.version!==re.__version||ce===!0){t.activeTexture(i.TEXTURE0+ee);const je=St.getPrimaries(St.workingColorSpace),we=M.colorSpace===Xi?null:St.getPrimaries(M.colorSpace),Xe=M.colorSpace===Xi||je===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xe);const Ue=M.isCompressedTexture||M.image[0].isCompressedTexture,ye=M.image[0]&&M.image[0].isDataTexture,ke=[];for(let oe=0;oe<6;oe++)!Ue&&!ye?ke[oe]=y(M.image[oe],!0,s.maxCubemapSize):ke[oe]=ye?M.image[oe].image:M.image[oe],ke[oe]=$t(M,ke[oe]);const qe=ke[0],We=r.convert(M.format,M.colorSpace),Re=r.convert(M.type),et=A(M.internalFormat,We,Re,M.colorSpace),V=M.isVideoTexture!==!0,be=re.__version===void 0||ce===!0,xe=me.dataReady;let Oe=O(M,qe);Ne(i.TEXTURE_CUBE_MAP,M);let _e;if(Ue){V&&be&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Oe,et,qe.width,qe.height);for(let oe=0;oe<6;oe++){_e=ke[oe].mipmaps;for(let $e=0;$e<_e.length;$e++){const st=_e[$e];M.format!==Kn?We!==null?V?xe&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,$e,0,0,st.width,st.height,We,st.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,$e,et,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?xe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,$e,0,0,st.width,st.height,We,Re,st.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,$e,et,st.width,st.height,0,We,Re,st.data)}}}else{if(_e=M.mipmaps,V&&be){_e.length>0&&Oe++;const oe=Wt(ke[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Oe,et,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(ye){V?xe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,ke[oe].width,ke[oe].height,We,Re,ke[oe].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,et,ke[oe].width,ke[oe].height,0,We,Re,ke[oe].data);for(let $e=0;$e<_e.length;$e++){const Tt=_e[$e].image[oe].image;V?xe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,$e+1,0,0,Tt.width,Tt.height,We,Re,Tt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,$e+1,et,Tt.width,Tt.height,0,We,Re,Tt.data)}}else{V?xe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,We,Re,ke[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,et,We,Re,ke[oe]);for(let $e=0;$e<_e.length;$e++){const st=_e[$e];V?xe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,$e+1,0,0,We,Re,st.image[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,$e+1,et,We,Re,st.image[oe])}}}x(M)&&g(i.TEXTURE_CUBE_MAP),re.__version=me.version,M.onUpdate&&M.onUpdate(M)}L.__version=M.version}function Ae(L,M,ee,ce,me,re){const je=r.convert(ee.format,ee.colorSpace),we=r.convert(ee.type),Xe=A(ee.internalFormat,je,we,ee.colorSpace),Ue=n.get(M),ye=n.get(ee);if(ye.__renderTarget=M,!Ue.__hasExternalTextures){const ke=Math.max(1,M.width>>re),qe=Math.max(1,M.height>>re);me===i.TEXTURE_3D||me===i.TEXTURE_2D_ARRAY?t.texImage3D(me,re,Xe,ke,qe,M.depth,0,je,we,null):t.texImage2D(me,re,Xe,ke,qe,0,je,we,null)}t.bindFramebuffer(i.FRAMEBUFFER,L),ze(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ce,me,ye.__webglTexture,0,Ut(M)):(me===i.TEXTURE_2D||me>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&me<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ce,me,ye.__webglTexture,re),t.bindFramebuffer(i.FRAMEBUFFER,null)}function nt(L,M,ee){if(i.bindRenderbuffer(i.RENDERBUFFER,L),M.depthBuffer){const ce=M.depthTexture,me=ce&&ce.isDepthTexture?ce.type:null,re=S(M.stencilBuffer,me),je=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,we=Ut(M);ze(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,we,re,M.width,M.height):ee?i.renderbufferStorageMultisample(i.RENDERBUFFER,we,re,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,re,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,je,i.RENDERBUFFER,L)}else{const ce=M.textures;for(let me=0;me<ce.length;me++){const re=ce[me],je=r.convert(re.format,re.colorSpace),we=r.convert(re.type),Xe=A(re.internalFormat,je,we,re.colorSpace),Ue=Ut(M);ee&&ze(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ue,Xe,M.width,M.height):ze(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ue,Xe,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,Xe,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ge(L,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,L),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ce=n.get(M.depthTexture);ce.__renderTarget=M,(!ce.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),H(M.depthTexture,0);const me=ce.__webglTexture,re=Ut(M);if(M.depthTexture.format===da)ze(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,me,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,me,0);else if(M.depthTexture.format===fa)ze(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,me,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,me,0);else throw new Error("Unknown depthTexture format")}function gt(L){const M=n.get(L),ee=L.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==L.depthTexture){const ce=L.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),ce){const me=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,ce.removeEventListener("dispose",me)};ce.addEventListener("dispose",me),M.__depthDisposeCallback=me}M.__boundDepthTexture=ce}if(L.depthTexture&&!M.__autoAllocateDepthBuffer){if(ee)throw new Error("target.depthTexture not supported in Cube render targets");const ce=L.texture.mipmaps;ce&&ce.length>0?Ge(M.__webglFramebuffer[0],L):Ge(M.__webglFramebuffer,L)}else if(ee){M.__webglDepthbuffer=[];for(let ce=0;ce<6;ce++)if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[ce]),M.__webglDepthbuffer[ce]===void 0)M.__webglDepthbuffer[ce]=i.createRenderbuffer(),nt(M.__webglDepthbuffer[ce],L,!1);else{const me=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=M.__webglDepthbuffer[ce];i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,me,i.RENDERBUFFER,re)}}else{const ce=L.texture.mipmaps;if(ce&&ce.length>0?t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),nt(M.__webglDepthbuffer,L,!1);else{const me=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,me,i.RENDERBUFFER,re)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function rn(L,M,ee){const ce=n.get(L);M!==void 0&&Ae(ce.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),ee!==void 0&&gt(L)}function F(L){const M=L.texture,ee=n.get(L),ce=n.get(M);L.addEventListener("dispose",U);const me=L.textures,re=L.isWebGLCubeRenderTarget===!0,je=me.length>1;if(je||(ce.__webglTexture===void 0&&(ce.__webglTexture=i.createTexture()),ce.__version=M.version,a.memory.textures++),re){ee.__webglFramebuffer=[];for(let we=0;we<6;we++)if(M.mipmaps&&M.mipmaps.length>0){ee.__webglFramebuffer[we]=[];for(let Xe=0;Xe<M.mipmaps.length;Xe++)ee.__webglFramebuffer[we][Xe]=i.createFramebuffer()}else ee.__webglFramebuffer[we]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){ee.__webglFramebuffer=[];for(let we=0;we<M.mipmaps.length;we++)ee.__webglFramebuffer[we]=i.createFramebuffer()}else ee.__webglFramebuffer=i.createFramebuffer();if(je)for(let we=0,Xe=me.length;we<Xe;we++){const Ue=n.get(me[we]);Ue.__webglTexture===void 0&&(Ue.__webglTexture=i.createTexture(),a.memory.textures++)}if(L.samples>0&&ze(L)===!1){ee.__webglMultisampledFramebuffer=i.createFramebuffer(),ee.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,ee.__webglMultisampledFramebuffer);for(let we=0;we<me.length;we++){const Xe=me[we];ee.__webglColorRenderbuffer[we]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,ee.__webglColorRenderbuffer[we]);const Ue=r.convert(Xe.format,Xe.colorSpace),ye=r.convert(Xe.type),ke=A(Xe.internalFormat,Ue,ye,Xe.colorSpace,L.isXRRenderTarget===!0),qe=Ut(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,qe,ke,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,ee.__webglColorRenderbuffer[we])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(ee.__webglDepthRenderbuffer=i.createRenderbuffer(),nt(ee.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(re){t.bindTexture(i.TEXTURE_CUBE_MAP,ce.__webglTexture),Ne(i.TEXTURE_CUBE_MAP,M);for(let we=0;we<6;we++)if(M.mipmaps&&M.mipmaps.length>0)for(let Xe=0;Xe<M.mipmaps.length;Xe++)Ae(ee.__webglFramebuffer[we][Xe],L,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+we,Xe);else Ae(ee.__webglFramebuffer[we],L,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+we,0);x(M)&&g(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(je){for(let we=0,Xe=me.length;we<Xe;we++){const Ue=me[we],ye=n.get(Ue);let ke=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ke=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ke,ye.__webglTexture),Ne(ke,Ue),Ae(ee.__webglFramebuffer,L,Ue,i.COLOR_ATTACHMENT0+we,ke,0),x(Ue)&&g(ke)}t.unbindTexture()}else{let we=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(we=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(we,ce.__webglTexture),Ne(we,M),M.mipmaps&&M.mipmaps.length>0)for(let Xe=0;Xe<M.mipmaps.length;Xe++)Ae(ee.__webglFramebuffer[Xe],L,M,i.COLOR_ATTACHMENT0,we,Xe);else Ae(ee.__webglFramebuffer,L,M,i.COLOR_ATTACHMENT0,we,0);x(M)&&g(we),t.unbindTexture()}L.depthBuffer&&gt(L)}function zt(L){const M=L.textures;for(let ee=0,ce=M.length;ee<ce;ee++){const me=M[ee];if(x(me)){const re=T(L),je=n.get(me).__webglTexture;t.bindTexture(re,je),g(re),t.unbindTexture()}}}const ot=[],it=[];function Be(L){if(L.samples>0){if(ze(L)===!1){const M=L.textures,ee=L.width,ce=L.height;let me=i.COLOR_BUFFER_BIT;const re=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,je=n.get(L),we=M.length>1;if(we)for(let Ue=0;Ue<M.length;Ue++)t.bindFramebuffer(i.FRAMEBUFFER,je.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ue,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,je.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ue,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,je.__webglMultisampledFramebuffer);const Xe=L.texture.mipmaps;Xe&&Xe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,je.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,je.__webglFramebuffer);for(let Ue=0;Ue<M.length;Ue++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(me|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(me|=i.STENCIL_BUFFER_BIT)),we){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,je.__webglColorRenderbuffer[Ue]);const ye=n.get(M[Ue]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ye,0)}i.blitFramebuffer(0,0,ee,ce,0,0,ee,ce,me,i.NEAREST),c===!0&&(ot.length=0,it.length=0,ot.push(i.COLOR_ATTACHMENT0+Ue),L.depthBuffer&&L.resolveDepthBuffer===!1&&(ot.push(re),it.push(re),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,it)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),we)for(let Ue=0;Ue<M.length;Ue++){t.bindFramebuffer(i.FRAMEBUFFER,je.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ue,i.RENDERBUFFER,je.__webglColorRenderbuffer[Ue]);const ye=n.get(M[Ue]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,je.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ue,i.TEXTURE_2D,ye,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,je.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const M=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Ut(L){return Math.min(s.maxSamples,L.samples)}function ze(L){const M=n.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Qe(L){const M=a.render.frame;d.get(L)!==M&&(d.set(L,M),L.update())}function $t(L,M){const ee=L.colorSpace,ce=L.format,me=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||ee!==Sr&&ee!==Xi&&(St.getTransfer(ee)===It?(ce!==Kn||me!==fi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ee)),M}function Wt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=I,this.resetTextureUnits=Z,this.setTexture2D=H,this.setTexture2DArray=z,this.setTexture3D=W,this.setTextureCube=X,this.rebindTextures=rn,this.setupRenderTarget=F,this.updateRenderTargetMipmap=zt,this.updateMultisampleRenderTarget=Be,this.setupDepthRenderbuffer=gt,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=ze}function pw(i,e){function t(n,s=Xi){let r;const a=St.getTransfer(s);if(n===fi)return i.UNSIGNED_BYTE;if(n===Dh)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Lh)return i.UNSIGNED_SHORT_5_5_5_1;if(n===jp)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Yp)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Xp)return i.BYTE;if(n===qp)return i.SHORT;if(n===ha)return i.UNSIGNED_SHORT;if(n===Ih)return i.INT;if(n===Ps)return i.UNSIGNED_INT;if(n===Ai)return i.FLOAT;if(n===Di)return i.HALF_FLOAT;if(n===Kp)return i.ALPHA;if(n===Jp)return i.RGB;if(n===Kn)return i.RGBA;if(n===da)return i.DEPTH_COMPONENT;if(n===fa)return i.DEPTH_STENCIL;if(n===Zp)return i.RED;if(n===kh)return i.RED_INTEGER;if(n===Qp)return i.RG;if(n===Oh)return i.RG_INTEGER;if(n===Uh)return i.RGBA_INTEGER;if(n===yo||n===bo||n===So||n===wo)if(a===It)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===yo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===bo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===So)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===wo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===yo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===bo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===So)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===wo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Dc||n===Lc||n===kc||n===Oc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Dc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Lc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===kc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Oc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Uc||n===Nc||n===Fc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Uc||n===Nc)return a===It?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Fc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Bc||n===zc||n===Hc||n===Vc||n===Gc||n===$c||n===Wc||n===Xc||n===qc||n===jc||n===Yc||n===Kc||n===Jc||n===Zc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Bc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Hc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Vc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Gc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===$c)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Wc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Xc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===qc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===jc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Yc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Kc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Jc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Zc)return a===It?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Qc||n===eh||n===th)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Qc)return a===It?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===eh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===th)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nh||n===ih||n===sh||n===rh)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===nh)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ih)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===sh)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===rh)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ua?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const mw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gw=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class vw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new dm(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Sn({vertexShader:mw,fragmentShader:gw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Et(new tl(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class _w extends Er{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,h=null,f=null,p=null,_=null;const y=typeof XRWebGLBinding<"u",x=new vw,g={},T=t.getContextAttributes();let A=null,S=null;const O=[],k=[],U=new Te;let P=null;const E=new kn;E.viewport=new Ot;const R=new kn;R.viewport=new Ot;const B=[E,R],Z=new F_;let I=null,$=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ue){let pe=O[ue];return pe===void 0&&(pe=new Gl,O[ue]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(ue){let pe=O[ue];return pe===void 0&&(pe=new Gl,O[ue]=pe),pe.getGripSpace()},this.getHand=function(ue){let pe=O[ue];return pe===void 0&&(pe=new Gl,O[ue]=pe),pe.getHandSpace()};function H(ue){const pe=k.indexOf(ue.inputSource);if(pe===-1)return;const Ae=O[pe];Ae!==void 0&&(Ae.update(ue.inputSource,ue.frame,l||a),Ae.dispatchEvent({type:ue.type,data:ue.inputSource}))}function z(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",W);for(let ue=0;ue<O.length;ue++){const pe=k[ue];pe!==null&&(k[ue]=null,O[ue].disconnect(pe))}I=null,$=null,x.reset();for(const ue in g)delete g[ue];e.setRenderTarget(A),p=null,f=null,h=null,s=null,S=null,pt.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(U.width,U.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ue){r=ue,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ue){o=ue,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(ue){l=ue},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h===null&&y&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(ue){if(s=ue,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",z),s.addEventListener("inputsourceschange",W),T.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(U),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ae=null,nt=null,Ge=null;T.depth&&(Ge=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ae=T.stencil?fa:da,nt=T.stencil?ua:Ps);const gt={colorFormat:t.RGBA8,depthFormat:Ge,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(gt),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Zn(f.textureWidth,f.textureHeight,{format:Kn,type:fi,depthTexture:new um(f.textureWidth,f.textureHeight,nt,void 0,void 0,void 0,void 0,void 0,void 0,Ae),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const Ae={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,Ae),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Zn(p.framebufferWidth,p.framebufferHeight,{format:Kn,type:fi,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),pt.setContext(s),pt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function W(ue){for(let pe=0;pe<ue.removed.length;pe++){const Ae=ue.removed[pe],nt=k.indexOf(Ae);nt>=0&&(k[nt]=null,O[nt].disconnect(Ae))}for(let pe=0;pe<ue.added.length;pe++){const Ae=ue.added[pe];let nt=k.indexOf(Ae);if(nt===-1){for(let gt=0;gt<O.length;gt++)if(gt>=k.length){k.push(Ae),nt=gt;break}else if(k[gt]===null){k[gt]=Ae,nt=gt;break}if(nt===-1)break}const Ge=O[nt];Ge&&Ge.connect(Ae)}}const X=new N,de=new N;function fe(ue,pe,Ae){X.setFromMatrixPosition(pe.matrixWorld),de.setFromMatrixPosition(Ae.matrixWorld);const nt=X.distanceTo(de),Ge=pe.projectionMatrix.elements,gt=Ae.projectionMatrix.elements,rn=Ge[14]/(Ge[10]-1),F=Ge[14]/(Ge[10]+1),zt=(Ge[9]+1)/Ge[5],ot=(Ge[9]-1)/Ge[5],it=(Ge[8]-1)/Ge[0],Be=(gt[8]+1)/gt[0],Ut=rn*it,ze=rn*Be,Qe=nt/(-it+Be),$t=Qe*-it;if(pe.matrixWorld.decompose(ue.position,ue.quaternion,ue.scale),ue.translateX($t),ue.translateZ(Qe),ue.matrixWorld.compose(ue.position,ue.quaternion,ue.scale),ue.matrixWorldInverse.copy(ue.matrixWorld).invert(),Ge[10]===-1)ue.projectionMatrix.copy(pe.projectionMatrix),ue.projectionMatrixInverse.copy(pe.projectionMatrixInverse);else{const Wt=rn+Qe,L=F+Qe,M=Ut-$t,ee=ze+(nt-$t),ce=zt*F/L*Wt,me=ot*F/L*Wt;ue.projectionMatrix.makePerspective(M,ee,ce,me,Wt,L),ue.projectionMatrixInverse.copy(ue.projectionMatrix).invert()}}function Se(ue,pe){pe===null?ue.matrixWorld.copy(ue.matrix):ue.matrixWorld.multiplyMatrices(pe.matrixWorld,ue.matrix),ue.matrixWorldInverse.copy(ue.matrixWorld).invert()}this.updateCamera=function(ue){if(s===null)return;let pe=ue.near,Ae=ue.far;x.texture!==null&&(x.depthNear>0&&(pe=x.depthNear),x.depthFar>0&&(Ae=x.depthFar)),Z.near=R.near=E.near=pe,Z.far=R.far=E.far=Ae,(I!==Z.near||$!==Z.far)&&(s.updateRenderState({depthNear:Z.near,depthFar:Z.far}),I=Z.near,$=Z.far),Z.layers.mask=ue.layers.mask|6,E.layers.mask=Z.layers.mask&3,R.layers.mask=Z.layers.mask&5;const nt=ue.parent,Ge=Z.cameras;Se(Z,nt);for(let gt=0;gt<Ge.length;gt++)Se(Ge[gt],nt);Ge.length===2?fe(Z,E,R):Z.projectionMatrix.copy(E.projectionMatrix),Ne(ue,Z,nt)};function Ne(ue,pe,Ae){Ae===null?ue.matrix.copy(pe.matrixWorld):(ue.matrix.copy(Ae.matrixWorld),ue.matrix.invert(),ue.matrix.multiply(pe.matrixWorld)),ue.matrix.decompose(ue.position,ue.quaternion,ue.scale),ue.updateMatrixWorld(!0),ue.projectionMatrix.copy(pe.projectionMatrix),ue.projectionMatrixInverse.copy(pe.projectionMatrixInverse),ue.isPerspectiveCamera&&(ue.fov=pa*2*Math.atan(1/ue.projectionMatrix.elements[5]),ue.zoom=1)}this.getCamera=function(){return Z},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(ue){c=ue,f!==null&&(f.fixedFoveation=ue),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=ue)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(Z)},this.getCameraTexture=function(ue){return g[ue]};let ct=null;function mt(ue,pe){if(d=pe.getViewerPose(l||a),_=pe,d!==null){const Ae=d.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let nt=!1;Ae.length!==Z.cameras.length&&(Z.cameras.length=0,nt=!0);for(let F=0;F<Ae.length;F++){const zt=Ae[F];let ot=null;if(p!==null)ot=p.getViewport(zt);else{const Be=h.getViewSubImage(f,zt);ot=Be.viewport,F===0&&(e.setRenderTargetTextures(S,Be.colorTexture,Be.depthStencilTexture),e.setRenderTarget(S))}let it=B[F];it===void 0&&(it=new kn,it.layers.enable(F),it.viewport=new Ot,B[F]=it),it.matrix.fromArray(zt.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(zt.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(ot.x,ot.y,ot.width,ot.height),F===0&&(Z.matrix.copy(it.matrix),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale)),nt===!0&&Z.cameras.push(it)}const Ge=s.enabledFeatures;if(Ge&&Ge.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){h=n.getBinding();const F=h.getDepthInformation(Ae[0]);F&&F.isValid&&F.texture&&x.init(F,s.renderState)}if(Ge&&Ge.includes("camera-access")&&y){e.state.unbindTexture(),h=n.getBinding();for(let F=0;F<Ae.length;F++){const zt=Ae[F].camera;if(zt){let ot=g[zt];ot||(ot=new dm,g[zt]=ot);const it=h.getCameraImage(zt);ot.sourceTexture=it}}}}for(let Ae=0;Ae<O.length;Ae++){const nt=k[Ae],Ge=O[Ae];nt!==null&&Ge!==void 0&&Ge.update(nt,pe,l||a)}ct&&ct(ue,pe),pe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:pe}),_=null}const pt=new vm;pt.setAnimationLoop(mt),this.setAnimationLoop=function(ue){ct=ue},this.dispose=function(){}}}const ps=new pi,xw=new Gt;function yw(i,e){function t(x,g){x.matrixAutoUpdate===!0&&x.updateMatrix(),g.value.copy(x.matrix)}function n(x,g){g.color.getRGB(x.fogColor.value,om(i)),g.isFog?(x.fogNear.value=g.near,x.fogFar.value=g.far):g.isFogExp2&&(x.fogDensity.value=g.density)}function s(x,g,T,A,S){g.isMeshBasicMaterial||g.isMeshLambertMaterial?r(x,g):g.isMeshToonMaterial?(r(x,g),h(x,g)):g.isMeshPhongMaterial?(r(x,g),d(x,g)):g.isMeshStandardMaterial?(r(x,g),f(x,g),g.isMeshPhysicalMaterial&&p(x,g,S)):g.isMeshMatcapMaterial?(r(x,g),_(x,g)):g.isMeshDepthMaterial?r(x,g):g.isMeshDistanceMaterial?(r(x,g),y(x,g)):g.isMeshNormalMaterial?r(x,g):g.isLineBasicMaterial?(a(x,g),g.isLineDashedMaterial&&o(x,g)):g.isPointsMaterial?c(x,g,T,A):g.isSpriteMaterial?l(x,g):g.isShadowMaterial?(x.color.value.copy(g.color),x.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(x,g){x.opacity.value=g.opacity,g.color&&x.diffuse.value.copy(g.color),g.emissive&&x.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(x.map.value=g.map,t(g.map,x.mapTransform)),g.alphaMap&&(x.alphaMap.value=g.alphaMap,t(g.alphaMap,x.alphaMapTransform)),g.bumpMap&&(x.bumpMap.value=g.bumpMap,t(g.bumpMap,x.bumpMapTransform),x.bumpScale.value=g.bumpScale,g.side===Rn&&(x.bumpScale.value*=-1)),g.normalMap&&(x.normalMap.value=g.normalMap,t(g.normalMap,x.normalMapTransform),x.normalScale.value.copy(g.normalScale),g.side===Rn&&x.normalScale.value.negate()),g.displacementMap&&(x.displacementMap.value=g.displacementMap,t(g.displacementMap,x.displacementMapTransform),x.displacementScale.value=g.displacementScale,x.displacementBias.value=g.displacementBias),g.emissiveMap&&(x.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,x.emissiveMapTransform)),g.specularMap&&(x.specularMap.value=g.specularMap,t(g.specularMap,x.specularMapTransform)),g.alphaTest>0&&(x.alphaTest.value=g.alphaTest);const T=e.get(g),A=T.envMap,S=T.envMapRotation;A&&(x.envMap.value=A,ps.copy(S),ps.x*=-1,ps.y*=-1,ps.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(ps.y*=-1,ps.z*=-1),x.envMapRotation.value.setFromMatrix4(xw.makeRotationFromEuler(ps)),x.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=g.reflectivity,x.ior.value=g.ior,x.refractionRatio.value=g.refractionRatio),g.lightMap&&(x.lightMap.value=g.lightMap,x.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,x.lightMapTransform)),g.aoMap&&(x.aoMap.value=g.aoMap,x.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,x.aoMapTransform))}function a(x,g){x.diffuse.value.copy(g.color),x.opacity.value=g.opacity,g.map&&(x.map.value=g.map,t(g.map,x.mapTransform))}function o(x,g){x.dashSize.value=g.dashSize,x.totalSize.value=g.dashSize+g.gapSize,x.scale.value=g.scale}function c(x,g,T,A){x.diffuse.value.copy(g.color),x.opacity.value=g.opacity,x.size.value=g.size*T,x.scale.value=A*.5,g.map&&(x.map.value=g.map,t(g.map,x.uvTransform)),g.alphaMap&&(x.alphaMap.value=g.alphaMap,t(g.alphaMap,x.alphaMapTransform)),g.alphaTest>0&&(x.alphaTest.value=g.alphaTest)}function l(x,g){x.diffuse.value.copy(g.color),x.opacity.value=g.opacity,x.rotation.value=g.rotation,g.map&&(x.map.value=g.map,t(g.map,x.mapTransform)),g.alphaMap&&(x.alphaMap.value=g.alphaMap,t(g.alphaMap,x.alphaMapTransform)),g.alphaTest>0&&(x.alphaTest.value=g.alphaTest)}function d(x,g){x.specular.value.copy(g.specular),x.shininess.value=Math.max(g.shininess,1e-4)}function h(x,g){g.gradientMap&&(x.gradientMap.value=g.gradientMap)}function f(x,g){x.metalness.value=g.metalness,g.metalnessMap&&(x.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,x.metalnessMapTransform)),x.roughness.value=g.roughness,g.roughnessMap&&(x.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,x.roughnessMapTransform)),g.envMap&&(x.envMapIntensity.value=g.envMapIntensity)}function p(x,g,T){x.ior.value=g.ior,g.sheen>0&&(x.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),x.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(x.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,x.sheenColorMapTransform)),g.sheenRoughnessMap&&(x.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,x.sheenRoughnessMapTransform))),g.clearcoat>0&&(x.clearcoat.value=g.clearcoat,x.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(x.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,x.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(x.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Rn&&x.clearcoatNormalScale.value.negate())),g.dispersion>0&&(x.dispersion.value=g.dispersion),g.iridescence>0&&(x.iridescence.value=g.iridescence,x.iridescenceIOR.value=g.iridescenceIOR,x.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(x.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,x.iridescenceMapTransform)),g.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),g.transmission>0&&(x.transmission.value=g.transmission,x.transmissionSamplerMap.value=T.texture,x.transmissionSamplerSize.value.set(T.width,T.height),g.transmissionMap&&(x.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,x.transmissionMapTransform)),x.thickness.value=g.thickness,g.thicknessMap&&(x.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=g.attenuationDistance,x.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(x.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(x.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=g.specularIntensity,x.specularColor.value.copy(g.specularColor),g.specularColorMap&&(x.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,x.specularColorMapTransform)),g.specularIntensityMap&&(x.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,x.specularIntensityMapTransform))}function _(x,g){g.matcap&&(x.matcap.value=g.matcap)}function y(x,g){const T=e.get(g).light;x.referencePosition.value.setFromMatrixPosition(T.matrixWorld),x.nearDistance.value=T.shadow.camera.near,x.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function bw(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(T,A){const S=A.program;n.uniformBlockBinding(T,S)}function l(T,A){let S=s[T.id];S===void 0&&(_(T),S=d(T),s[T.id]=S,T.addEventListener("dispose",x));const O=A.program;n.updateUBOMapping(T,O);const k=e.render.frame;r[T.id]!==k&&(f(T),r[T.id]=k)}function d(T){const A=h();T.__bindingPointIndex=A;const S=i.createBuffer(),O=T.__size,k=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,O,k),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,A,S),S}function h(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(T){const A=s[T.id],S=T.uniforms,O=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,A);for(let k=0,U=S.length;k<U;k++){const P=Array.isArray(S[k])?S[k]:[S[k]];for(let E=0,R=P.length;E<R;E++){const B=P[E];if(p(B,k,E,O)===!0){const Z=B.__offset,I=Array.isArray(B.value)?B.value:[B.value];let $=0;for(let H=0;H<I.length;H++){const z=I[H],W=y(z);typeof z=="number"||typeof z=="boolean"?(B.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,Z+$,B.__data)):z.isMatrix3?(B.__data[0]=z.elements[0],B.__data[1]=z.elements[1],B.__data[2]=z.elements[2],B.__data[3]=0,B.__data[4]=z.elements[3],B.__data[5]=z.elements[4],B.__data[6]=z.elements[5],B.__data[7]=0,B.__data[8]=z.elements[6],B.__data[9]=z.elements[7],B.__data[10]=z.elements[8],B.__data[11]=0):(z.toArray(B.__data,$),$+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,Z,B.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(T,A,S,O){const k=T.value,U=A+"_"+S;if(O[U]===void 0)return typeof k=="number"||typeof k=="boolean"?O[U]=k:O[U]=k.clone(),!0;{const P=O[U];if(typeof k=="number"||typeof k=="boolean"){if(P!==k)return O[U]=k,!0}else if(P.equals(k)===!1)return P.copy(k),!0}return!1}function _(T){const A=T.uniforms;let S=0;const O=16;for(let U=0,P=A.length;U<P;U++){const E=Array.isArray(A[U])?A[U]:[A[U]];for(let R=0,B=E.length;R<B;R++){const Z=E[R],I=Array.isArray(Z.value)?Z.value:[Z.value];for(let $=0,H=I.length;$<H;$++){const z=I[$],W=y(z),X=S%O,de=X%W.boundary,fe=X+de;S+=de,fe!==0&&O-fe<W.storage&&(S+=O-fe),Z.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),Z.__offset=S,S+=W.storage}}}const k=S%O;return k>0&&(S+=O-k),T.__size=S,T.__cache={},this}function y(T){const A={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(A.boundary=4,A.storage=4):T.isVector2?(A.boundary=8,A.storage=8):T.isVector3||T.isColor?(A.boundary=16,A.storage=12):T.isVector4?(A.boundary=16,A.storage=16):T.isMatrix3?(A.boundary=48,A.storage=48):T.isMatrix4?(A.boundary=64,A.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),A}function x(T){const A=T.target;A.removeEventListener("dispose",x);const S=a.indexOf(A.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function g(){for(const T in s)i.deleteBuffer(s[T]);a=[],s={},r={}}return{bind:c,update:l,dispose:g}}class Sw{constructor(e={}){const{canvas:t=zv(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const _=new Uint32Array(4),y=new Int32Array(4);let x=null,g=null;const T=[],A=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let O=!1;this._outputColorSpace=un;let k=0,U=0,P=null,E=-1,R=null;const B=new Ot,Z=new Ot;let I=null;const $=new Ze(0);let H=0,z=t.width,W=t.height,X=1,de=null,fe=null;const Se=new Ot(0,0,z,W),Ne=new Ot(0,0,z,W);let ct=!1;const mt=new Vh;let pt=!1,ue=!1;const pe=new Gt,Ae=new N,nt=new Ot,Ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let gt=!1;function rn(){return P===null?X:1}let F=n;function zt(C,j){return t.getContext(C,j)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ch}`),t.addEventListener("webglcontextlost",xe,!1),t.addEventListener("webglcontextrestored",Oe,!1),t.addEventListener("webglcontextcreationerror",_e,!1),F===null){const j="webgl2";if(F=zt(j,C),F===null)throw zt(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let ot,it,Be,Ut,ze,Qe,$t,Wt,L,M,ee,ce,me,re,je,we,Xe,Ue,ye,ke,qe,We,Re,et;function V(){ot=new Db(F),ot.init(),We=new pw(F,ot),it=new Eb(F,ot,e,We),Be=new dw(F,ot),it.reversedDepthBuffer&&f&&Be.buffers.depth.setReversed(!0),Ut=new Ob(F),ze=new QS,Qe=new fw(F,ot,Be,ze,it,We,Ut),$t=new Ab(S),Wt=new Ib(S),L=new H_(F),Re=new wb(F,L),M=new Lb(F,L,Ut,Re),ee=new Nb(F,M,L,Ut),ye=new Ub(F,it,Qe),we=new Tb(ze),ce=new ZS(S,$t,Wt,ot,it,Re,we),me=new yw(S,ze),re=new tw,je=new ow(ot),Ue=new Sb(S,$t,Wt,Be,ee,p,c),Xe=new hw(S,ee,it),et=new bw(F,Ut,it,Be),ke=new Mb(F,ot,Ut),qe=new kb(F,ot,Ut),Ut.programs=ce.programs,S.capabilities=it,S.extensions=ot,S.properties=ze,S.renderLists=re,S.shadowMap=Xe,S.state=Be,S.info=Ut}V();const be=new _w(S,F);this.xr=be,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const C=ot.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=ot.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(C){C!==void 0&&(X=C,this.setSize(z,W,!1))},this.getSize=function(C){return C.set(z,W)},this.setSize=function(C,j,ne=!0){if(be.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=C,W=j,t.width=Math.floor(C*X),t.height=Math.floor(j*X),ne===!0&&(t.style.width=C+"px",t.style.height=j+"px"),this.setViewport(0,0,C,j)},this.getDrawingBufferSize=function(C){return C.set(z*X,W*X).floor()},this.setDrawingBufferSize=function(C,j,ne){z=C,W=j,X=ne,t.width=Math.floor(C*ne),t.height=Math.floor(j*ne),this.setViewport(0,0,C,j)},this.getCurrentViewport=function(C){return C.copy(B)},this.getViewport=function(C){return C.copy(Se)},this.setViewport=function(C,j,ne,ie){C.isVector4?Se.set(C.x,C.y,C.z,C.w):Se.set(C,j,ne,ie),Be.viewport(B.copy(Se).multiplyScalar(X).round())},this.getScissor=function(C){return C.copy(Ne)},this.setScissor=function(C,j,ne,ie){C.isVector4?Ne.set(C.x,C.y,C.z,C.w):Ne.set(C,j,ne,ie),Be.scissor(Z.copy(Ne).multiplyScalar(X).round())},this.getScissorTest=function(){return ct},this.setScissorTest=function(C){Be.setScissorTest(ct=C)},this.setOpaqueSort=function(C){de=C},this.setTransparentSort=function(C){fe=C},this.getClearColor=function(C){return C.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor(...arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha(...arguments)},this.clear=function(C=!0,j=!0,ne=!0){let ie=0;if(C){let K=!1;if(P!==null){const ge=P.texture.format;K=ge===Uh||ge===Oh||ge===kh}if(K){const ge=P.texture.type,Ie=ge===fi||ge===Ps||ge===ha||ge===ua||ge===Dh||ge===Lh,He=Ue.getClearColor(),Ee=Ue.getClearAlpha(),tt=He.r,rt=He.g,Ke=He.b;Ie?(_[0]=tt,_[1]=rt,_[2]=Ke,_[3]=Ee,F.clearBufferuiv(F.COLOR,0,_)):(y[0]=tt,y[1]=rt,y[2]=Ke,y[3]=Ee,F.clearBufferiv(F.COLOR,0,y))}else ie|=F.COLOR_BUFFER_BIT}j&&(ie|=F.DEPTH_BUFFER_BIT),ne&&(ie|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",xe,!1),t.removeEventListener("webglcontextrestored",Oe,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),Ue.dispose(),re.dispose(),je.dispose(),ze.dispose(),$t.dispose(),Wt.dispose(),ee.dispose(),Re.dispose(),et.dispose(),ce.dispose(),be.dispose(),be.removeEventListener("sessionstart",Pn),be.removeEventListener("sessionend",Cr),Gn.stop()};function xe(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),O=!0}function Oe(){console.log("THREE.WebGLRenderer: Context Restored."),O=!1;const C=Ut.autoReset,j=Xe.enabled,ne=Xe.autoUpdate,ie=Xe.needsUpdate,K=Xe.type;V(),Ut.autoReset=C,Xe.enabled=j,Xe.autoUpdate=ne,Xe.needsUpdate=ie,Xe.type=K}function _e(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function oe(C){const j=C.target;j.removeEventListener("dispose",oe),$e(j)}function $e(C){st(C),ze.remove(C)}function st(C){const j=ze.get(C).programs;j!==void 0&&(j.forEach(function(ne){ce.releaseProgram(ne)}),C.isShaderMaterial&&ce.releaseShaderCache(C))}this.renderBufferDirect=function(C,j,ne,ie,K,ge){j===null&&(j=Ge);const Ie=K.isMesh&&K.matrixWorld.determinant()<0,He=al(C,j,ne,ie,K);Be.setMaterial(ie,Ie);let Ee=ne.index,tt=1;if(ie.wireframe===!0){if(Ee=M.getWireframeAttribute(ne),Ee===void 0)return;tt=2}const rt=ne.drawRange,Ke=ne.attributes.position;let dt=rt.start*tt,bt=(rt.start+rt.count)*tt;ge!==null&&(dt=Math.max(dt,ge.start*tt),bt=Math.min(bt,(ge.start+ge.count)*tt)),Ee!==null?(dt=Math.max(dt,0),bt=Math.min(bt,Ee.count)):Ke!=null&&(dt=Math.max(dt,0),bt=Math.min(bt,Ke.count));const Xt=bt-dt;if(Xt<0||Xt===1/0)return;Re.setup(K,ie,He,ne,Ee);let kt,At=ke;if(Ee!==null&&(kt=L.get(Ee),At=qe,At.setIndex(kt)),K.isMesh)ie.wireframe===!0?(Be.setLineWidth(ie.wireframeLinewidth*rn()),At.setMode(F.LINES)):At.setMode(F.TRIANGLES);else if(K.isLine){let De=ie.linewidth;De===void 0&&(De=1),Be.setLineWidth(De*rn()),K.isLineSegments?At.setMode(F.LINES):K.isLineLoop?At.setMode(F.LINE_LOOP):At.setMode(F.LINE_STRIP)}else K.isPoints?At.setMode(F.POINTS):K.isSprite&&At.setMode(F.TRIANGLES);if(K.isBatchedMesh)if(K._multiDrawInstances!==null)ma("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),At.renderMultiDrawInstances(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount,K._multiDrawInstances);else if(ot.get("WEBGL_multi_draw"))At.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{const De=K._multiDrawStarts,Mt=K._multiDrawCounts,xt=K._multiDrawCount,an=Ee?L.get(Ee).bytesPerElement:1,gi=ze.get(ie).currentProgram.getUniforms();for(let dn=0;dn<xt;dn++)gi.setValue(F,"_gl_DrawID",dn),At.render(De[dn]/an,Mt[dn])}else if(K.isInstancedMesh)At.renderInstances(dt,Xt,K.count);else if(ne.isInstancedBufferGeometry){const De=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,Mt=Math.min(ne.instanceCount,De);At.renderInstances(dt,Xt,Mt)}else At.render(dt,Xt)};function Tt(C,j,ne){C.transparent===!0&&C.side===On&&C.forceSinglePass===!1?(C.side=Rn,C.needsUpdate=!0,mi(C,j,ne),C.side=ts,C.needsUpdate=!0,mi(C,j,ne),C.side=On):mi(C,j,ne)}this.compile=function(C,j,ne=null){ne===null&&(ne=C),g=je.get(ne),g.init(j),A.push(g),ne.traverseVisible(function(K){K.isLight&&K.layers.test(j.layers)&&(g.pushLight(K),K.castShadow&&g.pushShadow(K))}),C!==ne&&C.traverseVisible(function(K){K.isLight&&K.layers.test(j.layers)&&(g.pushLight(K),K.castShadow&&g.pushShadow(K))}),g.setupLights();const ie=new Set;return C.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;const ge=K.material;if(ge)if(Array.isArray(ge))for(let Ie=0;Ie<ge.length;Ie++){const He=ge[Ie];Tt(He,ne,K),ie.add(He)}else Tt(ge,ne,K),ie.add(ge)}),g=A.pop(),ie},this.compileAsync=function(C,j,ne=null){const ie=this.compile(C,j,ne);return new Promise(K=>{function ge(){if(ie.forEach(function(Ie){ze.get(Ie).currentProgram.isReady()&&ie.delete(Ie)}),ie.size===0){K(C);return}setTimeout(ge,10)}ot.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let yt=null;function En(C){yt&&yt(C)}function Pn(){Gn.stop()}function Cr(){Gn.start()}const Gn=new vm;Gn.setAnimationLoop(En),typeof self<"u"&&Gn.setContext(self),this.setAnimationLoop=function(C){yt=C,be.setAnimationLoop(C),C===null?Gn.stop():Gn.start()},be.addEventListener("sessionstart",Pn),be.addEventListener("sessionend",Cr),this.render=function(C,j){if(j!==void 0&&j.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),be.enabled===!0&&be.isPresenting===!0&&(be.cameraAutoUpdate===!0&&be.updateCamera(j),j=be.getCamera()),C.isScene===!0&&C.onBeforeRender(S,C,j,P),g=je.get(C,A.length),g.init(j),A.push(g),pe.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),mt.setFromProjectionMatrix(pe,ui,j.reversedDepth),ue=this.localClippingEnabled,pt=we.init(this.clippingPlanes,ue),x=re.get(C,T.length),x.init(),T.push(x),be.enabled===!0&&be.isPresenting===!0){const ge=S.xr.getDepthSensingMesh();ge!==null&&ks(ge,j,-1/0,S.sortObjects)}ks(C,j,0,S.sortObjects),x.finish(),S.sortObjects===!0&&x.sort(de,fe),gt=be.enabled===!1||be.isPresenting===!1||be.hasDepthSensing()===!1,gt&&Ue.addToRenderList(x,C),this.info.render.frame++,pt===!0&&we.beginShadows();const ne=g.state.shadowsArray;Xe.render(ne,C,j),pt===!0&&we.endShadows(),this.info.autoReset===!0&&this.info.reset();const ie=x.opaque,K=x.transmissive;if(g.setupLights(),j.isArrayCamera){const ge=j.cameras;if(K.length>0)for(let Ie=0,He=ge.length;Ie<He;Ie++){const Ee=ge[Ie];Ta(ie,K,C,Ee)}gt&&Ue.render(C);for(let Ie=0,He=ge.length;Ie<He;Ie++){const Ee=ge[Ie];ns(x,C,Ee,Ee.viewport)}}else K.length>0&&Ta(ie,K,C,j),gt&&Ue.render(C),ns(x,C,j);P!==null&&U===0&&(Qe.updateMultisampleRenderTarget(P),Qe.updateRenderTargetMipmap(P)),C.isScene===!0&&C.onAfterRender(S,C,j),Re.resetDefaultState(),E=-1,R=null,A.pop(),A.length>0?(g=A[A.length-1],pt===!0&&we.setGlobalState(S.clippingPlanes,g.state.camera)):g=null,T.pop(),T.length>0?x=T[T.length-1]:x=null};function ks(C,j,ne,ie){if(C.visible===!1)return;if(C.layers.test(j.layers)){if(C.isGroup)ne=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(j);else if(C.isLight)g.pushLight(C),C.castShadow&&g.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||mt.intersectsSprite(C)){ie&&nt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(pe);const Ie=ee.update(C),He=C.material;He.visible&&x.push(C,Ie,He,ne,nt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||mt.intersectsObject(C))){const Ie=ee.update(C),He=C.material;if(ie&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),nt.copy(C.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),nt.copy(Ie.boundingSphere.center)),nt.applyMatrix4(C.matrixWorld).applyMatrix4(pe)),Array.isArray(He)){const Ee=Ie.groups;for(let tt=0,rt=Ee.length;tt<rt;tt++){const Ke=Ee[tt],dt=He[Ke.materialIndex];dt&&dt.visible&&x.push(C,Ie,dt,ne,nt.z,Ke)}}else He.visible&&x.push(C,Ie,He,ne,nt.z,null)}}const ge=C.children;for(let Ie=0,He=ge.length;Ie<He;Ie++)ks(ge[Ie],j,ne,ie)}function ns(C,j,ne,ie){const K=C.opaque,ge=C.transmissive,Ie=C.transparent;g.setupLightsView(ne),pt===!0&&we.setGlobalState(S.clippingPlanes,ne),ie&&Be.viewport(B.copy(ie)),K.length>0&&is(K,j,ne),ge.length>0&&is(ge,j,ne),Ie.length>0&&is(Ie,j,ne),Be.buffers.depth.setTest(!0),Be.buffers.depth.setMask(!0),Be.buffers.color.setMask(!0),Be.setPolygonOffset(!1)}function Ta(C,j,ne,ie){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[ie.id]===void 0&&(g.state.transmissionRenderTarget[ie.id]=new Zn(1,1,{generateMipmaps:!0,type:ot.has("EXT_color_buffer_half_float")||ot.has("EXT_color_buffer_float")?Di:fi,minFilter:Ms,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:St.workingColorSpace}));const ge=g.state.transmissionRenderTarget[ie.id],Ie=ie.viewport||B;ge.setSize(Ie.z*S.transmissionResolutionScale,Ie.w*S.transmissionResolutionScale);const He=S.getRenderTarget(),Ee=S.getActiveCubeFace(),tt=S.getActiveMipmapLevel();S.setRenderTarget(ge),S.getClearColor($),H=S.getClearAlpha(),H<1&&S.setClearColor(16777215,.5),S.clear(),gt&&Ue.render(ne);const rt=S.toneMapping;S.toneMapping=Qi;const Ke=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),g.setupLightsView(ie),pt===!0&&we.setGlobalState(S.clippingPlanes,ie),is(C,ne,ie),Qe.updateMultisampleRenderTarget(ge),Qe.updateRenderTargetMipmap(ge),ot.has("WEBGL_multisampled_render_to_texture")===!1){let dt=!1;for(let bt=0,Xt=j.length;bt<Xt;bt++){const kt=j[bt],At=kt.object,De=kt.geometry,Mt=kt.material,xt=kt.group;if(Mt.side===On&&At.layers.test(ie.layers)){const an=Mt.side;Mt.side=Rn,Mt.needsUpdate=!0,Aa(At,ne,ie,De,Mt,xt),Mt.side=an,Mt.needsUpdate=!0,dt=!0}}dt===!0&&(Qe.updateMultisampleRenderTarget(ge),Qe.updateRenderTargetMipmap(ge))}S.setRenderTarget(He,Ee,tt),S.setClearColor($,H),Ke!==void 0&&(ie.viewport=Ke),S.toneMapping=rt}function is(C,j,ne){const ie=j.isScene===!0?j.overrideMaterial:null;for(let K=0,ge=C.length;K<ge;K++){const Ie=C[K],He=Ie.object,Ee=Ie.geometry,tt=Ie.group;let rt=Ie.material;rt.allowOverride===!0&&ie!==null&&(rt=ie),He.layers.test(ne.layers)&&Aa(He,j,ne,Ee,rt,tt)}}function Aa(C,j,ne,ie,K,ge){C.onBeforeRender(S,j,ne,ie,K,ge),C.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),K.onBeforeRender(S,j,ne,ie,C,ge),K.transparent===!0&&K.side===On&&K.forceSinglePass===!1?(K.side=Rn,K.needsUpdate=!0,S.renderBufferDirect(ne,j,ie,K,C,ge),K.side=ts,K.needsUpdate=!0,S.renderBufferDirect(ne,j,ie,K,C,ge),K.side=On):S.renderBufferDirect(ne,j,ie,K,C,ge),C.onAfterRender(S,j,ne,ie,K,ge)}function mi(C,j,ne){j.isScene!==!0&&(j=Ge);const ie=ze.get(C),K=g.state.lights,ge=g.state.shadowsArray,Ie=K.state.version,He=ce.getParameters(C,K.state,ge,j,ne),Ee=ce.getProgramCacheKey(He);let tt=ie.programs;ie.environment=C.isMeshStandardMaterial?j.environment:null,ie.fog=j.fog,ie.envMap=(C.isMeshStandardMaterial?Wt:$t).get(C.envMap||ie.environment),ie.envMapRotation=ie.environment!==null&&C.envMap===null?j.environmentRotation:C.envMapRotation,tt===void 0&&(C.addEventListener("dispose",oe),tt=new Map,ie.programs=tt);let rt=tt.get(Ee);if(rt!==void 0){if(ie.currentProgram===rt&&ie.lightsStateVersion===Ie)return Ir(C,He),rt}else He.uniforms=ce.getUniforms(C),C.onBeforeCompile(He,S),rt=ce.acquireProgram(He,Ee),tt.set(Ee,rt),ie.uniforms=He.uniforms;const Ke=ie.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ke.clippingPlanes=we.uniform),Ir(C,He),ie.needsLights=Ra(C),ie.lightsStateVersion=Ie,ie.needsLights&&(Ke.ambientLightColor.value=K.state.ambient,Ke.lightProbe.value=K.state.probe,Ke.directionalLights.value=K.state.directional,Ke.directionalLightShadows.value=K.state.directionalShadow,Ke.spotLights.value=K.state.spot,Ke.spotLightShadows.value=K.state.spotShadow,Ke.rectAreaLights.value=K.state.rectArea,Ke.ltc_1.value=K.state.rectAreaLTC1,Ke.ltc_2.value=K.state.rectAreaLTC2,Ke.pointLights.value=K.state.point,Ke.pointLightShadows.value=K.state.pointShadow,Ke.hemisphereLights.value=K.state.hemi,Ke.directionalShadowMap.value=K.state.directionalShadowMap,Ke.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Ke.spotShadowMap.value=K.state.spotShadowMap,Ke.spotLightMatrix.value=K.state.spotLightMatrix,Ke.spotLightMap.value=K.state.spotLightMap,Ke.pointShadowMap.value=K.state.pointShadowMap,Ke.pointShadowMatrix.value=K.state.pointShadowMatrix),ie.currentProgram=rt,ie.uniformsList=null,rt}function Pr(C){if(C.uniformsList===null){const j=C.currentProgram.getUniforms();C.uniformsList=Mo.seqWithValue(j.seq,C.uniforms)}return C.uniformsList}function Ir(C,j){const ne=ze.get(C);ne.outputColorSpace=j.outputColorSpace,ne.batching=j.batching,ne.batchingColor=j.batchingColor,ne.instancing=j.instancing,ne.instancingColor=j.instancingColor,ne.instancingMorph=j.instancingMorph,ne.skinning=j.skinning,ne.morphTargets=j.morphTargets,ne.morphNormals=j.morphNormals,ne.morphColors=j.morphColors,ne.morphTargetsCount=j.morphTargetsCount,ne.numClippingPlanes=j.numClippingPlanes,ne.numIntersection=j.numClipIntersection,ne.vertexAlphas=j.vertexAlphas,ne.vertexTangents=j.vertexTangents,ne.toneMapping=j.toneMapping}function al(C,j,ne,ie,K){j.isScene!==!0&&(j=Ge),Qe.resetTextureUnits();const ge=j.fog,Ie=ie.isMeshStandardMaterial?j.environment:null,He=P===null?S.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Sr,Ee=(ie.isMeshStandardMaterial?Wt:$t).get(ie.envMap||Ie),tt=ie.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,rt=!!ne.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),Ke=!!ne.morphAttributes.position,dt=!!ne.morphAttributes.normal,bt=!!ne.morphAttributes.color;let Xt=Qi;ie.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Xt=S.toneMapping);const kt=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,At=kt!==void 0?kt.length:0,De=ze.get(ie),Mt=g.state.lights;if(pt===!0&&(ue===!0||C!==R)){const jt=C===R&&ie.id===E;we.setState(ie,C,jt)}let xt=!1;ie.version===De.__version?(De.needsLights&&De.lightsStateVersion!==Mt.state.version||De.outputColorSpace!==He||K.isBatchedMesh&&De.batching===!1||!K.isBatchedMesh&&De.batching===!0||K.isBatchedMesh&&De.batchingColor===!0&&K.colorTexture===null||K.isBatchedMesh&&De.batchingColor===!1&&K.colorTexture!==null||K.isInstancedMesh&&De.instancing===!1||!K.isInstancedMesh&&De.instancing===!0||K.isSkinnedMesh&&De.skinning===!1||!K.isSkinnedMesh&&De.skinning===!0||K.isInstancedMesh&&De.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&De.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&De.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&De.instancingMorph===!1&&K.morphTexture!==null||De.envMap!==Ee||ie.fog===!0&&De.fog!==ge||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==we.numPlanes||De.numIntersection!==we.numIntersection)||De.vertexAlphas!==tt||De.vertexTangents!==rt||De.morphTargets!==Ke||De.morphNormals!==dt||De.morphColors!==bt||De.toneMapping!==Xt||De.morphTargetsCount!==At)&&(xt=!0):(xt=!0,De.__version=ie.version);let an=De.currentProgram;xt===!0&&(an=mi(ie,j,K));let gi=!1,dn=!1,ss=!1;const Nt=an.getUniforms(),Qt=De.uniforms;if(Be.useProgram(an.program)&&(gi=!0,dn=!0,ss=!0),ie.id!==E&&(E=ie.id,dn=!0),gi||R!==C){Be.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Nt.setValue(F,"projectionMatrix",C.projectionMatrix),Nt.setValue(F,"viewMatrix",C.matrixWorldInverse);const fn=Nt.map.cameraPosition;fn!==void 0&&fn.setValue(F,Ae.setFromMatrixPosition(C.matrixWorld)),it.logarithmicDepthBuffer&&Nt.setValue(F,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Nt.setValue(F,"isOrthographic",C.isOrthographicCamera===!0),R!==C&&(R=C,dn=!0,ss=!0)}if(K.isSkinnedMesh){Nt.setOptional(F,K,"bindMatrix"),Nt.setOptional(F,K,"bindMatrixInverse");const jt=K.skeleton;jt&&(jt.boneTexture===null&&jt.computeBoneTexture(),Nt.setValue(F,"boneTexture",jt.boneTexture,Qe))}K.isBatchedMesh&&(Nt.setOptional(F,K,"batchingTexture"),Nt.setValue(F,"batchingTexture",K._matricesTexture,Qe),Nt.setOptional(F,K,"batchingIdTexture"),Nt.setValue(F,"batchingIdTexture",K._indirectTexture,Qe),Nt.setOptional(F,K,"batchingColorTexture"),K._colorsTexture!==null&&Nt.setValue(F,"batchingColorTexture",K._colorsTexture,Qe));const en=ne.morphAttributes;if((en.position!==void 0||en.normal!==void 0||en.color!==void 0)&&ye.update(K,ne,an),(dn||De.receiveShadow!==K.receiveShadow)&&(De.receiveShadow=K.receiveShadow,Nt.setValue(F,"receiveShadow",K.receiveShadow)),ie.isMeshGouraudMaterial&&ie.envMap!==null&&(Qt.envMap.value=Ee,Qt.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),ie.isMeshStandardMaterial&&ie.envMap===null&&j.environment!==null&&(Qt.envMapIntensity.value=j.environmentIntensity),dn&&(Nt.setValue(F,"toneMappingExposure",S.toneMappingExposure),De.needsLights&&In(Qt,ss),ge&&ie.fog===!0&&me.refreshFogUniforms(Qt,ge),me.refreshMaterialUniforms(Qt,ie,X,W,g.state.transmissionRenderTarget[C.id]),Mo.upload(F,Pr(De),Qt,Qe)),ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(Mo.upload(F,Pr(De),Qt,Qe),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Nt.setValue(F,"center",K.center),Nt.setValue(F,"modelViewMatrix",K.modelViewMatrix),Nt.setValue(F,"normalMatrix",K.normalMatrix),Nt.setValue(F,"modelMatrix",K.matrixWorld),ie.isShaderMaterial||ie.isRawShaderMaterial){const jt=ie.uniformsGroups;for(let fn=0,Dr=jt.length;fn<Dr;fn++){const vi=jt[fn];et.update(vi,an),et.bind(vi,an)}}return an}function In(C,j){C.ambientLightColor.needsUpdate=j,C.lightProbe.needsUpdate=j,C.directionalLights.needsUpdate=j,C.directionalLightShadows.needsUpdate=j,C.pointLights.needsUpdate=j,C.pointLightShadows.needsUpdate=j,C.spotLights.needsUpdate=j,C.spotLightShadows.needsUpdate=j,C.rectAreaLights.needsUpdate=j,C.hemisphereLights.needsUpdate=j}function Ra(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(C,j,ne){const ie=ze.get(C);ie.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,ie.__autoAllocateDepthBuffer===!1&&(ie.__useRenderToTexture=!1),ze.get(C.texture).__webglTexture=j,ze.get(C.depthTexture).__webglTexture=ie.__autoAllocateDepthBuffer?void 0:ne,ie.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,j){const ne=ze.get(C);ne.__webglFramebuffer=j,ne.__useDefaultFramebuffer=j===void 0};const Ca=F.createFramebuffer();this.setRenderTarget=function(C,j=0,ne=0){P=C,k=j,U=ne;let ie=!0,K=null,ge=!1,Ie=!1;if(C){const Ee=ze.get(C);if(Ee.__useDefaultFramebuffer!==void 0)Be.bindFramebuffer(F.FRAMEBUFFER,null),ie=!1;else if(Ee.__webglFramebuffer===void 0)Qe.setupRenderTarget(C);else if(Ee.__hasExternalTextures)Qe.rebindTextures(C,ze.get(C.texture).__webglTexture,ze.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Ke=C.depthTexture;if(Ee.__boundDepthTexture!==Ke){if(Ke!==null&&ze.has(Ke)&&(C.width!==Ke.image.width||C.height!==Ke.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Qe.setupDepthRenderbuffer(C)}}const tt=C.texture;(tt.isData3DTexture||tt.isDataArrayTexture||tt.isCompressedArrayTexture)&&(Ie=!0);const rt=ze.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(rt[j])?K=rt[j][ne]:K=rt[j],ge=!0):C.samples>0&&Qe.useMultisampledRTT(C)===!1?K=ze.get(C).__webglMultisampledFramebuffer:Array.isArray(rt)?K=rt[ne]:K=rt,B.copy(C.viewport),Z.copy(C.scissor),I=C.scissorTest}else B.copy(Se).multiplyScalar(X).floor(),Z.copy(Ne).multiplyScalar(X).floor(),I=ct;if(ne!==0&&(K=Ca),Be.bindFramebuffer(F.FRAMEBUFFER,K)&&ie&&Be.drawBuffers(C,K),Be.viewport(B),Be.scissor(Z),Be.setScissorTest(I),ge){const Ee=ze.get(C.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee.__webglTexture,ne)}else if(Ie){const Ee=j;for(let tt=0;tt<C.textures.length;tt++){const rt=ze.get(C.textures[tt]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+tt,rt.__webglTexture,ne,Ee)}}else if(C!==null&&ne!==0){const Ee=ze.get(C.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Ee.__webglTexture,ne)}E=-1},this.readRenderTargetPixels=function(C,j,ne,ie,K,ge,Ie,He=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=ze.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ee=Ee[Ie]),Ee){Be.bindFramebuffer(F.FRAMEBUFFER,Ee);try{const tt=C.textures[He],rt=tt.format,Ke=tt.type;if(!it.textureFormatReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=C.width-ie&&ne>=0&&ne<=C.height-K&&(C.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+He),F.readPixels(j,ne,ie,K,We.convert(rt),We.convert(Ke),ge))}finally{const tt=P!==null?ze.get(P).__webglFramebuffer:null;Be.bindFramebuffer(F.FRAMEBUFFER,tt)}}},this.readRenderTargetPixelsAsync=async function(C,j,ne,ie,K,ge,Ie,He=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=ze.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ee=Ee[Ie]),Ee)if(j>=0&&j<=C.width-ie&&ne>=0&&ne<=C.height-K){Be.bindFramebuffer(F.FRAMEBUFFER,Ee);const tt=C.textures[He],rt=tt.format,Ke=tt.type;if(!it.textureFormatReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const dt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,dt),F.bufferData(F.PIXEL_PACK_BUFFER,ge.byteLength,F.STREAM_READ),C.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+He),F.readPixels(j,ne,ie,K,We.convert(rt),We.convert(Ke),0);const bt=P!==null?ze.get(P).__webglFramebuffer:null;Be.bindFramebuffer(F.FRAMEBUFFER,bt);const Xt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Hv(F,Xt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,dt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ge),F.deleteBuffer(dt),F.deleteSync(Xt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,j=null,ne=0){const ie=Math.pow(2,-ne),K=Math.floor(C.image.width*ie),ge=Math.floor(C.image.height*ie),Ie=j!==null?j.x:0,He=j!==null?j.y:0;Qe.setTexture2D(C,0),F.copyTexSubImage2D(F.TEXTURE_2D,ne,0,0,Ie,He,K,ge),Be.unbindTexture()};const $n=F.createFramebuffer(),Pa=F.createFramebuffer();this.copyTextureToTexture=function(C,j,ne=null,ie=null,K=0,ge=null){ge===null&&(K!==0?(ma("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ge=K,K=0):ge=0);let Ie,He,Ee,tt,rt,Ke,dt,bt,Xt;const kt=C.isCompressedTexture?C.mipmaps[ge]:C.image;if(ne!==null)Ie=ne.max.x-ne.min.x,He=ne.max.y-ne.min.y,Ee=ne.isBox3?ne.max.z-ne.min.z:1,tt=ne.min.x,rt=ne.min.y,Ke=ne.isBox3?ne.min.z:0;else{const en=Math.pow(2,-K);Ie=Math.floor(kt.width*en),He=Math.floor(kt.height*en),C.isDataArrayTexture?Ee=kt.depth:C.isData3DTexture?Ee=Math.floor(kt.depth*en):Ee=1,tt=0,rt=0,Ke=0}ie!==null?(dt=ie.x,bt=ie.y,Xt=ie.z):(dt=0,bt=0,Xt=0);const At=We.convert(j.format),De=We.convert(j.type);let Mt;j.isData3DTexture?(Qe.setTexture3D(j,0),Mt=F.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(Qe.setTexture2DArray(j,0),Mt=F.TEXTURE_2D_ARRAY):(Qe.setTexture2D(j,0),Mt=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,j.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,j.unpackAlignment);const xt=F.getParameter(F.UNPACK_ROW_LENGTH),an=F.getParameter(F.UNPACK_IMAGE_HEIGHT),gi=F.getParameter(F.UNPACK_SKIP_PIXELS),dn=F.getParameter(F.UNPACK_SKIP_ROWS),ss=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,kt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,kt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,tt),F.pixelStorei(F.UNPACK_SKIP_ROWS,rt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Ke);const Nt=C.isDataArrayTexture||C.isData3DTexture,Qt=j.isDataArrayTexture||j.isData3DTexture;if(C.isDepthTexture){const en=ze.get(C),jt=ze.get(j),fn=ze.get(en.__renderTarget),Dr=ze.get(jt.__renderTarget);Be.bindFramebuffer(F.READ_FRAMEBUFFER,fn.__webglFramebuffer),Be.bindFramebuffer(F.DRAW_FRAMEBUFFER,Dr.__webglFramebuffer);for(let vi=0;vi<Ee;vi++)Nt&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ze.get(C).__webglTexture,K,Ke+vi),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ze.get(j).__webglTexture,ge,Xt+vi)),F.blitFramebuffer(tt,rt,Ie,He,dt,bt,Ie,He,F.DEPTH_BUFFER_BIT,F.NEAREST);Be.bindFramebuffer(F.READ_FRAMEBUFFER,null),Be.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(K!==0||C.isRenderTargetTexture||ze.has(C)){const en=ze.get(C),jt=ze.get(j);Be.bindFramebuffer(F.READ_FRAMEBUFFER,$n),Be.bindFramebuffer(F.DRAW_FRAMEBUFFER,Pa);for(let fn=0;fn<Ee;fn++)Nt?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,en.__webglTexture,K,Ke+fn):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,en.__webglTexture,K),Qt?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,jt.__webglTexture,ge,Xt+fn):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,jt.__webglTexture,ge),K!==0?F.blitFramebuffer(tt,rt,Ie,He,dt,bt,Ie,He,F.COLOR_BUFFER_BIT,F.NEAREST):Qt?F.copyTexSubImage3D(Mt,ge,dt,bt,Xt+fn,tt,rt,Ie,He):F.copyTexSubImage2D(Mt,ge,dt,bt,tt,rt,Ie,He);Be.bindFramebuffer(F.READ_FRAMEBUFFER,null),Be.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Qt?C.isDataTexture||C.isData3DTexture?F.texSubImage3D(Mt,ge,dt,bt,Xt,Ie,He,Ee,At,De,kt.data):j.isCompressedArrayTexture?F.compressedTexSubImage3D(Mt,ge,dt,bt,Xt,Ie,He,Ee,At,kt.data):F.texSubImage3D(Mt,ge,dt,bt,Xt,Ie,He,Ee,At,De,kt):C.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ge,dt,bt,Ie,He,At,De,kt.data):C.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ge,dt,bt,kt.width,kt.height,At,kt.data):F.texSubImage2D(F.TEXTURE_2D,ge,dt,bt,Ie,He,At,De,kt);F.pixelStorei(F.UNPACK_ROW_LENGTH,xt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,an),F.pixelStorei(F.UNPACK_SKIP_PIXELS,gi),F.pixelStorei(F.UNPACK_SKIP_ROWS,dn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,ss),ge===0&&j.generateMipmaps&&F.generateMipmap(Mt),Be.unbindTexture()},this.initRenderTarget=function(C){ze.get(C).__webglFramebuffer===void 0&&Qe.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?Qe.setTextureCube(C,0):C.isData3DTexture?Qe.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?Qe.setTexture2DArray(C,0):Qe.setTexture2D(C,0),Be.unbindTexture()},this.resetState=function(){k=0,U=0,P=null,Be.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ui}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=St._getDrawingBufferColorSpace(e),t.unpackColorSpace=St._getUnpackColorSpace()}}const Eo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Rr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ww=new Yh(-1,1,1,-1,0,1);class Mw extends Kt{constructor(){super(),this.setAttribute("position",new wt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new wt([0,2,0,0,2,0],2))}}const Ew=new Mw;class Jh{constructor(e){this._mesh=new Et(Ew,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ww)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Tw extends Rr{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Sn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ga.clone(e.uniforms),this.material=new Sn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Jh(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class df extends Rr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Aw extends Rr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Rw{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Te);this._width=n.width,this._height=n.height,t=new Zn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Di}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Tw(Eo),this.copyPass.material.blending=Ii,this.clock=new gm}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}df!==void 0&&(a instanceof df?n=!0:a instanceof Aw&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const po={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Cw extends Rr{constructor(){super(),this.uniforms=ga.clone(po.uniforms),this.material=new I_({name:po.name,uniforms:this.uniforms,vertexShader:po.vertexShader,fragmentShader:po.fragmentShader}),this._fsQuad=new Jh(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},St.getTransfer(this._outputColorSpace)===It&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Bp?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===zp?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Hp?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ph?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Gp?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===$p?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Vp&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Pw extends Rr{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ze}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const Iw={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ze(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Mr extends Rr{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Te(e.x,e.y):new Te(256,256),this.clearColor=new Ze(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Zn(r,a,{type:Di}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const h=new Zn(r,a,{type:Di});h.texture.name="UnrealBloomPass.h"+d,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const f=new Zn(r,a,{type:Di});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=Iw;this.highPassUniforms=ga.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Sn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Te(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ga.clone(Eo.uniforms),this.blendMaterial=new Sn({uniforms:this.copyUniforms,vertexShader:Eo.vertexShader,fragmentShader:Eo.fragmentShader,blending:_r,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ze,this._oldClearAlpha=1,this._basic=new Bn,this._fsQuad=new Jh(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Te(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Mr.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Mr.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Sn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Te(.5,.5)},direction:{value:new Te(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new Sn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Mr.BlurDirectionX=new Te(1,0);Mr.BlurDirectionY=new Te(0,1);const Dw={move:{color:3846399,opacity:.35},dest:{color:8378623,opacity:.75},attack:{color:16726843,opacity:.6,pulse:!0},attackFar:{color:16742971,opacity:.3},deploy:{color:4259792,opacity:.4,pulse:!0},friendly:{color:5308272,opacity:.55,pulse:!0},enemy:{color:16728160,opacity:.6,pulse:!0},selected:{color:16769126,opacity:.7},hover:{color:16777215,opacity:.25}},cr=3841023,hr=16727386,ar=11963647,Jr=0,ii={linear:i=>i,outCubic:i=>1-Math.pow(1-i,3),inOutQuad:i=>i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2,outBack:i=>1+2.70158*Math.pow(i-1,3)+1.70158*Math.pow(i-1,2)},ff=new Map;function Lw(i){let e=ff.get(i);if(e)return e;const t=document.createElement("canvas");t.width=t.height=128;const n=t.getContext("2d");return n.font='96px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',n.textAlign="center",n.textBaseline="middle",n.shadowColor="rgba(0,0,0,0.6)",n.shadowBlur=8,n.fillText(i,64,72),e=new Es(t),e.colorSpace=un,ff.set(i,e),e}function sc(i,e,t=64,n="#000"){const s=document.createElement("canvas");s.width=256,s.height=128;const r=s.getContext("2d");r.font=`900 ${t}px Inter, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.lineWidth=10,r.strokeStyle=n,r.strokeText(i,128,64),r.fillStyle=e,r.fillText(i,128,64);const a=new Es(s);a.colorSpace=un;const o=new lr(new bs({map:a,transparent:!0,depthTest:!1}));return o.scale.set(2,1,1),o.renderOrder=10,o}function kw(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}const Wr=5,rc=.64,Ow=["guardian","firstStrike","deadly","flying","barrier","drain","regenerate","siege","swift"],Uw={guardian:"#7fb2ff",firstStrike:"#ffd76a",deadly:"#b07cff",flying:"#bfe9ff",barrier:"#ffe9a0",drain:"#ff5a6e",regenerate:"#7ddc6a",siege:"#ff9a4d",swift:"#9ff5ff"};class ac{constructor(e,t){this.group=new Yi,this.body=new Yi,this.statCanvas=document.createElement("canvas"),this.statusCanvas=document.createElement("canvas"),this.rangeMarks=new Yi,this.rangeBadge=null,this.kwCanvas=document.createElement("canvas"),this.flyHeight=0,this.canActNow=!1,this.data=structuredClone(e),this.mine=t;const n=Ye(e.cardId),s=new Ze(bn[n.color].hex),r=t?cr:hr;this.base=new Et(new Ki(.62,.7,.22,32),new zn({color:1711398,metalness:.6,roughness:.35,emissive:r,emissiveIntensity:.25})),this.base.position.y=.11,this.base.castShadow=!0,this.base.userData.uid=e.uid;const a=new Et(new nl(.66,.05,8,48),new zn({color:r,emissive:r,emissiveIntensity:1.4}));a.rotation.x=Math.PI/2,a.position.y=.2;const o=new Et(new Ki(.52,.52,.06,32),new zn({color:s,emissive:s,emissiveIntensity:.35,metalness:.3,roughness:.4}));o.position.y=.25,this.body.add(this.base,a,o),this.icon=new lr(new bs({map:Lw(n.icon),transparent:!0,alphaTest:.1})),this.icon.scale.set(1.25,1.25,1),this.icon.position.y=.95,this.body.add(this.icon),this.statCanvas.width=256,this.statCanvas.height=96,this.statTex=new Es(this.statCanvas),this.statTex.colorSpace=un,this.stats=new lr(new bs({map:this.statTex,transparent:!0,depthTest:!1})),this.stats.scale.set(1.5,.56,1),this.stats.position.set(0,.42,0),this.stats.renderOrder=5,this.group.add(this.stats),this.ring=new Et(new va(.72,.86,48),new Bn({color:16769126,transparent:!0,opacity:0,side:On})),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=.03,this.group.add(this.ring),this.bubble=new Et(new _a(.85,24,16),new zn({color:16771488,emissive:16763213,emissiveIntensity:.6,transparent:!0,opacity:.22,depthWrite:!1})),this.bubble.position.y=.7,this.body.add(this.bubble),this.ice=new Et(new el(.75,0),new zn({color:11462911,emissive:7327999,emissiveIntensity:.5,transparent:!0,opacity:.35,depthWrite:!1,flatShading:!0})),this.ice.position.y=.75,this.ice.scale.set(1,1.25,1),this.body.add(this.ice),this.roots=new Et(new Xh(.5,.06,64,6,2,5),new zn({color:6000430,emissive:3103250,roughness:.9})),this.roots.rotation.x=Math.PI/2,this.roots.position.y=.3,this.roots.scale.set(1.1,1.1,.6),this.body.add(this.roots),this.kwCanvas.width=80*Wr,this.kwCanvas.height=80,this.kwTex=new Es(this.kwCanvas),this.kwTex.colorSpace=un,this.kwBadges=new lr(new bs({map:this.kwTex,transparent:!0,depthTest:!1})),this.kwBadges.scale.set(rc*Wr,rc,1),this.kwBadges.position.set(0,.42-.28-rc*.42,0),this.kwBadges.renderOrder=6,this.group.add(this.kwBadges),this.statusCanvas.width=256,this.statusCanvas.height=72,this.statusTex=new Es(this.statusCanvas),this.statusTex.colorSpace=un,this.status=new lr(new bs({map:this.statusTex,transparent:!0,depthTest:!1})),this.status.scale.set(2.2,.62,1),this.status.position.y=1.95,this.status.renderOrder=6,this.body.add(this.status),((n.range??1)>1||e.range>1)&&this.addRangeMarks(e.range),this.group.add(this.body),this.flyHeight=e.kw.includes("flying")?.45:0,this.place(e),this.refresh(e,!1,0)}addRangeMarks(e){const t=new Bn({color:7325951});for(let a=0;a<10;a++){const o=a/10*Math.PI*2,c=new Et(new Tr(.16,.05,.07),t);c.position.set(Math.cos(o)*.86,.06,Math.sin(o)*.86),c.rotation.y=-o+Math.PI/2,this.rangeMarks.add(c)}this.body.add(this.rangeMarks);const n=document.createElement("canvas");n.width=n.height=96;const s=n.getContext("2d");s.fillStyle="#1b5fb8",s.beginPath(),s.arc(48,48,44,0,Math.PI*2),s.fill(),s.lineWidth=6,s.strokeStyle="#bfe4ff",s.stroke(),s.font='40px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',s.textAlign="center",s.textBaseline="middle",s.fillText("🏹",40,44),s.font="900 30px Inter, sans-serif",s.fillStyle="#fff",s.strokeStyle="#000",s.lineWidth=5,s.strokeText(String(e),70,70),s.fillText(String(e),70,70);const r=new Es(n);r.colorSpace=un,this.rangeBadge=new lr(new bs({map:r,transparent:!0,depthTest:!1})),this.rangeBadge.scale.set(.72,.72,1),this.rangeBadge.position.set(-.7,1.35,0),this.rangeBadge.renderOrder=6,this.body.add(this.rangeBadge)}place(e){const t=ms(e);this.group.position.set(t.x,Jr,t.z)}refresh(e,t,n){this.data=structuredClone(e);const s=Ye(e.cardId);this.canActNow=t,this.bubble.visible=e.kw.includes("barrier");const r=e.frozenUntil>=n;this.ice.visible=r,this.roots.visible=e.rootedUntil>=n,this.flyHeight=e.kw.includes("flying")?.45:0;const a=e.summonedRound===n&&!e.kw.includes("swift")&&!e.exhausted,o=e.exhausted||a;this.icon.material.color.set(r?10476799:o?7304068:16777215),this.icon.material.rotation=e.exhausted&&!r?-.35:0;const c=this.statusCanvas.getContext("2d");c.clearRect(0,0,256,72);const l=[];r?l.push(["❄️","#6fd0ff"]):a?l.push(["💤","#b9a8ff"]):e.exhausted&&l.push(["✓","#9aa0b4"]),e.rootedUntil>=n&&l.push(["🕸️","#8fd05a"]),e.tempAtk>0&&l.push(["🔥","#ffb04d"]);const d=64;l.forEach(([_,y],x)=>{const g=128-l.length*d/2+x*d+d/2;c.fillStyle="rgba(10,8,20,0.8)",c.beginPath(),c.arc(g,36,30,0,Math.PI*2),c.fill(),c.lineWidth=4,c.strokeStyle=y,c.stroke(),c.font=_==="✓"?"900 34px Inter, sans-serif":'34px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',c.textAlign="center",c.textBaseline="middle",c.fillStyle=y,c.fillText(_,g,38)}),this.statusTex.needsUpdate=!0,e.range>1&&!this.rangeBadge&&this.addRangeMarks(e.range),this.drawKeywords(e,a||e.summonedRound===n);const h=this.statCanvas.getContext("2d");h.clearRect(0,0,256,96);const f=Math.max(0,e.atk+e.tempAtk),p=(_,y,x,g)=>{h.fillStyle=x,kw(h,_,14,84,68,22),h.fill(),h.lineWidth=5,h.strokeStyle="rgba(0,0,0,0.7)",h.stroke(),h.font="900 54px Inter, sans-serif",h.textAlign="center",h.textBaseline="middle",h.lineWidth=8,h.strokeStyle="#000",h.strokeText(String(y),_+42,50),h.fillStyle=g,h.fillText(String(y),_+42,50)};p(14,f,"#d9822b",f>(s.atk??0)?"#b6ff9a":f<(s.atk??0)?"#ffb0b0":"#fff"),p(158,e.hp,"#c22d43",e.hp<e.maxHp?"#ffb0b0":e.hp>(s.hp??0)?"#b6ff9a":"#fff"),this.statTex.needsUpdate=!0}drawKeywords(e,t){const n=Ow.filter(r=>e.kw.includes(r)&&(r!=="swift"||t)).slice(0,Wr),s=this.kwCanvas.getContext("2d");s.clearRect(0,0,80*Wr,80),n.forEach((r,a)=>{const o=40*Wr-n.length*80/2+40+a*80;s.fillStyle="rgba(12,10,24,0.85)",s.beginPath(),s.arc(o,40,34,0,Math.PI*2),s.fill(),s.lineWidth=5,s.strokeStyle=Uw[r]??"#ffd76a",s.stroke(),s.font='38px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',s.textAlign="center",s.textBaseline="middle",s.fillText(As[r].icon,o,43)}),this.kwTex.needsUpdate=!0}tick(e,t){const n=this.flyHeight;this.body.position.y=n+(n?Math.sin(e*2+this.data.uid)*.08:0),this.icon.position.y=.95+Math.sin(e*1.6+this.data.uid*1.3)*.04;const s=this.ring.material;s.color.setHex(this.mine?16769126:16742973),s.opacity=this.canActNow?this.mine&&t?.6+Math.sin(e*4)*.3:.35:0,this.bubble.rotation.y=e}}class Nw{constructor(e,t,n,s,r,a,o=1,c=1){this.maxLife=e,this.life=0;const l=new Kt,d=new Float32Array(s*3);this.vel=new Float32Array(s*3);for(let h=0;h<s;h++){d[h*3]=t.x+(Math.random()-.5)*.3*c,d[h*3+1]=t.y+Math.random()*.3,d[h*3+2]=t.z+(Math.random()-.5)*.3*c;const f=Math.random()*Math.PI*2,p=(.3+Math.random())*r;this.vel[h*3]=Math.cos(f)*p*c,this.vel[h*3+1]=(.5+Math.random())*r*o,this.vel[h*3+2]=Math.sin(f)*p*c}l.setAttribute("position",new Cn(d,3)),this.points=new lh(l,new Bo({color:n,size:a,transparent:!0,opacity:1,blending:_r,depthWrite:!1,map:Sm()}))}update(e){this.life+=e;const t=this.points.geometry.getAttribute("position"),n=t.array;for(let s=0;s<n.length;s+=3)n[s]+=this.vel[s]*e,n[s+1]+=this.vel[s+1]*e,n[s+2]+=this.vel[s+2]*e,this.vel[s+1]-=3*e,this.vel[s]*=.97,this.vel[s+2]*=.97;return t.needsUpdate=!0,this.points.material.opacity=Math.max(0,1-this.life/this.maxLife),this.life<this.maxLife}}let mo=null;function Sm(){if(mo)return mo;const i=document.createElement("canvas");i.width=i.height=64;const e=i.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.3,"rgba(255,255,255,0.6)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),mo=new Es(i),mo}const Fw={fire:16738842,explosion:16747050,frost:9430015,lightning:16773994,holy:16769658,shadow:11754751,poison:8257370,roots:8240954,wave:3848447,start:16777215,summon:16777215};class Bw{constructor(e){this.scene=new u_,this.clock=new gm,this.tiles=new Map,this.units=new Map,this.orbs=[],this.sanctums=[],this.tweens=[],this.bursts=[],this.floaters=[],this.raycaster=new B_,this.mouse=new Te(-10,-10),this.seat=0,this.menuMode=!0,this.myTurn=!1,this.shake=0,this.camBase=new N,this.camTarget=new N,this.hoverKey=null,this.hoverSanctum=null,this.speed=1,this.guide=null,this.onHexClick=()=>{},this.onHexHover=()=>{},this.onSanctumClick=()=>{},this.onSanctumHover=()=>{},this.onRightClick=()=>{},this.renderer=new Sw({canvas:e,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Np,this.renderer.toneMapping=Ph,this.renderer.toneMappingExposure=1.05,this.camera=new kn(42,1,.1,200),this.composer=new Rw(this.renderer),this.composer.addPass(new Pw(this.scene,this.camera)),this.composer.addPass(new Mr(new Te(512,512),.7,.5,.82)),this.composer.addPass(new Cw),this.buildWorld(),this.setSeat(0),this.resize(),window.addEventListener("resize",()=>this.resize()),e.addEventListener("pointermove",t=>this.pointerMove(t)),e.addEventListener("click",t=>this.click(t)),e.addEventListener("contextmenu",t=>{t.preventDefault(),this.onRightClick()}),this.renderer.setAnimationLoop(()=>this.frame())}buildWorld(){const e=this.scene;e.background=new Ze(460303),e.fog=new Hh(460303,26,60),e.add(new O_(10466559,1707818,.9));const t=new Nd(16773597,1.6);t.position.set(-6,14,6),t.castShadow=!0,t.shadow.mapSize.set(2048,2048);const n=t.shadow.camera;n.left=-12,n.right=12,n.top=12,n.bottom=-12,e.add(t);const s=new Nd(9067775,.6);s.position.set(6,6,-10),e.add(s);const r=new Et(new Ki(10.5,6,3.2,6,1),new zn({color:2366515,roughness:.95,flatShading:!0}));r.rotation.y=Math.PI/6,r.position.y=-1.95,r.scale.set(1.15,1,1.35),r.receiveShadow=!0,e.add(r);const a=new Et(new va(11,15,6),new Bn({color:5909503,transparent:!0,opacity:.08,side:On}));a.rotation.x=-Math.PI/2,a.rotation.z=Math.PI/6,a.position.y=-.4,a.scale.set(1,1.2,1),e.add(a);const o=new Ki(.94,.98,.3,6),c=new Gh(.9,6);c.rotateX(-Math.PI/2),c.rotateY(Math.PI/6*0),c.rotateY(Math.PI/2);for(const p of aa){const _=ms(p),y=.85+Math.random()*.2,x=new Ze(3880274).multiplyScalar(y),g=new Et(o,new zn({color:x,roughness:.8,metalness:.15}));g.position.set(_.x,Jr-.15,_.z),g.receiveShadow=!0,g.userData.hex=p;const T=new Et(c,new Bn({color:16777215,transparent:!0,opacity:0,depthWrite:!1}));T.position.set(_.x,Jr+.012,_.z),T.renderOrder=1,e.add(g,T),this.tiles.set(cn(p),{mesh:g,overlay:T,hl:null})}for(const p of ya){const _=ms(p),y=new Et(new va(.62,.8,6),new Bn({color:ar,transparent:!0,opacity:.7,side:On}));y.rotation.x=-Math.PI/2,y.rotation.z=Math.PI/2,y.position.set(_.x,Jr+.02,_.z);const x=new Et(vh(p)?new el(.36,0):new zo(.3,2),new zn({color:ar,emissive:ar,emissiveIntensity:2.2}));x.position.set(_.x,2.3,_.z);const g=new Jl(ar,6,5,1.5);g.position.set(_.x,1.6,_.z);const T=new Et(new Ki(.05,.25,2.3,12,1,!0),new Bn({color:ar,transparent:!0,opacity:.18,blending:_r,depthWrite:!1,side:On}));T.position.set(_.x,1.15,_.z),e.add(y,x,g,T),this.orbs.push({hex:p,orb:x,light:g,beam:T,ring:y,owner:null})}for(let p=0;p<2;p++){const _=new Yi,y=p===0?7.35:-7.35;_.position.set(0,0,y);const x=new Et(new Ki(1,1.4,.8,8),new zn({color:2761792,metalness:.5,roughness:.5,flatShading:!0}));x.position.y=0,x.castShadow=!0,x.receiveShadow=!0;const g=new Et(new _a(1.15,48,32),new D_({color:16777215,transparent:!0,opacity:.25,roughness:.05,metalness:.1,clearcoat:1,depthWrite:!1}));g.position.y=1.75,g.userData.sanctum=p;const T=new Et(new zo(.6,3),new zn({color:16777215,emissive:16777215,emissiveIntensity:2}));T.position.y=1.75,T.userData.sanctum=p;const A=new Et(new nl(1.45,.04,8,64),new Bn({color:16777215,transparent:!0,opacity:.6}));A.position.y=1.75,A.rotation.x=Math.PI/2.4;const S=new Jl(16777215,18,9,1.6);S.position.y=1.8;const O=sc("20","#fff",72);O.position.y=3.5,O.scale.set(2.2,1.1,1),_.add(x,g,T,A,S,O),e.add(_),this.sanctums.push({group:_,core:T,shell:g,label:O,hp:20,light:S,hl:!1,ring:A})}const l=new Kt,d=new Float32Array(1500*3);for(let p=0;p<1500;p++){const _=new N().randomDirection().multiplyScalar(70+Math.random()*30);_.y<-10&&(_.y=-_.y),d.set([_.x,_.y,_.z],p*3)}l.setAttribute("position",new Cn(d,3)),e.add(new lh(l,new Bo({color:13616895,size:.35,sizeAttenuation:!0,fog:!1})));const h=new Kt,f=new Float32Array(480);for(let p=0;p<160;p++)f.set([(Math.random()-.5)*24,Math.random()*8,(Math.random()-.5)*22],p*3);h.setAttribute("position",new Cn(f,3)),this.motes=new lh(h,new Bo({color:11832575,size:.12,transparent:!0,opacity:.7,blending:_r,depthWrite:!1,map:Sm()})),e.add(this.motes)}setSeat(e){this.seat=e;const t=e===0?1:-1;this.camBase.set(0,20.5,12.5*t),this.camTarget.set(0,0,1.2*t);for(let n=0;n<2;n++)this.colorSanctum(n);this.recolorTiles()}recolorTiles(){for(const e of aa){const n=this.tiles.get(cn(e)).mesh.material,s=new Ze(3880274).multiplyScalar(.85+(e.c*7+e.r*13)%5*.05);Ts(this.seat).includes(e.r)&&s.lerp(new Ze(cr),.12),Ts(1-this.seat).includes(e.r)&&s.lerp(new Ze(hr),.11),n.color.copy(s)}}colorSanctum(e){const t=this.sanctums[e],n=new Ze(e===this.seat?cr:hr);t.core.material.color.copy(n),t.core.material.emissive.copy(n),t.ring.material.color.copy(n),t.light.color.copy(n)}setMenuMode(e){this.menuMode=e;for(const t of this.sanctums)t.label.visible=!e;if(e){for(const t of this.units.values())this.scene.remove(t.group);this.units.clear(),this.clearHighlights()}}resize(){const e=window.innerWidth,t=window.innerHeight;this.renderer.setSize(e,t,!1),this.composer.setSize(e,t),this.camera.aspect=e/t,this.camera.fov=Math.min(80,Math.max(42,Bv.radToDeg(2*Math.atan(.37/(e/t))))),this.camera.updateProjectionMatrix()}sync(e,t,n,s){this.myTurn=n;const r=new Set;for(const a of e.units){r.add(a.uid);let o=this.units.get(a.uid);o||(o=new ac(a,a.owner===t),this.units.set(a.uid,o),this.scene.add(o.group)),o.place(a),o.group.scale.setScalar(1),o.refresh(a,s(a),e.round)}for(const[a,o]of this.units)r.has(a)||(this.scene.remove(o.group),this.units.delete(a));for(const a of this.orbs){const o=e.units.find(c=>c.c===a.hex.c&&c.r===a.hex.r);this.setOrbOwner(a,o?o.owner:null)}for(let a=0;a<2;a++)this.setSanctumHP(a,e.players[a].sanctum)}setOrbOwner(e,t){e.owner=t;const n=new Ze(t===null?ar:t===this.seat?cr:hr),s=e.orb.material;s.color.copy(n),s.emissive.copy(n),e.light.color.copy(n),e.beam.material.color.copy(n),e.ring.material.color.copy(n)}setSanctumHP(e,t){const n=this.sanctums[e];if(n.hp===t&&n.label.userData.set)return;n.hp=t;const s=n.label,r=t>12?"#ffffff":t>6?"#ffd76a":"#ff6b6b",a=sc(String(Math.max(0,t)),r,72);a.position.copy(s.position),a.scale.copy(s.scale),a.userData.set=!0,a.visible=s.visible,n.group.remove(s),n.group.add(a),n.label=a;const o=Math.max(0,t)/20;n.core.material.emissiveIntensity=.6+o*2,n.core.scale.setScalar(.6+o*.4)}clearHighlights(){for(const e of this.tiles.values())e.hl=null;for(const e of this.sanctums)e.hl=!1}setHighlights(e,t){for(const[n,s]of this.tiles)s.hl=e.get(n)??null;this.sanctums.forEach((n,s)=>n.hl=s===t)}showGuide(e,t){if(this.guide&&(this.scene.remove(this.guide),this.guide.geometry.dispose(),this.guide=null),!e||e.length<2&&!t)return;const n=e.map(a=>this.hexPos(a,.18));if(t){const a=n[n.length-1],o=a.clone().lerp(t,.5);o.y+=1.2;const c=new Wh(a.clone().setY(.6),o,t.clone());n.push(...c.getPoints(12).slice(1))}if(n.length<2)return;const s=new pm(n,!1,"catmullrom",.1),r=new qh(s,Math.max(8,n.length*6),.06,6,!1);this.guide=new Et(r,new Bn({color:t?16734810:8378623,transparent:!0,opacity:.85,depthTest:!1})),this.guide.renderOrder=4,this.scene.add(this.guide)}pick(e){const t=this.renderer.domElement.getBoundingClientRect();this.mouse.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1),this.raycaster.setFromCamera(this.mouse,this.camera);const n=[];for(const r of this.sanctums)n.push(r.shell);for(const r of this.units.values())n.push(r.base,r.icon);for(const r of this.tiles.values())n.push(r.mesh);const s=this.raycaster.intersectObjects(n,!1);for(const r of s){if(r.object.userData.sanctum!==void 0)return{sanctum:r.object.userData.sanctum};if(r.object.userData.hex)return{hex:r.object.userData.hex};for(const a of this.units.values())if(a.base===r.object||a.icon===r.object)return{hex:{c:a.data.c,r:a.data.r}}}return{}}pointerMove(e){if(this.menuMode)return;const t=this.pick(e),n=t.hex?cn(t.hex):null;n!==this.hoverKey&&(this.hoverKey=n,this.onHexHover(t.hex??null));const s=t.sanctum??null;s!==this.hoverSanctum&&(this.hoverSanctum=s,this.onSanctumHover(s)),this.renderer.domElement.style.cursor=t.hex||t.sanctum!==void 0?"pointer":"default"}click(e){if(this.menuMode)return;const t=this.pick(e);t.sanctum!==void 0?this.onSanctumClick(t.sanctum):t.hex?this.onHexClick(t.hex):this.onRightClick()}screenPos(e,t=1.5){const n=ms(e),s=new N(n.x,t,n.z).project(this.camera);return{x:(s.x+1)/2*window.innerWidth,y:(1-s.y)/2*window.innerHeight}}tween(e,t,n=ii.outCubic){return new Promise(s=>this.tweens.push({start:this.clock.elapsedTime,dur:e/this.speed,fn:t,ease:n,resolve:s}))}wait(e){return this.tween(e/1e3,()=>{})}burst(e,t,n=30,s=2.5,r=.25,a=.8,o=1,c=1){const l=new Nw(a,e,new Ze(t),n,s,r,o,c);this.bursts.push(l),this.scene.add(l.points)}floatText(e,t,n,s=!1){const r=sc(t,n,s?84:64);r.position.copy(e),r.scale.multiplyScalar(s?1.3:1),this.scene.add(r),this.floaters.push({sp:r,life:0,vy:1.4})}hexPos(e,t=.8){const n=ms(e);return new N(n.x,t,n.z)}sanctumPos(e){return new N(0,1.75,e===0?7.35:-7.35)}unitPos(e,t=.8){const n=this.units.get(e);return n?new N(n.group.position.x,t,n.group.position.z):new N}async projectile(e,t,n,s=.32,r=.18){const a=new Et(new _a(r,12,8),new Bn({color:n})),o=new Jl(n,4,3);a.add(o),this.scene.add(a);const c=e.clone().lerp(t,.5);c.y+=1.2+e.distanceTo(t)*.12,await this.tween(s,l=>{const d=e.clone().lerp(c,l),h=c.clone().lerp(t,l);a.position.copy(d.lerp(h,l)),Math.random()<.6&&this.burst(a.position.clone(),n,2,.4,.15,.4)},ii.linear),this.scene.remove(a),this.burst(t,n,18,2,.22,.5)}async play(e,t,n){switch(e.t){case"summon":{const s=new ac(e.unit,e.unit.owner===n);this.units.get(e.uid)&&this.scene.remove(this.units.get(e.uid).group),this.units.set(e.uid,s),this.scene.add(s.group),s.group.scale.setScalar(.01);const r=new Ze(bn[Ye(e.unit.cardId).color].hex).getHex();this.burst(this.hexPos(e.unit,.3),r,40,3,.25,.9,1.4),Je.summon(),await this.tween(.38,a=>s.group.scale.setScalar(Math.max(.01,a)),ii.outBack);break}case"move":{const s=this.units.get(e.uid);if(!s)break;Je.move();for(let r=1;r<e.path.length;r++){const a=ms(e.path[r-1]),o=ms(e.path[r]);await this.tween(.16,c=>{s.group.position.set(a.x+(o.x-a.x)*c,Jr+Math.sin(c*Math.PI)*.35,a.z+(o.z-a.z)*c)},ii.inOutQuad)}s.data.c=e.path[e.path.length-1].c,s.data.r=e.path[e.path.length-1].r;break}case"teleport":{const s=this.units.get(e.uid);if(!s)break;this.burst(s.group.position.clone().setY(.6),3848447,20,2),await this.tween(.15,r=>s.group.scale.setScalar(1-r*.99)),s.place(e.to),s.data.c=e.to.c,s.data.r=e.to.r,this.burst(this.hexPos(e.to,.6),3848447,20,2),await this.tween(.2,r=>s.group.scale.setScalar(.01+r),ii.outBack);break}case"attack":{const s=this.units.get(e.uid);if(!s)break;const r="uid"in e.target?this.unitPos(e.target.uid):this.sanctumPos(e.target.sanctum),a=new Ze(bn[Ye(s.data.cardId).color].hex).getHex();if(e.ranged)await this.projectile(this.unitPos(e.uid,1),r,a);else{const o=s.group.position.clone(),c=r.clone().setY(0).sub(o.clone().setY(0)),l=Math.min(.7,c.length()*.55);c.normalize(),await this.tween(.13,d=>s.group.position.copy(o).addScaledVector(c,-.15*d),ii.outCubic),await this.tween(.1,d=>s.group.position.copy(o).addScaledVector(c,-.15+(l+.15)*d),ii.linear),this.burst(r.clone(),16777215,12,2.5,.2,.35),this.tween(.22,d=>s.group.position.copy(o).addScaledVector(c,l*(1-d)),ii.outCubic)}break}case"damage":{const s=this.units.get(e.uid);if(!s)break;Je.hit(),s.data.hp-=e.amount,s.refresh(s.data,!1,t.round),this.floatText(this.unitPos(e.uid,1.6),`-${e.amount}`,"#ff5a5a",e.amount>=4),this.burst(this.unitPos(e.uid,.8),16724016,14,2,.2,.5);const r=s.body.position.x;await this.tween(.25,a=>{s.body.position.x=r+Math.sin(a*30)*.08*(1-a)}),s.body.position.x=r;break}case"sanctumDamage":{const s=this.sanctums[e.p];e.amount>=3?Je.bigHit():Je.hit(),this.setSanctumHP(e.p,s.hp-e.amount),this.floatText(this.sanctumPos(e.p).add(new N(0,1.6,0)),`-${e.amount}`,"#ff4d4d",!0),this.burst(this.sanctumPos(e.p),e.p===n?cr:hr,50,4,.3,.9),this.shake=Math.min(.6,.12+e.amount*.06);const r=s.group;await this.tween(.35,a=>{r.position.x=Math.sin(a*40)*.15*(1-a)}),r.position.x=0;break}case"sanctumHeal":{Je.heal(),this.setSanctumHP(e.p,this.sanctums[e.p].hp+e.amount),this.floatText(this.sanctumPos(e.p).add(new N(0,1.6,0)),`+${e.amount}`,"#7dff8a",!0),this.burst(this.sanctumPos(e.p),8257418,30,2,.25,.8,1.5),await this.wait(250);break}case"heal":{const s=this.units.get(e.uid);if(!s)break;Je.heal(),s.data.hp+=e.amount,s.refresh(s.data,!1,t.round),this.floatText(this.unitPos(e.uid,1.6),`+${e.amount}`,"#7dff8a"),this.burst(this.unitPos(e.uid,.5),8257418,16,1.5,.2,.7,1.5),await this.wait(200);break}case"barrier":{const s=this.units.get(e.uid);if(!s)break;Je.barrier(),s.data.kw=s.data.kw.filter(r=>r!=="barrier"),s.refresh(s.data,!1,t.round),this.floatText(this.unitPos(e.uid,1.6),"Blocked!","#ffe27a"),this.burst(this.unitPos(e.uid,.8),16769658,30,3,.22,.6),await this.wait(250);break}case"death":{const s=this.units.get(e.uid);if(!s)break;Je.death(),this.burst(s.group.position.clone().setY(.6),9067775,35,2.2,.28,1,1.2);const r=s.group;await this.tween(.4,a=>{r.scale.setScalar(Math.max(.01,1-a)),r.position.y=-a*.4,r.rotation.y=a*3},ii.inOutQuad),this.scene.remove(r),this.units.delete(e.uid);break}case"levelUp":{const s=this.units.get(e.uid);s&&this.scene.remove(s.group);const r=new ac(e.unit,e.unit.owner===n);this.units.set(e.uid,r),this.scene.add(r.group),Je.levelUp();const a=r.group.position.clone().setY(.8);this.burst(a,16766826,80,4,.35,1.2,1.6),this.burst(a,16777215,40,2.5,.25,.9,2),this.floatText(a.clone().setY(2.2),"LEVEL UP!","#ffd76a",!0),this.shake=.3,await this.tween(.6,o=>r.group.scale.setScalar(1.8-.8*o),ii.outBack);break}case"bounce":{const s=this.units.get(e.uid);if(!s)break;Je.spell();const r=s.group;this.burst(r.position.clone().setY(.6),3848447,25,2.5),await this.tween(.35,a=>{r.position.y=a*3,r.scale.setScalar(Math.max(.01,1-a))}),this.scene.remove(r),this.units.delete(e.uid);break}case"buff":{const s=this.units.get(e.uid);if(!s)break;const r=t.units.find(a=>a.uid===e.uid);e.atk||e.hp?(Je.buff(),s.data.atk+=e.atk,s.data.hp+=e.hp,s.data.maxHp+=e.hp,this.floatText(this.unitPos(e.uid,1.7),`${e.atk>=0?"+":""}${e.atk}/${e.hp>=0?"+":""}${e.hp}`,"#ffd76a")):r&&(s.data.kw=[...r.kw]),s.refresh(s.data,!1,t.round),this.burst(this.unitPos(e.uid,.3),16766826,18,1.5,.18,.8,2),await this.wait(180);break}case"freeze":{const s=this.units.get(e.uid);if(!s)break;Je.freeze(),s.data.frozenUntil=Math.max(s.data.frozenUntil,t.round),s.data.exhausted=!0,s.refresh(s.data,!1,t.round),this.burst(this.unitPos(e.uid,.8),10479871,24,2,.2,.7),await this.wait(180);break}case"ready":{const s=this.units.get(e.uid);if(!s)break;Je.buff(),s.data.exhausted=!1,s.data.frozenUntil=0,s.refresh(s.data,!0,t.round),this.burst(this.unitPos(e.uid,.2),16769126,20,1.2,.2,.8,2.5),await this.wait(150);break}case"orbPulse":{Je.orb();const s=this.orbs.find(a=>a.hex.c===e.orb.c&&a.hex.r===e.orb.r);if(!s)break;const r=e.p===n?cr:hr;this.burst(s.orb.position.clone(),r,30,2.5,.25,.7),e.kind==="mana"?await this.projectile(s.orb.position.clone(),this.sanctumPos(e.p),8378623,.45,.1):await this.projectile(s.orb.position.clone(),this.sanctumPos(1-e.p),r,.45,.14);break}case"fx":{const s=Fw[e.kind]??16777215;if(e.kind==="start")break;if(e.at){const r=this.hexPos(e.at,.6);e.kind==="explosion"?(Je.bigHit(),this.burst(r,16751162,60,4.5,.32,.8),this.burst(r,16769162,30,2.5,.25,.6),this.shake=.25):e.kind==="lightning"?(Je.bigHit(),await this.projectile(r.clone().setY(8),r,s,.15,.12)):e.kind==="fire"?(Je.spell(),await this.projectile(this.sanctumPos(n).setY(3),r,s,.3)):(Je.spell(),this.burst(r,s,40,2.8,.26,.8,1.3))}else{Je.spell();for(let r=0;r<6;r++)this.burst(new N((Math.random()-.5)*12,.5,(Math.random()-.5)*8),s,25,2.5,.28,.9)}await this.wait(200);break}}}frame(){const e=Math.min(.05,this.clock.getDelta()),t=this.clock.elapsedTime,n=[];for(const a of this.tweens){const o=Math.min(1,(t-a.start)/a.dur);a.fn(a.ease(o)),o>=1&&n.push(a)}n.length&&(this.tweens=this.tweens.filter(a=>!n.includes(a)),n.forEach(a=>a.resolve())),this.bursts=this.bursts.filter(a=>{const o=a.update(e);return o||(this.scene.remove(a.points),a.points.geometry.dispose()),o}),this.floaters=this.floaters.filter(a=>(a.life+=e,a.sp.position.y+=a.vy*e,a.vy*=.96,a.sp.material.opacity=Math.max(0,1-Math.max(0,a.life-.6)/.5),a.life>1.1?(this.scene.remove(a.sp),!1):!0));for(const a of this.units.values())a.tick(t,this.myTurn);for(const[,a]of this.tiles){const o=a.overlay.material;if(!a.hl){o.opacity=0;continue}const c=Dw[a.hl];o.color.setHex(c.color),o.opacity=c.pulse?c.opacity*(.7+.3*Math.sin(t*5)):c.opacity}if(this.hoverKey&&!this.menuMode){const a=this.tiles.get(this.hoverKey);if(a){const o=a.overlay.material;o.opacity=Math.max(o.opacity,.22)+.15,a.hl||o.color.setHex(16777215)}}for(const a of this.orbs)a.orb.position.y=2.3+Math.sin(t*1.5+a.hex.c)*.12,a.orb.rotation.y=t*.8,a.beam.material.opacity=a.owner===null?.06:.22+Math.sin(t*3)*.06,a.ring.rotation.z=Math.PI/2+t*.3;this.sanctums.forEach((a,o)=>{a.core.rotation.y=t*.6,a.core.rotation.x=t*.3,a.ring.rotation.z=t*(o?-.5:.5),a.core.position.y=a.shell.position.y=1.75+Math.sin(t*1.2+o)*.08;const c=a.hl?1.5+Math.sin(t*8)*.8:1;a.light.intensity=14*c,a.shell.material.opacity=a.hl?.45:.22});const s=this.motes.geometry.getAttribute("position"),r=s.array;for(let a=1;a<r.length;a+=3)r[a]+=e*.25,r[a]>8&&(r[a]=0);if(s.needsUpdate=!0,this.menuMode){const a=t*.06;this.camera.position.set(Math.sin(a)*19,11+Math.sin(t*.2)*1.5,Math.cos(a)*19),this.camera.lookAt(0,0,0)}else{const a=this.camBase.clone();this.shake>0&&(a.add(new N((Math.random()-.5)*this.shake,(Math.random()-.5)*this.shake,0)),this.shake=Math.max(0,this.shake-e*1.5)),this.camera.position.lerp(a,this.shake>0?1:1-Math.exp(-e*4)),this.camera.lookAt(this.camTarget)}this.composer.render()}}function Zh(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ls=Zh();function wm(i){Ls=i}var sa={exec:()=>null};function Ct(i,e=""){let t=typeof i=="string"?i:i.source;const n={replace:(s,r)=>{let a=typeof r=="string"?r:r.source;return a=a.replace(wn.caret,"$1"),t=t.replace(s,a),n},getRegex:()=>new RegExp(t,e)};return n}var wn={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:i=>new RegExp(`^( {0,3}${i})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:i=>new RegExp(`^ {0,${Math.min(3,i-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:i=>new RegExp(`^ {0,${Math.min(3,i-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:i=>new RegExp(`^ {0,${Math.min(3,i-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:i=>new RegExp(`^ {0,${Math.min(3,i-1)}}#`),htmlBeginRegex:i=>new RegExp(`^ {0,${Math.min(3,i-1)}}<(?:[a-z].*>|!--)`,"i")},zw=/^(?:[ \t]*(?:\n|$))+/,Hw=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Vw=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ea=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Gw=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Qh=/(?:[*+-]|\d{1,9}[.)])/,Mm=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Em=Ct(Mm).replace(/bull/g,Qh).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),$w=Ct(Mm).replace(/bull/g,Qh).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),eu=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ww=/^[^\n]+/,tu=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Xw=Ct(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",tu).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),qw=Ct(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Qh).getRegex(),sl="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",nu=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,jw=Ct("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",nu).replace("tag",sl).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Tm=Ct(eu).replace("hr",Ea).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",sl).getRegex(),Yw=Ct(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Tm).getRegex(),iu={blockquote:Yw,code:Hw,def:Xw,fences:Vw,heading:Gw,hr:Ea,html:jw,lheading:Em,list:qw,newline:zw,paragraph:Tm,table:sa,text:Ww},pf=Ct("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ea).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",sl).getRegex(),Kw={...iu,lheading:$w,table:pf,paragraph:Ct(eu).replace("hr",Ea).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",pf).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",sl).getRegex()},Jw={...iu,html:Ct(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",nu).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:sa,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Ct(eu).replace("hr",Ea).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Em).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Zw=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Qw=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Am=/^( {2,}|\\)\n(?!\s*$)/,eM=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,rl=/[\p{P}\p{S}]/u,su=/[\s\p{P}\p{S}]/u,Rm=/[^\s\p{P}\p{S}]/u,tM=Ct(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,su).getRegex(),Cm=/(?!~)[\p{P}\p{S}]/u,nM=/(?!~)[\s\p{P}\p{S}]/u,iM=/(?:[^\s\p{P}\p{S}]|~)/u,sM=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,Pm=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,rM=Ct(Pm,"u").replace(/punct/g,rl).getRegex(),aM=Ct(Pm,"u").replace(/punct/g,Cm).getRegex(),Im="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",oM=Ct(Im,"gu").replace(/notPunctSpace/g,Rm).replace(/punctSpace/g,su).replace(/punct/g,rl).getRegex(),lM=Ct(Im,"gu").replace(/notPunctSpace/g,iM).replace(/punctSpace/g,nM).replace(/punct/g,Cm).getRegex(),cM=Ct("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Rm).replace(/punctSpace/g,su).replace(/punct/g,rl).getRegex(),hM=Ct(/\\(punct)/,"gu").replace(/punct/g,rl).getRegex(),uM=Ct(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),dM=Ct(nu).replace("(?:-->|$)","-->").getRegex(),fM=Ct("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",dM).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ho=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,pM=Ct(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Ho).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Dm=Ct(/^!?\[(label)\]\[(ref)\]/).replace("label",Ho).replace("ref",tu).getRegex(),Lm=Ct(/^!?\[(ref)\](?:\[\])?/).replace("ref",tu).getRegex(),mM=Ct("reflink|nolink(?!\\()","g").replace("reflink",Dm).replace("nolink",Lm).getRegex(),ru={_backpedal:sa,anyPunctuation:hM,autolink:uM,blockSkip:sM,br:Am,code:Qw,del:sa,emStrongLDelim:rM,emStrongRDelimAst:oM,emStrongRDelimUnd:cM,escape:Zw,link:pM,nolink:Lm,punctuation:tM,reflink:Dm,reflinkSearch:mM,tag:fM,text:eM,url:sa},gM={...ru,link:Ct(/^!?\[(label)\]\((.*?)\)/).replace("label",Ho).getRegex(),reflink:Ct(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ho).getRegex()},uh={...ru,emStrongRDelimAst:lM,emStrongLDelim:aM,url:Ct(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},vM={...uh,br:Ct(Am).replace("{2,}","*").getRegex(),text:Ct(uh.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},go={normal:iu,gfm:Kw,pedantic:Jw},Xr={normal:ru,gfm:uh,breaks:vM,pedantic:gM},_M={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},mf=i=>_M[i];function si(i,e){if(e){if(wn.escapeTest.test(i))return i.replace(wn.escapeReplace,mf)}else if(wn.escapeTestNoEncode.test(i))return i.replace(wn.escapeReplaceNoEncode,mf);return i}function gf(i){try{i=encodeURI(i).replace(wn.percentDecode,"%")}catch{return null}return i}function vf(i,e){var r;const t=i.replace(wn.findPipe,(a,o,c)=>{let l=!1,d=o;for(;--d>=0&&c[d]==="\\";)l=!l;return l?"|":" |"}),n=t.split(wn.splitPipe);let s=0;if(n[0].trim()||n.shift(),n.length>0&&!((r=n.at(-1))!=null&&r.trim())&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;s<n.length;s++)n[s]=n[s].trim().replace(wn.slashPipe,"|");return n}function qr(i,e,t){const n=i.length;if(n===0)return"";let s=0;for(;s<n&&i.charAt(n-s-1)===e;)s++;return i.slice(0,n-s)}function xM(i,e){if(i.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<i.length;n++)if(i[n]==="\\")n++;else if(i[n]===e[0])t++;else if(i[n]===e[1]&&(t--,t<0))return n;return t>0?-2:-1}function _f(i,e,t,n,s){const r=e.href,a=e.title||null,o=i[1].replace(s.other.outputLinkReplace,"$1");n.state.inLink=!0;const c={type:i[0].charAt(0)==="!"?"image":"link",raw:t,href:r,title:a,text:o,tokens:n.inlineTokens(o)};return n.state.inLink=!1,c}function yM(i,e,t){const n=i.match(t.other.indentCodeCompensation);if(n===null)return e;const s=n[1];return e.split(`
`).map(r=>{const a=r.match(t.other.beginningSpace);if(a===null)return r;const[o]=a;return o.length>=s.length?r.slice(s.length):r}).join(`
`)}var Vo=class{constructor(i){Ft(this,"options");Ft(this,"rules");Ft(this,"lexer");this.options=i||Ls}space(i){const e=this.rules.block.newline.exec(i);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(i){const e=this.rules.block.code.exec(i);if(e){const t=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:qr(t,`
`)}}}fences(i){const e=this.rules.block.fences.exec(i);if(e){const t=e[0],n=yM(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:n}}}heading(i){const e=this.rules.block.heading.exec(i);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){const n=qr(t,"#");(this.options.pedantic||!n||this.rules.other.endingSpaceChar.test(n))&&(t=n.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(i){const e=this.rules.block.hr.exec(i);if(e)return{type:"hr",raw:qr(e[0],`
`)}}blockquote(i){const e=this.rules.block.blockquote.exec(i);if(e){let t=qr(e[0],`
`).split(`
`),n="",s="";const r=[];for(;t.length>0;){let a=!1;const o=[];let c;for(c=0;c<t.length;c++)if(this.rules.other.blockquoteStart.test(t[c]))o.push(t[c]),a=!0;else if(!a)o.push(t[c]);else break;t=t.slice(c);const l=o.join(`
`),d=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");n=n?`${n}
${l}`:l,s=s?`${s}
${d}`:d;const h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(d,r,!0),this.lexer.state.top=h,t.length===0)break;const f=r.at(-1);if((f==null?void 0:f.type)==="code")break;if((f==null?void 0:f.type)==="blockquote"){const p=f,_=p.raw+`
`+t.join(`
`),y=this.blockquote(_);r[r.length-1]=y,n=n.substring(0,n.length-p.raw.length)+y.raw,s=s.substring(0,s.length-p.text.length)+y.text;break}else if((f==null?void 0:f.type)==="list"){const p=f,_=p.raw+`
`+t.join(`
`),y=this.list(_);r[r.length-1]=y,n=n.substring(0,n.length-f.raw.length)+y.raw,s=s.substring(0,s.length-p.raw.length)+y.raw,t=_.substring(r.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:n,tokens:r,text:s}}}list(i){let e=this.rules.block.list.exec(i);if(e){let t=e[1].trim();const n=t.length>1,s={type:"list",raw:"",ordered:n,start:n?+t.slice(0,-1):"",loose:!1,items:[]};t=n?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=n?t:"[*+-]");const r=this.rules.other.listItemRegex(t);let a=!1;for(;i;){let c=!1,l="",d="";if(!(e=r.exec(i))||this.rules.block.hr.test(i))break;l=e[0],i=i.substring(l.length);let h=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,g=>" ".repeat(3*g.length)),f=i.split(`
`,1)[0],p=!h.trim(),_=0;if(this.options.pedantic?(_=2,d=h.trimStart()):p?_=e[1].length+1:(_=e[2].search(this.rules.other.nonSpaceChar),_=_>4?1:_,d=h.slice(_),_+=e[1].length),p&&this.rules.other.blankLine.test(f)&&(l+=f+`
`,i=i.substring(f.length+1),c=!0),!c){const g=this.rules.other.nextBulletRegex(_),T=this.rules.other.hrRegex(_),A=this.rules.other.fencesBeginRegex(_),S=this.rules.other.headingBeginRegex(_),O=this.rules.other.htmlBeginRegex(_);for(;i;){const k=i.split(`
`,1)[0];let U;if(f=k,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),U=f):U=f.replace(this.rules.other.tabCharGlobal,"    "),A.test(f)||S.test(f)||O.test(f)||g.test(f)||T.test(f))break;if(U.search(this.rules.other.nonSpaceChar)>=_||!f.trim())d+=`
`+U.slice(_);else{if(p||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||A.test(h)||S.test(h)||T.test(h))break;d+=`
`+f}!p&&!f.trim()&&(p=!0),l+=k+`
`,i=i.substring(k.length+1),h=U.slice(_)}}s.loose||(a?s.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(a=!0));let y=null,x;this.options.gfm&&(y=this.rules.other.listIsTask.exec(d),y&&(x=y[0]!=="[ ] ",d=d.replace(this.rules.other.listReplaceTask,""))),s.items.push({type:"list_item",raw:l,task:!!y,checked:x,loose:!1,text:d,tokens:[]}),s.raw+=l}const o=s.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let c=0;c<s.items.length;c++)if(this.lexer.state.top=!1,s.items[c].tokens=this.lexer.blockTokens(s.items[c].text,[]),!s.loose){const l=s.items[c].tokens.filter(h=>h.type==="space"),d=l.length>0&&l.some(h=>this.rules.other.anyLine.test(h.raw));s.loose=d}if(s.loose)for(let c=0;c<s.items.length;c++)s.items[c].loose=!0;return s}}html(i){const e=this.rules.block.html.exec(i);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(i){const e=this.rules.block.def.exec(i);if(e){const t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),n=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:n,title:s}}}table(i){var a;const e=this.rules.block.table.exec(i);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;const t=vf(e[1]),n=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=(a=e[3])!=null&&a.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],r={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===n.length){for(const o of n)this.rules.other.tableAlignRight.test(o)?r.align.push("right"):this.rules.other.tableAlignCenter.test(o)?r.align.push("center"):this.rules.other.tableAlignLeft.test(o)?r.align.push("left"):r.align.push(null);for(let o=0;o<t.length;o++)r.header.push({text:t[o],tokens:this.lexer.inline(t[o]),header:!0,align:r.align[o]});for(const o of s)r.rows.push(vf(o,r.header.length).map((c,l)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:r.align[l]})));return r}}lheading(i){const e=this.rules.block.lheading.exec(i);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(i){const e=this.rules.block.paragraph.exec(i);if(e){const t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(i){const e=this.rules.block.text.exec(i);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(i){const e=this.rules.inline.escape.exec(i);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(i){const e=this.rules.inline.tag.exec(i);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(i){const e=this.rules.inline.link.exec(i);if(e){const t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;const r=qr(t.slice(0,-1),"\\");if((t.length-r.length)%2===0)return}else{const r=xM(e[2],"()");if(r===-2)return;if(r>-1){const o=(e[0].indexOf("!")===0?5:4)+e[1].length+r;e[2]=e[2].substring(0,r),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let n=e[2],s="";if(this.options.pedantic){const r=this.rules.other.pedanticHrefTitle.exec(n);r&&(n=r[1],s=r[3])}else s=e[3]?e[3].slice(1,-1):"";return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?n=n.slice(1):n=n.slice(1,-1)),_f(e,{href:n&&n.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(i,e){let t;if((t=this.rules.inline.reflink.exec(i))||(t=this.rules.inline.nolink.exec(i))){const n=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=e[n.toLowerCase()];if(!s){const r=t[0].charAt(0);return{type:"text",raw:r,text:r}}return _f(t,s,t[0],this.lexer,this.rules)}}emStrong(i,e,t=""){let n=this.rules.inline.emStrongLDelim.exec(i);if(!n||n[3]&&t.match(this.rules.other.unicodeAlphaNumeric))return;if(!(n[1]||n[2]||"")||!t||this.rules.inline.punctuation.exec(t)){const r=[...n[0]].length-1;let a,o,c=r,l=0;const d=n[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(d.lastIndex=0,e=e.slice(-1*i.length+r);(n=d.exec(e))!=null;){if(a=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!a)continue;if(o=[...a].length,n[3]||n[4]){c+=o;continue}else if((n[5]||n[6])&&r%3&&!((r+o)%3)){l+=o;continue}if(c-=o,c>0)continue;o=Math.min(o,o+c+l);const h=[...n[0]][0].length,f=i.slice(0,r+n.index+h+o);if(Math.min(r,o)%2){const _=f.slice(1,-1);return{type:"em",raw:f,text:_,tokens:this.lexer.inlineTokens(_)}}const p=f.slice(2,-2);return{type:"strong",raw:f,text:p,tokens:this.lexer.inlineTokens(p)}}}}codespan(i){const e=this.rules.inline.code.exec(i);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," ");const n=this.rules.other.nonSpaceChar.test(t),s=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return n&&s&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(i){const e=this.rules.inline.br.exec(i);if(e)return{type:"br",raw:e[0]}}del(i){const e=this.rules.inline.del.exec(i);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(i){const e=this.rules.inline.autolink.exec(i);if(e){let t,n;return e[2]==="@"?(t=e[1],n="mailto:"+t):(t=e[1],n=t),{type:"link",raw:e[0],text:t,href:n,tokens:[{type:"text",raw:t,text:t}]}}}url(i){var t;let e;if(e=this.rules.inline.url.exec(i)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let r;do r=e[0],e[0]=((t=this.rules.inline._backpedal.exec(e[0]))==null?void 0:t[0])??"";while(r!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(i){const e=this.rules.inline.text.exec(i);if(e){const t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},Ri=class dh{constructor(e){Ft(this,"tokens");Ft(this,"options");Ft(this,"state");Ft(this,"tokenizer");Ft(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ls,this.options.tokenizer=this.options.tokenizer||new Vo,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={other:wn,block:go.normal,inline:Xr.normal};this.options.pedantic?(t.block=go.pedantic,t.inline=Xr.pedantic):this.options.gfm&&(t.block=go.gfm,this.options.breaks?t.inline=Xr.breaks:t.inline=Xr.gfm),this.tokenizer.rules=t}static get rules(){return{block:go,inline:Xr}}static lex(e,t){return new dh(t).lex(e)}static lexInline(e,t){return new dh(t).inlineTokens(e)}lex(e){e=e.replace(wn.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){const n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){var s,r,a;for(this.options.pedantic&&(e=e.replace(wn.tabCharGlobal,"    ").replace(wn.spaceLine,""));e;){let o;if((r=(s=this.options.extensions)==null?void 0:s.block)!=null&&r.some(l=>(o=l.call({lexer:this},e,t))?(e=e.substring(o.raw.length),t.push(o),!0):!1))continue;if(o=this.tokenizer.space(e)){e=e.substring(o.raw.length);const l=t.at(-1);o.raw.length===1&&l!==void 0?l.raw+=`
`:t.push(o);continue}if(o=this.tokenizer.code(e)){e=e.substring(o.raw.length);const l=t.at(-1);(l==null?void 0:l.type)==="paragraph"||(l==null?void 0:l.type)==="text"?(l.raw+=`
`+o.raw,l.text+=`
`+o.text,this.inlineQueue.at(-1).src=l.text):t.push(o);continue}if(o=this.tokenizer.fences(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.heading(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.hr(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.blockquote(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.list(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.html(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.def(e)){e=e.substring(o.raw.length);const l=t.at(-1);(l==null?void 0:l.type)==="paragraph"||(l==null?void 0:l.type)==="text"?(l.raw+=`
`+o.raw,l.text+=`
`+o.raw,this.inlineQueue.at(-1).src=l.text):this.tokens.links[o.tag]||(this.tokens.links[o.tag]={href:o.href,title:o.title});continue}if(o=this.tokenizer.table(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.lheading(e)){e=e.substring(o.raw.length),t.push(o);continue}let c=e;if((a=this.options.extensions)!=null&&a.startBlock){let l=1/0;const d=e.slice(1);let h;this.options.extensions.startBlock.forEach(f=>{h=f.call({lexer:this},d),typeof h=="number"&&h>=0&&(l=Math.min(l,h))}),l<1/0&&l>=0&&(c=e.substring(0,l+1))}if(this.state.top&&(o=this.tokenizer.paragraph(c))){const l=t.at(-1);n&&(l==null?void 0:l.type)==="paragraph"?(l.raw+=`
`+o.raw,l.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=l.text):t.push(o),n=c.length!==e.length,e=e.substring(o.raw.length);continue}if(o=this.tokenizer.text(e)){e=e.substring(o.raw.length);const l=t.at(-1);(l==null?void 0:l.type)==="text"?(l.raw+=`
`+o.raw,l.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=l.text):t.push(o);continue}if(e){const l="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){var o,c,l;let n=e,s=null;if(this.tokens.links){const d=Object.keys(this.tokens.links);if(d.length>0)for(;(s=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)d.includes(s[0].slice(s[0].lastIndexOf("[")+1,-1))&&(n=n.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(s=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,s.index)+"++"+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(s=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)n=n.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let r=!1,a="";for(;e;){r||(a=""),r=!1;let d;if((c=(o=this.options.extensions)==null?void 0:o.inline)!=null&&c.some(f=>(d=f.call({lexer:this},e,t))?(e=e.substring(d.raw.length),t.push(d),!0):!1))continue;if(d=this.tokenizer.escape(e)){e=e.substring(d.raw.length),t.push(d);continue}if(d=this.tokenizer.tag(e)){e=e.substring(d.raw.length),t.push(d);continue}if(d=this.tokenizer.link(e)){e=e.substring(d.raw.length),t.push(d);continue}if(d=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(d.raw.length);const f=t.at(-1);d.type==="text"&&(f==null?void 0:f.type)==="text"?(f.raw+=d.raw,f.text+=d.text):t.push(d);continue}if(d=this.tokenizer.emStrong(e,n,a)){e=e.substring(d.raw.length),t.push(d);continue}if(d=this.tokenizer.codespan(e)){e=e.substring(d.raw.length),t.push(d);continue}if(d=this.tokenizer.br(e)){e=e.substring(d.raw.length),t.push(d);continue}if(d=this.tokenizer.del(e)){e=e.substring(d.raw.length),t.push(d);continue}if(d=this.tokenizer.autolink(e)){e=e.substring(d.raw.length),t.push(d);continue}if(!this.state.inLink&&(d=this.tokenizer.url(e))){e=e.substring(d.raw.length),t.push(d);continue}let h=e;if((l=this.options.extensions)!=null&&l.startInline){let f=1/0;const p=e.slice(1);let _;this.options.extensions.startInline.forEach(y=>{_=y.call({lexer:this},p),typeof _=="number"&&_>=0&&(f=Math.min(f,_))}),f<1/0&&f>=0&&(h=e.substring(0,f+1))}if(d=this.tokenizer.inlineText(h)){e=e.substring(d.raw.length),d.raw.slice(-1)!=="_"&&(a=d.raw.slice(-1)),r=!0;const f=t.at(-1);(f==null?void 0:f.type)==="text"?(f.raw+=d.raw,f.text+=d.text):t.push(d);continue}if(e){const f="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(f);break}else throw new Error(f)}}return t}},Go=class{constructor(i){Ft(this,"options");Ft(this,"parser");this.options=i||Ls}space(i){return""}code({text:i,lang:e,escaped:t}){var r;const n=(r=(e||"").match(wn.notSpaceStart))==null?void 0:r[0],s=i.replace(wn.endingNewline,"")+`
`;return n?'<pre><code class="language-'+si(n)+'">'+(t?s:si(s,!0))+`</code></pre>
`:"<pre><code>"+(t?s:si(s,!0))+`</code></pre>
`}blockquote({tokens:i}){return`<blockquote>
${this.parser.parse(i)}</blockquote>
`}html({text:i}){return i}heading({tokens:i,depth:e}){return`<h${e}>${this.parser.parseInline(i)}</h${e}>
`}hr(i){return`<hr>
`}list(i){const e=i.ordered,t=i.start;let n="";for(let a=0;a<i.items.length;a++){const o=i.items[a];n+=this.listitem(o)}const s=e?"ol":"ul",r=e&&t!==1?' start="'+t+'"':"";return"<"+s+r+`>
`+n+"</"+s+`>
`}listitem(i){var t;let e="";if(i.task){const n=this.checkbox({checked:!!i.checked});i.loose?((t=i.tokens[0])==null?void 0:t.type)==="paragraph"?(i.tokens[0].text=n+" "+i.tokens[0].text,i.tokens[0].tokens&&i.tokens[0].tokens.length>0&&i.tokens[0].tokens[0].type==="text"&&(i.tokens[0].tokens[0].text=n+" "+si(i.tokens[0].tokens[0].text),i.tokens[0].tokens[0].escaped=!0)):i.tokens.unshift({type:"text",raw:n+" ",text:n+" ",escaped:!0}):e+=n+" "}return e+=this.parser.parse(i.tokens,!!i.loose),`<li>${e}</li>
`}checkbox({checked:i}){return"<input "+(i?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:i}){return`<p>${this.parser.parseInline(i)}</p>
`}table(i){let e="",t="";for(let s=0;s<i.header.length;s++)t+=this.tablecell(i.header[s]);e+=this.tablerow({text:t});let n="";for(let s=0;s<i.rows.length;s++){const r=i.rows[s];t="";for(let a=0;a<r.length;a++)t+=this.tablecell(r[a]);n+=this.tablerow({text:t})}return n&&(n=`<tbody>${n}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+n+`</table>
`}tablerow({text:i}){return`<tr>
${i}</tr>
`}tablecell(i){const e=this.parser.parseInline(i.tokens),t=i.header?"th":"td";return(i.align?`<${t} align="${i.align}">`:`<${t}>`)+e+`</${t}>
`}strong({tokens:i}){return`<strong>${this.parser.parseInline(i)}</strong>`}em({tokens:i}){return`<em>${this.parser.parseInline(i)}</em>`}codespan({text:i}){return`<code>${si(i,!0)}</code>`}br(i){return"<br>"}del({tokens:i}){return`<del>${this.parser.parseInline(i)}</del>`}link({href:i,title:e,tokens:t}){const n=this.parser.parseInline(t),s=gf(i);if(s===null)return n;i=s;let r='<a href="'+i+'"';return e&&(r+=' title="'+si(e)+'"'),r+=">"+n+"</a>",r}image({href:i,title:e,text:t,tokens:n}){n&&(t=this.parser.parseInline(n,this.parser.textRenderer));const s=gf(i);if(s===null)return si(t);i=s;let r=`<img src="${i}" alt="${t}"`;return e&&(r+=` title="${si(e)}"`),r+=">",r}text(i){return"tokens"in i&&i.tokens?this.parser.parseInline(i.tokens):"escaped"in i&&i.escaped?i.text:si(i.text)}},au=class{strong({text:i}){return i}em({text:i}){return i}codespan({text:i}){return i}del({text:i}){return i}html({text:i}){return i}text({text:i}){return i}link({text:i}){return""+i}image({text:i}){return""+i}br(){return""}},Ci=class fh{constructor(e){Ft(this,"options");Ft(this,"renderer");Ft(this,"textRenderer");this.options=e||Ls,this.options.renderer=this.options.renderer||new Go,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new au}static parse(e,t){return new fh(t).parse(e)}static parseInline(e,t){return new fh(t).parseInline(e)}parse(e,t=!0){var s,r;let n="";for(let a=0;a<e.length;a++){const o=e[a];if((r=(s=this.options.extensions)==null?void 0:s.renderers)!=null&&r[o.type]){const l=o,d=this.options.extensions.renderers[l.type].call({parser:this},l);if(d!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(l.type)){n+=d||"";continue}}const c=o;switch(c.type){case"space":{n+=this.renderer.space(c);continue}case"hr":{n+=this.renderer.hr(c);continue}case"heading":{n+=this.renderer.heading(c);continue}case"code":{n+=this.renderer.code(c);continue}case"table":{n+=this.renderer.table(c);continue}case"blockquote":{n+=this.renderer.blockquote(c);continue}case"list":{n+=this.renderer.list(c);continue}case"html":{n+=this.renderer.html(c);continue}case"paragraph":{n+=this.renderer.paragraph(c);continue}case"text":{let l=c,d=this.renderer.text(l);for(;a+1<e.length&&e[a+1].type==="text";)l=e[++a],d+=`
`+this.renderer.text(l);t?n+=this.renderer.paragraph({type:"paragraph",raw:d,text:d,tokens:[{type:"text",raw:d,text:d,escaped:!0}]}):n+=d;continue}default:{const l='Token with "'+c.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return n}parseInline(e,t=this.renderer){var s,r;let n="";for(let a=0;a<e.length;a++){const o=e[a];if((r=(s=this.options.extensions)==null?void 0:s.renderers)!=null&&r[o.type]){const l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(o.type)){n+=l||"";continue}}const c=o;switch(c.type){case"escape":{n+=t.text(c);break}case"html":{n+=t.html(c);break}case"link":{n+=t.link(c);break}case"image":{n+=t.image(c);break}case"strong":{n+=t.strong(c);break}case"em":{n+=t.em(c);break}case"codespan":{n+=t.codespan(c);break}case"br":{n+=t.br(c);break}case"del":{n+=t.del(c);break}case"text":{n+=t.text(c);break}default:{const l='Token with "'+c.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return n}},oc,To=(oc=class{constructor(i){Ft(this,"options");Ft(this,"block");this.options=i||Ls}preprocess(i){return i}postprocess(i){return i}processAllTokens(i){return i}provideLexer(){return this.block?Ri.lex:Ri.lexInline}provideParser(){return this.block?Ci.parse:Ci.parseInline}},Ft(oc,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"])),oc),bM=class{constructor(...i){Ft(this,"defaults",Zh());Ft(this,"options",this.setOptions);Ft(this,"parse",this.parseMarkdown(!0));Ft(this,"parseInline",this.parseMarkdown(!1));Ft(this,"Parser",Ci);Ft(this,"Renderer",Go);Ft(this,"TextRenderer",au);Ft(this,"Lexer",Ri);Ft(this,"Tokenizer",Vo);Ft(this,"Hooks",To);this.use(...i)}walkTokens(i,e){var n,s;let t=[];for(const r of i)switch(t=t.concat(e.call(this,r)),r.type){case"table":{const a=r;for(const o of a.header)t=t.concat(this.walkTokens(o.tokens,e));for(const o of a.rows)for(const c of o)t=t.concat(this.walkTokens(c.tokens,e));break}case"list":{const a=r;t=t.concat(this.walkTokens(a.items,e));break}default:{const a=r;(s=(n=this.defaults.extensions)==null?void 0:n.childTokens)!=null&&s[a.type]?this.defaults.extensions.childTokens[a.type].forEach(o=>{const c=a[o].flat(1/0);t=t.concat(this.walkTokens(c,e))}):a.tokens&&(t=t.concat(this.walkTokens(a.tokens,e)))}}return t}use(...i){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return i.forEach(t=>{const n={...t};if(n.async=this.defaults.async||n.async||!1,t.extensions&&(t.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){const r=e.renderers[s.name];r?e.renderers[s.name]=function(...a){let o=s.renderer.apply(this,a);return o===!1&&(o=r.apply(this,a)),o}:e.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const r=e[s.level];r?r.unshift(s.tokenizer):e[s.level]=[s.tokenizer],s.start&&(s.level==="block"?e.startBlock?e.startBlock.push(s.start):e.startBlock=[s.start]:s.level==="inline"&&(e.startInline?e.startInline.push(s.start):e.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(e.childTokens[s.name]=s.childTokens)}),n.extensions=e),t.renderer){const s=this.defaults.renderer||new Go(this.defaults);for(const r in t.renderer){if(!(r in s))throw new Error(`renderer '${r}' does not exist`);if(["options","parser"].includes(r))continue;const a=r,o=t.renderer[a],c=s[a];s[a]=(...l)=>{let d=o.apply(s,l);return d===!1&&(d=c.apply(s,l)),d||""}}n.renderer=s}if(t.tokenizer){const s=this.defaults.tokenizer||new Vo(this.defaults);for(const r in t.tokenizer){if(!(r in s))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;const a=r,o=t.tokenizer[a],c=s[a];s[a]=(...l)=>{let d=o.apply(s,l);return d===!1&&(d=c.apply(s,l)),d}}n.tokenizer=s}if(t.hooks){const s=this.defaults.hooks||new To;for(const r in t.hooks){if(!(r in s))throw new Error(`hook '${r}' does not exist`);if(["options","block"].includes(r))continue;const a=r,o=t.hooks[a],c=s[a];To.passThroughHooks.has(r)?s[a]=l=>{if(this.defaults.async)return Promise.resolve(o.call(s,l)).then(h=>c.call(s,h));const d=o.call(s,l);return c.call(s,d)}:s[a]=(...l)=>{let d=o.apply(s,l);return d===!1&&(d=c.apply(s,l)),d}}n.hooks=s}if(t.walkTokens){const s=this.defaults.walkTokens,r=t.walkTokens;n.walkTokens=function(a){let o=[];return o.push(r.call(this,a)),s&&(o=o.concat(s.call(this,a))),o}}this.defaults={...this.defaults,...n}}),this}setOptions(i){return this.defaults={...this.defaults,...i},this}lexer(i,e){return Ri.lex(i,e??this.defaults)}parser(i,e){return Ci.parse(i,e??this.defaults)}parseMarkdown(i){return(t,n)=>{const s={...n},r={...this.defaults,...s},a=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));r.hooks&&(r.hooks.options=r,r.hooks.block=i);const o=r.hooks?r.hooks.provideLexer():i?Ri.lex:Ri.lexInline,c=r.hooks?r.hooks.provideParser():i?Ci.parse:Ci.parseInline;if(r.async)return Promise.resolve(r.hooks?r.hooks.preprocess(t):t).then(l=>o(l,r)).then(l=>r.hooks?r.hooks.processAllTokens(l):l).then(l=>r.walkTokens?Promise.all(this.walkTokens(l,r.walkTokens)).then(()=>l):l).then(l=>c(l,r)).then(l=>r.hooks?r.hooks.postprocess(l):l).catch(a);try{r.hooks&&(t=r.hooks.preprocess(t));let l=o(t,r);r.hooks&&(l=r.hooks.processAllTokens(l)),r.walkTokens&&this.walkTokens(l,r.walkTokens);let d=c(l,r);return r.hooks&&(d=r.hooks.postprocess(d)),d}catch(l){return a(l)}}}onError(i,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,i){const n="<p>An error occurred:</p><pre>"+si(t.message+"",!0)+"</pre>";return e?Promise.resolve(n):n}if(e)return Promise.reject(t);throw t}}},Is=new bM;function Lt(i,e){return Is.parse(i,e)}Lt.options=Lt.setOptions=function(i){return Is.setOptions(i),Lt.defaults=Is.defaults,wm(Lt.defaults),Lt};Lt.getDefaults=Zh;Lt.defaults=Ls;Lt.use=function(...i){return Is.use(...i),Lt.defaults=Is.defaults,wm(Lt.defaults),Lt};Lt.walkTokens=function(i,e){return Is.walkTokens(i,e)};Lt.parseInline=Is.parseInline;Lt.Parser=Ci;Lt.parser=Ci.parse;Lt.Renderer=Go;Lt.TextRenderer=au;Lt.Lexer=Ri;Lt.lexer=Ri.lex;Lt.Tokenizer=Vo;Lt.Hooks=To;Lt.parse=Lt;Lt.options;Lt.setOptions;Lt.use;Lt.walkTokens;Lt.parseInline;Ci.parse;Ri.lex;const oi=document.getElementById("ui"),ou=new Bw(document.getElementById("scene"));let ur=null;const Zt=i=>oi.querySelector(i),qi={get(i,e){try{return localStorage.getItem(i)??e}catch{return e}},set(i,e){try{localStorage.setItem(i,e)}catch{}}},xf=["Arcanist","Spellwright","Orbkeeper","Starweaver","Runesmith","Hexblade","Mistcaller","Emberheart"];let Gi=qi.get("oom-name",`${xf[Math.floor(Math.random()*xf.length)]}${Math.floor(Math.random()*90+10)}`),ri=qi.get("oom-deck",Vn[0].id),jr=qi.get("oom-aideck","random"),Ao="",vo=null;const SM="https://github.com/cariehl/orbs-of-magic-threejs",wM='<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',km=new URL("../commentary/orbs.md",location.href);let yf=null;function MM(){return yf??(yf=fetch(km,{cache:"no-cache"}).then(async i=>i.ok&&!(i.headers.get("content-type")??"").includes("text/html")&&(await i.text()).trim()||null).catch(()=>null)),yf}function EM(i){const e=document.createElement("template");e.innerHTML=Lt.parse(i,{async:!1});for(const[t,n]of[["img[src]","src"],["a[href]","href"]])e.content.querySelectorAll(t).forEach(s=>{const r=s.getAttribute(n);r.startsWith("#")||s.setAttribute(n,new URL(r,km).href)});return e.content.querySelectorAll("img[title]").forEach(t=>{const n=document.createElement("figure"),s=document.createElement("figcaption");s.textContent=t.getAttribute("title"),t.removeAttribute("title");const r=t.parentElement;((r==null?void 0:r.tagName)==="P"&&r.childNodes.length===1?r:t).replaceWith(n),n.append(t,s)}),e.content.querySelectorAll('a[href^="http"]').forEach(t=>{t.setAttribute("target","_blank"),t.setAttribute("rel","noopener")}),e.innerHTML}function TM(){const i=`<button class="btn big btn-quick">⚡ Quick Match</button>
        <button class="btn btn-private">🔒 Create Private Match</button>
        <div class="join-row"><input class="code-input" placeholder="Match code"><button class="btn btn-join">Join</button></div>`,e=_c();return e?`<div class="server-row"><span class="dim">Server</span> <b class="server-host" title="${at(e)}">${at(new URL(e).host)}</b>
        <button class="btn ghost small btn-invite" title="A link to this page that connects to this server">Copy link</button>
        <button class="btn ghost small btn-server-change">Change</button></div>
        ${i}`:`<p class="dim offline-note">To play online, enter the address of a game server (the URL a friend's server prints).</p>
        <div class="join-row"><input class="server-input" placeholder="https://….trycloudflare.com" value="${at(Ao)}"><button class="btn btn-server-connect">Connect</button></div>`}function bf(i){return i.map(e=>`<i class="dot" style="--c:${bn[e].hex}" title="${bn[e].name}"></i>`).join("")}function Rs(){ou.setMenuMode(!0),li.play("menu");const i=yh(),e=bh(ri);ri=e.id;const t=i.map(c=>`
    <button class="deck-tile ${c.id===ri?"sel":""} ${c.custom?"custom":""}" data-id="${c.id}" style="--c1:${bn[c.colors[0]??"neutral"].hex};--c2:${bn[c.colors[c.colors.length-1]??"neutral"].hex}">
      <span class="deck-icon">${c.icon}</span>
      <span class="deck-name">${at(c.name)}</span>
      <span class="deck-arch">${bf(c.colors)} ${at(c.archetype)}</span>
    </button>`).join("");oi.innerHTML=`
  <div class="menu">
    ${`<div class="menu-corner left">
      <a class="btn ghost small" href="../" title="Back to cariehl.github.io">← Back</a>
      <a class="icon-btn link-btn" href="${SM}" target="_blank" rel="noopener" title="Source code on GitHub" aria-label="GitHub">${wM}</a>
      <button class="btn ghost small btn-commentary hidden">📝 Commentary</button>
    </div>`}
    <div class="menu-corner right"><button class="icon-btn btn-help" title="How to Play" aria-label="How to Play">?</button></div>
    <div class="title"><h1>Orbs <span>of</span> Magic</h1><div class="subtitle">A tactical card battle for the five Orbs</div></div>
    <div class="menu-body">
      <div class="panel deck-picker">
        <h3>Choose your deck</h3>
        <div class="deck-grid">${t}</div>
        <div class="deck-detail">
          <div class="dd-head"><b>${at(e.name)}</b> <span class="tag">${at(e.archetype)}</span> ${bf(e.colors)}</div>
          <p>${at(e.blurb)}</p>
          <p class="dim">${at(e.howToPlay)}</p>
          <div class="row left">
            <button class="btn ghost small btn-view-deck">View decklist</button>
            <button class="btn ghost small btn-edit-deck">${e.custom?"Edit deck":"Copy &amp; edit"}</button>
            ${e.custom?'<button class="btn ghost small btn-del-deck">Delete</button>':""}
          </div>
        </div>
      </div>
      <div class="panel play-panel">
        <div class="play-head"><h3>Play</h3><label>Wizard name <input class="name-input" maxlength="20" value="${at(Gi)}"></label></div>
        <button class="btn big btn-ai">🤖 Battle the AI</button>
        <label class="ai-deck">AI deck <select class="ai-deck-sel"><option value="random">Random</option>${Vn.map(c=>`<option value="${c.id}" ${jr===c.id?"selected":""}>${at(c.name)} (${c.archetype})</option>`).join("")}</select></label>
        <div class="sep">Online</div>
        ${TM()}
        <div class="sep">Learn</div>
        <div class="row"><button class="btn ghost btn-howto">How to Play</button><button class="btn ghost btn-library">Card Library</button><button class="btn ghost btn-orbs">The Five Orbs</button></div>
        <div class="sep">Settings</div>
        <div class="row"><button class="btn ghost new-deck">＋ New Deck</button><button class="btn ghost btn-music-menu">🎵 Music: ${li.isOn()?"On":"Off"}</button></div>
        <div class="status dim"></div>
      </div>
    </div>
    <div class="modal hidden"></div>
  </div>`,Zt(".name-input").oninput=c=>{Gi=c.target.value.trim()||"Wizard",qi.set("oom-name",Gi)},oi.querySelectorAll(".deck-tile[data-id]").forEach(c=>c.onclick=()=>{ri=c.dataset.id,qi.set("oom-deck",ri),Je.click(),Rs()});const n=c=>{c&&(ri=c,qi.set("oom-deck",c)),Rs()};Zt(".new-deck").onclick=()=>uu(oi,null,n),Zt(".btn-edit-deck").onclick=()=>uu(oi,e.custom?{id:e.id,name:e.name,cards:e.cards}:{id:`custom_${Date.now()}`,name:`${e.name} Remix`,cards:e.cards.map(([c,l])=>[c,l])},n);const s=oi.querySelector(".btn-del-deck");s&&(s.onclick=()=>{confirm(`Delete "${e.name}"?`)&&(pg(e.id),ri=Vn[0].id,qi.set("oom-deck",ri),Rs())}),Zt(".ai-deck-sel").onchange=c=>{jr=c.target.value,qi.set("oom-aideck",jr)};const r=kf(ri);Zt(".btn-ai").onclick=()=>_o(async()=>{const c=jr==="random"?void 0:jr,l=vc();return H0||!l?new Pg({name:Gi,...r,aiDeckId:c}):l.create("duel",{name:Gi,...r,vsAI:!0,aiDeckId:c})});const a=Zt(".status"),o=vc();o&&(Zt(".btn-quick").onclick=()=>_o(()=>o.joinOrCreate("duel",{name:Gi,...r})),Zt(".btn-private").onclick=()=>_o(()=>o.create("duel",{name:Gi,...r,private:!0})),Zt(".btn-join").onclick=()=>{const c=Zt(".code-input").value.trim();c&&_o(()=>o.joinById(c,{name:Gi,...r}))}),AM(a),Zt(".btn-howto").onclick=Zt(".btn-help").onclick=()=>xa(`<div class="help">${Uf}</div>`),MM().then(c=>{const l=oi.querySelector(".btn-commentary");!c||!l||(l.classList.remove("hidden"),l.onclick=()=>xa(`<div class="commentary">${EM(c)}</div>`))}),Zt(".btn-library").onclick=()=>Om("all"),Zt(".btn-orbs").onclick=()=>CM(),Zt(".btn-music-menu").onclick=c=>{c.target.textContent=`🎵 Music: ${li.toggle()?"On":"Off"}`},Zt(".btn-view-deck").onclick=()=>RM(e.id)}function AM(i){const e=_c();if(e){Zt(".btn-server-change").onclick=()=>{Ao=e,vo=null,id(null),Rs()},Zt(".btn-invite").onclick=async()=>{try{await navigator.clipboard.writeText(sd()),i.textContent="Link copied. Anyone who opens it plays through this server."}catch{i.textContent=sd()}},vo!==e&&(vo=e,rd(e).then(s=>{!s&&_c()===e&&(i.textContent=`Can't reach ${new URL(e).host} right now. Is the server running?`)}));return}const t=Zt(".server-input"),n=async()=>{Ao=t.value;const s=Lp(t.value);if(!s){i.textContent="Enter a server address, like https://example.trycloudflare.com";return}const r=V0(s);if(r){i.textContent=r;return}if(i.textContent="Checking the server…",!await rd(s)){i.textContent=`Couldn't reach ${s}. Check the address and that the server is running.`;return}vo=s,id(s),Rs()};Zt(".btn-server-connect").onclick=n,t.onkeydown=s=>{s.key==="Enter"&&n()},t.oninput=()=>{Ao=t.value}}function xa(i){const e=oi.querySelector(".modal");return e.innerHTML=`<div class="panel modal-panel"><button class="close">✕</button>${i}</div>`,e.classList.remove("hidden"),e.querySelector(".close").onclick=()=>e.classList.add("hidden"),e.onclick=t=>{t.target===e&&e.classList.add("hidden")},e}function Om(i){const e=["all","ember","tide","grove","dawn","dusk"],t=r=>r.levelOf?Ye(r.levelOf).cost+.5:r.cost,n=Ef.filter(r=>(!r.token||r.levelOf)&&(i==="all"||r.color===i)).sort((r,a)=>t(r)-t(a)||(r.levelOf??r.id).localeCompare(a.levelOf??a.id)||(r.levelOf?1:-1));xa(`<h2>Card Library</h2>
    <div class="filters">${e.map(r=>`<button class="btn small ${r===i?"":"ghost"}" data-c="${r}">${r==="all"?"All":bn[r].name}</button>`).join("")}</div>
    <div class="card-grid">${n.map(r=>An(r)).join("")}</div>`).querySelectorAll(".filters button").forEach(r=>r.onclick=()=>Om(r.dataset.c))}function RM(i){const e=bh(i),t=e.cards.map(([n,s])=>({c:Ye(n),n:s})).sort((n,s)=>n.c.cost-s.c.cost);xa(`<h2>${at(e.name)} <span class="tag">${at(e.archetype)}</span></h2><p>${at(e.howToPlay)}</p>
    <div class="card-grid">${t.map(({c:n,n:s})=>`<div class="deck-card">${An(n)}<span class="count">×${s}</span></div>`).join("")}</div>`)}function CM(){xa(`<h2>The Five Orbs</h2><p class="dim">Long ago the world's magic was split into five Orbs. Every wizard draws on one or two of them, and each Orb shapes how its followers fight.</p>
    <div class="orb-list">${["ember","tide","grove","dawn","dusk"].map(e=>{const t=bn[e],n=Vn.filter(s=>s.colors.includes(e)).map(s=>s.name).join(", ");return`<div class="orb-row" style="--c:${t.hex}"><div class="orb-ball"></div><div><h3>${t.name} <span class="dim">· ${t.orb}</span></h3><p><b>${at(t.ideals)}</b> ${at(t.style)}</p><p class="dim">Decks: ${at(n)}</p></div></div>`}).join("")}</div>`)}async function _o(i){const e=oi.querySelector(".status");e&&(e.textContent="Connecting…"),Je.select();try{const t=await i();Um(t)}catch(t){console.error(t),e&&(e.textContent=`Couldn't connect: ${t.message??t}`),Je.error()}}function Um(i){ur==null||ur.dispose(),ur=new yg(i,ou,oi,()=>{ur=null,Rs()},()=>ri)}for(const i of["pointerdown","keydown"])window.addEventListener(i,()=>li.unlock(),{capture:!0});async function PM(){let i=null;try{i=sessionStorage.getItem("oom-reconnect")}catch{}const e=vc();if(i&&e)try{const t=await e.reconnect(i);Um(t);return}catch{try{sessionStorage.removeItem("oom-reconnect")}catch{}}Rs()}PM();window.oom={scene:ou,cardDef:Ye,music:li,renderOffline:ig,get game(){return ur}};
