(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Ol=7,Md=i=>i%2===0?8:9,rn=i=>`${i.c},${i.r}`,ro=(i,e)=>i.c===e.c&&i.r===e.r;function wd(i){return i.r>=0&&i.r<Ol&&i.c>=0&&i.c<Md(i.r)}const ao=i=>2*i.c+(i.r%2===0?1:0),Mp=(i,e)=>({c:(i-(e%2===0?1:0))/2,r:e});function jn(i,e){const t=Math.abs(i.r-e.r),n=Math.abs(ao(i)-ao(e));return t+Math.max(0,(n-t)/2)}const wp=[[2,0],[-2,0],[1,1],[-1,1],[1,-1],[-1,-1]];function Uo(i){const e=ao(i),t=[];for(const[n,s]of wp){const r=Mp(e+n,i.r+s);wd(r)&&t.push(r)}return t}const $r=(()=>{const i=[];for(let e=0;e<Ol;e++)for(let t=0;t<Md(e);t++)i.push({c:t,r:e});return i})(),_h=1;function as(i){const e=Math.sqrt(3)*_h,t=(ao(i)/2-4)*e,n=(3-i.r)*1.5*_h;return{x:t,z:n}}const vs=i=>i===0?[0,1]:[5,6],Ep=i=>i===0?0:Ol-1,Tp=i=>Ep(1-i),Ul=(i,e)=>vs(1-i).includes(e.r),oo=(i,e,t)=>e>1?Ul(i,t):t.r===Tp(i),Ap=i=>i===0?[0,1,2,3]:[3,4,5,6],sa=[{c:1,r:3},{c:4,r:3},{c:7,r:3}],Ed=i=>sa.some(e=>ro(e,i)),Es=(i="Choose a friendly unit")=>({kind:"unit",side:"friendly",prompt:i}),Ki=(i="Choose an enemy unit")=>({kind:"unit",side:"enemy",prompt:i}),br=(i="Choose a unit")=>({kind:"unit",side:"any",prompt:i}),Nc=i=>i&&"c"in i?{c:i.c,r:i.r}:void 0,Rp=(i,e,t,n)=>{const s=Nc(n[0]);return!!s&&jn(s,e)===1},Td=[{id:"e_spark_imp",name:"Spark Imp",color:"ember",type:"unit",cost:1,atk:2,hp:1,kw:["swift"],icon:"👺",text:"",flavor:"It has never once considered the consequences."},{id:"e_cinder_scout",name:"Cinder Scout",color:"ember",type:"unit",cost:1,atk:1,hp:2,speed:3,icon:"🏃",text:"Arrival: Deal 1 damage to the enemy Sanctum.",onPlay:(i,{p:e})=>i.damageSanctum(1-e,1)},{id:"e_firebolt",name:"Firebolt",color:"ember",type:"spell",cost:1,icon:"☄️",text:"Deal 2 damage to a unit.",targets:[br()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.dealDamage(t,2,null,"fire")}},{id:"e_torch_raider",name:"Torch Raider",color:"ember",type:"unit",cost:2,atk:2,hp:2,kw:["swift","siege"],icon:"🔥",text:"",flavor:"Burn the gates. Then burn what is behind them."},{id:"e_ashfang",name:"Ashfang Wolf",color:"ember",type:"unit",cost:2,atk:3,hp:2,speed:3,icon:"🐺",text:""},{id:"e_powder_goblin",name:"Powder Goblin",color:"ember",type:"unit",cost:2,atk:2,hp:1,kw:["swift"],icon:"💣",text:"Last Breath: Deal 2 damage to all adjacent units.",onDeath:(i,e)=>{i.fx("explosion",e);for(const t of i.adjacentUnits(e))i.dealDamage(t,2,null)}},{id:"e_flame_dancer",name:"Flame Dancer",color:"ember",type:"unit",cost:2,atk:2,hp:2,icon:"💃",text:"Whenever you cast a spell or order, deal 1 damage to the enemy Sanctum.",onSpellCast:(i,e)=>i.damageSanctum(1-e.owner,1,e)},{id:"e_berserker",name:"Bloodrage Berserker",color:"ember",type:"unit",cost:3,atk:3,hp:3,icon:"🪓",text:"When this survives damage, it gets +2 power.",onDamaged:(i,e)=>i.buff(e,2,0)},{id:"e_pyromancer",name:"Pyromancer",color:"ember",type:"unit",cost:3,atk:2,hp:2,range:2,icon:"🧙",text:"Arrival: Deal 1 damage to an enemy unit.",targets:[{...Ki(),optional:!0}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.dealDamage(t,1,null,"fire")}},{id:"e_war_cry",name:"War Cry",color:"ember",type:"order",cost:2,icon:"📯",text:"Ready a friendly unit. It gets +2 power this round.",targets:[Es()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.ready(t),i.tempBuff(t,2))}},{id:"e_blitz",name:"Blitz",color:"ember",type:"order",cost:1,icon:"⚡",text:"Give a friendly unit Swift and +1/+0.",targets:[Es()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.giveKw(t,"swift"),i.buff(t,1,0))}},{id:"e_warlord",name:"Ember Warlord",color:"ember",type:"unit",cost:4,atk:4,hp:3,icon:"👹",text:"Arrival: Other friendly units get +1/+0.",onPlay:(i,{p:e,self:t})=>{for(const n of i.unitsOf(e))n!==t&&i.buff(n,1,0)}},{id:"e_scorch",name:"Scorch the Earth",color:"ember",type:"spell",cost:3,icon:"🌋",text:"Deal 3 damage to the enemy Sanctum.",onPlay:(i,{p:e})=>i.damageSanctum(1-e,3)},{id:"e_fireball",name:"Fireball",color:"ember",type:"spell",cost:4,icon:"💥",text:"Deal 4 damage to a unit and 1 damage to units adjacent to it.",targets:[br()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);if(!t)return;const n=i.adjacentUnits(t);i.dealDamage(t,4,null,"explosion");for(const s of n)i.dealDamage(s,1,null)}},{id:"e_phoenix",name:"Ashen Phoenix",color:"ember",type:"unit",cost:5,atk:4,hp:3,kw:["flying","swift"],icon:"🐦‍🔥",text:"Last Breath: Return a copy of this to your hand. It costs 1 more.",onDeath:(i,e)=>i.addToHand(e.owner,"e_phoenix",1)},{id:"e_colossus",name:"Magma Colossus",color:"ember",type:"unit",cost:6,atk:6,hp:6,kw:["siege"],icon:"🗿",text:"Arrival: Deal 2 damage to all adjacent enemy units.",onPlay:(i,{self:e})=>{if(e){i.fx("explosion",e);for(const t of i.adjacentUnits(e))t.owner!==e.owner&&i.dealDamage(t,2,null)}}},{id:"t_coral_sentry",name:"Coral Sentry",color:"tide",type:"unit",cost:1,atk:1,hp:3,kw:["guardian"],icon:"🐚",text:""},{id:"t_undertow",name:"Undertow",color:"tide",type:"spell",cost:1,icon:"🌀",text:"Move a unit to an empty adjacent hex.",targets:[br(),{kind:"hex",prompt:"Choose an adjacent empty hex",hexFilter:(i,e,t,n)=>{const s=i.tUnit(n[0]);return!!s&&jn(s,e)===1}}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]),n=Nc(e[1]);t&&n&&i.teleport(t,n)}},{id:"t_frostbolt",name:"Frostbolt",color:"tide",type:"spell",cost:2,icon:"❄️",text:"Deal 1 damage to a unit and Freeze it.",targets:[br()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.dealDamage(t,1,null,"frost"),t.hp>0&&i.freeze(t))}},{id:"t_mistling",name:"Mistling",color:"tide",type:"unit",cost:2,atk:1,hp:2,kw:["flying"],icon:"🫧",text:"Arrival: Draw a card.",onPlay:(i,{p:e})=>i.draw(e,1)},{id:"t_wave_rider",name:"Wave Rider",color:"tide",type:"unit",cost:2,atk:2,hp:2,kw:["flying"],speed:3,icon:"🐬",text:""},{id:"t_insight",name:"Arcane Insight",color:"tide",type:"spell",cost:3,icon:"📘",text:"Draw 2 cards.",onPlay:(i,{p:e})=>i.draw(e,2)},{id:"t_riptide",name:"Riptide",color:"tide",type:"spell",cost:3,icon:"🌊",text:"Return a unit to its owner's hand.",targets:[br()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.bounce(t)}},{id:"t_mirror_mage",name:"Mirror Mage",color:"tide",type:"unit",cost:3,atk:2,hp:3,range:2,icon:"🔮",text:"Arrival: Draw a card.",onPlay:(i,{p:e})=>i.draw(e,1)},{id:"t_sea_witch",name:"Sea Witch",color:"tide",type:"unit",cost:3,atk:2,hp:4,icon:"🧜‍♀️",text:"Your spells and orders cost 1 less.",spellDiscount:1},{id:"t_glacial",name:"Glacial Elemental",color:"tide",type:"unit",cost:4,atk:3,hp:5,kw:["guardian"],icon:"🧊",text:"When a unit attacks this, Freeze the attacker.",onAttacked:(i,e,t)=>{t.hp>0&&i.freeze(t)}},{id:"t_deep_freeze",name:"Deep Freeze",color:"tide",type:"spell",cost:4,icon:"🥶",text:"Freeze an enemy unit and all enemy units adjacent to it.",targets:[Ki()],onPlay:(i,{targets:e,p:t})=>{const n=i.tUnit(e[0]);if(n){i.fx("frost",n);for(const s of[n,...i.adjacentUnits(n)])s.owner!==t&&i.freeze(s)}}},{id:"t_stormcaller",name:"Storm Caller",color:"tide",type:"unit",cost:5,atk:3,hp:4,range:3,icon:"⛈️",text:"Arrival: Deal 2 damage to an enemy unit.",targets:[{...Ki(),optional:!0}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.dealDamage(t,2,null,"lightning")}},{id:"t_time_warp",name:"Time Warp",color:"tide",type:"order",cost:6,icon:"⏳",text:"Ready all friendly units.",onPlay:(i,{p:e})=>{for(const t of i.unitsOf(e))i.ready(t)}},{id:"t_tidal_wave",name:"Tidal Wave",color:"tide",type:"spell",cost:6,icon:"🌊",text:"Return all units with 3 or less power to their owners' hands.",onPlay:i=>{i.fx("wave",null);for(const e of[...i.s.units])i.power(e)<=3&&i.bounce(e)}},{id:"t_leviathan",name:"Abyssal Leviathan",color:"tide",type:"unit",cost:8,atk:7,hp:8,icon:"🐋",text:"Arrival: Freeze all enemy units.",onPlay:(i,{p:e})=>{i.fx("wave",null);for(const t of i.unitsOf(1-e))i.freeze(t)}},{id:"g_sproutling",name:"Sproutling",color:"grove",type:"unit",cost:1,atk:0,hp:3,kw:["guardian"],icon:"🌱",text:"Last Breath: Gain an empty mana crystal.",onDeath:(i,e)=>i.gainMaxMana(e.owner,1)},{id:"g_entangle",name:"Entangle",color:"grove",type:"spell",cost:1,icon:"🕸️",text:"Root an enemy unit until the end of next round (it can't move).",targets:[Ki()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.root(t,2)}},{id:"g_druid",name:"Grove Druid",color:"grove",type:"unit",cost:2,atk:1,hp:3,icon:"🧝",text:"Arrival: Gain an empty mana crystal.",onPlay:(i,{p:e})=>i.gainMaxMana(e,1)},{id:"g_boar",name:"Thornback Boar",color:"grove",type:"unit",cost:2,atk:2,hp:3,icon:"🐗",text:"When a unit attacks this, deal 1 damage to the attacker.",onAttacked:(i,e,t)=>{t.hp>0&&i.dealDamage(t,1,null)}},{id:"g_feral",name:"Feral Growth",color:"grove",type:"order",cost:2,icon:"💪",text:"Give a friendly unit +2/+2.",targets:[Es()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&i.buff(t,2,2)}},{id:"g_pounce",name:"Predator's Pounce",color:"grove",type:"order",cost:2,icon:"🐾",text:"A friendly unit and an enemy unit within 2 hexes of it deal damage to each other.",targets:[Es(),{...Ki(),filter:(i,e,t,n)=>{const s=i.tUnit(n[0]);return!!s&&jn(s,e)<=2}}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]),n=i.tUnit(e[1]);t&&n&&i.fight(t,n)}},{id:"g_overgrowth",name:"Overgrowth",color:"grove",type:"spell",cost:3,icon:"🌿",text:"Gain an empty mana crystal. Draw a card.",onPlay:(i,{p:e})=>{i.gainMaxMana(e,1),i.draw(e,1)}},{id:"g_treant",name:"Treant Warden",color:"grove",type:"unit",cost:3,atk:2,hp:5,kw:["guardian","regenerate"],icon:"🌳",text:""},{id:"g_sporecap",name:"Sporecap Shaman",color:"grove",type:"unit",cost:3,atk:2,hp:3,icon:"🍄",text:"At the end of each round, give another random friendly unit +1/+1.",onRoundEnd:(i,e)=>{const t=i.unitsOf(e.owner).filter(n=>n!==e);t.length&&i.buff(i.pick(t),1,1)}},{id:"g_stag",name:"Elder Stag",color:"grove",type:"unit",cost:4,atk:4,hp:4,speed:3,icon:"🦌",text:"Arrival: Other friendly units get +1/+1.",onPlay:(i,{p:e,self:t})=>{for(const n of i.unitsOf(e))n!==t&&i.buff(n,1,1)}},{id:"g_packmother",name:"Packmother",color:"grove",type:"unit",cost:4,atk:3,hp:3,icon:"🦊",text:"Arrival: Summon two 2/1 Wolf Pups next to this.",onPlay:(i,{self:e})=>{if(e)for(let t=0;t<2;t++){const n=i.randomEmptyNeighbor(e);n&&i.summon("g_pup",e.owner,n)}}},{id:"g_pup",name:"Wolf Pup",color:"grove",type:"unit",cost:1,atk:2,hp:1,icon:"🐕",text:"",token:!0},{id:"g_behemoth",name:"Moss Behemoth",color:"grove",type:"unit",cost:5,atk:5,hp:6,kw:["regenerate"],icon:"🦍",text:""},{id:"g_dragon",name:"Verdant Dragon",color:"grove",type:"unit",cost:7,atk:6,hp:6,kw:["flying"],icon:"🐉",text:"Arrival: Heal your Sanctum by 5.",onPlay:(i,{p:e})=>i.healSanctum(e,5)},{id:"g_titan",name:"Worldroot Titan",color:"grove",type:"unit",cost:9,atk:10,hp:10,kw:["guardian","regenerate"],icon:"🌲",text:"Arrival: Root all enemy units until the end of next round.",onPlay:(i,{p:e})=>{i.fx("roots",null);for(const t of i.unitsOf(1-e))i.root(t,2)}},{id:"d_recruit",name:"Militia Recruit",color:"dawn",type:"unit",cost:1,atk:1,hp:1,icon:"🪖",text:"",token:!0},{id:"d_squire",name:"Eager Squire",color:"dawn",type:"unit",cost:1,atk:1,hp:2,icon:"🧑‍🌾",text:"Arrival: Summon a 1/1 Militia Recruit next to this.",onPlay:(i,{self:e})=>{if(!e)return;const t=i.randomEmptyNeighbor(e);t&&i.summon("d_recruit",e.owner,t)}},{id:"d_holy_light",name:"Holy Light",color:"dawn",type:"spell",cost:1,icon:"✨",text:"Heal a friendly unit by 3 and give it Barrier.",targets:[Es()],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.heal(t,3),i.giveKw(t,"barrier"))}},{id:"d_shieldmaiden",name:"Shieldmaiden",color:"dawn",type:"unit",cost:2,atk:2,hp:2,kw:["guardian","barrier"],icon:"🛡️",text:""},{id:"d_archer",name:"Lightwarden Archer",color:"dawn",type:"unit",cost:2,atk:2,hp:1,range:2,icon:"🏹",text:""},{id:"d_banner",name:"Banner Knight",color:"dawn",type:"unit",cost:3,atk:2,hp:3,icon:"🚩",text:"Arrival: Give adjacent friendly units +1/+1.",onPlay:(i,{self:e})=>{if(e)for(const t of i.adjacentUnits(e))t.owner===e.owner&&i.buff(t,1,1)}},{id:"d_captain",name:"Captain of the Guard",color:"dawn",type:"unit",cost:3,atk:3,hp:3,icon:"🎖️",text:"Whenever you summon another unit, give it +1/+1.",onFriendlySummon:(i,e,t)=>i.buff(t,1,1)},{id:"d_call_arms",name:"Call to Arms",color:"dawn",type:"spell",cost:3,icon:"📣",text:"Summon three 1/1 Militia Recruits in your deployment zone.",onPlay:(i,{p:e})=>i.summonInDeploy("d_recruit",e,3)},{id:"d_smite",name:"Smite",color:"dawn",type:"spell",cost:3,icon:"⚖️",text:"Destroy an enemy unit with 4 or more power.",targets:[{...Ki("Choose an enemy unit with 4+ power"),filter:(i,e)=>i.power(e)>=4}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.fx("holy",t),i.destroy(t))}},{id:"d_divine_aegis",name:"Divine Aegis",color:"dawn",type:"spell",cost:3,icon:"🔆",text:"Give all friendly units Barrier.",onPlay:(i,{p:e})=>{for(const t of i.unitsOf(e))i.giveKw(t,"barrier")}},{id:"d_glorious",name:"Glorious Charge",color:"dawn",type:"order",cost:4,icon:"🎺",text:"Friendly units get +2 power this round.",onPlay:(i,{p:e})=>{for(const t of i.unitsOf(e))i.tempBuff(t,2)}},{id:"d_paladin",name:"Dawnblade Paladin",color:"dawn",type:"unit",cost:4,atk:3,hp:4,kw:["firstStrike"],icon:"⚔️",text:"Arrival: Heal your Sanctum by 3.",onPlay:(i,{p:e})=>i.healSanctum(e,3)},{id:"d_bastion",name:"Bastion Golem",color:"dawn",type:"unit",cost:5,atk:2,hp:8,kw:["guardian"],icon:"🏛️",text:"At the start of each round, give adjacent friendly units Barrier.",onRoundStart:(i,e)=>{for(const t of i.adjacentUnits(e))t.owner===e.owner&&i.giveKw(t,"barrier")}},{id:"d_seraph",name:"Seraph of Dawn",color:"dawn",type:"unit",cost:6,atk:5,hp:5,kw:["flying","barrier"],icon:"👼",text:"Arrival: Heal all friendly units and your Sanctum by 3.",onPlay:(i,{p:e})=>{i.fx("holy",null,{p:e});for(const t of i.unitsOf(e))i.heal(t,3);i.healSanctum(e,3)}},{id:"k_skeleton",name:"Skeleton",color:"dusk",type:"unit",cost:1,atk:1,hp:1,icon:"💀",text:"",token:!0},{id:"k_grave_imp",name:"Grave Imp",color:"dusk",type:"unit",cost:1,atk:1,hp:1,icon:"😈",text:"Last Breath: Deal 1 damage to the enemy Sanctum.",onDeath:(i,e)=>i.damageSanctum(1-e.owner,1)},{id:"k_dark_pact",name:"Dark Pact",color:"dusk",type:"spell",cost:1,icon:"📜",text:"Sacrifice a friendly unit. Draw 2 cards.",targets:[Es("Choose a unit to sacrifice")],onPlay:(i,{targets:e,p:t})=>{const n=i.tUnit(e[0]);n&&(i.destroy(n),i.draw(t,2))}},{id:"k_plague_rat",name:"Plague Rat",color:"dusk",type:"unit",cost:2,atk:1,hp:1,kw:["deadly"],icon:"🐀",text:""},{id:"k_cultist",name:"Blood Cultist",color:"dusk",type:"unit",cost:2,atk:2,hp:2,icon:"🩸",text:"Arrival: You may sacrifice an adjacent friendly unit. If you do, this gets +3/+3.",targets:[{kind:"unit",side:"friendly",optional:!0,prompt:"Sacrifice an adjacent ally? (optional)",filter:Rp}],onPlay:(i,{targets:e,self:t})=>{const n=i.tUnit(e[0]);n&&t&&(i.destroy(n),i.buff(t,3,3))}},{id:"k_bone_horde",name:"Bone Horde",color:"dusk",type:"spell",cost:2,icon:"🦴",text:"Summon two 1/1 Skeletons in your deployment zone.",onPlay:(i,{p:e})=>i.summonInDeploy("k_skeleton",e,2)},{id:"k_siphon",name:"Soul Siphon",color:"dusk",type:"unit",cost:3,atk:1,hp:4,range:2,icon:"🕯️",text:"Whenever another friendly unit dies, deal 1 damage to the enemy Sanctum and heal yours by 1.",onUnitDeath:(i,e,t)=>{t.owner===e.owner&&(i.damageSanctum(1-e.owner,1,null),i.healSanctum(e.owner,1))}},{id:"k_assassin",name:"Shadow Assassin",color:"dusk",type:"unit",cost:3,atk:2,hp:2,kw:["deadly","infiltrate"],icon:"🥷",text:""},{id:"k_wraith",name:"Hungering Wraith",color:"dusk",type:"unit",cost:3,atk:2,hp:3,kw:["flying","drain"],icon:"👻",text:""},{id:"k_embrace",name:"Death's Embrace",color:"dusk",type:"spell",cost:2,icon:"🖤",text:"Destroy a damaged enemy unit.",targets:[{...Ki("Choose a damaged enemy unit"),filter:(i,e)=>e.hp<e.maxHp}],onPlay:(i,{targets:e})=>{const t=i.tUnit(e[0]);t&&(i.fx("shadow",t),i.destroy(t))}},{id:"k_necromancer",name:"Necromancer",color:"dusk",type:"unit",cost:4,atk:2,hp:4,icon:"🧟",text:"Whenever another friendly non-Skeleton unit dies, summon a 1/1 Skeleton in its place.",onUnitDeath:(i,e,t)=>{t.owner===e.owner&&t.cardId!=="k_skeleton"&&i.isEmpty(t)&&i.summon("k_skeleton",e.owner,t)}},{id:"k_vampire",name:"Vampire Noble",color:"dusk",type:"unit",cost:4,atk:4,hp:4,kw:["drain"],icon:"🧛",text:""},{id:"k_raise_dead",name:"Raise Dead",color:"dusk",type:"spell",cost:3,icon:"⚰️",text:"Summon a copy of the last friendly unit that died this game in your deployment zone.",targets:[{kind:"hex",prompt:"Choose a hex in your deployment zone",hexFilter:(i,e,t)=>i.isDeployHex(t,e)&&i.s.players[t].graveyard.length>0}],onPlay:(i,{targets:e,p:t})=>{const n=Nc(e[0]),s=i.s.players[t].graveyard;n&&s.length&&(i.fx("shadow",n),i.summon(s[s.length-1],t,n))}},{id:"k_final_rite",name:"Final Rite",color:"dusk",type:"spell",cost:4,icon:"🌑",text:"Sacrifice all friendly units. Deal 2 damage to the enemy Sanctum for each.",onPlay:(i,{p:e})=>{const t=i.unitsOf(e);i.fx("shadow",null,{p:e});for(const n of t)i.destroy(n);i.damageSanctum(1-e,2*t.length)}},{id:"k_lich",name:"Lich Queen",color:"dusk",type:"unit",cost:7,atk:5,hp:6,kw:["drain"],icon:"👑",text:"Arrival: Destroy all other units with 2 or less health.",onPlay:(i,{self:e})=>{i.fx("shadow",null);for(const t of[...i.s.units])t!==e&&t.hp<=2&&i.destroy(t)}},{id:"c_pyra",name:"Pyra, the Wildfire",color:"ember",type:"unit",cost:2,atk:2,hp:2,kw:["swift"],icon:"🎇",text:"Level up: You have dealt 8+ damage to the enemy Sanctum this game.",champion:{to:"c_pyra2",label:"Sanctum damage dealt",progress:(i,e)=>[i.s.players[e.owner].sanctumDamageDealt,8]}},{id:"c_pyra2",name:"Pyra, Living Inferno",color:"ember",type:"unit",cost:2,atk:4,hp:3,kw:["swift","siege","flying"],icon:"☀️",text:"Leveled up! Flies over everything to burn Sanctums.",levelOf:"c_pyra",token:!0},{id:"c_nerith",name:"Nerith, Tidecaller",color:"tide",type:"unit",cost:3,atk:2,hp:4,range:2,icon:"🧜‍♂️",text:"Level up: You have cast 5+ spells or orders this game.",champion:{to:"c_nerith2",label:"Spells and orders cast",progress:(i,e)=>[i.s.players[e.owner].spellsCast,5]}},{id:"c_nerith2",name:"Nerith, Maelstrom Lord",color:"tide",type:"unit",cost:3,atk:4,hp:6,range:3,icon:"🌪️",text:"At the start of each round, Freeze the strongest enemy unit.",levelOf:"c_nerith",token:!0,onRoundStart:(i,e)=>{const t=i.unitsOf(1-e.owner);if(!t.length)return;const n=t.reduce((s,r)=>i.power(r)>i.power(s)?r:s);i.fx("frost",n),i.freeze(n)}},{id:"c_thornak",name:"Thornak, the Rooted",color:"grove",type:"unit",cost:4,atk:4,hp:5,kw:["regenerate"],icon:"🐻",text:"Level up: You have 8+ max mana.",champion:{to:"c_thornak2",label:"Max mana",progress:(i,e)=>[i.s.players[e.owner].maxMana,8]}},{id:"c_thornak2",name:"Thornak, Ancient King",color:"grove",type:"unit",cost:4,atk:8,hp:8,kw:["regenerate","guardian"],icon:"🦣",text:"At the start of each round, other friendly units get +1/+1.",levelOf:"c_thornak",token:!0,onRoundStart:(i,e)=>{for(const t of i.unitsOf(e.owner))t!==e&&i.buff(t,1,1)}},{id:"c_sera",name:"Sera, Shield of Dawn",color:"dawn",type:"unit",cost:3,atk:2,hp:4,kw:["guardian"],icon:"👸",text:"Level up: You control 5+ units.",champion:{to:"c_sera2",label:"Units you control",progress:(i,e)=>[i.unitsOf(e.owner).length,5]}},{id:"c_sera2",name:"Sera, Dawn's Bulwark",color:"dawn",type:"unit",cost:3,atk:4,hp:6,kw:["guardian","barrier","firstStrike"],icon:"🌅",text:"At the start of each round, summon a 1/1 Militia Recruit next to this and give adjacent allies Barrier.",levelOf:"c_sera",token:!0,onRoundStart:(i,e)=>{const t=i.randomEmptyNeighbor(e);t&&i.summon("d_recruit",e.owner,t);for(const n of i.adjacentUnits(e))n.owner===e.owner&&i.giveKw(n,"barrier")}},{id:"c_morvath",name:"Morvath, Gravecaller",color:"dusk",type:"unit",cost:3,atk:3,hp:3,kw:["drain"],icon:"🦇",text:"Level up: 5+ of your units have died this game.",champion:{to:"c_morvath2",label:"Allies fallen",progress:(i,e)=>[i.s.players[e.owner].alliesLost,5]}},{id:"c_morvath2",name:"Morvath, Soul Reaper",color:"dusk",type:"unit",cost:3,atk:5,hp:5,kw:["drain","deadly"],icon:"☠️",text:"Whenever another friendly unit dies, deal 1 damage to the enemy Sanctum.",levelOf:"c_morvath",token:!0,onUnitDeath:(i,e,t)=>{t.owner===e.owner&&i.damageSanctum(1-e.owner,1,null)}}],xo=Object.fromEntries(Td.map(i=>[i.id,i])),Ad=Td,vn={ember:{name:"Ember",hex:"#ff5a2a",orb:"Orb of Passion",ideals:"Freedom, fury, the thrill of the moment.",style:"Swift units that act immediately, Siege, and burn that goes straight for the enemy Sanctum."},tide:{name:"Tide",hex:"#2aa8ff",orb:"Orb of Insight",ideals:"Knowledge, patience, control.",style:"Freezes, bounces and repositions enemies, draws cards, and wins late with huge sea monsters."},grove:{name:"Grove",hex:"#4fd16a",orb:"Orb of Life",ideals:"Growth, instinct, endurance.",style:"Ramps extra mana into enormous creatures, Regenerates, and makes its units fight."},dawn:{name:"Dawn",hex:"#ffd34d",orb:"Orb of Order",ideals:"Unity, justice, protection.",style:"Guardians and Barriers, healing, and a wide army of soldiers that buff each other."},dusk:{name:"Dusk",hex:"#b05cff",orb:"Orb of Ambition",ideals:"Power at any price.",style:"Sacrifices its own units for value, Drains life, Deadly assassins, and death-trigger combos."},neutral:{name:"Neutral",hex:"#aaaaaa",orb:"",ideals:"",style:""}},_s={swift:{name:"Swift",text:"Can be ordered the round it is summoned.",icon:"💨"},guardian:{name:"Guardian",text:"Enemy units that move next to it must stop. Flying units ignore this.",icon:"🛡️"},flying:{name:"Flying",text:"Moves over other units and ignores Guardians.",icon:"🪽"},firstStrike:{name:"First Strike",text:"Deals its combat damage first. If that kills, it takes none back.",icon:"🗡️"},drain:{name:"Drain",text:"Damage it deals heals your Sanctum.",icon:"🩸"},regenerate:{name:"Regenerate",text:"Fully heals at the end of each round.",icon:"♻️"},barrier:{name:"Barrier",text:"Negates the next damage it would take, then breaks.",icon:"🔰"},siege:{name:"Siege",text:"Deals double damage to Sanctums.",icon:"🏰"},deadly:{name:"Deadly",text:"Destroys any unit it damages.",icon:"☠️"},infiltrate:{name:"Infiltrate",text:"Can be summoned on any empty hex in your half of the board, including Ley Orbs.",icon:"👁️"}};function Ye(i){const e=xo[i];if(!e)throw new Error(`Unknown card ${i}`);return e}const ui=(...i)=>i.map(e=>[e,2]),kn=[{id:"wildfire",name:"Wildfire",archetype:"Aggro",colors:["ember"],signature:"e_torch_raider",blurb:"Swift units and burn. Hit the Sanctum before the enemy gets going.",howToPlay:"Flood the board early, grab the Ley Orbs, and use Firebolts to clear blockers. Save Scorch the Earth and War Cry to finish.",cards:ui("e_spark_imp","e_cinder_scout","e_firebolt","e_torch_raider","e_ashfang","e_powder_goblin","e_flame_dancer","e_berserker","e_pyromancer","e_war_cry","c_pyra","e_warlord","e_scorch","e_fireball","e_phoenix")},{id:"frozen_tide",name:"Frozen Bastion",archetype:"Control",colors:["tide","dawn"],signature:"t_leviathan",blurb:"Freeze, bounce and wall up until the Leviathan rises.",howToPlay:"Hold the line with Guardians, answer threats with Frostbolt, Smite and Riptide, draw cards, then take over late with Storm Callers and the Leviathan.",cards:ui("t_coral_sentry","t_undertow","t_frostbolt","d_holy_light","d_shieldmaiden","c_nerith","t_insight","t_riptide","t_mirror_mage","d_smite","t_glacial","t_deep_freeze","t_stormcaller","t_tidal_wave","t_leviathan")},{id:"ancient_awakening",name:"Ancient Awakening",archetype:"Ramp",colors:["grove","tide"],signature:"g_titan",blurb:"Grow your mana absurdly fast and drop titans nobody can answer.",howToPlay:"Play Druids, Sproutlings and Overgrowth early to gain extra mana crystals, stall with Treants and Entangle, then land Dragons, Leviathans and the Worldroot Titan.",cards:ui("g_sproutling","g_entangle","g_druid","c_thornak","t_frostbolt","g_overgrowth","g_treant","t_mirror_mage","t_insight","g_packmother","g_behemoth","t_stormcaller","g_dragon","t_leviathan","g_titan")},{id:"silver_vanguard",name:"Silver Vanguard",archetype:"Midrange",colors:["dawn","grove"],signature:"d_paladin",blurb:"Efficient, sturdy units that buff each other and trade up.",howToPlay:"Curve out with solid units every round, win fights with Feral Growth and Predator's Pounce, and out-value the enemy with Paladins and the Seraph.",cards:ui("c_sera","d_archer","d_shieldmaiden","g_boar","g_feral","d_holy_light","d_banner","d_captain","g_treant","g_pounce","d_paladin","g_stag","d_smite","d_bastion","d_seraph")},{id:"grave_pact",name:"Grave Pact",archetype:"Combo",colors:["dusk","ember"],signature:"k_final_rite",blurb:"Every death drains the enemy. Then sacrifice everything at once.",howToPlay:"Assemble Soul Siphons and Necromancers, fill the board with Imps and Skeletons, then cast Final Rite: each sacrificed unit deals 2, plus 1 more per Siphon.",cards:ui("k_grave_imp","e_spark_imp","e_firebolt","k_dark_pact","c_morvath","k_bone_horde","e_powder_goblin","k_cultist","e_flame_dancer","k_siphon","k_raise_dead","k_assassin","k_necromancer","e_war_cry","k_final_rite")},{id:"storm_raiders",name:"Storm Raiders",archetype:"Tempo",colors:["ember","tide"],signature:"t_wave_rider",blurb:"Fliers and cheap tricks. Always one step ahead.",howToPlay:"Fly over blockers to reach enemy territory, and use cheap spells to push, freeze and bounce defenders at the perfect moment. Sea Witch makes everything cheaper.",cards:ui("e_spark_imp","e_firebolt","t_undertow","t_wave_rider","t_mistling","e_torch_raider","c_nerith","t_frostbolt","e_war_cry","t_sea_witch","e_pyromancer","t_riptide","e_powder_goblin","e_phoenix","t_stormcaller")},{id:"legion_of_dawn",name:"Legion of Dawn",archetype:"Go-Wide",colors:["dawn","dusk"],signature:"d_glorious",blurb:"An endless army of soldiers and skeletons, then one glorious charge.",howToPlay:"Spread out across the board with Recruits and Skeletons, protect them with Barriers, and swing with everything after Glorious Charge.",cards:ui("d_squire","k_grave_imp","k_bone_horde","d_archer","d_shieldmaiden","d_call_arms","d_captain","c_sera","k_siphon","d_divine_aegis","k_necromancer","d_glorious","k_vampire","d_paladin","d_seraph")},{id:"wild_hunt",name:"Wild Hunt",archetype:"Stompy",colors:["grove","ember"],signature:"e_colossus",blurb:"Big beasts, bigger fights. Smash through the front line.",howToPlay:"Play the biggest body you can every round, use Pounce and Fireball to clear the way, and trample in with Colossi and Behemoths.",cards:ui("g_boar","c_thornak","e_torch_raider","g_feral","g_pounce","e_berserker","g_treant","e_firebolt","g_stag","g_packmother","e_warlord","g_behemoth","e_fireball","e_colossus","g_dragon")},{id:"night_court",name:"Night Court",archetype:"Attrition",colors:["dusk","tide"],signature:"k_lich",blurb:"Drain life, kill everything, and outlast the opponent.",howToPlay:"Trade efficiently with Deadly units and removal, heal with Drain, and reset the board with the Lich Queen when you fall behind.",cards:ui("t_coral_sentry","k_plague_rat","t_frostbolt","k_embrace","k_wraith","c_morvath","t_mirror_mage","t_insight","k_vampire","t_glacial","k_raise_dead","t_riptide","t_deep_freeze","k_lich","t_leviathan")}],Qs=30,Fr=3,ls=2;function yh(i){return i.reduce((e,[,t])=>e+t,0)}function Xr(i){var t;const e=[];for(const[n]of i){const s=(t=xo[n])==null?void 0:t.color;s&&!e.includes(s)&&e.push(s)}return e}function Rd(i){var n;const e=i.map(([s])=>xo[s]).filter(Boolean),t=e.find(s=>s.champion);return t?t.icon:((n=e.sort((s,r)=>r.cost-s.cost)[0])==null?void 0:n.icon)??"🔮"}function co(i){if(!Array.isArray(i))return"Deck must be a list.";let e=0;for(const t of i){if(!Array.isArray(t)||t.length!==2)return"Bad deck entry.";const[n,s]=t,r=xo[n];if(!r||r.token)return`Unknown card ${String(n)}.`;if(!Number.isInteger(s)||s<1||s>Fr)return`Max ${Fr} copies of ${r.name}.`;e+=s}return e!==Qs?`Decks need exactly ${Qs} cards (this one has ${e}).`:Xr(i).length>ls?`Decks can use at most ${ls} colors.`:null}function qr(i){const e=kn.find(t=>t.id===i)??kn[0];return{id:e.id,name:e.name,cards:e.cards}}const Cd={C:0,D:2,E:4,F:5,G:7,A:9,B:11};function Cp(i){const e=/^([A-G])(#|b)?(-?\d)$/.exec(i);if(!e)throw new Error(`Bad note ${i}`);return 12*(Number(e[3])+1)+Cd[e[1]]+(e[2]==="#"?1:e[2]==="b"?-1:0)}function js(i,e,t,n,s,r=.7){let a=t*n;e.split("|").forEach((o,c)=>{let h=0;for(const d of o.trim().split(/\s+/).filter(Boolean)){const[u,m]=d.split(":"),p=Number(m);if(u!=="r")for(const y of u.split("+"))i.push({beat:a+h,dur:p,midi:Cp(y),vel:r,inst:s});h+=p}if(Math.abs(h-n)>1e-6)throw new Error(`${s} bar ${t+c+1} has ${h} beats`);a+=n})}const Pp={"":[0,4,7],m:[0,3,7],m7:[0,3,7,10],m9:[0,3,7,10,14],maj7:[0,4,7,11],sus4:[0,5,7],m7b5:[0,3,6,10],7:[0,4,7,10]};function Pd(i){const e=/^([A-G][b#]?)(.*)$/.exec(i);return{root:(Cd[e[1][0]]+(e[1][1]==="#"?1:e[1][1]==="b"?-1:0)+12)%12,iv:Pp[e[2]]}}const Br=(i,e)=>e+((i-e)%12+12)%12;function Ip(){const e=[],t=["Dm9","Dm9","Bbmaj7","Bbmaj7","G","Gm","Asus4","A","Dm9","Dm9","Bbmaj7","C","Fmaj7","G","Asus4","Dm","Bbmaj7","C","Am7","Dm","Gm7","C","Fmaj7","A","Dm9","Bbmaj7","G","Gm","Fmaj7","Em7b5","Asus4","A"];js(e,`r:2 A4:1 | D5:1.5 E5:.5 F5:1 | E5:2 C5:1 | D5:3 | r:1 B4:1 D5:1 | G5:1.5 F5:.5 D5:1 | E5:2 D5:1 | C#5:3 |
    r:2 A4:1 | D5:1.5 E5:.5 F5:1 | A5:2 G5:1 | E5:2 C5:1 | F5:1.5 E5:.5 C5:1 | D5:2 B4:1 | D5:1 E5:2 | D5:3 |
    F5:1 A5:1 D6:1 | C6:2 G5:1 | E5:1 A5:1 C6:1 | A5:3 | Bb5:1 A5:1 G5:1 | E5:2 G5:1 | A5:1.5 G5:.5 F5:1 | E5:3 |
    r:1 A4:1 D5:1 | E5:1 F5:1 A5:1 | B5:2 A5:1 | G5:2 F5:1 | E5:1.5 F5:.5 E5:1 | D5:2 Bb4:1 | D5:1 E5:2 | C#5:2 r:1`,0,3,"celesta",.62),t.forEach((s,r)=>{const{root:a,iv:o}=Pd(s),c=r*3,h=Br(a,50),d=o.length>3?h+12+o[3]:h+12+o[2];[h-12,h+o[2],h+12,h+12+o[1],d,h+12+o[1]].forEach((p,y)=>e.push({beat:c+y*.5,dur:1.5,midi:p,vel:y===0?.55:.36,inst:"harp"}));const m=Br(a,55);for(const p of o.slice(1,4))e.push({beat:c,dur:3,midi:m+p,vel:.32,inst:"pad"});(r<8||r>=24)&&e.push({beat:c,dur:3,midi:Br(a,38),vel:.34,inst:"bass"}),r%4===0&&e.push({beat:c+1,dur:3,midi:m+o[o.length-1]+12,vel:.22,inst:"bell"})});const n=t.map((s,r)=>r>=16&&r<24?1:.88);return{name:"menu",bpm:66,beatsPerBar:3,bars:t.length,events:e,dyn:n,level:1}}function Dp(){const e=[],t=["Dm","Dm","Bb","Bb","Gm","Gm","A","A","Dm","Bb","Gm","A","Dm","Bb","C","A","Bb","C","Dm","Dm","Bb","C","A","A","Gm","Gm","Dm","Dm","Eb","Eb","A","A"];js(e,"r:4 | r:4 | r:4 | r:4 | D5:4 | D5:4 | E5:4 | C#5:4",0,4,"violin",.42),js(e,`A3:1 D4:1.5 E4:.5 F4:1 | F4:2 D4:1 C4:1 | D4:4 | r:1 C#4:1 E4:1 A4:1 |
    A4:1.5 G4:.5 F4:1 E4:1 | F4:2 D4:2 | E4:1.5 F4:.5 G4:2 | E4:4`,8,4,"horn",.62),js(e,"D5:4 | E5:2 G5:2 | F5:3 E5:1 | D5:2 A5:2 | Bb5:3 A5:1 | G5:2 C6:2 | A5:2 G5:1 E5:1 | C#6:4",16,4,"violin",.6),js(e,"D4:4 | E4:4 | F4:4 | A4:4 | F4:4 | G4:4 | E4:4 | E4:4",16,4,"horn",.45),js(e,"r:4 | r:4 | r:3 A4:1 | D5:1.5 E5:.5 F5:2 | G5:3 F5:1 | Eb5:4 | E5:2 C#5:2 | A4:4",24,4,"flute",.5);const n=[1,.45,.5,.85,.45,.5,.8,.5];t.forEach((r,a)=>{const{root:o,iv:c}=Pd(r),h=a*4,d=Math.floor(a/8),u=Br(o,38);if(d<3)[u,u,u+7,u,u,u+12,u,u+7].forEach((x,_)=>e.push({beat:h+_*.5,dur:.4,midi:x,vel:n[_]*(d===0?.5:.62),inst:"spicc"}));else for(let y=0;y<4;y++)e.push({beat:h+y,dur:.8,midi:y%2?u+7:u,vel:y===0?.5:.32,inst:"spicc"});const m=Br(o,53);for(const y of c)e.push({beat:h,dur:4,midi:m+y,vel:d===2?.42:.3,inst:"pad"});e.push({beat:h,dur:4,midi:u-12<28?u:u-12,vel:.4,inst:"bass"}),d===2&&(e.push({beat:h,dur:4,midi:u,vel:.3,inst:"brass"}),e.push({beat:h,dur:4,midi:u+7,vel:.24,inst:"brass"}));const p=(y,x,_=u)=>e.push({beat:y,dur:1.5,midi:_,vel:x,inst:"timp"});if(d<3&&p(h,d===0?.42:.55),d===2&&p(h+2.5,.38,u+7),a===23)for(let y=0;y<16;y++)p(h+y*.25,.18+y*.035);a===15&&(p(h+3,.45,u+7),p(h+3.5,.5,u+7)),d===3&&a%4===0&&p(h,.35)});const s=[.62,.64,.67,.7,.72,.75,.8,.84,.82,.84,.86,.9,.86,.88,.92,.95,.9,.93,.97,1,.97,1,1.05,1.1,.72,.7,.68,.66,.7,.72,.68,.64];return{name:"battle",bpm:84,beatsPerBar:4,bars:t.length,events:e,dyn:s,level:1.15}}const Id={menu:Ip(),battle:Dp()},Lp=i=>440*2**((i-69)/12),Op={celesta:{gain:.32,pan:.15,send:.55},harp:{gain:.3,pan:-.25,send:.45},pad:{gain:.16,pan:0,send:.6},bass:{gain:.3,pan:.05,send:.35},bell:{gain:.12,pan:.35,send:.8},spicc:{gain:.3,pan:-.15,send:.3},horn:{gain:.3,pan:-.3,send:.5},violin:{gain:.2,pan:.3,send:.55},flute:{gain:.22,pan:.25,send:.6},timp:{gain:.5,pan:0,send:.4},brass:{gain:.2,pan:-.1,send:.45}},xh=new WeakMap;function Up(i){let e=xh.get(i);if(e)return e;const t=Math.floor(i.sampleRate*3.4);e=i.createBuffer(2,t,i.sampleRate);for(let n=0;n<2;n++){const s=e.getChannelData(n);let r=0;for(let a=0;a<t;a++){const o=a/t;r+=.32*(Math.random()*2-1-r),s[a]=r*(1-o)**2.6*(a<i.sampleRate*.012?a/(i.sampleRate*.012):1)}}return xh.set(i,e),e}function Np(i,e){const t=i.createGain(),n=i.createGain(),s=i.createGain(),r=i.createGain(),a=i.createConvolver();a.buffer=Up(i);const o=i.createGain();o.gain.value=.55;const c=i.createDynamicsCompressor();c.threshold.value=-20,c.ratio.value=3,c.attack.value=.05,c.release.value=.4,s.connect(n),r.connect(a).connect(o).connect(n),n.connect(c).connect(t).connect(e);const h=new Map;for(const[d,u]of Object.entries(Op)){const m=i.createGain();m.gain.value=u.gain;const p=i.createStereoPanner();p.pan.value=u.pan;const y=i.createGain();y.gain.value=u.send,m.connect(p),p.connect(s),p.connect(y),y.connect(r),h.set(d,m)}return{input:s,send:r,dyn:n,fade:t,ch:h}}function Ji(i,e,t,n,s,r){const a=i.createGain();return a.gain.setValueAtTime(0,e),a.gain.linearRampToValueAtTime(n,e+t),a.gain.setValueAtTime(n,e+Math.max(t,s)),a.gain.setTargetAtTime(0,e+Math.max(t,s),r/4),a}function bn(i,e,t,n,s,r=0){const a=i.createOscillator();return a.type=e,a.frequency.value=t,a.detune.value=r,a.start(n),a.stop(s),a}function ma(i,e,t,n,s,r,a){const o=bn(i,"sine",n,e,t),c=i.createGain();c.gain.setValueAtTime(0,e),c.gain.linearRampToValueAtTime(s,e+r),o.connect(c);for(const h of a)c.connect(h.detune)}function kp(i,e,t,n,s){const r=e.ch.get(t.inst),a=Lp(t.midi),o=t.vel;switch(t.inst){case"celesta":{const c=n+2.6,h=Ji(i,n,.004,o,.01,2.2);[[1,1],[2,.18],[4.02,.09]].forEach(([d,u])=>{const m=bn(i,"sine",a*d,n,c),p=i.createGain();p.gain.setValueAtTime(u,n),p.gain.setTargetAtTime(u*.15,n,d>1?.12:.9),m.connect(p).connect(h)}),h.connect(r);break}case"harp":{const c=n+2,h=Ji(i,n,.003,o,.01,1.6),d=i.createBiquadFilter();d.type="lowpass",d.frequency.setValueAtTime(Math.min(6e3,a*7),n),d.frequency.setTargetAtTime(a*2,n,.25),bn(i,"triangle",a,n,c).connect(d);const u=bn(i,"sine",a*2,n,c),m=i.createGain();m.gain.value=.25,u.connect(m).connect(d),d.connect(h).connect(r);break}case"pad":case"violin":case"bass":case"brass":{const c=t.inst==="violin",h=t.inst==="bass"?.5:c?.35:t.inst==="brass"?.6:.9,d=c?.9:1.2,u=n+s+d*1.5,m=Ji(i,n,h,o,s*.92,d),p=i.createBiquadFilter();p.type="lowpass",p.Q.value=.6;const y=t.inst==="brass"?700:t.inst==="bass"?500:c?2600:1500;p.frequency.setValueAtTime(y*.45,n),p.frequency.linearRampToValueAtTime(y*(.7+o*.5),n+h+s*.4),p.frequency.setTargetAtTime(y*.45,n+s,.5);const x=(t.inst==="bass"?[-5,5]:[-9,0,8]).map(g=>bn(i,"sawtooth",a,n,u,g));c?ma(i,n,u,5.4,14,.5,x):t.inst!=="bass"&&ma(i,n,u,4.6,5,.8,x);const _=i.createGain();_.gain.value=1/x.length;for(const g of x)g.connect(_);_.connect(p).connect(m).connect(r);break}case"spicc":{const c=n+.6,h=i.createGain();h.gain.setValueAtTime(0,n),h.gain.linearRampToValueAtTime(o,n+.012),h.gain.setTargetAtTime(0,n+.04,Math.min(.09,s*.25));const d=i.createBiquadFilter();d.type="lowpass",d.frequency.setValueAtTime(1400,n),d.frequency.setTargetAtTime(350,n,.06);const u=i.createGain();u.gain.value=.5;for(const m of[-6,6])bn(i,"sawtooth",a,n,c,m).connect(u);u.connect(d).connect(h).connect(r);break}case"horn":{const c=n+s+1.2,h=Ji(i,n,.09,o,s*.95,.5),d=i.createBiquadFilter();d.type="lowpass",d.Q.value=1.1,d.frequency.setValueAtTime(260,n),d.frequency.linearRampToValueAtTime(700+o*700,n+.18),d.frequency.setTargetAtTime(600+o*300,n+.3,.6);const u=bn(i,"sawtooth",a,n,c,-4),m=bn(i,"square",a,n,c,4);ma(i,n,c,4.8,6,.6,[u,m]);const p=i.createGain();p.gain.value=.45,u.connect(p),m.connect(p),p.connect(d).connect(h).connect(r);break}case"flute":{const c=n+s+1,h=Ji(i,n,.12,o,s*.9,.4),d=bn(i,"sine",a,n,c),u=bn(i,"triangle",a*2,n,c);ma(i,n,c,5,12,.4,[d,u]);const m=i.createGain();m.gain.value=.08,u.connect(m).connect(h);const p=i.createBuffer(1,Math.floor(i.sampleRate*(s+.5)),i.sampleRate),y=p.getChannelData(0);for(let T=0;T<y.length;T++)y[T]=Math.random()*2-1;const x=i.createBufferSource();x.buffer=p;const _=i.createBiquadFilter();_.type="bandpass",_.frequency.value=a*2,_.Q.value=4;const g=i.createGain();g.gain.value=.05,x.connect(_).connect(g).connect(h),x.start(n),x.stop(n+s+.5),d.connect(h),h.connect(r);break}case"bell":{const c=n+4.5,h=Ji(i,n,.005,o,.01,4),d=bn(i,"sine",a,n,c),u=bn(i,"sine",a*3.5,n,c),m=i.createGain();m.gain.setValueAtTime(a*2.2,n),m.gain.setTargetAtTime(a*.1,n,.5),u.connect(m).connect(d.frequency),d.connect(h).connect(r);break}case"timp":{const c=n+2.2,h=Ji(i,n,.004,o,.02,1.6),d=bn(i,"sine",a*1.04,n,c);d.frequency.setTargetAtTime(a,n,.05);const u=bn(i,"sine",a*1.5,n,c),m=i.createGain();m.gain.setValueAtTime(.25,n),m.gain.setTargetAtTime(0,n,.25),d.connect(h),u.connect(m).connect(h);const p=i.createBuffer(1,Math.floor(i.sampleRate*.15),i.sampleRate),y=p.getChannelData(0);for(let T=0;T<y.length;T++)y[T]=(Math.random()*2-1)*(1-T/y.length)**3;const x=i.createBufferSource();x.buffer=p;const _=i.createBiquadFilter();_.type="lowpass",_.frequency.value=900;const g=i.createGain();g.gain.value=.5,x.connect(_).connect(g).connect(h),x.start(n),h.connect(r);break}}}const Dd=i=>60/i.bpm,Fp=i=>i.bars*i.beatsPerBar*Dd(i);class Ld{constructor(e,t,n,s){this.ctx=e,this.song=n,this.t0=s,this.next=0,this.loop=0,this.dynLoopBar=0,this.timer=null,this.bus=Np(e,t),this.events=[...n.events].sort((r,a)=>r.beat-a.beat)}pump(e){const t=this.song,n=Fp(t),s=Dd(t);for(;;){const r=this.t0+this.loop*n;for(;this.dynLoopBar<t.bars&&r+this.dynLoopBar*t.beatsPerBar*s<e;){const a=r+this.dynLoopBar*t.beatsPerBar*s,o=t.dyn[this.dynLoopBar]*t.level;this.loop===0&&this.dynLoopBar===0?this.bus.dyn.gain.setValueAtTime(o,Math.max(a,this.ctx.currentTime)):this.bus.dyn.gain.linearRampToValueAtTime(o,a+t.beatsPerBar*s*.9),this.dynLoopBar++}for(;this.next<this.events.length;){const a=this.events[this.next],o=r+a.beat*s;if(o>=e)return;o>=this.ctx.currentTime-.02&&kp(this.ctx,this.bus,a,Math.max(o,this.ctx.currentTime),a.dur*s),this.next++}if(this.loop++,this.next=0,this.dynLoopBar=0,this.t0+this.loop*n>=e)return}}start(e){const t=()=>this.pump(e.currentTime+1.6);t(),this.timer=setInterval(t,250)}stop(e){setTimeout(()=>{this.timer&&clearInterval(this.timer);try{this.bus.fade.disconnect()}catch{}},e*1e3+200)}}let Ui=(()=>{try{return localStorage.getItem("oom-music")!=="0"}catch{return!0}})(),xi=null,Ts=null,Ni=null,jr=null;function Bp(i){jr=i}function ga(i,e=3,t=4){if(!jr)return;Ni??(Ni=jr());const{ctx:n}=Ni;if(n.state!=="running")return;const s=n.currentTime;if(xi){const a=xi.bus.fade.gain;a.cancelScheduledValues(s),a.setValueAtTime(a.value,s),a.linearRampToValueAtTime(0,s+e),xi.stop(e),xi=null}if(!i||!Ui)return;const r=new Ld(n,Ni.dest,Id[i],s+Math.min(1.2,e*.4));r.bus.fade.gain.setValueAtTime(0,s),r.bus.fade.gain.linearRampToValueAtTime(1,s+t),r.start(n),xi=r}const ti={play(i){Ts===i&&xi||(Ts=i,ga(i))},duck(i,e=2){if(!xi||!Ni)return;const t=xi.bus.fade.gain,n=Ni.ctx.currentTime;t.cancelScheduledValues(n),t.setValueAtTime(t.value,n),t.linearRampToValueAtTime(i,n+e)},isOn:()=>Ui,toggle(){Ui=!Ui;try{localStorage.setItem("oom-music",Ui?"1":"0")}catch{}return Ui&&Ts?ga(Ts,.5,2.5):ga(null,1.2),Ui},unlock(){if(!jr)return;Ni??(Ni=jr());const i=()=>{Ts&&!xi&&Ui&&ga(Ts,.1,3)};Ni.ctx.state==="running"?i():Ni.ctx.resume().then(i).catch(()=>{})}};async function zp(i,e,t=44100){const n=new OfflineAudioContext(2,Math.floor(e*t),t),s=new Ld(n,n.destination,Id[i],.05);s.bus.fade.gain.value=.5,s.pump(e);const r=await n.startRendering();return[r.getChannelData(0),r.getChannelData(1)]}let Zi=null,Vi=null,hs=(()=>{try{return localStorage.getItem("oom-muted")==="1"}catch{return!1}})();function Nl(){return Zi||(Zi=new AudioContext,Vi=Zi.createGain(),Vi.gain.value=hs?0:.5,Vi.connect(Zi.destination)),Zi.state==="suspended"&&Zi.resume(),Zi}Bp(()=>({ctx:Nl(),dest:Vi}));function Hp(){return hs}function Vp(){hs=!hs;try{localStorage.setItem("oom-muted",hs?"1":"0")}catch{}return Vi&&(Vi.gain.value=hs?0:.5),hs}function Ct(i,e,t="sine",n=.3,s,r=0){const a=Nl(),o=a.currentTime+r,c=a.createOscillator(),h=a.createGain();c.type=t,c.frequency.setValueAtTime(i,o),s&&c.frequency.exponentialRampToValueAtTime(s,o+e),h.gain.setValueAtTime(1e-4,o),h.gain.exponentialRampToValueAtTime(n,o+.01),h.gain.exponentialRampToValueAtTime(1e-4,o+e),c.connect(h).connect(Vi),c.start(o),c.stop(o+e+.05)}function As(i,e=.3,t=1200,n=0){const s=Nl(),r=s.currentTime+n,a=s.createBuffer(1,Math.floor(s.sampleRate*i),s.sampleRate),o=a.getChannelData(0);for(let u=0;u<o.length;u++)o[u]=(Math.random()*2-1)*(1-u/o.length);const c=s.createBufferSource();c.buffer=a;const h=s.createBiquadFilter();h.type="lowpass",h.frequency.value=t;const d=s.createGain();d.gain.value=e,c.connect(h).connect(d).connect(Vi),c.start(r)}const Je={click:()=>Ct(660,.06,"triangle",.15),hover:()=>Ct(1200,.03,"sine",.04),select:()=>{Ct(520,.08,"triangle",.18),Ct(780,.1,"triangle",.12,void 0,.05)},play:()=>{As(.25,.15,3e3),Ct(300,.25,"sine",.2,600)},summon:()=>{Ct(220,.3,"triangle",.25,440),Ct(330,.35,"sine",.15,660,.05)},spell:()=>{for(let i=0;i<4;i++)Ct(600+i*200,.15,"sine",.12,1200+i*200,i*.04)},move:()=>As(.12,.12,600),hit:()=>{As(.15,.35,1800),Ct(140,.15,"square",.12,70)},bigHit:()=>{As(.4,.5,900),Ct(90,.5,"sawtooth",.25,40)},death:()=>{Ct(300,.5,"sawtooth",.15,60),As(.3,.2,500)},heal:()=>{Ct(660,.2,"sine",.15,990),Ct(880,.25,"sine",.1,1320,.08)},barrier:()=>Ct(1500,.3,"triangle",.15,700),freeze:()=>{for(let i=0;i<3;i++)Ct(2e3-i*300,.12,"sine",.08,void 0,i*.05)},buff:()=>Ct(440,.2,"triangle",.15,880),pass:()=>Ct(330,.12,"triangle",.15,250),yourTurn:()=>{Ct(523,.15,"sine",.2),Ct(784,.25,"sine",.2,void 0,.1)},round:()=>{Ct(392,.3,"triangle",.2),Ct(523,.3,"triangle",.2,void 0,.12),Ct(659,.4,"triangle",.2,void 0,.24)},orb:()=>{Ct(880,.6,"sine",.15,440),Ct(1320,.5,"sine",.08,660)},victory:()=>[523,659,784,1046].forEach((i,e)=>Ct(i,.5,"triangle",.25,void 0,e*.15)),defeat:()=>[392,349,311,262].forEach((i,e)=>Ct(i,.6,"sawtooth",.12,void 0,e*.2)),levelUp:()=>{[392,523,659,784,1046].forEach((i,e)=>Ct(i,.35,"triangle",.2,void 0,e*.07)),As(.6,.15,4e3,.3)},error:()=>Ct(160,.15,"square",.1),emote:()=>Ct(990,.1,"sine",.12,1320)},ot=i=>i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Gp=["Arrival","Last Breath","Freeze","Root","Barrier","Swift","Ready","Sacrifice","Drain","Siege","Flying","Guardian","Deadly","Regenerate"];function Wp(i){let e=ot(i);for(const t of Gp)e=e.replace(new RegExp(`\\b(${t})\\b`,"g"),"<b>$1</b>");return e}function $p(i){return i.map(e=>`<span class="kw" title="${ot(_s[e].text)}">${_s[e].icon} ${_s[e].name}</span>`).join(" ")}function Sn(i,e={}){const t=vn[i.color],n=e.cost??i.cost,s=n<i.cost?"cheaper":n>i.cost?"pricier":"",r=(e.unit?e.unit.kw:i.kw)??[],a=!!(i.champion||i.levelOf),o=a?i.levelOf?"★★ Champion":"★ Champion":i.type==="unit"?"Unit":i.type==="spell"?"Spell":"Order";let c="";if(i.type==="unit"){const h=e.unit?e.unit.atk+e.unit.tempAtk:i.atk,d=e.unit?e.unit.hp:i.hp,u=h>i.atk?"up":h<i.atk?"down":"",m=e.unit&&d<e.unit.maxHp?"down":d>i.hp?"up":"",p=i.speed??2,y=i.range??1;c=`<div class="stats">
      <span class="atk ${u}">${h}</span>
      <span class="mini">${p!==2?`<i title="Speed">👣${p}</i>`:""}${y>1?`<i title="Range">🎯${y}</i>`:""}</span>
      <span class="hp ${m}">${d}</span></div>`}return`<div class="card ${i.color} ${i.type} ${a?"champion":""} ${e.extraClass??""}" style="--col:${t.hex}" ${e.iid!==void 0?`data-iid="${e.iid}"`:""}>
    <div class="cost ${s}">${n}</div>
    <div class="art"><span>${i.icon}</span></div>
    <div class="name">${ot(i.name)}</div>
    <div class="type">${o} · ${t.name}${i.token&&!i.levelOf?" · Token":""}</div>
    <div class="text">${r.length?`<div class="kws">${$p(r)}</div>`:""}${Wp(i.text)}${!i.text&&!r.length&&i.flavor?`<i class="flavor">${ot(i.flavor)}</i>`:""}</div>
    ${c}
  </div>`}function Xp(){return'<div class="card back"><div class="back-orb"></div></div>'}function qp(i){return i.map(e=>`<div class="kwhelp"><b>${_s[e].icon} ${_s[e].name}</b> ${ot(_s[e].text)}</div>`).join("")}const jp=[[/\bArrival\b/,"✨ Arrival","Happens when you play this unit from your hand."],[/\bLast Breath\b/,"🕯️ Last Breath","Happens when this unit dies."],[/\bFreeze\b/,"❄️ Freeze","The unit loses its next order (this round if it hasn't acted yet, otherwise next round)."],[/\bRoot\b/,"🕸️ Root","The unit can't move, but can still attack."],[/\bReady\b/,"🔁 Ready","The unit can be ordered again this round, even if it already acted or was just summoned."],[/\b[Ss]acrifice\b/,"🩸 Sacrifice","Destroy one of your own units."],[/\bReturn\b.*\bhand\b/,"🌊 Return","Send the unit back to its owner's hand. Damage and buffs are lost."],[/empty mana crystal/,"💎 Empty mana crystal","Raises your max mana by 1 (up to 10). It refills next round."],[/\bLevel up\b/,"⭐ Level up","When the condition is met while this champion is on the board, it transforms into its stronger form and fully heals."]];function kc(i,e=i.kw??[]){const t=jp.filter(([s])=>s.test(i.text)).map(([,s,r])=>`<div class="kwhelp"><b>${s}</b> ${ot(r)}</div>`).join(""),n=[];return(i.range??1)>1&&n.push(`<div class="kwhelp"><b>🏹 Ranged ${i.range}</b> Attacks units up to ${i.range} hexes away. Melee units can't strike back.</div>`),i.speed&&i.speed!==2&&n.push(`<div class="kwhelp"><b>👣 Speed ${i.speed}</b> Moves up to ${i.speed} hexes per order (normal is 2).</div>`),i.type==="order"&&n.push('<div class="kwhelp"><b>📜 Order</b> Like a spell, but it commands your units. Can be paid with spell mana.</div>'),qp(e)+n.join("")+t}function Yp(i,e){const t=document.createElement("div");t.className="hover-card floating",document.body.appendChild(t);let n=null;const s=a=>{const o=a.dataset.id;if(!o)return;n=a;const c=Ye(o),h=c.champion?Sn(Ye(c.champion.to),{extraClass:"big"}):"";t.innerHTML=`<div class="hc-row">${Sn(c,{extraClass:"big"})}${h}</div><div class="hc-help">${kc(c)}</div>`,t.classList.add("show");const d=a.getBoundingClientRect(),u=t.offsetWidth,m=t.offsetHeight,p=d.right+12+u<=innerWidth?d.right+12:Math.max(8,d.left-12-u);t.style.left=`${p}px`,t.style.top=`${Math.min(Math.max(8,d.top+d.height/2-m/2),innerHeight-m-8)}px`},r=()=>{n=null,t.classList.remove("show")};return i.addEventListener("mouseover",a=>{const o=a.target.closest(e);o&&o!==n&&i.contains(o)?s(o):o||r()}),i.addEventListener("mouseleave",r),i.addEventListener("click",()=>requestAnimationFrame(()=>{n&&!n.isConnected&&r()})),()=>t.remove()}const Od="oom-custom-decks";function kl(){try{const i=JSON.parse(localStorage.getItem(Od)??"[]");return Array.isArray(i)?i.filter(e=>e&&e.id&&Array.isArray(e.cards)):[]}catch{return[]}}function Ud(i){try{localStorage.setItem(Od,JSON.stringify(i))}catch{}}function Kp(i){const e=kl().filter(t=>t.id!==i.id);e.push(i),Ud(e)}function Jp(i){Ud(kl().filter(e=>e.id!==i))}function Fl(){const i=kn.map(t=>({id:t.id,name:t.name,archetype:t.archetype,colors:t.colors,icon:Ye(t.signature).icon,cards:t.cards,custom:!1,blurb:t.blurb,howToPlay:t.howToPlay})),e=kl().map(t=>({id:t.id,name:t.name,archetype:"Custom",colors:Xr(t.cards),icon:Rd(t.cards),cards:t.cards,custom:!0,blurb:"Your own creation.",howToPlay:"Build it, battle with it, tweak it, repeat."}));return[...i,...e]}function Bl(i){const e=Fl();return e.find(t=>t.id===i)??e[0]}function Nd(i){const e=Bl(i);return e.custom?{customDeck:{id:e.id,name:e.name,cards:e.cards}}:{deckId:e.id}}const Zp=["ember","tide","grove","dawn","dusk"];function bh(i,e,t){const n=e?structuredClone(e):{id:`custom_${Date.now()}`,name:"My Deck",cards:[]};let s="all",r=-1,a="";const o=document.createElement("div");o.className="builder",i.appendChild(o);const c=Yp(o,".b-card, .b-row"),h=x=>{c(),o.remove(),t(x)},d=x=>{var _;return((_=n.cards.find(([g])=>g===x))==null?void 0:_[1])??0};function u(x){const _=Ye(x);if(yh(n.cards)>=Qs)return p(`Decks hold exactly ${Qs} cards.`);if(d(x)>=Fr)return p(`Max ${Fr} copies per card.`);const g=Xr(n.cards);if(!g.includes(_.color)&&g.length>=ls)return p(`Decks can use at most ${ls} colors.`);const T=n.cards.find(([C])=>C===x);T?T[1]++:n.cards.push([x,1]),Je.click(),y()}function m(x){const _=n.cards.find(([g])=>g===x);_&&(_[1]--,_[1]<=0&&(n.cards=n.cards.filter(([g])=>g!==x)),Je.pass(),y())}function p(x){Je.error();const _=o.querySelector(".b-msg");_.textContent=x,_.classList.remove("flash"),_.offsetWidth,_.classList.add("flash")}function y(){const x=Xr(n.cards),_=Ad.filter(P=>!P.token).filter(P=>s==="all"||P.color===s).filter(P=>r<0||(r>=7?P.cost>=7:P.cost===r)).filter(P=>!a||(P.name+" "+P.text+" "+(P.kw??[]).join(" ")).toLowerCase().includes(a)).sort((P,E)=>P.cost-E.cost||P.name.localeCompare(E.name)),g=yh(n.cards),T=Array.from({length:8},(P,E)=>n.cards.reduce((A,[B,Z])=>A+(Math.min(7,Ye(B).cost)===E?Z:0),0)),C=Math.max(4,...T),S={unit:0,spell:0,order:0};for(const[P,E]of n.cards)S[Ye(P).type]+=E;const U=co(n.cards),O=[...n.cards].sort((P,E)=>Ye(P[0]).cost-Ye(E[0]).cost||Ye(P[0]).name.localeCompare(Ye(E[0]).name));o.innerHTML=`
      <div class="panel b-pool">
        <div class="b-filters">
          <button class="btn small ${s==="all"?"":"ghost"}" data-color="all">All</button>
          ${Zp.map(P=>`<button class="btn small ${s===P?"":"ghost"} ${x.length>=ls&&!x.includes(P)?"locked":""}" data-color="${P}"><i class="dot" style="--c:${vn[P].hex}"></i> ${vn[P].name}</button>`).join("")}
          <span class="b-costs">${[-1,0,1,2,3,4,5,6,7].map(P=>`<button class="cost-btn ${r===P?"on":""}" data-cost="${P}">${P<0?"Any":P>=7?"7+":P}</button>`).join("")}</span>
          <input class="b-search" placeholder="Search name or text…" value="${ot(a)}">
        </div>
        <div class="b-hint dim">Click a card to add it. Right-click (or click its row on the right) to remove. ${Fr} copies max, ${ls} colors max.</div>
        <div class="b-grid">${_.map(P=>{const E=d(P.id);return`<div class="b-card ${!x.includes(P.color)&&x.length>=ls?"blocked":""} ${E?"in":""}" data-id="${P.id}">${Sn(P)}${E?`<span class="count">×${E}</span>`:""}</div>`}).join("")}</div>
      </div>
      <div class="panel b-deck">
        <input class="b-name" maxlength="30" value="${ot(n.name)}">
        <div class="b-summary">
          <span class="b-total ${g===Qs?"ok":""}">${g}/${Qs}</span>
          <span>${x.map(P=>`<i class="dot" style="--c:${vn[P].hex}"></i>`).join(" ")}</span>
          <span class="dim">${S.unit} units · ${S.spell} spells · ${S.order} orders</span>
        </div>
        <div class="b-curve">${T.map((P,E)=>`<div class="bar"><div class="fill" style="height:${P/C*100}%"></div><span>${P||""}</span><b>${E>=7?"7+":E}</b></div>`).join("")}</div>
        <div class="b-list">${O.map(([P,E])=>{const A=Ye(P);return`<div class="b-row" data-id="${P}" style="--col:${vn[A.color].hex}"><span class="c">${A.cost}</span><span class="nm">${A.icon} ${ot(A.name)}</span><span class="n">×${E}</span></div>`}).join("")||'<p class="dim">Your deck is empty. Click cards on the left to add them, or start from a prebuilt deck below.</p>'}</div>
        <div class="b-msg"></div>
        <div class="b-actions">
          <select class="b-template"><option value="">Start from a prebuilt deck…</option>${kn.map(P=>`<option value="${P.id}">${ot(P.name)} (${P.archetype})</option>`).join("")}</select>
          <div class="row">
            <button class="btn ghost small b-clear">Clear</button>
            <button class="btn ghost b-cancel">Cancel</button>
            <button class="btn b-save" ${U?"disabled":""} title="${ot(U??"Save deck")}">Save Deck</button>
          </div>
          ${U&&g>0?`<div class="dim small-note">${ot(U)}</div>`:""}
        </div>
      </div>`,o.querySelectorAll("[data-color]").forEach(P=>P.onclick=()=>{s=P.dataset.color,y()}),o.querySelectorAll("[data-cost]").forEach(P=>P.onclick=()=>{r=Number(P.dataset.cost),y()});const N=o.querySelector(".b-search");N.oninput=()=>{a=N.value.toLowerCase();const P=N.selectionStart;y();const E=o.querySelector(".b-search");E.focus(),E.setSelectionRange(P,P)},o.querySelectorAll(".b-card").forEach(P=>{P.onclick=()=>u(P.dataset.id),P.oncontextmenu=E=>{E.preventDefault(),m(P.dataset.id)}}),o.querySelectorAll(".b-row").forEach(P=>{P.onclick=()=>m(P.dataset.id),P.oncontextmenu=E=>{E.preventDefault(),u(P.dataset.id)}}),o.querySelector(".b-name").oninput=P=>{n.name=P.target.value||"My Deck"},o.querySelector(".b-template").onchange=P=>{const E=kn.find(A=>A.id===P.target.value);E&&(n.cards=E.cards.map(([A,B])=>[A,B]),n.name=`${E.name} Remix`,Je.select(),y())},o.querySelector(".b-clear").onclick=()=>{n.cards=[],y()},o.querySelector(".b-cancel").onclick=()=>h(null),o.querySelector(".b-save").onclick=()=>{co(n.cards)||(Kp(n),Je.select(),h(n.id))}}y()}const Sh=20,Mh=10,kd=3,wh=10,Qp=4;function Eh(i,e){for(let t=i.length-1;t>0;t--){const n=Math.floor(e()*(t+1));[i[t],i[n]]=[i[n],i[t]]}return i}const em=i=>!!i&&"uid"in i;class Th extends Error{}class ir{constructor(e){this.events=[],this.s=e}static create(e,t,n=Math.random()*2**31|0){const s={round:0,phase:"mulligan",turn:0,initiative:0,passes:0,players:[],units:[],nextId:1,winner:null,seed:n,log:[],lastPlayed:null},r=new ir(s);for(const a of[e,t]){let o=typeof a.deck=="string"?qr(a.deck):a.deck;co(o.cards)&&(o=qr(""));const c=[];for(const[d,u]of o.cards)for(let m=0;m<u;m++)c.push(d);const h={name:a.name,deckId:o.id,deckName:o.name,deckColors:Xr(o.cards),deckIcon:Rd(o.cards),deck:Eh(c,()=>r.rand()),hand:[],mana:0,maxMana:0,spellMana:0,sanctum:Sh,fatigue:0,mulliganDone:!1,graveyard:[],isAI:a.isAI,spellsCast:0,sanctumDamageDealt:0,alliesLost:0};s.players.push(h)}s.initiative=r.rand()<.5?0:1,s.turn=s.initiative;for(let a=0;a<2;a++)r.draw(a,Qp,!0);return r.events=[],r}clone(){return new ir(structuredClone(this.s))}rand(){let e=this.s.seed=this.s.seed+1831565813|0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}pick(e){return e[Math.floor(this.rand()*e.length)]}unit(e){return this.s.units.find(t=>t.uid===e)}unitAt(e){return this.s.units.find(t=>t.c===e.c&&t.r===e.r&&t.hp>0)}isEmpty(e){return wd(e)&&!this.unitAt(e)}unitsOf(e){return this.s.units.filter(t=>t.owner===e&&t.hp>0)}adjacentUnits(e){return Uo(e).map(t=>this.unitAt(t)).filter(t=>!!t)}power(e){return Math.max(0,e.atk+e.tempAtk)}has(e,t){return e.kw.includes(t)}tUnit(e){return em(e)?this.unit(e.uid):void 0}isRooted(e){return e.rootedUntil>=this.s.round}isFrozen(e){return e.frozenUntil>=this.s.round}canAct(e){return e.hp>0&&!e.exhausted&&(e.summonedRound!==this.s.round||this.has(e,"swift"))}isDeployHex(e,t){return vs(e).includes(t.r)&&this.isEmpty(t)}emptyDeployHexes(e){return $r.filter(t=>this.isDeployHex(e,t))}randomEmptyNeighbor(e){const t=Uo(e).filter(n=>this.isEmpty(n));return t.length?this.pick(t):void 0}cost(e,t){const n=Ye(t.cardId);let s=n.cost+t.costMod;if(n.type!=="unit")for(const r of this.unitsOf(e))s-=Ye(r.cardId).spellDiscount??0;return Math.max(0,s)}canAfford(e,t){const n=this.s.players[e],s=this.cost(e,t);return Ye(t.cardId).type==="unit"?n.mana>=s:n.mana+n.spellMana>=s}specs(e){var r;const t=e.targets??[];if(e.type!=="unit")return t;const n=(r=e.kw)==null?void 0:r.includes("infiltrate");return[{kind:"hex",prompt:n?"Summon anywhere in your half":"Choose a hex in your deployment zone",hexFilter:n?(a,o,c)=>Ap(c).includes(o.r):(a,o,c)=>vs(c).includes(o.r)},...t]}candidates(e,t,n,s){const r=this.specs(t)[s];return r.kind==="hex"?$r.filter(a=>this.isEmpty(a)&&(!r.hexFilter||r.hexFilter(this,a,e,n))).map(a=>({c:a.c,r:a.r})):this.s.units.filter(a=>a.hp>0).filter(a=>r.side==="any"||!r.side||(r.side==="friendly"?a.owner===e:a.owner!==e)).filter(a=>!r.filter||r.filter(this,a,e,n)).map(a=>({uid:a.uid}))}validTarget(e,t,n,s,r){const a=this.specs(t)[s];return r===null?!!a.optional:this.candidates(e,t,n,s).some(o=>JSON.stringify(o)===JSON.stringify(r))}playable(e,t){if(this.s.phase!=="action"||this.s.turn!==e||!this.canAfford(e,t))return!1;const n=Ye(t.cardId),s=this.specs(n);if(s.length===0)return!0;const r=this.candidates(e,n,[],0);return r.length===0&&!s[0].optional?!1:s.length>1&&!s[1].optional&&n.type!=="unit"?r.some(a=>this.candidates(e,n,[a],1).length>0):!0}reachable(e){const t=new Map;if(this.isRooted(e))return t;const n=this.has(e,"flying"),s=c=>!n&&this.adjacentUnits(c).some(h=>h.owner!==e.owner&&this.has(h,"guardian")),r={c:e.c,r:e.r},a=new Map([[rn(r),[r]]]);let o=[r];for(let c=0;c<e.speed;c++){const h=[];for(const d of o)if(!(c>0&&s(d)))for(const u of Uo(d)){const m=rn(u);if(a.has(m))continue;const p=this.unitAt(u);p&&p.owner!==e.owner&&!n||(a.set(m,[...a.get(rn(d)),u]),h.push(u))}o=h}for(const[c,h]of a){const d=h[h.length-1];h.length>1&&this.isEmpty(d)&&t.set(c,h)}return t}attackTargets(e,t){if(this.power(e)<=0)return[];const n=this.s.units.filter(s=>s.owner!==e.owner&&s.hp>0&&jn(t,s)<=e.range).map(s=>({uid:s.uid}));return oo(e.owner,e.range,t)&&n.push({sanctum:1-e.owner}),n}act(e,t){this.events=[];try{return this.doAct(e,t)}catch(n){if(n instanceof Th)return{ok:!0,events:this.events};throw n}}doAct(e,t){var s,r,a;const n=this.s;if(n.phase==="over")return{ok:!1,error:"The game is over."};if(t.type==="concede")return this.log(e,`${n.players[e].name} conceded.`),this.endGame(1-e),{ok:!0,events:this.events};if(n.phase==="mulligan"){if(t.type!=="mulligan")return{ok:!1,error:"Choose cards to replace first."};const o=n.players[e];if(o.mulliganDone)return{ok:!1,error:"Already done."};const c=o.hand.filter(d=>t.iids.includes(d.iid));o.hand=o.hand.filter(d=>!t.iids.includes(d.iid));const h=c.length;this.draw(e,h,!0);for(const d of c)o.deck.push(d.cardId);return Eh(o.deck,()=>this.rand()),o.mulliganDone=!0,n.players.every(d=>d.mulliganDone)&&this.startRound(),{ok:!0,events:this.events}}if(t.type==="mulligan")return{ok:!1,error:"Not mulligan time."};if(n.turn!==e)return{ok:!1,error:"It's not your action."};if(t.type==="pass")return n.passes++,this.emit({t:"pass",p:e}),n.passes>=2?this.endRound():n.turn=1-e,{ok:!0,events:this.events};if(t.type==="play"){const o=n.players[e],c=o.hand.find(p=>p.iid===t.iid);if(!c)return{ok:!1,error:"Card not in hand."};if(!this.playable(e,c))return{ok:!1,error:"You can't play that now."};const h=Ye(c.cardId),d=this.specs(h),u=t.targets??[];if(u.length!==d.length)return{ok:!1,error:"Wrong number of targets."};for(let p=0;p<d.length;p++)if(!this.validTarget(e,h,u.slice(0,p),p,u[p]))return{ok:!1,error:"Invalid target."};let m=this.cost(e,c);if(h.type!=="unit"){const p=Math.min(o.spellMana,m);o.spellMana-=p,m-=p}if(o.mana-=m,o.hand=o.hand.filter(p=>p!==c),n.lastPlayed={player:e,cardId:h.id},this.emit({t:"play",p:e,cardId:h.id,targets:u}),h.type==="unit"){const p=u[0],y=this.summon(h.id,e,p);this.log(e,`${o.name} summoned {{${h.id}}}.`),y&&h.onPlay&&h.onPlay(this,{p:e,targets:u.slice(1),self:y})}else{this.log(e,`${o.name} played {{${h.id}}}.`),o.spellsCast++,(s=h.onPlay)==null||s.call(h,this,{p:e,targets:u});for(const p of this.unitsOf(e))(a=(r=Ye(p.cardId)).onSpellCast)==null||a.call(r,this,p,h.id)}return this.resolveDeaths(),this.afterAction(e),{ok:!0,events:this.events}}if(t.type==="order"){const o=this.unit(t.uid);if(!o||o.owner!==e)return{ok:!1,error:"Not your unit."};if(!this.canAct(o))return{ok:!1,error:"That unit cannot act right now."};if(!t.to&&!t.attack)return{ok:!1,error:"Nothing to do."};let c={c:o.c,r:o.r},h;if(t.to&&!ro(t.to,c)){if(h=this.reachable(o).get(rn(t.to)),!h)return{ok:!1,error:"Can't move there."};c=t.to}if(t.attack&&!this.attackTargets(o,c).some(u=>JSON.stringify(u)===JSON.stringify(t.attack)))return{ok:!1,error:"Can't attack that from there."};h&&(o.c=c.c,o.r=c.r,this.emit({t:"move",uid:o.uid,path:h})),o.exhausted=!0;const d=`${n.players[e].name}'s {{${o.cardId}}}`;if(t.attack?"sanctum"in t.attack?this.log(e,`${d} attacked the enemy Sanctum.`):this.log(e,`${d} attacked {{${this.unit(t.attack.uid).cardId}}}.`):this.log(e,`${d} moved.`),t.attack)if("sanctum"in t.attack)this.attackSanctum(o,t.attack.sanctum);else{const u=this.unit(t.attack.uid);this.combat(o,u)}return this.resolveDeaths(),this.afterAction(e),{ok:!0,events:this.events}}return{ok:!1,error:"Unknown action."}}checkLevelUps(){for(const e of this.s.units){const t=Ye(e.cardId);if(!t.champion||e.hp<=0)continue;const[n,s]=t.champion.progress(this,e);if(n<s)continue;const r=Ye(t.champion.to),a=e.atk-(t.atk??0),o=e.maxHp-(t.hp??0);e.cardId=r.id,e.atk=(r.atk??0)+a,e.maxHp=(r.hp??1)+o,e.hp=e.maxHp,e.speed=r.speed??2,e.range=r.range??1;for(const c of r.kw??[])e.kw.includes(c)||e.kw.push(c);this.emit({t:"levelUp",uid:e.uid,unit:structuredClone(e)}),this.log(e.owner,`{{${t.id}}} leveled up into {{${r.id}}}!`)}}afterAction(e){this.checkLevelUps(),this.s.phase==="action"&&(this.s.passes=0,this.s.turn=1-e)}startRound(){var t,n;const e=this.s;e.phase="action",e.round++,e.round>1&&(e.initiative=1-e.initiative),e.turn=e.initiative,e.passes=0,this.emit({t:"round",round:e.round,initiative:e.initiative});for(const s of e.players)s.maxMana=Math.min(Mh,s.maxMana+1),s.mana=s.maxMana;for(const s of e.units)s.exhausted=this.isFrozen(s);this.draw(e.initiative,1),this.draw(1-e.initiative,1);for(const s of sa){const r=this.unitAt(s);r&&(e.players[r.owner].mana+=1,this.emit({t:"orbPulse",p:r.owner,orb:s}),this.damageSanctum(1-r.owner,1,null))}for(const s of[...e.units])s.hp>0&&((n=(t=Ye(s.cardId)).onRoundStart)==null||n.call(t,this,s));this.resolveDeaths(),this.checkLevelUps(),e.phase==="action"&&this.log(-1,`Round ${e.round} begins. ${e.players[e.initiative].name} has the initiative.`)}endRound(){var t,n;const e=this.s;for(const s of e.players)s.spellMana=Math.min(kd,s.spellMana+s.mana),s.mana=0;for(const s of[...e.units])s.hp>0&&((n=(t=Ye(s.cardId)).onRoundEnd)==null||n.call(t,this,s));for(const s of e.units)if(s.tempAtk=0,this.has(s,"regenerate")&&s.hp>0&&s.hp<s.maxHp){const r=s.maxHp-s.hp;s.hp=s.maxHp,this.emit({t:"heal",uid:s.uid,amount:r})}this.resolveDeaths(),e.phase==="action"&&this.startRound()}combat(e,t){var r,a;const n=jn(e,t);this.emit({t:"attack",uid:e.uid,target:{uid:t.uid},ranged:n>1});const s=t.range>=n;this.exchange(e,t,s),(a=(r=Ye(t.cardId)).onAttacked)==null||a.call(r,this,t,e)}fight(e,t){this.emit({t:"attack",uid:e.uid,target:{uid:t.uid},ranged:!1}),this.exchange(e,t,!0)}exchange(e,t,n){const s=this.has(e,"firstStrike"),r=this.has(t,"firstStrike");if(s&&!r)this.dealDamage(t,this.power(e),e),n&&t.hp>0&&this.dealDamage(e,this.power(t),t);else if(r&&!s&&n)this.dealDamage(e,this.power(t),t),e.hp>0&&this.dealDamage(t,this.power(e),e);else{const a=this.power(e),o=this.power(t);this.dealDamage(t,a,e),n&&this.dealDamage(e,o,t)}}attackSanctum(e,t){this.emit({t:"attack",uid:e.uid,target:{sanctum:t},ranged:!1});const n=this.power(e)*(this.has(e,"siege")?2:1);this.damageSanctum(t,n,e)}dealDamage(e,t,n,s){var r,a;return t<=0||e.hp<=0?0:(s&&this.fx(s,e),this.has(e,"barrier")?(e.kw=e.kw.filter(o=>o!=="barrier"),this.emit({t:"barrier",uid:e.uid}),0):(e.hp-=t,this.emit({t:"damage",uid:e.uid,amount:t}),n&&this.has(n,"deadly")&&e.hp>0&&(e.hp=0,this.fx("poison",e)),n&&this.has(n,"drain")&&this.healSanctum(n.owner,t),e.hp>0&&((a=(r=Ye(e.cardId)).onDamaged)==null||a.call(r,this,e,t)),t))}damageSanctum(e,t,n=null){t<=0||this.s.phase==="over"||(this.s.players[e].sanctum-=t,this.s.players[1-e].sanctumDamageDealt+=t,this.emit({t:"sanctumDamage",p:e,amount:t}),n&&this.has(n,"drain")&&this.healSanctum(n.owner,t),this.checkWin())}healSanctum(e,t){const n=this.s.players[e],s=Math.min(t,Sh-n.sanctum);s<=0||(n.sanctum+=s,this.emit({t:"sanctumHeal",p:e,amount:s}))}heal(e,t){const n=Math.min(t,e.maxHp-e.hp);n<=0||(e.hp+=n,this.emit({t:"heal",uid:e.uid,amount:n}))}buff(e,t,n){e.atk+=t,e.hp+=n,e.maxHp+=n,this.emit({t:"buff",uid:e.uid,atk:t,hp:n})}tempBuff(e,t){e.tempAtk+=t,this.emit({t:"buff",uid:e.uid,atk:t,hp:0})}giveKw(e,t){e.kw.includes(t)||e.kw.push(t),this.emit({t:"buff",uid:e.uid,atk:0,hp:0})}destroy(e){e.hp>0&&(e.hp=0)}freeze(e){e.frozenUntil=this.canAct(e)?this.s.round:this.s.round+1,e.exhausted=!0,this.emit({t:"freeze",uid:e.uid}),this.log(e.owner,`{{${e.cardId}}} was Frozen.`)}root(e,t){e.rootedUntil=Math.max(e.rootedUntil,this.s.round+t-1),this.fx("roots",e)}ready(e){e.exhausted=!1,e.frozenUntil=0,e.summonedRound===this.s.round&&(e.summonedRound=-1),this.emit({t:"ready",uid:e.uid})}bounce(e){this.s.units=this.s.units.filter(n=>n!==e),this.emit({t:"bounce",uid:e.uid});const t=Ye(e.cardId);t.levelOf?this.addToHand(e.owner,t.levelOf,0):t.token||this.addToHand(e.owner,e.cardId,0)}teleport(e,t){this.isEmpty(t)&&(e.c=t.c,e.r=t.r,this.emit({t:"teleport",uid:e.uid,to:t}))}summon(e,t,n){var a,o;if(!this.isEmpty(n))return null;const s=Ye(e),r={uid:this.s.nextId++,cardId:e,owner:t,c:n.c,r:n.r,atk:s.atk??0,hp:s.hp??1,maxHp:s.hp??1,speed:s.speed??2,range:s.range??1,kw:[...s.kw??[]],exhausted:!1,summonedRound:this.s.round,frozenUntil:0,rootedUntil:0,tempAtk:0};this.s.units.push(r),this.emit({t:"summon",uid:r.uid,unit:structuredClone(r)});for(const c of this.unitsOf(t))c!==r&&((o=(a=Ye(c.cardId)).onFriendlySummon)==null||o.call(a,this,c,r));return r}summonInDeploy(e,t,n){for(let s=0;s<n;s++){const r=this.emptyDeployHexes(t);if(!r.length)return;const a=r.filter(o=>o.r===vs(t)[t===0?1:0]);this.summon(e,t,this.pick(a.length?a:r))}}draw(e,t,n=!1){const s=this.s.players[e];for(let r=0;r<t;r++){const a=s.deck.pop();if(!a){s.fatigue++,this.log(e,`${s.name} has no cards left and takes ${s.fatigue} fatigue damage.`),this.damageSanctum(e,s.fatigue);continue}if(s.hand.length>=wh){n||this.emit({t:"draw",p:e,burned:a});continue}s.hand.push({iid:this.s.nextId++,cardId:a,costMod:0}),n||this.emit({t:"draw",p:e})}}addToHand(e,t,n){const s=this.s.players[e];s.hand.length>=wh||(s.hand.push({iid:this.s.nextId++,cardId:t,costMod:n}),this.emit({t:"draw",p:e}))}gainMaxMana(e,t){const n=this.s.players[e];n.maxMana=Math.min(Mh,n.maxMana+t),this.emit({t:"mana",p:e})}fx(e,t,n={}){this.emit({t:"fx",kind:e,at:t?{c:t.c,r:t.r}:null,...n})}resolveDeaths(){var e,t,n;for(let s=0;s<50;s++){const r=this.s.units.filter(a=>a.hp<=0);if(!r.length)break;this.s.units=this.s.units.filter(a=>a.hp>0);for(const a of r){this.emit({t:"death",uid:a.uid});const o=Ye(a.cardId);this.log(a.owner,`${this.s.players[a.owner].name}'s {{${a.cardId}}} died.`),!o.token&&!o.levelOf&&this.s.players[a.owner].graveyard.push(a.cardId),o.levelOf&&this.s.players[a.owner].graveyard.push(o.levelOf),this.s.players[a.owner].alliesLost++,(e=o.onDeath)==null||e.call(o,this,a);for(const c of[...this.s.units])c.hp>0&&((n=(t=Ye(c.cardId)).onUnitDeath)==null||n.call(t,this,c,a))}}this.checkWin()}checkWin(){if(this.s.phase==="over")return;const[e,t]=this.s.players.map(n=>n.sanctum<=0);e&&t?this.endGame(-1):e?this.endGame(1):t&&this.endGame(0)}endGame(e){throw this.s.phase="over",this.s.winner=e,this.emit({t:"gameOver",winner:e}),this.log(-1,e===-1?"The game is a draw!":`${this.s.players[e].name} wins!`),new Th}log(e,t){this.s.log.push({p:e,text:t,round:this.s.round}),this.s.log.length>150&&this.s.log.shift()}emit(e){this.events.push(e)}}function tm(i,e){const t=structuredClone(i);return t.seed=0,t.players.forEach((n,s)=>{n.deck=n.deck.map(()=>"?"),s!==e&&(n.hand=n.hand.map(r=>({iid:r.iid,cardId:"?",costMod:0})))}),t}function nm(i,e){return i.map(t=>t.t==="draw"&&t.p!==e&&t.burned?{...t,burned:t.burned}:t)}const ht=(i,e)=>i.querySelector(e);class im{constructor(e,t,n,s,r){this.room=e,this.scene=t,this.onExit=s,this.currentDeckId=r,this.seat=0,this.view=null,this.queue=[],this.animating=!1,this.mode={kind:"idle"},this.deadline=0,this.connected=[!0,!0],this.emotes=[],this.vsAI=!1,this.roomId="",this.hoverHex=null,this.hoverSanctum=null,this.mulliganPick=new Set,this.mullOld=null,this.mullReplaced=new Set,this.mullSent=!1,this.mullRevealTimer=null,this.disposed=!1,this.rematchSent=!1,this.seenCards=new Set,this.previewCard=null,this.keyHandler=()=>{},this.wheelHandler=a=>{var y,x;const o=this.root.querySelector(".hover-card.show"),c=a.target;if(!o||(y=c==null?void 0:c.closest)!=null&&y.call(c,".modal, .emote-list")||(x=c==null?void 0:c.closest)!=null&&x.call(c,".log")&&!c.closest(".logcard"))return;const h=[...o.querySelectorAll(".card.big .text")].filter(_=>_.scrollHeight>_.clientHeight+1),d=o.querySelector(".hc-help"),u=a.deltaMode===1?a.deltaY*16:a.deltaY,m=_=>u>0?_.scrollTop+_.clientHeight<_.scrollHeight-1:_.scrollTop>0,p=h.some(m)?h:d&&m(d)?[d]:[];if(p.length){a.preventDefault();for(const _ of p)_.scrollTop+=u*.5;this.markOverflow(o)}},this.canActUnit=a=>!!this.view&&this.view.phase==="action"&&this.g.canAct(a),this.root=document.createElement("div"),this.root.className="game",n.innerHTML="",n.appendChild(this.root),this.root.innerHTML=`
      <div class="pinfo opp"></div>
      <div class="opp-hand"></div>
      <div class="corner-btns">
        <div class="round-info"></div>
        <button class="icon-btn btn-log" title="Battle log">📜</button>
        <button class="icon-btn btn-music ${ti.isOn()?"":"off"}" title="Music">🎵</button>
        <button class="icon-btn btn-mute" title="Sound">${Hp()?"🔇":"🔊"}</button>
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
      <div class="help-modal hidden"></div>`,this.bindDOM(),this.bindRoom(),this.bindScene(),this.timerInt=setInterval(()=>this.renderTimer(),250),this.showOverlay('<div class="panel waiting"><h2>Connecting…</h2></div>')}bindDOM(){const e=this.root;ht(e,".pass-btn").onclick=()=>this.pass(),ht(e,".btn-cancel").onclick=()=>{this.setMode({kind:"idle"}),Je.click()},ht(e,".btn-skip").onclick=()=>this.pickTarget(null),ht(e,".btn-log").onclick=()=>ht(e,".log").classList.toggle("hidden"),ht(e,".btn-mute").onclick=t=>{t.target.textContent=Vp()?"🔇":"🔊"},ht(e,".btn-music").onclick=t=>{t.target.classList.toggle("off",!ti.toggle())},ht(e,".btn-help").onclick=()=>this.toggleHelp(),ht(e,".btn-menu").onclick=()=>this.confirmLeave(),ht(e,".btn-emote").onclick=()=>ht(e,".emote-list").classList.toggle("hidden"),this.keyHandler=t=>{var n;((n=t.target)==null?void 0:n.tagName)!=="INPUT"&&(t.code==="Space"&&(t.preventDefault(),this.pass()),t.code==="Escape"&&(ht(this.root,".help-modal").classList.add("hidden"),this.setMode({kind:"idle"})))},window.addEventListener("keydown",this.keyHandler),window.addEventListener("wheel",this.wheelHandler,{passive:!1})}markOverflow(e){for(const t of e.querySelectorAll(".card.big .text"))t.classList.toggle("more-below",t.scrollTop+t.clientHeight<t.scrollHeight-1),t.classList.toggle("more-above",t.scrollTop>0)}bindRoom(){const e=this.room;e.onMessage("seat",t=>{this.seat=t.seat,this.vsAI=t.vsAI,this.roomId=t.roomId,this.emotes=t.emotes,this.scene.setSeat(t.seat),ht(this.root,".emote-list").innerHTML=t.emotes.map((n,s)=>`<button data-i="${s}">${ot(n)}</button>`).join(""),ht(this.root,".emote-list").querySelectorAll("button").forEach(n=>n.onclick=()=>{e.send("emote",Number(n.dataset.i)),ht(this.root,".emote-list").classList.add("hidden")})}),e.onMessage("waiting",t=>{this.showOverlay(`<div class="panel waiting">
        <div class="spinner"></div>
        <h2>Waiting for an opponent…</h2>
        <p>Share this match code with a friend:</p>
        <div class="code" title="Click to copy">${ot(t.roomId)}</div>
        <p class="dim">Or keep waiting for someone to join from Quick Match.</p>
        <button class="btn ghost btn-leave">Cancel</button></div>`);const n=this.root.querySelector(".code");n.onclick=()=>{var s;(s=navigator.clipboard)==null||s.writeText(t.roomId),this.toast("Code copied!")},this.root.querySelector(".btn-leave").onclick=()=>this.exit()}),e.onMessage("state",t=>{this.queue.push(t),this.pump()}),e.onMessage("deadline",t=>{this.deadline=t}),e.onMessage("error",t=>{Je.error(),this.toast(t)}),e.onMessage("emote",t=>this.showEmote(t.seat,t.text)),e.onMessage("opponentStatus",t=>{t.seat!==this.seat&&this.toast(t.connected?"Opponent reconnected.":"Opponent disconnected… waiting up to 60s.")}),e.onMessage("opponentLeft",()=>this.toast("Your opponent left the room.")),e.onMessage("rematchStatus",t=>{const n=this.root.querySelector(".rematch-status");n&&(n.textContent=t[1-this.seat]?"Opponent wants a rematch!":t[this.seat]?"Waiting for opponent…":"")}),e.onLeave(()=>{this.disposed||this.toast("Disconnected from server.")})}bindScene(){const e=this.scene;e.setMenuMode(!1),ti.play("battle"),e.onHexClick=t=>this.hexClick(t),e.onHexHover=t=>{this.hoverHex=t,this.updateHover(),this.updateHighlights()},e.onSanctumClick=t=>this.sanctumClick(t),e.onSanctumHover=t=>{this.hoverSanctum=t,this.updateHover(),this.updateGuide()},e.onRightClick=()=>{this.mode.kind!=="idle"&&(this.setMode({kind:"idle"}),Je.click())}}dispose(){this.disposed=!0,clearInterval(this.timerInt),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("wheel",this.wheelHandler),this.scene.onHexClick=()=>{},this.scene.onHexHover=()=>{},this.scene.onSanctumClick=()=>{},this.scene.onSanctumHover=()=>{},this.scene.setMenuMode(!0)}exit(){this.dispose();try{sessionStorage.removeItem("oom-reconnect")}catch{}this.room.leave(!0).catch(()=>{}),this.onExit()}get g(){return new ir(this.view)}get me(){return this.view.players[this.seat]}get opp(){return this.view.players[1-this.seat]}get myTurn(){return!!this.view&&this.view.phase==="action"&&this.view.turn===this.seat&&!this.animating}async pump(){var e,t;if(!this.animating)for(;this.queue.length;){const n=this.queue.shift(),s=!this.view;if(this.seat=n.seat,this.deadline=n.deadline,this.connected=n.connected,s){this.scene.setSeat(n.seat),this.hideOverlay();let o="1";try{o=localStorage.getItem("oom-help-seen")??"",localStorage.setItem("oom-help-seen","1")}catch{}o||setTimeout(()=>this.toggleHelp(),300)}const r=(e=this.view)==null?void 0:e.turn,a=(t=this.view)==null?void 0:t.phase;if(this.view&&n.events.length&&!s){this.animating=!0,this.setMode({kind:"idle"},!1),this.render();for(const o of n.events){if(this.disposed)return;await this.beforeEvent(o,n.view),await this.scene.play(o,n.view,this.seat)}this.animating=!1}if(n.events.some(o=>o.t==="fx"&&o.kind==="start")&&(this.rematchSent=!1,this.mullSent=!1,this.mullOld=null,this.hideOverlay(),ti.duck(1,3),this.scene.setMenuMode(!0),this.scene.setMenuMode(!1)),this.view=n.view,this.scene.sync(this.view,this.seat,this.myTurn,this.canActUnit),this.mode.kind!=="idle"&&this.setMode({kind:"idle"},!1),this.render(),this.view.phase==="action"&&this.view.turn===this.seat&&(r!==this.seat||a!=="action")&&!s&&Je.yourTurn(),s&&this.view.phase==="action"&&this.banner(`Round ${this.view.round}`,this.view.initiative===this.seat?"You have the initiative":"Opponent has the initiative"),this.room.reconnectionToken)try{sessionStorage.setItem("oom-reconnect",this.room.reconnectionToken)}catch{}}}async beforeEvent(e,t){switch(e.t){case"round":Je.round(),this.banner(`Round ${e.round}`,e.initiative===this.seat?"You have the initiative":"Opponent has the initiative"),await this.scene.wait(900);break;case"play":{Je.play();const n=Ye(e.cardId);e.p!==this.seat?(this.castShow(e.cardId,"Opponent played"),await this.scene.wait(n.type==="unit"?900:1300)):n.type!=="unit"&&(this.castShow(e.cardId,"You cast"),await this.scene.wait(450));break}case"pass":Je.pass(),e.p!==this.seat&&this.toast(t.phase==="action"&&t.round===this.view.round?"Opponent passed. Your move: act, or pass to end the round.":"Opponent passed.");break;case"draw":e.burned&&this.toast(`${e.p===this.seat?"Your":"Opponent's"} hand is full! ${Ye(e.burned).name} was burned.`);break;case"levelUp":this.banner(Ye(e.unit.cardId).name,`${e.unit.owner===this.seat?"Your":"Opponent's"} champion leveled up!`);break;case"gameOver":await this.scene.wait(500);break}}pass(){this.myTurn&&this.send({type:"pass"})}send(e){this.setMode({kind:"idle"},!1),this.room.send("action",e),Je.click()}setMode(e,t=!0){this.mode=e,t&&this.render(),this.updateHighlights(),this.updatePrompt()}clickCard(e){if(!this.view||this.view.phase==="mulligan")return;if(this.mode.kind==="card"&&this.mode.iid===e){const n=this.me.hand.find(s=>s.iid===e);if(this.g.specs(Ye(n.cardId)).length===0){this.send({type:"play",iid:e,targets:[]});return}this.setMode({kind:"idle"});return}if(!this.myTurn){this.toast("Wait for your action."),Je.error();return}const t=this.me.hand.find(n=>n.iid===e);if(t){if(!this.g.playable(this.seat,t)){Je.error(),this.toast(this.g.canAfford(this.seat,t)?"No valid targets.":"Not enough mana.");return}Je.select(),this.setMode({kind:"card",iid:e,targets:[]})}}currentSpec(){if(this.mode.kind!=="card")return null;const e=this.me.hand.find(r=>r.iid===this.mode.iid);if(!e)return null;const t=Ye(e.cardId),n=this.g.specs(t),s=this.mode.targets.length;return{d:t,specs:n,i:s,spec:n[s],cands:s<n.length?this.g.candidates(this.seat,t,this.mode.targets,s):[]}}pickTarget(e){if(this.mode.kind!=="card")return;const t=this.currentSpec();if(!t)return;const n=[...this.mode.targets,e];if(Je.select(),n.length>=t.specs.length){this.send({type:"play",iid:this.mode.iid,targets:n});return}if(this.g.candidates(this.seat,t.d,n,n.length).length===0&&t.specs[n.length].optional){const r=[...n];for(;r.length<t.specs.length&&t.specs[r.length].optional&&this.g.candidates(this.seat,t.d,r,r.length).length===0;)r.push(null);if(r.length>=t.specs.length){this.send({type:"play",iid:this.mode.iid,targets:r});return}this.setMode({kind:"card",iid:this.mode.iid,targets:r});return}this.setMode({kind:"card",iid:this.mode.iid,targets:n})}hexClick(e){if(!this.view||this.view.phase!=="action")return;const t=this.g,n=t.unitAt(e);if(this.mode.kind==="card"){const s=this.currentSpec();if(!s)return;const r=s.cands.find(a=>a&&"uid"in a?n&&a.uid===n.uid:a&&"c"in a&&ro(a,e));r?this.pickTarget(r):Je.error();return}if(this.myTurn){if(this.mode.kind==="unit"){const s=t.unit(this.mode.uid);if(!s){this.setMode({kind:"idle"});return}const r=this.mode.moveTo??{c:s.c,r:s.r},a=t.reachable(s);if(n&&n.owner!==this.seat){if(t.attackTargets(s,r).some(h=>"uid"in h&&h.uid===n.uid)){this.send({type:"order",uid:s.uid,to:this.mode.moveTo,attack:{uid:n.uid}});return}let o=null,c=99;for(const[,h]of a){const d=h[h.length-1];t.attackTargets(s,d).some(u=>"uid"in u&&u.uid===n.uid)&&h.length<c&&(o=d,c=h.length)}if(o){this.send({type:"order",uid:s.uid,to:o,attack:{uid:n.uid}});return}Je.error(),this.toast("Can't reach that unit this action.");return}if(n&&n.uid===s.uid){this.mode.moveTo?this.setMode({kind:"unit",uid:s.uid}):this.setMode({kind:"idle"});return}if(n&&n.owner===this.seat){t.canAct(n)?(Je.select(),this.setMode({kind:"unit",uid:n.uid})):this.setMode({kind:"idle"});return}if(a.has(rn(e))){if(this.mode.moveTo&&ro(this.mode.moveTo,e)){this.send({type:"order",uid:s.uid,to:e});return}if(t.attackTargets(s,e).length===0){this.send({type:"order",uid:s.uid,to:e});return}Je.select(),this.setMode({kind:"unit",uid:s.uid,moveTo:e});return}this.setMode({kind:"idle"});return}n&&n.owner===this.seat&&(t.canAct(n)?(Je.select(),this.setMode({kind:"unit",uid:n.uid})):(Je.error(),this.toast(t.isFrozen(n)?"That unit is Frozen.":n.exhausted?"That unit has already acted this round.":"Units can't act the round they are summoned (unless Swift).")))}}sanctumClick(e){if(!this.myTurn||this.mode.kind!=="unit"||e===this.seat)return;const t=this.g,n=t.unit(this.mode.uid);if(!n)return;const s=this.mode.moveTo??{c:n.c,r:n.r};if(t.attackTargets(n,s).some(r=>"sanctum"in r)){this.send({type:"order",uid:n.uid,to:this.mode.moveTo,attack:{sanctum:e}});return}for(const[,r]of t.reachable(n)){const a=r[r.length-1];if(oo(this.seat,n.range,a)){this.send({type:"order",uid:n.uid,to:a,attack:{sanctum:e}});return}}Je.error(),this.toast("To attack the enemy Sanctum, melee units must stand on its back row. Ranged units can attack from either red row.")}updateGuide(){if(!this.view||this.mode.kind!=="unit"||!this.myTurn){this.scene.showGuide(null,null);return}const e=this.g,t=e.unit(this.mode.uid);if(!t){this.scene.showGuide(null,null);return}const n={c:t.c,r:t.r},s=e.reachable(t),r=c=>c?s.get(rn(c))??[n]:[n],a=this.mode.moveTo,o=this.hoverHex?e.unitAt(this.hoverHex):void 0;if(this.hoverSanctum!==null&&this.hoverSanctum!==this.seat){const c=a??n;if(e.attackTargets(t,c).some(h=>"sanctum"in h)){this.scene.showGuide(r(a),this.scene.sanctumPos(this.hoverSanctum));return}for(const[,h]of s)if(oo(this.seat,t.range,h[h.length-1])){this.scene.showGuide(h,this.scene.sanctumPos(this.hoverSanctum));return}}if(o&&o.owner!==this.seat){const c=a??n;if(e.attackTargets(t,c).some(d=>"uid"in d&&d.uid===o.uid)){this.scene.showGuide(r(a),this.scene.hexPos(o,.7));return}let h=null;for(const[,d]of s)e.attackTargets(t,d[d.length-1]).some(u=>"uid"in u&&u.uid===o.uid)&&(!h||d.length<h.length)&&(h=d);if(h&&!a){this.scene.showGuide(h,this.scene.hexPos(o,.7));return}}if(this.hoverHex&&s.has(rn(this.hoverHex))&&!a){this.scene.showGuide(s.get(rn(this.hoverHex)),null);return}this.scene.showGuide(a?r(a):null,null)}updateHighlights(){if(this.updateGuide(),!this.view)return;const e=new Map;let t=null;const n=this.g;if(this.mode.kind==="card"){const s=this.currentSpec();if(s)for(const r of s.cands)if(r&&"uid"in r){const a=n.unit(r.uid);e.set(rn(a),a.owner===this.seat?"friendly":"enemy")}else r&&"c"in r&&e.set(rn(r),"deploy")}else if(this.mode.kind==="unit"){const s=n.unit(this.mode.uid);if(s){const r=n.reachable(s);for(const o of r.keys())e.set(o,"move");if(!this.mode.moveTo)for(const[,o]of r)for(const c of n.attackTargets(s,o[o.length-1]))if("uid"in c){const h=n.unit(c.uid);e.set(rn(h),"attackFar")}else t=c.sanctum;const a=this.mode.moveTo??{c:s.c,r:s.r};for(const o of n.attackTargets(s,a))"uid"in o?e.set(rn(n.unit(o.uid)),"attack"):t=o.sanctum;e.set(rn(s),"selected"),this.mode.moveTo&&e.set(rn(this.mode.moveTo),"dest")}}else if(this.hoverHex){const s=n.unitAt(this.hoverHex);if(s){if(n.canAct(s))for(const r of n.reachable(s).keys())e.set(r,"move");for(const r of $r)jn(r,s)<=s.range&&jn(r,s)>0&&e.set(rn(r),"attackFar")}}this.scene.setHighlights(e,t)}updateHover(){const e=ht(this.root,".hover-card"),t=a=>{e.dataset.html!==a&&(e.innerHTML=a,e.dataset.html=a)};if(ht(this.root,".forecast").classList.add("hidden"),!this.view)return;const s=this.g;if(this.previewCard){const a=Ye(this.previewCard.cardId),o=a.champion?Sn(Ye(a.champion.to),{extraClass:"big"}):"";t(`<div class="hc-row">${Sn(a,{extraClass:"big",cost:this.previewCard.cost})}${o}</div><div class="hc-help">${kc(a)}</div>`),e.classList.add("show"),this.markOverflow(e);return}if(this.hoverSanctum!==null){const a=this.view.players[this.hoverSanctum];t(`<div class="sanctum-card ${this.hoverSanctum===this.seat?"mine":"theirs"}"><h3>${ot(a.name)}'s Sanctum</h3><div class="big">${a.sanctum} / 20</div><p>If it reaches 0, ${this.hoverSanctum===this.seat?"you lose":"you win"}. Melee units on ${this.hoverSanctum===this.seat?"your":"the enemy"} back row can attack it, and ranged units can attack it from either of ${this.hoverSanctum===this.seat?"your":"the enemy"} two back rows.</p></div>`),e.classList.add("show"),this.markOverflow(e),this.showForecast(null);return}const r=this.hoverHex?s.unitAt(this.hoverHex):void 0;if(r){const a=Ye(r.cardId),o=[],c=s.isFrozen(r);if(c&&o.push(r.frozenUntil>this.view.round?"❄️ Frozen: can't act this round or next":"❄️ Frozen: can't act this round"),s.isRooted(r)&&o.push("🕸️ Rooted: can't move"),r.exhausted&&!c?o.push("✓ Already acted this round"):r.summonedRound===this.view.round&&!r.kw.includes("swift")?o.push("💤 Just summoned: can't act until next round"):c||o.push("⚡ Ready to act"),r.tempAtk&&o.push(`🔥 +${r.tempAtk} power this round`),a.champion){const[d,u]=a.champion.progress(s,r);o.push(`⭐ Level up: ${a.champion.label} ${Math.min(d,u)}/${u}`)}const h=a.champion?Sn(Ye(a.champion.to),{extraClass:"big"}):"";t(`<div class="hc-row">${Sn(a,{unit:r,extraClass:"big"})}${h}</div><div class="hc-help"><div class="unit-status">${r.owner===this.seat?'<b class="mine">Your unit</b>':'<b class="theirs">Enemy unit</b>'}${o.map(d=>`<div>${d}</div>`).join("")}</div>${kc(a,r.kw)}</div>`),e.classList.add("show"),this.markOverflow(e)}else this.hoverHex&&this.view&&[1,4,7].includes(this.hoverHex.c)&&this.hoverHex.r===3?(t('<div class="sanctum-card"><h3>🔮 Ley Orb</h3><p>At the start of each round, a unit standing here gives its owner <b>+1 mana</b> for that round and deals <b>1 damage</b> to the enemy Sanctum.</p></div>'),e.classList.add("show"),this.markOverflow(e)):e.classList.remove("show");this.showForecast(r??null)}showForecast(e){const t=ht(this.root,".forecast");if(this.mode.kind!=="unit"||!this.myTurn)return;const n=this.g,s=n.unit(this.mode.uid);if(!s)return;let r=null;const a=this.mode.moveTo??{c:s.c,r:s.r};if(e&&e.owner!==this.seat)if(n.attackTargets(s,a).some(u=>"uid"in u&&u.uid===e.uid))r={type:"order",uid:s.uid,to:this.mode.moveTo,attack:{uid:e.uid}};else for(const[,u]of n.reachable(s)){const m=u[u.length-1];if(n.attackTargets(s,m).some(p=>"uid"in p&&p.uid===e.uid)){r={type:"order",uid:s.uid,to:m,attack:{uid:e.uid}};break}}else this.hoverSanctum!==null&&this.hoverSanctum!==this.seat&&n.attackTargets(s,a).some(u=>"sanctum"in u)&&(r={type:"order",uid:s.uid,to:this.mode.moveTo,attack:{sanctum:1-this.seat}});if(!r)return;const o=n.clone();if(!o.act(this.seat,r).ok)return;const h=o.unit(s.uid);let d="";if(e&&r.type==="order"&&r.attack&&"uid"in r.attack){const u=o.unit(e.uid);d=`<div>⚔️ ${ot(Ye(s.cardId).name)} ${h?`<b>${h.hp}</b> hp left`:'<b class="dies">dies</b>'}</div>
              <div>🎯 ${ot(Ye(e.cardId).name)} ${u?`<b>${u.hp}</b> hp left`:'<b class="dies">dies</b>'}</div>`}else d=`<div>🏰 Sanctum takes <b>${this.opp.sanctum-o.s.players[1-this.seat].sanctum}</b> damage</div>`;t.innerHTML=d,t.classList.remove("hidden")}render(){if(!this.view)return;const e=this.view;this.renderPlayer(ht(this.root,".pinfo.me"),this.seat),this.renderPlayer(ht(this.root,".pinfo.opp"),1-this.seat),ht(this.root,".opp-hand").innerHTML=this.opp.hand.map(()=>Xp()).join("");const t=ht(this.root,".round-info");t.innerHTML=e.phase==="mulligan"?"<b>Mulligan</b>":`<b>Round ${e.round}</b>`;const n=ht(this.root,".pass-wrap .init");n.className=`init ${e.initiative===this.seat?"mine":"theirs"}`,n.textContent=`⚜ ${e.initiative===this.seat?"Your":"Opponent's"} initiative`,this.renderHand(),this.renderPass(),this.renderLog(),this.updatePrompt(),e.phase==="mulligan"?this.renderMulligan():e.phase==="over"?this.renderGameOver():this.root.querySelector(".overlay .mulligan")&&this.finishMulligan(),this.scene.myTurn=this.myTurn;for(const s of e.units){const r=this.scene.units.get(s.uid);r&&(r.canActNow=this.canActUnit(s))}}renderPlayer(e,t){const n=this.view.players[t],s=t===this.seat,r=Math.max(0,n.mana-n.maxMana);let a="";for(let d=0;d<n.maxMana;d++)a+=`<i class="gem ${d<n.mana?"full":""}"></i>`;for(let d=0;d<r;d++)a+='<i class="gem full bonus" title="Ley Orb bonus mana"></i>';let o="";for(let d=0;d<kd;d++)o+=`<i class="sgem ${d<n.spellMana?"full":""}"></i>`;const c=this.view.phase==="action"&&this.view.turn===t,h=Math.max(0,n.sanctum)/20*100;e.classList.toggle("active",c),e.innerHTML=`
      <div class="avatar" style="background:${n.deckColors.map((d,u)=>`radial-gradient(circle at ${u?"70% 70%":"30% 30%"}, ${vn[d].hex}, transparent 70%)`).join(",")}">${n.deckIcon}</div>
      <div class="pdata">
        <div class="pname">${ot(n.name)} ${this.connected[t]?"":'<span class="dc">disconnected</span>'}${this.view.passes===1&&this.view.turn!==t&&this.view.phase==="action"?'<span class="passed">passed</span>':""}</div>
        <div class="hpbar"><div class="fill ${s?"mine":"theirs"}" style="width:${h}%"></div><span>🔮 ${n.sanctum}</span></div>
        <div class="mana" title="Mana ${n.mana}/${n.maxMana}">${a}<span class="mana-num">${n.mana}/${n.maxMana}</span></div>
        <div class="spellmana" title="Spell mana: unspent mana carried over (spells and orders only)">${o}</div>
        <div class="counts"><span title="Cards in hand">🂠 ${n.hand.length}</span><span title="Cards in deck">📚 ${n.deck.length}</span><span title="Deck">${ot(n.deckName)}</span></div>
      </div>`}renderHand(){const e=ht(this.root,".hand"),t=this.me.hand,n=this.g,s=t.length;this.previewCard&&!this.root.querySelector(".logcard:hover")&&(this.previewCard=null,this.updateHover()),e.innerHTML=t.map((r,a)=>{const o=Ye(r.cardId),c=this.myTurn&&n.playable(this.seat,r),h=this.mode.kind==="card"&&this.mode.iid===r.iid,d=(s-1)/2,u=(a-d)*Math.min(5,30/s),m=Math.abs(a-d)*Math.abs(a-d)*3,p=!this.seenCards.has(r.iid);return`<div class="hand-slot ${c?"playable":""} ${h?"selected":""} ${p?"fresh":""}" style="--rot:${u}deg; --lift:${m}px; --i:${a}" data-iid="${r.iid}">
        ${Sn(o,{cost:n.cost(this.seat,r)})}</div>`}).join("");for(const r of t)this.seenCards.add(r.iid);e.querySelectorAll(".hand-slot").forEach(r=>{r.onclick=a=>{a.stopPropagation(),this.clickCard(Number(r.dataset.iid))},r.onmouseenter=()=>{Je.hover();const a=t.find(o=>o.iid===Number(r.dataset.iid));a&&(this.previewCard={cardId:a.cardId,cost:n.cost(this.seat,a)},this.updateHover())},r.onmouseleave=()=>{this.previewCard=null,this.updateHover()}})}renderPass(){const e=ht(this.root,".pass-btn"),t=this.view;if(ht(this.root,".pass-wrap").classList.toggle("hidden",t.phase!=="action"),t.turn===this.seat&&t.phase==="action"){const s=t.passes===1;e.innerHTML=s?"End<br>Round":"Pass",e.className=`pass-btn ready ${s?"end":""}`,e.disabled=this.animating}else e.innerHTML=`<span class="small">Opponent's<br>action</span>`,e.className="pass-btn waiting",e.disabled=!0}renderTimer(){if(!this.view||this.view.phase==="over"||!this.deadline){ht(this.root,".timer-num").textContent="";return}const e=Math.max(0,(this.deadline-Date.now())/1e3),t=this.view.phase==="mulligan"?45:75,n=this.root.querySelector(".timer circle"),s=2*Math.PI*46;if(n.style.strokeDasharray=`${s}`,n.style.strokeDashoffset=`${s*(1-e/t)}`,n.classList.toggle("urgent",e<15),ht(this.root,".timer-num").textContent=e<20&&this.view.phase==="action"?`${Math.ceil(e)}`:"",this.view.phase==="mulligan"){const r=this.root.querySelector(".mull-timer");r&&(r.textContent=this.me.mulliganDone||this.mullSent?"":`${Math.ceil(e)}s`)}}renderLog(){const e=ht(this.root,".log"),t=n=>ot(n).replace(/\{\{(\w+)\}\}/g,(s,r)=>{try{return`<span class="logcard" data-card="${r}">${ot(Ye(r).name)}</span>`}catch{return r}});e.innerHTML="<h4>Battle Log</h4>"+this.view.log.slice(-60).reverse().map(n=>`<div class="${n.p===this.seat?"mine":n.p===-1?"sys":"theirs"}">${t(n.text)}</div>`).join(""),e.querySelectorAll(".logcard").forEach(n=>{n.onmouseenter=()=>{this.previewCard={cardId:n.dataset.card},this.updateHover()},n.onmouseleave=()=>{this.previewCard=null,this.updateHover()}})}updatePrompt(){const e=ht(this.root,".prompt"),t=ht(this.root,".btn-skip");if(this.view)if(this.mode.kind==="card"){const n=this.currentSpec();if(!n){e.classList.add("hidden");return}const s=n.specs.length===0?`Click <b>${ot(n.d.name)}</b> again to cast it`:`<b>${ot(n.d.name)}</b>: ${ot(n.spec.prompt)}`;ht(e,".prompt-text").innerHTML=s,t.classList.toggle("hidden",!(n.spec&&n.spec.optional)),e.classList.remove("hidden")}else if(this.mode.kind==="unit"){const n=this.g.unit(this.mode.uid);ht(e,".prompt-text").innerHTML=n?`<b>${ot(Ye(n.cardId).name)}</b>: ${this.mode.moveTo?"Click a red target to attack, or the glowing hex again to just move":"Click a blue hex to move, or a red target to attack"}`:"",t.classList.add("hidden"),e.classList.remove("hidden")}else e.classList.add("hidden")}mulliganResultHTML(e){const t=this.mullOld??[],n=new Set(t.map(c=>c.iid)),s=this.me.hand.filter(c=>!n.has(c.iid));let r=0;const a=t.map(c=>{if(!this.mullReplaced.has(c.iid))return`<div class="mull-card kept">${Sn(Ye(c.cardId))}</div>`;const h=s[r++];return!h||e&&!this.me.mulliganDone?'<div class="mull-card pending"><div class="card back"></div></div>':`<div class="mull-card fresh" style="--i:${r}">${Sn(Ye(h.cardId))}<div class="new-tag">New</div></div>`}).join(""),o=this.mullReplaced.size;return`<div class="panel mulligan wide">
      <h2>${o?`Replaced ${o} card${o>1?"s":""}`:"Keeping your hand"}</h2>
      <div class="mull-cards">${a}</div>
      ${e?'<div class="mull-wait"><div class="spinner small"></div> Waiting for your opponent…</div>':`<button class="btn big btn-mull-go">Let's go ▸</button>`}
    </div>`}finishMulligan(){if(!this.mullOld||!this.mullReplaced.size){this.hideOverlay(),this.mullOld=null;return}if(this.mullRevealTimer)return;this.showOverlay(this.mulliganResultHTML(!1));const e=()=>{this.mullRevealTimer&&clearTimeout(this.mullRevealTimer),this.mullRevealTimer=null,this.mullOld=null,this.root.querySelector(".overlay .mulligan")&&this.hideOverlay()};this.root.querySelector(".btn-mull-go").onclick=()=>{Je.click(),e()},this.mullRevealTimer=setTimeout(e,3200)}renderMulligan(){if(this.me.mulliganDone||this.mullSent){this.showOverlay(this.mullOld?this.mulliganResultHTML(!0):'<div class="panel mulligan"><div class="spinner"></div><h2>Waiting for your opponent…</h2></div>');return}const e=this.me.hand.map(n=>`<div class="mull-card ${this.mulliganPick.has(n.iid)?"replace":""}" data-iid="${n.iid}">${Sn(Ye(n.cardId))}<div class="x">↻ Replace</div></div>`).join(""),t=this.view.initiative===this.seat;this.showOverlay(`<div class="panel mulligan wide">
      <h2>Your Opening Hand</h2>
      <p>Click any cards you want to replace, then confirm. ${t?"<b>You</b> will have the initiative in round 1.":"Your <b>opponent</b> will have the initiative in round 1."}</p>
      <div class="mull-cards">${e}</div>
      <button class="btn big btn-keep">${this.mulliganPick.size?`Replace ${this.mulliganPick.size} card${this.mulliganPick.size>1?"s":""}`:"Keep all"}</button>
      <div class="mull-timer dim"></div></div>`),this.root.querySelectorAll(".mull-card").forEach(n=>n.onclick=()=>{const s=Number(n.dataset.iid);this.mulliganPick.has(s)?this.mulliganPick.delete(s):this.mulliganPick.add(s),Je.click(),this.renderMulligan()}),this.root.querySelector(".btn-keep").onclick=()=>{this.mullOld=this.me.hand.map(n=>({iid:n.iid,cardId:n.cardId})),this.mullReplaced=new Set(this.mulliganPick),this.mullSent=!0,this.room.send("action",{type:"mulligan",iids:[...this.mulliganPick]}),this.mulliganPick.clear(),Je.select(),this.renderMulligan()}}renderGameOver(){const e=this.view;if(this.root.querySelector(".overlay .gameover"))return;const t=e.winner===this.seat,n=e.winner===-1;t?Je.victory():n?Je.pass():Je.defeat(),ti.duck(.35,2.5);const s=this.currentDeckId(),r=Fl().map(a=>`<option value="${a.id}" ${a.id===s?"selected":""}>${ot(a.name)} (${a.archetype})</option>`).join("");this.showOverlay(`<div class="panel gameover ${t?"win":n?"draw":"lose"}">
      <div class="go-orb"></div>
      <h1>${t?"Victory!":n?"Draw":"Defeat"}</h1>
      <p>${t?"The enemy Sanctum shatters into a thousand stars.":n?"Both Sanctums fall together.":"Your Sanctum has fallen."} The battle lasted ${e.round} round${e.round===1?"":"s"}.</p>
      <div class="row"><label>Deck for the rematch: <select class="rematch-deck">${r}</select></label></div>
      <div class="row">
        <button class="btn big btn-rematch">⚔️ Rematch</button>
        <button class="btn ghost btn-home">Main Menu</button>
      </div>
      <div class="rematch-status dim"></div></div>`),this.root.querySelector(".btn-rematch").onclick=a=>{const o=this.root.querySelector(".rematch-deck").value;this.room.send("rematch",Nd(o)),a.target.disabled=!0,this.root.querySelector(".rematch-status").textContent=this.vsAI?"Shuffling…":"Waiting for opponent…"},this.root.querySelector(".btn-home").onclick=()=>this.exit()}showOverlay(e){const t=ht(this.root,".overlay");(t.dataset.html!==e||t.classList.contains("hidden"))&&(t.innerHTML=e,t.dataset.html=e),t.classList.remove("hidden")}hideOverlay(){const e=ht(this.root,".overlay");e.classList.add("hidden"),e.innerHTML="",delete e.dataset.html}toast(e){const t=ht(this.root,".toast"),n=document.createElement("div");n.className="toast-item",n.textContent=e,t.appendChild(n),setTimeout(()=>n.classList.add("out"),2600),setTimeout(()=>n.remove(),3200)}banner(e,t){const n=ht(this.root,".banner");n.innerHTML=`<div class="b-title">${ot(e)}</div><div class="b-sub">${ot(t)}</div>`,n.classList.remove("show"),n.offsetWidth,n.classList.add("show")}castShow(e,t){const n=ht(this.root,".cast-show");n.innerHTML=`<div class="cast-label">${ot(t)}</div>${Sn(Ye(e),{extraClass:"big"})}`,n.classList.remove("show"),n.offsetWidth,n.classList.add("show")}showEmote(e,t){Je.emote();const n=ht(this.root,e===this.seat?".me-bubble":".opp-bubble");n.textContent=t,n.classList.remove("hidden"),clearTimeout(n._t),n._t=window.setTimeout(()=>n.classList.add("hidden"),2600)}confirmLeave(){if(!this.view||this.view.phase==="over"){this.exit();return}this.showOverlay(`<div class="panel"><h2>Concede the match?</h2><p>Your opponent will be awarded the victory.</p>
      <div class="row"><button class="btn danger btn-yes">Concede</button><button class="btn ghost btn-no">Keep fighting</button></div></div>`),this.root.querySelector(".btn-yes").onclick=()=>{this.room.send("action",{type:"concede"}),this.hideOverlay()},this.root.querySelector(".btn-no").onclick=()=>{this.hideOverlay(),this.render()}}toggleHelp(){const e=ht(this.root,".help-modal");if(!e.classList.contains("hidden")){e.classList.add("hidden");return}e.innerHTML=`<div class="panel help"><button class="close btn-close-help" title="Close (Esc)">✕</button>${Fd}</div>`,e.classList.remove("hidden"),e.querySelector(".btn-close-help").onclick=()=>e.classList.add("hidden"),e.onclick=t=>{t.target===e&&e.classList.add("hidden")}}}const Fd=`
<h2>How to Play</h2>
<div class="help-grid">
  <div><h4>🎯 Goal</h4><p>Reduce the enemy <b>Sanctum</b> (the big orb behind their side) from 20 to 0.</p></div>
  <div><h4>🔁 Rounds</h4><p>Each round you gain a mana crystal (up to 10) and draw a card. Players take turns doing <b>one action at a time</b>. The player with the <b>initiative</b> goes first; it swaps every round. The round ends when both players <b>pass in a row</b>, so passing just to see what your opponent does is a real tactic.</p></div>
  <div><h4>🃏 Actions</h4><p><b>Play a card</b>: Units are summoned onto your two back rows. Spells and Orders take effect immediately.<br><b>Order a unit</b>: Move it up to its speed (usually 2 hexes) and/or attack something in range. Each unit can be ordered once per round, starting the round after it is summoned.<br><b>Pass</b>.</p></div>
  <div><h4>⚔️ Combat</h4><p>Attacker and defender damage each other at the same time, unless the defender can't reach back (ranged attacks). Damage stays on units between rounds. To attack the enemy Sanctum directly, melee units must reach the enemy's <b>back row</b>. Ranged units can attack it from either of the enemy's two back rows.</p></div>
  <div><h4>🔮 Ley Orbs</h4><p>Three orbs float over the center row. Each one you stand on at the start of a round gives you <b>+1 mana</b> for that round and deals <b>1 damage</b> to the enemy Sanctum.</p></div>
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
<p>Click a card, then a highlighted target. Click your unit, then a blue hex to move or a red target to attack (it will walk into range automatically). <b>Space</b> passes, <b>Esc</b> or right-click cancels, the mouse wheel scrolls the text of a hovered card. Hover anything for details.</p>`,sm={guardian:.6,flying:1.2,firstStrike:1,drain:1.2,regenerate:1.2,barrier:1.4,siege:.8,deadly:2.5,swift:0,infiltrate:0},rm={k_siphon:3,k_necromancer:3,d_captain:2,t_sea_witch:2,e_flame_dancer:1.5,g_sporecap:2.5,d_bastion:1.5,c_pyra:1.5,c_nerith:2,c_thornak:1.5,c_sera:2,c_morvath:2,c_nerith2:3,c_thornak2:3,c_sera2:3,c_morvath2:2,t_glacial:1,g_boar:.5,e_berserker:.8,k_grave_imp:.8,e_powder_goblin:1,g_sproutling:.6,e_phoenix:1.5};function am(i,e){let t=i.power(e)*1+e.hp*.8+e.atk*.2;for(const n of e.kw)t+=sm[n]??0;return t+=rm[e.cardId]??0,e.range>1&&(t+=.8),t}function om(i,e){let t=0;const n=e.owner===0?e.r:6-e.r;t+=n*.25,Ed(e)?t+=3:t+=Math.max(0,2-Math.min(...sa.map(r=>jn(r,e))))*.4;const s=e.kw.includes("siege")?1.6:.8;return oo(e.owner,e.range,e)?t+=i.power(e)*s:Ul(e.owner,e)&&(t+=i.power(e)*s*.5),t}function Ah(i,e){const t=i.s;if(t.phase==="over")return t.winner===e?1e5:t.winner===-1?-500:-1e5;const n=t.players[e],s=t.players[1-e];let r=0;const a=c=>c*3+(c<=8?(8-c)*-2:0);r+=a(n.sanctum)-a(s.sanctum),r+=(Math.min(n.hand.length,8)-Math.min(s.hand.length,8))*1.6,r+=(n.maxMana-s.maxMana)*1.5,r+=(n.spellMana-s.spellMana)*.3;const o=t.units.filter(c=>c.hp>0);for(const c of o){const h=c.owner===e?1:-1,d=am(i,c);r+=h*(d+om(i,c));const u=o.filter(m=>m.owner!==c.owner&&i.canAct(m)&&jn(m,c)<=(i.isRooted(m)?0:m.speed)+m.range);if(u.length){const m=u.reduce((x,_)=>x+i.power(_),0),p=c.kw.includes("barrier")?!1:m>=c.hp||u.some(x=>x.kw.includes("deadly")),y=t.turn!==c.owner;p&&(r-=h*d*(y?.55:.25))}}return r}function cm(i,e,t){if(t.length<=5)return t;const n=i.unitsOf(1-e),s=vs(e)[0],r=t.map(a=>{const o=a;let c=0;return o.r===s&&(c+=2),Ed(o)&&(c+=6),c-=Math.min(...sa.map(h=>jn(h,o)))*.5,n.length&&(c-=Math.min(...n.map(h=>jn(h,o)))*.3),Ul(e,o)&&(c+=1),{t:a,sc:c+Math.random()*.3}});return r.sort((a,o)=>o.sc-a.sc),r.slice(0,5).map(a=>a.t)}function lm(i,e){const t=[{type:"pass"}],n=i.s.players[e],s=new Set;for(const r of n.hand){if(s.has(r.cardId+":"+r.costMod)||(s.add(r.cardId+":"+r.costMod),!i.playable(e,r)))continue;const a=Ye(r.cardId),o=i.specs(a),c=h=>{const d=h.length;if(d===o.length){t.push({type:"play",iid:r.iid,targets:h});return}let u=i.candidates(e,a,h,d);a.type==="unit"&&d===0?u=cm(i,e,u):u.length>10&&(u=u.slice(0,10)),o[d].optional&&(u=[...u,null]);for(const m of u)c([...h,m])};c([])}for(const r of i.unitsOf(e)){if(!i.canAct(r))continue;const a={c:r.c,r:r.r};for(const o of i.attackTargets(r,a))t.push({type:"order",uid:r.uid,attack:o});for(const[,o]of i.reachable(r)){const c=o[o.length-1];t.push({type:"order",uid:r.uid,to:c});for(const h of i.attackTargets(r,c))t.push({type:"order",uid:r.uid,to:c,attack:h})}}return t}function hm(i){const{log:e,...t}=i.s;return new ir(structuredClone({...t,log:[]}))}function Rh(i,e){var a;if(i.s.phase==="mulligan")return{type:"mulligan",iids:um(i,e)};const n=Ah(i,e);let s={type:"pass"},r=n+.4;for(const o of lm(i,e)){if(o.type==="pass")continue;const c=hm(i);if(!c.act(e,o).ok)continue;let d=Ah(c,e);if(o.type==="play"){const u=Ye(((a=c.s.lastPlayed)==null?void 0:a.cardId)??"");d+=u.aiBias??0}d+=Math.random()*.15,d>r&&(r=d,s=o)}return s}function um(i,e){return i.s.players[e].hand.filter(n=>Ye(n.cardId).cost>=5).map(n=>n.iid)}const Ch=["Well played!","Good luck!","Hmm...","Oops!","Wow!","Thanks!","Not today!","Behold!"];function Ph(i){const e=i==null?void 0:i.customDeck;return e&&typeof e.name=="string"&&!co(e.cards)?{id:"custom",name:e.name.slice(0,30)||"Custom Deck",cards:e.cards}:qr((i==null?void 0:i.deckId)??"")}function Ih(i){return kn.find(e=>e.id===i)??kn[Math.floor(Math.random()*kn.length)]}const dm=i=>700+Math.min(i,12)*220,di=0,In=1;class fm{constructor(e){this.opts=e,this.roomId="local",this.reconnectionToken="",this.handlers=new Map,this.aiTimer=null,this.closed=!1;const t=Ih(e.aiDeckId);this.decks=[Ph(e),qr(t.id)],this.names=[e.name,`${t.name} AI`],setTimeout(()=>{this.emit("seat",{seat:di,roomId:this.roomId,vsAI:!0,emotes:Ch}),this.start()},0)}onMessage(e,t){const n=this.handlers.get(e)??[];n.push(t),this.handlers.set(e,n)}onLeave(e){}leave(){return this.closed=!0,this.aiTimer&&clearTimeout(this.aiTimer),Promise.resolve()}send(e,t){if(!this.closed){if(e==="action")this.act(di,t,!0);else if(e==="emote"){const n=Ch[t];n&&this.emit("emote",{seat:di,text:n})}else if(e==="rematch"){if(this.game.s.phase!=="over")return;const n=t;(n!=null&&n.deckId||n!=null&&n.customDeck)&&(this.decks[di]=Ph(n));const s=Ih(this.opts.aiDeckId);this.decks[In]=qr(s.id),this.names[In]=`${s.name} AI`,this.start()}}}emit(e,t){const n=t===void 0?t:structuredClone(t);for(const s of this.handlers.get(e)??[])s(n)}start(){this.game=ir.create({name:this.names[di],deck:this.decks[di],isAI:!1},{name:this.names[In],deck:this.decks[In],isAI:!0}),this.sendState([{t:"fx",kind:"start",at:null}]),this.maybeAI()}act(e,t,n=!1){const s=this.game.act(e,t);return s.ok?(this.sendState(s.events),this.maybeAI(s.events.length),s):(n&&this.emit("error",s.error),s)}sendState(e){this.emit("state",{view:tm(this.game.s,di),events:nm(e,di),seat:di,deadline:0,names:this.names,connected:[!0,!0]})}maybeAI(e=0){const t=this.game;if(!(this.closed||t.s.phase==="over")){if(t.s.phase==="mulligan"){t.s.players[In].mulliganDone||(t.act(In,Rh(t,In)),t.s.phase==="action"&&this.sendState(t.events));return}t.s.turn===In&&(this.aiTimer&&clearTimeout(this.aiTimer),this.aiTimer=setTimeout(()=>{if(this.closed||this.game!==t||t.s.turn!==In||t.s.phase!=="action")return;this.act(In,Rh(t,In)).ok||this.act(In,{type:"pass"})},dm(e)))}}}function zl(i){if(Object.prototype.hasOwnProperty.call(i,"__esModule"))return i;var e=i.default;if(typeof e=="function"){var t=function n(){return this instanceof n?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};t.prototype=e.prototype}else t={};return Object.defineProperty(t,"__esModule",{value:!0}),Object.keys(i).forEach(function(n){var s=Object.getOwnPropertyDescriptor(i,n);Object.defineProperty(t,n,s.get?s:{enumerable:!0,get:function(){return i[n]}})}),t}var No={},Dh={},Lh;function pm(){return Lh||(Lh=1,ArrayBuffer.isView||(ArrayBuffer.isView=i=>i!==null&&typeof i=="object"&&i.buffer instanceof ArrayBuffer),typeof globalThis>"u"&&typeof window<"u"&&(window.globalThis=window),typeof FormData>"u"&&(globalThis.FormData=class{})),Dh}var va={},Fc=function(i,e){return Fc=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=n[s])},Fc(i,e)};function Bd(i,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");Fc(i,e);function t(){this.constructor=i}i.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}var lo=function(){return lo=Object.assign||function(e){for(var t,n=1,s=arguments.length;n<s;n++){t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},lo.apply(this,arguments)};function zd(i,e){var t={};for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&e.indexOf(n)<0&&(t[n]=i[n]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,n=Object.getOwnPropertySymbols(i);s<n.length;s++)e.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(i,n[s])&&(t[n[s]]=i[n[s]]);return t}function Hd(i,e,t,n){var s=arguments.length,r=s<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,t):n,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(i,e,t,n);else for(var o=i.length-1;o>=0;o--)(a=i[o])&&(r=(s<3?a(r):s>3?a(e,t,r):a(e,t))||r);return s>3&&r&&Object.defineProperty(e,t,r),r}function Vd(i,e){return function(t,n){e(t,n,i)}}function Gd(i,e,t,n,s,r){function a(g){if(g!==void 0&&typeof g!="function")throw new TypeError("Function expected");return g}for(var o=n.kind,c=o==="getter"?"get":o==="setter"?"set":"value",h=!e&&i?n.static?i:i.prototype:null,d=e||(h?Object.getOwnPropertyDescriptor(h,n.name):{}),u,m=!1,p=t.length-1;p>=0;p--){var y={};for(var x in n)y[x]=x==="access"?{}:n[x];for(var x in n.access)y.access[x]=n.access[x];y.addInitializer=function(g){if(m)throw new TypeError("Cannot add initializers after decoration has completed");r.push(a(g||null))};var _=(0,t[p])(o==="accessor"?{get:d.get,set:d.set}:d[c],y);if(o==="accessor"){if(_===void 0)continue;if(_===null||typeof _!="object")throw new TypeError("Object expected");(u=a(_.get))&&(d.get=u),(u=a(_.set))&&(d.set=u),(u=a(_.init))&&s.unshift(u)}else(u=a(_))&&(o==="field"?s.unshift(u):d[c]=u)}h&&Object.defineProperty(h,n.name,d),m=!0}function Wd(i,e,t){for(var n=arguments.length>2,s=0;s<e.length;s++)t=n?e[s].call(i,t):e[s].call(i);return n?t:void 0}function $d(i){return typeof i=="symbol"?i:"".concat(i)}function Xd(i,e,t){return typeof e=="symbol"&&(e=e.description?"[".concat(e.description,"]"):""),Object.defineProperty(i,"name",{configurable:!0,value:t?"".concat(t," ",e):e})}function qd(i,e){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(i,e)}function jd(i,e,t,n){function s(r){return r instanceof t?r:new t(function(a){a(r)})}return new(t||(t=Promise))(function(r,a){function o(d){try{h(n.next(d))}catch(u){a(u)}}function c(d){try{h(n.throw(d))}catch(u){a(u)}}function h(d){d.done?r(d.value):s(d.value).then(o,c)}h((n=n.apply(i,e||[])).next())})}function Yd(i,e){var t={label:0,sent:function(){if(r[0]&1)throw r[1];return r[1]},trys:[],ops:[]},n,s,r,a=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return a.next=o(0),a.throw=o(1),a.return=o(2),typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function o(h){return function(d){return c([h,d])}}function c(h){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,h[0]&&(t=0)),t;)try{if(n=1,s&&(r=h[0]&2?s.return:h[0]?s.throw||((r=s.return)&&r.call(s),0):s.next)&&!(r=r.call(s,h[1])).done)return r;switch(s=0,r&&(h=[h[0]&2,r.value]),h[0]){case 0:case 1:r=h;break;case 4:return t.label++,{value:h[1],done:!1};case 5:t.label++,s=h[1],h=[0];continue;case 7:h=t.ops.pop(),t.trys.pop();continue;default:if(r=t.trys,!(r=r.length>0&&r[r.length-1])&&(h[0]===6||h[0]===2)){t=0;continue}if(h[0]===3&&(!r||h[1]>r[0]&&h[1]<r[3])){t.label=h[1];break}if(h[0]===6&&t.label<r[1]){t.label=r[1],r=h;break}if(r&&t.label<r[2]){t.label=r[2],t.ops.push(h);break}r[2]&&t.ops.pop(),t.trys.pop();continue}h=e.call(i,t)}catch(d){h=[6,d],s=0}finally{n=r=0}if(h[0]&5)throw h[1];return{value:h[0]?h[1]:void 0,done:!0}}}var bo=Object.create?(function(i,e,t,n){n===void 0&&(n=t);var s=Object.getOwnPropertyDescriptor(e,t);(!s||("get"in s?!e.__esModule:s.writable||s.configurable))&&(s={enumerable:!0,get:function(){return e[t]}}),Object.defineProperty(i,n,s)}):(function(i,e,t,n){n===void 0&&(n=t),i[n]=e[t]});function Kd(i,e){for(var t in i)t!=="default"&&!Object.prototype.hasOwnProperty.call(e,t)&&bo(e,i,t)}function ho(i){var e=typeof Symbol=="function"&&Symbol.iterator,t=e&&i[e],n=0;if(t)return t.call(i);if(i&&typeof i.length=="number")return{next:function(){return i&&n>=i.length&&(i=void 0),{value:i&&i[n++],done:!i}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function Hl(i,e){var t=typeof Symbol=="function"&&i[Symbol.iterator];if(!t)return i;var n=t.call(i),s,r=[],a;try{for(;(e===void 0||e-- >0)&&!(s=n.next()).done;)r.push(s.value)}catch(o){a={error:o}}finally{try{s&&!s.done&&(t=n.return)&&t.call(n)}finally{if(a)throw a.error}}return r}function Jd(){for(var i=[],e=0;e<arguments.length;e++)i=i.concat(Hl(arguments[e]));return i}function Zd(){for(var i=0,e=0,t=arguments.length;e<t;e++)i+=arguments[e].length;for(var n=Array(i),s=0,e=0;e<t;e++)for(var r=arguments[e],a=0,o=r.length;a<o;a++,s++)n[s]=r[a];return n}function Qd(i,e,t){if(t||arguments.length===2)for(var n=0,s=e.length,r;n<s;n++)(r||!(n in e))&&(r||(r=Array.prototype.slice.call(e,0,n)),r[n]=e[n]);return i.concat(r||Array.prototype.slice.call(e))}function sr(i){return this instanceof sr?(this.v=i,this):new sr(i)}function ef(i,e,t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=t.apply(i,e||[]),s,r=[];return s=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),o("next"),o("throw"),o("return",a),s[Symbol.asyncIterator]=function(){return this},s;function a(p){return function(y){return Promise.resolve(y).then(p,u)}}function o(p,y){n[p]&&(s[p]=function(x){return new Promise(function(_,g){r.push([p,x,_,g])>1||c(p,x)})},y&&(s[p]=y(s[p])))}function c(p,y){try{h(n[p](y))}catch(x){m(r[0][3],x)}}function h(p){p.value instanceof sr?Promise.resolve(p.value.v).then(d,u):m(r[0][2],p)}function d(p){c("next",p)}function u(p){c("throw",p)}function m(p,y){p(y),r.shift(),r.length&&c(r[0][0],r[0][1])}}function tf(i){var e,t;return e={},n("next"),n("throw",function(s){throw s}),n("return"),e[Symbol.iterator]=function(){return this},e;function n(s,r){e[s]=i[s]?function(a){return(t=!t)?{value:sr(i[s](a)),done:!1}:r?r(a):a}:r}}function nf(i){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=i[Symbol.asyncIterator],t;return e?e.call(i):(i=typeof ho=="function"?ho(i):i[Symbol.iterator](),t={},n("next"),n("throw"),n("return"),t[Symbol.asyncIterator]=function(){return this},t);function n(r){t[r]=i[r]&&function(a){return new Promise(function(o,c){a=i[r](a),s(o,c,a.done,a.value)})}}function s(r,a,o,c){Promise.resolve(c).then(function(h){r({value:h,done:o})},a)}}function sf(i,e){return Object.defineProperty?Object.defineProperty(i,"raw",{value:e}):i.raw=e,i}var mm=Object.create?(function(i,e){Object.defineProperty(i,"default",{enumerable:!0,value:e})}):function(i,e){i.default=e},Bc=function(i){return Bc=Object.getOwnPropertyNames||function(e){var t=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[t.length]=n);return t},Bc(i)};function rf(i){if(i&&i.__esModule)return i;var e={};if(i!=null)for(var t=Bc(i),n=0;n<t.length;n++)t[n]!=="default"&&bo(e,i,t[n]);return mm(e,i),e}function af(i){return i&&i.__esModule?i:{default:i}}function of(i,e,t,n){if(t==="a"&&!n)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?i!==e||!n:!e.has(i))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?n:t==="a"?n.call(i):n?n.value:e.get(i)}function cf(i,e,t,n,s){if(n==="m")throw new TypeError("Private method is not writable");if(n==="a"&&!s)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?i!==e||!s:!e.has(i))throw new TypeError("Cannot write private member to an object whose class did not declare it");return n==="a"?s.call(i,t):s?s.value=t:e.set(i,t),t}function lf(i,e){if(e===null||typeof e!="object"&&typeof e!="function")throw new TypeError("Cannot use 'in' operator on non-object");return typeof i=="function"?e===i:i.has(e)}function hf(i,e,t){if(e!=null){if(typeof e!="object"&&typeof e!="function")throw new TypeError("Object expected.");var n,s;if(t){if(!Symbol.asyncDispose)throw new TypeError("Symbol.asyncDispose is not defined.");n=e[Symbol.asyncDispose]}if(n===void 0){if(!Symbol.dispose)throw new TypeError("Symbol.dispose is not defined.");n=e[Symbol.dispose],t&&(s=n)}if(typeof n!="function")throw new TypeError("Object not disposable.");s&&(n=function(){try{s.call(this)}catch(r){return Promise.reject(r)}}),i.stack.push({value:e,dispose:n,async:t})}else t&&i.stack.push({async:!0});return e}var gm=typeof SuppressedError=="function"?SuppressedError:function(i,e,t){var n=new Error(t);return n.name="SuppressedError",n.error=i,n.suppressed=e,n};function uf(i){function e(r){i.error=i.hasError?new gm(r,i.error,"An error was suppressed during disposal."):r,i.hasError=!0}var t,n=0;function s(){for(;t=i.stack.pop();)try{if(!t.async&&n===1)return n=0,i.stack.push(t),Promise.resolve().then(s);if(t.dispose){var r=t.dispose.call(t.value);if(t.async)return n|=2,Promise.resolve(r).then(s,function(a){return e(a),s()})}else n|=1}catch(a){e(a)}if(n===1)return i.hasError?Promise.reject(i.error):Promise.resolve();if(i.hasError)throw i.error}return s()}function df(i,e){return typeof i=="string"&&/^\.\.?\//.test(i)?i.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,function(t,n,s,r,a){return n?e?".jsx":".js":s&&(!r||!a)?t:s+r+"."+a.toLowerCase()+"js"}):i}const vm={__extends:Bd,__assign:lo,__rest:zd,__decorate:Hd,__param:Vd,__esDecorate:Gd,__runInitializers:Wd,__propKey:$d,__setFunctionName:Xd,__metadata:qd,__awaiter:jd,__generator:Yd,__createBinding:bo,__exportStar:Kd,__values:ho,__read:Hl,__spread:Jd,__spreadArrays:Zd,__spreadArray:Qd,__await:sr,__asyncGenerator:ef,__asyncDelegator:tf,__asyncValues:nf,__makeTemplateObject:sf,__importStar:rf,__importDefault:af,__classPrivateFieldGet:of,__classPrivateFieldSet:cf,__classPrivateFieldIn:lf,__addDisposableResource:hf,__disposeResources:uf,__rewriteRelativeImportExtension:df},_m=Object.freeze(Object.defineProperty({__proto__:null,__addDisposableResource:hf,get __assign(){return lo},__asyncDelegator:tf,__asyncGenerator:ef,__asyncValues:nf,__await:sr,__awaiter:jd,__classPrivateFieldGet:of,__classPrivateFieldIn:lf,__classPrivateFieldSet:cf,__createBinding:bo,__decorate:Hd,__disposeResources:uf,__esDecorate:Gd,__exportStar:Kd,__extends:Bd,__generator:Yd,__importDefault:af,__importStar:rf,__makeTemplateObject:sf,__metadata:qd,__param:Vd,__propKey:$d,__read:Hl,__rest:zd,__rewriteRelativeImportExtension:df,__runInitializers:Wd,__setFunctionName:Xd,__spread:Jd,__spreadArray:Qd,__spreadArrays:Zd,__values:ho,default:vm},Symbol.toStringTag,{value:"Module"})),So=zl(_m);var ko={},Oh;function Mo(){return Oh||(Oh=1,(function(i){i.CloseCode=void 0,(function(n){n[n.CONSENTED=4e3]="CONSENTED",n[n.DEVMODE_RESTART=4010]="DEVMODE_RESTART"})(i.CloseCode||(i.CloseCode={}));class e extends Error{constructor(s,r){super(r),this.name="ServerError",this.code=s}}class t extends Error{constructor(s){super(s),this.name="AbortError"}}i.AbortError=t,i.ServerError=e})(ko)),ko}var Fo={},Bo={},zo={},Ur={exports:{}},ym=Ur.exports,Uh;function Vl(){return Uh||(Uh=1,(function(i,e){(function(t,n){n(e)})(ym,(function(t){t.OPERATION=void 0,(function(M){M[M.ADD=128]="ADD",M[M.REPLACE=0]="REPLACE",M[M.DELETE=64]="DELETE",M[M.DELETE_AND_MOVE=96]="DELETE_AND_MOVE",M[M.MOVE_AND_ADD=160]="MOVE_AND_ADD",M[M.DELETE_AND_ADD=192]="DELETE_AND_ADD",M[M.CLEAR=10]="CLEAR",M[M.REVERSE=15]="REVERSE",M[M.MOVE=32]="MOVE",M[M.DELETE_BY_REFID=33]="DELETE_BY_REFID",M[M.ADD_BY_REFID=129]="ADD_BY_REFID"})(t.OPERATION||(t.OPERATION={})),Symbol.metadata??(Symbol.metadata=Symbol.for("Symbol.metadata"));const r="~track",a="~encoder",o="~decoder",c="~filter",h="~getByIndex",d="~deleteByIndex",u="~changes",m="~childType",p="~onEncodeEnd",y="~onDecodeEnd",x="~descriptors",_="~__numFields",g="~__refTypeFieldIndexes",T="~__viewFieldIndexes",C="$__fieldIndexesByViewTag";let S;try{S=new TextEncoder}catch{}const U=new ArrayBuffer(8),O=new Int32Array(U),N=new Float32Array(U),P=new Float64Array(U),E=new BigInt64Array(U),B=typeof Buffer<"u"&&Buffer.byteLength?Buffer.byteLength:function(M,l){for(var f=0,v=0,b=0,D=M.length;b<D;b++)f=M.charCodeAt(b),f<128?v+=1:f<2048?v+=2:f<55296||f>=57344?v+=3:(b++,v+=4);return v};function Z(M,l,f){for(var v=0,b=0,D=l.length;b<D;b++)v=l.charCodeAt(b),v<128?M[f.offset++]=v:v<2048?(M[f.offset]=192|v>>6,M[f.offset+1]=128|v&63,f.offset+=2):v<55296||v>=57344?(M[f.offset]=224|v>>12,M[f.offset+1]=128|v>>6&63,M[f.offset+2]=128|v&63,f.offset+=3):(b++,v=65536+((v&1023)<<10|l.charCodeAt(b)&1023),M[f.offset]=240|v>>18,M[f.offset+1]=128|v>>12&63,M[f.offset+2]=128|v>>6&63,M[f.offset+3]=128|v&63,f.offset+=4)}function I(M,l,f){M[f.offset++]=l&255}function W(M,l,f){M[f.offset++]=l&255}function H(M,l,f){M[f.offset++]=l&255,M[f.offset++]=l>>8&255}function z(M,l,f){M[f.offset++]=l&255,M[f.offset++]=l>>8&255}function $(M,l,f){M[f.offset++]=l&255,M[f.offset++]=l>>8&255,M[f.offset++]=l>>16&255,M[f.offset++]=l>>24&255}function X(M,l,f){const v=l>>24,b=l>>16,D=l>>8,G=l;M[f.offset++]=G&255,M[f.offset++]=D&255,M[f.offset++]=b&255,M[f.offset++]=v&255}function de(M,l,f){const v=Math.floor(l/Math.pow(2,32)),b=l>>>0;X(M,b,f),X(M,v,f)}function fe(M,l,f){const v=l/Math.pow(2,32)>>0,b=l>>>0;X(M,b,f),X(M,v,f)}function Se(M,l,f){E[0]=BigInt.asIntN(64,l),$(M,O[0],f),$(M,O[1],f)}function ke(M,l,f){E[0]=BigInt.asIntN(64,l),$(M,O[0],f),$(M,O[1],f)}function lt(M,l,f){N[0]=l,$(M,O[0],f)}function mt(M,l,f){P[0]=l,$(M,O[0],f),$(M,O[1],f)}function pt(M,l,f){M[f.offset++]=l?1:0}function ue(M,l,f){l||(l="");let v=B(l,"utf8"),b=0;if(v<32)M[f.offset++]=v|160,b=1;else if(v<256)M[f.offset++]=217,M[f.offset++]=v%255,b=2;else if(v<65536)M[f.offset++]=218,z(M,v,f),b=3;else if(v<4294967296)M[f.offset++]=219,X(M,v,f),b=5;else throw new Error("String too long");return Z(M,l,f),b+v}function pe(M,l,f){if(isNaN(l))return pe(M,0,f);if(isFinite(l)){if(l!==(l|0))return Math.abs(l)<=34028235e31&&(N[0]=l,Math.abs(Math.abs(N[0])-Math.abs(l))<1e-4)?(M[f.offset++]=202,lt(M,l,f),5):(M[f.offset++]=203,mt(M,l,f),9)}else return pe(M,l>0?Number.MAX_SAFE_INTEGER:-Number.MAX_SAFE_INTEGER,f);return l>=0?l<128?(M[f.offset++]=l&255,1):l<256?(M[f.offset++]=204,M[f.offset++]=l&255,2):l<65536?(M[f.offset++]=205,z(M,l,f),3):l<4294967296?(M[f.offset++]=206,X(M,l,f),5):(M[f.offset++]=207,fe(M,l,f),9):l>=-32?(M[f.offset++]=224|l+32,1):l>=-128?(M[f.offset++]=208,I(M,l,f),2):l>=-32768?(M[f.offset++]=209,H(M,l,f),3):l>=-2147483648?(M[f.offset++]=210,$(M,l,f),5):(M[f.offset++]=211,de(M,l,f),9)}const Ae={int8:I,uint8:W,int16:H,uint16:z,int32:$,uint32:X,int64:de,uint64:fe,bigint64:Se,biguint64:ke,float32:lt,float64:mt,boolean:pt,string:ue,number:pe,utf8Write:Z,utf8Length:B},nt=new ArrayBuffer(8),Ge=new Int32Array(nt),gt=new Float32Array(nt),en=new Float64Array(nt),F=new BigUint64Array(nt),kt=new BigInt64Array(nt);function at(M,l,f){f>M.length-l.offset&&(f=M.length-l.offset);for(var v="",b=0,D=l.offset,G=l.offset+f;D<G;D++){var Q=M[D];if((Q&128)===0){v+=String.fromCharCode(Q);continue}if((Q&224)===192){v+=String.fromCharCode((Q&31)<<6|M[++D]&63);continue}if((Q&240)===224){v+=String.fromCharCode((Q&15)<<12|(M[++D]&63)<<6|(M[++D]&63)<<0);continue}if((Q&248)===240){b=(Q&7)<<18|(M[++D]&63)<<12|(M[++D]&63)<<6|(M[++D]&63)<<0,b>=65536?(b-=65536,v+=String.fromCharCode((b>>>10)+55296,(b&1023)+56320)):v+=String.fromCharCode(b);continue}console.error("decode.utf8Read(): Invalid byte "+Q+" at offset "+D+". Skip to end of string: "+(l.offset+f));break}return l.offset+=f,v}function it(M,l){return Be(M,l)<<24>>24}function Be(M,l){return M[l.offset++]}function Ot(M,l){return ze(M,l)<<16>>16}function ze(M,l){return M[l.offset++]|M[l.offset++]<<8}function Qe(M,l){return M[l.offset++]|M[l.offset++]<<8|M[l.offset++]<<16|M[l.offset++]<<24}function Ht(M,l){return Qe(M,l)>>>0}function Vt(M,l){return Ge[0]=Qe(M,l),gt[0]}function L(M,l){return Ge[0]=Qe(M,l),Ge[1]=Qe(M,l),en[0]}function w(M,l){const f=Ht(M,l);return Qe(M,l)*Math.pow(2,32)+f}function ee(M,l){const f=Ht(M,l);return Ht(M,l)*Math.pow(2,32)+f}function le(M,l){return Ge[0]=Qe(M,l),Ge[1]=Qe(M,l),kt[0]}function me(M,l){return Ge[0]=Qe(M,l),Ge[1]=Qe(M,l),F[0]}function re(M,l){return Be(M,l)>0}function je(M,l){const f=M[l.offset++];let v;return f<192?v=f&31:f===217?v=Be(M,l):f===218?v=ze(M,l):f===219&&(v=Ht(M,l)),at(M,l,v)}function Me(M,l){const f=M[l.offset++];if(f<128)return f;if(f===202)return Vt(M,l);if(f===203)return L(M,l);if(f===204)return Be(M,l);if(f===205)return ze(M,l);if(f===206)return Ht(M,l);if(f===207)return ee(M,l);if(f===208)return it(M,l);if(f===209)return Ot(M,l);if(f===210)return Qe(M,l);if(f===211)return w(M,l);if(f>223)return(255-f+1)*-1}function Xe(M,l){const f=M[l.offset];return f<192&&f>160||f===217||f===218||f===219}const Ne={utf8Read:at,int8:it,uint8:Be,int16:Ot,uint16:ze,int32:Qe,uint32:Ht,float32:Vt,float64:L,int64:w,uint64:ee,bigint64:le,biguint64:me,boolean:re,string:je,number:Me,stringCheck:Xe},xe={},Oe=new Map;function qe(M,l){l.constructor&&(Oe.set(l.constructor,M),xe[M]=l),l.encode&&(Ae[M]=l.encode),l.decode&&(Ne[M]=l.decode)}function $e(M){return xe[M]}function Re(M){for(const l in M)qe(l,M[l]);return l=>Ee(l)}const Kn=class Kn{static register(l){const f=Object.getPrototypeOf(l);if(f!==De){let v=Kn.inheritedTypes.get(f);v||(v=new Set,Kn.inheritedTypes.set(f,v)),v.add(l)}}static cache(l){let f=Kn.cachedContexts.get(l);return f||(f=new Kn(l),Kn.cachedContexts.set(l,f)),f}constructor(l){this.types={},this.schemas=new Map,this.hasFilters=!1,this.parentFiltered={},l&&this.discoverTypes(l)}has(l){return this.schemas.has(l)}get(l){return this.types[l]}add(l,f=this.schemas.size){return this.schemas.has(l)?!1:(this.types[f]=l,l[Symbol.metadata]===void 0&&ye.initialize(l),this.schemas.set(l,f),!0)}getTypeId(l){return this.schemas.get(l)}discoverTypes(l,f,v,b){var Q,J;if(b&&this.registerFilteredByParent(l,f,v),!this.add(l))return;(Q=Kn.inheritedTypes.get(l))==null||Q.forEach(se=>{this.discoverTypes(se,f,v,b)});let D=l;for(;(D=Object.getPrototypeOf(D))&&D!==De&&D!==Function.prototype;)this.discoverTypes(D);const G=l[J=Symbol.metadata]??(l[J]={});G[T]&&(this.hasFilters=!0);for(const se in G){const ce=se,ae=G[ce].type,he=G[ce].tag!==void 0;if(typeof ae!="string")if(typeof ae=="function")this.discoverTypes(ae,l,ce,b||he);else{const Le=Object.values(ae)[0];if(typeof Le=="string")continue;this.discoverTypes(Le,l,ce,b||he)}}}registerFilteredByParent(l,f,v){let D=`${this.schemas.get(l)??this.schemas.size}`;f&&(D+=`-${this.schemas.get(f)}`),D+=`-${v}`,this.parentFiltered[D]=!0}debug(){let l="";for(const f in this.parentFiltered){const v=f.split("-").map(Number),b=v.pop();l+=`
		`,l+=`${f}: ${v.reverse().map((D,G)=>{const Q=this.types[D],J=Q[Symbol.metadata];let se=Q.name;return G===0&&(se+=`[${J[b].name}]`),`${se}`}).join(" -> ")}`}return`TypeContext ->
	Schema types: ${this.schemas.size}
	hasFilters: ${this.hasFilters}
	parentFiltered:${l}`}};Kn.inheritedTypes=new Map,Kn.cachedContexts=new Map;let et=Kn;function V(M){if(Array.isArray(M))return{array:V(M[0])};if(typeof M.type<"u")return M.type;if(be(M))return Object.keys(M).every(l=>typeof M[l]=="string")?"string":"number";if(typeof M=="object"&&M!==null){const l=Object.keys(M).find(f=>xe[f]!==void 0);if(l)return M[l]=V(M[l]),M}return M}function be(M){if(typeof M=="function"&&M[Symbol.metadata])return!1;const l=Object.keys(M),f=l.filter(v=>/\d+/.test(v));return!!(f.length>0&&f.length===l.length/2&&M[M[f[0]]]==f[0]||l.length>0&&l.every(v=>typeof M[v]=="string"&&M[v]===v))}const ye={addField(M,l,f,v,b){if(l>64)throw new Error(`Can't define field '${f}'.
Schema instances may only have up to 64 fields.`);M[l]=Object.assign(M[l]||{},{type:V(v),index:l,name:f}),Object.defineProperty(M,x,{value:M[x]||{},enumerable:!1,configurable:!0}),b?(M[x][f]=b,M[x][`_${f}`]={value:void 0,writable:!0,enumerable:!1,configurable:!0}):M[x][f]={value:void 0,writable:!0,enumerable:!0,configurable:!0},Object.defineProperty(M,_,{value:l,enumerable:!1,configurable:!0}),Object.defineProperty(M,f,{value:l,enumerable:!1,configurable:!0}),typeof M[l].type!="string"&&(M[g]===void 0&&Object.defineProperty(M,g,{value:[],enumerable:!1,configurable:!0}),M[g].push(l))},setTag(M,l,f){const v=M[l],b=M[v];b.tag=f,M[T]||(Object.defineProperty(M,T,{value:[],enumerable:!1,configurable:!0}),Object.defineProperty(M,C,{value:{},enumerable:!1,configurable:!0})),M[T].push(v),M[C][f]||(M[C][f]=[]),M[C][f].push(v)},setFields(M,l){const f=M.prototype.constructor;et.register(f);const v=Object.getPrototypeOf(f),b=v&&v[Symbol.metadata],D=ye.initialize(f);f[r]||(f[r]=De[r]),f[a]||(f[a]=De[a]),f[o]||(f[o]=De[o]),f.prototype.toJSON||(f.prototype.toJSON=De.prototype.toJSON);let G=D[_]??(b&&b[_])??-1;G++;for(const Q in l){const J=V(l[Q]),se=typeof Object.keys(J)[0]=="string"&&$e(Object.keys(J)[0]),ce=se?Object.values(J)[0]:J;ye.addField(D,G,Q,J,tt(`_${Q}`,G,ce,se)),G++}return M},isDeprecated(M,l){return M[l].deprecated===!0},init(M){const l={};M[Symbol.metadata]=l,Object.defineProperty(l,_,{value:0,enumerable:!1,configurable:!0})},initialize(M){const l=Object.getPrototypeOf(M),f=l[Symbol.metadata];let v=M[Symbol.metadata]??Object.create(null);return l!==De&&v===f&&(v=Object.create(null),f&&(Object.setPrototypeOf(v,f),Object.defineProperty(v,_,{value:f[_],enumerable:!1,configurable:!0,writable:!0}),f[T]!==void 0&&(Object.defineProperty(v,T,{value:[...f[T]],enumerable:!1,configurable:!0,writable:!0}),Object.defineProperty(v,C,{value:{...f[C]},enumerable:!1,configurable:!0,writable:!0})),f[g]!==void 0&&Object.defineProperty(v,g,{value:[...f[g]],enumerable:!1,configurable:!0,writable:!0}),Object.defineProperty(v,x,{value:{...f[x]},enumerable:!1,configurable:!0,writable:!0}))),Object.defineProperty(M,Symbol.metadata,{value:v,writable:!1,configurable:!0}),v},isValidInstance(M){return M.constructor[Symbol.metadata]&&Object.prototype.hasOwnProperty.call(M.constructor[Symbol.metadata],_)},getFields(M){const l=M[Symbol.metadata],f={};for(let v=0;v<=l[_];v++)f[l[v].name]=l[v].type;return f},hasViewTagAtIndex(M,l){var f;return(f=M==null?void 0:M[T])==null?void 0:f.includes(l)}};function Ue(M){return{indexes:{},operations:[],queueRootNode:M}}function _e(){return{next:void 0,tail:void 0}}function oe(M,l){const f=M.indexes[l];f===void 0?M.indexes[l]=M.operations.push(l)-1:M.operations[f]=l}function We(M,l){var v;let f=M.indexes[l];f===void 0&&(f=Object.values(M.indexes).at(-1),l=(v=Object.entries(M.indexes).find(([b,D])=>D===f))==null?void 0:v[0]),M.operations[f]=void 0,delete M.indexes[l]}class st{constructor(l){var f;this.isFiltered=!1,this.indexedOperations={},this.changes={indexes:{},operations:[]},this.allChanges={indexes:{},operations:[]},this.isNew=!0,this.ref=l,this.metadata=l.constructor[Symbol.metadata],(f=this.metadata)!=null&&f[T]&&(this.allFilteredChanges={indexes:{},operations:[]},this.filteredChanges={indexes:{},operations:[]})}setRoot(l){this.root=l;const f=this.root.add(this);this.checkIsFiltered(this.parent,this.parentIndex,f),f&&this.forEachChild((v,b)=>{v.root!==l?v.setRoot(l):l.add(v)})}setParent(l,f,v){if(this.addParent(l,v),!f)return;const b=f.add(this);f!==this.root&&(this.root=f,this.checkIsFiltered(l,v,b)),b&&this.forEachChild((D,G)=>{if(D.root===f){f.add(D),f.moveNextToParent(D);return}D.setParent(this.ref,f,G)})}forEachChild(l){var f,v;if(this.ref[m]){if(typeof this.ref[m]!="string")for(const[b,D]of this.ref.entries())D&&l(D[u],((f=this.indexes)==null?void 0:f[b])??b)}else for(const b of((v=this.metadata)==null?void 0:v[g])??[]){const D=this.metadata[b],G=this.ref[D.name];G&&l(G[u],b)}}operation(l){var f,v;this.filteredChanges!==void 0?(this.filteredChanges.operations.push(-l),(f=this.root)==null||f.enqueueChangeTree(this,"filteredChanges")):(this.changes.operations.push(-l),(v=this.root)==null||v.enqueueChangeTree(this,"changes"))}change(l,f=t.OPERATION.ADD){var G,Q,J;const v=this.isFiltered||((Q=(G=this.metadata)==null?void 0:G[l])==null?void 0:Q.tag)!==void 0,b=v?this.filteredChanges:this.changes,D=this.indexedOperations[l];if(!D||D===t.OPERATION.DELETE){const se=D&&D===t.OPERATION.DELETE?t.OPERATION.DELETE_AND_ADD:f;this.indexedOperations[l]=se}oe(b,l),v?(oe(this.allFilteredChanges,l),this.root&&(this.root.enqueueChangeTree(this,"filteredChanges"),this.root.enqueueChangeTree(this,"allFilteredChanges"))):(oe(this.allChanges,l),(J=this.root)==null||J.enqueueChangeTree(this,"changes"))}shiftChangeIndexes(l){const f=this.isFiltered?this.filteredChanges:this.changes,v={},b={};for(const D in this.indexedOperations)v[Number(D)+l]=this.indexedOperations[D],b[Number(D)+l]=f.indexes[D];this.indexedOperations=v,f.indexes=b,f.operations=f.operations.map(D=>D+l)}shiftAllChangeIndexes(l,f=0){this.filteredChanges!==void 0?(this._shiftAllChangeIndexes(l,f,this.allFilteredChanges),this._shiftAllChangeIndexes(l,f,this.allChanges)):this._shiftAllChangeIndexes(l,f,this.allChanges)}_shiftAllChangeIndexes(l,f=0,v){const b={};let D=0;for(const G in v.indexes)b[D++]=v.indexes[G];v.indexes=b;for(let G=0;G<v.operations.length;G++){const Q=v.operations[G];Q>f&&(v.operations[G]=Q+l)}}indexedOperation(l,f,v=l){var b,D;this.indexedOperations[l]=f,this.filteredChanges!==void 0?(oe(this.allFilteredChanges,v),oe(this.filteredChanges,l),(b=this.root)==null||b.enqueueChangeTree(this,"filteredChanges")):(oe(this.allChanges,v),oe(this.changes,l),(D=this.root)==null||D.enqueueChangeTree(this,"changes"))}getType(l){return this.ref[m]||this.metadata[l].type}getChange(l){return this.indexedOperations[l]}getValue(l,f=!1){return this.ref[h](l,f)}delete(l,f,v=l){var G,Q,J;if(l===void 0){try{throw new Error(`@colyseus/schema ${this.ref.constructor.name}: trying to delete non-existing index '${l}'`)}catch(se){console.warn(se)}return}const b=this.filteredChanges!==void 0?this.filteredChanges:this.changes;this.indexedOperations[l]=f??t.OPERATION.DELETE,oe(b,l),We(this.allChanges,v);const D=this.getValue(l);return D&&D[u]&&((G=this.root)==null||G.remove(D[u])),this.filteredChanges!==void 0?(We(this.allFilteredChanges,v),(Q=this.root)==null||Q.enqueueChangeTree(this,"filteredChanges")):(J=this.root)==null||J.enqueueChangeTree(this,"changes"),D}endEncode(l){var f,v;this.indexedOperations={},this[l]=Ue(),(v=(f=this.ref)[p])==null||v.call(f),this.isNew=!1}discard(l=!1){var f,v;(v=(f=this.ref)[p])==null||v.call(f),this.indexedOperations={},this.changes=Ue(this.changes.queueRootNode),this.filteredChanges!==void 0&&(this.filteredChanges=Ue(this.filteredChanges.queueRootNode)),l&&(this.allChanges=Ue(this.allChanges.queueRootNode),this.allFilteredChanges!==void 0&&(this.allFilteredChanges=Ue(this.allFilteredChanges.queueRootNode)))}discardAll(){const l=Object.keys(this.indexedOperations);for(let f=0,v=l.length;f<v;f++){const b=this.getValue(Number(l[f]));b&&b[u]&&b[u].discardAll()}this.discard()}get changed(){return Object.entries(this.indexedOperations).length>0}checkIsFiltered(l,f,v){var b,D,G,Q;this.root.types.hasFilters&&(this._checkFilteredByParent(l,f),this.filteredChanges!==void 0&&((b=this.root)==null||b.enqueueChangeTree(this,"filteredChanges"),v&&((D=this.root)==null||D.enqueueChangeTree(this,"allFilteredChanges")))),this.isFiltered||((G=this.root)==null||G.enqueueChangeTree(this,"changes"),v&&((Q=this.root)==null||Q.enqueueChangeTree(this,"allChanges")))}_checkFilteredByParent(l,f){if(!l)return;const v=ye.isValidInstance(this.ref)?this.ref.constructor:this.ref[m];let b,D=!ye.isValidInstance(l);D?(b=l[u],l=b.parent,f=b.parentIndex):b=l[u];const G=l.constructor;let Q=`${this.root.types.getTypeId(v)}`;G&&(Q+=`-${this.root.types.schemas.get(G)}`),Q+=`-${f}`;const J=ye.hasViewTagAtIndex(G==null?void 0:G[Symbol.metadata],f);this.isFiltered=l[u].isFiltered||this.root.types.parentFiltered[Q]||J,this.isFiltered&&(this.isVisibilitySharedWithParent=b.isFiltered&&typeof v!="string"&&!J&&D,this.filteredChanges||(this.filteredChanges=Ue(),this.allFilteredChanges=Ue()),this.changes.operations.length>0&&(this.changes.operations.forEach(se=>oe(this.filteredChanges,se)),this.allChanges.operations.forEach(se=>oe(this.allFilteredChanges,se)),this.changes=Ue(),this.allChanges=Ue()))}get parent(){var l;return(l=this.parentChain)==null?void 0:l.ref}get parentIndex(){var l;return(l=this.parentChain)==null?void 0:l.index}addParent(l,f){if(this.hasParent((v,b)=>v[u]===l[u])){this.parentChain.index=f;return}this.parentChain={ref:l,index:f,next:this.parentChain}}removeParent(l=this.parent){let f=this.parentChain,v=null;for(;f;){if(f.ref[u]===l[u])return v?v.next=f.next:this.parentChain=f.next,!0;v=f,f=f.next}return this.parentChain===void 0}findParent(l){let f=this.parentChain;for(;f;){if(l(f.ref,f.index))return f;f=f.next}}hasParent(l){return this.findParent(l)!==void 0}getAllParents(){const l=[];let f=this.parentChain;for(;f;)l.push({ref:f.ref,index:f.index}),f=f.next;return l}}function Tt(M,l,f,v,b,D){var G;typeof f=="string"?(G=Ae[f])==null||G.call(Ae,l,v,D):f[Symbol.metadata]!==void 0?(Ae.number(l,v[u].refId,D),(b&t.OPERATION.ADD)===t.OPERATION.ADD&&M.tryEncodeTypeId(l,f,v.constructor,D)):Ae.number(l,v[u].refId,D)}const xt=function(M,l,f,v,b,D,G,Q,J){if(l[D.offset++]=(v|b)&255,b===t.OPERATION.DELETE)return;const se=f.ref,ce=J[v];Tt(M,l,J[v].type,se[ce.name],b,D)},xn=function(M,l,f,v,b,D){if(l[D.offset++]=b&255,Ae.number(l,v,D),b===t.OPERATION.DELETE)return;const G=f.ref;if((b&t.OPERATION.ADD)===t.OPERATION.ADD&&typeof G.set=="function"){const se=f.ref.$indexes.get(v);Ae.string(l,se,D)}const Q=G[m],J=G[h](v);Tt(M,l,Q,J,b,D)},En=function(M,l,f,v,b,D,G,Q){const J=f.ref,se=Q&&f.isFiltered&&typeof f.getType(v)!="string";let ce;if(se){const Le=J.tmpItems[v];if(!Le)return;ce=Le[u].refId,b===t.OPERATION.DELETE?b=t.OPERATION.DELETE_BY_REFID:b===t.OPERATION.ADD&&(b=t.OPERATION.ADD_BY_REFID)}else ce=v;if(l[D.offset++]=b&255,Ae.number(l,ce,D),b===t.OPERATION.DELETE||b===t.OPERATION.DELETE_BY_REFID)return;const ae=f.getType(v),he=f.getValue(v,G);Tt(M,l,ae,he,b,D)},gr=-1;function Fn(M,l,f,v,b,D,G,Q){const J=M.root,se=f[h](v);let ce;if((l&t.OPERATION.DELETE)===t.OPERATION.DELETE){const ae=J.refIds.get(se);ae!==void 0&&J.removeRef(ae),l!==t.OPERATION.DELETE_AND_ADD&&f[d](v),ce=void 0}if(l!==t.OPERATION.DELETE)if(De.is(b)){const ae=Ne.number(D,G);if(ce=J.refs.get(ae),(l&t.OPERATION.ADD)===t.OPERATION.ADD){const he=M.getInstanceType(D,G,b);ce||(ce=M.createInstanceOfType(he)),J.addRef(ae,ce,ce!==se||l===t.OPERATION.DELETE_AND_ADD&&ce===se)}}else if(typeof b=="string")ce=Ne[b](D,G);else{const ae=$e(Object.keys(b)[0]),he=Ne.number(D,G),Le=J.refs.has(he)?se||J.refs.get(he):new ae.constructor;if(ce=Le.clone(!0),ce[m]=Object.values(b)[0],se){let Fe=J.refIds.get(se);if(Fe!==void 0&&he!==Fe){const we=se.entries();let ve;for(;(ve=we.next())&&!ve.done;){const[Ve,Rt]=ve.value;typeof Rt=="object"&&(Fe=J.refIds.get(Rt),J.removeRef(Fe)),Q.push({ref:se,refId:Fe,op:t.OPERATION.DELETE,field:Ve,value:void 0,previousValue:Rt})}}}J.addRef(he,ce,Le!==se||l===t.OPERATION.DELETE_AND_ADD&&Le===se)}return{value:ce,previousValue:se}}const bs=function(M,l,f,v,b){const D=l[f.offset++],G=v.constructor[Symbol.metadata],Q=D>>6<<6,J=D%(Q||255),se=G[J];if(se===void 0)return console.warn("@colyseus/schema: field not defined at",{index:J,ref:v.constructor.name,metadata:G}),gr;const{value:ce,previousValue:ae}=Fn(M,Q,v,J,se.type,l,f,b);ce!=null&&(v[se.name]=ce),ae!==ce&&b.push({ref:v,refId:M.currentRefId,op:Q,field:se.name,value:ce,previousValue:ae})},qi=function(M,l,f,v,b){const D=l[f.offset++];if(D===t.OPERATION.CLEAR){M.removeChildRefs(v,b),v.clear();return}const G=Ne.number(l,f),Q=v[m];let J;(D&t.OPERATION.ADD)===t.OPERATION.ADD?typeof v.set=="function"?(J=Ne.string(l,f),v.setIndex(G,J)):J=G:J=v.getIndex(G);const{value:se,previousValue:ce}=Fn(M,D,v,G,Q,l,f,b);if(se!=null){if(typeof v.set=="function")v.$items.set(J,se);else if(typeof v.$setAt=="function")v.$setAt(G,se,D);else if(typeof v.add=="function"){const ae=v.add(se);typeof ae=="number"&&v.setIndex(ae,ae)}}ce!==se&&b.push({ref:v,refId:M.currentRefId,op:D,field:"",dynamicIndex:J,value:se,previousValue:ce})},la=function(M,l,f,v,b){let D=l[f.offset++],G;if(D===t.OPERATION.CLEAR){M.removeChildRefs(v,b),v.clear();return}else if(D===t.OPERATION.REVERSE){v.reverse();return}else if(D===t.OPERATION.DELETE_BY_REFID){const ae=Ne.number(l,f),he=M.root.refs.get(ae);G=v.findIndex(Le=>Le===he),v[d](G),b.push({ref:v,refId:M.currentRefId,op:t.OPERATION.DELETE,field:"",dynamicIndex:G,value:void 0,previousValue:he});return}else if(D===t.OPERATION.ADD_BY_REFID){const ae=Ne.number(l,f),he=M.root.refs.get(ae);he&&(G=v.findIndex(Le=>Le===he)),(G===-1||G===void 0)&&(G=v.length)}else G=Ne.number(l,f);const Q=v[m];let J=G;const{value:se,previousValue:ce}=Fn(M,D,v,G,Q,l,f,b);se!=null&&se!==ce&&v.$setAt(G,se,D),ce!==se&&b.push({ref:v,refId:M.currentRefId,op:D,field:"",dynamicIndex:J,value:se,previousValue:ce})};class ji extends Error{}function ha(M,l,f,v){let b,D=!1;switch(l){case"number":case"int8":case"uint8":case"int16":case"uint16":case"int32":case"uint32":case"int64":case"uint64":case"float32":case"float64":b="number",isNaN(M)&&console.log(`trying to encode "NaN" in ${f.constructor.name}#${v}`);break;case"bigint64":case"biguint64":b="bigint";break;case"string":b="string",D=!0;break;case"boolean":return;default:return}if(typeof M!==b&&(!D||D&&M!==null)){let G=`'${JSON.stringify(M)}'${M&&M.constructor&&` (${M.constructor.name})`||""}`;throw new ji(`a '${b}' was expected, but ${G} was provided in ${f.constructor.name}#${v}`)}}function ci(M,l,f,v){if(!(M instanceof l))throw new ji(`a '${l.name}' was expected, but '${M&&M.constructor.name}' was provided in ${f.constructor.name}#${v}`)}var vr,_r;const Oo=(M,l)=>{const f=M.toString(),v=l.toString();return f<v?-1:f>v?1:0},zn=class zn{static[(vr=a,_r=o,c)](l,f,v){var b;return!v||typeof l[m]=="string"||v.isChangeTreeVisible((b=l.tmpItems[f])==null?void 0:b[u])}static is(l){return Array.isArray(l)||l.array!==void 0}static from(l){return new zn(...Array.from(l))}constructor(...l){this.items=[],this.tmpItems=[],this.deletedIndexes={},this.isMovingItems=!1,Object.defineProperty(this,m,{value:void 0,enumerable:!1,writable:!0,configurable:!0});const f=new Proxy(this,{get:(v,b)=>typeof b!="symbol"&&!isNaN(b)?this.items[b]:Reflect.get(v,b),set:(v,b,D)=>{var G;if(typeof b!="symbol"&&!isNaN(b)){if(D==null)v.$deleteAt(b);else{if(D[u]){ci(D,v[m],v,b);const Q=v.items[b];v.isMovingItems?(Q!==void 0?D[u].isNew?v[u].indexedOperation(Number(b),t.OPERATION.MOVE_AND_ADD):(v[u].getChange(Number(b))&t.OPERATION.DELETE)===t.OPERATION.DELETE?v[u].indexedOperation(Number(b),t.OPERATION.DELETE_AND_MOVE):v[u].indexedOperation(Number(b),t.OPERATION.MOVE):D[u].isNew&&v[u].indexedOperation(Number(b),t.OPERATION.ADD),D[u].setParent(this,v[u].root,b)):v.$changeAt(Number(b),D),Q!==void 0&&((G=Q[u].root)==null||G.remove(Q[u]))}else v.$changeAt(Number(b),D);v.items[b]=D,v.tmpItems[b]=D}return!0}else return Reflect.set(v,b,D)},deleteProperty:(v,b)=>(typeof b=="number"?v.$deleteAt(b):delete v[b],!0),has:(v,b)=>typeof b!="symbol"&&!isNaN(Number(b))?Reflect.has(this.items,b):Reflect.has(v,b)});return Object.defineProperty(this,u,{value:new st(f),enumerable:!1,writable:!0}),l.length>0&&this.push(...l),f}set length(l){l===0?this.clear():l<this.items.length?this.splice(l,this.length-l):console.warn("ArraySchema: can't set .length to a higher value than its length.")}get length(){return this.items.length}push(...l){var b;let f=this.tmpItems.length;const v=this[u];for(let D=0,G=l.length;D<G;D++,f++){const Q=l[D];if(Q==null)return;typeof Q=="object"&&this[m]&&ci(Q,this[m],this,D),v.indexedOperation(f,t.OPERATION.ADD,this.items.length),this.items.push(Q),this.tmpItems.push(Q),(b=Q[u])==null||b.setParent(this,v.root,f)}return f}pop(){let l=-1;for(let f=this.tmpItems.length-1;f>=0;f--)if(this.deletedIndexes[f]!==!0){l=f;break}if(!(l<0))return this[u].delete(l,void 0,this.items.length-1),this.deletedIndexes[l]=!0,this.items.pop()}at(l){return l<0&&(l+=this.length),this.items[l]}$changeAt(l,f){var D;if(f==null){console.error("ArraySchema items cannot be null nor undefined; Use `deleteAt(index)` instead.");return}if(this.items[l]===f)return;const v=this.items[l]!==void 0?typeof f=="object"?t.OPERATION.DELETE_AND_ADD:t.OPERATION.REPLACE:t.OPERATION.ADD,b=this[u];b.change(l,v),(D=f[u])==null||D.setParent(this,b.root,l)}$deleteAt(l,f){this[u].delete(l,f)}$setAt(l,f,v){l===0&&v===t.OPERATION.ADD&&this.items[l]!==void 0?this.items.unshift(f):v===t.OPERATION.DELETE_AND_MOVE?(this.items.splice(l,1),this.items[l]=f):this.items[l]=f}clear(){if(this.items.length===0)return;const l=this[u];l.forEachChild((f,v)=>{var b;(b=l.root)==null||b.remove(f)}),l.discard(!0),l.operation(t.OPERATION.CLEAR),this.items.length=0,this.tmpItems.length=0}concat(...l){return new zn(...this.items.concat(...l))}join(l){return this.items.join(l)}reverse(){return this[u].operation(t.OPERATION.REVERSE),this.items.reverse(),this.tmpItems.reverse(),this}shift(){if(this.items.length===0)return;const l=this[u],f=this.tmpItems.findIndex(b=>b===this.items[0]),v=this.items.findIndex(b=>b===this.items[0]);return l.delete(f,t.OPERATION.DELETE,v),l.shiftAllChangeIndexes(-1,v),this.deletedIndexes[f]=!0,this.items.shift()}slice(l,f){const v=new zn;return v.push(...this.items.slice(l,f)),v}sort(l=Oo){this.isMovingItems=!0;const f=this[u];return this.items.sort(l).forEach((b,D)=>f.change(D,t.OPERATION.REPLACE)),this.tmpItems.sort(l),this.isMovingItems=!1,this}splice(l,f,...v){var se,ce,ae;const b=this[u],D=this.items.length,G=this.tmpItems.length,Q=v.length,J=[];for(let he=0;he<G;he++)this.deletedIndexes[he]!==!0&&J.push(he);if(D>l){f===void 0&&(f=D-l);for(let he=l;he<l+f;he++){const Le=J[he];b.delete(Le,t.OPERATION.DELETE),this.deletedIndexes[Le]=!0}}else f=0;if(Q>0){if(Q>f)throw console.error("Inserting more elements than deleting during ArraySchema#splice()"),new Error("ArraySchema#splice(): insertCount must be equal or lower than deleteCount.");for(let he=0;he<Q;he++){const Le=(J[l]??D)+he;b.indexedOperation(Le,this.deletedIndexes[Le]?t.OPERATION.DELETE_AND_ADD:t.OPERATION.ADD),(se=v[he][u])==null||se.setParent(this,b.root,Le)}}return f>Q&&b.shiftAllChangeIndexes(-(f-Q),J[l+Q]),b.filteredChanges!==void 0?(ce=b.root)==null||ce.enqueueChangeTree(b,"filteredChanges"):(ae=b.root)==null||ae.enqueueChangeTree(b,"changes"),this.items.splice(l,f,...v)}unshift(...l){const f=this[u];return f.shiftChangeIndexes(l.length),f.isFiltered?oe(f.filteredChanges,this.items.length):oe(f.allChanges,this.items.length),l.forEach((v,b)=>{f.change(b,t.OPERATION.ADD)}),this.tmpItems.unshift(...l),this.items.unshift(...l)}indexOf(l,f){return this.items.indexOf(l,f)}lastIndexOf(l,f=this.length-1){return this.items.lastIndexOf(l,f)}every(l,f){return this.items.every(l,f)}some(l,f){return this.items.some(l,f)}forEach(l,f){return this.items.forEach(l,f)}map(l,f){return this.items.map(l,f)}filter(l,f){return this.items.filter(l,f)}reduce(l,f){return this.items.reduce(l,f)}reduceRight(l,f){return this.items.reduceRight(l,f)}find(l,f){return this.items.find(l,f)}findIndex(l,f){return this.items.findIndex(l,f)}fill(l,f,v){throw new Error("ArraySchema#fill() not implemented")}copyWithin(l,f,v){throw new Error("ArraySchema#copyWithin() not implemented")}toString(){return this.items.toString()}toLocaleString(){return this.items.toLocaleString()}[Symbol.iterator](){return this.items[Symbol.iterator]()}static get[Symbol.species](){return zn}entries(){return this.items.entries()}keys(){return this.items.keys()}values(){return this.items.values()}includes(l,f){return this.items.includes(l,f)}flatMap(l,f){throw new Error("ArraySchema#flatMap() is not supported.")}flat(l){throw new Error("ArraySchema#flat() is not supported.")}findLast(){return this.items.findLast.apply(this.items,arguments)}findLastIndex(...l){return this.items.findLastIndex.apply(this.items,arguments)}with(l,f){const v=this.items.slice();return l<0&&(l+=this.length),v[l]=f,new zn(...v)}toReversed(){return this.items.slice().reverse()}toSorted(l){return this.items.slice().sort(l)}toSpliced(l,f,...v){return this.items.toSpliced.apply(copy,arguments)}shuffle(){return this.move(l=>{let f=this.items.length;for(;f!=0;){let v=Math.floor(Math.random()*f);f--,[this[f],this[v]]=[this[v],this[f]]}})}move(l){return this.isMovingItems=!0,l(this),this.isMovingItems=!1,this}[h](l,f=!1){return f?this.items[l]:this.deletedIndexes[l]?this.items[l]:this.tmpItems[l]||this.items[l]}[d](l){this.items[l]=void 0,this.tmpItems[l]=void 0}[p](){this.tmpItems=this.items.slice(),this.deletedIndexes={}}[y](){this.items=this.items.filter(l=>l!==void 0),this.tmpItems=this.items.slice()}toArray(){return this.items.slice(0)}toJSON(){return this.toArray().map(l=>typeof l.toJSON=="function"?l.toJSON():l)}clone(l){let f;return l?(f=new zn,f.push(...this.items)):f=new zn(...this.map(v=>v[u]?v.clone():v)),f}};zn[vr]=En,zn[_r]=la;let Tn=zn;qe("array",{constructor:Tn});var ua,da;const Ri=class Ri{static[(ua=a,da=o,c)](l,f,v){return!v||typeof l[m]=="string"||v.isChangeTreeVisible((l[h](f)??l.deletedItems[f])[u])}static is(l){return l.map!==void 0}constructor(l){this.$items=new Map,this.$indexes=new Map,this.deletedItems={};const f=new st(this);if(f.indexes={},Object.defineProperty(this,u,{value:f,enumerable:!1,writable:!0}),l)if(l instanceof Map||l instanceof Ri)l.forEach((v,b)=>this.set(b,v));else for(const v in l)this.set(v,l[v]);Object.defineProperty(this,m,{value:void 0,enumerable:!1,writable:!0,configurable:!0})}[Symbol.iterator](){return this.$items[Symbol.iterator]()}get[Symbol.toStringTag](){return this.$items[Symbol.toStringTag]}static get[Symbol.species](){return Ri}set(l,f){var Q;if(f==null)throw new Error(`MapSchema#set('${l}', ${f}): trying to set ${f} value on '${l}'.`);typeof f=="object"&&this[m]&&ci(f,this[m],this,l),l=l.toString();const v=this[u],b=f[u]!==void 0;let D,G;if(typeof v.indexes[l]<"u"){D=v.indexes[l],G=t.OPERATION.REPLACE;const J=this.$items.get(l);if(J===f)return;b&&(G=t.OPERATION.DELETE_AND_ADD,J!==void 0&&((Q=J[u].root)==null||Q.remove(J[u]))),this.deletedItems[D]&&delete this.deletedItems[D]}else D=v.indexes[_]??0,G=t.OPERATION.ADD,this.$indexes.set(D,l),v.indexes[l]=D,v.indexes[_]=D+1;return this.$items.set(l,f),v.change(D,G),b&&f[u].setParent(this,v.root,D),this}get(l){return this.$items.get(l)}delete(l){if(!this.$items.has(l))return!1;const f=this[u].indexes[l];return this.deletedItems[f]=this[u].delete(f),this.$items.delete(l)}clear(){const l=this[u];l.discard(!0),l.indexes={},l.forEachChild((f,v)=>{var b;(b=l.root)==null||b.remove(f)}),this.$indexes.clear(),this.$items.clear(),l.operation(t.OPERATION.CLEAR)}has(l){return this.$items.has(l)}forEach(l){this.$items.forEach(l)}entries(){return this.$items.entries()}keys(){return this.$items.keys()}values(){return this.$items.values()}get size(){return this.$items.size}setIndex(l,f){this.$indexes.set(l,f)}getIndex(l){return this.$indexes.get(l)}[h](l){return this.$items.get(this.$indexes.get(l))}[d](l){const f=this.$indexes.get(l);this.$items.delete(f),this.$indexes.delete(l)}[p](){const l=this[u];for(const f in this.deletedItems){const v=parseInt(f),b=this.$indexes.get(v);delete l.indexes[b],this.$indexes.delete(v)}this.deletedItems={}}toJSON(){const l={};return this.forEach((f,v)=>{l[v]=typeof f.toJSON=="function"?f.toJSON():f}),l}clone(l){let f;return l?f=Object.assign(new Ri,this):(f=new Ri,this.forEach((v,b)=>{v[u]?f.set(b,v.clone()):f.set(b,v)})),f}};Ri[ua]=xn,Ri[da]=qi;let Bn=Ri;qe("map",{constructor:Bn});var fa,R;const Ss=class Ss{static[(fa=a,R=o,c)](l,f,v){return!v||typeof l[m]=="string"||v.isChangeTreeVisible((l[h](f)??l.deletedItems[f])[u])}static is(l){return l.collection!==void 0}constructor(l){this.$items=new Map,this.$indexes=new Map,this.deletedItems={},this.$refId=0,this[u]=new st(this),this[u].indexes={},l&&l.forEach(f=>this.add(f)),Object.defineProperty(this,m,{value:void 0,enumerable:!1,writable:!0,configurable:!0})}add(l){const f=this.$refId++;return l[u]!==void 0&&l[u].setParent(this,this[u].root,f),this[u].indexes[f]=f,this.$indexes.set(f,f),this.$items.set(f,l),this[u].change(f),f}at(l){const f=Array.from(this.$items.keys())[l];return this.$items.get(f)}entries(){return this.$items.entries()}delete(l){const f=this.$items.entries();let v,b;for(;(b=f.next())&&!b.done;)if(l===b.value[1]){v=b.value[0];break}return v===void 0?!1:(this.deletedItems[v]=this[u].delete(v),this.$indexes.delete(v),this.$items.delete(v))}clear(){const l=this[u];l.discard(!0),l.indexes={},l.forEachChild((f,v)=>{var b;(b=l.root)==null||b.remove(f)}),this.$indexes.clear(),this.$items.clear(),l.operation(t.OPERATION.CLEAR)}has(l){return Array.from(this.$items.values()).some(f=>f===l)}forEach(l){this.$items.forEach((f,v,b)=>l(f,v,this))}values(){return this.$items.values()}get size(){return this.$items.size}[Symbol.iterator](){return this.$items.values()}setIndex(l,f){this.$indexes.set(l,f)}getIndex(l){return this.$indexes.get(l)}[h](l){return this.$items.get(this.$indexes.get(l))}[d](l){const f=this.$indexes.get(l);this.$items.delete(f),this.$indexes.delete(l)}[p](){this.deletedItems={}}toArray(){return Array.from(this.$items.values())}toJSON(){const l=[];return this.forEach((f,v)=>{l.push(typeof f.toJSON=="function"?f.toJSON():f)}),l}clone(l){let f;return l?f=Object.assign(new Ss,this):(f=new Ss,this.forEach(v=>{v[u]?f.add(v.clone()):f.add(v)})),f}};Ss[fa]=xn,Ss[R]=qi;let j=Ss;qe("collection",{constructor:j});var ne,ie;const Ms=class Ms{static[(ne=a,ie=o,c)](l,f,v){return!v||typeof l[m]=="string"||v.visible.has((l[h](f)??l.deletedItems[f])[u])}static is(l){return l.set!==void 0}constructor(l){this.$items=new Map,this.$indexes=new Map,this.deletedItems={},this.$refId=0,this[u]=new st(this),this[u].indexes={},l&&l.forEach(f=>this.add(f)),Object.defineProperty(this,m,{value:void 0,enumerable:!1,writable:!0,configurable:!0})}add(l){var b;if(this.has(l))return!1;const f=this.$refId++;l[u]!==void 0&&l[u].setParent(this,this[u].root,f);const v=((b=this[u].indexes[f])==null?void 0:b.op)??t.OPERATION.ADD;return this[u].indexes[f]=f,this.$indexes.set(f,f),this.$items.set(f,l),this[u].change(f,v),f}entries(){return this.$items.entries()}delete(l){const f=this.$items.entries();let v,b;for(;(b=f.next())&&!b.done;)if(l===b.value[1]){v=b.value[0];break}return v===void 0?!1:(this.deletedItems[v]=this[u].delete(v),this.$indexes.delete(v),this.$items.delete(v))}clear(){const l=this[u];l.discard(!0),l.indexes={},this.$indexes.clear(),this.$items.clear(),l.operation(t.OPERATION.CLEAR)}has(l){const f=this.$items.values();let v=!1,b;for(;(b=f.next())&&!b.done;)if(l===b.value){v=!0;break}return v}forEach(l){this.$items.forEach((f,v,b)=>l(f,v,this))}values(){return this.$items.values()}get size(){return this.$items.size}[Symbol.iterator](){return this.$items.values()}setIndex(l,f){this.$indexes.set(l,f)}getIndex(l){return this.$indexes.get(l)}[h](l){return this.$items.get(this.$indexes.get(l))}[d](l){const f=this.$indexes.get(l);this.$items.delete(f),this.$indexes.delete(l)}[p](){this.deletedItems={}}toArray(){return Array.from(this.$items.values())}toJSON(){const l=[];return this.forEach((f,v)=>{l.push(typeof f.toJSON=="function"?f.toJSON():f)}),l}clone(l){let f;return l?f=Object.assign(new Ms,this):(f=new Ms,this.forEach(v=>{v[u]?f.add(v.clone()):f.add(v)})),f}};Ms[ne]=xn,Ms[ie]=qi;let K=Ms;qe("set",{constructor:K});const ge=-1;function Ie(M){return et.register(M),M}function He(M=ge){return function(l,f){var Q;const v=l.constructor,D=Object.getPrototypeOf(v)[Symbol.metadata],G=v[Q=Symbol.metadata]??(v[Q]=Object.assign({},v[Symbol.metadata],D??Object.create(null)));ye.setTag(G,f,M)}}function Ee(M,l){return function(f,v){const b=f.constructor;if(!M)throw new Error(`${b.name}: @type() reference provided for "${v}" is undefined. Make sure you don't have any circular dependencies.`);M=V(M),et.register(b);const G=Object.getPrototypeOf(b)[Symbol.metadata],Q=ye.initialize(b);let J=Q[v];if(Q[J]!==void 0){if(Q[J].deprecated)return;if(Q[J].type!==void 0)try{throw new Error(`@colyseus/schema: Duplicate '${v}' definition on '${b.name}'.
Check @type() annotation`)}catch(se){const ce=se.stack.split(`
`)[4].trim();throw new Error(`${se.message} ${ce}`)}}else J=Q[_]??(G&&G[_])??-1,J++;if(l&&l.manual)ye.addField(Q,J,v,M,{enumerable:!0,configurable:!0,writable:!0});else{const se=typeof Object.keys(M)[0]=="string"&&$e(Object.keys(M)[0]),ce=se?Object.values(M)[0]:M;ye.addField(Q,J,v,M,tt(`_${v}`,J,ce,se))}}}function tt(M,l,f,v){return{get:function(){return this[M]},set:function(b){var G,Q;const D=this[M]??void 0;if(b!==D){if(b!=null){v?(v.constructor===Tn&&!(b instanceof Tn)&&(b=new Tn(...b)),v.constructor===Bn&&!(b instanceof Bn)&&(b=new Bn(b)),b[m]=f):typeof f!="string"?ci(b,f,this,M.substring(1)):ha(b,f,this,M.substring(1));const J=this[u];D!==void 0&&D[u]?((G=J.root)==null||G.remove(D[u]),this.constructor[r](J,l,t.OPERATION.DELETE_AND_ADD)):this.constructor[r](J,l,t.OPERATION.ADD),(Q=b[u])==null||Q.setParent(this,J.root,l)}else D!==void 0&&this[u].delete(l);this[M]=b}},enumerable:!0,configurable:!0}}function rt(M=!0){return function(l,f){var J;const v=l.constructor,D=Object.getPrototypeOf(v)[Symbol.metadata],G=v[J=Symbol.metadata]??(v[J]=Object.assign({},v[Symbol.metadata],D??Object.create(null))),Q=G[f];G[Q].deprecated=!0,M&&(G[x]??(G[x]={}),G[x][f]={get:function(){throw new Error(`${f} is deprecated.`)},set:function(se){},enumerable:!1,configurable:!0}),Object.defineProperty(G,Q,{value:G[Q],enumerable:!1,configurable:!0})}}function Ke(M,l,f){for(let v in l)Ee(l[v],f)(M.prototype,v);return M}function dt(M,l,f=De){const v={},b={},D={},G={};for(let ce in M){const ae=M[ce];typeof ae=="object"?(ae.view!==void 0&&(G[ce]=typeof ae.view=="boolean"?ge:ae.view),v[ce]=V(ae),Object.prototype.hasOwnProperty.call(ae,"default")?D[ce]=ae.default:Array.isArray(ae)||ae.array!==void 0?D[ce]=new Tn:ae.map!==void 0?D[ce]=new Bn:ae.collection!==void 0?D[ce]=new j:ae.set!==void 0?D[ce]=new K:ae.type!==void 0&&De.is(ae.type)&&(!ae.type.prototype.initialize||ae.type.prototype.initialize.length===0)&&(D[ce]=new ae.type)):typeof ae=="function"?De.is(ae)?((!ae.prototype.initialize||ae.prototype.initialize.length===0)&&(D[ce]=new ae),v[ce]=V(ae)):b[ce]=ae:v[ce]=V(ae)}const Q=()=>{const ce={};for(const ae in D){const he=D[ae];he&&typeof he.clone=="function"?ce[ae]=he.clone():ce[ae]=he}return ce},J=ce=>{const ae=Object.keys(v),he={};for(const Le in ce)ae.includes(Le)||(he[Le]=ce[Le]);return he},se=ye.setFields(class extends f{constructor(...ce){b.initialize&&typeof b.initialize=="function"?(super(Object.assign({},Q(),J(ce[0]||{}))),new.target===se&&b.initialize.apply(this,ce)):super(Object.assign({},Q(),ce[0]||{}))}},v);se._getDefaultValues=Q,Object.assign(se.prototype,b);for(let ce in G)He(G[ce])(se.prototype,ce);return l&&Object.defineProperty(se,"name",{value:l}),se.extends=(ce,ae)=>dt(ce,ae,se),se}function bt(M){return new Array(M).fill(0).map((l,f)=>f===M-1?"└─ ":"   ").join("")}function Gt(M){const l=M[u].root,f={ops:{},refs:[]};let v=l.changes.next;for(;v;){const b=v.changeTree;if(b===void 0){v=v.next;continue}const D=b.indexedOperations;f.refs.push(`refId#${b.refId}`);for(const G in D){const Q=D[G],J=t.OPERATION[Q];f.ops[J]||(f.ops[J]=0),f.ops[t.OPERATION[Q]]++}v=v.next}return f}var Dt,At;const ws=class ws{static initialize(l){var f;Object.defineProperty(l,u,{value:new st(l),enumerable:!1,writable:!0}),Object.defineProperties(l,((f=l.constructor[Symbol.metadata])==null?void 0:f[x])||{})}static is(l){return typeof l[Symbol.metadata]=="object"}static[(Dt=a,At=o,r)](l,f,v=t.OPERATION.ADD){l.change(f,v)}static[c](l,f,v){var G,Q;const D=(G=l.constructor[Symbol.metadata][f])==null?void 0:G.tag;if(v===void 0)return D===void 0;if(D===void 0)return!0;if(D===ge)return v.isChangeTreeVisible(l[u]);{const J=(Q=v.tags)==null?void 0:Q.get(l[u]);return J&&J.has(D)}}constructor(l){ws.initialize(this),l&&Object.assign(this,l)}assign(l){return Object.assign(this,l),this}setDirty(l,f){const v=this.constructor[Symbol.metadata];this[u].change(v[v[l]].index,f)}clone(){var v;const l=Object.create(this.constructor.prototype);ws.initialize(l);const f=this.constructor[Symbol.metadata];for(const b in f){const D=f[b].name;typeof this[D]=="object"&&typeof((v=this[D])==null?void 0:v.clone)=="function"?l[D]=this[D].clone():l[D]=this[D]}return l}toJSON(){const l={},f=this.constructor[Symbol.metadata];for(const v in f){const b=f[v],D=b.name;!b.deprecated&&this[D]!==null&&typeof this[D]<"u"&&(l[D]=typeof this[D].toJSON=="function"?this[D].toJSON():this[D])}return l}discardAllChanges(){this[u].discardAll()}[h](l){const f=this.constructor[Symbol.metadata];return this[f[l].name]}[d](l){const f=this.constructor[Symbol.metadata];this[f[l].name]=void 0}static debugRefIds(l,f=!1,v=0,b,D=""){var he;const G=f?` - ${JSON.stringify(l.toJSON())}`:"",Q=l[u],J=b?b.root.refIds.get(l):Q.refId,se=b?b.root:Q.root,ce=((he=se==null?void 0:se.refCount)==null?void 0:he[J])>1?` [×${se.refCount[J]}]`:"";let ae=`${bt(v)}${D}${l.constructor.name} (refId: ${J})${ce}${G}
`;return Q.forEachChild((Le,Fe)=>{let we=Fe;typeof Fe=="number"&&l.$indexes&&(we=l.$indexes.get(Fe)??Fe);const ve=l.forEach!==void 0&&we!==void 0?`["${we}"]: `:"";ae+=this.debugRefIds(Le.ref,f,v+1,b,ve)}),ae}static debugRefIdEncodingOrder(l,f="allChanges"){let v=[],b=l[u].root[f].next;for(;b;)b.changeTree&&v.push(b.changeTree.refId),b=b.next;return v}static debugRefIdsFromDecoder(l){return this.debugRefIds(l.state,!1,0,l)}static debugChanges(l,f=!1){const v=l[u],b=f?v.allChanges:v.changes,D=f?"allChanges":"changes";let G=`${l.constructor.name} (${v.refId}) -> .${D}:
`;function Q(J){J.operations.filter(se=>se).forEach(se=>{const ce=v.indexedOperations[se];G+=`- [${se}]: ${t.OPERATION[ce]} (${JSON.stringify(v.getValue(Number(se),f))})
`})}return Q(b),!f&&v.filteredChanges&&v.filteredChanges.operations.filter(J=>J).length>0&&(G+=`${l.constructor.name} (${v.refId}) -> .filteredChanges:
`,Q(v.filteredChanges)),f&&v.allFilteredChanges&&v.allFilteredChanges.operations.filter(J=>J).length>0&&(G+=`${l.constructor.name} (${v.refId}) -> .allFilteredChanges:
`,Q(v.allFilteredChanges)),G}static debugChangesDeep(l,f="changes"){var ce,ae;let v="";const b=l[u],D=b.root,G=new Map,Q=[];let J=0;for(const[he,Le]of Object.entries(D[f])){const Fe=D.changeTrees[he];if(!Fe)continue;let we=!1,ve=[],Ve=(ce=Fe.parent)==null?void 0:ce[u];if(Fe===b)we=!0;else for(;Ve!==void 0;){if(ve.push(Ve),Ve.ref===l){we=!0;break}Ve=(ae=Ve.parent)==null?void 0:ae[u]}we&&(Q.push(Fe.refId),J+=Object.keys(Le).length,G.set(Fe,ve.reverse()))}v+=`---
`,v+=`root refId: ${b.refId}
`,v+=`Total instances: ${Q.length} (refIds: ${Q.join(", ")})
`,v+=`Total changes: ${J}
`,v+=`---
`;const se=new WeakSet;for(const[he,Le]of G.entries()){Le.forEach((Rt,Ft)=>{se.has(Rt)||(v+=`${bt(Ft)}${Rt.ref.constructor.name} (refId: ${Rt.refId})
`,se.add(Rt))});const Fe=he.indexedOperations,we=Le.length,ve=bt(we),Ve=we>0?`(${he.parentIndex}) `:"";v+=`${ve}${Ve}${he.ref.constructor.name} (refId: ${he.refId}) - changes: ${Object.keys(Fe).length}
`;for(const Rt in Fe){const Ft=Fe[Rt];v+=`${bt(we+1)}${t.OPERATION[Ft]}: ${Rt}
`}}return`${v}`}};ws[Dt]=xt,ws[At]=bs;let De=ws;function wt(M,l,f,v){var b=arguments.length,D=b<3?l:v,G;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")D=Reflect.decorate(M,l,f,v);else for(var Q=M.length-1;Q>=0;Q--)(G=M[Q])&&(D=(b<3?G(D):b>3?G(l,f,D):G(l,f))||D);return b>3&&D&&Object.defineProperty(l,f,D),D}typeof SuppressedError=="function"&&SuppressedError;class yt{constructor(l){this.types=l,this.nextUniqueId=0,this.refCount={},this.changeTrees={},this.allChanges=_e(),this.allFilteredChanges=_e(),this.changes=_e(),this.filteredChanges=_e()}getNextUniqueId(){return this.nextUniqueId++}add(l){l.refId===void 0&&(l.refId=this.getNextUniqueId());const f=this.changeTrees[l.refId]===void 0;f&&(this.changeTrees[l.refId]=l);const v=this.refCount[l.refId];if(v===0){const b=l.allChanges.operations;let D=b.length;for(;D--;)l.indexedOperations[b[D]]=t.OPERATION.ADD,oe(l.changes,D)}return this.refCount[l.refId]=(v||0)+1,f}remove(l){const f=this.refCount[l.refId]-1;return f<=0?(l.root=void 0,delete this.changeTrees[l.refId],this.removeChangeFromChangeSet("allChanges",l),this.removeChangeFromChangeSet("changes",l),l.filteredChanges&&(this.removeChangeFromChangeSet("allFilteredChanges",l),this.removeChangeFromChangeSet("filteredChanges",l)),this.refCount[l.refId]=0,l.forEachChild((v,b)=>{v.removeParent(l.ref)&&(v.parentChain===void 0||v.parentChain&&this.refCount[v.refId]>0?this.remove(v):v.parentChain&&this.moveNextToParent(v))})):(this.refCount[l.refId]=f,this.recursivelyMoveNextToParent(l)),f}recursivelyMoveNextToParent(l){this.moveNextToParent(l),l.forEachChild((f,v)=>this.recursivelyMoveNextToParent(f))}moveNextToParent(l){l.filteredChanges?(this.moveNextToParentInChangeTreeList("filteredChanges",l),this.moveNextToParentInChangeTreeList("allFilteredChanges",l)):(this.moveNextToParentInChangeTreeList("changes",l),this.moveNextToParentInChangeTreeList("allChanges",l))}moveNextToParentInChangeTreeList(l,f){var se;const v=this[l],b=f[l].queueRootNode;if(!b)return;const D=f.parent;if(!D||!D[u])return;const G=(se=D[u][l])==null?void 0:se.queueRootNode;if(!G||G===b)return;const Q=G.position;b.position>Q||(b.prev?b.prev.next=b.next:v.next=b.next,b.next?b.next.prev=b.prev:v.tail=b.prev,b.prev=G,b.next=G.next,G.next?G.next.prev=b:v.tail=b,G.next=b,this.updatePositionsAfterMove(v,b,Q+1))}enqueueChangeTree(l,f,v=l[f].queueRootNode){v||(l[f].queueRootNode=this.addToChangeTreeList(this[f],l))}addToChangeTreeList(l,f){const v={changeTree:f,next:void 0,prev:void 0,position:l.tail?l.tail.position+1:0};return l.next?(v.prev=l.tail,l.tail.next=v,l.tail=v):(l.next=v,l.tail=v),v}updatePositionsAfterRemoval(l,f){let v=l.next,b=0;for(;v;)b>=f&&(v.position=b),v=v.next,b++}updatePositionsAfterMove(l,f,v){let b=l.next,D=0;for(;b;)b.position=D,b=b.next,D++}removeChangeFromChangeSet(l,f){const v=this[l],b=f[l].queueRootNode;if(b&&b.changeTree===f){const D=b.position;return b.prev?b.prev.next=b.next:v.next=b.next,b.next?b.next.prev=b.prev:v.tail=b.prev,this.updatePositionsAfterRemoval(v,D),f[l].queueRootNode=void 0,!0}return!1}}const pa=class pa{constructor(l){this.sharedBuffer=Buffer.allocUnsafe(pa.BUFFER_SIZE),this.context=et.cache(l.constructor),this.root=new yt(this.context),this.setState(l)}setState(l){this.state=l,this.state[u].setRoot(this.root)}encode(l={offset:0},f,v=this.sharedBuffer,b="changes",D=b==="allChanges",G=l.offset){const Q=f!==void 0,J=this.state[u];let se=this.root[b];for(;se=se.next;){const ce=se.changeTree;if(Q){if(!f.isChangeTreeVisible(ce)){f.invisible.add(ce);continue}f.invisible.delete(ce)}const ae=ce[b],he=ce.ref,Le=ae.operations.length;if(Le===0)continue;const Fe=he.constructor,we=Fe[a],ve=Fe[c],Ve=Fe[Symbol.metadata];(Q||l.offset>G||ce!==J)&&(v[l.offset++]=255,Ae.number(v,ce.refId,l));for(let Rt=0;Rt<Le;Rt++){const Ft=ae.operations[Rt];if(Ft<0){v[l.offset++]=Math.abs(Ft)&255;continue}const fn=D?t.OPERATION.ADD:ce.indexedOperations[Ft];Ft===void 0||fn===void 0||ve&&!ve(he,Ft,f)||we(this,v,ce,Ft,fn,l,D,Q,Ve)}}if(l.offset>v.byteLength){const ce=Math.ceil(l.offset/(Buffer.poolSize??8192))*(Buffer.poolSize??8192);return console.warn(`@colyseus/schema buffer overflow. Encoded state is higher than default BUFFER_SIZE. Use the following to increase default BUFFER_SIZE:

    import { Encoder } from "@colyseus/schema";
    Encoder.BUFFER_SIZE = ${Math.round(ce/1024)} * 1024; // ${Math.round(ce/1024)} KB
`),v=Buffer.alloc(ce,v),v===this.sharedBuffer&&(this.sharedBuffer=v),this.encode({offset:G},f,v,b,D)}else return v.subarray(0,l.offset)}encodeAll(l={offset:0},f=this.sharedBuffer){return this.encode(l,void 0,f,"allChanges",!0)}encodeAllView(l,f,v,b=this.sharedBuffer){const D=v.offset;return this.encode(v,l,b,"allFilteredChanges",!0,D),Buffer.concat([b.subarray(0,f),b.subarray(D,v.offset)])}encodeView(l,f,v,b=this.sharedBuffer){const D=v.offset;for(const[G,Q]of l.changes){const J=this.root.changeTrees[G];if(J===void 0){l.changes.delete(G);continue}const se=Object.keys(Q);if(se.length===0)continue;const ae=J.ref.constructor,he=ae[a],Le=ae[Symbol.metadata];b[v.offset++]=255,Ae.number(b,J.refId,v);for(let Fe=0,we=se.length;Fe<we;Fe++){const ve=Number(se[Fe]),Rt=J.ref[h](ve)!==void 0&&Q[ve]||t.OPERATION.DELETE;he(this,b,J,ve,Rt,v,!1,!0,Le)}}return l.changes.clear(),this.encode(v,l,b,"filteredChanges",!1,D),Buffer.concat([b.subarray(0,f),b.subarray(D,v.offset)])}discardChanges(){let l=this.root.changes.next;for(;l;)l.changeTree.endEncode("changes"),l=l.next;for(this.root.changes=_e(),l=this.root.filteredChanges.next;l;)l.changeTree.endEncode("filteredChanges"),l=l.next;this.root.filteredChanges=_e()}tryEncodeTypeId(l,f,v,b){const D=this.context.getTypeId(f),G=this.context.getTypeId(v);if(G===void 0){console.warn(`@colyseus/schema WARNING: Class "${v.name}" is not registered on TypeRegistry - Please either tag the class with @entity or define a @type() field.`);return}D!==G&&(l[b.offset++]=213,Ae.number(l,G,b))}get hasChanges(){return this.root.changes.next!==void 0||this.root.filteredChanges.next!==void 0}};pa.BUFFER_SIZE=typeof Buffer<"u"&&Buffer.poolSize||8*1024;let tn=pa;function li(M,l){if(l===-1||l>=M.length)return!1;const f=M.length-1;for(let v=l;v<f;v++)M[v]=M[v+1];return M.length=f,!0}class cn extends Error{constructor(l){super(l),this.name="DecodingWarning"}}class Yi{constructor(){this.refs=new Map,this.refIds=new WeakMap,this.refCount={},this.deletedRefs=new Set,this.callbacks={},this.nextUniqueId=0}getNextUniqueId(){return this.nextUniqueId++}addRef(l,f,v=!0){this.refs.set(l,f),this.refIds.set(f,l),v&&(this.refCount[l]=(this.refCount[l]||0)+1),this.deletedRefs.has(l)&&this.deletedRefs.delete(l)}removeRef(l){const f=this.refCount[l];if(f===void 0){try{throw new cn("trying to remove refId that doesn't exist: "+l)}catch(v){console.warn(v)}return}if(f===0){try{const v=this.refs.get(l);throw new cn(`trying to remove refId '${l}' with 0 refCount (${v.constructor.name}: ${JSON.stringify(v)})`)}catch(v){console.warn(v)}return}(this.refCount[l]=f-1)<=0&&this.deletedRefs.add(l)}clearRefs(){this.refs.clear(),this.deletedRefs.clear(),this.callbacks={},this.refCount={}}garbageCollectDeletedRefs(){this.deletedRefs.forEach(l=>{if(this.refCount[l]>0)return;const f=this.refs.get(l);if(f.constructor[Symbol.metadata]!==void 0){const v=f.constructor[Symbol.metadata];for(const b in v){const D=v[b].name,G=typeof f[D]=="object"&&this.refIds.get(f[D]);G&&!this.deletedRefs.has(G)&&this.removeRef(G)}}else typeof f[m]=="function"&&Array.from(f.values()).forEach(v=>{const b=this.refIds.get(v);this.deletedRefs.has(b)||this.removeRef(b)});this.refs.delete(l),delete this.refCount[l],delete this.callbacks[l]}),this.deletedRefs.clear()}addCallback(l,f,v){if(l===void 0){const b=typeof f=="number"?t.OPERATION[f]:f;throw new Error(`Can't addCallback on '${b}' (refId is undefined)`)}return this.callbacks[l]||(this.callbacks[l]={}),this.callbacks[l][f]||(this.callbacks[l][f]=[]),this.callbacks[l][f].push(v),()=>this.removeCallback(l,f,v)}removeCallback(l,f,v){var D,G,Q;const b=(Q=(G=(D=this.callbacks)==null?void 0:D[l])==null?void 0:G[f])==null?void 0:Q.indexOf(v);b!==void 0&&b!==-1&&li(this.callbacks[l][f],b)}}class Ut{constructor(l,f){this.currentRefId=0,this.setState(l),this.context=f||new et(l.constructor)}setState(l){this.state=l,this.root=new Yi,this.root.addRef(0,l)}decode(l,f={offset:0},v=this.state){var J,se,ce;const b=[],D=this.root,G=l.byteLength;let Q=v.constructor[o];for(this.currentRefId=0;f.offset<G;){if(l[f.offset]==255){f.offset++,(J=v[y])==null||J.call(v);const he=Ne.number(l,f),Le=D.refs.get(he);Le?(v=Le,Q=v.constructor[o],this.currentRefId=he):(console.error(`"refId" not found: ${he}`,{previousRef:v,previousRefId:this.currentRefId}),console.warn("Please report this issue to the developers."),this.skipCurrentStructure(l,f,G));continue}if(Q(this,l,f,v,b)===gr){console.warn("@colyseus/schema: definition mismatch"),this.skipCurrentStructure(l,f,G);continue}}return(se=v[y])==null||se.call(v),(ce=this.triggerChanges)==null||ce.call(this,b),D.garbageCollectDeletedRefs(),b}skipCurrentStructure(l,f,v){const b={offset:f.offset};for(;f.offset<v&&!(l[f.offset]===255&&(b.offset=f.offset+1,this.root.refs.has(Ne.number(l,b))));)f.offset++}getInstanceType(l,f,v){let b;if(l[f.offset]===213){f.offset++;const D=Ne.number(l,f);b=this.context.get(D)}return b||v}createInstanceOfType(l){return new l}removeChildRefs(l,f){const v=typeof l[m]!="string",b=this.root.refIds.get(l);l.forEach((D,G)=>{f.push({ref:l,refId:b,op:t.OPERATION.DELETE,field:G,value:void 0,previousValue:D}),v&&this.root.removeRef(this.root.refIds.get(D))})}}class Yt extends De{}wt([Ee("string")],Yt.prototype,"name",void 0),wt([Ee("string")],Yt.prototype,"type",void 0),wt([Ee("number")],Yt.prototype,"referencedType",void 0);class Kt extends De{constructor(){super(...arguments),this.fields=new Tn}}wt([Ee("number")],Kt.prototype,"id",void 0),wt([Ee("number")],Kt.prototype,"extendsId",void 0),wt([Ee([Yt])],Kt.prototype,"fields",void 0);class $t extends De{constructor(){super(...arguments),this.types=new Tn}static encode(l,f={offset:0}){const v=l.context,b=new $t,D=new tn(b),G=v.schemas.get(l.state.constructor);G>0&&(b.rootType=G);const Q=new Set,J={},se=ae=>{if(ae.extendsId===void 0||Q.has(ae.extendsId)){Q.add(ae.id),b.types.push(ae);const he=J[ae.id];he!==void 0&&(delete J[ae.id],he.forEach(Le=>se(Le)))}else J[ae.extendsId]===void 0&&(J[ae.extendsId]=[]),J[ae.extendsId].push(ae)};v.schemas.forEach((ae,he)=>{const Le=new Kt;Le.id=Number(ae);const Fe=Object.getPrototypeOf(he);Fe!==De&&(Le.extendsId=v.schemas.get(Fe));const we=he[Symbol.metadata];if(we!==Fe[Symbol.metadata])for(const ve in we){const Ve=Number(ve),Rt=we[Ve].name;if(!Object.prototype.hasOwnProperty.call(we,Rt))continue;const Ft=new Yt;Ft.name=Rt;let fn;const Jn=we[Ve];if(typeof Jn.type=="string")fn=Jn.type;else{let xr;De.is(Jn.type)?(fn="ref",xr=Jn.type):(fn=Object.keys(Jn.type)[0],typeof Jn.type[fn]=="string"?fn+=":"+Jn.type[fn]:xr=Jn.type[fn]),Ft.referencedType=xr?v.getTypeId(xr):-1}Ft.type=fn,Le.fields.push(Ft)}se(Le)});for(const ae in J)J[ae].forEach(he=>b.types.push(he));return D.encodeAll(f).slice(0,f.offset)}static decode(l,f){const v=new $t;new Ut(v).decode(l,f);const D=new et;v.types.forEach(J=>{const se=D.get(J.extendsId)??De,ce=class extends se{};et.register(ce),D.add(ce,J.id)},{});const G=(J,se,ce)=>{se.fields.forEach((ae,he)=>{const Le=ce+he;if(ae.referencedType!==void 0){let Fe=ae.type,we=D.get(ae.referencedType);if(!we){const ve=ae.type.split(":");Fe=ve[0],we=ve[1]}Fe==="ref"?ye.addField(J,Le,ae.name,we):ye.addField(J,Le,ae.name,{[Fe]:we})}else ye.addField(J,Le,ae.name,ae.type)})};v.types.forEach(J=>{const se=D.get(J.id),ce=ye.initialize(se),ae=[];let he=J;do ae.push(he),he=v.types.find(Fe=>Fe.id===he.extendsId);while(he);let Le=0;ae.reverse().forEach(Fe=>{G(ce,Fe,Le),Le+=Fe.fields.length})});const Q=new(D.get(v.rootType||0));return new Ut(Q,D)}}wt([Ee([Kt])],$t.prototype,"types",void 0),wt([Ee("number")],$t.prototype,"rootType",void 0);function ln(M){const l=M.root,f=l.callbacks,v=new WeakMap;let b;M.triggerChanges=function(Q){var se;const J=new Set;for(let ce=0,ae=Q.length;ce<ae;ce++){const he=Q[ce],Le=he.refId,Fe=he.ref,we=f[Le];if(we){if((he.op&t.OPERATION.DELETE)===t.OPERATION.DELETE&&he.previousValue instanceof De){const ve=(se=f[l.refIds.get(he.previousValue)])==null?void 0:se[t.OPERATION.DELETE];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve]()}if(Fe instanceof De){if(!J.has(Le)){const ve=we==null?void 0:we[t.OPERATION.REPLACE];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve]()}if(we.hasOwnProperty(he.field)){const ve=we[he.field];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve](he.value,he.previousValue)}}else{if((he.op&t.OPERATION.DELETE)===t.OPERATION.DELETE){if(he.previousValue!==void 0){const ve=we[t.OPERATION.DELETE];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve](he.previousValue,he.dynamicIndex??he.field)}if((he.op&t.OPERATION.ADD)===t.OPERATION.ADD){const ve=we[t.OPERATION.ADD];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve](he.value,he.dynamicIndex??he.field)}}else if((he.op&t.OPERATION.ADD)===t.OPERATION.ADD&&he.previousValue!==he.value){const ve=we[t.OPERATION.ADD];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve](he.value,he.dynamicIndex??he.field)}if(he.value!==he.previousValue&&(he.value!==void 0||he.previousValue!==void 0)){const ve=we[t.OPERATION.REPLACE];for(let Ve=(ve==null?void 0:ve.length)-1;Ve>=0;Ve--)ve[Ve](he.value,he.dynamicIndex??he.field)}}J.add(Le)}}};function D(Q,J){var ae;let se=((ae=J.instance)==null?void 0:ae.constructor[Symbol.metadata])||Q,ce=J.instance&&typeof J.instance.forEach=="function"||Q&&typeof Q[Symbol.metadata]>"u";if(se&&!ce){const he=function(Le,Fe,we,ve){return ve&&J.instance[Fe]!==void 0&&!v.has(b)&&we(J.instance[Fe],void 0),l.addCallback(l.refIds.get(Le),Fe,we)};return new Proxy({listen:function(Fe,we,ve=!0){if(J.instance)return he(J.instance,Fe,we,ve);{let Ve=()=>{};return J.onInstanceAvailable((Rt,Ft)=>{Ve=he(Rt,Fe,we,ve&&Ft&&!v.has(b))}),()=>Ve()}},onChange:function(Fe){return l.addCallback(l.refIds.get(J.instance),t.OPERATION.REPLACE,Fe)},bindTo:function(Fe,we){return we||(we=Object.keys(se).map(ve=>se[ve].name)),l.addCallback(l.refIds.get(J.instance),t.OPERATION.REPLACE,()=>{we.forEach(ve=>Fe[ve]=J.instance[ve])})}},{get(Le,Fe){var ve;const we=se[se[Fe]];if(we){const Ve=(ve=J.instance)==null?void 0:ve[Fe],Rt=(Ft=>{const fn=G(J.instance).listen(Fe,(Jn,xr)=>{Ft(Jn,!1),fn==null||fn()},!1);l.refIds.get(Ve)!==void 0&&Ft(Ve,!0)});return D(we.type,{instance:l.refIds.get(Ve)&&Ve,parentInstance:J.instance,onInstanceAvailable:Rt})}else return Le[Fe]},has(Le,Fe){return se[Fe]!==void 0},set(Le,Fe,we){throw new Error("not allowed")},deleteProperty(Le,Fe){throw new Error("not allowed")}})}else{const he=function(we,ve,Ve){return Ve&&we.forEach((Rt,Ft)=>ve(Rt,Ft)),l.addCallback(l.refIds.get(we),t.OPERATION.ADD,(Rt,Ft)=>{v.set(ve,!0),b=ve,ve(Rt,Ft),v.delete(ve),b=void 0})},Le=function(we,ve){return l.addCallback(l.refIds.get(we),t.OPERATION.DELETE,ve)},Fe=function(we,ve){return l.addCallback(l.refIds.get(we),t.OPERATION.REPLACE,ve)};return new Proxy({onAdd:function(we,ve=!0){if(J.instance)return he(J.instance,we,ve&&!v.has(b));if(J.onInstanceAvailable){let Ve=()=>{};return J.onInstanceAvailable((Rt,Ft)=>{Ve=he(Rt,we,ve&&Ft&&!v.has(b))}),()=>Ve()}},onRemove:function(we){if(J.instance)return Le(J.instance,we);if(J.onInstanceAvailable){let ve=()=>{};return J.onInstanceAvailable(Ve=>{ve=Le(Ve,we)}),()=>ve()}},onChange:function(we){if(J.instance)return Fe(J.instance,we);if(J.onInstanceAvailable){let ve=()=>{};return J.onInstanceAvailable(Ve=>{ve=Fe(Ve,we)}),()=>ve()}}},{get(we,ve){if(!we[ve])throw new Error(`Can't access '${ve}' through callback proxy. access the instance directly.`);return we[ve]},has(we,ve){return we[ve]!==void 0},set(we,ve,Ve){throw new Error("not allowed")},deleteProperty(we,ve){throw new Error("not allowed")}})}}function G(Q){return D(void 0,{instance:Q})}return G}function yr(M,l){M.triggerChanges=l}class hi{constructor(l=!1){this.iterable=l,this.visible=new WeakSet,this.invisible=new WeakSet,this.changes=new Map,l&&(this.items=[])}add(l,f=ge,v=!0){var se,ce;const b=l==null?void 0:l[u],D=b.parent;if(b){if(!D&&b.refId!==0)throw new Error(`Cannot add a detached instance to the StateView. Make sure to assign the "${b.ref.constructor.name}" instance to the state before calling view.add()`)}else return console.warn("StateView#add(), invalid object:",l),!1;const G=l.constructor[Symbol.metadata];this.visible.add(b),this.iterable&&v&&this.items.push(l),v&&D&&this.addParentOf(b,f);let Q=this.changes.get(b.refId);Q===void 0&&(Q={},this.changes.set(b.refId,Q));let J=!1;if(b.forEachChild((ae,he)=>{G&&G[he].tag!==void 0&&G[he].tag!==f||this.add(ae.ref,f,!1)&&(J=!0)}),f!==ge){this.tags||(this.tags=new WeakMap);let ae;this.tags.has(b)?ae=this.tags.get(b):(ae=new Set,this.tags.set(b,ae)),ae.add(f),(ce=(se=G==null?void 0:G[C])==null?void 0:se[f])==null||ce.forEach(he=>{b.getChange(he)!==t.OPERATION.DELETE&&(Q[he]=t.OPERATION.ADD)})}else if(!b.isNew||J){const ae=b.filteredChanges!==void 0?b.allFilteredChanges:b.allChanges,he=this.invisible.has(b);for(let Le=0,Fe=ae.operations.length;Le<Fe;Le++){const we=ae.operations[Le];if(we===void 0)continue;const ve=b.indexedOperations[we]??t.OPERATION.ADD,Ve=G==null?void 0:G[we].tag;ve!==t.OPERATION.DELETE&&(he||Ve===void 0||Ve===f)&&(Q[we]=ve,J=!0)}}return J}addParentOf(l,f){var D;const v=l.parent[u],b=l.parentIndex;if(!this.visible.has(v)){this.visible.add(v);const G=(D=v.parent)==null?void 0:D[u];G&&G.filteredChanges!==void 0&&this.addParentOf(v,f)}if(v.getChange(b)!==t.OPERATION.DELETE){let G=this.changes.get(v.refId);G===void 0&&(G={},this.changes.set(v.refId,G)),this.tags||(this.tags=new WeakMap);let Q;this.tags.has(v)?Q=this.tags.get(v):(Q=new Set,this.tags.set(v,Q)),Q.add(f),G[b]=t.OPERATION.ADD}}remove(l,f=ge,v=!1){var J;const b=l[u];if(!b)return console.warn("StateView#remove(), invalid object:",l),this;this.visible.delete(b),this.iterable&&!v&&li(this.items,this.items.indexOf(l));const G=b.ref.constructor[Symbol.metadata];let Q=this.changes.get(b.refId);if(Q===void 0&&(Q={},this.changes.set(b.refId,Q)),f===ge){const se=b.parent;if(se&&!ye.isValidInstance(se)&&b.isFiltered){const ce=se[u];let ae=this.changes.get(ce.refId);ae===void 0?(ae={},this.changes.set(ce.refId,ae)):ae[b.parentIndex]===t.OPERATION.ADD&&this.changes.delete(b.refId),ae[b.parentIndex]=t.OPERATION.DELETE,this._recursiveDeleteVisibleChangeTree(b)}else(J=G==null?void 0:G[T])==null||J.forEach(ce=>Q[ce]=t.OPERATION.DELETE)}else G==null||G[C][f].forEach(se=>Q[se]=t.OPERATION.DELETE);if(this.tags&&this.tags.has(b)){const se=this.tags.get(b);f===void 0?this.tags.delete(b):(se.delete(f),se.size===0&&this.tags.delete(b))}return this}has(l){return this.visible.has(l[u])}hasTag(l,f=ge){var b;const v=(b=this.tags)==null?void 0:b.get(l[u]);return(v==null?void 0:v.has(f))??!1}clear(){if(!this.iterable)throw new Error("StateView#clear() is only available for iterable StateView's. Use StateView(iterable: true) constructor.");for(let l=0,f=this.items.length;l<f;l++)this.remove(this.items[l],ge,!0);this.items.length=0}isChangeTreeVisible(l){let f=this.visible.has(l);return!f&&l.isVisibilitySharedWithParent&&this.visible.has(l.parent[u])&&(this.visible.add(l),f=!0),f}_recursiveDeleteVisibleChangeTree(l){l.forEachChild(f=>{this.visible.delete(f),this._recursiveDeleteVisibleChangeTree(f)})}}qe("map",{constructor:Bn}),qe("array",{constructor:Tn}),qe("set",{constructor:K}),qe("collection",{constructor:j}),t.$changes=u,t.$childType=m,t.$decoder=o,t.$deleteByIndex=d,t.$encoder=a,t.$filter=c,t.$getByIndex=h,t.$track=r,t.ArraySchema=Tn,t.ChangeTree=st,t.CollectionSchema=j,t.Decoder=Ut,t.Encoder=tn,t.MapSchema=Bn,t.Metadata=ye,t.Reflection=$t,t.ReflectionField=Yt,t.ReflectionType=Kt,t.Schema=De,t.SetSchema=K,t.StateView=hi,t.TypeContext=et,t.decode=Ne,t.decodeKeyValueOperation=qi,t.decodeSchemaOperation=bs,t.defineCustomTypes=Re,t.defineTypes=Ke,t.deprecated=rt,t.dumpChanges=Gt,t.encode=Ae,t.encodeArray=En,t.encodeKeyValueOperation=xn,t.encodeSchemaOperation=xt,t.entity=Ie,t.getDecoderStateCallbacks=ln,t.getRawChangesCallback=yr,t.registerType=qe,t.schema=dt,t.type=Ee,t.view=He}))})(Ur,Ur.exports)),Ur.exports}var Nh;function xm(){if(Nh)return zo;Nh=1;var i=So,e=Vl();class t{constructor(s){this.events=s,this.isOpen=!1,this.lengthPrefixBuffer=new Uint8Array(9)}connect(s,r={}){const a=r.fingerprint&&{serverCertificateHashes:[{algorithm:"sha-256",value:new Uint8Array(r.fingerprint).buffer}]}||void 0;this.wt=new WebTransport(s,a),this.wt.ready.then(o=>{console.log("WebTransport ready!",o),this.isOpen=!0,this.unreliableReader=this.wt.datagrams.readable.getReader(),this.unreliableWriter=this.wt.datagrams.writable.getWriter(),this.wt.incomingBidirectionalStreams.getReader().read().then(h=>{this.reader=h.value.readable.getReader(),this.writer=h.value.writable.getWriter(),this.sendSeatReservation(r.room.roomId,r.sessionId,r.reconnectionToken),this.readIncomingData(),this.readIncomingUnreliableData()}).catch(h=>{console.error("failed to read incoming stream",h),console.error("TODO: close the connection")})}).catch(o=>{console.log("WebTransport not ready!",o),this._close()}),this.wt.closed.then(o=>{console.log("WebTransport closed w/ success",o),this.events.onclose({code:o.closeCode,reason:o.reason})}).catch(o=>{console.log("WebTransport closed w/ error",o),this.events.onerror(o),this.events.onclose({code:o.closeCode,reason:o.reason})}).finally(()=>{this._close()})}send(s){const r=e.encode.number(this.lengthPrefixBuffer,s.length,{offset:0}),a=new Uint8Array(r+s.length);a.set(this.lengthPrefixBuffer.subarray(0,r),0),a.set(s,r),this.writer.write(a)}sendUnreliable(s){const r=e.encode.number(this.lengthPrefixBuffer,s.length,{offset:0}),a=new Uint8Array(r+s.length);a.set(this.lengthPrefixBuffer.subarray(0,r),0),a.set(s,r),this.unreliableWriter.write(a)}close(s,r){try{this.wt.close({closeCode:s,reason:r})}catch(a){console.error(a)}}readIncomingData(){return i.__awaiter(this,void 0,void 0,function*(){let s;for(;this.isOpen;){try{s=yield this.reader.read();const r=s.value,a={offset:0};do{const o=e.decode.number(r,a);this.events.onmessage({data:r.subarray(a.offset,a.offset+o)}),a.offset+=o}while(a.offset<r.length)}catch(r){r.message.indexOf("session is closed")===-1&&console.error("H3Transport: failed to read incoming data",r);break}if(s.done)break}})}readIncomingUnreliableData(){return i.__awaiter(this,void 0,void 0,function*(){let s;for(;this.isOpen;){try{s=yield this.unreliableReader.read();const r=s.value,a={offset:0};do{const o=e.decode.number(r,a);this.events.onmessage({data:r.subarray(a.offset,a.offset+o)}),a.offset+=o}while(a.offset<r.length)}catch(r){r.message.indexOf("session is closed")===-1&&console.error("H3Transport: failed to read incoming data",r);break}if(s.done)break}})}sendSeatReservation(s,r,a){const o={offset:0},c=[];e.encode.string(c,s,o),e.encode.string(c,r,o),a&&e.encode.string(c,a,o),this.writer.write(new Uint8Array(c).buffer)}_close(){this.isOpen=!1}}return zo.H3TransportTransport=t,zo}var Ho={},Vo,kh;function bm(){return kh||(kh=1,Vo=function(){throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object")}),Vo}var Fh;function Sm(){if(Fh)return Ho;Fh=1;var i=bm();const e=globalThis.WebSocket||i;let t=class{constructor(s){this.events=s}send(s){this.ws.send(s)}sendUnreliable(s){console.warn("colyseus.js: The WebSocket transport does not support unreliable messages")}connect(s,r){try{this.ws=new e(s,{headers:r,protocols:this.protocols})}catch{this.ws=new e(s,this.protocols)}this.ws.binaryType="arraybuffer",this.ws.onopen=this.events.onopen,this.ws.onmessage=this.events.onmessage,this.ws.onclose=this.events.onclose,this.ws.onerror=this.events.onerror}close(s,r){this.ws.close(s,r)}get isOpen(){return this.ws.readyState===e.OPEN}};return Ho.WebSocketTransport=t,Ho}var Bh;function Mm(){if(Bh)return Bo;Bh=1;var i=xm(),e=Sm();let t=class{constructor(s){switch(this.events={},s){case"h3":this.transport=new i.H3TransportTransport(this.events);break;default:this.transport=new e.WebSocketTransport(this.events);break}}connect(s,r){this.transport.connect.call(this.transport,s,r)}send(s){this.transport.send(s)}sendUnreliable(s){this.transport.sendUnreliable(s)}close(s,r){this.transport.close(s,r)}get isOpen(){return this.transport.isOpen}};return Bo.Connection=t,Bo}var Go={},zh;function ff(){return zh||(zh=1,(function(i){i.Protocol=void 0,(function(e){e[e.HANDSHAKE=9]="HANDSHAKE",e[e.JOIN_ROOM=10]="JOIN_ROOM",e[e.ERROR=11]="ERROR",e[e.LEAVE_ROOM=12]="LEAVE_ROOM",e[e.ROOM_DATA=13]="ROOM_DATA",e[e.ROOM_STATE=14]="ROOM_STATE",e[e.ROOM_STATE_PATCH=15]="ROOM_STATE_PATCH",e[e.ROOM_DATA_SCHEMA=16]="ROOM_DATA_SCHEMA",e[e.ROOM_DATA_BYTES=17]="ROOM_DATA_BYTES"})(i.Protocol||(i.Protocol={})),i.ErrorCode=void 0,(function(e){e[e.MATCHMAKE_NO_HANDLER=4210]="MATCHMAKE_NO_HANDLER",e[e.MATCHMAKE_INVALID_CRITERIA=4211]="MATCHMAKE_INVALID_CRITERIA",e[e.MATCHMAKE_INVALID_ROOM_ID=4212]="MATCHMAKE_INVALID_ROOM_ID",e[e.MATCHMAKE_UNHANDLED=4213]="MATCHMAKE_UNHANDLED",e[e.MATCHMAKE_EXPIRED=4214]="MATCHMAKE_EXPIRED",e[e.AUTH_FAILED=4215]="AUTH_FAILED",e[e.APPLICATION_ERROR=4216]="APPLICATION_ERROR"})(i.ErrorCode||(i.ErrorCode={}))})(Go)),Go}var _a={},Hh;function pf(){if(Hh)return _a;Hh=1;const i={};function e(n,s){i[n]=s}function t(n){const s=i[n];if(!s)throw new Error("missing serializer: "+n);return s}return _a.getSerializer=t,_a.registerSerializer=e,_a}var Wo={},Vh;function mf(){if(Vh)return Wo;Vh=1;const i=()=>({emit(e,...t){let n=this.events[e]||[];for(let s=0,r=n.length;s<r;s++)n[s](...t)},events:{},on(e,t){var n;return!((n=this.events[e])===null||n===void 0)&&n.push(t)||(this.events[e]=[t]),()=>{var s;this.events[e]=(s=this.events[e])===null||s===void 0?void 0:s.filter(r=>t!==r)}}});return Wo.createNanoEvents=i,Wo}var ya={},Gh;function wm(){if(Gh)return ya;Gh=1;class i{constructor(){this.handlers=[]}register(n,s=!1){return this.handlers.push(n),this}invoke(...n){this.handlers.forEach(s=>s.apply(this,n))}invokeAsync(...n){return Promise.all(this.handlers.map(s=>s.apply(this,n)))}remove(n){const s=this.handlers.indexOf(n);this.handlers[s]=this.handlers[this.handlers.length-1],this.handlers.pop()}clear(){this.handlers=[]}}function e(){const t=new i;function n(s){return t.register(s,this===null)}return n.once=s=>{const r=function(...a){s.apply(this,a),t.remove(r)};t.register(r)},n.remove=s=>t.remove(s),n.invoke=(...s)=>t.invoke(...s),n.invokeAsync=(...s)=>t.invokeAsync(...s),n.clear=()=>t.clear(),n}return ya.EventEmitter=i,ya.createSignal=e,ya}var xa={},Wh;function gf(){if(Wh)return xa;Wh=1;var i=Vl();function e(n){try{return i.getDecoderStateCallbacks(n.serializer.decoder)}catch{return}}let t=class{setState(s,r){this.decoder.decode(s,r)}getState(){return this.state}patch(s,r){return this.decoder.decode(s,r)}teardown(){this.decoder.root.clearRefs()}handshake(s,r){this.state?(i.Reflection.decode(s,r),this.decoder=new i.Decoder(this.state)):(this.decoder=i.Reflection.decode(s,r),this.state=this.decoder.state)}};return xa.SchemaSerializer=t,xa.getStateCallbacks=e,xa}var zc;try{zc=new TextDecoder}catch{}var Pe,ri,q=0,Bt={},_t,Bi,Ln=0,ni=0,an,Si,dn=[],vt,$h={useRecords:!1,mapsAsObjects:!0};class vf{}const Gl=new vf;Gl.name="MessagePack 0xC1";var Gi=!1,_f=2,Em;try{new Function("")}catch{_f=1/0}class $i{constructor(e){e&&(e.useRecords===!1&&e.mapsAsObjects===void 0&&(e.mapsAsObjects=!0),e.sequential&&e.trusted!==!1&&(e.trusted=!0,!e.structures&&e.useRecords!=!1&&(e.structures=[],e.maxSharedStructures||(e.maxSharedStructures=0))),e.structures?e.structures.sharedLength=e.structures.length:e.getStructures&&((e.structures=[]).uninitialized=!0,e.structures.sharedLength=0),e.int64AsNumber&&(e.int64AsType="number")),Object.assign(this,e)}unpack(e,t){if(Pe)return wf(()=>(uo(),this?this.unpack(e,t):$i.prototype.unpack.call($h,e,t)));!e.buffer&&e.constructor===ArrayBuffer&&(e=typeof Buffer<"u"?Buffer.from(e):new Uint8Array(e)),typeof t=="object"?(ri=t.end||e.length,q=t.start||0):(q=0,ri=t>-1?t:e.length),ni=0,Bi=null,an=null,Pe=e;try{vt=e.dataView||(e.dataView=new DataView(e.buffer,e.byteOffset,e.byteLength))}catch(n){throw Pe=null,e instanceof Uint8Array?n:new Error("Source must be a Uint8Array or Buffer but was a "+(e&&typeof e=="object"?e.constructor.name:typeof e))}if(this instanceof $i){if(Bt=this,this.structures)return _t=this.structures,ba(t);(!_t||_t.length>0)&&(_t=[])}else Bt=$h,(!_t||_t.length>0)&&(_t=[]);return ba(t)}unpackMultiple(e,t){let n,s=0;try{Gi=!0;let r=e.length,a=this?this.unpack(e,r):Eo.unpack(e,r);if(t){if(t(a,s,q)===!1)return;for(;q<r;)if(s=q,t(ba(),s,q)===!1)return}else{for(n=[a];q<r;)s=q,n.push(ba());return n}}catch(r){throw r.lastPosition=s,r.values=n,r}finally{Gi=!1,uo()}}_mergeStructures(e,t){e=e||[],Object.isFrozen(e)&&(e=e.map(n=>n.slice(0)));for(let n=0,s=e.length;n<s;n++){let r=e[n];r&&(r.isShared=!0,n>=32&&(r.highByte=n-32>>5))}e.sharedLength=e.length;for(let n in t||[])if(n>=0){let s=e[n],r=t[n];r&&(s&&((e.restoreStructures||(e.restoreStructures=[]))[n]=s),e[n]=r)}return this.structures=e}decode(e,t){return this.unpack(e,t)}}function ba(i){try{if(!Bt.trusted&&!Gi){let t=_t.sharedLength||0;t<_t.length&&(_t.length=t)}let e;if(Bt.randomAccessStructure&&Pe[q]<64&&Pe[q]>=32&&Em||(e=Xt()),an&&(q=an.postBundlePosition,an=null),Gi&&(_t.restoreStructures=null),q==ri)_t&&_t.restoreStructures&&Xh(),_t=null,Pe=null,Si&&(Si=null);else{if(q>ri)throw new Error("Unexpected end of MessagePack data");if(!Gi){let t;try{t=JSON.stringify(e,(n,s)=>typeof s=="bigint"?`${s}n`:s).slice(0,100)}catch(n){t="(JSON view not available "+n+")"}throw new Error("Data read, but end of buffer not reached "+t)}}return e}catch(e){throw _t&&_t.restoreStructures&&Xh(),uo(),(e instanceof RangeError||e.message.startsWith("Unexpected end of buffer")||q>ri)&&(e.incomplete=!0),e}}function Xh(){for(let i in _t.restoreStructures)_t[i]=_t.restoreStructures[i];_t.restoreStructures=null}function Xt(){let i=Pe[q++];if(i<160)if(i<128){if(i<64)return i;{let e=_t[i&63]||Bt.getStructures&&yf()[i&63];return e?(e.read||(e.read=Wl(e,i&63)),e.read()):i}}else if(i<144)if(i-=128,Bt.mapsAsObjects){let e={};for(let t=0;t<i;t++){let n=bf();n==="__proto__"&&(n="__proto_"),e[n]=Xt()}return e}else{let e=new Map;for(let t=0;t<i;t++)e.set(Xt(),Xt());return e}else{i-=144;let e=new Array(i);for(let t=0;t<i;t++)e[t]=Xt();return Bt.freezeData?Object.freeze(e):e}else if(i<192){let e=i-160;if(ni>=q)return Bi.slice(q-Ln,(q+=e)-Ln);if(ni==0&&ri<140){let t=e<16?$l(e):xf(e);if(t!=null)return t}return Hc(e)}else{let e;switch(i){case 192:return null;case 193:return an?(e=Xt(),e>0?an[1].slice(an.position1,an.position1+=e):an[0].slice(an.position0,an.position0-=e)):Gl;case 194:return!1;case 195:return!0;case 196:if(e=Pe[q++],e===void 0)throw new Error("Unexpected end of buffer");return $o(e);case 197:return e=vt.getUint16(q),q+=2,$o(e);case 198:return e=vt.getUint32(q),q+=4,$o(e);case 199:return Qi(Pe[q++]);case 200:return e=vt.getUint16(q),q+=2,Qi(e);case 201:return e=vt.getUint32(q),q+=4,Qi(e);case 202:if(e=vt.getFloat32(q),Bt.useFloat32>2){let t=wo[(Pe[q]&127)<<1|Pe[q+1]>>7];return q+=4,(t*e+(e>0?.5:-.5)>>0)/t}return q+=4,e;case 203:return e=vt.getFloat64(q),q+=8,e;case 204:return Pe[q++];case 205:return e=vt.getUint16(q),q+=2,e;case 206:return e=vt.getUint32(q),q+=4,e;case 207:return Bt.int64AsType==="number"?(e=vt.getUint32(q)*4294967296,e+=vt.getUint32(q+4)):Bt.int64AsType==="string"?e=vt.getBigUint64(q).toString():Bt.int64AsType==="auto"?(e=vt.getBigUint64(q),e<=BigInt(2)<<BigInt(52)&&(e=Number(e))):e=vt.getBigUint64(q),q+=8,e;case 208:return vt.getInt8(q++);case 209:return e=vt.getInt16(q),q+=2,e;case 210:return e=vt.getInt32(q),q+=4,e;case 211:return Bt.int64AsType==="number"?(e=vt.getInt32(q)*4294967296,e+=vt.getUint32(q+4)):Bt.int64AsType==="string"?e=vt.getBigInt64(q).toString():Bt.int64AsType==="auto"?(e=vt.getBigInt64(q),e>=BigInt(-2)<<BigInt(52)&&e<=BigInt(2)<<BigInt(52)&&(e=Number(e))):e=vt.getBigInt64(q),q+=8,e;case 212:if(e=Pe[q++],e==114)return Zh(Pe[q++]&63);{let t=dn[e];if(t)return t.read?(q++,t.read(Xt())):t.noBuffer?(q++,t()):t(Pe.subarray(q,++q));throw new Error("Unknown extension "+e)}case 213:return e=Pe[q],e==114?(q++,Zh(Pe[q++]&63,Pe[q++])):Qi(2);case 214:return Qi(4);case 215:return Qi(8);case 216:return Qi(16);case 217:return e=Pe[q++],ni>=q?Bi.slice(q-Ln,(q+=e)-Ln):Am(e);case 218:return e=vt.getUint16(q),q+=2,ni>=q?Bi.slice(q-Ln,(q+=e)-Ln):Rm(e);case 219:return e=vt.getUint32(q),q+=4,ni>=q?Bi.slice(q-Ln,(q+=e)-Ln):Cm(e);case 220:return e=vt.getUint16(q),q+=2,jh(e);case 221:return e=vt.getUint32(q),q+=4,jh(e);case 222:return e=vt.getUint16(q),q+=2,Yh(e);case 223:return e=vt.getUint32(q),q+=4,Yh(e);default:if(i>=224)return i-256;if(i===void 0){let t=new Error("Unexpected end of MessagePack data");throw t.incomplete=!0,t}throw new Error("Unknown MessagePack token "+i)}}}const Tm=/^[a-zA-Z_$][a-zA-Z\d_$]*$/;function Wl(i,e){function t(){if(t.count++>_f){let s=i.read=new Function("r","return function(){return "+(Bt.freezeData?"Object.freeze":"")+"({"+i.map(r=>r==="__proto__"?"__proto_:r()":Tm.test(r)?r+":r()":"["+JSON.stringify(r)+"]:r()").join(",")+"})}")(Xt);return i.highByte===0&&(i.read=qh(e,i.read)),s()}let n={};for(let s=0,r=i.length;s<r;s++){let a=i[s];a==="__proto__"&&(a="__proto_"),n[a]=Xt()}return Bt.freezeData?Object.freeze(n):n}return t.count=0,i.highByte===0?qh(e,t):t}const qh=(i,e)=>function(){let t=Pe[q++];if(t===0)return e();let n=i<32?-(i+(t<<5)):i+(t<<5),s=_t[n]||yf()[n];if(!s)throw new Error("Record id is not defined for "+n);return s.read||(s.read=Wl(s,i)),s.read()};function yf(){let i=wf(()=>(Pe=null,Bt.getStructures()));return _t=Bt._mergeStructures(i,_t)}var Hc=ra,Am=ra,Rm=ra,Cm=ra;let Pm=!1;function ra(i){let e;if(i<16&&(e=$l(i)))return e;if(i>64&&zc)return zc.decode(Pe.subarray(q,q+=i));const t=q+i,n=[];for(e="";q<t;){const s=Pe[q++];if((s&128)===0)n.push(s);else if((s&224)===192){const r=Pe[q++]&63;n.push((s&31)<<6|r)}else if((s&240)===224){const r=Pe[q++]&63,a=Pe[q++]&63;n.push((s&31)<<12|r<<6|a)}else if((s&248)===240){const r=Pe[q++]&63,a=Pe[q++]&63,o=Pe[q++]&63;let c=(s&7)<<18|r<<12|a<<6|o;c>65535&&(c-=65536,n.push(c>>>10&1023|55296),c=56320|c&1023),n.push(c)}else n.push(s);n.length>=4096&&(e+=sn.apply(String,n),n.length=0)}return n.length>0&&(e+=sn.apply(String,n)),e}function jh(i){let e=new Array(i);for(let t=0;t<i;t++)e[t]=Xt();return Bt.freezeData?Object.freeze(e):e}function Yh(i){if(Bt.mapsAsObjects){let e={};for(let t=0;t<i;t++){let n=bf();n==="__proto__"&&(n="__proto_"),e[n]=Xt()}return e}else{let e=new Map;for(let t=0;t<i;t++)e.set(Xt(),Xt());return e}}var sn=String.fromCharCode;function xf(i){let e=q,t=new Array(i);for(let n=0;n<i;n++){const s=Pe[q++];if((s&128)>0){q=e;return}t[n]=s}return sn.apply(String,t)}function $l(i){if(i<4)if(i<2){if(i===0)return"";{let e=Pe[q++];if((e&128)>1){q-=1;return}return sn(e)}}else{let e=Pe[q++],t=Pe[q++];if((e&128)>0||(t&128)>0){q-=2;return}if(i<3)return sn(e,t);let n=Pe[q++];if((n&128)>0){q-=3;return}return sn(e,t,n)}else{let e=Pe[q++],t=Pe[q++],n=Pe[q++],s=Pe[q++];if((e&128)>0||(t&128)>0||(n&128)>0||(s&128)>0){q-=4;return}if(i<6){if(i===4)return sn(e,t,n,s);{let r=Pe[q++];if((r&128)>0){q-=5;return}return sn(e,t,n,s,r)}}else if(i<8){let r=Pe[q++],a=Pe[q++];if((r&128)>0||(a&128)>0){q-=6;return}if(i<7)return sn(e,t,n,s,r,a);let o=Pe[q++];if((o&128)>0){q-=7;return}return sn(e,t,n,s,r,a,o)}else{let r=Pe[q++],a=Pe[q++],o=Pe[q++],c=Pe[q++];if((r&128)>0||(a&128)>0||(o&128)>0||(c&128)>0){q-=8;return}if(i<10){if(i===8)return sn(e,t,n,s,r,a,o,c);{let h=Pe[q++];if((h&128)>0){q-=9;return}return sn(e,t,n,s,r,a,o,c,h)}}else if(i<12){let h=Pe[q++],d=Pe[q++];if((h&128)>0||(d&128)>0){q-=10;return}if(i<11)return sn(e,t,n,s,r,a,o,c,h,d);let u=Pe[q++];if((u&128)>0){q-=11;return}return sn(e,t,n,s,r,a,o,c,h,d,u)}else{let h=Pe[q++],d=Pe[q++],u=Pe[q++],m=Pe[q++];if((h&128)>0||(d&128)>0||(u&128)>0||(m&128)>0){q-=12;return}if(i<14){if(i===12)return sn(e,t,n,s,r,a,o,c,h,d,u,m);{let p=Pe[q++];if((p&128)>0){q-=13;return}return sn(e,t,n,s,r,a,o,c,h,d,u,m,p)}}else{let p=Pe[q++],y=Pe[q++];if((p&128)>0||(y&128)>0){q-=14;return}if(i<15)return sn(e,t,n,s,r,a,o,c,h,d,u,m,p,y);let x=Pe[q++];if((x&128)>0){q-=15;return}return sn(e,t,n,s,r,a,o,c,h,d,u,m,p,y,x)}}}}}function Kh(){let i=Pe[q++],e;if(i<192)e=i-160;else switch(i){case 217:e=Pe[q++];break;case 218:e=vt.getUint16(q),q+=2;break;case 219:e=vt.getUint32(q),q+=4;break;default:throw new Error("Expected string")}return ra(e)}function $o(i){return Bt.copyBuffers?Uint8Array.prototype.slice.call(Pe,q,q+=i):Pe.subarray(q,q+=i)}function Qi(i){let e=Pe[q++];if(dn[e]){let t;return dn[e](Pe.subarray(q,t=q+=i),n=>{q=n;try{return Xt()}finally{q=t}})}else throw new Error("Unknown extension type "+e)}var Jh=new Array(4096);function bf(){let i=Pe[q++];if(i>=160&&i<192){if(i=i-160,ni>=q)return Bi.slice(q-Ln,(q+=i)-Ln);if(!(ni==0&&ri<180))return Hc(i)}else return q--,Sf(Xt());let e=(i<<5^(i>1?vt.getUint16(q):i>0?Pe[q]:0))&4095,t=Jh[e],n=q,s=q+i-3,r,a=0;if(t&&t.bytes==i){for(;n<s;){if(r=vt.getUint32(n),r!=t[a++]){n=1879048192;break}n+=4}for(s+=3;n<s;)if(r=Pe[n++],r!=t[a++]){n=1879048192;break}if(n===s)return q=n,t.string;s-=3,n=q}for(t=[],Jh[e]=t,t.bytes=i;n<s;)r=vt.getUint32(n),t.push(r),n+=4;for(s+=3;n<s;)r=Pe[n++],t.push(r);let o=i<16?$l(i):xf(i);return o!=null?t.string=o:t.string=Hc(i)}function Sf(i){if(typeof i=="string")return i;if(typeof i=="number"||typeof i=="boolean"||typeof i=="bigint")return i.toString();if(i==null)return i+"";if(Bt.allowArraysInMapKeys&&Array.isArray(i)&&i.flat().every(e=>["string","number","boolean","bigint"].includes(typeof e)))return i.flat().toString();throw new Error(`Invalid property type for record: ${typeof i}`)}const Zh=(i,e)=>{let t=Xt().map(Sf),n=i;e!==void 0&&(i=i<32?-((e<<5)+i):(e<<5)+i,t.highByte=e);let s=_t[i];return s&&(s.isShared||Gi)&&((_t.restoreStructures||(_t.restoreStructures=[]))[i]=s),_t[i]=t,t.read=Wl(t,n),t.read()};dn[0]=()=>{};dn[0].noBuffer=!0;dn[66]=i=>{let e=i.length,t=BigInt(i[0]&128?i[0]-256:i[0]);for(let n=1;n<e;n++)t<<=BigInt(8),t+=BigInt(i[n]);return t};let Im={Error,TypeError,ReferenceError};dn[101]=()=>{let i=Xt();return(Im[i[0]]||Error)(i[1],{cause:i[2]})};dn[105]=i=>{if(Bt.structuredClone===!1)throw new Error("Structured clone extension is disabled");let e=vt.getUint32(q-4);Si||(Si=new Map);let t=Pe[q],n;t>=144&&t<160||t==220||t==221?n=[]:n={};let s={target:n};Si.set(e,s);let r=Xt();return s.used?Object.assign(n,r):(s.target=r,r)};dn[112]=i=>{if(Bt.structuredClone===!1)throw new Error("Structured clone extension is disabled");let e=vt.getUint32(q-4),t=Si.get(e);return t.used=!0,t.target};dn[115]=()=>new Set(Xt());const Mf=["Int8","Uint8","Uint8Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64","BigInt64","BigUint64"].map(i=>i+"Array");let Dm=typeof globalThis=="object"?globalThis:window;dn[116]=i=>{let e=i[0],t=Mf[e];if(!t){if(e===16){let n=new ArrayBuffer(i.length-1);return new Uint8Array(n).set(i.subarray(1)),n}throw new Error("Could not find typed array for code "+e)}return new Dm[t](Uint8Array.prototype.slice.call(i,1).buffer)};dn[120]=()=>{let i=Xt();return new RegExp(i[0],i[1])};const Lm=[];dn[98]=i=>{let e=(i[0]<<24)+(i[1]<<16)+(i[2]<<8)+i[3],t=q;return q+=e-i.length,an=Lm,an=[Kh(),Kh()],an.position0=0,an.position1=0,an.postBundlePosition=q,q=t,Xt()};dn[255]=i=>i.length==4?new Date((i[0]*16777216+(i[1]<<16)+(i[2]<<8)+i[3])*1e3):i.length==8?new Date(((i[0]<<22)+(i[1]<<14)+(i[2]<<6)+(i[3]>>2))/1e6+((i[3]&3)*4294967296+i[4]*16777216+(i[5]<<16)+(i[6]<<8)+i[7])*1e3):i.length==12?new Date(((i[0]<<24)+(i[1]<<16)+(i[2]<<8)+i[3])/1e6+((i[4]&128?-281474976710656:0)+i[6]*1099511627776+i[7]*4294967296+i[8]*16777216+(i[9]<<16)+(i[10]<<8)+i[11])*1e3):new Date("invalid");function wf(i){let e=ri,t=q,n=Ln,s=ni,r=Bi,a=Si,o=an,c=new Uint8Array(Pe.slice(0,ri)),h=_t,d=_t.slice(0,_t.length),u=Bt,m=Gi,p=i();return ri=e,q=t,Ln=n,ni=s,Bi=r,Si=a,an=o,Pe=c,Gi=m,_t=h,_t.splice(0,_t.length,...d),Bt=u,vt=new DataView(Pe.buffer,Pe.byteOffset,Pe.byteLength),p}function uo(){Pe=null,Si=null,_t=null}function Om(i){i.unpack?dn[i.type]=i.unpack:dn[i.type]=i}const wo=new Array(147);for(let i=0;i<256;i++)wo[i]=+("1e"+Math.floor(45.15-i*.30103));const Um=$i;var Eo=new $i({useRecords:!1});const Nm=Eo.unpack,km=Eo.unpackMultiple,Fm=Eo.unpack,Ef={NEVER:0,ALWAYS:1,DECIMAL_ROUND:3,DECIMAL_FIT:4};let Tf=new Float32Array(1),Qh=new Uint8Array(Tf.buffer,0,4);function Bm(i){Tf[0]=i;let e=wo[(Qh[3]&127)<<1|Qh[2]>>7];return(e*i+(i>0?.5:-.5)>>0)/e}let Za;try{Za=new TextEncoder}catch{}let fo,Xl;const To=typeof Buffer<"u",Sa=To?function(i){return Buffer.allocUnsafeSlow(i)}:Uint8Array,Af=To?Buffer:Uint8Array,eu=To?4294967296:2144337920;let te,Sr,Nt,Y=0,pn,Wt=null,zm;const Hm=21760,Vm=/[\u0080-\uFFFF]/,Rs=Symbol("record-id");class aa extends $i{constructor(e){super(e),this.offset=0;let t,n,s,r,a=Af.prototype.utf8Write?function(I,W){return te.utf8Write(I,W,te.byteLength-W)}:Za&&Za.encodeInto?function(I,W){return Za.encodeInto(I,te.subarray(W)).written}:!1,o=this;e||(e={});let c=e&&e.sequential,h=e.structures||e.saveStructures,d=e.maxSharedStructures;if(d==null&&(d=h?32:0),d>8160)throw new Error("Maximum maxSharedStructure is 8160");e.structuredClone&&e.moreTypes==null&&(this.moreTypes=!0);let u=e.maxOwnStructures;u==null&&(u=h?32:64),!this.structures&&e.useRecords!=!1&&(this.structures=[]);let m=d>32||u+d>64,p=d+64,y=d+u+64;if(y>8256)throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");let x=[],_=0,g=0;this.pack=this.encode=function(I,W){if(te||(te=new Sa(8192),Nt=te.dataView||(te.dataView=new DataView(te.buffer,0,8192)),Y=0),pn=te.length-10,pn-Y<2048?(te=new Sa(te.length),Nt=te.dataView||(te.dataView=new DataView(te.buffer,0,te.length)),pn=te.length-10,Y=0):Y=Y+7&2147483640,t=Y,W&If&&(Y+=W&255),r=o.structuredClone?new Map:null,o.bundleStrings&&typeof I!="string"?(Wt=[],Wt.size=1/0):Wt=null,s=o.structures,s){s.uninitialized&&(s=o._mergeStructures(o.getStructures()));let z=s.sharedLength||0;if(z>d)throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to "+s.sharedLength);if(!s.transitions){s.transitions=Object.create(null);for(let $=0;$<z;$++){let X=s[$];if(!X)continue;let de,fe=s.transitions;for(let Se=0,ke=X.length;Se<ke;Se++){let lt=X[Se];de=fe[lt],de||(de=fe[lt]=Object.create(null)),fe=de}fe[Rs]=$+64}this.lastNamedStructuresLength=z}c||(s.nextId=z+64)}n&&(n=!1);let H;try{o.randomAccessStructure&&I&&I.constructor&&I.constructor===Object?Z(I):S(I);let z=Wt;if(Wt&&iu(t,S,0),r&&r.idsToInsert){let $=r.idsToInsert.sort((Se,ke)=>Se.offset>ke.offset?1:-1),X=$.length,de=-1;for(;z&&X>0;){let Se=$[--X].offset+t;Se<z.stringsPosition+t&&de===-1&&(de=0),Se>z.position+t?de>=0&&(de+=6):(de>=0&&(Nt.setUint32(z.position+t,Nt.getUint32(z.position+t)+de),de=-1),z=z.previous,X++)}de>=0&&z&&Nt.setUint32(z.position+t,Nt.getUint32(z.position+t)+de),Y+=$.length*6,Y>pn&&E(Y),o.offset=Y;let fe=Wm(te.subarray(t,Y),$);return r=null,fe}return o.offset=Y,W&Cf?(te.start=t,te.end=Y,te):te.subarray(t,Y)}catch(z){throw H=z,z}finally{if(s&&(T(),n&&o.saveStructures)){let z=s.sharedLength||0,$=te.subarray(t,Y),X=Xm(s,o);if(!H)return o.saveStructures(X,X.isCompatible)===!1?o.pack(I,W):(o.lastNamedStructuresLength=z,te.length>1073741824&&(te=null),$)}te.length>1073741824&&(te=null),W&Pf&&(Y=t)}};const T=()=>{g<10&&g++;let I=s.sharedLength||0;if(s.length>I&&!c&&(s.length=I),_>1e4)s.transitions=null,g=0,_=0,x.length>0&&(x=[]);else if(x.length>0&&!c){for(let W=0,H=x.length;W<H;W++)x[W][Rs]=0;x=[]}},C=I=>{var W=I.length;W<16?te[Y++]=144|W:W<65536?(te[Y++]=220,te[Y++]=W>>8,te[Y++]=W&255):(te[Y++]=221,Nt.setUint32(Y,W),Y+=4);for(let H=0;H<W;H++)S(I[H])},S=I=>{Y>pn&&(te=E(Y));var W=typeof I,H;if(W==="string"){let z=I.length;if(Wt&&z>=4&&z<4096){if((Wt.size+=z)>Hm){let fe,Se=(Wt[0]?Wt[0].length*3+Wt[1].length:0)+10;Y+Se>pn&&(te=E(Y+Se));let ke;Wt.position?(ke=Wt,te[Y]=200,Y+=3,te[Y++]=98,fe=Y-t,Y+=4,iu(t,S,0),Nt.setUint16(fe+t-3,Y-t-fe)):(te[Y++]=214,te[Y++]=98,fe=Y-t,Y+=4),Wt=["",""],Wt.previous=ke,Wt.size=0,Wt.position=fe}let de=Vm.test(I);Wt[de?0:1]+=I,te[Y++]=193,S(de?-z:z);return}let $;z<32?$=1:z<256?$=2:z<65536?$=3:$=5;let X=z*3;if(Y+X>pn&&(te=E(Y+X)),z<64||!a){let de,fe,Se,ke=Y+$;for(de=0;de<z;de++)fe=I.charCodeAt(de),fe<128?te[ke++]=fe:fe<2048?(te[ke++]=fe>>6|192,te[ke++]=fe&63|128):(fe&64512)===55296&&((Se=I.charCodeAt(de+1))&64512)===56320?(fe=65536+((fe&1023)<<10)+(Se&1023),de++,te[ke++]=fe>>18|240,te[ke++]=fe>>12&63|128,te[ke++]=fe>>6&63|128,te[ke++]=fe&63|128):(te[ke++]=fe>>12|224,te[ke++]=fe>>6&63|128,te[ke++]=fe&63|128);H=ke-Y-$}else H=a(I,Y+$);H<32?te[Y++]=160|H:H<256?($<2&&te.copyWithin(Y+2,Y+1,Y+1+H),te[Y++]=217,te[Y++]=H):H<65536?($<3&&te.copyWithin(Y+3,Y+2,Y+2+H),te[Y++]=218,te[Y++]=H>>8,te[Y++]=H&255):($<5&&te.copyWithin(Y+5,Y+3,Y+3+H),te[Y++]=219,Nt.setUint32(Y,H),Y+=4),Y+=H}else if(W==="number")if(I>>>0===I)I<32||I<128&&this.useRecords===!1||I<64&&!this.randomAccessStructure?te[Y++]=I:I<256?(te[Y++]=204,te[Y++]=I):I<65536?(te[Y++]=205,te[Y++]=I>>8,te[Y++]=I&255):(te[Y++]=206,Nt.setUint32(Y,I),Y+=4);else if(I>>0===I)I>=-32?te[Y++]=256+I:I>=-128?(te[Y++]=208,te[Y++]=I+256):I>=-32768?(te[Y++]=209,Nt.setInt16(Y,I),Y+=2):(te[Y++]=210,Nt.setInt32(Y,I),Y+=4);else{let z;if((z=this.useFloat32)>0&&I<4294967296&&I>=-2147483648){te[Y++]=202,Nt.setFloat32(Y,I);let $;if(z<4||($=I*wo[(te[Y]&127)<<1|te[Y+1]>>7])>>0===$){Y+=4;return}else Y--}te[Y++]=203,Nt.setFloat64(Y,I),Y+=8}else if(W==="object"||W==="function")if(!I)te[Y++]=192;else{if(r){let $=r.get(I);if($){if(!$.id){let X=r.idsToInsert||(r.idsToInsert=[]);$.id=X.push($)}te[Y++]=214,te[Y++]=112,Nt.setUint32(Y,$.id),Y+=4;return}else r.set(I,{offset:Y-t})}let z=I.constructor;if(z===Object)P(I);else if(z===Array)C(I);else if(z===Map)if(this.mapAsEmptyObject)te[Y++]=128;else{H=I.size,H<16?te[Y++]=128|H:H<65536?(te[Y++]=222,te[Y++]=H>>8,te[Y++]=H&255):(te[Y++]=223,Nt.setUint32(Y,H),Y+=4);for(let[$,X]of I)S($),S(X)}else{for(let $=0,X=fo.length;$<X;$++){let de=Xl[$];if(I instanceof de){let fe=fo[$];if(fe.write){fe.type&&(te[Y++]=212,te[Y++]=fe.type,te[Y++]=0);let pt=fe.write.call(this,I);pt===I?Array.isArray(I)?C(I):P(I):S(pt);return}let Se=te,ke=Nt,lt=Y;te=null;let mt;try{mt=fe.pack.call(this,I,pt=>(te=Se,Se=null,Y+=pt,Y>pn&&E(Y),{target:te,targetView:Nt,position:Y-pt}),S)}finally{Se&&(te=Se,Nt=ke,Y=lt,pn=te.length-10)}mt&&(mt.length+Y>pn&&E(mt.length+Y),Y=Gm(mt,te,Y,fe.type));return}}if(Array.isArray(I))C(I);else{if(I.toJSON){const $=I.toJSON();if($!==I)return S($)}if(W==="function")return S(this.writeFunction&&this.writeFunction(I));P(I)}}}else if(W==="boolean")te[Y++]=I?195:194;else if(W==="bigint"){if(I<BigInt(1)<<BigInt(63)&&I>=-(BigInt(1)<<BigInt(63)))te[Y++]=211,Nt.setBigInt64(Y,I);else if(I<BigInt(1)<<BigInt(64)&&I>0)te[Y++]=207,Nt.setBigUint64(Y,I);else if(this.largeBigIntToFloat)te[Y++]=203,Nt.setFloat64(Y,Number(I));else{if(this.largeBigIntToString)return S(I.toString());if(this.useBigIntExtension&&I<BigInt(2)**BigInt(1023)&&I>-(BigInt(2)**BigInt(1023))){te[Y++]=199,Y++,te[Y++]=66;let z=[],$;do{let X=I&BigInt(255);$=(X&BigInt(128))===(I<BigInt(0)?BigInt(128):BigInt(0)),z.push(X),I>>=BigInt(8)}while(!((I===BigInt(0)||I===BigInt(-1))&&$));te[Y-2]=z.length;for(let X=z.length;X>0;)te[Y++]=Number(z[--X]);return}else throw new RangeError(I+" was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string")}Y+=8}else if(W==="undefined")this.encodeUndefinedAsNil?te[Y++]=192:(te[Y++]=212,te[Y++]=0,te[Y++]=0);else throw new Error("Unknown type: "+W)},U=this.variableMapSize||this.coercibleKeyAsNumber||this.skipValues?I=>{let W;if(this.skipValues){W=[];for(let $ in I)(typeof I.hasOwnProperty!="function"||I.hasOwnProperty($))&&!this.skipValues.includes(I[$])&&W.push($)}else W=Object.keys(I);let H=W.length;H<16?te[Y++]=128|H:H<65536?(te[Y++]=222,te[Y++]=H>>8,te[Y++]=H&255):(te[Y++]=223,Nt.setUint32(Y,H),Y+=4);let z;if(this.coercibleKeyAsNumber)for(let $=0;$<H;$++){z=W[$];let X=Number(z);S(isNaN(X)?z:X),S(I[z])}else for(let $=0;$<H;$++)S(z=W[$]),S(I[z])}:I=>{te[Y++]=222;let W=Y-t;Y+=2;let H=0;for(let z in I)(typeof I.hasOwnProperty!="function"||I.hasOwnProperty(z))&&(S(z),S(I[z]),H++);if(H>65535)throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');te[W+++t]=H>>8,te[W+t]=H&255},O=this.useRecords===!1?U:e.progressiveRecords&&!m?I=>{let W,H=s.transitions||(s.transitions=Object.create(null)),z=Y++-t,$;for(let X in I)if(typeof I.hasOwnProperty!="function"||I.hasOwnProperty(X)){if(W=H[X],W)H=W;else{let de=Object.keys(I),fe=H;H=s.transitions;let Se=0;for(let ke=0,lt=de.length;ke<lt;ke++){let mt=de[ke];W=H[mt],W||(W=H[mt]=Object.create(null),Se++),H=W}z+t+1==Y?(Y--,A(H,de,Se)):B(H,de,z,Se),$=!0,H=fe[X]}S(I[X])}if(!$){let X=H[Rs];X?te[z+t]=X:B(H,Object.keys(I),z,0)}}:I=>{let W,H=s.transitions||(s.transitions=Object.create(null)),z=0;for(let X in I)(typeof I.hasOwnProperty!="function"||I.hasOwnProperty(X))&&(W=H[X],W||(W=H[X]=Object.create(null),z++),H=W);let $=H[Rs];$?$>=96&&m?(te[Y++]=(($-=96)&31)+96,te[Y++]=$>>5):te[Y++]=$:A(H,H.__keys__||Object.keys(I),z);for(let X in I)(typeof I.hasOwnProperty!="function"||I.hasOwnProperty(X))&&S(I[X])},N=typeof this.useRecords=="function"&&this.useRecords,P=N?I=>{N(I)?O(I):U(I)}:O,E=I=>{let W;if(I>16777216){if(I-t>eu)throw new Error("Packed buffer would be larger than maximum buffer size");W=Math.min(eu,Math.round(Math.max((I-t)*(I>67108864?1.25:2),4194304)/4096)*4096)}else W=(Math.max(I-t<<2,te.length-1)>>12)+1<<12;let H=new Sa(W);return Nt=H.dataView||(H.dataView=new DataView(H.buffer,0,W)),I=Math.min(I,te.length),te.copy?te.copy(H,0,t,I):H.set(te.slice(t,I)),Y-=t,t=0,pn=H.length-10,te=H},A=(I,W,H)=>{let z=s.nextId;z||(z=64),z<p&&this.shouldShareStructure&&!this.shouldShareStructure(W)?(z=s.nextOwnId,z<y||(z=p),s.nextOwnId=z+1):(z>=y&&(z=p),s.nextId=z+1);let $=W.highByte=z>=96&&m?z-96>>5:-1;I[Rs]=z,I.__keys__=W,s[z-64]=W,z<p?(W.isShared=!0,s.sharedLength=z-63,n=!0,$>=0?(te[Y++]=(z&31)+96,te[Y++]=$):te[Y++]=z):($>=0?(te[Y++]=213,te[Y++]=114,te[Y++]=(z&31)+96,te[Y++]=$):(te[Y++]=212,te[Y++]=114,te[Y++]=z),H&&(_+=g*H),x.length>=u&&(x.shift()[Rs]=0),x.push(I),S(W))},B=(I,W,H,z)=>{let $=te,X=Y,de=pn,fe=t;te=Sr,Y=0,t=0,te||(Sr=te=new Sa(8192)),pn=te.length-10,A(I,W,z),Sr=te;let Se=Y;if(te=$,Y=X,pn=de,t=fe,Se>1){let ke=Y+Se-1;ke>pn&&E(ke);let lt=H+t;te.copyWithin(lt+Se,lt+1,Y),te.set(Sr.slice(0,Se),lt),Y=ke}else te[H+t]=Sr[0]},Z=I=>{let W=zm(I,te,t,Y,s,E,(H,z,$)=>{if($)return n=!0;Y=z;let X=te;return S(H),T(),X!==te?{position:Y,targetView:Nt,target:te}:Y},this);if(W===0)return P(I);Y=W}}useBuffer(e){te=e,te.dataView||(te.dataView=new DataView(te.buffer,te.byteOffset,te.byteLength)),Nt=te.dataView,Y=0}set position(e){Y=e}get position(){return Y}set buffer(e){te=e}get buffer(){return te}clearSharedData(){this.structures&&(this.structures=[]),this.typedStructs&&(this.typedStructs=[])}}Xl=[Date,Set,Error,RegExp,ArrayBuffer,Object.getPrototypeOf(Uint8Array.prototype).constructor,vf];fo=[{pack(i,e,t){let n=i.getTime()/1e3;if((this.useTimestamp32||i.getMilliseconds()===0)&&n>=0&&n<4294967296){let{target:s,targetView:r,position:a}=e(6);s[a++]=214,s[a++]=255,r.setUint32(a,n)}else if(n>0&&n<4294967296){let{target:s,targetView:r,position:a}=e(10);s[a++]=215,s[a++]=255,r.setUint32(a,i.getMilliseconds()*4e6+(n/1e3/4294967296>>0)),r.setUint32(a+4,n)}else if(isNaN(n)){if(this.onInvalidDate)return e(0),t(this.onInvalidDate());let{target:s,targetView:r,position:a}=e(3);s[a++]=212,s[a++]=255,s[a++]=255}else{let{target:s,targetView:r,position:a}=e(15);s[a++]=199,s[a++]=12,s[a++]=255,r.setUint32(a,i.getMilliseconds()*1e6),r.setBigInt64(a+4,BigInt(Math.floor(n)))}}},{pack(i,e,t){if(this.setAsEmptyObject)return e(0),t({});let n=Array.from(i),{target:s,position:r}=e(this.moreTypes?3:0);this.moreTypes&&(s[r++]=212,s[r++]=115,s[r++]=0),t(n)}},{pack(i,e,t){let{target:n,position:s}=e(this.moreTypes?3:0);this.moreTypes&&(n[s++]=212,n[s++]=101,n[s++]=0),t([i.name,i.message,i.cause])}},{pack(i,e,t){let{target:n,position:s}=e(this.moreTypes?3:0);this.moreTypes&&(n[s++]=212,n[s++]=120,n[s++]=0),t([i.source,i.flags])}},{pack(i,e){this.moreTypes?tu(i,16,e):nu(To?Buffer.from(i):new Uint8Array(i),e)}},{pack(i,e){let t=i.constructor;t!==Af&&this.moreTypes?tu(i,Mf.indexOf(t.name),e):nu(i,e)}},{pack(i,e){let{target:t,position:n}=e(1);t[n]=193}}];function tu(i,e,t,n){let s=i.byteLength;if(s+1<256){var{target:r,position:a}=t(4+s);r[a++]=199,r[a++]=s+1}else if(s+1<65536){var{target:r,position:a}=t(5+s);r[a++]=200,r[a++]=s+1>>8,r[a++]=s+1&255}else{var{target:r,position:a,targetView:o}=t(7+s);r[a++]=201,o.setUint32(a,s+1),a+=4}r[a++]=116,r[a++]=e,i.buffer||(i=new Uint8Array(i)),r.set(new Uint8Array(i.buffer,i.byteOffset,i.byteLength),a)}function nu(i,e){let t=i.byteLength;var n,s;if(t<256){var{target:n,position:s}=e(t+2);n[s++]=196,n[s++]=t}else if(t<65536){var{target:n,position:s}=e(t+3);n[s++]=197,n[s++]=t>>8,n[s++]=t&255}else{var{target:n,position:s,targetView:r}=e(t+5);n[s++]=198,r.setUint32(s,t),s+=4}n.set(i,s)}function Gm(i,e,t,n){let s=i.length;switch(s){case 1:e[t++]=212;break;case 2:e[t++]=213;break;case 4:e[t++]=214;break;case 8:e[t++]=215;break;case 16:e[t++]=216;break;default:s<256?(e[t++]=199,e[t++]=s):s<65536?(e[t++]=200,e[t++]=s>>8,e[t++]=s&255):(e[t++]=201,e[t++]=s>>24,e[t++]=s>>16&255,e[t++]=s>>8&255,e[t++]=s&255)}return e[t++]=n,e.set(i,t),t+=s,t}function Wm(i,e){let t,n=e.length*6,s=i.length-n;for(;t=e.pop();){let r=t.offset,a=t.id;i.copyWithin(r+n,r,s),n-=6;let o=r+n;i[o++]=214,i[o++]=105,i[o++]=a>>24,i[o++]=a>>16&255,i[o++]=a>>8&255,i[o++]=a&255,s=r}return i}function iu(i,e,t){if(Wt.length>0){Nt.setUint32(Wt.position+i,Y+t-Wt.position-i),Wt.stringsPosition=Y-i;let n=Wt;Wt=null,e(n[0]),e(n[1])}}function $m(i){if(i.Class){if(!i.pack&&!i.write)throw new Error("Extension has no pack or write function");if(i.pack&&!i.type)throw new Error("Extension has no type (numeric code to identify the extension)");Xl.unshift(i.Class),fo.unshift(i)}Om(i)}function Xm(i,e){return i.isCompatible=t=>{let n=!t||(e.lastNamedStructuresLength||0)===t.length;return n||e._mergeStructures(t),n},i}let Rf=new aa({useRecords:!1});const qm=Rf.pack,jm=Rf.pack,Ym=aa,{NEVER:Km,ALWAYS:Jm,DECIMAL_ROUND:Zm,DECIMAL_FIT:Qm}=Ef,Cf=512,Pf=1024,If=2048;function eg(i,e={}){if(!i||typeof i!="object")throw new Error("first argument must be an Iterable, Async Iterable, or a Promise for an Async Iterable");if(typeof i[Symbol.iterator]=="function")return tg(i,e);if(typeof i.then=="function"||typeof i[Symbol.asyncIterator]=="function")return ng(i,e);throw new Error("first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a Promise")}function*tg(i,e){const t=new aa(e);for(const n of i)yield t.pack(n)}async function*ng(i,e){const t=new aa(e);for await(const n of i)yield t.pack(n)}function ig(i,e={}){if(!i||typeof i!="object")throw new Error("first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a promise");const t=new $i(e);let n;const s=r=>{let a;n&&(r=Buffer.concat([n,r]),n=void 0);try{a=t.unpackMultiple(r)}catch(o){if(o.incomplete)n=r.slice(o.lastPosition),a=o.values;else throw o}return a};if(typeof i[Symbol.iterator]=="function")return(function*(){for(const a of i)yield*s(a)})();if(typeof i[Symbol.asyncIterator]=="function")return(async function*(){for await(const a of i)yield*s(a)})()}const sg=ig,rg=eg,ag=!1,og=!0,cg=Object.freeze(Object.defineProperty({__proto__:null,ALWAYS:Jm,C1:Gl,DECIMAL_FIT:Qm,DECIMAL_ROUND:Zm,Decoder:Um,Encoder:Ym,FLOAT32_OPTIONS:Ef,NEVER:Km,Packr:aa,RESERVE_START_SPACE:If,RESET_BUFFER_MODE:Pf,REUSE_BUFFER_MODE:Cf,Unpackr:$i,addExtension:$m,clearSource:uo,decode:Fm,decodeIter:sg,encode:jm,encodeIter:rg,isNativeAccelerationEnabled:Pm,mapsAsObjects:og,pack:qm,roundFloat32:Bm,unpack:Nm,unpackMultiple:km,useRecords:ag},Symbol.toStringTag,{value:"Module"})),lg=zl(cg);var su;function Lf(){if(su)return Fo;su=1;var i=Mm(),e=ff(),t=pf(),n=mf(),s=wm(),r=Vl(),a=gf(),o=Mo(),c=lg;let h=class Df{constructor(u,m){this.onStateChange=s.createSignal(),this.onError=s.createSignal(),this.onLeave=s.createSignal(),this.onJoin=s.createSignal(),this.hasJoined=!1,this.onMessageHandlers=n.createNanoEvents(),this.roomId=null,this.name=u,this.packr=new c.Packr,this.packr.encode(void 0),m&&(this.serializer=new(t.getSerializer("schema")),this.rootSchema=m,this.serializer.state=new m),this.onError((p,y)=>{var x;return(x=console.warn)===null||x===void 0?void 0:x.call(console,`colyseus.js - onError => (${p}) ${y}`)}),this.onLeave(()=>this.removeAllListeners())}connect(u,m,p=this,y,x){const _=new i.Connection(y.protocol);if(p.connection=_,_.events.onmessage=Df.prototype.onMessageCallback.bind(p),_.events.onclose=function(g){var T;if(!p.hasJoined){(T=console.warn)===null||T===void 0||T.call(console,`Room connection was closed unexpectedly (${g.code}): ${g.reason}`),p.onError.invoke(g.code,g.reason);return}g.code===o.CloseCode.DEVMODE_RESTART&&m?m():(p.onLeave.invoke(g.code,g.reason),p.destroy())},_.events.onerror=function(g){var T;(T=console.warn)===null||T===void 0||T.call(console,`Room, onError (${g.code}): ${g.reason}`),p.onError.invoke(g.code,g.reason)},y.protocol==="h3"){const g=new URL(u);_.connect(g.origin,y)}else _.connect(u,x)}leave(u=!0){return new Promise(m=>{this.onLeave(p=>m(p)),this.connection?u?(this.packr.buffer[0]=e.Protocol.LEAVE_ROOM,this.connection.send(this.packr.buffer.subarray(0,1))):this.connection.close():this.onLeave.invoke(o.CloseCode.CONSENTED)})}onMessage(u,m){return this.onMessageHandlers.on(this.getMessageHandlerKey(u),m)}send(u,m){const p={offset:1};this.packr.buffer[0]=e.Protocol.ROOM_DATA,typeof u=="string"?r.encode.string(this.packr.buffer,u,p):r.encode.number(this.packr.buffer,u,p),this.packr.position=0;const y=m!==void 0?this.packr.pack(m,2048+p.offset):this.packr.buffer.subarray(0,p.offset);this.connection.send(y)}sendUnreliable(u,m){const p={offset:1};this.packr.buffer[0]=e.Protocol.ROOM_DATA,typeof u=="string"?r.encode.string(this.packr.buffer,u,p):r.encode.number(this.packr.buffer,u,p),this.packr.position=0;const y=m!==void 0?this.packr.pack(m,2048+p.offset):this.packr.buffer.subarray(0,p.offset);this.connection.sendUnreliable(y)}sendBytes(u,m){const p={offset:1};if(this.packr.buffer[0]=e.Protocol.ROOM_DATA_BYTES,typeof u=="string"?r.encode.string(this.packr.buffer,u,p):r.encode.number(this.packr.buffer,u,p),m.byteLength+p.offset>this.packr.buffer.byteLength){const y=new Uint8Array(p.offset+m.byteLength);y.set(this.packr.buffer),this.packr.useBuffer(y)}this.packr.buffer.set(m,p.offset),this.connection.send(this.packr.buffer.subarray(0,p.offset+m.byteLength))}get state(){return this.serializer.getState()}removeAllListeners(){this.onJoin.clear(),this.onStateChange.clear(),this.onError.clear(),this.onLeave.clear(),this.onMessageHandlers.events={},this.serializer instanceof a.SchemaSerializer&&(this.serializer.decoder.root.callbacks={})}onMessageCallback(u){const m=new Uint8Array(u.data),p={offset:1},y=m[0];if(y===e.Protocol.JOIN_ROOM){const x=r.decode.utf8Read(m,p,m[p.offset++]);if(this.serializerId=r.decode.utf8Read(m,p,m[p.offset++]),!this.serializer){const _=t.getSerializer(this.serializerId);this.serializer=new _}m.byteLength>p.offset&&this.serializer.handshake&&this.serializer.handshake(m,p),this.reconnectionToken=`${this.roomId}:${x}`,this.hasJoined=!0,this.onJoin.invoke(),this.packr.buffer[0]=e.Protocol.JOIN_ROOM,this.connection.send(this.packr.buffer.subarray(0,1))}else if(y===e.Protocol.ERROR){const x=r.decode.number(m,p),_=r.decode.string(m,p);this.onError.invoke(x,_)}else if(y===e.Protocol.LEAVE_ROOM)this.leave();else if(y===e.Protocol.ROOM_STATE)this.serializer.setState(m,p),this.onStateChange.invoke(this.serializer.getState());else if(y===e.Protocol.ROOM_STATE_PATCH)this.serializer.patch(m,p),this.onStateChange.invoke(this.serializer.getState());else if(y===e.Protocol.ROOM_DATA){const x=r.decode.stringCheck(m,p)?r.decode.string(m,p):r.decode.number(m,p),_=m.byteLength>p.offset?c.unpack(m,{start:p.offset}):void 0;this.dispatchMessage(x,_)}else if(y===e.Protocol.ROOM_DATA_BYTES){const x=r.decode.stringCheck(m,p)?r.decode.string(m,p):r.decode.number(m,p);this.dispatchMessage(x,m.subarray(p.offset))}}dispatchMessage(u,m){var p;const y=this.getMessageHandlerKey(u);this.onMessageHandlers.events[y]?this.onMessageHandlers.emit(y,m):this.onMessageHandlers.events["*"]?this.onMessageHandlers.emit("*",u,m):(p=console.warn)===null||p===void 0||p.call(console,`colyseus.js: onMessage() not registered for type '${u}'.`)}destroy(){this.serializer&&this.serializer.teardown()}getMessageHandlerKey(u){switch(typeof u){case"string":return u;case"number":return`i${u}`;default:throw new Error("invalid message type.")}}};return Fo.Room=h,Fo}var Xo={};function ru(i,e){e.headers=i.headers||{},e.statusMessage=i.statusText,e.statusCode=i.status,e.data=i.response}function Yn(i,e,t){return new Promise(function(n,s){t=t||{};var r=new XMLHttpRequest,a,o,c,h=t.body,d=t.headers||{};t.timeout&&(r.timeout=t.timeout),r.ontimeout=r.onerror=function(u){u.timeout=u.type=="timeout",s(u)},r.onabort=function(u){u.aborted=!0,s(u)},r.open(i,e.href||e),r.onload=function(){for(c=r.getAllResponseHeaders().trim().split(/[\r\n]+/),ru(r,r);o=c.shift();)o=o.split(": "),r.headers[o.shift().toLowerCase()]=o.join(": ");if(o=r.headers["content-type"],o&&~o.indexOf("application/json"))try{r.data=JSON.parse(r.data,t.reviver)}catch(u){return ru(r,u),s(u)}(r.status>=400?s:n)(r)},typeof FormData<"u"&&h instanceof FormData||h&&typeof h=="object"&&(d["content-type"]="application/json",h=JSON.stringify(h)),r.withCredentials=!!t.withCredentials;for(a in d)r.setRequestHeader(a,d[a]);r.send(h),t.signal&&t.signal.addEventListener("abort",function(){r.abort()})})}var hg=Yn.bind(Yn,"GET"),ug=Yn.bind(Yn,"POST"),dg=Yn.bind(Yn,"PATCH"),fg=Yn.bind(Yn,"DELETE"),pg=Yn.bind(Yn,"PUT");const mg=Object.freeze(Object.defineProperty({__proto__:null,del:fg,get:hg,patch:dg,post:ug,put:pg,send:Yn},Symbol.toStringTag,{value:"Module"})),gg=zl(mg);var au;function vg(){if(au)return Xo;au=1;var i=Mo(),e=gg;function t(r){var a=Object.create(null);return r&&Object.keys(r).forEach(function(o){if(o!=="default"){var c=Object.getOwnPropertyDescriptor(r,o);Object.defineProperty(a,o,c.get?c:{enumerable:!0,get:function(){return r[o]}})}}),a.default=r,Object.freeze(a)}var n=t(e);let s=class{constructor(a,o={}){this.client=a,this.headers=o}get(a,o={}){return this.request("get",a,o)}post(a,o={}){return this.request("post",a,o)}del(a,o={}){return this.request("del",a,o)}put(a,o={}){return this.request("put",a,o)}request(a,o,c={}){return n[a](this.client.getHttpEndpoint(o),this.getOptions(c)).catch(h=>{var d;if(h.aborted)throw new i.AbortError("Request aborted");const u=h.statusCode,m=((d=h.data)===null||d===void 0?void 0:d.error)||h.statusMessage||h.message;throw!u&&!m?h:new i.ServerError(u,m)})}getOptions(a){return a.headers=Object.assign({},this.headers,a.headers),this.authToken&&(a.headers.Authorization=`Bearer ${this.authToken}`),typeof cc<"u"&&cc.sys&&cc.sys.isNative||(a.withCredentials=!0),a}};return Xo.HTTP=s,Xo}var qo={},Mr={},ou;function _g(){if(ou)return Mr;ou=1;var i=So;let e;function t(){if(!e)try{e=typeof cc<"u"&&cc.sys&&cc.sys.localStorage?cc.sys.localStorage:window.localStorage}catch{}return!e&&typeof globalThis.indexedDB<"u"&&(e=new a),e||(e={cache:{},setItem:function(o,c){this.cache[o]=c},getItem:function(o){this.cache[o]},removeItem:function(o){delete this.cache[o]}}),e}function n(o,c){t().setItem(o,c)}function s(o){t().removeItem(o)}function r(o,c){const h=t().getItem(o);typeof Promise>"u"||!(h instanceof Promise)?c(h):h.then(d=>c(d))}class a{constructor(){this.dbPromise=new Promise(c=>{const h=indexedDB.open("_colyseus_storage",1);h.onupgradeneeded=()=>h.result.createObjectStore("store"),h.onsuccess=()=>c(h.result)})}tx(c,h){return i.__awaiter(this,void 0,void 0,function*(){const u=(yield this.dbPromise).transaction("store",c).objectStore("store");return h(u)})}setItem(c,h){return this.tx("readwrite",d=>d.put(h,c)).then()}getItem(c){return i.__awaiter(this,void 0,void 0,function*(){const h=yield this.tx("readonly",d=>d.get(c));return new Promise(d=>{h.onsuccess=()=>d(h.result)})})}removeItem(c){return this.tx("readwrite",h=>h.delete(c)).then()}}return Mr.getItem=r,Mr.removeItem=s,Mr.setItem=n,Mr}var cu;function Of(){if(cu)return qo;cu=1;var i=So,e=_g(),t=mf(),n,s,r,a;let o=class{constructor(h){this.http=h,this.settings={path:"/auth",key:"colyseus-auth-token"},n.set(this,!1),s.set(this,void 0),r.set(this,void 0),a.set(this,t.createNanoEvents()),e.getItem(this.settings.key,d=>this.token=d)}set token(h){this.http.authToken=h}get token(){return this.http.authToken}onChange(h){const d=i.__classPrivateFieldGet(this,a,"f").on("change",h);return i.__classPrivateFieldGet(this,n,"f")||i.__classPrivateFieldSet(this,s,new Promise((u,m)=>{this.getUserData().then(p=>{this.emitChange(Object.assign(Object.assign({},p),{token:this.token}))}).catch(p=>{this.emitChange({user:null,token:void 0})}).finally(()=>{u()})}),"f"),i.__classPrivateFieldSet(this,n,!0,"f"),d}getUserData(){return i.__awaiter(this,void 0,void 0,function*(){if(this.token)return(yield this.http.get(`${this.settings.path}/userdata`)).data;throw new Error("missing auth.token")})}registerWithEmailAndPassword(h,d,u){return i.__awaiter(this,void 0,void 0,function*(){const m=(yield this.http.post(`${this.settings.path}/register`,{body:{email:h,password:d,options:u}})).data;return this.emitChange(m),m})}signInWithEmailAndPassword(h,d){return i.__awaiter(this,void 0,void 0,function*(){const u=(yield this.http.post(`${this.settings.path}/login`,{body:{email:h,password:d}})).data;return this.emitChange(u),u})}signInAnonymously(h){return i.__awaiter(this,void 0,void 0,function*(){const d=(yield this.http.post(`${this.settings.path}/anonymous`,{body:{options:h}})).data;return this.emitChange(d),d})}sendPasswordResetEmail(h){return i.__awaiter(this,void 0,void 0,function*(){return(yield this.http.post(`${this.settings.path}/forgot-password`,{body:{email:h}})).data})}signInWithProvider(h){return i.__awaiter(this,arguments,void 0,function*(d,u={}){return new Promise((m,p)=>{const y=u.width||480,x=u.height||768,_=this.token?`?token=${this.token}`:"",g=`Login with ${d[0].toUpperCase()+d.substring(1)}`,T=this.http.client.getHttpEndpoint(`${u.prefix||`${this.settings.path}/provider`}/${d}${_}`),C=screen.width/2-y/2,S=screen.height/2-x/2;i.__classPrivateFieldSet(this,r,window.open(T,g,"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width="+y+", height="+x+", top="+S+", left="+C),"f");const U=N=>{N.data.user===void 0&&N.data.token===void 0||(clearInterval(O),i.__classPrivateFieldGet(this,r,"f").close(),i.__classPrivateFieldSet(this,r,void 0,"f"),window.removeEventListener("message",U),N.data.error!==void 0?p(N.data.error):(m(N.data),this.emitChange(N.data)))},O=setInterval(()=>{(!i.__classPrivateFieldGet(this,r,"f")||i.__classPrivateFieldGet(this,r,"f").closed)&&(i.__classPrivateFieldSet(this,r,void 0,"f"),p("cancelled"),window.removeEventListener("message",U))},200);window.addEventListener("message",U)})})}signOut(){return i.__awaiter(this,void 0,void 0,function*(){this.emitChange({user:null,token:null})})}emitChange(h){h.token!==void 0&&(this.token=h.token,h.token===null?e.removeItem(this.settings.key):e.setItem(this.settings.key,h.token)),i.__classPrivateFieldGet(this,a,"f").emit("change",h)}};return n=new WeakMap,s=new WeakMap,r=new WeakMap,a=new WeakMap,qo.Auth=o,qo}var jo={},lu;function yg(){if(lu)return jo;lu=1;function i(e){var t;const n=((t=window==null?void 0:window.location)===null||t===void 0?void 0:t.hostname)||"localhost",s=e.hostname.split("."),r=!e.hostname.includes("trycloudflare.com")&&!e.hostname.includes("discordsays.com")&&s.length>2?`/${s[0]}`:"";return e.pathname.startsWith("/.proxy")?`${e.protocol}//${n}${r}${e.pathname}${e.search}`:`${e.protocol}//${n}/.proxy/colyseus${r}${e.pathname}${e.search}`}return jo.discordURLBuilder=i,jo}var hu;function xg(){if(hu)return va;hu=1;var i=So,e=Mo(),t=Lf(),n=vg(),s=Of(),r=yg(),a;class o extends Error{constructor(u,m){super(u),this.code=m,this.name="MatchMakeError",Object.setPrototypeOf(this,o.prototype)}}const c=typeof window<"u"&&typeof((a=window==null?void 0:window.location)===null||a===void 0?void 0:a.hostname)<"u"?`${window.location.protocol.replace("http","ws")}//${window.location.hostname}${window.location.port&&`:${window.location.port}`}`:"ws://127.0.0.1:2567";let h=class{constructor(u=c,m){var p,y;if(typeof u=="string"){const x=u.startsWith("/")?new URL(u,c):new URL(u),_=x.protocol==="https:"||x.protocol==="wss:",g=Number(x.port||(_?443:80));this.settings={hostname:x.hostname,pathname:x.pathname,port:g,secure:_,searchParams:x.searchParams.toString()||void 0}}else u.port===void 0&&(u.port=u.secure?443:80),u.pathname===void 0&&(u.pathname=""),this.settings=u;this.settings.pathname.endsWith("/")&&(this.settings.pathname=this.settings.pathname.slice(0,-1)),this.http=new n.HTTP(this,(m==null?void 0:m.headers)||{}),this.auth=new s.Auth(this.http),this.urlBuilder=m==null?void 0:m.urlBuilder,!this.urlBuilder&&typeof window<"u"&&(!((y=(p=window==null?void 0:window.location)===null||p===void 0?void 0:p.hostname)===null||y===void 0)&&y.includes("discordsays.com"))&&(this.urlBuilder=r.discordURLBuilder,console.log("Colyseus SDK: Discord Embedded SDK detected. Using custom URL builder."))}joinOrCreate(u){return i.__awaiter(this,arguments,void 0,function*(m,p={},y){return yield this.createMatchMakeRequest("joinOrCreate",m,p,y)})}create(u){return i.__awaiter(this,arguments,void 0,function*(m,p={},y){return yield this.createMatchMakeRequest("create",m,p,y)})}join(u){return i.__awaiter(this,arguments,void 0,function*(m,p={},y){return yield this.createMatchMakeRequest("join",m,p,y)})}joinById(u){return i.__awaiter(this,arguments,void 0,function*(m,p={},y){return yield this.createMatchMakeRequest("joinById",m,p,y)})}reconnect(u,m){return i.__awaiter(this,void 0,void 0,function*(){if(typeof u=="string"&&typeof m=="string")throw new Error("DEPRECATED: .reconnect() now only accepts 'reconnectionToken' as argument.\nYou can get this token from previously connected `room.reconnectionToken`");const[p,y]=u.split(":");if(!p||!y)throw new Error(`Invalid reconnection token format.
The format should be roomId:reconnectionToken`);return yield this.createMatchMakeRequest("reconnect",p,{reconnectionToken:y},m)})}consumeSeatReservation(u,m,p){return i.__awaiter(this,void 0,void 0,function*(){const y=this.createRoom(u.room.name,m);y.roomId=u.room.roomId,y.sessionId=u.sessionId;const x={sessionId:y.sessionId};u.reconnectionToken&&(x.reconnectionToken=u.reconnectionToken);const _=p||y;return y.connect(this.buildEndpoint(u.room,x,u.protocol),u.devMode&&(()=>i.__awaiter(this,void 0,void 0,function*(){console.info(`[Colyseus devMode]: ${String.fromCodePoint(128260)} Re-establishing connection with room id '${y.roomId}'...`);let g=0,T=8;const C=()=>i.__awaiter(this,void 0,void 0,function*(){g++;try{yield this.consumeSeatReservation(u,m,_),console.info(`[Colyseus devMode]: ${String.fromCodePoint(9989)} Successfully re-established connection with room '${y.roomId}'`)}catch{g<T?(console.info(`[Colyseus devMode]: ${String.fromCodePoint(128260)} retrying... (${g} out of ${T})`),setTimeout(C,2e3)):console.info(`[Colyseus devMode]: ${String.fromCodePoint(10060)} Failed to reconnect. Is your server running? Please check server logs.`)}});setTimeout(C,2e3)})),_,u,this.http.headers),new Promise((g,T)=>{const C=(S,U)=>T(new e.ServerError(S,U));_.onError.once(C),_.onJoin.once(()=>{_.onError.remove(C),g(_)})})})}createMatchMakeRequest(u,m){return i.__awaiter(this,arguments,void 0,function*(p,y,x={},_,g){const T=(yield this.http.post(`matchmake/${p}/${y}`,{headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(x)})).data;if(T.error)throw new o(T.error,T.code);return p==="reconnect"&&(T.reconnectionToken=x.reconnectionToken),yield this.consumeSeatReservation(T,_,g)})}createRoom(u,m){return new t.Room(u,m)}buildEndpoint(u,m={},p="ws"){let y=this.settings.searchParams||"";this.http.authToken&&(m._authToken=this.http.authToken);for(const g in m)m.hasOwnProperty(g)&&(y+=(y?"&":"")+`${g}=${m[g]}`);p==="h3"&&(p="http");let x=this.settings.secure?`${p}s://`:`${p}://`;u.publicAddress?x+=`${u.publicAddress}`:x+=`${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}`;const _=`${x}/${u.processId}/${u.roomId}?${y}`;return this.urlBuilder?this.urlBuilder(new URL(_)):_}getHttpEndpoint(u=""){const m=u.startsWith("/")?u:`/${u}`;let p=`${this.settings.secure?"https":"http"}://${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}${m}`;return this.settings.searchParams&&(p+=`?${this.settings.searchParams}`),this.urlBuilder?this.urlBuilder(new URL(p)):p}getEndpointPort(){return this.settings.port!==80&&this.settings.port!==443?`:${this.settings.port}`:""}};return h.VERSION="0.16.22",va.Client=h,va.MatchMakeError=o,va}var Yo={},uu;function bg(){if(uu)return Yo;uu=1;let i=class{setState(t){}getState(){return null}patch(t){}teardown(){}handshake(t){}};return Yo.NoneSerializer=i,Yo}var du;function Sg(){return du||(du=1,(function(i){pm();var e=xg(),t=ff(),n=Lf(),s=Of(),r=Mo(),a=gf(),o=bg(),c=pf();c.registerSerializer("schema",a.SchemaSerializer),c.registerSerializer("none",o.NoneSerializer),i.Client=e.Client,i.MatchMakeError=e.MatchMakeError,Object.defineProperty(i,"ErrorCode",{enumerable:!0,get:function(){return t.ErrorCode}}),Object.defineProperty(i,"Protocol",{enumerable:!0,get:function(){return t.Protocol}}),i.Room=n.Room,i.Auth=s.Auth,i.ServerError=r.ServerError,i.SchemaSerializer=a.SchemaSerializer,i.getStateCallbacks=a.getStateCallbacks,i.registerSerializer=c.registerSerializer})(No)),No}Sg();const Mg=!0,wg=Mg,fu=null;/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ql="180",Eg=0,pu=1,Tg=2,Uf=1,Nf=2,_i=3,Xi=0,Mn=1,Pn=2,Mi=0,tr=1,rr=2,mu=3,gu=4,Ag=5,us=100,Rg=101,Cg=102,Pg=103,Ig=104,Dg=200,Lg=201,Og=202,Ug=203,Vc=204,Gc=205,Ng=206,kg=207,Fg=208,Bg=209,zg=210,Hg=211,Vg=212,Gg=213,Wg=214,Wc=0,$c=1,Xc=2,ar=3,qc=4,jc=5,Yc=6,Kc=7,kf=0,$g=1,Xg=2,Wi=0,Ff=1,Bf=2,zf=3,jl=4,Hf=5,Vf=6,Gf=7,Wf=300,or=301,cr=302,Jc=303,Zc=304,Ao=306,Qc=1e3,ps=1001,el=1002,Xn=1003,qg=1004,Ma=1005,ii=1006,Ko=1007,ms=1008,ai=1009,$f=1010,Xf=1011,Yr=1012,Yl=1013,ys=1014,bi=1015,wi=1016,Kl=1017,Jl=1018,Kr=1020,qf=35902,jf=35899,Yf=1021,Kf=1022,$n=1023,Jr=1026,Zr=1027,Jf=1028,Zl=1029,Zf=1030,Ql=1031,eh=1033,Qa=33776,eo=33777,to=33778,no=33779,tl=35840,nl=35841,il=35842,sl=35843,rl=36196,al=37492,ol=37496,cl=37808,ll=37809,hl=37810,ul=37811,dl=37812,fl=37813,pl=37814,ml=37815,gl=37816,vl=37817,_l=37818,yl=37819,xl=37820,bl=37821,Sl=36492,Ml=36494,wl=36495,El=36283,Tl=36284,Al=36285,Rl=36286,jg=3200,Yg=3201,Qf=0,Kg=1,ki="",on="srgb",lr="srgb-linear",po="linear",Pt="srgb",Cs=7680,vu=519,Jg=512,Zg=513,Qg=514,ep=515,e0=516,t0=517,n0=518,i0=519,Cl=35044,_u="300 es",si=2e3,mo=2001;class dr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let yu=1234567;const zr=Math.PI/180,Qr=180/Math.PI;function Ei(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(hn[i&255]+hn[i>>8&255]+hn[i>>16&255]+hn[i>>24&255]+"-"+hn[e&255]+hn[e>>8&255]+"-"+hn[e>>16&15|64]+hn[e>>24&255]+"-"+hn[t&63|128]+hn[t>>8&255]+"-"+hn[t>>16&255]+hn[t>>24&255]+hn[n&255]+hn[n>>8&255]+hn[n>>16&255]+hn[n>>24&255]).toLowerCase()}function ft(i,e,t){return Math.max(e,Math.min(t,i))}function th(i,e){return(i%e+e)%e}function s0(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function r0(i,e,t){return i!==e?(t-i)/(e-i):0}function Hr(i,e,t){return(1-t)*i+t*e}function a0(i,e,t,n){return Hr(i,e,1-Math.exp(-t*n))}function o0(i,e=1){return e-Math.abs(th(i,e*2)-e)}function c0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function l0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function h0(i,e){return i+Math.floor(Math.random()*(e-i+1))}function u0(i,e){return i+Math.random()*(e-i)}function d0(i){return i*(.5-Math.random())}function f0(i){i!==void 0&&(yu=i);let e=yu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function p0(i){return i*zr}function m0(i){return i*Qr}function g0(i){return(i&i-1)===0&&i!==0}function v0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function _0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function y0(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),h=r((e+n)/2),d=a((e+n)/2),u=r((e-n)/2),m=a((e-n)/2),p=r((n-e)/2),y=a((n-e)/2);switch(s){case"XYX":i.set(o*d,c*u,c*m,o*h);break;case"YZY":i.set(c*m,o*d,c*u,o*h);break;case"ZXZ":i.set(c*u,c*m,o*d,o*h);break;case"XZX":i.set(o*d,c*y,c*p,o*h);break;case"YXY":i.set(c*p,o*d,c*y,o*h);break;case"ZYZ":i.set(c*y,c*p,o*d,o*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Wn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function It(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const x0={DEG2RAD:zr,RAD2DEG:Qr,generateUUID:Ei,clamp:ft,euclideanModulo:th,mapLinear:s0,inverseLerp:r0,lerp:Hr,damp:a0,pingpong:o0,smoothstep:c0,smootherstep:l0,randInt:h0,randFloat:u0,randFloatSpread:d0,seededRandom:f0,degToRad:p0,radToDeg:m0,isPowerOfTwo:g0,ceilPowerOfTwo:v0,floorPowerOfTwo:_0,setQuaternionFromProperEuler:y0,normalize:It,denormalize:Wn};class Te{constructor(e=0,t=0){Te.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class oa{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],h=n[s+1],d=n[s+2],u=n[s+3];const m=r[a+0],p=r[a+1],y=r[a+2],x=r[a+3];if(o===0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u;return}if(o===1){e[t+0]=m,e[t+1]=p,e[t+2]=y,e[t+3]=x;return}if(u!==x||c!==m||h!==p||d!==y){let _=1-o;const g=c*m+h*p+d*y+u*x,T=g>=0?1:-1,C=1-g*g;if(C>Number.EPSILON){const U=Math.sqrt(C),O=Math.atan2(U,g*T);_=Math.sin(_*O)/U,o=Math.sin(o*O)/U}const S=o*T;if(c=c*_+m*S,h=h*_+p*S,d=d*_+y*S,u=u*_+x*S,_===1-o){const U=1/Math.sqrt(c*c+h*h+d*d+u*u);c*=U,h*=U,d*=U,u*=U}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a],m=r[a+1],p=r[a+2],y=r[a+3];return e[t]=o*y+d*u+c*p-h*m,e[t+1]=c*y+d*m+h*u-o*p,e[t+2]=h*y+d*p+o*m-c*u,e[t+3]=d*y-o*u-c*m-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,h=o(n/2),d=o(s/2),u=o(r/2),m=c(n/2),p=c(s/2),y=c(r/2);switch(a){case"XYZ":this._x=m*d*u+h*p*y,this._y=h*p*u-m*d*y,this._z=h*d*y+m*p*u,this._w=h*d*u-m*p*y;break;case"YXZ":this._x=m*d*u+h*p*y,this._y=h*p*u-m*d*y,this._z=h*d*y-m*p*u,this._w=h*d*u+m*p*y;break;case"ZXY":this._x=m*d*u-h*p*y,this._y=h*p*u+m*d*y,this._z=h*d*y+m*p*u,this._w=h*d*u-m*p*y;break;case"ZYX":this._x=m*d*u-h*p*y,this._y=h*p*u+m*d*y,this._z=h*d*y-m*p*u,this._w=h*d*u+m*p*y;break;case"YZX":this._x=m*d*u+h*p*y,this._y=h*p*u+m*d*y,this._z=h*d*y-m*p*u,this._w=h*d*u-m*p*y;break;case"XZY":this._x=m*d*u-h*p*y,this._y=h*p*u-m*d*y,this._z=h*d*y+m*p*u,this._w=h*d*u+m*p*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],h=t[2],d=t[6],u=t[10],m=n+o+u;if(m>0){const p=.5/Math.sqrt(m+1);this._w=.25/p,this._x=(d-c)*p,this._y=(r-h)*p,this._z=(a-s)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(d-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+h)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-h)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+h)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,h=t._z,d=t._w;return this._x=n*d+a*o+s*h-r*c,this._y=s*d+a*c+r*o-n*h,this._z=r*d+a*h+n*c-s*o,this._w=a*d-n*o-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const h=Math.sqrt(c),d=Math.atan2(h,o),u=Math.sin((1-t)*d)/h,m=Math.sin(t*d)/h;return this._w=a*u+this._w*m,this._x=n*u+this._x*m,this._y=s*u+this._y*m,this._z=r*u+this._z*m,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class k{constructor(e=0,t=0,n=0){k.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(xu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(xu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,h=2*(a*s-o*n),d=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*h+a*u-o*d,this.y=n+c*d+o*h-r*u,this.z=s+c*u+r*d-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Jo.copy(this).projectOnVector(e),this.sub(Jo)}reflect(e){return this.sub(Jo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Jo=new k,xu=new oa;class ct{constructor(e,t,n,s,r,a,o,c,h){ct.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,h)}set(e,t,n,s,r,a,o,c,h){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],h=n[1],d=n[4],u=n[7],m=n[2],p=n[5],y=n[8],x=s[0],_=s[3],g=s[6],T=s[1],C=s[4],S=s[7],U=s[2],O=s[5],N=s[8];return r[0]=a*x+o*T+c*U,r[3]=a*_+o*C+c*O,r[6]=a*g+o*S+c*N,r[1]=h*x+d*T+u*U,r[4]=h*_+d*C+u*O,r[7]=h*g+d*S+u*N,r[2]=m*x+p*T+y*U,r[5]=m*_+p*C+y*O,r[8]=m*g+p*S+y*N,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],d=e[8];return t*a*d-t*o*h-n*r*d+n*o*c+s*r*h-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],d=e[8],u=d*a-o*h,m=o*c-d*r,p=h*r-a*c,y=t*u+n*m+s*p;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/y;return e[0]=u*x,e[1]=(s*h-d*n)*x,e[2]=(o*n-s*a)*x,e[3]=m*x,e[4]=(d*t-s*c)*x,e[5]=(s*r-o*t)*x,e[6]=p*x,e[7]=(n*c-h*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*a+h*o)+a+e,-s*h,s*c,-s*(-h*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Zo.makeScale(e,t)),this}rotate(e){return this.premultiply(Zo.makeRotation(-e)),this}translate(e,t){return this.premultiply(Zo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Zo=new ct;function tp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function go(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function b0(){const i=go("canvas");return i.style.display="block",i}const bu={};function ea(i){i in bu||(bu[i]=!0,console.warn(i))}function S0(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Su=new ct().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Mu=new ct().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function M0(){const i={enabled:!0,workingColorSpace:lr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Pt&&(s.r=Ti(s.r),s.g=Ti(s.g),s.b=Ti(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Pt&&(s.r=nr(s.r),s.g=nr(s.g),s.b=nr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ki?po:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ea("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ea("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[lr]:{primaries:e,whitePoint:n,transfer:po,toXYZ:Su,fromXYZ:Mu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:on},outputColorSpaceConfig:{drawingBufferColorSpace:on}},[on]:{primaries:e,whitePoint:n,transfer:Pt,toXYZ:Su,fromXYZ:Mu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:on}}}),i}const St=M0();function Ti(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function nr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ps;class w0{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ps===void 0&&(Ps=go("canvas")),Ps.width=e.width,Ps.height=e.height;const s=Ps.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ps}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=go("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ti(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ti(t[n]/255)*255):t[n]=Ti(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let E0=0;class nh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:E0++}),this.uuid=Ei(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Qo(s[a].image)):r.push(Qo(s[a]))}else r=Qo(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Qo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?w0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let T0=0;const ec=new k;class yn extends dr{constructor(e=yn.DEFAULT_IMAGE,t=yn.DEFAULT_MAPPING,n=ps,s=ps,r=ii,a=ms,o=$n,c=ai,h=yn.DEFAULT_ANISOTROPY,d=ki){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:T0++}),this.uuid=Ei(),this.name="",this.source=new nh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ct,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ec).x}get height(){return this.source.getSize(ec).y}get depth(){return this.source.getSize(ec).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Wf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qc:e.x=e.x-Math.floor(e.x);break;case ps:e.x=e.x<0?0:1;break;case el:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qc:e.y=e.y-Math.floor(e.y);break;case ps:e.y=e.y<0?0:1;break;case el:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}yn.DEFAULT_IMAGE=null;yn.DEFAULT_MAPPING=Wf;yn.DEFAULT_ANISOTROPY=1;class Lt{constructor(e=0,t=0,n=0,s=1){Lt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,h=c[0],d=c[4],u=c[8],m=c[1],p=c[5],y=c[9],x=c[2],_=c[6],g=c[10];if(Math.abs(d-m)<.01&&Math.abs(u-x)<.01&&Math.abs(y-_)<.01){if(Math.abs(d+m)<.1&&Math.abs(u+x)<.1&&Math.abs(y+_)<.1&&Math.abs(h+p+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const C=(h+1)/2,S=(p+1)/2,U=(g+1)/2,O=(d+m)/4,N=(u+x)/4,P=(y+_)/4;return C>S&&C>U?C<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(C),s=O/n,r=N/n):S>U?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=O/s,r=P/s):U<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(U),n=N/r,s=P/r),this.set(n,s,r,t),this}let T=Math.sqrt((_-y)*(_-y)+(u-x)*(u-x)+(m-d)*(m-d));return Math.abs(T)<.001&&(T=1),this.x=(_-y)/T,this.y=(u-x)/T,this.z=(m-d)/T,this.w=Math.acos((h+p+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this.w=ft(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this.w=ft(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class A0 extends dr{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ii,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Lt(0,0,e,t),this.scissorTest=!1,this.viewport=new Lt(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new yn(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:ii,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new nh(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class qn extends A0{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class np extends yn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=ps,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class R0 extends yn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=ps,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ca{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Hn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Hn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Hn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Hn):Hn.fromBufferAttribute(r,a),Hn.applyMatrix4(e.matrixWorld),this.expandByPoint(Hn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),wa.copy(n.boundingBox)),wa.applyMatrix4(e.matrixWorld),this.union(wa)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Hn),Hn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wr),Ea.subVectors(this.max,wr),Is.subVectors(e.a,wr),Ds.subVectors(e.b,wr),Ls.subVectors(e.c,wr),Ci.subVectors(Ds,Is),Pi.subVectors(Ls,Ds),es.subVectors(Is,Ls);let t=[0,-Ci.z,Ci.y,0,-Pi.z,Pi.y,0,-es.z,es.y,Ci.z,0,-Ci.x,Pi.z,0,-Pi.x,es.z,0,-es.x,-Ci.y,Ci.x,0,-Pi.y,Pi.x,0,-es.y,es.x,0];return!tc(t,Is,Ds,Ls,Ea)||(t=[1,0,0,0,1,0,0,0,1],!tc(t,Is,Ds,Ls,Ea))?!1:(Ta.crossVectors(Ci,Pi),t=[Ta.x,Ta.y,Ta.z],tc(t,Is,Ds,Ls,Ea))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Hn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Hn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(fi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const fi=[new k,new k,new k,new k,new k,new k,new k,new k],Hn=new k,wa=new ca,Is=new k,Ds=new k,Ls=new k,Ci=new k,Pi=new k,es=new k,wr=new k,Ea=new k,Ta=new k,ts=new k;function tc(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ts.fromArray(i,r);const o=s.x*Math.abs(ts.x)+s.y*Math.abs(ts.y)+s.z*Math.abs(ts.z),c=e.dot(ts),h=t.dot(ts),d=n.dot(ts);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>o)return!1}return!0}const C0=new ca,Er=new k,nc=new k;class Ro{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):C0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Er.subVectors(e,this.center);const t=Er.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Er,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(nc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Er.copy(e.center).add(nc)),this.expandByPoint(Er.copy(e.center).sub(nc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const pi=new k,ic=new k,Aa=new k,Ii=new k,sc=new k,Ra=new k,rc=new k;class ih{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,pi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=pi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(pi.copy(this.origin).addScaledVector(this.direction,t),pi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ic.copy(e).add(t).multiplyScalar(.5),Aa.copy(t).sub(e).normalize(),Ii.copy(this.origin).sub(ic);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Aa),o=Ii.dot(this.direction),c=-Ii.dot(Aa),h=Ii.lengthSq(),d=Math.abs(1-a*a);let u,m,p,y;if(d>0)if(u=a*c-o,m=a*o-c,y=r*d,u>=0)if(m>=-y)if(m<=y){const x=1/d;u*=x,m*=x,p=u*(u+a*m+2*o)+m*(a*u+m+2*c)+h}else m=r,u=Math.max(0,-(a*m+o)),p=-u*u+m*(m+2*c)+h;else m=-r,u=Math.max(0,-(a*m+o)),p=-u*u+m*(m+2*c)+h;else m<=-y?(u=Math.max(0,-(-a*r+o)),m=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+m*(m+2*c)+h):m<=y?(u=0,m=Math.min(Math.max(-r,-c),r),p=m*(m+2*c)+h):(u=Math.max(0,-(a*r+o)),m=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+m*(m+2*c)+h);else m=a>0?-r:r,u=Math.max(0,-(a*m+o)),p=-u*u+m*(m+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ic).addScaledVector(Aa,m),p}intersectSphere(e,t){pi.subVectors(e.center,this.origin);const n=pi.dot(this.direction),s=pi.dot(pi)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const h=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,m=this.origin;return h>=0?(n=(e.min.x-m.x)*h,s=(e.max.x-m.x)*h):(n=(e.max.x-m.x)*h,s=(e.min.x-m.x)*h),d>=0?(r=(e.min.y-m.y)*d,a=(e.max.y-m.y)*d):(r=(e.max.y-m.y)*d,a=(e.min.y-m.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-m.z)*u,c=(e.max.z-m.z)*u):(o=(e.max.z-m.z)*u,c=(e.min.z-m.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,pi)!==null}intersectTriangle(e,t,n,s,r){sc.subVectors(t,e),Ra.subVectors(n,e),rc.crossVectors(sc,Ra);let a=this.direction.dot(rc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ii.subVectors(this.origin,e);const c=o*this.direction.dot(Ra.crossVectors(Ii,Ra));if(c<0)return null;const h=o*this.direction.dot(sc.cross(Ii));if(h<0||c+h>a)return null;const d=-o*Ii.dot(rc);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class zt{constructor(e,t,n,s,r,a,o,c,h,d,u,m,p,y,x,_){zt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,h,d,u,m,p,y,x,_)}set(e,t,n,s,r,a,o,c,h,d,u,m,p,y,x,_){const g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=c,g[2]=h,g[6]=d,g[10]=u,g[14]=m,g[3]=p,g[7]=y,g[11]=x,g[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new zt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Os.setFromMatrixColumn(e,0).length(),r=1/Os.setFromMatrixColumn(e,1).length(),a=1/Os.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),h=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const m=a*d,p=a*u,y=o*d,x=o*u;t[0]=c*d,t[4]=-c*u,t[8]=h,t[1]=p+y*h,t[5]=m-x*h,t[9]=-o*c,t[2]=x-m*h,t[6]=y+p*h,t[10]=a*c}else if(e.order==="YXZ"){const m=c*d,p=c*u,y=h*d,x=h*u;t[0]=m+x*o,t[4]=y*o-p,t[8]=a*h,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=p*o-y,t[6]=x+m*o,t[10]=a*c}else if(e.order==="ZXY"){const m=c*d,p=c*u,y=h*d,x=h*u;t[0]=m-x*o,t[4]=-a*u,t[8]=y+p*o,t[1]=p+y*o,t[5]=a*d,t[9]=x-m*o,t[2]=-a*h,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const m=a*d,p=a*u,y=o*d,x=o*u;t[0]=c*d,t[4]=y*h-p,t[8]=m*h+x,t[1]=c*u,t[5]=x*h+m,t[9]=p*h-y,t[2]=-h,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const m=a*c,p=a*h,y=o*c,x=o*h;t[0]=c*d,t[4]=x-m*u,t[8]=y*u+p,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-h*d,t[6]=p*u+y,t[10]=m-x*u}else if(e.order==="XZY"){const m=a*c,p=a*h,y=o*c,x=o*h;t[0]=c*d,t[4]=-u,t[8]=h*d,t[1]=m*u+x,t[5]=a*d,t[9]=p*u-y,t[2]=y*u-p,t[6]=o*d,t[10]=x*u+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(P0,e,I0)}lookAt(e,t,n){const s=this.elements;return An.subVectors(e,t),An.lengthSq()===0&&(An.z=1),An.normalize(),Di.crossVectors(n,An),Di.lengthSq()===0&&(Math.abs(n.z)===1?An.x+=1e-4:An.z+=1e-4,An.normalize(),Di.crossVectors(n,An)),Di.normalize(),Ca.crossVectors(An,Di),s[0]=Di.x,s[4]=Ca.x,s[8]=An.x,s[1]=Di.y,s[5]=Ca.y,s[9]=An.y,s[2]=Di.z,s[6]=Ca.z,s[10]=An.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],h=n[12],d=n[1],u=n[5],m=n[9],p=n[13],y=n[2],x=n[6],_=n[10],g=n[14],T=n[3],C=n[7],S=n[11],U=n[15],O=s[0],N=s[4],P=s[8],E=s[12],A=s[1],B=s[5],Z=s[9],I=s[13],W=s[2],H=s[6],z=s[10],$=s[14],X=s[3],de=s[7],fe=s[11],Se=s[15];return r[0]=a*O+o*A+c*W+h*X,r[4]=a*N+o*B+c*H+h*de,r[8]=a*P+o*Z+c*z+h*fe,r[12]=a*E+o*I+c*$+h*Se,r[1]=d*O+u*A+m*W+p*X,r[5]=d*N+u*B+m*H+p*de,r[9]=d*P+u*Z+m*z+p*fe,r[13]=d*E+u*I+m*$+p*Se,r[2]=y*O+x*A+_*W+g*X,r[6]=y*N+x*B+_*H+g*de,r[10]=y*P+x*Z+_*z+g*fe,r[14]=y*E+x*I+_*$+g*Se,r[3]=T*O+C*A+S*W+U*X,r[7]=T*N+C*B+S*H+U*de,r[11]=T*P+C*Z+S*z+U*fe,r[15]=T*E+C*I+S*$+U*Se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],h=e[13],d=e[2],u=e[6],m=e[10],p=e[14],y=e[3],x=e[7],_=e[11],g=e[15];return y*(+r*c*u-s*h*u-r*o*m+n*h*m+s*o*p-n*c*p)+x*(+t*c*p-t*h*m+r*a*m-s*a*p+s*h*d-r*c*d)+_*(+t*h*u-t*o*p-r*a*u+n*a*p+r*o*d-n*h*d)+g*(-s*o*d-t*c*u+t*o*m+s*a*u-n*a*m+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],d=e[8],u=e[9],m=e[10],p=e[11],y=e[12],x=e[13],_=e[14],g=e[15],T=u*_*h-x*m*h+x*c*p-o*_*p-u*c*g+o*m*g,C=y*m*h-d*_*h-y*c*p+a*_*p+d*c*g-a*m*g,S=d*x*h-y*u*h+y*o*p-a*x*p-d*o*g+a*u*g,U=y*u*c-d*x*c-y*o*m+a*x*m+d*o*_-a*u*_,O=t*T+n*C+s*S+r*U;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/O;return e[0]=T*N,e[1]=(x*m*r-u*_*r-x*s*p+n*_*p+u*s*g-n*m*g)*N,e[2]=(o*_*r-x*c*r+x*s*h-n*_*h-o*s*g+n*c*g)*N,e[3]=(u*c*r-o*m*r-u*s*h+n*m*h+o*s*p-n*c*p)*N,e[4]=C*N,e[5]=(d*_*r-y*m*r+y*s*p-t*_*p-d*s*g+t*m*g)*N,e[6]=(y*c*r-a*_*r-y*s*h+t*_*h+a*s*g-t*c*g)*N,e[7]=(a*m*r-d*c*r+d*s*h-t*m*h-a*s*p+t*c*p)*N,e[8]=S*N,e[9]=(y*u*r-d*x*r-y*n*p+t*x*p+d*n*g-t*u*g)*N,e[10]=(a*x*r-y*o*r+y*n*h-t*x*h-a*n*g+t*o*g)*N,e[11]=(d*o*r-a*u*r-d*n*h+t*u*h+a*n*p-t*o*p)*N,e[12]=U*N,e[13]=(d*x*s-y*u*s+y*n*m-t*x*m-d*n*_+t*u*_)*N,e[14]=(y*o*s-a*x*s-y*n*c+t*x*c+a*n*_-t*o*_)*N,e[15]=(a*u*s-d*o*s+d*n*c-t*u*c-a*n*m+t*o*m)*N,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,h=r*a,d=r*o;return this.set(h*a+n,h*o-s*c,h*c+s*o,0,h*o+s*c,d*o+n,d*c-s*a,0,h*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,h=r+r,d=a+a,u=o+o,m=r*h,p=r*d,y=r*u,x=a*d,_=a*u,g=o*u,T=c*h,C=c*d,S=c*u,U=n.x,O=n.y,N=n.z;return s[0]=(1-(x+g))*U,s[1]=(p+S)*U,s[2]=(y-C)*U,s[3]=0,s[4]=(p-S)*O,s[5]=(1-(m+g))*O,s[6]=(_+T)*O,s[7]=0,s[8]=(y+C)*N,s[9]=(_-T)*N,s[10]=(1-(m+x))*N,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Os.set(s[0],s[1],s[2]).length();const a=Os.set(s[4],s[5],s[6]).length(),o=Os.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Vn.copy(this);const h=1/r,d=1/a,u=1/o;return Vn.elements[0]*=h,Vn.elements[1]*=h,Vn.elements[2]*=h,Vn.elements[4]*=d,Vn.elements[5]*=d,Vn.elements[6]*=d,Vn.elements[8]*=u,Vn.elements[9]*=u,Vn.elements[10]*=u,t.setFromRotationMatrix(Vn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=si,c=!1){const h=this.elements,d=2*r/(t-e),u=2*r/(n-s),m=(t+e)/(t-e),p=(n+s)/(n-s);let y,x;if(c)y=r/(a-r),x=a*r/(a-r);else if(o===si)y=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===mo)y=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=m,h[12]=0,h[1]=0,h[5]=u,h[9]=p,h[13]=0,h[2]=0,h[6]=0,h[10]=y,h[14]=x,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=si,c=!1){const h=this.elements,d=2/(t-e),u=2/(n-s),m=-(t+e)/(t-e),p=-(n+s)/(n-s);let y,x;if(c)y=1/(a-r),x=a/(a-r);else if(o===si)y=-2/(a-r),x=-(a+r)/(a-r);else if(o===mo)y=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=d,h[4]=0,h[8]=0,h[12]=m,h[1]=0,h[5]=u,h[9]=0,h[13]=p,h[2]=0,h[6]=0,h[10]=y,h[14]=x,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Os=new k,Vn=new zt,P0=new k(0,0,0),I0=new k(1,1,1),Di=new k,Ca=new k,An=new k,wu=new zt,Eu=new oa;class oi{constructor(e=0,t=0,n=0,s=oi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],d=s[9],u=s[2],m=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ft(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ft(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(m,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(ft(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return wu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(wu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Eu.setFromEuler(this),this.setFromQuaternion(Eu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}oi.DEFAULT_ORDER="XYZ";class sh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let D0=0;const Tu=new k,Us=new oa,mi=new zt,Pa=new k,Tr=new k,L0=new k,O0=new oa,Au=new k(1,0,0),Ru=new k(0,1,0),Cu=new k(0,0,1),Pu={type:"added"},U0={type:"removed"},Ns={type:"childadded",child:null},ac={type:"childremoved",child:null};class Jt extends dr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:D0++}),this.uuid=Ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Jt.DEFAULT_UP.clone();const e=new k,t=new oi,n=new oa,s=new k(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new zt},normalMatrix:{value:new ct}}),this.matrix=new zt,this.matrixWorld=new zt,this.matrixAutoUpdate=Jt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new sh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Us.setFromAxisAngle(e,t),this.quaternion.multiply(Us),this}rotateOnWorldAxis(e,t){return Us.setFromAxisAngle(e,t),this.quaternion.premultiply(Us),this}rotateX(e){return this.rotateOnAxis(Au,e)}rotateY(e){return this.rotateOnAxis(Ru,e)}rotateZ(e){return this.rotateOnAxis(Cu,e)}translateOnAxis(e,t){return Tu.copy(e).applyQuaternion(this.quaternion),this.position.add(Tu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Au,e)}translateY(e){return this.translateOnAxis(Ru,e)}translateZ(e){return this.translateOnAxis(Cu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(mi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Pa.copy(e):Pa.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Tr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mi.lookAt(Tr,Pa,this.up):mi.lookAt(Pa,Tr,this.up),this.quaternion.setFromRotationMatrix(mi),s&&(mi.extractRotation(s.matrixWorld),Us.setFromRotationMatrix(mi),this.quaternion.premultiply(Us.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Pu),Ns.child=e,this.dispatchEvent(Ns),Ns.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(U0),ac.child=e,this.dispatchEvent(ac),ac.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),mi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),mi.multiply(e.parent.matrixWorld)),e.applyMatrix4(mi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Pu),Ns.child=e,this.dispatchEvent(Ns),Ns.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Tr,e,L0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Tr,O0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const u=c[h];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),h=a(e.textures),d=a(e.images),u=a(e.shapes),m=a(e.skeletons),p=a(e.animations),y=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),m.length>0&&(n.skeletons=m),p.length>0&&(n.animations=p),y.length>0&&(n.nodes=y)}return n.object=s,n;function a(o){const c=[];for(const h in o){const d=o[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Jt.DEFAULT_UP=new k(0,1,0);Jt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Gn=new k,gi=new k,oc=new k,vi=new k,ks=new k,Fs=new k,Iu=new k,lc=new k,hc=new k,uc=new k,dc=new Lt,fc=new Lt,pc=new Lt;class Nn{constructor(e=new k,t=new k,n=new k){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Gn.subVectors(e,t),s.cross(Gn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Gn.subVectors(s,t),gi.subVectors(n,t),oc.subVectors(e,t);const a=Gn.dot(Gn),o=Gn.dot(gi),c=Gn.dot(oc),h=gi.dot(gi),d=gi.dot(oc),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;const m=1/u,p=(h*c-o*d)*m,y=(a*d-o*c)*m;return r.set(1-p-y,y,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,vi)===null?!1:vi.x>=0&&vi.y>=0&&vi.x+vi.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,vi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,vi.x),c.addScaledVector(a,vi.y),c.addScaledVector(o,vi.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return dc.setScalar(0),fc.setScalar(0),pc.setScalar(0),dc.fromBufferAttribute(e,t),fc.fromBufferAttribute(e,n),pc.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(dc,r.x),a.addScaledVector(fc,r.y),a.addScaledVector(pc,r.z),a}static isFrontFacing(e,t,n,s){return Gn.subVectors(n,t),gi.subVectors(e,t),Gn.cross(gi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Gn.subVectors(this.c,this.b),gi.subVectors(this.a,this.b),Gn.cross(gi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Nn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Nn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Nn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Nn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Nn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;ks.subVectors(s,n),Fs.subVectors(r,n),lc.subVectors(e,n);const c=ks.dot(lc),h=Fs.dot(lc);if(c<=0&&h<=0)return t.copy(n);hc.subVectors(e,s);const d=ks.dot(hc),u=Fs.dot(hc);if(d>=0&&u<=d)return t.copy(s);const m=c*u-d*h;if(m<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(ks,a);uc.subVectors(e,r);const p=ks.dot(uc),y=Fs.dot(uc);if(y>=0&&p<=y)return t.copy(r);const x=p*h-c*y;if(x<=0&&h>=0&&y<=0)return o=h/(h-y),t.copy(n).addScaledVector(Fs,o);const _=d*y-p*u;if(_<=0&&u-d>=0&&p-y>=0)return Iu.subVectors(r,s),o=(u-d)/(u-d+(p-y)),t.copy(s).addScaledVector(Iu,o);const g=1/(_+x+m);return a=x*g,o=m*g,t.copy(n).addScaledVector(ks,a).addScaledVector(Fs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const ip={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Li={h:0,s:0,l:0},Ia={h:0,s:0,l:0};function mc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ze{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=on){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,St.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=St.workingColorSpace){return this.r=e,this.g=t,this.b=n,St.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=St.workingColorSpace){if(e=th(e,1),t=ft(t,0,1),n=ft(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=mc(a,r,e+1/3),this.g=mc(a,r,e),this.b=mc(a,r,e-1/3)}return St.colorSpaceToWorking(this,s),this}setStyle(e,t=on){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=on){const n=ip[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ti(e.r),this.g=Ti(e.g),this.b=Ti(e.b),this}copyLinearToSRGB(e){return this.r=nr(e.r),this.g=nr(e.g),this.b=nr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=on){return St.workingToColorSpace(un.copy(this),e),Math.round(ft(un.r*255,0,255))*65536+Math.round(ft(un.g*255,0,255))*256+Math.round(ft(un.b*255,0,255))}getHexString(e=on){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=St.workingColorSpace){St.workingToColorSpace(un.copy(this),t);const n=un.r,s=un.g,r=un.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,h;const d=(o+a)/2;if(o===a)c=0,h=0;else{const u=a-o;switch(h=d<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=St.workingColorSpace){return St.workingToColorSpace(un.copy(this),t),e.r=un.r,e.g=un.g,e.b=un.b,e}getStyle(e=on){St.workingToColorSpace(un.copy(this),e);const t=un.r,n=un.g,s=un.b;return e!==on?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Li),this.setHSL(Li.h+e,Li.s+t,Li.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Li),e.getHSL(Ia);const n=Hr(Li.h,Ia.h,t),s=Hr(Li.s,Ia.s,t),r=Hr(Li.l,Ia.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const un=new Ze;Ze.NAMES=ip;let N0=0;class xs extends dr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:N0++}),this.uuid=Ei(),this.name="",this.type="Material",this.blending=tr,this.side=Xi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vc,this.blendDst=Gc,this.blendEquation=us,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=ar,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Cs,this.stencilZFail=Cs,this.stencilZPass=Cs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==tr&&(n.blending=this.blending),this.side!==Xi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Vc&&(n.blendSrc=this.blendSrc),this.blendDst!==Gc&&(n.blendDst=this.blendDst),this.blendEquation!==us&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ar&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Cs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Cs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Cs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class On extends xs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=kf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const jt=new k,Da=new Te;let k0=0;class wn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:k0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Cl,this.updateRanges=[],this.gpuType=bi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Da.fromBufferAttribute(this,t),Da.applyMatrix3(e),this.setXY(t,Da.x,Da.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)jt.fromBufferAttribute(this,t),jt.applyMatrix3(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)jt.fromBufferAttribute(this,t),jt.applyMatrix4(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)jt.fromBufferAttribute(this,t),jt.applyNormalMatrix(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)jt.fromBufferAttribute(this,t),jt.transformDirection(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Wn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=It(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Wn(t,this.array)),t}setX(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Wn(t,this.array)),t}setY(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Wn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Wn(t,this.array)),t}setW(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),n=It(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),n=It(n,this.array),s=It(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),n=It(n,this.array),s=It(s,this.array),r=It(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Cl&&(e.usage=this.usage),e}}class sp extends wn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class rp extends wn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Mt extends wn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let F0=0;const Dn=new zt,gc=new Jt,Bs=new k,Rn=new ca,Ar=new ca,nn=new k;class qt extends dr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:F0++}),this.uuid=Ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(tp(e)?rp:sp)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ct().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Dn.makeRotationFromQuaternion(e),this.applyMatrix4(Dn),this}rotateX(e){return Dn.makeRotationX(e),this.applyMatrix4(Dn),this}rotateY(e){return Dn.makeRotationY(e),this.applyMatrix4(Dn),this}rotateZ(e){return Dn.makeRotationZ(e),this.applyMatrix4(Dn),this}translate(e,t,n){return Dn.makeTranslation(e,t,n),this.applyMatrix4(Dn),this}scale(e,t,n){return Dn.makeScale(e,t,n),this.applyMatrix4(Dn),this}lookAt(e){return gc.lookAt(e),gc.updateMatrix(),this.applyMatrix4(gc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bs).negate(),this.translate(Bs.x,Bs.y,Bs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Mt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ca);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Rn.setFromBufferAttribute(r),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ro);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){const n=this.boundingSphere.center;if(Rn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ar.setFromBufferAttribute(o),this.morphTargetsRelative?(nn.addVectors(Rn.min,Ar.min),Rn.expandByPoint(nn),nn.addVectors(Rn.max,Ar.max),Rn.expandByPoint(nn)):(Rn.expandByPoint(Ar.min),Rn.expandByPoint(Ar.max))}Rn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)nn.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(nn));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let h=0,d=o.count;h<d;h++)nn.fromBufferAttribute(o,h),c&&(Bs.fromBufferAttribute(e,h),nn.add(Bs)),s=Math.max(s,n.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<n.count;P++)o[P]=new k,c[P]=new k;const h=new k,d=new k,u=new k,m=new Te,p=new Te,y=new Te,x=new k,_=new k;function g(P,E,A){h.fromBufferAttribute(n,P),d.fromBufferAttribute(n,E),u.fromBufferAttribute(n,A),m.fromBufferAttribute(r,P),p.fromBufferAttribute(r,E),y.fromBufferAttribute(r,A),d.sub(h),u.sub(h),p.sub(m),y.sub(m);const B=1/(p.x*y.y-y.x*p.y);isFinite(B)&&(x.copy(d).multiplyScalar(y.y).addScaledVector(u,-p.y).multiplyScalar(B),_.copy(u).multiplyScalar(p.x).addScaledVector(d,-y.x).multiplyScalar(B),o[P].add(x),o[E].add(x),o[A].add(x),c[P].add(_),c[E].add(_),c[A].add(_))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let P=0,E=T.length;P<E;++P){const A=T[P],B=A.start,Z=A.count;for(let I=B,W=B+Z;I<W;I+=3)g(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const C=new k,S=new k,U=new k,O=new k;function N(P){U.fromBufferAttribute(s,P),O.copy(U);const E=o[P];C.copy(E),C.sub(U.multiplyScalar(U.dot(E))).normalize(),S.crossVectors(O,E);const B=S.dot(c[P])<0?-1:1;a.setXYZW(P,C.x,C.y,C.z,B)}for(let P=0,E=T.length;P<E;++P){const A=T[P],B=A.start,Z=A.count;for(let I=B,W=B+Z;I<W;I+=3)N(e.getX(I+0)),N(e.getX(I+1)),N(e.getX(I+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new wn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let m=0,p=n.count;m<p;m++)n.setXYZ(m,0,0,0);const s=new k,r=new k,a=new k,o=new k,c=new k,h=new k,d=new k,u=new k;if(e)for(let m=0,p=e.count;m<p;m+=3){const y=e.getX(m+0),x=e.getX(m+1),_=e.getX(m+2);s.fromBufferAttribute(t,y),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,_),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,y),c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,_),o.add(d),c.add(d),h.add(d),n.setXYZ(y,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(_,h.x,h.y,h.z)}else for(let m=0,p=t.count;m<p;m+=3)s.fromBufferAttribute(t,m+0),r.fromBufferAttribute(t,m+1),a.fromBufferAttribute(t,m+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(m+0,d.x,d.y,d.z),n.setXYZ(m+1,d.x,d.y,d.z),n.setXYZ(m+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)nn.fromBufferAttribute(e,t),nn.normalize(),e.setXYZ(t,nn.x,nn.y,nn.z)}toNonIndexed(){function e(o,c){const h=o.array,d=o.itemSize,u=o.normalized,m=new h.constructor(c.length*d);let p=0,y=0;for(let x=0,_=c.length;x<_;x++){o.isInterleavedBufferAttribute?p=c[x]*o.data.stride+o.offset:p=c[x]*d;for(let g=0;g<d;g++)m[y++]=h[p++]}return new wn(m,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new qt,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=e(c,n);t.setAttribute(o,h)}const r=this.morphAttributes;for(const o in r){const c=[],h=r[o];for(let d=0,u=h.length;d<u;d++){const m=h[d],p=e(m,n);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const h=a[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const h=n[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let u=0,m=h.length;u<m;u++){const p=h[u];d.push(p.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(t))}const r=e.morphAttributes;for(const h in r){const d=[],u=r[h];for(let m=0,p=u.length;m<p;m++)d.push(u[m].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let h=0,d=a.length;h<d;h++){const u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Du=new zt,ns=new ih,La=new Ro,Lu=new k,Oa=new k,Ua=new k,Na=new k,vc=new k,ka=new k,Ou=new k,Fa=new k;class Et extends Jt{constructor(e=new qt,t=new On){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){ka.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const d=o[c],u=r[c];d!==0&&(vc.fromBufferAttribute(u,e),a?ka.addScaledVector(vc,d):ka.addScaledVector(vc.sub(t),d))}t.add(ka)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),La.copy(n.boundingSphere),La.applyMatrix4(r),ns.copy(e.ray).recast(e.near),!(La.containsPoint(ns.origin)===!1&&(ns.intersectSphere(La,Lu)===null||ns.origin.distanceToSquared(Lu)>(e.far-e.near)**2))&&(Du.copy(r).invert(),ns.copy(e.ray).applyMatrix4(Du),!(n.boundingBox!==null&&ns.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ns)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,m=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let y=0,x=m.length;y<x;y++){const _=m[y],g=a[_.materialIndex],T=Math.max(_.start,p.start),C=Math.min(o.count,Math.min(_.start+_.count,p.start+p.count));for(let S=T,U=C;S<U;S+=3){const O=o.getX(S),N=o.getX(S+1),P=o.getX(S+2);s=Ba(this,g,e,n,h,d,u,O,N,P),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=_.materialIndex,t.push(s))}}else{const y=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let _=y,g=x;_<g;_+=3){const T=o.getX(_),C=o.getX(_+1),S=o.getX(_+2);s=Ba(this,a,e,n,h,d,u,T,C,S),s&&(s.faceIndex=Math.floor(_/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let y=0,x=m.length;y<x;y++){const _=m[y],g=a[_.materialIndex],T=Math.max(_.start,p.start),C=Math.min(c.count,Math.min(_.start+_.count,p.start+p.count));for(let S=T,U=C;S<U;S+=3){const O=S,N=S+1,P=S+2;s=Ba(this,g,e,n,h,d,u,O,N,P),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=_.materialIndex,t.push(s))}}else{const y=Math.max(0,p.start),x=Math.min(c.count,p.start+p.count);for(let _=y,g=x;_<g;_+=3){const T=_,C=_+1,S=_+2;s=Ba(this,a,e,n,h,d,u,T,C,S),s&&(s.faceIndex=Math.floor(_/3),t.push(s))}}}}function B0(i,e,t,n,s,r,a,o){let c;if(e.side===Mn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Xi,o),c===null)return null;Fa.copy(o),Fa.applyMatrix4(i.matrixWorld);const h=t.ray.origin.distanceTo(Fa);return h<t.near||h>t.far?null:{distance:h,point:Fa.clone(),object:i}}function Ba(i,e,t,n,s,r,a,o,c,h){i.getVertexPosition(o,Oa),i.getVertexPosition(c,Ua),i.getVertexPosition(h,Na);const d=B0(i,e,t,n,Oa,Ua,Na,Ou);if(d){const u=new k;Nn.getBarycoord(Ou,Oa,Ua,Na,u),s&&(d.uv=Nn.getInterpolatedAttribute(s,o,c,h,u,new Te)),r&&(d.uv1=Nn.getInterpolatedAttribute(r,o,c,h,u,new Te)),a&&(d.normal=Nn.getInterpolatedAttribute(a,o,c,h,u,new k),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const m={a:o,b:c,c:h,normal:new k,materialIndex:0};Nn.getNormal(Oa,Ua,Na,m.normal),d.face=m,d.barycoord=u}return d}class fr extends qt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],h=[],d=[],u=[];let m=0,p=0;y("z","y","x",-1,-1,n,t,e,a,r,0),y("z","y","x",1,-1,n,t,-e,a,r,1),y("x","z","y",1,1,e,n,t,s,a,2),y("x","z","y",1,-1,e,n,-t,s,a,3),y("x","y","z",1,-1,e,t,n,s,r,4),y("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Mt(h,3)),this.setAttribute("normal",new Mt(d,3)),this.setAttribute("uv",new Mt(u,2));function y(x,_,g,T,C,S,U,O,N,P,E){const A=S/N,B=U/P,Z=S/2,I=U/2,W=O/2,H=N+1,z=P+1;let $=0,X=0;const de=new k;for(let fe=0;fe<z;fe++){const Se=fe*B-I;for(let ke=0;ke<H;ke++){const lt=ke*A-Z;de[x]=lt*T,de[_]=Se*C,de[g]=W,h.push(de.x,de.y,de.z),de[x]=0,de[_]=0,de[g]=O>0?1:-1,d.push(de.x,de.y,de.z),u.push(ke/N),u.push(1-fe/P),$+=1}}for(let fe=0;fe<P;fe++)for(let Se=0;Se<N;Se++){const ke=m+Se+H*fe,lt=m+Se+H*(fe+1),mt=m+(Se+1)+H*(fe+1),pt=m+(Se+1)+H*fe;c.push(ke,lt,pt),c.push(lt,mt,pt),X+=6}o.addGroup(p,X,E),p+=X,m+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function hr(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function gn(i){const e={};for(let t=0;t<i.length;t++){const n=hr(i[t]);for(const s in n)e[s]=n[s]}return e}function z0(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ap(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:St.workingColorSpace}const ta={clone:hr,merge:gn};var H0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,V0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class _n extends xs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=H0,this.fragmentShader=V0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=hr(e.uniforms),this.uniformsGroups=z0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class op extends Jt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new zt,this.projectionMatrix=new zt,this.projectionMatrixInverse=new zt,this.coordinateSystem=si,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Oi=new k,Uu=new Te,Nu=new Te;class Cn extends op{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Qr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(zr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Qr*2*Math.atan(Math.tan(zr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Oi.x,Oi.y).multiplyScalar(-e/Oi.z),Oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Oi.x,Oi.y).multiplyScalar(-e/Oi.z)}getViewSize(e,t){return this.getViewBounds(e,Uu,Nu),t.subVectors(Nu,Uu)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(zr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/h,s*=a.width/c,n*=a.height/h}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const zs=-90,Hs=1;class G0 extends Jt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Cn(zs,Hs,e,t);s.layers=this.layers,this.add(s);const r=new Cn(zs,Hs,e,t);r.layers=this.layers,this.add(r);const a=new Cn(zs,Hs,e,t);a.layers=this.layers,this.add(a);const o=new Cn(zs,Hs,e,t);o.layers=this.layers,this.add(o);const c=new Cn(zs,Hs,e,t);c.layers=this.layers,this.add(c);const h=new Cn(zs,Hs,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const h of t)this.remove(h);if(e===si)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===mo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,h,d]=this.children,u=e.getRenderTarget(),m=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),y=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,h),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(u,m,p),e.xr.enabled=y,n.texture.needsPMREMUpdate=!0}}class cp extends yn{constructor(e=[],t=or,n,s,r,a,o,c,h,d){super(e,t,n,s,r,a,o,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class W0 extends qn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new cp(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new fr(5,5,5),r=new _n({name:"CubemapFromEquirect",uniforms:hr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Mn,blending:Mi});r.uniforms.tEquirect.value=t;const a=new Et(s,r),o=t.minFilter;return t.minFilter===ms&&(t.minFilter=ii),new G0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class zi extends Jt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $0={type:"move"};class _c{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(const x of e.hand.values()){const _=t.getJointPose(x,n),g=this._getHandJoint(h,x);_!==null&&(g.matrix.fromArray(_.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=_.radius),g.visible=_!==null}const d=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],m=d.position.distanceTo(u.position),p=.02,y=.005;h.inputState.pinching&&m>p+y?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&m<=p-y&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent($0)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new zi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class rh{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ze(e),this.near=t,this.far=n}clone(){return new rh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class X0 extends Jt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class q0{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Cl,this.updateRanges=[],this.version=0,this.uuid=Ei()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const mn=new k;class vo{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)mn.fromBufferAttribute(this,t),mn.applyMatrix4(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)mn.fromBufferAttribute(this,t),mn.applyNormalMatrix(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)mn.fromBufferAttribute(this,t),mn.transformDirection(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Wn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=It(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=It(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=It(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=It(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=It(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Wn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Wn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Wn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Wn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=It(t,this.array),n=It(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=It(t,this.array),n=It(n,this.array),s=It(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=It(t,this.array),n=It(n,this.array),s=It(s,this.array),r=It(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new wn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new vo(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ds extends xs{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ze(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Vs;const Rr=new k,Gs=new k,Ws=new k,$s=new Te,Cr=new Te,lp=new zt,za=new k,Pr=new k,Ha=new k,ku=new Te,yc=new Te,Fu=new Te;class Ys extends Jt{constructor(e=new ds){if(super(),this.isSprite=!0,this.type="Sprite",Vs===void 0){Vs=new qt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new q0(t,5);Vs.setIndex([0,1,2,0,2,3]),Vs.setAttribute("position",new vo(n,3,0,!1)),Vs.setAttribute("uv",new vo(n,2,3,!1))}this.geometry=Vs,this.material=e,this.center=new Te(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Gs.setFromMatrixScale(this.matrixWorld),lp.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ws.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Gs.multiplyScalar(-Ws.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Va(za.set(-.5,-.5,0),Ws,a,Gs,s,r),Va(Pr.set(.5,-.5,0),Ws,a,Gs,s,r),Va(Ha.set(.5,.5,0),Ws,a,Gs,s,r),ku.set(0,0),yc.set(1,0),Fu.set(1,1);let o=e.ray.intersectTriangle(za,Pr,Ha,!1,Rr);if(o===null&&(Va(Pr.set(-.5,.5,0),Ws,a,Gs,s,r),yc.set(0,1),o=e.ray.intersectTriangle(za,Ha,Pr,!1,Rr),o===null))return;const c=e.ray.origin.distanceTo(Rr);c<e.near||c>e.far||t.push({distance:c,point:Rr.clone(),uv:Nn.getInterpolation(Rr,za,Pr,Ha,ku,yc,Fu,new Te),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Va(i,e,t,n,s,r){$s.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Cr.x=r*$s.x-s*$s.y,Cr.y=s*$s.x+r*$s.y):Cr.copy($s),i.copy(e),i.x+=Cr.x,i.y+=Cr.y,i.applyMatrix4(lp)}const xc=new k,j0=new k,Y0=new ct;class os{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=xc.subVectors(n,t).cross(j0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(xc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Y0.getNormalMatrix(e),s=this.coplanarPoint(xc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const is=new Ro,K0=new Te(.5,.5),Ga=new k;class ah{constructor(e=new os,t=new os,n=new os,s=new os,r=new os,a=new os){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=si,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],h=r[3],d=r[4],u=r[5],m=r[6],p=r[7],y=r[8],x=r[9],_=r[10],g=r[11],T=r[12],C=r[13],S=r[14],U=r[15];if(s[0].setComponents(h-a,p-d,g-y,U-T).normalize(),s[1].setComponents(h+a,p+d,g+y,U+T).normalize(),s[2].setComponents(h+o,p+u,g+x,U+C).normalize(),s[3].setComponents(h-o,p-u,g-x,U-C).normalize(),n)s[4].setComponents(c,m,_,S).normalize(),s[5].setComponents(h-c,p-m,g-_,U-S).normalize();else if(s[4].setComponents(h-c,p-m,g-_,U-S).normalize(),t===si)s[5].setComponents(h+c,p+m,g+_,U+S).normalize();else if(t===mo)s[5].setComponents(c,m,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(is)}intersectsSprite(e){is.center.set(0,0,0);const t=K0.distanceTo(e.center);return is.radius=.7071067811865476+t,is.applyMatrix4(e.matrixWorld),this.intersectsSphere(is)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Ga.x=s.normal.x>0?e.max.x:e.min.x,Ga.y=s.normal.y>0?e.max.y:e.min.y,Ga.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ga)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class _o extends xs{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Bu=new zt,Pl=new ih,Wa=new Ro,$a=new k;class Il extends Jt{constructor(e=new qt,t=new _o){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Wa.copy(n.boundingSphere),Wa.applyMatrix4(s),Wa.radius+=r,e.ray.intersectsSphere(Wa)===!1)return;Bu.copy(s).invert(),Pl.copy(e.ray).applyMatrix4(Bu);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=n.index,u=n.attributes.position;if(h!==null){const m=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let y=m,x=p;y<x;y++){const _=h.getX(y);$a.fromBufferAttribute(u,_),zu($a,_,c,s,e,t,this)}}else{const m=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let y=m,x=p;y<x;y++)$a.fromBufferAttribute(u,y),zu($a,y,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function zu(i,e,t,n,s,r,a){const o=Pl.distanceSqToPoint(i);if(o<t){const c=new k;Pl.closestPointToPoint(i,c),c.applyMatrix4(n);const h=s.ray.origin.distanceTo(c);if(h<s.near||h>s.far)return;r.push({distance:h,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class gs extends yn{constructor(e,t,n,s,r,a,o,c,h){super(e,t,n,s,r,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class hp extends yn{constructor(e,t,n=ys,s,r,a,o=Xn,c=Xn,h,d=Jr,u=1){if(d!==Jr&&d!==Zr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:u};super(m,s,r,a,o,c,d,n,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new nh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class up extends yn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class oh extends qt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],h=new k,d=new Te;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,m=3;u<=t;u++,m+=3){const p=n+u/t*s;h.x=e*Math.cos(p),h.y=e*Math.sin(p),a.push(h.x,h.y,h.z),o.push(0,0,1),d.x=(a[m]/e+1)/2,d.y=(a[m+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Mt(a,3)),this.setAttribute("normal",new Mt(o,3)),this.setAttribute("uv",new Mt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oh(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Hi extends qt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],m=[],p=[];let y=0;const x=[],_=n/2;let g=0;T(),a===!1&&(e>0&&C(!0),t>0&&C(!1)),this.setIndex(d),this.setAttribute("position",new Mt(u,3)),this.setAttribute("normal",new Mt(m,3)),this.setAttribute("uv",new Mt(p,2));function T(){const S=new k,U=new k;let O=0;const N=(t-e)/n;for(let P=0;P<=r;P++){const E=[],A=P/r,B=A*(t-e)+e;for(let Z=0;Z<=s;Z++){const I=Z/s,W=I*c+o,H=Math.sin(W),z=Math.cos(W);U.x=B*H,U.y=-A*n+_,U.z=B*z,u.push(U.x,U.y,U.z),S.set(H,N,z).normalize(),m.push(S.x,S.y,S.z),p.push(I,1-A),E.push(y++)}x.push(E)}for(let P=0;P<s;P++)for(let E=0;E<r;E++){const A=x[E][P],B=x[E+1][P],Z=x[E+1][P+1],I=x[E][P+1];(e>0||E!==0)&&(d.push(A,B,I),O+=3),(t>0||E!==r-1)&&(d.push(B,Z,I),O+=3)}h.addGroup(g,O,0),g+=O}function C(S){const U=y,O=new Te,N=new k;let P=0;const E=S===!0?e:t,A=S===!0?1:-1;for(let Z=1;Z<=s;Z++)u.push(0,_*A,0),m.push(0,A,0),p.push(.5,.5),y++;const B=y;for(let Z=0;Z<=s;Z++){const W=Z/s*c+o,H=Math.cos(W),z=Math.sin(W);N.x=E*z,N.y=_*A,N.z=E*H,u.push(N.x,N.y,N.z),m.push(0,A,0),O.x=H*.5+.5,O.y=z*.5*A+.5,p.push(O.x,O.y),y++}for(let Z=0;Z<s;Z++){const I=U+Z,W=B+Z;S===!0?d.push(W,W+1,I):d.push(W+1,W,I),P+=3}h.addGroup(g,P,S===!0?1:2),g+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hi(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Co extends qt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),h(n),d(),this.setAttribute("position",new Mt(r,3)),this.setAttribute("normal",new Mt(r.slice(),3)),this.setAttribute("uv",new Mt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(T){const C=new k,S=new k,U=new k;for(let O=0;O<t.length;O+=3)p(t[O+0],C),p(t[O+1],S),p(t[O+2],U),c(C,S,U,T)}function c(T,C,S,U){const O=U+1,N=[];for(let P=0;P<=O;P++){N[P]=[];const E=T.clone().lerp(S,P/O),A=C.clone().lerp(S,P/O),B=O-P;for(let Z=0;Z<=B;Z++)Z===0&&P===O?N[P][Z]=E:N[P][Z]=E.clone().lerp(A,Z/B)}for(let P=0;P<O;P++)for(let E=0;E<2*(O-P)-1;E++){const A=Math.floor(E/2);E%2===0?(m(N[P][A+1]),m(N[P+1][A]),m(N[P][A])):(m(N[P][A+1]),m(N[P+1][A+1]),m(N[P+1][A]))}}function h(T){const C=new k;for(let S=0;S<r.length;S+=3)C.x=r[S+0],C.y=r[S+1],C.z=r[S+2],C.normalize().multiplyScalar(T),r[S+0]=C.x,r[S+1]=C.y,r[S+2]=C.z}function d(){const T=new k;for(let C=0;C<r.length;C+=3){T.x=r[C+0],T.y=r[C+1],T.z=r[C+2];const S=_(T)/2/Math.PI+.5,U=g(T)/Math.PI+.5;a.push(S,1-U)}y(),u()}function u(){for(let T=0;T<a.length;T+=6){const C=a[T+0],S=a[T+2],U=a[T+4],O=Math.max(C,S,U),N=Math.min(C,S,U);O>.9&&N<.1&&(C<.2&&(a[T+0]+=1),S<.2&&(a[T+2]+=1),U<.2&&(a[T+4]+=1))}}function m(T){r.push(T.x,T.y,T.z)}function p(T,C){const S=T*3;C.x=e[S+0],C.y=e[S+1],C.z=e[S+2]}function y(){const T=new k,C=new k,S=new k,U=new k,O=new Te,N=new Te,P=new Te;for(let E=0,A=0;E<r.length;E+=9,A+=6){T.set(r[E+0],r[E+1],r[E+2]),C.set(r[E+3],r[E+4],r[E+5]),S.set(r[E+6],r[E+7],r[E+8]),O.set(a[A+0],a[A+1]),N.set(a[A+2],a[A+3]),P.set(a[A+4],a[A+5]),U.copy(T).add(C).add(S).divideScalar(3);const B=_(U);x(O,A+0,T,B),x(N,A+2,C,B),x(P,A+4,S,B)}}function x(T,C,S,U){U<0&&T.x===1&&(a[C]=T.x-1),S.x===0&&S.z===0&&(a[C]=U/2/Math.PI+.5)}function _(T){return Math.atan2(T.z,-T.x)}function g(T){return Math.atan2(-T.y,Math.sqrt(T.x*T.x+T.z*T.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Co(e.vertices,e.indices,e.radius,e.details)}}class Ai{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],m=n[s+1]-d,p=(a-d)/m;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Te:new k);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new k,s=[],r=[],a=[],o=new k,c=new zt;for(let p=0;p<=e;p++){const y=p/e;s[p]=this.getTangentAt(y,new k)}r[0]=new k,a[0]=new k;let h=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),m=Math.abs(s[0].z);d<=h&&(h=d,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),m<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const y=Math.acos(ft(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,y))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(ft(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let y=1;y<=e;y++)r[y].applyMatrix4(c.makeRotationAxis(s[y],p*y)),a[y].crossVectors(s[y],r[y])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class dp extends Ai{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Te){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),m=c-this.aX,p=h-this.aY;c=m*d-p*u+this.aX,h=m*u+p*d+this.aY}return n.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class J0 extends dp{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ch(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,d,u){let m=(a-r)/h-(o-r)/(h+d)+(o-a)/d,p=(o-a)/d-(c-a)/(d+u)+(c-o)/u;m*=d,p*=d,s(a,o,m,p)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const Xa=new k,bc=new ch,Sc=new ch,Mc=new ch;class fp extends Ai{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new k){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,d;this.closed||o>0?h=s[(o-1)%r]:(Xa.subVectors(s[0],s[1]).add(s[0]),h=Xa);const u=s[o%r],m=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(Xa.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=Xa),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let y=Math.pow(h.distanceToSquared(u),p),x=Math.pow(u.distanceToSquared(m),p),_=Math.pow(m.distanceToSquared(d),p);x<1e-4&&(x=1),y<1e-4&&(y=x),_<1e-4&&(_=x),bc.initNonuniformCatmullRom(h.x,u.x,m.x,d.x,y,x,_),Sc.initNonuniformCatmullRom(h.y,u.y,m.y,d.y,y,x,_),Mc.initNonuniformCatmullRom(h.z,u.z,m.z,d.z,y,x,_)}else this.curveType==="catmullrom"&&(bc.initCatmullRom(h.x,u.x,m.x,d.x,this.tension),Sc.initCatmullRom(h.y,u.y,m.y,d.y,this.tension),Mc.initCatmullRom(h.z,u.z,m.z,d.z,this.tension));return n.set(bc.calc(c),Sc.calc(c),Mc.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new k().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Hu(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function Z0(i,e){const t=1-i;return t*t*e}function Q0(i,e){return 2*(1-i)*i*e}function ev(i,e){return i*i*e}function Vr(i,e,t,n){return Z0(i,e)+Q0(i,t)+ev(i,n)}function tv(i,e){const t=1-i;return t*t*t*e}function nv(i,e){const t=1-i;return 3*t*t*i*e}function iv(i,e){return 3*(1-i)*i*i*e}function sv(i,e){return i*i*i*e}function Gr(i,e,t,n,s){return tv(i,e)+nv(i,t)+iv(i,n)+sv(i,s)}class rv extends Ai{constructor(e=new Te,t=new Te,n=new Te,s=new Te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Te){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Gr(e,s.x,r.x,a.x,o.x),Gr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class av extends Ai{constructor(e=new k,t=new k,n=new k,s=new k){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new k){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Gr(e,s.x,r.x,a.x,o.x),Gr(e,s.y,r.y,a.y,o.y),Gr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ov extends Ai{constructor(e=new Te,t=new Te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Te){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class cv extends Ai{constructor(e=new k,t=new k){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new k){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new k){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class lv extends Ai{constructor(e=new Te,t=new Te,n=new Te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Te){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Vr(e,s.x,r.x,a.x),Vr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class lh extends Ai{constructor(e=new k,t=new k,n=new k){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new k){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Vr(e,s.x,r.x,a.x),Vr(e,s.y,r.y,a.y),Vr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hv extends Ai{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Te){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],h=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Hu(o,c.x,h.x,d.x,u.x),Hu(o,c.y,h.y,d.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new Te().fromArray(s))}return this}}var uv=Object.freeze({__proto__:null,ArcCurve:J0,CatmullRomCurve3:fp,CubicBezierCurve:rv,CubicBezierCurve3:av,EllipseCurve:dp,LineCurve:ov,LineCurve3:cv,QuadraticBezierCurve:lv,QuadraticBezierCurve3:lh,SplineCurve:hv});class yo extends Co{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new yo(e.radius,e.detail)}}class hh extends Co{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new hh(e.radius,e.detail)}}class Po extends qt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),h=o+1,d=c+1,u=e/o,m=t/c,p=[],y=[],x=[],_=[];for(let g=0;g<d;g++){const T=g*m-a;for(let C=0;C<h;C++){const S=C*u-r;y.push(S,-T,0),x.push(0,0,1),_.push(C/o),_.push(1-g/c)}}for(let g=0;g<c;g++)for(let T=0;T<o;T++){const C=T+h*g,S=T+h*(g+1),U=T+1+h*(g+1),O=T+1+h*g;p.push(C,S,O),p.push(S,U,O)}this.setIndex(p),this.setAttribute("position",new Mt(y,3)),this.setAttribute("normal",new Mt(x,3)),this.setAttribute("uv",new Mt(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Po(e.width,e.height,e.widthSegments,e.heightSegments)}}class na extends qt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],h=[],d=[];let u=e;const m=(t-e)/s,p=new k,y=new Te;for(let x=0;x<=s;x++){for(let _=0;_<=n;_++){const g=r+_/n*a;p.x=u*Math.cos(g),p.y=u*Math.sin(g),c.push(p.x,p.y,p.z),h.push(0,0,1),y.x=(p.x/t+1)/2,y.y=(p.y/t+1)/2,d.push(y.x,y.y)}u+=m}for(let x=0;x<s;x++){const _=x*(n+1);for(let g=0;g<n;g++){const T=g+_,C=T,S=T+n+1,U=T+n+2,O=T+1;o.push(C,S,O),o.push(S,U,O)}}this.setIndex(o),this.setAttribute("position",new Mt(c,3)),this.setAttribute("normal",new Mt(h,3)),this.setAttribute("uv",new Mt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new na(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class ia extends qt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let h=0;const d=[],u=new k,m=new k,p=[],y=[],x=[],_=[];for(let g=0;g<=n;g++){const T=[],C=g/n;let S=0;g===0&&a===0?S=.5/t:g===n&&c===Math.PI&&(S=-.5/t);for(let U=0;U<=t;U++){const O=U/t;u.x=-e*Math.cos(s+O*r)*Math.sin(a+C*o),u.y=e*Math.cos(a+C*o),u.z=e*Math.sin(s+O*r)*Math.sin(a+C*o),y.push(u.x,u.y,u.z),m.copy(u).normalize(),x.push(m.x,m.y,m.z),_.push(O+S,1-C),T.push(h++)}d.push(T)}for(let g=0;g<n;g++)for(let T=0;T<t;T++){const C=d[g][T+1],S=d[g][T],U=d[g+1][T],O=d[g+1][T+1];(g!==0||a>0)&&p.push(C,S,O),(g!==n-1||c<Math.PI)&&p.push(S,U,O)}this.setIndex(p),this.setAttribute("position",new Mt(y,3)),this.setAttribute("normal",new Mt(x,3)),this.setAttribute("uv",new Mt(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ia(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Io extends qt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],h=[],d=new k,u=new k,m=new k;for(let p=0;p<=n;p++)for(let y=0;y<=s;y++){const x=y/s*r,_=p/n*Math.PI*2;u.x=(e+t*Math.cos(_))*Math.cos(x),u.y=(e+t*Math.cos(_))*Math.sin(x),u.z=t*Math.sin(_),o.push(u.x,u.y,u.z),d.x=e*Math.cos(x),d.y=e*Math.sin(x),m.subVectors(u,d).normalize(),c.push(m.x,m.y,m.z),h.push(y/s),h.push(p/n)}for(let p=1;p<=n;p++)for(let y=1;y<=s;y++){const x=(s+1)*p+y-1,_=(s+1)*(p-1)+y-1,g=(s+1)*(p-1)+y,T=(s+1)*p+y;a.push(x,_,T),a.push(_,g,T)}this.setIndex(a),this.setAttribute("position",new Mt(o,3)),this.setAttribute("normal",new Mt(c,3)),this.setAttribute("uv",new Mt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Io(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class uh extends qt{constructor(e=1,t=.4,n=64,s=8,r=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:s,p:r,q:a},n=Math.floor(n),s=Math.floor(s);const o=[],c=[],h=[],d=[],u=new k,m=new k,p=new k,y=new k,x=new k,_=new k,g=new k;for(let C=0;C<=n;++C){const S=C/n*r*Math.PI*2;T(S,r,a,e,p),T(S+.01,r,a,e,y),_.subVectors(y,p),g.addVectors(y,p),x.crossVectors(_,g),g.crossVectors(x,_),x.normalize(),g.normalize();for(let U=0;U<=s;++U){const O=U/s*Math.PI*2,N=-t*Math.cos(O),P=t*Math.sin(O);u.x=p.x+(N*g.x+P*x.x),u.y=p.y+(N*g.y+P*x.y),u.z=p.z+(N*g.z+P*x.z),c.push(u.x,u.y,u.z),m.subVectors(u,p).normalize(),h.push(m.x,m.y,m.z),d.push(C/n),d.push(U/s)}}for(let C=1;C<=n;C++)for(let S=1;S<=s;S++){const U=(s+1)*(C-1)+(S-1),O=(s+1)*C+(S-1),N=(s+1)*C+S,P=(s+1)*(C-1)+S;o.push(U,O,P),o.push(O,N,P)}this.setIndex(o),this.setAttribute("position",new Mt(c,3)),this.setAttribute("normal",new Mt(h,3)),this.setAttribute("uv",new Mt(d,2));function T(C,S,U,O,N){const P=Math.cos(C),E=Math.sin(C),A=U/S*C,B=Math.cos(A);N.x=O*(2+B)*.5*P,N.y=O*(2+B)*E*.5,N.z=O*Math.sin(A)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new uh(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class dh extends qt{constructor(e=new lh(new k(-1,-1,0),new k(-1,1,0),new k(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};const a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new k,c=new k,h=new Te;let d=new k;const u=[],m=[],p=[],y=[];x(),this.setIndex(y),this.setAttribute("position",new Mt(u,3)),this.setAttribute("normal",new Mt(m,3)),this.setAttribute("uv",new Mt(p,2));function x(){for(let C=0;C<t;C++)_(C);_(r===!1?t:0),T(),g()}function _(C){d=e.getPointAt(C/t,d);const S=a.normals[C],U=a.binormals[C];for(let O=0;O<=s;O++){const N=O/s*Math.PI*2,P=Math.sin(N),E=-Math.cos(N);c.x=E*S.x+P*U.x,c.y=E*S.y+P*U.y,c.z=E*S.z+P*U.z,c.normalize(),m.push(c.x,c.y,c.z),o.x=d.x+n*c.x,o.y=d.y+n*c.y,o.z=d.z+n*c.z,u.push(o.x,o.y,o.z)}}function g(){for(let C=1;C<=t;C++)for(let S=1;S<=s;S++){const U=(s+1)*(C-1)+(S-1),O=(s+1)*C+(S-1),N=(s+1)*C+S,P=(s+1)*(C-1)+S;y.push(U,O,P),y.push(O,N,P)}}function T(){for(let C=0;C<=t;C++)for(let S=0;S<=s;S++)h.x=C/t,h.y=S/s,p.push(h.x,h.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new dh(new uv[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class dv extends _n{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Un extends xs{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Qf,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class fv extends Un{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Te(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ft(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ze(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ze(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ze(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class pv extends xs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=jg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class mv extends xs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class fh extends Jt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class gv extends fh{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Jt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const wc=new zt,Vu=new k,Gu=new k;class pp{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.mapType=ai,this.map=null,this.mapPass=null,this.matrix=new zt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ah,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new Lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Vu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Vu),Gu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Gu),t.updateMatrixWorld(),wc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(wc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Wu=new zt,Ir=new k,Ec=new k;class vv extends pp{constructor(){super(new Cn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Te(4,2),this._viewportCount=6,this._viewports=[new Lt(2,1,1,1),new Lt(0,1,1,1),new Lt(3,1,1,1),new Lt(1,1,1,1),new Lt(3,0,1,1),new Lt(1,0,1,1)],this._cubeDirections=[new k(1,0,0),new k(-1,0,0),new k(0,0,1),new k(0,0,-1),new k(0,1,0),new k(0,-1,0)],this._cubeUps=[new k(0,1,0),new k(0,1,0),new k(0,1,0),new k(0,1,0),new k(0,0,1),new k(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ir.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ir),Ec.copy(n.position),Ec.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Ec),n.updateMatrixWorld(),s.makeTranslation(-Ir.x,-Ir.y,-Ir.z),Wu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wu,n.coordinateSystem,n.reversedDepth)}}class Tc extends fh{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new vv}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class ph extends op{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class _v extends pp{constructor(){super(new ph(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class $u extends fh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Jt.DEFAULT_UP),this.updateMatrix(),this.target=new Jt,this.shadow=new _v}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class yv extends Cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class mp{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Xu=new zt;class xv{constructor(e,t,n=0,s=1/0){this.ray=new ih(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new sh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Xu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Xu),this}intersectObject(e,t=!0,n=[]){return Dl(e,this,n,t),n.sort(qu),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Dl(e[s],this,n,t);return n.sort(qu),n}}function qu(i,e){return i.distance-e.distance}function Dl(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Dl(r[a],e,t,!0)}}function ju(i,e,t,n){const s=bv(n);switch(t){case Yf:return i*e;case Jf:return i*e/s.components*s.byteLength;case Zl:return i*e/s.components*s.byteLength;case Zf:return i*e*2/s.components*s.byteLength;case Ql:return i*e*2/s.components*s.byteLength;case Kf:return i*e*3/s.components*s.byteLength;case $n:return i*e*4/s.components*s.byteLength;case eh:return i*e*4/s.components*s.byteLength;case Qa:case eo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case to:case no:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case nl:case sl:return Math.max(i,16)*Math.max(e,8)/4;case tl:case il:return Math.max(i,8)*Math.max(e,8)/2;case rl:case al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ol:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case cl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ll:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case hl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ul:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case dl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case fl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case pl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ml:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case gl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case vl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case _l:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case yl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case xl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case bl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Sl:case Ml:case wl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case El:case Tl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Al:case Rl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function bv(i){switch(i){case ai:case $f:return{byteLength:1,components:1};case Yr:case Xf:case wi:return{byteLength:2,components:1};case Kl:case Jl:return{byteLength:2,components:4};case ys:case Yl:case bi:return{byteLength:4,components:1};case qf:case jf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ql}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ql);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function gp(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Sv(i){const e=new WeakMap;function t(o,c){const h=o.array,d=o.usage,u=h.byteLength,m=i.createBuffer();i.bindBuffer(c,m),i.bufferData(c,h,d),o.onUploadCallback();let p;if(h instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)p=i.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=i.SHORT;else if(h instanceof Uint32Array)p=i.UNSIGNED_INT;else if(h instanceof Int32Array)p=i.INT;else if(h instanceof Int8Array)p=i.BYTE;else if(h instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,h){const d=c.array,u=c.updateRanges;if(i.bindBuffer(h,o),u.length===0)i.bufferSubData(h,0,d);else{u.sort((p,y)=>p.start-y.start);let m=0;for(let p=1;p<u.length;p++){const y=u[m],x=u[p];x.start<=y.start+y.count+1?y.count=Math.max(y.count,x.start+x.count-y.start):(++m,u[m]=x)}u.length=m+1;for(let p=0,y=u.length;p<y;p++){const x=u[p];i.bufferSubData(h,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,o,c),h.version=o.version}}return{get:s,remove:r,update:a}}var Mv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wv=`#ifdef USE_ALPHAHASH
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
#endif`,Ev=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Tv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Av=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Rv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cv=`#ifdef USE_AOMAP
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
#endif`,Pv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Iv=`#ifdef USE_BATCHING
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
#endif`,Dv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Lv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ov=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Uv=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Nv=`#ifdef USE_IRIDESCENCE
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
#endif`,kv=`#ifdef USE_BUMPMAP
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
#endif`,Fv=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Bv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Vv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Gv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Wv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,$v=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Xv=`#define PI 3.141592653589793
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
} // validated`,qv=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,jv=`vec3 transformedNormal = objectNormal;
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
#endif`,Yv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Kv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qv="gl_FragColor = linearToOutputTexel( gl_FragColor );",e_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,t_=`#ifdef USE_ENVMAP
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
#endif`,n_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,i_=`#ifdef USE_ENVMAP
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
#endif`,s_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,r_=`#ifdef USE_ENVMAP
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
#endif`,a_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,o_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,c_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,l_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,h_=`#ifdef USE_GRADIENTMAP
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
}`,u_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,d_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,f_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,p_=`uniform bool receiveShadow;
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
#endif`,m_=`#ifdef USE_ENVMAP
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
#endif`,g_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,v_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,__=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,y_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,x_=`PhysicalMaterial material;
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
#endif`,b_=`struct PhysicalMaterial {
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
}`,S_=`
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
#endif`,M_=`#if defined( RE_IndirectDiffuse )
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
#endif`,w_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,E_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,T_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,A_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,R_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,C_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,P_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,I_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,D_=`#if defined( USE_POINTS_UV )
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
#endif`,L_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,O_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,U_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,N_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,k_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,F_=`#ifdef USE_MORPHTARGETS
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
#endif`,B_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,z_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,H_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,V_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,G_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,W_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$_=`#ifdef USE_NORMALMAP
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
#endif`,X_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,q_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,j_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Y_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,K_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,J_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Z_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Q_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ey=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ty=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ny=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,iy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sy=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ry=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ay=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,oy=`float getShadowMask() {
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
}`,cy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ly=`#ifdef USE_SKINNING
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
#endif`,hy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,uy=`#ifdef USE_SKINNING
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
#endif`,dy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,py=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,my=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,gy=`#ifdef USE_TRANSMISSION
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
#endif`,vy=`#ifdef USE_TRANSMISSION
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
#endif`,_y=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,by=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Sy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,My=`uniform sampler2D t2D;
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
}`,wy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ey=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Ty=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ay=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ry=`#include <common>
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
}`,Cy=`#if DEPTH_PACKING == 3200
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
}`,Py=`#define DISTANCE
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
}`,Iy=`#define DISTANCE
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
}`,Dy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ly=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Oy=`uniform float scale;
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
}`,Uy=`uniform vec3 diffuse;
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
}`,Ny=`#include <common>
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
}`,ky=`uniform vec3 diffuse;
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
}`,Fy=`#define LAMBERT
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
}`,By=`#define LAMBERT
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
}`,zy=`#define MATCAP
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
}`,Hy=`#define MATCAP
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
}`,Vy=`#define NORMAL
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
}`,Gy=`#define NORMAL
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
}`,Wy=`#define PHONG
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
}`,$y=`#define PHONG
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
}`,Xy=`#define STANDARD
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
}`,qy=`#define STANDARD
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
}`,jy=`#define TOON
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
}`,Yy=`#define TOON
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
}`,Ky=`uniform float size;
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
}`,Jy=`uniform vec3 diffuse;
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
}`,Zy=`#include <common>
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
}`,Qy=`uniform vec3 color;
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
}`,ex=`uniform float rotation;
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
}`,tx=`uniform vec3 diffuse;
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
}`,ut={alphahash_fragment:Mv,alphahash_pars_fragment:wv,alphamap_fragment:Ev,alphamap_pars_fragment:Tv,alphatest_fragment:Av,alphatest_pars_fragment:Rv,aomap_fragment:Cv,aomap_pars_fragment:Pv,batching_pars_vertex:Iv,batching_vertex:Dv,begin_vertex:Lv,beginnormal_vertex:Ov,bsdfs:Uv,iridescence_fragment:Nv,bumpmap_pars_fragment:kv,clipping_planes_fragment:Fv,clipping_planes_pars_fragment:Bv,clipping_planes_pars_vertex:zv,clipping_planes_vertex:Hv,color_fragment:Vv,color_pars_fragment:Gv,color_pars_vertex:Wv,color_vertex:$v,common:Xv,cube_uv_reflection_fragment:qv,defaultnormal_vertex:jv,displacementmap_pars_vertex:Yv,displacementmap_vertex:Kv,emissivemap_fragment:Jv,emissivemap_pars_fragment:Zv,colorspace_fragment:Qv,colorspace_pars_fragment:e_,envmap_fragment:t_,envmap_common_pars_fragment:n_,envmap_pars_fragment:i_,envmap_pars_vertex:s_,envmap_physical_pars_fragment:m_,envmap_vertex:r_,fog_vertex:a_,fog_pars_vertex:o_,fog_fragment:c_,fog_pars_fragment:l_,gradientmap_pars_fragment:h_,lightmap_pars_fragment:u_,lights_lambert_fragment:d_,lights_lambert_pars_fragment:f_,lights_pars_begin:p_,lights_toon_fragment:g_,lights_toon_pars_fragment:v_,lights_phong_fragment:__,lights_phong_pars_fragment:y_,lights_physical_fragment:x_,lights_physical_pars_fragment:b_,lights_fragment_begin:S_,lights_fragment_maps:M_,lights_fragment_end:w_,logdepthbuf_fragment:E_,logdepthbuf_pars_fragment:T_,logdepthbuf_pars_vertex:A_,logdepthbuf_vertex:R_,map_fragment:C_,map_pars_fragment:P_,map_particle_fragment:I_,map_particle_pars_fragment:D_,metalnessmap_fragment:L_,metalnessmap_pars_fragment:O_,morphinstance_vertex:U_,morphcolor_vertex:N_,morphnormal_vertex:k_,morphtarget_pars_vertex:F_,morphtarget_vertex:B_,normal_fragment_begin:z_,normal_fragment_maps:H_,normal_pars_fragment:V_,normal_pars_vertex:G_,normal_vertex:W_,normalmap_pars_fragment:$_,clearcoat_normal_fragment_begin:X_,clearcoat_normal_fragment_maps:q_,clearcoat_pars_fragment:j_,iridescence_pars_fragment:Y_,opaque_fragment:K_,packing:J_,premultiplied_alpha_fragment:Z_,project_vertex:Q_,dithering_fragment:ey,dithering_pars_fragment:ty,roughnessmap_fragment:ny,roughnessmap_pars_fragment:iy,shadowmap_pars_fragment:sy,shadowmap_pars_vertex:ry,shadowmap_vertex:ay,shadowmask_pars_fragment:oy,skinbase_vertex:cy,skinning_pars_vertex:ly,skinning_vertex:hy,skinnormal_vertex:uy,specularmap_fragment:dy,specularmap_pars_fragment:fy,tonemapping_fragment:py,tonemapping_pars_fragment:my,transmission_fragment:gy,transmission_pars_fragment:vy,uv_pars_fragment:_y,uv_pars_vertex:yy,uv_vertex:xy,worldpos_vertex:by,background_vert:Sy,background_frag:My,backgroundCube_vert:wy,backgroundCube_frag:Ey,cube_vert:Ty,cube_frag:Ay,depth_vert:Ry,depth_frag:Cy,distanceRGBA_vert:Py,distanceRGBA_frag:Iy,equirect_vert:Dy,equirect_frag:Ly,linedashed_vert:Oy,linedashed_frag:Uy,meshbasic_vert:Ny,meshbasic_frag:ky,meshlambert_vert:Fy,meshlambert_frag:By,meshmatcap_vert:zy,meshmatcap_frag:Hy,meshnormal_vert:Vy,meshnormal_frag:Gy,meshphong_vert:Wy,meshphong_frag:$y,meshphysical_vert:Xy,meshphysical_frag:qy,meshtoon_vert:jy,meshtoon_frag:Yy,points_vert:Ky,points_frag:Jy,shadow_vert:Zy,shadow_frag:Qy,sprite_vert:ex,sprite_frag:tx},Ce={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ct},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ct}},envmap:{envMap:{value:null},envMapRotation:{value:new ct},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ct}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ct}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ct},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ct},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ct},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ct}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ct}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ct}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0},uvTransform:{value:new ct}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new Te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ct},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0}}},ei={basic:{uniforms:gn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.fog]),vertexShader:ut.meshbasic_vert,fragmentShader:ut.meshbasic_frag},lambert:{uniforms:gn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new Ze(0)}}]),vertexShader:ut.meshlambert_vert,fragmentShader:ut.meshlambert_frag},phong:{uniforms:gn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:ut.meshphong_vert,fragmentShader:ut.meshphong_frag},standard:{uniforms:gn([Ce.common,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.roughnessmap,Ce.metalnessmap,Ce.fog,Ce.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ut.meshphysical_vert,fragmentShader:ut.meshphysical_frag},toon:{uniforms:gn([Ce.common,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.gradientmap,Ce.fog,Ce.lights,{emissive:{value:new Ze(0)}}]),vertexShader:ut.meshtoon_vert,fragmentShader:ut.meshtoon_frag},matcap:{uniforms:gn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,{matcap:{value:null}}]),vertexShader:ut.meshmatcap_vert,fragmentShader:ut.meshmatcap_frag},points:{uniforms:gn([Ce.points,Ce.fog]),vertexShader:ut.points_vert,fragmentShader:ut.points_frag},dashed:{uniforms:gn([Ce.common,Ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ut.linedashed_vert,fragmentShader:ut.linedashed_frag},depth:{uniforms:gn([Ce.common,Ce.displacementmap]),vertexShader:ut.depth_vert,fragmentShader:ut.depth_frag},normal:{uniforms:gn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,{opacity:{value:1}}]),vertexShader:ut.meshnormal_vert,fragmentShader:ut.meshnormal_frag},sprite:{uniforms:gn([Ce.sprite,Ce.fog]),vertexShader:ut.sprite_vert,fragmentShader:ut.sprite_frag},background:{uniforms:{uvTransform:{value:new ct},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ut.background_vert,fragmentShader:ut.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ct}},vertexShader:ut.backgroundCube_vert,fragmentShader:ut.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ut.cube_vert,fragmentShader:ut.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ut.equirect_vert,fragmentShader:ut.equirect_frag},distanceRGBA:{uniforms:gn([Ce.common,Ce.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ut.distanceRGBA_vert,fragmentShader:ut.distanceRGBA_frag},shadow:{uniforms:gn([Ce.lights,Ce.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:ut.shadow_vert,fragmentShader:ut.shadow_frag}};ei.physical={uniforms:gn([ei.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ct},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ct},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ct},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ct},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ct},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ct},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ct},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ct},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ct},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ct},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ct},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ct}}]),vertexShader:ut.meshphysical_vert,fragmentShader:ut.meshphysical_frag};const qa={r:0,b:0,g:0},ss=new oi,nx=new zt;function ix(i,e,t,n,s,r,a){const o=new Ze(0);let c=r===!0?0:1,h,d,u=null,m=0,p=null;function y(C){let S=C.isScene===!0?C.background:null;return S&&S.isTexture&&(S=(C.backgroundBlurriness>0?t:e).get(S)),S}function x(C){let S=!1;const U=y(C);U===null?g(o,c):U&&U.isColor&&(g(U,1),S=!0);const O=i.xr.getEnvironmentBlendMode();O==="additive"?n.buffers.color.setClear(0,0,0,1,a):O==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(C,S){const U=y(S);U&&(U.isCubeTexture||U.mapping===Ao)?(d===void 0&&(d=new Et(new fr(1,1,1),new _n({name:"BackgroundCubeMaterial",uniforms:hr(ei.backgroundCube.uniforms),vertexShader:ei.backgroundCube.vertexShader,fragmentShader:ei.backgroundCube.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(O,N,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),ss.copy(S.backgroundRotation),ss.x*=-1,ss.y*=-1,ss.z*=-1,U.isCubeTexture&&U.isRenderTargetTexture===!1&&(ss.y*=-1,ss.z*=-1),d.material.uniforms.envMap.value=U,d.material.uniforms.flipEnvMap.value=U.isCubeTexture&&U.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(nx.makeRotationFromEuler(ss)),d.material.toneMapped=St.getTransfer(U.colorSpace)!==Pt,(u!==U||m!==U.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,u=U,m=U.version,p=i.toneMapping),d.layers.enableAll(),C.unshift(d,d.geometry,d.material,0,0,null)):U&&U.isTexture&&(h===void 0&&(h=new Et(new Po(2,2),new _n({name:"BackgroundMaterial",uniforms:hr(ei.background.uniforms),vertexShader:ei.background.vertexShader,fragmentShader:ei.background.fragmentShader,side:Xi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=U,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.toneMapped=St.getTransfer(U.colorSpace)!==Pt,U.matrixAutoUpdate===!0&&U.updateMatrix(),h.material.uniforms.uvTransform.value.copy(U.matrix),(u!==U||m!==U.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=U,m=U.version,p=i.toneMapping),h.layers.enableAll(),C.unshift(h,h.geometry,h.material,0,0,null))}function g(C,S){C.getRGB(qa,ap(i)),n.buffers.color.setClear(qa.r,qa.g,qa.b,S,a)}function T(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return o},setClearColor:function(C,S=1){o.set(C),c=S,g(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(C){c=C,g(o,c)},render:x,addToRenderList:_,dispose:T}}function sx(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=m(null);let r=s,a=!1;function o(A,B,Z,I,W){let H=!1;const z=u(I,Z,B);r!==z&&(r=z,h(r.object)),H=p(A,I,Z,W),H&&y(A,I,Z,W),W!==null&&e.update(W,i.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,S(A,B,Z,I),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function c(){return i.createVertexArray()}function h(A){return i.bindVertexArray(A)}function d(A){return i.deleteVertexArray(A)}function u(A,B,Z){const I=Z.wireframe===!0;let W=n[A.id];W===void 0&&(W={},n[A.id]=W);let H=W[B.id];H===void 0&&(H={},W[B.id]=H);let z=H[I];return z===void 0&&(z=m(c()),H[I]=z),z}function m(A){const B=[],Z=[],I=[];for(let W=0;W<t;W++)B[W]=0,Z[W]=0,I[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:Z,attributeDivisors:I,object:A,attributes:{},index:null}}function p(A,B,Z,I){const W=r.attributes,H=B.attributes;let z=0;const $=Z.getAttributes();for(const X in $)if($[X].location>=0){const fe=W[X];let Se=H[X];if(Se===void 0&&(X==="instanceMatrix"&&A.instanceMatrix&&(Se=A.instanceMatrix),X==="instanceColor"&&A.instanceColor&&(Se=A.instanceColor)),fe===void 0||fe.attribute!==Se||Se&&fe.data!==Se.data)return!0;z++}return r.attributesNum!==z||r.index!==I}function y(A,B,Z,I){const W={},H=B.attributes;let z=0;const $=Z.getAttributes();for(const X in $)if($[X].location>=0){let fe=H[X];fe===void 0&&(X==="instanceMatrix"&&A.instanceMatrix&&(fe=A.instanceMatrix),X==="instanceColor"&&A.instanceColor&&(fe=A.instanceColor));const Se={};Se.attribute=fe,fe&&fe.data&&(Se.data=fe.data),W[X]=Se,z++}r.attributes=W,r.attributesNum=z,r.index=I}function x(){const A=r.newAttributes;for(let B=0,Z=A.length;B<Z;B++)A[B]=0}function _(A){g(A,0)}function g(A,B){const Z=r.newAttributes,I=r.enabledAttributes,W=r.attributeDivisors;Z[A]=1,I[A]===0&&(i.enableVertexAttribArray(A),I[A]=1),W[A]!==B&&(i.vertexAttribDivisor(A,B),W[A]=B)}function T(){const A=r.newAttributes,B=r.enabledAttributes;for(let Z=0,I=B.length;Z<I;Z++)B[Z]!==A[Z]&&(i.disableVertexAttribArray(Z),B[Z]=0)}function C(A,B,Z,I,W,H,z){z===!0?i.vertexAttribIPointer(A,B,Z,W,H):i.vertexAttribPointer(A,B,Z,I,W,H)}function S(A,B,Z,I){x();const W=I.attributes,H=Z.getAttributes(),z=B.defaultAttributeValues;for(const $ in H){const X=H[$];if(X.location>=0){let de=W[$];if(de===void 0&&($==="instanceMatrix"&&A.instanceMatrix&&(de=A.instanceMatrix),$==="instanceColor"&&A.instanceColor&&(de=A.instanceColor)),de!==void 0){const fe=de.normalized,Se=de.itemSize,ke=e.get(de);if(ke===void 0)continue;const lt=ke.buffer,mt=ke.type,pt=ke.bytesPerElement,ue=mt===i.INT||mt===i.UNSIGNED_INT||de.gpuType===Yl;if(de.isInterleavedBufferAttribute){const pe=de.data,Ae=pe.stride,nt=de.offset;if(pe.isInstancedInterleavedBuffer){for(let Ge=0;Ge<X.locationSize;Ge++)g(X.location+Ge,pe.meshPerAttribute);A.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let Ge=0;Ge<X.locationSize;Ge++)_(X.location+Ge);i.bindBuffer(i.ARRAY_BUFFER,lt);for(let Ge=0;Ge<X.locationSize;Ge++)C(X.location+Ge,Se/X.locationSize,mt,fe,Ae*pt,(nt+Se/X.locationSize*Ge)*pt,ue)}else{if(de.isInstancedBufferAttribute){for(let pe=0;pe<X.locationSize;pe++)g(X.location+pe,de.meshPerAttribute);A.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let pe=0;pe<X.locationSize;pe++)_(X.location+pe);i.bindBuffer(i.ARRAY_BUFFER,lt);for(let pe=0;pe<X.locationSize;pe++)C(X.location+pe,Se/X.locationSize,mt,fe,Se*pt,Se/X.locationSize*pe*pt,ue)}}else if(z!==void 0){const fe=z[$];if(fe!==void 0)switch(fe.length){case 2:i.vertexAttrib2fv(X.location,fe);break;case 3:i.vertexAttrib3fv(X.location,fe);break;case 4:i.vertexAttrib4fv(X.location,fe);break;default:i.vertexAttrib1fv(X.location,fe)}}}}T()}function U(){P();for(const A in n){const B=n[A];for(const Z in B){const I=B[Z];for(const W in I)d(I[W].object),delete I[W];delete B[Z]}delete n[A]}}function O(A){if(n[A.id]===void 0)return;const B=n[A.id];for(const Z in B){const I=B[Z];for(const W in I)d(I[W].object),delete I[W];delete B[Z]}delete n[A.id]}function N(A){for(const B in n){const Z=n[B];if(Z[A.id]===void 0)continue;const I=Z[A.id];for(const W in I)d(I[W].object),delete I[W];delete Z[A.id]}}function P(){E(),a=!0,r!==s&&(r=s,h(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:E,dispose:U,releaseStatesOfGeometry:O,releaseStatesOfProgram:N,initAttributes:x,enableAttribute:_,disableUnusedAttributes:T}}function rx(i,e,t){let n;function s(h){n=h}function r(h,d){i.drawArrays(n,h,d),t.update(d,n,1)}function a(h,d,u){u!==0&&(i.drawArraysInstanced(n,h,d,u),t.update(d,n,u))}function o(h,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,d,0,u);let p=0;for(let y=0;y<u;y++)p+=d[y];t.update(p,n,1)}function c(h,d,u,m){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let y=0;y<h.length;y++)a(h[y],d[y],m[y]);else{p.multiDrawArraysInstancedWEBGL(n,h,0,d,0,m,0,u);let y=0;for(let x=0;x<u;x++)y+=d[x]*m[x];t.update(y,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function ax(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const N=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(N){return!(N!==$n&&n.convert(N)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(N){const P=N===wi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(N!==ai&&n.convert(N)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&N!==bi&&!P)}function c(N){if(N==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";N="mediump"}return N==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=c(h);d!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const u=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),C=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),U=y>0,O=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reversedDepthBuffer:m,maxTextures:p,maxVertexTextures:y,maxTextureSize:x,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:T,maxVaryings:C,maxFragmentUniforms:S,vertexTextures:U,maxSamples:O}}function ox(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new os,o=new ct,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,m){const p=u.length!==0||m||n!==0||s;return s=m,n=u.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,m){t=d(u,m,0)},this.setState=function(u,m,p){const y=u.clippingPlanes,x=u.clipIntersection,_=u.clipShadows,g=i.get(u);if(!s||y===null||y.length===0||r&&!_)r?d(null):h();else{const T=r?0:n,C=T*4;let S=g.clippingState||null;c.value=S,S=d(y,m,C,p);for(let U=0;U!==C;++U)S[U]=t[U];g.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=T}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,m,p,y){const x=u!==null?u.length:0;let _=null;if(x!==0){if(_=c.value,y!==!0||_===null){const g=p+x*4,T=m.matrixWorldInverse;o.getNormalMatrix(T),(_===null||_.length<g)&&(_=new Float32Array(g));for(let C=0,S=p;C!==x;++C,S+=4)a.copy(u[C]).applyMatrix4(T,o),a.normal.toArray(_,S),_[S+3]=a.constant}c.value=_,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,_}}function cx(i){let e=new WeakMap;function t(a,o){return o===Jc?a.mapping=or:o===Zc&&(a.mapping=cr),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Jc||o===Zc)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new W0(c.height);return h.fromEquirectangularTexture(i,a),e.set(a,h),a.addEventListener("dispose",s),t(h.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const er=4,Yu=[.125,.215,.35,.446,.526,.582],fs=20,Ac=new ph,Ku=new Ze;let Rc=null,Cc=0,Pc=0,Ic=!1;const cs=(1+Math.sqrt(5))/2,Xs=1/cs,Ju=[new k(-cs,Xs,0),new k(cs,Xs,0),new k(-Xs,0,cs),new k(Xs,0,cs),new k(0,cs,-Xs),new k(0,cs,Xs),new k(-1,1,-1),new k(1,1,-1),new k(-1,1,1),new k(1,1,1)],lx=new k;class Zu{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=lx}=r;Rc=this._renderer.getRenderTarget(),Cc=this._renderer.getActiveCubeFace(),Pc=this._renderer.getActiveMipmapLevel(),Ic=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=td(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ed(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Rc,Cc,Pc),this._renderer.xr.enabled=Ic,e.scissorTest=!1,ja(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===or||e.mapping===cr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Rc=this._renderer.getRenderTarget(),Cc=this._renderer.getActiveCubeFace(),Pc=this._renderer.getActiveMipmapLevel(),Ic=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ii,minFilter:ii,generateMipmaps:!1,type:wi,format:$n,colorSpace:lr,depthBuffer:!1},s=Qu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Qu(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=hx(r)),this._blurMaterial=ux(r,e,t)}return s}_compileMaterial(e){const t=new Et(this._lodPlanes[0],e);this._renderer.compile(t,Ac)}_sceneToCubeUV(e,t,n,s,r){const c=new Cn(90,1,t,n),h=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,m=u.autoClear,p=u.toneMapping;u.getClearColor(Ku),u.toneMapping=Wi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const x=new On({name:"PMREM.Background",side:Mn,depthWrite:!1,depthTest:!1}),_=new Et(new fr,x);let g=!1;const T=e.background;T?T.isColor&&(x.color.copy(T),e.background=null,g=!0):(x.color.copy(Ku),g=!0);for(let C=0;C<6;C++){const S=C%3;S===0?(c.up.set(0,h[C],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[C],r.y,r.z)):S===1?(c.up.set(0,0,h[C]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[C],r.z)):(c.up.set(0,h[C],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[C]));const U=this._cubeSize;ja(s,S*U,C>2?U:0,U,U),u.setRenderTarget(s),g&&u.render(_,c),u.render(e,c)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=p,u.autoClear=m,e.background=T}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===or||e.mapping===cr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=td()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ed());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Et(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;ja(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Ac)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Ju[(s-r-1)%Ju.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new Et(this._lodPlanes[s],h),m=h.uniforms,p=this._sizeLods[n]-1,y=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*fs-1),x=r/y,_=isFinite(r)?1+Math.floor(d*x):fs;_>fs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${_} samples when the maximum is set to ${fs}`);const g=[];let T=0;for(let N=0;N<fs;++N){const P=N/x,E=Math.exp(-P*P/2);g.push(E),N===0?T+=E:N<_&&(T+=2*E)}for(let N=0;N<g.length;N++)g[N]=g[N]/T;m.envMap.value=e.texture,m.samples.value=_,m.weights.value=g,m.latitudinal.value=a==="latitudinal",o&&(m.poleAxis.value=o);const{_lodMax:C}=this;m.dTheta.value=y,m.mipInt.value=C-n;const S=this._sizeLods[s],U=3*S*(s>C-er?s-C+er:0),O=4*(this._cubeSize-S);ja(t,U,O,3*S,2*S),c.setRenderTarget(t),c.render(u,Ac)}}function hx(i){const e=[],t=[],n=[];let s=i;const r=i-er+1+Yu.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>i-er?c=Yu[a-i+er-1]:a===0&&(c=0),n.push(c);const h=1/(o-2),d=-h,u=1+h,m=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,y=6,x=3,_=2,g=1,T=new Float32Array(x*y*p),C=new Float32Array(_*y*p),S=new Float32Array(g*y*p);for(let O=0;O<p;O++){const N=O%3*2/3-1,P=O>2?0:-1,E=[N,P,0,N+2/3,P,0,N+2/3,P+1,0,N,P,0,N+2/3,P+1,0,N,P+1,0];T.set(E,x*y*O),C.set(m,_*y*O);const A=[O,O,O,O,O,O];S.set(A,g*y*O)}const U=new qt;U.setAttribute("position",new wn(T,x)),U.setAttribute("uv",new wn(C,_)),U.setAttribute("faceIndex",new wn(S,g)),e.push(U),s>er&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Qu(i,e,t){const n=new qn(i,e,t);return n.texture.mapping=Ao,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ja(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function ux(i,e,t){const n=new Float32Array(fs),s=new k(0,1,0);return new _n({name:"SphericalGaussianBlur",defines:{n:fs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:mh(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function ed(){return new _n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mh(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function td(){return new _n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function mh(){return`

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
	`}function dx(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,h=c===Jc||c===Zc,d=c===or||c===cr;if(h||d){let u=e.get(o);const m=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==m)return t===null&&(t=new Zu(i)),u=h?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return h&&p&&p.height>0||d&&p&&s(p)?(t===null&&(t=new Zu(i)),u=h?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const h=6;for(let d=0;d<h;d++)o[d]!==void 0&&c++;return c===h}function r(o){const c=o.target;c.removeEventListener("dispose",r);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function fx(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&ea("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function px(i,e,t,n){const s={},r=new WeakMap;function a(u){const m=u.target;m.index!==null&&e.remove(m.index);for(const y in m.attributes)e.remove(m.attributes[y]);m.removeEventListener("dispose",a),delete s[m.id];const p=r.get(m);p&&(e.remove(p),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function o(u,m){return s[m.id]===!0||(m.addEventListener("dispose",a),s[m.id]=!0,t.memory.geometries++),m}function c(u){const m=u.attributes;for(const p in m)e.update(m[p],i.ARRAY_BUFFER)}function h(u){const m=[],p=u.index,y=u.attributes.position;let x=0;if(p!==null){const T=p.array;x=p.version;for(let C=0,S=T.length;C<S;C+=3){const U=T[C+0],O=T[C+1],N=T[C+2];m.push(U,O,O,N,N,U)}}else if(y!==void 0){const T=y.array;x=y.version;for(let C=0,S=T.length/3-1;C<S;C+=3){const U=C+0,O=C+1,N=C+2;m.push(U,O,O,N,N,U)}}else return;const _=new(tp(m)?rp:sp)(m,1);_.version=x;const g=r.get(u);g&&e.remove(g),r.set(u,_)}function d(u){const m=r.get(u);if(m){const p=u.index;p!==null&&m.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function mx(i,e,t){let n;function s(m){n=m}let r,a;function o(m){r=m.type,a=m.bytesPerElement}function c(m,p){i.drawElements(n,p,r,m*a),t.update(p,n,1)}function h(m,p,y){y!==0&&(i.drawElementsInstanced(n,p,r,m*a,y),t.update(p,n,y))}function d(m,p,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,m,0,y);let _=0;for(let g=0;g<y;g++)_+=p[g];t.update(_,n,1)}function u(m,p,y,x){if(y===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let g=0;g<m.length;g++)h(m[g]/a,p[g],x[g]);else{_.multiDrawElementsInstancedWEBGL(n,p,0,r,m,0,x,0,y);let g=0;for(let T=0;T<y;T++)g+=p[T]*x[T];t.update(g,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function gx(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function vx(i,e,t){const n=new WeakMap,s=new Lt;function r(a,o,c){const h=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let m=n.get(o);if(m===void 0||m.count!==u){let A=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",A)};var p=A;m!==void 0&&m.texture.dispose();const y=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],T=o.morphAttributes.normal||[],C=o.morphAttributes.color||[];let S=0;y===!0&&(S=1),x===!0&&(S=2),_===!0&&(S=3);let U=o.attributes.position.count*S,O=1;U>e.maxTextureSize&&(O=Math.ceil(U/e.maxTextureSize),U=e.maxTextureSize);const N=new Float32Array(U*O*4*u),P=new np(N,U,O,u);P.type=bi,P.needsUpdate=!0;const E=S*4;for(let B=0;B<u;B++){const Z=g[B],I=T[B],W=C[B],H=U*O*4*B;for(let z=0;z<Z.count;z++){const $=z*E;y===!0&&(s.fromBufferAttribute(Z,z),N[H+$+0]=s.x,N[H+$+1]=s.y,N[H+$+2]=s.z,N[H+$+3]=0),x===!0&&(s.fromBufferAttribute(I,z),N[H+$+4]=s.x,N[H+$+5]=s.y,N[H+$+6]=s.z,N[H+$+7]=0),_===!0&&(s.fromBufferAttribute(W,z),N[H+$+8]=s.x,N[H+$+9]=s.y,N[H+$+10]=s.z,N[H+$+11]=W.itemSize===4?s.w:1)}}m={count:u,texture:P,size:new Te(U,O)},n.set(o,m),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let y=0;for(let _=0;_<h.length;_++)y+=h[_];const x=o.morphTargetsRelative?1:1-y;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",h)}c.getUniforms().setValue(i,"morphTargetsTexture",m.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}return{update:r}}function _x(i,e,t,n){let s=new WeakMap;function r(c){const h=n.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const m=c.skeleton;s.get(m)!==h&&(m.update(),s.set(m,h))}return u}function a(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:a}}const vp=new yn,nd=new hp(1,1),_p=new np,yp=new R0,xp=new cp,id=[],sd=[],rd=new Float32Array(16),ad=new Float32Array(9),od=new Float32Array(4);function pr(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=id[s];if(r===void 0&&(r=new Float32Array(s),id[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Zt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Qt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Do(i,e){let t=sd[e];t===void 0&&(t=new Int32Array(e),sd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function yx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function xx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;i.uniform2fv(this.addr,e),Qt(t,e)}}function bx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Zt(t,e))return;i.uniform3fv(this.addr,e),Qt(t,e)}}function Sx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;i.uniform4fv(this.addr,e),Qt(t,e)}}function Mx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Zt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Qt(t,e)}else{if(Zt(t,n))return;od.set(n),i.uniformMatrix2fv(this.addr,!1,od),Qt(t,n)}}function wx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Zt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Qt(t,e)}else{if(Zt(t,n))return;ad.set(n),i.uniformMatrix3fv(this.addr,!1,ad),Qt(t,n)}}function Ex(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Zt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Qt(t,e)}else{if(Zt(t,n))return;rd.set(n),i.uniformMatrix4fv(this.addr,!1,rd),Qt(t,n)}}function Tx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Ax(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;i.uniform2iv(this.addr,e),Qt(t,e)}}function Rx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Zt(t,e))return;i.uniform3iv(this.addr,e),Qt(t,e)}}function Cx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;i.uniform4iv(this.addr,e),Qt(t,e)}}function Px(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Ix(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;i.uniform2uiv(this.addr,e),Qt(t,e)}}function Dx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Zt(t,e))return;i.uniform3uiv(this.addr,e),Qt(t,e)}}function Lx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;i.uniform4uiv(this.addr,e),Qt(t,e)}}function Ox(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(nd.compareFunction=ep,r=nd):r=vp,t.setTexture2D(e||r,s)}function Ux(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||yp,s)}function Nx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||xp,s)}function kx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||_p,s)}function Fx(i){switch(i){case 5126:return yx;case 35664:return xx;case 35665:return bx;case 35666:return Sx;case 35674:return Mx;case 35675:return wx;case 35676:return Ex;case 5124:case 35670:return Tx;case 35667:case 35671:return Ax;case 35668:case 35672:return Rx;case 35669:case 35673:return Cx;case 5125:return Px;case 36294:return Ix;case 36295:return Dx;case 36296:return Lx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ox;case 35679:case 36299:case 36307:return Ux;case 35680:case 36300:case 36308:case 36293:return Nx;case 36289:case 36303:case 36311:case 36292:return kx}}function Bx(i,e){i.uniform1fv(this.addr,e)}function zx(i,e){const t=pr(e,this.size,2);i.uniform2fv(this.addr,t)}function Hx(i,e){const t=pr(e,this.size,3);i.uniform3fv(this.addr,t)}function Vx(i,e){const t=pr(e,this.size,4);i.uniform4fv(this.addr,t)}function Gx(i,e){const t=pr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Wx(i,e){const t=pr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function $x(i,e){const t=pr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Xx(i,e){i.uniform1iv(this.addr,e)}function qx(i,e){i.uniform2iv(this.addr,e)}function jx(i,e){i.uniform3iv(this.addr,e)}function Yx(i,e){i.uniform4iv(this.addr,e)}function Kx(i,e){i.uniform1uiv(this.addr,e)}function Jx(i,e){i.uniform2uiv(this.addr,e)}function Zx(i,e){i.uniform3uiv(this.addr,e)}function Qx(i,e){i.uniform4uiv(this.addr,e)}function eb(i,e,t){const n=this.cache,s=e.length,r=Do(t,s);Zt(n,r)||(i.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||vp,r[a])}function tb(i,e,t){const n=this.cache,s=e.length,r=Do(t,s);Zt(n,r)||(i.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||yp,r[a])}function nb(i,e,t){const n=this.cache,s=e.length,r=Do(t,s);Zt(n,r)||(i.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||xp,r[a])}function ib(i,e,t){const n=this.cache,s=e.length,r=Do(t,s);Zt(n,r)||(i.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||_p,r[a])}function sb(i){switch(i){case 5126:return Bx;case 35664:return zx;case 35665:return Hx;case 35666:return Vx;case 35674:return Gx;case 35675:return Wx;case 35676:return $x;case 5124:case 35670:return Xx;case 35667:case 35671:return qx;case 35668:case 35672:return jx;case 35669:case 35673:return Yx;case 5125:return Kx;case 36294:return Jx;case 36295:return Zx;case 36296:return Qx;case 35678:case 36198:case 36298:case 36306:case 35682:return eb;case 35679:case 36299:case 36307:return tb;case 35680:case 36300:case 36308:case 36293:return nb;case 36289:case 36303:case 36311:case 36292:return ib}}class rb{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Fx(t.type)}}class ab{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=sb(t.type)}}class ob{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Dc=/(\w+)(\])?(\[|\.)?/g;function cd(i,e){i.seq.push(e),i.map[e.id]=e}function cb(i,e,t){const n=i.name,s=n.length;for(Dc.lastIndex=0;;){const r=Dc.exec(n),a=Dc.lastIndex;let o=r[1];const c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){cd(t,h===void 0?new rb(o,i,e):new ab(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new ob(o),cd(t,u)),t=u}}}class io{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);cb(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function ld(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const lb=37297;let hb=0;function ub(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const hd=new ct;function db(i){St._getMatrix(hd,St.workingColorSpace,i);const e=`mat3( ${hd.elements.map(t=>t.toFixed(4))} )`;switch(St.getTransfer(i)){case po:return[e,"LinearTransferOETF"];case Pt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function ud(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+ub(i.getShaderSource(e),o)}else return r}function fb(i,e){const t=db(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function pb(i,e){let t;switch(e){case Ff:t="Linear";break;case Bf:t="Reinhard";break;case zf:t="Cineon";break;case jl:t="ACESFilmic";break;case Vf:t="AgX";break;case Gf:t="Neutral";break;case Hf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ya=new k;function mb(){St.getLuminanceCoefficients(Ya);const i=Ya.x.toFixed(4),e=Ya.y.toFixed(4),t=Ya.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function gb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Nr).join(`
`)}function vb(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function _b(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Nr(i){return i!==""}function dd(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function fd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const yb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ll(i){return i.replace(yb,bb)}const xb=new Map;function bb(i,e){let t=ut[e];if(t===void 0){const n=xb.get(e);if(n!==void 0)t=ut[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ll(t)}const Sb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pd(i){return i.replace(Sb,Mb)}function Mb(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function md(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function wb(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Uf?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Nf?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===_i&&(e="SHADOWMAP_TYPE_VSM"),e}function Eb(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case or:case cr:e="ENVMAP_TYPE_CUBE";break;case Ao:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Tb(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case cr:e="ENVMAP_MODE_REFRACTION";break}return e}function Ab(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case kf:e="ENVMAP_BLENDING_MULTIPLY";break;case $g:e="ENVMAP_BLENDING_MIX";break;case Xg:e="ENVMAP_BLENDING_ADD";break}return e}function Rb(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Cb(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=wb(t),h=Eb(t),d=Tb(t),u=Ab(t),m=Rb(t),p=gb(t),y=vb(r),x=s.createProgram();let _,g,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Nr).join(`
`),_.length>0&&(_+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Nr).join(`
`),g.length>0&&(g+=`
`)):(_=[md(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Nr).join(`
`),g=[md(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Wi?"#define TONE_MAPPING":"",t.toneMapping!==Wi?ut.tonemapping_pars_fragment:"",t.toneMapping!==Wi?pb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ut.colorspace_pars_fragment,fb("linearToOutputTexel",t.outputColorSpace),mb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Nr).join(`
`)),a=Ll(a),a=dd(a,t),a=fd(a,t),o=Ll(o),o=dd(o,t),o=fd(o,t),a=pd(a),o=pd(o),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,_=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,g=["#define varying in",t.glslVersion===_u?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===_u?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const C=T+_+a,S=T+g+o,U=ld(s,s.VERTEX_SHADER,C),O=ld(s,s.FRAGMENT_SHADER,S);s.attachShader(x,U),s.attachShader(x,O),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function N(B){if(i.debug.checkShaderErrors){const Z=s.getProgramInfoLog(x)||"",I=s.getShaderInfoLog(U)||"",W=s.getShaderInfoLog(O)||"",H=Z.trim(),z=I.trim(),$=W.trim();let X=!0,de=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,U,O);else{const fe=ud(s,U,"vertex"),Se=ud(s,O,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+H+`
`+fe+`
`+Se)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(z===""||$==="")&&(de=!1);de&&(B.diagnostics={runnable:X,programLog:H,vertexShader:{log:z,prefix:_},fragmentShader:{log:$,prefix:g}})}s.deleteShader(U),s.deleteShader(O),P=new io(s,x),E=_b(s,x)}let P;this.getUniforms=function(){return P===void 0&&N(this),P};let E;this.getAttributes=function(){return E===void 0&&N(this),E};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=s.getProgramParameter(x,lb)),A},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=hb++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=U,this.fragmentShader=O,this}let Pb=0;class Ib{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Db(e),t.set(e,n)),n}}class Db{constructor(e){this.id=Pb++,this.code=e,this.usedTimes=0}}function Lb(i,e,t,n,s,r,a){const o=new sh,c=new Ib,h=new Set,d=[],u=s.logarithmicDepthBuffer,m=s.vertexTextures;let p=s.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(E){return h.add(E),E===0?"uv":`uv${E}`}function _(E,A,B,Z,I){const W=Z.fog,H=I.geometry,z=E.isMeshStandardMaterial?Z.environment:null,$=(E.isMeshStandardMaterial?t:e).get(E.envMap||z),X=$&&$.mapping===Ao?$.image.height:null,de=y[E.type];E.precision!==null&&(p=s.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const fe=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Se=fe!==void 0?fe.length:0;let ke=0;H.morphAttributes.position!==void 0&&(ke=1),H.morphAttributes.normal!==void 0&&(ke=2),H.morphAttributes.color!==void 0&&(ke=3);let lt,mt,pt,ue;if(de){const xt=ei[de];lt=xt.vertexShader,mt=xt.fragmentShader}else lt=E.vertexShader,mt=E.fragmentShader,c.update(E),pt=c.getVertexShaderID(E),ue=c.getFragmentShaderID(E);const pe=i.getRenderTarget(),Ae=i.state.buffers.depth.getReversed(),nt=I.isInstancedMesh===!0,Ge=I.isBatchedMesh===!0,gt=!!E.map,en=!!E.matcap,F=!!$,kt=!!E.aoMap,at=!!E.lightMap,it=!!E.bumpMap,Be=!!E.normalMap,Ot=!!E.displacementMap,ze=!!E.emissiveMap,Qe=!!E.metalnessMap,Ht=!!E.roughnessMap,Vt=E.anisotropy>0,L=E.clearcoat>0,w=E.dispersion>0,ee=E.iridescence>0,le=E.sheen>0,me=E.transmission>0,re=Vt&&!!E.anisotropyMap,je=L&&!!E.clearcoatMap,Me=L&&!!E.clearcoatNormalMap,Xe=L&&!!E.clearcoatRoughnessMap,Ne=ee&&!!E.iridescenceMap,xe=ee&&!!E.iridescenceThicknessMap,Oe=le&&!!E.sheenColorMap,qe=le&&!!E.sheenRoughnessMap,$e=!!E.specularMap,Re=!!E.specularColorMap,et=!!E.specularIntensityMap,V=me&&!!E.transmissionMap,be=me&&!!E.thicknessMap,ye=!!E.gradientMap,Ue=!!E.alphaMap,_e=E.alphaTest>0,oe=!!E.alphaHash,We=!!E.extensions;let st=Wi;E.toneMapped&&(pe===null||pe.isXRRenderTarget===!0)&&(st=i.toneMapping);const Tt={shaderID:de,shaderType:E.type,shaderName:E.name,vertexShader:lt,fragmentShader:mt,defines:E.defines,customVertexShaderID:pt,customFragmentShaderID:ue,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:Ge,batchingColor:Ge&&I._colorsTexture!==null,instancing:nt,instancingColor:nt&&I.instanceColor!==null,instancingMorph:nt&&I.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:pe===null?i.outputColorSpace:pe.isXRRenderTarget===!0?pe.texture.colorSpace:lr,alphaToCoverage:!!E.alphaToCoverage,map:gt,matcap:en,envMap:F,envMapMode:F&&$.mapping,envMapCubeUVHeight:X,aoMap:kt,lightMap:at,bumpMap:it,normalMap:Be,displacementMap:m&&Ot,emissiveMap:ze,normalMapObjectSpace:Be&&E.normalMapType===Kg,normalMapTangentSpace:Be&&E.normalMapType===Qf,metalnessMap:Qe,roughnessMap:Ht,anisotropy:Vt,anisotropyMap:re,clearcoat:L,clearcoatMap:je,clearcoatNormalMap:Me,clearcoatRoughnessMap:Xe,dispersion:w,iridescence:ee,iridescenceMap:Ne,iridescenceThicknessMap:xe,sheen:le,sheenColorMap:Oe,sheenRoughnessMap:qe,specularMap:$e,specularColorMap:Re,specularIntensityMap:et,transmission:me,transmissionMap:V,thicknessMap:be,gradientMap:ye,opaque:E.transparent===!1&&E.blending===tr&&E.alphaToCoverage===!1,alphaMap:Ue,alphaTest:_e,alphaHash:oe,combine:E.combine,mapUv:gt&&x(E.map.channel),aoMapUv:kt&&x(E.aoMap.channel),lightMapUv:at&&x(E.lightMap.channel),bumpMapUv:it&&x(E.bumpMap.channel),normalMapUv:Be&&x(E.normalMap.channel),displacementMapUv:Ot&&x(E.displacementMap.channel),emissiveMapUv:ze&&x(E.emissiveMap.channel),metalnessMapUv:Qe&&x(E.metalnessMap.channel),roughnessMapUv:Ht&&x(E.roughnessMap.channel),anisotropyMapUv:re&&x(E.anisotropyMap.channel),clearcoatMapUv:je&&x(E.clearcoatMap.channel),clearcoatNormalMapUv:Me&&x(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Xe&&x(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Ne&&x(E.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&x(E.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&x(E.sheenColorMap.channel),sheenRoughnessMapUv:qe&&x(E.sheenRoughnessMap.channel),specularMapUv:$e&&x(E.specularMap.channel),specularColorMapUv:Re&&x(E.specularColorMap.channel),specularIntensityMapUv:et&&x(E.specularIntensityMap.channel),transmissionMapUv:V&&x(E.transmissionMap.channel),thicknessMapUv:be&&x(E.thicknessMap.channel),alphaMapUv:Ue&&x(E.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(Be||Vt),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!H.attributes.uv&&(gt||Ue),fog:!!W,useFog:E.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Ae,skinning:I.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Se,morphTextureStride:ke,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&B.length>0,shadowMapType:i.shadowMap.type,toneMapping:st,decodeVideoTexture:gt&&E.map.isVideoTexture===!0&&St.getTransfer(E.map.colorSpace)===Pt,decodeVideoTextureEmissive:ze&&E.emissiveMap.isVideoTexture===!0&&St.getTransfer(E.emissiveMap.colorSpace)===Pt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Pn,flipSided:E.side===Mn,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:We&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(We&&E.extensions.multiDraw===!0||Ge)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Tt.vertexUv1s=h.has(1),Tt.vertexUv2s=h.has(2),Tt.vertexUv3s=h.has(3),h.clear(),Tt}function g(E){const A=[];if(E.shaderID?A.push(E.shaderID):(A.push(E.customVertexShaderID),A.push(E.customFragmentShaderID)),E.defines!==void 0)for(const B in E.defines)A.push(B),A.push(E.defines[B]);return E.isRawShaderMaterial===!1&&(T(A,E),C(A,E),A.push(i.outputColorSpace)),A.push(E.customProgramCacheKey),A.join()}function T(E,A){E.push(A.precision),E.push(A.outputColorSpace),E.push(A.envMapMode),E.push(A.envMapCubeUVHeight),E.push(A.mapUv),E.push(A.alphaMapUv),E.push(A.lightMapUv),E.push(A.aoMapUv),E.push(A.bumpMapUv),E.push(A.normalMapUv),E.push(A.displacementMapUv),E.push(A.emissiveMapUv),E.push(A.metalnessMapUv),E.push(A.roughnessMapUv),E.push(A.anisotropyMapUv),E.push(A.clearcoatMapUv),E.push(A.clearcoatNormalMapUv),E.push(A.clearcoatRoughnessMapUv),E.push(A.iridescenceMapUv),E.push(A.iridescenceThicknessMapUv),E.push(A.sheenColorMapUv),E.push(A.sheenRoughnessMapUv),E.push(A.specularMapUv),E.push(A.specularColorMapUv),E.push(A.specularIntensityMapUv),E.push(A.transmissionMapUv),E.push(A.thicknessMapUv),E.push(A.combine),E.push(A.fogExp2),E.push(A.sizeAttenuation),E.push(A.morphTargetsCount),E.push(A.morphAttributeCount),E.push(A.numDirLights),E.push(A.numPointLights),E.push(A.numSpotLights),E.push(A.numSpotLightMaps),E.push(A.numHemiLights),E.push(A.numRectAreaLights),E.push(A.numDirLightShadows),E.push(A.numPointLightShadows),E.push(A.numSpotLightShadows),E.push(A.numSpotLightShadowsWithMaps),E.push(A.numLightProbes),E.push(A.shadowMapType),E.push(A.toneMapping),E.push(A.numClippingPlanes),E.push(A.numClipIntersection),E.push(A.depthPacking)}function C(E,A){o.disableAll(),A.supportsVertexTextures&&o.enable(0),A.instancing&&o.enable(1),A.instancingColor&&o.enable(2),A.instancingMorph&&o.enable(3),A.matcap&&o.enable(4),A.envMap&&o.enable(5),A.normalMapObjectSpace&&o.enable(6),A.normalMapTangentSpace&&o.enable(7),A.clearcoat&&o.enable(8),A.iridescence&&o.enable(9),A.alphaTest&&o.enable(10),A.vertexColors&&o.enable(11),A.vertexAlphas&&o.enable(12),A.vertexUv1s&&o.enable(13),A.vertexUv2s&&o.enable(14),A.vertexUv3s&&o.enable(15),A.vertexTangents&&o.enable(16),A.anisotropy&&o.enable(17),A.alphaHash&&o.enable(18),A.batching&&o.enable(19),A.dispersion&&o.enable(20),A.batchingColor&&o.enable(21),A.gradientMap&&o.enable(22),E.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),E.push(o.mask)}function S(E){const A=y[E.type];let B;if(A){const Z=ei[A];B=ta.clone(Z.uniforms)}else B=E.uniforms;return B}function U(E,A){let B;for(let Z=0,I=d.length;Z<I;Z++){const W=d[Z];if(W.cacheKey===A){B=W,++B.usedTimes;break}}return B===void 0&&(B=new Cb(i,A,E,r),d.push(B)),B}function O(E){if(--E.usedTimes===0){const A=d.indexOf(E);d[A]=d[d.length-1],d.pop(),E.destroy()}}function N(E){c.remove(E)}function P(){c.dispose()}return{getParameters:_,getProgramCacheKey:g,getUniforms:S,acquireProgram:U,releaseProgram:O,releaseShaderCache:N,programs:d,dispose:P}}function Ob(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Ub(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function gd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function vd(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,m,p,y,x,_){let g=i[e];return g===void 0?(g={id:u.id,object:u,geometry:m,material:p,groupOrder:y,renderOrder:u.renderOrder,z:x,group:_},i[e]=g):(g.id=u.id,g.object=u,g.geometry=m,g.material=p,g.groupOrder=y,g.renderOrder=u.renderOrder,g.z=x,g.group=_),e++,g}function o(u,m,p,y,x,_){const g=a(u,m,p,y,x,_);p.transmission>0?n.push(g):p.transparent===!0?s.push(g):t.push(g)}function c(u,m,p,y,x,_){const g=a(u,m,p,y,x,_);p.transmission>0?n.unshift(g):p.transparent===!0?s.unshift(g):t.unshift(g)}function h(u,m){t.length>1&&t.sort(u||Ub),n.length>1&&n.sort(m||gd),s.length>1&&s.sort(m||gd)}function d(){for(let u=e,m=i.length;u<m;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:h}}function Nb(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new vd,i.set(n,[a])):s>=r.length?(a=new vd,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function kb(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new k,color:new Ze};break;case"SpotLight":t={position:new k,direction:new k,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new k,halfWidth:new k,halfHeight:new k};break}return i[e.id]=t,t}}}function Fb(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Bb=0;function zb(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Hb(i){const e=new kb,t=Fb(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new k);const s=new k,r=new zt,a=new zt;function o(h){let d=0,u=0,m=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let p=0,y=0,x=0,_=0,g=0,T=0,C=0,S=0,U=0,O=0,N=0;h.sort(zb);for(let E=0,A=h.length;E<A;E++){const B=h[E],Z=B.color,I=B.intensity,W=B.distance,H=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)d+=Z.r*I,u+=Z.g*I,m+=Z.b*I;else if(B.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(B.sh.coefficients[z],I);N++}else if(B.isDirectionalLight){const z=e.get(B);if(z.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const $=B.shadow,X=t.get(B);X.shadowIntensity=$.intensity,X.shadowBias=$.bias,X.shadowNormalBias=$.normalBias,X.shadowRadius=$.radius,X.shadowMapSize=$.mapSize,n.directionalShadow[p]=X,n.directionalShadowMap[p]=H,n.directionalShadowMatrix[p]=B.shadow.matrix,T++}n.directional[p]=z,p++}else if(B.isSpotLight){const z=e.get(B);z.position.setFromMatrixPosition(B.matrixWorld),z.color.copy(Z).multiplyScalar(I),z.distance=W,z.coneCos=Math.cos(B.angle),z.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),z.decay=B.decay,n.spot[x]=z;const $=B.shadow;if(B.map&&(n.spotLightMap[U]=B.map,U++,$.updateMatrices(B),B.castShadow&&O++),n.spotLightMatrix[x]=$.matrix,B.castShadow){const X=t.get(B);X.shadowIntensity=$.intensity,X.shadowBias=$.bias,X.shadowNormalBias=$.normalBias,X.shadowRadius=$.radius,X.shadowMapSize=$.mapSize,n.spotShadow[x]=X,n.spotShadowMap[x]=H,S++}x++}else if(B.isRectAreaLight){const z=e.get(B);z.color.copy(Z).multiplyScalar(I),z.halfWidth.set(B.width*.5,0,0),z.halfHeight.set(0,B.height*.5,0),n.rectArea[_]=z,_++}else if(B.isPointLight){const z=e.get(B);if(z.color.copy(B.color).multiplyScalar(B.intensity),z.distance=B.distance,z.decay=B.decay,B.castShadow){const $=B.shadow,X=t.get(B);X.shadowIntensity=$.intensity,X.shadowBias=$.bias,X.shadowNormalBias=$.normalBias,X.shadowRadius=$.radius,X.shadowMapSize=$.mapSize,X.shadowCameraNear=$.camera.near,X.shadowCameraFar=$.camera.far,n.pointShadow[y]=X,n.pointShadowMap[y]=H,n.pointShadowMatrix[y]=B.shadow.matrix,C++}n.point[y]=z,y++}else if(B.isHemisphereLight){const z=e.get(B);z.skyColor.copy(B.color).multiplyScalar(I),z.groundColor.copy(B.groundColor).multiplyScalar(I),n.hemi[g]=z,g++}}_>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ce.LTC_FLOAT_1,n.rectAreaLTC2=Ce.LTC_FLOAT_2):(n.rectAreaLTC1=Ce.LTC_HALF_1,n.rectAreaLTC2=Ce.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=m;const P=n.hash;(P.directionalLength!==p||P.pointLength!==y||P.spotLength!==x||P.rectAreaLength!==_||P.hemiLength!==g||P.numDirectionalShadows!==T||P.numPointShadows!==C||P.numSpotShadows!==S||P.numSpotMaps!==U||P.numLightProbes!==N)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=_,n.point.length=y,n.hemi.length=g,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=C,n.pointShadowMap.length=C,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=C,n.spotLightMatrix.length=S+U-O,n.spotLightMap.length=U,n.numSpotLightShadowsWithMaps=O,n.numLightProbes=N,P.directionalLength=p,P.pointLength=y,P.spotLength=x,P.rectAreaLength=_,P.hemiLength=g,P.numDirectionalShadows=T,P.numPointShadows=C,P.numSpotShadows=S,P.numSpotMaps=U,P.numLightProbes=N,n.version=Bb++)}function c(h,d){let u=0,m=0,p=0,y=0,x=0;const _=d.matrixWorldInverse;for(let g=0,T=h.length;g<T;g++){const C=h[g];if(C.isDirectionalLight){const S=n.directional[u];S.direction.setFromMatrixPosition(C.matrixWorld),s.setFromMatrixPosition(C.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(_),u++}else if(C.isSpotLight){const S=n.spot[p];S.position.setFromMatrixPosition(C.matrixWorld),S.position.applyMatrix4(_),S.direction.setFromMatrixPosition(C.matrixWorld),s.setFromMatrixPosition(C.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(_),p++}else if(C.isRectAreaLight){const S=n.rectArea[y];S.position.setFromMatrixPosition(C.matrixWorld),S.position.applyMatrix4(_),a.identity(),r.copy(C.matrixWorld),r.premultiply(_),a.extractRotation(r),S.halfWidth.set(C.width*.5,0,0),S.halfHeight.set(0,C.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),y++}else if(C.isPointLight){const S=n.point[m];S.position.setFromMatrixPosition(C.matrixWorld),S.position.applyMatrix4(_),m++}else if(C.isHemisphereLight){const S=n.hemi[x];S.direction.setFromMatrixPosition(C.matrixWorld),S.direction.transformDirection(_),x++}}}return{setup:o,setupView:c,state:n}}function _d(i){const e=new Hb(i),t=[],n=[];function s(d){h.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Vb(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new _d(i),e.set(s,[o])):r>=a.length?(o=new _d(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Gb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wb=`uniform sampler2D shadow_pass;
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
}`;function $b(i,e,t){let n=new ah;const s=new Te,r=new Te,a=new Lt,o=new pv({depthPacking:Yg}),c=new mv,h={},d=t.maxTextureSize,u={[Xi]:Mn,[Mn]:Xi,[Pn]:Pn},m=new _n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:Gb,fragmentShader:Wb}),p=m.clone();p.defines.HORIZONTAL_PASS=1;const y=new qt;y.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Et(y,m),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Uf;let g=this.type;this.render=function(O,N,P){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||O.length===0)return;const E=i.getRenderTarget(),A=i.getActiveCubeFace(),B=i.getActiveMipmapLevel(),Z=i.state;Z.setBlending(Mi),Z.buffers.depth.getReversed()===!0?Z.buffers.color.setClear(0,0,0,0):Z.buffers.color.setClear(1,1,1,1),Z.buffers.depth.setTest(!0),Z.setScissorTest(!1);const I=g!==_i&&this.type===_i,W=g===_i&&this.type!==_i;for(let H=0,z=O.length;H<z;H++){const $=O[H],X=$.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const de=X.getFrameExtents();if(s.multiply(de),r.copy(X.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/de.x),s.x=r.x*de.x,X.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/de.y),s.y=r.y*de.y,X.mapSize.y=r.y)),X.map===null||I===!0||W===!0){const Se=this.type!==_i?{minFilter:Xn,magFilter:Xn}:{};X.map!==null&&X.map.dispose(),X.map=new qn(s.x,s.y,Se),X.map.texture.name=$.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const fe=X.getViewportCount();for(let Se=0;Se<fe;Se++){const ke=X.getViewport(Se);a.set(r.x*ke.x,r.y*ke.y,r.x*ke.z,r.y*ke.w),Z.viewport(a),X.updateMatrices($,Se),n=X.getFrustum(),S(N,P,X.camera,$,this.type)}X.isPointLightShadow!==!0&&this.type===_i&&T(X,P),X.needsUpdate=!1}g=this.type,_.needsUpdate=!1,i.setRenderTarget(E,A,B)};function T(O,N){const P=e.update(x);m.defines.VSM_SAMPLES!==O.blurSamples&&(m.defines.VSM_SAMPLES=O.blurSamples,p.defines.VSM_SAMPLES=O.blurSamples,m.needsUpdate=!0,p.needsUpdate=!0),O.mapPass===null&&(O.mapPass=new qn(s.x,s.y)),m.uniforms.shadow_pass.value=O.map.texture,m.uniforms.resolution.value=O.mapSize,m.uniforms.radius.value=O.radius,i.setRenderTarget(O.mapPass),i.clear(),i.renderBufferDirect(N,null,P,m,x,null),p.uniforms.shadow_pass.value=O.mapPass.texture,p.uniforms.resolution.value=O.mapSize,p.uniforms.radius.value=O.radius,i.setRenderTarget(O.map),i.clear(),i.renderBufferDirect(N,null,P,p,x,null)}function C(O,N,P,E){let A=null;const B=P.isPointLight===!0?O.customDistanceMaterial:O.customDepthMaterial;if(B!==void 0)A=B;else if(A=P.isPointLight===!0?c:o,i.localClippingEnabled&&N.clipShadows===!0&&Array.isArray(N.clippingPlanes)&&N.clippingPlanes.length!==0||N.displacementMap&&N.displacementScale!==0||N.alphaMap&&N.alphaTest>0||N.map&&N.alphaTest>0||N.alphaToCoverage===!0){const Z=A.uuid,I=N.uuid;let W=h[Z];W===void 0&&(W={},h[Z]=W);let H=W[I];H===void 0&&(H=A.clone(),W[I]=H,N.addEventListener("dispose",U)),A=H}if(A.visible=N.visible,A.wireframe=N.wireframe,E===_i?A.side=N.shadowSide!==null?N.shadowSide:N.side:A.side=N.shadowSide!==null?N.shadowSide:u[N.side],A.alphaMap=N.alphaMap,A.alphaTest=N.alphaToCoverage===!0?.5:N.alphaTest,A.map=N.map,A.clipShadows=N.clipShadows,A.clippingPlanes=N.clippingPlanes,A.clipIntersection=N.clipIntersection,A.displacementMap=N.displacementMap,A.displacementScale=N.displacementScale,A.displacementBias=N.displacementBias,A.wireframeLinewidth=N.wireframeLinewidth,A.linewidth=N.linewidth,P.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const Z=i.properties.get(A);Z.light=P}return A}function S(O,N,P,E,A){if(O.visible===!1)return;if(O.layers.test(N.layers)&&(O.isMesh||O.isLine||O.isPoints)&&(O.castShadow||O.receiveShadow&&A===_i)&&(!O.frustumCulled||n.intersectsObject(O))){O.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,O.matrixWorld);const I=e.update(O),W=O.material;if(Array.isArray(W)){const H=I.groups;for(let z=0,$=H.length;z<$;z++){const X=H[z],de=W[X.materialIndex];if(de&&de.visible){const fe=C(O,de,E,A);O.onBeforeShadow(i,O,N,P,I,fe,X),i.renderBufferDirect(P,null,I,fe,O,X),O.onAfterShadow(i,O,N,P,I,fe,X)}}}else if(W.visible){const H=C(O,W,E,A);O.onBeforeShadow(i,O,N,P,I,H,null),i.renderBufferDirect(P,null,I,H,O,null),O.onAfterShadow(i,O,N,P,I,H,null)}}const Z=O.children;for(let I=0,W=Z.length;I<W;I++)S(Z[I],N,P,E,A)}function U(O){O.target.removeEventListener("dispose",U);for(const P in h){const E=h[P],A=O.target.uuid;A in E&&(E[A].dispose(),delete E[A])}}}const Xb={[Wc]:$c,[Xc]:Yc,[qc]:Kc,[ar]:jc,[$c]:Wc,[Yc]:Xc,[Kc]:qc,[jc]:ar};function qb(i,e){function t(){let V=!1;const be=new Lt;let ye=null;const Ue=new Lt(0,0,0,0);return{setMask:function(_e){ye!==_e&&!V&&(i.colorMask(_e,_e,_e,_e),ye=_e)},setLocked:function(_e){V=_e},setClear:function(_e,oe,We,st,Tt){Tt===!0&&(_e*=st,oe*=st,We*=st),be.set(_e,oe,We,st),Ue.equals(be)===!1&&(i.clearColor(_e,oe,We,st),Ue.copy(be))},reset:function(){V=!1,ye=null,Ue.set(-1,0,0,0)}}}function n(){let V=!1,be=!1,ye=null,Ue=null,_e=null;return{setReversed:function(oe){if(be!==oe){const We=e.get("EXT_clip_control");oe?We.clipControlEXT(We.LOWER_LEFT_EXT,We.ZERO_TO_ONE_EXT):We.clipControlEXT(We.LOWER_LEFT_EXT,We.NEGATIVE_ONE_TO_ONE_EXT),be=oe;const st=_e;_e=null,this.setClear(st)}},getReversed:function(){return be},setTest:function(oe){oe?pe(i.DEPTH_TEST):Ae(i.DEPTH_TEST)},setMask:function(oe){ye!==oe&&!V&&(i.depthMask(oe),ye=oe)},setFunc:function(oe){if(be&&(oe=Xb[oe]),Ue!==oe){switch(oe){case Wc:i.depthFunc(i.NEVER);break;case $c:i.depthFunc(i.ALWAYS);break;case Xc:i.depthFunc(i.LESS);break;case ar:i.depthFunc(i.LEQUAL);break;case qc:i.depthFunc(i.EQUAL);break;case jc:i.depthFunc(i.GEQUAL);break;case Yc:i.depthFunc(i.GREATER);break;case Kc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ue=oe}},setLocked:function(oe){V=oe},setClear:function(oe){_e!==oe&&(be&&(oe=1-oe),i.clearDepth(oe),_e=oe)},reset:function(){V=!1,ye=null,Ue=null,_e=null,be=!1}}}function s(){let V=!1,be=null,ye=null,Ue=null,_e=null,oe=null,We=null,st=null,Tt=null;return{setTest:function(xt){V||(xt?pe(i.STENCIL_TEST):Ae(i.STENCIL_TEST))},setMask:function(xt){be!==xt&&!V&&(i.stencilMask(xt),be=xt)},setFunc:function(xt,xn,En){(ye!==xt||Ue!==xn||_e!==En)&&(i.stencilFunc(xt,xn,En),ye=xt,Ue=xn,_e=En)},setOp:function(xt,xn,En){(oe!==xt||We!==xn||st!==En)&&(i.stencilOp(xt,xn,En),oe=xt,We=xn,st=En)},setLocked:function(xt){V=xt},setClear:function(xt){Tt!==xt&&(i.clearStencil(xt),Tt=xt)},reset:function(){V=!1,be=null,ye=null,Ue=null,_e=null,oe=null,We=null,st=null,Tt=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,h=new WeakMap;let d={},u={},m=new WeakMap,p=[],y=null,x=!1,_=null,g=null,T=null,C=null,S=null,U=null,O=null,N=new Ze(0,0,0),P=0,E=!1,A=null,B=null,Z=null,I=null,W=null;const H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,$=0;const X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(X)[1]),z=$>=1):X.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),z=$>=2);let de=null,fe={};const Se=i.getParameter(i.SCISSOR_BOX),ke=i.getParameter(i.VIEWPORT),lt=new Lt().fromArray(Se),mt=new Lt().fromArray(ke);function pt(V,be,ye,Ue){const _e=new Uint8Array(4),oe=i.createTexture();i.bindTexture(V,oe),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let We=0;We<ye;We++)V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?i.texImage3D(be,0,i.RGBA,1,1,Ue,0,i.RGBA,i.UNSIGNED_BYTE,_e):i.texImage2D(be+We,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_e);return oe}const ue={};ue[i.TEXTURE_2D]=pt(i.TEXTURE_2D,i.TEXTURE_2D,1),ue[i.TEXTURE_CUBE_MAP]=pt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[i.TEXTURE_2D_ARRAY]=pt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ue[i.TEXTURE_3D]=pt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),pe(i.DEPTH_TEST),a.setFunc(ar),it(!1),Be(pu),pe(i.CULL_FACE),kt(Mi);function pe(V){d[V]!==!0&&(i.enable(V),d[V]=!0)}function Ae(V){d[V]!==!1&&(i.disable(V),d[V]=!1)}function nt(V,be){return u[V]!==be?(i.bindFramebuffer(V,be),u[V]=be,V===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=be),V===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=be),!0):!1}function Ge(V,be){let ye=p,Ue=!1;if(V){ye=m.get(be),ye===void 0&&(ye=[],m.set(be,ye));const _e=V.textures;if(ye.length!==_e.length||ye[0]!==i.COLOR_ATTACHMENT0){for(let oe=0,We=_e.length;oe<We;oe++)ye[oe]=i.COLOR_ATTACHMENT0+oe;ye.length=_e.length,Ue=!0}}else ye[0]!==i.BACK&&(ye[0]=i.BACK,Ue=!0);Ue&&i.drawBuffers(ye)}function gt(V){return y!==V?(i.useProgram(V),y=V,!0):!1}const en={[us]:i.FUNC_ADD,[Rg]:i.FUNC_SUBTRACT,[Cg]:i.FUNC_REVERSE_SUBTRACT};en[Pg]=i.MIN,en[Ig]=i.MAX;const F={[Dg]:i.ZERO,[Lg]:i.ONE,[Og]:i.SRC_COLOR,[Vc]:i.SRC_ALPHA,[zg]:i.SRC_ALPHA_SATURATE,[Fg]:i.DST_COLOR,[Ng]:i.DST_ALPHA,[Ug]:i.ONE_MINUS_SRC_COLOR,[Gc]:i.ONE_MINUS_SRC_ALPHA,[Bg]:i.ONE_MINUS_DST_COLOR,[kg]:i.ONE_MINUS_DST_ALPHA,[Hg]:i.CONSTANT_COLOR,[Vg]:i.ONE_MINUS_CONSTANT_COLOR,[Gg]:i.CONSTANT_ALPHA,[Wg]:i.ONE_MINUS_CONSTANT_ALPHA};function kt(V,be,ye,Ue,_e,oe,We,st,Tt,xt){if(V===Mi){x===!0&&(Ae(i.BLEND),x=!1);return}if(x===!1&&(pe(i.BLEND),x=!0),V!==Ag){if(V!==_||xt!==E){if((g!==us||S!==us)&&(i.blendEquation(i.FUNC_ADD),g=us,S=us),xt)switch(V){case tr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case rr:i.blendFunc(i.ONE,i.ONE);break;case mu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case gu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case tr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case rr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case mu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case gu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}T=null,C=null,U=null,O=null,N.set(0,0,0),P=0,_=V,E=xt}return}_e=_e||be,oe=oe||ye,We=We||Ue,(be!==g||_e!==S)&&(i.blendEquationSeparate(en[be],en[_e]),g=be,S=_e),(ye!==T||Ue!==C||oe!==U||We!==O)&&(i.blendFuncSeparate(F[ye],F[Ue],F[oe],F[We]),T=ye,C=Ue,U=oe,O=We),(st.equals(N)===!1||Tt!==P)&&(i.blendColor(st.r,st.g,st.b,Tt),N.copy(st),P=Tt),_=V,E=!1}function at(V,be){V.side===Pn?Ae(i.CULL_FACE):pe(i.CULL_FACE);let ye=V.side===Mn;be&&(ye=!ye),it(ye),V.blending===tr&&V.transparent===!1?kt(Mi):kt(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),a.setFunc(V.depthFunc),a.setTest(V.depthTest),a.setMask(V.depthWrite),r.setMask(V.colorWrite);const Ue=V.stencilWrite;o.setTest(Ue),Ue&&(o.setMask(V.stencilWriteMask),o.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),o.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),ze(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?pe(i.SAMPLE_ALPHA_TO_COVERAGE):Ae(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(V){A!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),A=V)}function Be(V){V!==Eg?(pe(i.CULL_FACE),V!==B&&(V===pu?i.cullFace(i.BACK):V===Tg?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ae(i.CULL_FACE),B=V}function Ot(V){V!==Z&&(z&&i.lineWidth(V),Z=V)}function ze(V,be,ye){V?(pe(i.POLYGON_OFFSET_FILL),(I!==be||W!==ye)&&(i.polygonOffset(be,ye),I=be,W=ye)):Ae(i.POLYGON_OFFSET_FILL)}function Qe(V){V?pe(i.SCISSOR_TEST):Ae(i.SCISSOR_TEST)}function Ht(V){V===void 0&&(V=i.TEXTURE0+H-1),de!==V&&(i.activeTexture(V),de=V)}function Vt(V,be,ye){ye===void 0&&(de===null?ye=i.TEXTURE0+H-1:ye=de);let Ue=fe[ye];Ue===void 0&&(Ue={type:void 0,texture:void 0},fe[ye]=Ue),(Ue.type!==V||Ue.texture!==be)&&(de!==ye&&(i.activeTexture(ye),de=ye),i.bindTexture(V,be||ue[V]),Ue.type=V,Ue.texture=be)}function L(){const V=fe[de];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function w(){try{i.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ee(){try{i.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function le(){try{i.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function me(){try{i.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function re(){try{i.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function je(){try{i.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Me(){try{i.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Xe(){try{i.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ne(){try{i.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function xe(){try{i.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Oe(V){lt.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),lt.copy(V))}function qe(V){mt.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),mt.copy(V))}function $e(V,be){let ye=h.get(be);ye===void 0&&(ye=new WeakMap,h.set(be,ye));let Ue=ye.get(V);Ue===void 0&&(Ue=i.getUniformBlockIndex(be,V.name),ye.set(V,Ue))}function Re(V,be){const Ue=h.get(be).get(V);c.get(be)!==Ue&&(i.uniformBlockBinding(be,Ue,V.__bindingPointIndex),c.set(be,Ue))}function et(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},de=null,fe={},u={},m=new WeakMap,p=[],y=null,x=!1,_=null,g=null,T=null,C=null,S=null,U=null,O=null,N=new Ze(0,0,0),P=0,E=!1,A=null,B=null,Z=null,I=null,W=null,lt.set(0,0,i.canvas.width,i.canvas.height),mt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:pe,disable:Ae,bindFramebuffer:nt,drawBuffers:Ge,useProgram:gt,setBlending:kt,setMaterial:at,setFlipSided:it,setCullFace:Be,setLineWidth:Ot,setPolygonOffset:ze,setScissorTest:Qe,activeTexture:Ht,bindTexture:Vt,unbindTexture:L,compressedTexImage2D:w,compressedTexImage3D:ee,texImage2D:Ne,texImage3D:xe,updateUBOMapping:$e,uniformBlockBinding:Re,texStorage2D:Me,texStorage3D:Xe,texSubImage2D:le,texSubImage3D:me,compressedTexSubImage2D:re,compressedTexSubImage3D:je,scissor:Oe,viewport:qe,reset:et}}function jb(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Te,d=new WeakMap;let u;const m=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(L,w){return p?new OffscreenCanvas(L,w):go("canvas")}function x(L,w,ee){let le=1;const me=Vt(L);if((me.width>ee||me.height>ee)&&(le=ee/Math.max(me.width,me.height)),le<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const re=Math.floor(le*me.width),je=Math.floor(le*me.height);u===void 0&&(u=y(re,je));const Me=w?y(re,je):u;return Me.width=re,Me.height=je,Me.getContext("2d").drawImage(L,0,0,re,je),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+me.width+"x"+me.height+") to ("+re+"x"+je+")."),Me}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+me.width+"x"+me.height+")."),L;return L}function _(L){return L.generateMipmaps}function g(L){i.generateMipmap(L)}function T(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function C(L,w,ee,le,me=!1){if(L!==null){if(i[L]!==void 0)return i[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let re=w;if(w===i.RED&&(ee===i.FLOAT&&(re=i.R32F),ee===i.HALF_FLOAT&&(re=i.R16F),ee===i.UNSIGNED_BYTE&&(re=i.R8)),w===i.RED_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.R8UI),ee===i.UNSIGNED_SHORT&&(re=i.R16UI),ee===i.UNSIGNED_INT&&(re=i.R32UI),ee===i.BYTE&&(re=i.R8I),ee===i.SHORT&&(re=i.R16I),ee===i.INT&&(re=i.R32I)),w===i.RG&&(ee===i.FLOAT&&(re=i.RG32F),ee===i.HALF_FLOAT&&(re=i.RG16F),ee===i.UNSIGNED_BYTE&&(re=i.RG8)),w===i.RG_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.RG8UI),ee===i.UNSIGNED_SHORT&&(re=i.RG16UI),ee===i.UNSIGNED_INT&&(re=i.RG32UI),ee===i.BYTE&&(re=i.RG8I),ee===i.SHORT&&(re=i.RG16I),ee===i.INT&&(re=i.RG32I)),w===i.RGB_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.RGB8UI),ee===i.UNSIGNED_SHORT&&(re=i.RGB16UI),ee===i.UNSIGNED_INT&&(re=i.RGB32UI),ee===i.BYTE&&(re=i.RGB8I),ee===i.SHORT&&(re=i.RGB16I),ee===i.INT&&(re=i.RGB32I)),w===i.RGBA_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.RGBA8UI),ee===i.UNSIGNED_SHORT&&(re=i.RGBA16UI),ee===i.UNSIGNED_INT&&(re=i.RGBA32UI),ee===i.BYTE&&(re=i.RGBA8I),ee===i.SHORT&&(re=i.RGBA16I),ee===i.INT&&(re=i.RGBA32I)),w===i.RGB&&(ee===i.UNSIGNED_INT_5_9_9_9_REV&&(re=i.RGB9_E5),ee===i.UNSIGNED_INT_10F_11F_11F_REV&&(re=i.R11F_G11F_B10F)),w===i.RGBA){const je=me?po:St.getTransfer(le);ee===i.FLOAT&&(re=i.RGBA32F),ee===i.HALF_FLOAT&&(re=i.RGBA16F),ee===i.UNSIGNED_BYTE&&(re=je===Pt?i.SRGB8_ALPHA8:i.RGBA8),ee===i.UNSIGNED_SHORT_4_4_4_4&&(re=i.RGBA4),ee===i.UNSIGNED_SHORT_5_5_5_1&&(re=i.RGB5_A1)}return(re===i.R16F||re===i.R32F||re===i.RG16F||re===i.RG32F||re===i.RGBA16F||re===i.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function S(L,w){let ee;return L?w===null||w===ys||w===Kr?ee=i.DEPTH24_STENCIL8:w===bi?ee=i.DEPTH32F_STENCIL8:w===Yr&&(ee=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===ys||w===Kr?ee=i.DEPTH_COMPONENT24:w===bi?ee=i.DEPTH_COMPONENT32F:w===Yr&&(ee=i.DEPTH_COMPONENT16),ee}function U(L,w){return _(L)===!0||L.isFramebufferTexture&&L.minFilter!==Xn&&L.minFilter!==ii?Math.log2(Math.max(w.width,w.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?w.mipmaps.length:1}function O(L){const w=L.target;w.removeEventListener("dispose",O),P(w),w.isVideoTexture&&d.delete(w)}function N(L){const w=L.target;w.removeEventListener("dispose",N),A(w)}function P(L){const w=n.get(L);if(w.__webglInit===void 0)return;const ee=L.source,le=m.get(ee);if(le){const me=le[w.__cacheKey];me.usedTimes--,me.usedTimes===0&&E(L),Object.keys(le).length===0&&m.delete(ee)}n.remove(L)}function E(L){const w=n.get(L);i.deleteTexture(w.__webglTexture);const ee=L.source,le=m.get(ee);delete le[w.__cacheKey],a.memory.textures--}function A(L){const w=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let le=0;le<6;le++){if(Array.isArray(w.__webglFramebuffer[le]))for(let me=0;me<w.__webglFramebuffer[le].length;me++)i.deleteFramebuffer(w.__webglFramebuffer[le][me]);else i.deleteFramebuffer(w.__webglFramebuffer[le]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[le])}else{if(Array.isArray(w.__webglFramebuffer))for(let le=0;le<w.__webglFramebuffer.length;le++)i.deleteFramebuffer(w.__webglFramebuffer[le]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let le=0;le<w.__webglColorRenderbuffer.length;le++)w.__webglColorRenderbuffer[le]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[le]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const ee=L.textures;for(let le=0,me=ee.length;le<me;le++){const re=n.get(ee[le]);re.__webglTexture&&(i.deleteTexture(re.__webglTexture),a.memory.textures--),n.remove(ee[le])}n.remove(L)}let B=0;function Z(){B=0}function I(){const L=B;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),B+=1,L}function W(L){const w=[];return w.push(L.wrapS),w.push(L.wrapT),w.push(L.wrapR||0),w.push(L.magFilter),w.push(L.minFilter),w.push(L.anisotropy),w.push(L.internalFormat),w.push(L.format),w.push(L.type),w.push(L.generateMipmaps),w.push(L.premultiplyAlpha),w.push(L.flipY),w.push(L.unpackAlignment),w.push(L.colorSpace),w.join()}function H(L,w){const ee=n.get(L);if(L.isVideoTexture&&Qe(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&ee.__version!==L.version){const le=L.image;if(le===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ue(ee,L,w);return}}else L.isExternalTexture&&(ee.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,ee.__webglTexture,i.TEXTURE0+w)}function z(L,w){const ee=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&ee.__version!==L.version){ue(ee,L,w);return}t.bindTexture(i.TEXTURE_2D_ARRAY,ee.__webglTexture,i.TEXTURE0+w)}function $(L,w){const ee=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&ee.__version!==L.version){ue(ee,L,w);return}t.bindTexture(i.TEXTURE_3D,ee.__webglTexture,i.TEXTURE0+w)}function X(L,w){const ee=n.get(L);if(L.version>0&&ee.__version!==L.version){pe(ee,L,w);return}t.bindTexture(i.TEXTURE_CUBE_MAP,ee.__webglTexture,i.TEXTURE0+w)}const de={[Qc]:i.REPEAT,[ps]:i.CLAMP_TO_EDGE,[el]:i.MIRRORED_REPEAT},fe={[Xn]:i.NEAREST,[qg]:i.NEAREST_MIPMAP_NEAREST,[Ma]:i.NEAREST_MIPMAP_LINEAR,[ii]:i.LINEAR,[Ko]:i.LINEAR_MIPMAP_NEAREST,[ms]:i.LINEAR_MIPMAP_LINEAR},Se={[Jg]:i.NEVER,[i0]:i.ALWAYS,[Zg]:i.LESS,[ep]:i.LEQUAL,[Qg]:i.EQUAL,[n0]:i.GEQUAL,[e0]:i.GREATER,[t0]:i.NOTEQUAL};function ke(L,w){if(w.type===bi&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===ii||w.magFilter===Ko||w.magFilter===Ma||w.magFilter===ms||w.minFilter===ii||w.minFilter===Ko||w.minFilter===Ma||w.minFilter===ms)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,de[w.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,de[w.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,de[w.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,fe[w.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,fe[w.minFilter]),w.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,Se[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Xn||w.minFilter!==Ma&&w.minFilter!==ms||w.type===bi&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const ee=e.get("EXT_texture_filter_anisotropic");i.texParameterf(L,ee.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function lt(L,w){let ee=!1;L.__webglInit===void 0&&(L.__webglInit=!0,w.addEventListener("dispose",O));const le=w.source;let me=m.get(le);me===void 0&&(me={},m.set(le,me));const re=W(w);if(re!==L.__cacheKey){me[re]===void 0&&(me[re]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,ee=!0),me[re].usedTimes++;const je=me[L.__cacheKey];je!==void 0&&(me[L.__cacheKey].usedTimes--,je.usedTimes===0&&E(w)),L.__cacheKey=re,L.__webglTexture=me[re].texture}return ee}function mt(L,w,ee){return Math.floor(Math.floor(L/ee)/w)}function pt(L,w,ee,le){const re=L.updateRanges;if(re.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,ee,le,w.data);else{re.sort((xe,Oe)=>xe.start-Oe.start);let je=0;for(let xe=1;xe<re.length;xe++){const Oe=re[je],qe=re[xe],$e=Oe.start+Oe.count,Re=mt(qe.start,w.width,4),et=mt(Oe.start,w.width,4);qe.start<=$e+1&&Re===et&&mt(qe.start+qe.count-1,w.width,4)===Re?Oe.count=Math.max(Oe.count,qe.start+qe.count-Oe.start):(++je,re[je]=qe)}re.length=je+1;const Me=i.getParameter(i.UNPACK_ROW_LENGTH),Xe=i.getParameter(i.UNPACK_SKIP_PIXELS),Ne=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let xe=0,Oe=re.length;xe<Oe;xe++){const qe=re[xe],$e=Math.floor(qe.start/4),Re=Math.ceil(qe.count/4),et=$e%w.width,V=Math.floor($e/w.width),be=Re,ye=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,et),i.pixelStorei(i.UNPACK_SKIP_ROWS,V),t.texSubImage2D(i.TEXTURE_2D,0,et,V,be,ye,ee,le,w.data)}L.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Me),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ne)}}function ue(L,w,ee){let le=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(le=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(le=i.TEXTURE_3D);const me=lt(L,w),re=w.source;t.bindTexture(le,L.__webglTexture,i.TEXTURE0+ee);const je=n.get(re);if(re.version!==je.__version||me===!0){t.activeTexture(i.TEXTURE0+ee);const Me=St.getPrimaries(St.workingColorSpace),Xe=w.colorSpace===ki?null:St.getPrimaries(w.colorSpace),Ne=w.colorSpace===ki||Me===Xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);let xe=x(w.image,!1,s.maxTextureSize);xe=Ht(w,xe);const Oe=r.convert(w.format,w.colorSpace),qe=r.convert(w.type);let $e=C(w.internalFormat,Oe,qe,w.colorSpace,w.isVideoTexture);ke(le,w);let Re;const et=w.mipmaps,V=w.isVideoTexture!==!0,be=je.__version===void 0||me===!0,ye=re.dataReady,Ue=U(w,xe);if(w.isDepthTexture)$e=S(w.format===Zr,w.type),be&&(V?t.texStorage2D(i.TEXTURE_2D,1,$e,xe.width,xe.height):t.texImage2D(i.TEXTURE_2D,0,$e,xe.width,xe.height,0,Oe,qe,null));else if(w.isDataTexture)if(et.length>0){V&&be&&t.texStorage2D(i.TEXTURE_2D,Ue,$e,et[0].width,et[0].height);for(let _e=0,oe=et.length;_e<oe;_e++)Re=et[_e],V?ye&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,Re.width,Re.height,Oe,qe,Re.data):t.texImage2D(i.TEXTURE_2D,_e,$e,Re.width,Re.height,0,Oe,qe,Re.data);w.generateMipmaps=!1}else V?(be&&t.texStorage2D(i.TEXTURE_2D,Ue,$e,xe.width,xe.height),ye&&pt(w,xe,Oe,qe)):t.texImage2D(i.TEXTURE_2D,0,$e,xe.width,xe.height,0,Oe,qe,xe.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){V&&be&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ue,$e,et[0].width,et[0].height,xe.depth);for(let _e=0,oe=et.length;_e<oe;_e++)if(Re=et[_e],w.format!==$n)if(Oe!==null)if(V){if(ye)if(w.layerUpdates.size>0){const We=ju(Re.width,Re.height,w.format,w.type);for(const st of w.layerUpdates){const Tt=Re.data.subarray(st*We/Re.data.BYTES_PER_ELEMENT,(st+1)*We/Re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,st,Re.width,Re.height,1,Oe,Tt)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,0,Re.width,Re.height,xe.depth,Oe,Re.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,_e,$e,Re.width,Re.height,xe.depth,0,Re.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?ye&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,0,Re.width,Re.height,xe.depth,Oe,qe,Re.data):t.texImage3D(i.TEXTURE_2D_ARRAY,_e,$e,Re.width,Re.height,xe.depth,0,Oe,qe,Re.data)}else{V&&be&&t.texStorage2D(i.TEXTURE_2D,Ue,$e,et[0].width,et[0].height);for(let _e=0,oe=et.length;_e<oe;_e++)Re=et[_e],w.format!==$n?Oe!==null?V?ye&&t.compressedTexSubImage2D(i.TEXTURE_2D,_e,0,0,Re.width,Re.height,Oe,Re.data):t.compressedTexImage2D(i.TEXTURE_2D,_e,$e,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?ye&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,Re.width,Re.height,Oe,qe,Re.data):t.texImage2D(i.TEXTURE_2D,_e,$e,Re.width,Re.height,0,Oe,qe,Re.data)}else if(w.isDataArrayTexture)if(V){if(be&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ue,$e,xe.width,xe.height,xe.depth),ye)if(w.layerUpdates.size>0){const _e=ju(xe.width,xe.height,w.format,w.type);for(const oe of w.layerUpdates){const We=xe.data.subarray(oe*_e/xe.data.BYTES_PER_ELEMENT,(oe+1)*_e/xe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,oe,xe.width,xe.height,1,Oe,qe,We)}w.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,xe.width,xe.height,xe.depth,Oe,qe,xe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,$e,xe.width,xe.height,xe.depth,0,Oe,qe,xe.data);else if(w.isData3DTexture)V?(be&&t.texStorage3D(i.TEXTURE_3D,Ue,$e,xe.width,xe.height,xe.depth),ye&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,xe.width,xe.height,xe.depth,Oe,qe,xe.data)):t.texImage3D(i.TEXTURE_3D,0,$e,xe.width,xe.height,xe.depth,0,Oe,qe,xe.data);else if(w.isFramebufferTexture){if(be)if(V)t.texStorage2D(i.TEXTURE_2D,Ue,$e,xe.width,xe.height);else{let _e=xe.width,oe=xe.height;for(let We=0;We<Ue;We++)t.texImage2D(i.TEXTURE_2D,We,$e,_e,oe,0,Oe,qe,null),_e>>=1,oe>>=1}}else if(et.length>0){if(V&&be){const _e=Vt(et[0]);t.texStorage2D(i.TEXTURE_2D,Ue,$e,_e.width,_e.height)}for(let _e=0,oe=et.length;_e<oe;_e++)Re=et[_e],V?ye&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,Oe,qe,Re):t.texImage2D(i.TEXTURE_2D,_e,$e,Oe,qe,Re);w.generateMipmaps=!1}else if(V){if(be){const _e=Vt(xe);t.texStorage2D(i.TEXTURE_2D,Ue,$e,_e.width,_e.height)}ye&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Oe,qe,xe)}else t.texImage2D(i.TEXTURE_2D,0,$e,Oe,qe,xe);_(w)&&g(le),je.__version=re.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function pe(L,w,ee){if(w.image.length!==6)return;const le=lt(L,w),me=w.source;t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+ee);const re=n.get(me);if(me.version!==re.__version||le===!0){t.activeTexture(i.TEXTURE0+ee);const je=St.getPrimaries(St.workingColorSpace),Me=w.colorSpace===ki?null:St.getPrimaries(w.colorSpace),Xe=w.colorSpace===ki||je===Me?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xe);const Ne=w.isCompressedTexture||w.image[0].isCompressedTexture,xe=w.image[0]&&w.image[0].isDataTexture,Oe=[];for(let oe=0;oe<6;oe++)!Ne&&!xe?Oe[oe]=x(w.image[oe],!0,s.maxCubemapSize):Oe[oe]=xe?w.image[oe].image:w.image[oe],Oe[oe]=Ht(w,Oe[oe]);const qe=Oe[0],$e=r.convert(w.format,w.colorSpace),Re=r.convert(w.type),et=C(w.internalFormat,$e,Re,w.colorSpace),V=w.isVideoTexture!==!0,be=re.__version===void 0||le===!0,ye=me.dataReady;let Ue=U(w,qe);ke(i.TEXTURE_CUBE_MAP,w);let _e;if(Ne){V&&be&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ue,et,qe.width,qe.height);for(let oe=0;oe<6;oe++){_e=Oe[oe].mipmaps;for(let We=0;We<_e.length;We++){const st=_e[We];w.format!==$n?$e!==null?V?ye&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We,0,0,st.width,st.height,$e,st.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We,et,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?ye&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We,0,0,st.width,st.height,$e,Re,st.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We,et,st.width,st.height,0,$e,Re,st.data)}}}else{if(_e=w.mipmaps,V&&be){_e.length>0&&Ue++;const oe=Vt(Oe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ue,et,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(xe){V?ye&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Oe[oe].width,Oe[oe].height,$e,Re,Oe[oe].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,et,Oe[oe].width,Oe[oe].height,0,$e,Re,Oe[oe].data);for(let We=0;We<_e.length;We++){const Tt=_e[We].image[oe].image;V?ye&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We+1,0,0,Tt.width,Tt.height,$e,Re,Tt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We+1,et,Tt.width,Tt.height,0,$e,Re,Tt.data)}}else{V?ye&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,$e,Re,Oe[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,et,$e,Re,Oe[oe]);for(let We=0;We<_e.length;We++){const st=_e[We];V?ye&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We+1,0,0,$e,Re,st.image[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We+1,et,$e,Re,st.image[oe])}}}_(w)&&g(i.TEXTURE_CUBE_MAP),re.__version=me.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function Ae(L,w,ee,le,me,re){const je=r.convert(ee.format,ee.colorSpace),Me=r.convert(ee.type),Xe=C(ee.internalFormat,je,Me,ee.colorSpace),Ne=n.get(w),xe=n.get(ee);if(xe.__renderTarget=w,!Ne.__hasExternalTextures){const Oe=Math.max(1,w.width>>re),qe=Math.max(1,w.height>>re);me===i.TEXTURE_3D||me===i.TEXTURE_2D_ARRAY?t.texImage3D(me,re,Xe,Oe,qe,w.depth,0,je,Me,null):t.texImage2D(me,re,Xe,Oe,qe,0,je,Me,null)}t.bindFramebuffer(i.FRAMEBUFFER,L),ze(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,le,me,xe.__webglTexture,0,Ot(w)):(me===i.TEXTURE_2D||me>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&me<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,le,me,xe.__webglTexture,re),t.bindFramebuffer(i.FRAMEBUFFER,null)}function nt(L,w,ee){if(i.bindRenderbuffer(i.RENDERBUFFER,L),w.depthBuffer){const le=w.depthTexture,me=le&&le.isDepthTexture?le.type:null,re=S(w.stencilBuffer,me),je=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=Ot(w);ze(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Me,re,w.width,w.height):ee?i.renderbufferStorageMultisample(i.RENDERBUFFER,Me,re,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,re,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,je,i.RENDERBUFFER,L)}else{const le=w.textures;for(let me=0;me<le.length;me++){const re=le[me],je=r.convert(re.format,re.colorSpace),Me=r.convert(re.type),Xe=C(re.internalFormat,je,Me,re.colorSpace),Ne=Ot(w);ee&&ze(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ne,Xe,w.width,w.height):ze(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ne,Xe,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,Xe,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ge(L,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,L),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const le=n.get(w.depthTexture);le.__renderTarget=w,(!le.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),H(w.depthTexture,0);const me=le.__webglTexture,re=Ot(w);if(w.depthTexture.format===Jr)ze(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,me,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,me,0);else if(w.depthTexture.format===Zr)ze(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,me,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,me,0);else throw new Error("Unknown depthTexture format")}function gt(L){const w=n.get(L),ee=L.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==L.depthTexture){const le=L.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),le){const me=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,le.removeEventListener("dispose",me)};le.addEventListener("dispose",me),w.__depthDisposeCallback=me}w.__boundDepthTexture=le}if(L.depthTexture&&!w.__autoAllocateDepthBuffer){if(ee)throw new Error("target.depthTexture not supported in Cube render targets");const le=L.texture.mipmaps;le&&le.length>0?Ge(w.__webglFramebuffer[0],L):Ge(w.__webglFramebuffer,L)}else if(ee){w.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[le]),w.__webglDepthbuffer[le]===void 0)w.__webglDepthbuffer[le]=i.createRenderbuffer(),nt(w.__webglDepthbuffer[le],L,!1);else{const me=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=w.__webglDepthbuffer[le];i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,me,i.RENDERBUFFER,re)}}else{const le=L.texture.mipmaps;if(le&&le.length>0?t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),nt(w.__webglDepthbuffer,L,!1);else{const me=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,me,i.RENDERBUFFER,re)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function en(L,w,ee){const le=n.get(L);w!==void 0&&Ae(le.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),ee!==void 0&&gt(L)}function F(L){const w=L.texture,ee=n.get(L),le=n.get(w);L.addEventListener("dispose",N);const me=L.textures,re=L.isWebGLCubeRenderTarget===!0,je=me.length>1;if(je||(le.__webglTexture===void 0&&(le.__webglTexture=i.createTexture()),le.__version=w.version,a.memory.textures++),re){ee.__webglFramebuffer=[];for(let Me=0;Me<6;Me++)if(w.mipmaps&&w.mipmaps.length>0){ee.__webglFramebuffer[Me]=[];for(let Xe=0;Xe<w.mipmaps.length;Xe++)ee.__webglFramebuffer[Me][Xe]=i.createFramebuffer()}else ee.__webglFramebuffer[Me]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){ee.__webglFramebuffer=[];for(let Me=0;Me<w.mipmaps.length;Me++)ee.__webglFramebuffer[Me]=i.createFramebuffer()}else ee.__webglFramebuffer=i.createFramebuffer();if(je)for(let Me=0,Xe=me.length;Me<Xe;Me++){const Ne=n.get(me[Me]);Ne.__webglTexture===void 0&&(Ne.__webglTexture=i.createTexture(),a.memory.textures++)}if(L.samples>0&&ze(L)===!1){ee.__webglMultisampledFramebuffer=i.createFramebuffer(),ee.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,ee.__webglMultisampledFramebuffer);for(let Me=0;Me<me.length;Me++){const Xe=me[Me];ee.__webglColorRenderbuffer[Me]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,ee.__webglColorRenderbuffer[Me]);const Ne=r.convert(Xe.format,Xe.colorSpace),xe=r.convert(Xe.type),Oe=C(Xe.internalFormat,Ne,xe,Xe.colorSpace,L.isXRRenderTarget===!0),qe=Ot(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,qe,Oe,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.RENDERBUFFER,ee.__webglColorRenderbuffer[Me])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(ee.__webglDepthRenderbuffer=i.createRenderbuffer(),nt(ee.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(re){t.bindTexture(i.TEXTURE_CUBE_MAP,le.__webglTexture),ke(i.TEXTURE_CUBE_MAP,w);for(let Me=0;Me<6;Me++)if(w.mipmaps&&w.mipmaps.length>0)for(let Xe=0;Xe<w.mipmaps.length;Xe++)Ae(ee.__webglFramebuffer[Me][Xe],L,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Xe);else Ae(ee.__webglFramebuffer[Me],L,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0);_(w)&&g(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(je){for(let Me=0,Xe=me.length;Me<Xe;Me++){const Ne=me[Me],xe=n.get(Ne);let Oe=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Oe=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Oe,xe.__webglTexture),ke(Oe,Ne),Ae(ee.__webglFramebuffer,L,Ne,i.COLOR_ATTACHMENT0+Me,Oe,0),_(Ne)&&g(Oe)}t.unbindTexture()}else{let Me=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Me=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Me,le.__webglTexture),ke(Me,w),w.mipmaps&&w.mipmaps.length>0)for(let Xe=0;Xe<w.mipmaps.length;Xe++)Ae(ee.__webglFramebuffer[Xe],L,w,i.COLOR_ATTACHMENT0,Me,Xe);else Ae(ee.__webglFramebuffer,L,w,i.COLOR_ATTACHMENT0,Me,0);_(w)&&g(Me),t.unbindTexture()}L.depthBuffer&&gt(L)}function kt(L){const w=L.textures;for(let ee=0,le=w.length;ee<le;ee++){const me=w[ee];if(_(me)){const re=T(L),je=n.get(me).__webglTexture;t.bindTexture(re,je),g(re),t.unbindTexture()}}}const at=[],it=[];function Be(L){if(L.samples>0){if(ze(L)===!1){const w=L.textures,ee=L.width,le=L.height;let me=i.COLOR_BUFFER_BIT;const re=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,je=n.get(L),Me=w.length>1;if(Me)for(let Ne=0;Ne<w.length;Ne++)t.bindFramebuffer(i.FRAMEBUFFER,je.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,je.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,je.__webglMultisampledFramebuffer);const Xe=L.texture.mipmaps;Xe&&Xe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,je.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,je.__webglFramebuffer);for(let Ne=0;Ne<w.length;Ne++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(me|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(me|=i.STENCIL_BUFFER_BIT)),Me){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,je.__webglColorRenderbuffer[Ne]);const xe=n.get(w[Ne]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,xe,0)}i.blitFramebuffer(0,0,ee,le,0,0,ee,le,me,i.NEAREST),c===!0&&(at.length=0,it.length=0,at.push(i.COLOR_ATTACHMENT0+Ne),L.depthBuffer&&L.resolveDepthBuffer===!1&&(at.push(re),it.push(re),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,it)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,at))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Me)for(let Ne=0;Ne<w.length;Ne++){t.bindFramebuffer(i.FRAMEBUFFER,je.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.RENDERBUFFER,je.__webglColorRenderbuffer[Ne]);const xe=n.get(w[Ne]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,je.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.TEXTURE_2D,xe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,je.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const w=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function Ot(L){return Math.min(s.maxSamples,L.samples)}function ze(L){const w=n.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Qe(L){const w=a.render.frame;d.get(L)!==w&&(d.set(L,w),L.update())}function Ht(L,w){const ee=L.colorSpace,le=L.format,me=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||ee!==lr&&ee!==ki&&(St.getTransfer(ee)===Pt?(le!==$n||me!==ai)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ee)),w}function Vt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(h.width=L.naturalWidth||L.width,h.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(h.width=L.displayWidth,h.height=L.displayHeight):(h.width=L.width,h.height=L.height),h}this.allocateTextureUnit=I,this.resetTextureUnits=Z,this.setTexture2D=H,this.setTexture2DArray=z,this.setTexture3D=$,this.setTextureCube=X,this.rebindTextures=en,this.setupRenderTarget=F,this.updateRenderTargetMipmap=kt,this.updateMultisampleRenderTarget=Be,this.setupDepthRenderbuffer=gt,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=ze}function Yb(i,e){function t(n,s=ki){let r;const a=St.getTransfer(s);if(n===ai)return i.UNSIGNED_BYTE;if(n===Kl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Jl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===qf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===jf)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===$f)return i.BYTE;if(n===Xf)return i.SHORT;if(n===Yr)return i.UNSIGNED_SHORT;if(n===Yl)return i.INT;if(n===ys)return i.UNSIGNED_INT;if(n===bi)return i.FLOAT;if(n===wi)return i.HALF_FLOAT;if(n===Yf)return i.ALPHA;if(n===Kf)return i.RGB;if(n===$n)return i.RGBA;if(n===Jr)return i.DEPTH_COMPONENT;if(n===Zr)return i.DEPTH_STENCIL;if(n===Jf)return i.RED;if(n===Zl)return i.RED_INTEGER;if(n===Zf)return i.RG;if(n===Ql)return i.RG_INTEGER;if(n===eh)return i.RGBA_INTEGER;if(n===Qa||n===eo||n===to||n===no)if(a===Pt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Qa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===to)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===no)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Qa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===eo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===to)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===no)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===tl||n===nl||n===il||n===sl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===tl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===nl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===il)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===sl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===rl||n===al||n===ol)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===rl||n===al)return a===Pt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ol)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===cl||n===ll||n===hl||n===ul||n===dl||n===fl||n===pl||n===ml||n===gl||n===vl||n===_l||n===yl||n===xl||n===bl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===cl)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ll)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===hl)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ul)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===dl)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===fl)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===pl)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ml)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===gl)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===vl)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===_l)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===yl)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===xl)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===bl)return a===Pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Sl||n===Ml||n===wl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Sl)return a===Pt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ml)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===wl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===El||n===Tl||n===Al||n===Rl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===El)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Tl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Al)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Rl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Kr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Kb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Jb=`
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

}`;class Zb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new up(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new _n({vertexShader:Kb,fragmentShader:Jb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Et(new Po(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Qb extends dr{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,h=null,d=null,u=null,m=null,p=null,y=null;const x=typeof XRWebGLBinding<"u",_=new Zb,g={},T=t.getContextAttributes();let C=null,S=null;const U=[],O=[],N=new Te;let P=null;const E=new Cn;E.viewport=new Lt;const A=new Cn;A.viewport=new Lt;const B=[E,A],Z=new yv;let I=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ue){let pe=U[ue];return pe===void 0&&(pe=new _c,U[ue]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(ue){let pe=U[ue];return pe===void 0&&(pe=new _c,U[ue]=pe),pe.getGripSpace()},this.getHand=function(ue){let pe=U[ue];return pe===void 0&&(pe=new _c,U[ue]=pe),pe.getHandSpace()};function H(ue){const pe=O.indexOf(ue.inputSource);if(pe===-1)return;const Ae=U[pe];Ae!==void 0&&(Ae.update(ue.inputSource,ue.frame,h||a),Ae.dispatchEvent({type:ue.type,data:ue.inputSource}))}function z(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",$);for(let ue=0;ue<U.length;ue++){const pe=O[ue];pe!==null&&(O[ue]=null,U[ue].disconnect(pe))}I=null,W=null,_.reset();for(const ue in g)delete g[ue];e.setRenderTarget(C),p=null,m=null,u=null,s=null,S=null,pt.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(N.width,N.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ue){r=ue,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ue){o=ue,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(ue){h=ue},this.getBaseLayer=function(){return m!==null?m:p},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return y},this.getSession=function(){return s},this.setSession=async function(ue){if(s=ue,s!==null){if(C=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",z),s.addEventListener("inputsourceschange",$),T.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(N),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ae=null,nt=null,Ge=null;T.depth&&(Ge=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ae=T.stencil?Zr:Jr,nt=T.stencil?Kr:ys);const gt={colorFormat:t.RGBA8,depthFormat:Ge,scaleFactor:r};u=this.getBinding(),m=u.createProjectionLayer(gt),s.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),S=new qn(m.textureWidth,m.textureHeight,{format:$n,type:ai,depthTexture:new hp(m.textureWidth,m.textureHeight,nt,void 0,void 0,void 0,void 0,void 0,void 0,Ae),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const Ae={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,Ae),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new qn(p.framebufferWidth,p.framebufferHeight,{format:$n,type:ai,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),pt.setContext(s),pt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function $(ue){for(let pe=0;pe<ue.removed.length;pe++){const Ae=ue.removed[pe],nt=O.indexOf(Ae);nt>=0&&(O[nt]=null,U[nt].disconnect(Ae))}for(let pe=0;pe<ue.added.length;pe++){const Ae=ue.added[pe];let nt=O.indexOf(Ae);if(nt===-1){for(let gt=0;gt<U.length;gt++)if(gt>=O.length){O.push(Ae),nt=gt;break}else if(O[gt]===null){O[gt]=Ae,nt=gt;break}if(nt===-1)break}const Ge=U[nt];Ge&&Ge.connect(Ae)}}const X=new k,de=new k;function fe(ue,pe,Ae){X.setFromMatrixPosition(pe.matrixWorld),de.setFromMatrixPosition(Ae.matrixWorld);const nt=X.distanceTo(de),Ge=pe.projectionMatrix.elements,gt=Ae.projectionMatrix.elements,en=Ge[14]/(Ge[10]-1),F=Ge[14]/(Ge[10]+1),kt=(Ge[9]+1)/Ge[5],at=(Ge[9]-1)/Ge[5],it=(Ge[8]-1)/Ge[0],Be=(gt[8]+1)/gt[0],Ot=en*it,ze=en*Be,Qe=nt/(-it+Be),Ht=Qe*-it;if(pe.matrixWorld.decompose(ue.position,ue.quaternion,ue.scale),ue.translateX(Ht),ue.translateZ(Qe),ue.matrixWorld.compose(ue.position,ue.quaternion,ue.scale),ue.matrixWorldInverse.copy(ue.matrixWorld).invert(),Ge[10]===-1)ue.projectionMatrix.copy(pe.projectionMatrix),ue.projectionMatrixInverse.copy(pe.projectionMatrixInverse);else{const Vt=en+Qe,L=F+Qe,w=Ot-Ht,ee=ze+(nt-Ht),le=kt*F/L*Vt,me=at*F/L*Vt;ue.projectionMatrix.makePerspective(w,ee,le,me,Vt,L),ue.projectionMatrixInverse.copy(ue.projectionMatrix).invert()}}function Se(ue,pe){pe===null?ue.matrixWorld.copy(ue.matrix):ue.matrixWorld.multiplyMatrices(pe.matrixWorld,ue.matrix),ue.matrixWorldInverse.copy(ue.matrixWorld).invert()}this.updateCamera=function(ue){if(s===null)return;let pe=ue.near,Ae=ue.far;_.texture!==null&&(_.depthNear>0&&(pe=_.depthNear),_.depthFar>0&&(Ae=_.depthFar)),Z.near=A.near=E.near=pe,Z.far=A.far=E.far=Ae,(I!==Z.near||W!==Z.far)&&(s.updateRenderState({depthNear:Z.near,depthFar:Z.far}),I=Z.near,W=Z.far),Z.layers.mask=ue.layers.mask|6,E.layers.mask=Z.layers.mask&3,A.layers.mask=Z.layers.mask&5;const nt=ue.parent,Ge=Z.cameras;Se(Z,nt);for(let gt=0;gt<Ge.length;gt++)Se(Ge[gt],nt);Ge.length===2?fe(Z,E,A):Z.projectionMatrix.copy(E.projectionMatrix),ke(ue,Z,nt)};function ke(ue,pe,Ae){Ae===null?ue.matrix.copy(pe.matrixWorld):(ue.matrix.copy(Ae.matrixWorld),ue.matrix.invert(),ue.matrix.multiply(pe.matrixWorld)),ue.matrix.decompose(ue.position,ue.quaternion,ue.scale),ue.updateMatrixWorld(!0),ue.projectionMatrix.copy(pe.projectionMatrix),ue.projectionMatrixInverse.copy(pe.projectionMatrixInverse),ue.isPerspectiveCamera&&(ue.fov=Qr*2*Math.atan(1/ue.projectionMatrix.elements[5]),ue.zoom=1)}this.getCamera=function(){return Z},this.getFoveation=function(){if(!(m===null&&p===null))return c},this.setFoveation=function(ue){c=ue,m!==null&&(m.fixedFoveation=ue),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=ue)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(Z)},this.getCameraTexture=function(ue){return g[ue]};let lt=null;function mt(ue,pe){if(d=pe.getViewerPose(h||a),y=pe,d!==null){const Ae=d.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let nt=!1;Ae.length!==Z.cameras.length&&(Z.cameras.length=0,nt=!0);for(let F=0;F<Ae.length;F++){const kt=Ae[F];let at=null;if(p!==null)at=p.getViewport(kt);else{const Be=u.getViewSubImage(m,kt);at=Be.viewport,F===0&&(e.setRenderTargetTextures(S,Be.colorTexture,Be.depthStencilTexture),e.setRenderTarget(S))}let it=B[F];it===void 0&&(it=new Cn,it.layers.enable(F),it.viewport=new Lt,B[F]=it),it.matrix.fromArray(kt.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(kt.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(at.x,at.y,at.width,at.height),F===0&&(Z.matrix.copy(it.matrix),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale)),nt===!0&&Z.cameras.push(it)}const Ge=s.enabledFeatures;if(Ge&&Ge.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();const F=u.getDepthInformation(Ae[0]);F&&F.isValid&&F.texture&&_.init(F,s.renderState)}if(Ge&&Ge.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let F=0;F<Ae.length;F++){const kt=Ae[F].camera;if(kt){let at=g[kt];at||(at=new up,g[kt]=at);const it=u.getCameraImage(kt);at.sourceTexture=it}}}}for(let Ae=0;Ae<U.length;Ae++){const nt=O[Ae],Ge=U[Ae];nt!==null&&Ge!==void 0&&Ge.update(nt,pe,h||a)}lt&&lt(ue,pe),pe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:pe}),y=null}const pt=new gp;pt.setAnimationLoop(mt),this.setAnimationLoop=function(ue){lt=ue},this.dispose=function(){}}}const rs=new oi,eS=new zt;function tS(i,e){function t(_,g){_.matrixAutoUpdate===!0&&_.updateMatrix(),g.value.copy(_.matrix)}function n(_,g){g.color.getRGB(_.fogColor.value,ap(i)),g.isFog?(_.fogNear.value=g.near,_.fogFar.value=g.far):g.isFogExp2&&(_.fogDensity.value=g.density)}function s(_,g,T,C,S){g.isMeshBasicMaterial||g.isMeshLambertMaterial?r(_,g):g.isMeshToonMaterial?(r(_,g),u(_,g)):g.isMeshPhongMaterial?(r(_,g),d(_,g)):g.isMeshStandardMaterial?(r(_,g),m(_,g),g.isMeshPhysicalMaterial&&p(_,g,S)):g.isMeshMatcapMaterial?(r(_,g),y(_,g)):g.isMeshDepthMaterial?r(_,g):g.isMeshDistanceMaterial?(r(_,g),x(_,g)):g.isMeshNormalMaterial?r(_,g):g.isLineBasicMaterial?(a(_,g),g.isLineDashedMaterial&&o(_,g)):g.isPointsMaterial?c(_,g,T,C):g.isSpriteMaterial?h(_,g):g.isShadowMaterial?(_.color.value.copy(g.color),_.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(_,g){_.opacity.value=g.opacity,g.color&&_.diffuse.value.copy(g.color),g.emissive&&_.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(_.map.value=g.map,t(g.map,_.mapTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.bumpMap&&(_.bumpMap.value=g.bumpMap,t(g.bumpMap,_.bumpMapTransform),_.bumpScale.value=g.bumpScale,g.side===Mn&&(_.bumpScale.value*=-1)),g.normalMap&&(_.normalMap.value=g.normalMap,t(g.normalMap,_.normalMapTransform),_.normalScale.value.copy(g.normalScale),g.side===Mn&&_.normalScale.value.negate()),g.displacementMap&&(_.displacementMap.value=g.displacementMap,t(g.displacementMap,_.displacementMapTransform),_.displacementScale.value=g.displacementScale,_.displacementBias.value=g.displacementBias),g.emissiveMap&&(_.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,_.emissiveMapTransform)),g.specularMap&&(_.specularMap.value=g.specularMap,t(g.specularMap,_.specularMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest);const T=e.get(g),C=T.envMap,S=T.envMapRotation;C&&(_.envMap.value=C,rs.copy(S),rs.x*=-1,rs.y*=-1,rs.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(rs.y*=-1,rs.z*=-1),_.envMapRotation.value.setFromMatrix4(eS.makeRotationFromEuler(rs)),_.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,_.reflectivity.value=g.reflectivity,_.ior.value=g.ior,_.refractionRatio.value=g.refractionRatio),g.lightMap&&(_.lightMap.value=g.lightMap,_.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,_.lightMapTransform)),g.aoMap&&(_.aoMap.value=g.aoMap,_.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,_.aoMapTransform))}function a(_,g){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,g.map&&(_.map.value=g.map,t(g.map,_.mapTransform))}function o(_,g){_.dashSize.value=g.dashSize,_.totalSize.value=g.dashSize+g.gapSize,_.scale.value=g.scale}function c(_,g,T,C){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,_.size.value=g.size*T,_.scale.value=C*.5,g.map&&(_.map.value=g.map,t(g.map,_.uvTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest)}function h(_,g){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,_.rotation.value=g.rotation,g.map&&(_.map.value=g.map,t(g.map,_.mapTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest)}function d(_,g){_.specular.value.copy(g.specular),_.shininess.value=Math.max(g.shininess,1e-4)}function u(_,g){g.gradientMap&&(_.gradientMap.value=g.gradientMap)}function m(_,g){_.metalness.value=g.metalness,g.metalnessMap&&(_.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,_.metalnessMapTransform)),_.roughness.value=g.roughness,g.roughnessMap&&(_.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,_.roughnessMapTransform)),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)}function p(_,g,T){_.ior.value=g.ior,g.sheen>0&&(_.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),_.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(_.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,_.sheenColorMapTransform)),g.sheenRoughnessMap&&(_.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,_.sheenRoughnessMapTransform))),g.clearcoat>0&&(_.clearcoat.value=g.clearcoat,_.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(_.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,_.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(_.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Mn&&_.clearcoatNormalScale.value.negate())),g.dispersion>0&&(_.dispersion.value=g.dispersion),g.iridescence>0&&(_.iridescence.value=g.iridescence,_.iridescenceIOR.value=g.iridescenceIOR,_.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],_.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(_.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,_.iridescenceMapTransform)),g.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),g.transmission>0&&(_.transmission.value=g.transmission,_.transmissionSamplerMap.value=T.texture,_.transmissionSamplerSize.value.set(T.width,T.height),g.transmissionMap&&(_.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,_.transmissionMapTransform)),_.thickness.value=g.thickness,g.thicknessMap&&(_.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=g.attenuationDistance,_.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(_.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(_.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=g.specularIntensity,_.specularColor.value.copy(g.specularColor),g.specularColorMap&&(_.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,_.specularColorMapTransform)),g.specularIntensityMap&&(_.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,_.specularIntensityMapTransform))}function y(_,g){g.matcap&&(_.matcap.value=g.matcap)}function x(_,g){const T=e.get(g).light;_.referencePosition.value.setFromMatrixPosition(T.matrixWorld),_.nearDistance.value=T.shadow.camera.near,_.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function nS(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(T,C){const S=C.program;n.uniformBlockBinding(T,S)}function h(T,C){let S=s[T.id];S===void 0&&(y(T),S=d(T),s[T.id]=S,T.addEventListener("dispose",_));const U=C.program;n.updateUBOMapping(T,U);const O=e.render.frame;r[T.id]!==O&&(m(T),r[T.id]=O)}function d(T){const C=u();T.__bindingPointIndex=C;const S=i.createBuffer(),U=T.__size,O=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,U,O),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,C,S),S}function u(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(T){const C=s[T.id],S=T.uniforms,U=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,C);for(let O=0,N=S.length;O<N;O++){const P=Array.isArray(S[O])?S[O]:[S[O]];for(let E=0,A=P.length;E<A;E++){const B=P[E];if(p(B,O,E,U)===!0){const Z=B.__offset,I=Array.isArray(B.value)?B.value:[B.value];let W=0;for(let H=0;H<I.length;H++){const z=I[H],$=x(z);typeof z=="number"||typeof z=="boolean"?(B.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,Z+W,B.__data)):z.isMatrix3?(B.__data[0]=z.elements[0],B.__data[1]=z.elements[1],B.__data[2]=z.elements[2],B.__data[3]=0,B.__data[4]=z.elements[3],B.__data[5]=z.elements[4],B.__data[6]=z.elements[5],B.__data[7]=0,B.__data[8]=z.elements[6],B.__data[9]=z.elements[7],B.__data[10]=z.elements[8],B.__data[11]=0):(z.toArray(B.__data,W),W+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,Z,B.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(T,C,S,U){const O=T.value,N=C+"_"+S;if(U[N]===void 0)return typeof O=="number"||typeof O=="boolean"?U[N]=O:U[N]=O.clone(),!0;{const P=U[N];if(typeof O=="number"||typeof O=="boolean"){if(P!==O)return U[N]=O,!0}else if(P.equals(O)===!1)return P.copy(O),!0}return!1}function y(T){const C=T.uniforms;let S=0;const U=16;for(let N=0,P=C.length;N<P;N++){const E=Array.isArray(C[N])?C[N]:[C[N]];for(let A=0,B=E.length;A<B;A++){const Z=E[A],I=Array.isArray(Z.value)?Z.value:[Z.value];for(let W=0,H=I.length;W<H;W++){const z=I[W],$=x(z),X=S%U,de=X%$.boundary,fe=X+de;S+=de,fe!==0&&U-fe<$.storage&&(S+=U-fe),Z.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),Z.__offset=S,S+=$.storage}}}const O=S%U;return O>0&&(S+=U-O),T.__size=S,T.__cache={},this}function x(T){const C={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(C.boundary=4,C.storage=4):T.isVector2?(C.boundary=8,C.storage=8):T.isVector3||T.isColor?(C.boundary=16,C.storage=12):T.isVector4?(C.boundary=16,C.storage=16):T.isMatrix3?(C.boundary=48,C.storage=48):T.isMatrix4?(C.boundary=64,C.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),C}function _(T){const C=T.target;C.removeEventListener("dispose",_);const S=a.indexOf(C.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[C.id]),delete s[C.id],delete r[C.id]}function g(){for(const T in s)i.deleteBuffer(s[T]);a=[],s={},r={}}return{bind:c,update:h,dispose:g}}class iS{constructor(e={}){const{canvas:t=b0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:m=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const y=new Uint32Array(4),x=new Int32Array(4);let _=null,g=null;const T=[],C=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let U=!1;this._outputColorSpace=on;let O=0,N=0,P=null,E=-1,A=null;const B=new Lt,Z=new Lt;let I=null;const W=new Ze(0);let H=0,z=t.width,$=t.height,X=1,de=null,fe=null;const Se=new Lt(0,0,z,$),ke=new Lt(0,0,z,$);let lt=!1;const mt=new ah;let pt=!1,ue=!1;const pe=new zt,Ae=new k,nt=new Lt,Ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let gt=!1;function en(){return P===null?X:1}let F=n;function kt(R,j){return t.getContext(R,j)}try{const R={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ql}`),t.addEventListener("webglcontextlost",ye,!1),t.addEventListener("webglcontextrestored",Ue,!1),t.addEventListener("webglcontextcreationerror",_e,!1),F===null){const j="webgl2";if(F=kt(j,R),F===null)throw kt(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let at,it,Be,Ot,ze,Qe,Ht,Vt,L,w,ee,le,me,re,je,Me,Xe,Ne,xe,Oe,qe,$e,Re,et;function V(){at=new fx(F),at.init(),$e=new Yb(F,at),it=new ax(F,at,e,$e),Be=new qb(F,at),it.reversedDepthBuffer&&m&&Be.buffers.depth.setReversed(!0),Ot=new gx(F),ze=new Ob,Qe=new jb(F,at,Be,ze,it,$e,Ot),Ht=new cx(S),Vt=new dx(S),L=new Sv(F),Re=new sx(F,L),w=new px(F,L,Ot,Re),ee=new _x(F,w,L,Ot),xe=new vx(F,it,Qe),Me=new ox(ze),le=new Lb(S,Ht,Vt,at,it,Re,Me),me=new tS(S,ze),re=new Nb,je=new Vb(at),Ne=new ix(S,Ht,Vt,Be,ee,p,c),Xe=new $b(S,ee,it),et=new nS(F,Ot,it,Be),Oe=new rx(F,at,Ot),qe=new mx(F,at,Ot),Ot.programs=le.programs,S.capabilities=it,S.extensions=at,S.properties=ze,S.renderLists=re,S.shadowMap=Xe,S.state=Be,S.info=Ot}V();const be=new Qb(S,F);this.xr=be,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const R=at.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=at.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(R){R!==void 0&&(X=R,this.setSize(z,$,!1))},this.getSize=function(R){return R.set(z,$)},this.setSize=function(R,j,ne=!0){if(be.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=R,$=j,t.width=Math.floor(R*X),t.height=Math.floor(j*X),ne===!0&&(t.style.width=R+"px",t.style.height=j+"px"),this.setViewport(0,0,R,j)},this.getDrawingBufferSize=function(R){return R.set(z*X,$*X).floor()},this.setDrawingBufferSize=function(R,j,ne){z=R,$=j,X=ne,t.width=Math.floor(R*ne),t.height=Math.floor(j*ne),this.setViewport(0,0,R,j)},this.getCurrentViewport=function(R){return R.copy(B)},this.getViewport=function(R){return R.copy(Se)},this.setViewport=function(R,j,ne,ie){R.isVector4?Se.set(R.x,R.y,R.z,R.w):Se.set(R,j,ne,ie),Be.viewport(B.copy(Se).multiplyScalar(X).round())},this.getScissor=function(R){return R.copy(ke)},this.setScissor=function(R,j,ne,ie){R.isVector4?ke.set(R.x,R.y,R.z,R.w):ke.set(R,j,ne,ie),Be.scissor(Z.copy(ke).multiplyScalar(X).round())},this.getScissorTest=function(){return lt},this.setScissorTest=function(R){Be.setScissorTest(lt=R)},this.setOpaqueSort=function(R){de=R},this.setTransparentSort=function(R){fe=R},this.getClearColor=function(R){return R.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor(...arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha(...arguments)},this.clear=function(R=!0,j=!0,ne=!0){let ie=0;if(R){let K=!1;if(P!==null){const ge=P.texture.format;K=ge===eh||ge===Ql||ge===Zl}if(K){const ge=P.texture.type,Ie=ge===ai||ge===ys||ge===Yr||ge===Kr||ge===Kl||ge===Jl,He=Ne.getClearColor(),Ee=Ne.getClearAlpha(),tt=He.r,rt=He.g,Ke=He.b;Ie?(y[0]=tt,y[1]=rt,y[2]=Ke,y[3]=Ee,F.clearBufferuiv(F.COLOR,0,y)):(x[0]=tt,x[1]=rt,x[2]=Ke,x[3]=Ee,F.clearBufferiv(F.COLOR,0,x))}else ie|=F.COLOR_BUFFER_BIT}j&&(ie|=F.DEPTH_BUFFER_BIT),ne&&(ie|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ye,!1),t.removeEventListener("webglcontextrestored",Ue,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),Ne.dispose(),re.dispose(),je.dispose(),ze.dispose(),Ht.dispose(),Vt.dispose(),ee.dispose(),Re.dispose(),et.dispose(),le.dispose(),be.dispose(),be.removeEventListener("sessionstart",En),be.removeEventListener("sessionend",gr),Fn.stop()};function ye(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function Ue(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const R=Ot.autoReset,j=Xe.enabled,ne=Xe.autoUpdate,ie=Xe.needsUpdate,K=Xe.type;V(),Ot.autoReset=R,Xe.enabled=j,Xe.autoUpdate=ne,Xe.needsUpdate=ie,Xe.type=K}function _e(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function oe(R){const j=R.target;j.removeEventListener("dispose",oe),We(j)}function We(R){st(R),ze.remove(R)}function st(R){const j=ze.get(R).programs;j!==void 0&&(j.forEach(function(ne){le.releaseProgram(ne)}),R.isShaderMaterial&&le.releaseShaderCache(R))}this.renderBufferDirect=function(R,j,ne,ie,K,ge){j===null&&(j=Ge);const Ie=K.isMesh&&K.matrixWorld.determinant()<0,He=Oo(R,j,ne,ie,K);Be.setMaterial(ie,Ie);let Ee=ne.index,tt=1;if(ie.wireframe===!0){if(Ee=w.getWireframeAttribute(ne),Ee===void 0)return;tt=2}const rt=ne.drawRange,Ke=ne.attributes.position;let dt=rt.start*tt,bt=(rt.start+rt.count)*tt;ge!==null&&(dt=Math.max(dt,ge.start*tt),bt=Math.min(bt,(ge.start+ge.count)*tt)),Ee!==null?(dt=Math.max(dt,0),bt=Math.min(bt,Ee.count)):Ke!=null&&(dt=Math.max(dt,0),bt=Math.min(bt,Ke.count));const Gt=bt-dt;if(Gt<0||Gt===1/0)return;Re.setup(K,ie,He,ne,Ee);let Dt,At=Oe;if(Ee!==null&&(Dt=L.get(Ee),At=qe,At.setIndex(Dt)),K.isMesh)ie.wireframe===!0?(Be.setLineWidth(ie.wireframeLinewidth*en()),At.setMode(F.LINES)):At.setMode(F.TRIANGLES);else if(K.isLine){let De=ie.linewidth;De===void 0&&(De=1),Be.setLineWidth(De*en()),K.isLineSegments?At.setMode(F.LINES):K.isLineLoop?At.setMode(F.LINE_LOOP):At.setMode(F.LINE_STRIP)}else K.isPoints?At.setMode(F.POINTS):K.isSprite&&At.setMode(F.TRIANGLES);if(K.isBatchedMesh)if(K._multiDrawInstances!==null)ea("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),At.renderMultiDrawInstances(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount,K._multiDrawInstances);else if(at.get("WEBGL_multi_draw"))At.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{const De=K._multiDrawStarts,wt=K._multiDrawCounts,yt=K._multiDrawCount,tn=Ee?L.get(Ee).bytesPerElement:1,li=ze.get(ie).currentProgram.getUniforms();for(let cn=0;cn<yt;cn++)li.setValue(F,"_gl_DrawID",cn),At.render(De[cn]/tn,wt[cn])}else if(K.isInstancedMesh)At.renderInstances(dt,Gt,K.count);else if(ne.isInstancedBufferGeometry){const De=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,wt=Math.min(ne.instanceCount,De);At.renderInstances(dt,Gt,wt)}else At.render(dt,Gt)};function Tt(R,j,ne){R.transparent===!0&&R.side===Pn&&R.forceSinglePass===!1?(R.side=Mn,R.needsUpdate=!0,ci(R,j,ne),R.side=Xi,R.needsUpdate=!0,ci(R,j,ne),R.side=Pn):ci(R,j,ne)}this.compile=function(R,j,ne=null){ne===null&&(ne=R),g=je.get(ne),g.init(j),C.push(g),ne.traverseVisible(function(K){K.isLight&&K.layers.test(j.layers)&&(g.pushLight(K),K.castShadow&&g.pushShadow(K))}),R!==ne&&R.traverseVisible(function(K){K.isLight&&K.layers.test(j.layers)&&(g.pushLight(K),K.castShadow&&g.pushShadow(K))}),g.setupLights();const ie=new Set;return R.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;const ge=K.material;if(ge)if(Array.isArray(ge))for(let Ie=0;Ie<ge.length;Ie++){const He=ge[Ie];Tt(He,ne,K),ie.add(He)}else Tt(ge,ne,K),ie.add(ge)}),g=C.pop(),ie},this.compileAsync=function(R,j,ne=null){const ie=this.compile(R,j,ne);return new Promise(K=>{function ge(){if(ie.forEach(function(Ie){ze.get(Ie).currentProgram.isReady()&&ie.delete(Ie)}),ie.size===0){K(R);return}setTimeout(ge,10)}at.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let xt=null;function xn(R){xt&&xt(R)}function En(){Fn.stop()}function gr(){Fn.start()}const Fn=new gp;Fn.setAnimationLoop(xn),typeof self<"u"&&Fn.setContext(self),this.setAnimationLoop=function(R){xt=R,be.setAnimationLoop(R),R===null?Fn.stop():Fn.start()},be.addEventListener("sessionstart",En),be.addEventListener("sessionend",gr),this.render=function(R,j){if(j!==void 0&&j.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),be.enabled===!0&&be.isPresenting===!0&&(be.cameraAutoUpdate===!0&&be.updateCamera(j),j=be.getCamera()),R.isScene===!0&&R.onBeforeRender(S,R,j,P),g=je.get(R,C.length),g.init(j),C.push(g),pe.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),mt.setFromProjectionMatrix(pe,si,j.reversedDepth),ue=this.localClippingEnabled,pt=Me.init(this.clippingPlanes,ue),_=re.get(R,T.length),_.init(),T.push(_),be.enabled===!0&&be.isPresenting===!0){const ge=S.xr.getDepthSensingMesh();ge!==null&&bs(ge,j,-1/0,S.sortObjects)}bs(R,j,0,S.sortObjects),_.finish(),S.sortObjects===!0&&_.sort(de,fe),gt=be.enabled===!1||be.isPresenting===!1||be.hasDepthSensing()===!1,gt&&Ne.addToRenderList(_,R),this.info.render.frame++,pt===!0&&Me.beginShadows();const ne=g.state.shadowsArray;Xe.render(ne,R,j),pt===!0&&Me.endShadows(),this.info.autoReset===!0&&this.info.reset();const ie=_.opaque,K=_.transmissive;if(g.setupLights(),j.isArrayCamera){const ge=j.cameras;if(K.length>0)for(let Ie=0,He=ge.length;Ie<He;Ie++){const Ee=ge[Ie];la(ie,K,R,Ee)}gt&&Ne.render(R);for(let Ie=0,He=ge.length;Ie<He;Ie++){const Ee=ge[Ie];qi(_,R,Ee,Ee.viewport)}}else K.length>0&&la(ie,K,R,j),gt&&Ne.render(R),qi(_,R,j);P!==null&&N===0&&(Qe.updateMultisampleRenderTarget(P),Qe.updateRenderTargetMipmap(P)),R.isScene===!0&&R.onAfterRender(S,R,j),Re.resetDefaultState(),E=-1,A=null,C.pop(),C.length>0?(g=C[C.length-1],pt===!0&&Me.setGlobalState(S.clippingPlanes,g.state.camera)):g=null,T.pop(),T.length>0?_=T[T.length-1]:_=null};function bs(R,j,ne,ie){if(R.visible===!1)return;if(R.layers.test(j.layers)){if(R.isGroup)ne=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(j);else if(R.isLight)g.pushLight(R),R.castShadow&&g.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||mt.intersectsSprite(R)){ie&&nt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(pe);const Ie=ee.update(R),He=R.material;He.visible&&_.push(R,Ie,He,ne,nt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||mt.intersectsObject(R))){const Ie=ee.update(R),He=R.material;if(ie&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),nt.copy(R.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),nt.copy(Ie.boundingSphere.center)),nt.applyMatrix4(R.matrixWorld).applyMatrix4(pe)),Array.isArray(He)){const Ee=Ie.groups;for(let tt=0,rt=Ee.length;tt<rt;tt++){const Ke=Ee[tt],dt=He[Ke.materialIndex];dt&&dt.visible&&_.push(R,Ie,dt,ne,nt.z,Ke)}}else He.visible&&_.push(R,Ie,He,ne,nt.z,null)}}const ge=R.children;for(let Ie=0,He=ge.length;Ie<He;Ie++)bs(ge[Ie],j,ne,ie)}function qi(R,j,ne,ie){const K=R.opaque,ge=R.transmissive,Ie=R.transparent;g.setupLightsView(ne),pt===!0&&Me.setGlobalState(S.clippingPlanes,ne),ie&&Be.viewport(B.copy(ie)),K.length>0&&ji(K,j,ne),ge.length>0&&ji(ge,j,ne),Ie.length>0&&ji(Ie,j,ne),Be.buffers.depth.setTest(!0),Be.buffers.depth.setMask(!0),Be.buffers.color.setMask(!0),Be.setPolygonOffset(!1)}function la(R,j,ne,ie){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[ie.id]===void 0&&(g.state.transmissionRenderTarget[ie.id]=new qn(1,1,{generateMipmaps:!0,type:at.has("EXT_color_buffer_half_float")||at.has("EXT_color_buffer_float")?wi:ai,minFilter:ms,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:St.workingColorSpace}));const ge=g.state.transmissionRenderTarget[ie.id],Ie=ie.viewport||B;ge.setSize(Ie.z*S.transmissionResolutionScale,Ie.w*S.transmissionResolutionScale);const He=S.getRenderTarget(),Ee=S.getActiveCubeFace(),tt=S.getActiveMipmapLevel();S.setRenderTarget(ge),S.getClearColor(W),H=S.getClearAlpha(),H<1&&S.setClearColor(16777215,.5),S.clear(),gt&&Ne.render(ne);const rt=S.toneMapping;S.toneMapping=Wi;const Ke=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),g.setupLightsView(ie),pt===!0&&Me.setGlobalState(S.clippingPlanes,ie),ji(R,ne,ie),Qe.updateMultisampleRenderTarget(ge),Qe.updateRenderTargetMipmap(ge),at.has("WEBGL_multisampled_render_to_texture")===!1){let dt=!1;for(let bt=0,Gt=j.length;bt<Gt;bt++){const Dt=j[bt],At=Dt.object,De=Dt.geometry,wt=Dt.material,yt=Dt.group;if(wt.side===Pn&&At.layers.test(ie.layers)){const tn=wt.side;wt.side=Mn,wt.needsUpdate=!0,ha(At,ne,ie,De,wt,yt),wt.side=tn,wt.needsUpdate=!0,dt=!0}}dt===!0&&(Qe.updateMultisampleRenderTarget(ge),Qe.updateRenderTargetMipmap(ge))}S.setRenderTarget(He,Ee,tt),S.setClearColor(W,H),Ke!==void 0&&(ie.viewport=Ke),S.toneMapping=rt}function ji(R,j,ne){const ie=j.isScene===!0?j.overrideMaterial:null;for(let K=0,ge=R.length;K<ge;K++){const Ie=R[K],He=Ie.object,Ee=Ie.geometry,tt=Ie.group;let rt=Ie.material;rt.allowOverride===!0&&ie!==null&&(rt=ie),He.layers.test(ne.layers)&&ha(He,j,ne,Ee,rt,tt)}}function ha(R,j,ne,ie,K,ge){R.onBeforeRender(S,j,ne,ie,K,ge),R.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),K.onBeforeRender(S,j,ne,ie,R,ge),K.transparent===!0&&K.side===Pn&&K.forceSinglePass===!1?(K.side=Mn,K.needsUpdate=!0,S.renderBufferDirect(ne,j,ie,K,R,ge),K.side=Xi,K.needsUpdate=!0,S.renderBufferDirect(ne,j,ie,K,R,ge),K.side=Pn):S.renderBufferDirect(ne,j,ie,K,R,ge),R.onAfterRender(S,j,ne,ie,K,ge)}function ci(R,j,ne){j.isScene!==!0&&(j=Ge);const ie=ze.get(R),K=g.state.lights,ge=g.state.shadowsArray,Ie=K.state.version,He=le.getParameters(R,K.state,ge,j,ne),Ee=le.getProgramCacheKey(He);let tt=ie.programs;ie.environment=R.isMeshStandardMaterial?j.environment:null,ie.fog=j.fog,ie.envMap=(R.isMeshStandardMaterial?Vt:Ht).get(R.envMap||ie.environment),ie.envMapRotation=ie.environment!==null&&R.envMap===null?j.environmentRotation:R.envMapRotation,tt===void 0&&(R.addEventListener("dispose",oe),tt=new Map,ie.programs=tt);let rt=tt.get(Ee);if(rt!==void 0){if(ie.currentProgram===rt&&ie.lightsStateVersion===Ie)return _r(R,He),rt}else He.uniforms=le.getUniforms(R),R.onBeforeCompile(He,S),rt=le.acquireProgram(He,Ee),tt.set(Ee,rt),ie.uniforms=He.uniforms;const Ke=ie.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ke.clippingPlanes=Me.uniform),_r(R,He),ie.needsLights=ua(R),ie.lightsStateVersion=Ie,ie.needsLights&&(Ke.ambientLightColor.value=K.state.ambient,Ke.lightProbe.value=K.state.probe,Ke.directionalLights.value=K.state.directional,Ke.directionalLightShadows.value=K.state.directionalShadow,Ke.spotLights.value=K.state.spot,Ke.spotLightShadows.value=K.state.spotShadow,Ke.rectAreaLights.value=K.state.rectArea,Ke.ltc_1.value=K.state.rectAreaLTC1,Ke.ltc_2.value=K.state.rectAreaLTC2,Ke.pointLights.value=K.state.point,Ke.pointLightShadows.value=K.state.pointShadow,Ke.hemisphereLights.value=K.state.hemi,Ke.directionalShadowMap.value=K.state.directionalShadowMap,Ke.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Ke.spotShadowMap.value=K.state.spotShadowMap,Ke.spotLightMatrix.value=K.state.spotLightMatrix,Ke.spotLightMap.value=K.state.spotLightMap,Ke.pointShadowMap.value=K.state.pointShadowMap,Ke.pointShadowMatrix.value=K.state.pointShadowMatrix),ie.currentProgram=rt,ie.uniformsList=null,rt}function vr(R){if(R.uniformsList===null){const j=R.currentProgram.getUniforms();R.uniformsList=io.seqWithValue(j.seq,R.uniforms)}return R.uniformsList}function _r(R,j){const ne=ze.get(R);ne.outputColorSpace=j.outputColorSpace,ne.batching=j.batching,ne.batchingColor=j.batchingColor,ne.instancing=j.instancing,ne.instancingColor=j.instancingColor,ne.instancingMorph=j.instancingMorph,ne.skinning=j.skinning,ne.morphTargets=j.morphTargets,ne.morphNormals=j.morphNormals,ne.morphColors=j.morphColors,ne.morphTargetsCount=j.morphTargetsCount,ne.numClippingPlanes=j.numClippingPlanes,ne.numIntersection=j.numClipIntersection,ne.vertexAlphas=j.vertexAlphas,ne.vertexTangents=j.vertexTangents,ne.toneMapping=j.toneMapping}function Oo(R,j,ne,ie,K){j.isScene!==!0&&(j=Ge),Qe.resetTextureUnits();const ge=j.fog,Ie=ie.isMeshStandardMaterial?j.environment:null,He=P===null?S.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:lr,Ee=(ie.isMeshStandardMaterial?Vt:Ht).get(ie.envMap||Ie),tt=ie.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,rt=!!ne.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),Ke=!!ne.morphAttributes.position,dt=!!ne.morphAttributes.normal,bt=!!ne.morphAttributes.color;let Gt=Wi;ie.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Gt=S.toneMapping);const Dt=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,At=Dt!==void 0?Dt.length:0,De=ze.get(ie),wt=g.state.lights;if(pt===!0&&(ue===!0||R!==A)){const $t=R===A&&ie.id===E;Me.setState(ie,R,$t)}let yt=!1;ie.version===De.__version?(De.needsLights&&De.lightsStateVersion!==wt.state.version||De.outputColorSpace!==He||K.isBatchedMesh&&De.batching===!1||!K.isBatchedMesh&&De.batching===!0||K.isBatchedMesh&&De.batchingColor===!0&&K.colorTexture===null||K.isBatchedMesh&&De.batchingColor===!1&&K.colorTexture!==null||K.isInstancedMesh&&De.instancing===!1||!K.isInstancedMesh&&De.instancing===!0||K.isSkinnedMesh&&De.skinning===!1||!K.isSkinnedMesh&&De.skinning===!0||K.isInstancedMesh&&De.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&De.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&De.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&De.instancingMorph===!1&&K.morphTexture!==null||De.envMap!==Ee||ie.fog===!0&&De.fog!==ge||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==Me.numPlanes||De.numIntersection!==Me.numIntersection)||De.vertexAlphas!==tt||De.vertexTangents!==rt||De.morphTargets!==Ke||De.morphNormals!==dt||De.morphColors!==bt||De.toneMapping!==Gt||De.morphTargetsCount!==At)&&(yt=!0):(yt=!0,De.__version=ie.version);let tn=De.currentProgram;yt===!0&&(tn=ci(ie,j,K));let li=!1,cn=!1,Yi=!1;const Ut=tn.getUniforms(),Yt=De.uniforms;if(Be.useProgram(tn.program)&&(li=!0,cn=!0,Yi=!0),ie.id!==E&&(E=ie.id,cn=!0),li||A!==R){Be.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Ut.setValue(F,"projectionMatrix",R.projectionMatrix),Ut.setValue(F,"viewMatrix",R.matrixWorldInverse);const ln=Ut.map.cameraPosition;ln!==void 0&&ln.setValue(F,Ae.setFromMatrixPosition(R.matrixWorld)),it.logarithmicDepthBuffer&&Ut.setValue(F,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Ut.setValue(F,"isOrthographic",R.isOrthographicCamera===!0),A!==R&&(A=R,cn=!0,Yi=!0)}if(K.isSkinnedMesh){Ut.setOptional(F,K,"bindMatrix"),Ut.setOptional(F,K,"bindMatrixInverse");const $t=K.skeleton;$t&&($t.boneTexture===null&&$t.computeBoneTexture(),Ut.setValue(F,"boneTexture",$t.boneTexture,Qe))}K.isBatchedMesh&&(Ut.setOptional(F,K,"batchingTexture"),Ut.setValue(F,"batchingTexture",K._matricesTexture,Qe),Ut.setOptional(F,K,"batchingIdTexture"),Ut.setValue(F,"batchingIdTexture",K._indirectTexture,Qe),Ut.setOptional(F,K,"batchingColorTexture"),K._colorsTexture!==null&&Ut.setValue(F,"batchingColorTexture",K._colorsTexture,Qe));const Kt=ne.morphAttributes;if((Kt.position!==void 0||Kt.normal!==void 0||Kt.color!==void 0)&&xe.update(K,ne,tn),(cn||De.receiveShadow!==K.receiveShadow)&&(De.receiveShadow=K.receiveShadow,Ut.setValue(F,"receiveShadow",K.receiveShadow)),ie.isMeshGouraudMaterial&&ie.envMap!==null&&(Yt.envMap.value=Ee,Yt.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),ie.isMeshStandardMaterial&&ie.envMap===null&&j.environment!==null&&(Yt.envMapIntensity.value=j.environmentIntensity),cn&&(Ut.setValue(F,"toneMappingExposure",S.toneMappingExposure),De.needsLights&&Tn(Yt,Yi),ge&&ie.fog===!0&&me.refreshFogUniforms(Yt,ge),me.refreshMaterialUniforms(Yt,ie,X,$,g.state.transmissionRenderTarget[R.id]),io.upload(F,vr(De),Yt,Qe)),ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(io.upload(F,vr(De),Yt,Qe),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Ut.setValue(F,"center",K.center),Ut.setValue(F,"modelViewMatrix",K.modelViewMatrix),Ut.setValue(F,"normalMatrix",K.normalMatrix),Ut.setValue(F,"modelMatrix",K.matrixWorld),ie.isShaderMaterial||ie.isRawShaderMaterial){const $t=ie.uniformsGroups;for(let ln=0,yr=$t.length;ln<yr;ln++){const hi=$t[ln];et.update(hi,tn),et.bind(hi,tn)}}return tn}function Tn(R,j){R.ambientLightColor.needsUpdate=j,R.lightProbe.needsUpdate=j,R.directionalLights.needsUpdate=j,R.directionalLightShadows.needsUpdate=j,R.pointLights.needsUpdate=j,R.pointLightShadows.needsUpdate=j,R.spotLights.needsUpdate=j,R.spotLightShadows.needsUpdate=j,R.rectAreaLights.needsUpdate=j,R.hemisphereLights.needsUpdate=j}function ua(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(R,j,ne){const ie=ze.get(R);ie.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,ie.__autoAllocateDepthBuffer===!1&&(ie.__useRenderToTexture=!1),ze.get(R.texture).__webglTexture=j,ze.get(R.depthTexture).__webglTexture=ie.__autoAllocateDepthBuffer?void 0:ne,ie.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,j){const ne=ze.get(R);ne.__webglFramebuffer=j,ne.__useDefaultFramebuffer=j===void 0};const da=F.createFramebuffer();this.setRenderTarget=function(R,j=0,ne=0){P=R,O=j,N=ne;let ie=!0,K=null,ge=!1,Ie=!1;if(R){const Ee=ze.get(R);if(Ee.__useDefaultFramebuffer!==void 0)Be.bindFramebuffer(F.FRAMEBUFFER,null),ie=!1;else if(Ee.__webglFramebuffer===void 0)Qe.setupRenderTarget(R);else if(Ee.__hasExternalTextures)Qe.rebindTextures(R,ze.get(R.texture).__webglTexture,ze.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Ke=R.depthTexture;if(Ee.__boundDepthTexture!==Ke){if(Ke!==null&&ze.has(Ke)&&(R.width!==Ke.image.width||R.height!==Ke.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Qe.setupDepthRenderbuffer(R)}}const tt=R.texture;(tt.isData3DTexture||tt.isDataArrayTexture||tt.isCompressedArrayTexture)&&(Ie=!0);const rt=ze.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(rt[j])?K=rt[j][ne]:K=rt[j],ge=!0):R.samples>0&&Qe.useMultisampledRTT(R)===!1?K=ze.get(R).__webglMultisampledFramebuffer:Array.isArray(rt)?K=rt[ne]:K=rt,B.copy(R.viewport),Z.copy(R.scissor),I=R.scissorTest}else B.copy(Se).multiplyScalar(X).floor(),Z.copy(ke).multiplyScalar(X).floor(),I=lt;if(ne!==0&&(K=da),Be.bindFramebuffer(F.FRAMEBUFFER,K)&&ie&&Be.drawBuffers(R,K),Be.viewport(B),Be.scissor(Z),Be.setScissorTest(I),ge){const Ee=ze.get(R.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee.__webglTexture,ne)}else if(Ie){const Ee=j;for(let tt=0;tt<R.textures.length;tt++){const rt=ze.get(R.textures[tt]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+tt,rt.__webglTexture,ne,Ee)}}else if(R!==null&&ne!==0){const Ee=ze.get(R.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Ee.__webglTexture,ne)}E=-1},this.readRenderTargetPixels=function(R,j,ne,ie,K,ge,Ie,He=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=ze.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ee=Ee[Ie]),Ee){Be.bindFramebuffer(F.FRAMEBUFFER,Ee);try{const tt=R.textures[He],rt=tt.format,Ke=tt.type;if(!it.textureFormatReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=R.width-ie&&ne>=0&&ne<=R.height-K&&(R.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+He),F.readPixels(j,ne,ie,K,$e.convert(rt),$e.convert(Ke),ge))}finally{const tt=P!==null?ze.get(P).__webglFramebuffer:null;Be.bindFramebuffer(F.FRAMEBUFFER,tt)}}},this.readRenderTargetPixelsAsync=async function(R,j,ne,ie,K,ge,Ie,He=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=ze.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ee=Ee[Ie]),Ee)if(j>=0&&j<=R.width-ie&&ne>=0&&ne<=R.height-K){Be.bindFramebuffer(F.FRAMEBUFFER,Ee);const tt=R.textures[He],rt=tt.format,Ke=tt.type;if(!it.textureFormatReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const dt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,dt),F.bufferData(F.PIXEL_PACK_BUFFER,ge.byteLength,F.STREAM_READ),R.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+He),F.readPixels(j,ne,ie,K,$e.convert(rt),$e.convert(Ke),0);const bt=P!==null?ze.get(P).__webglFramebuffer:null;Be.bindFramebuffer(F.FRAMEBUFFER,bt);const Gt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await S0(F,Gt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,dt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ge),F.deleteBuffer(dt),F.deleteSync(Gt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,j=null,ne=0){const ie=Math.pow(2,-ne),K=Math.floor(R.image.width*ie),ge=Math.floor(R.image.height*ie),Ie=j!==null?j.x:0,He=j!==null?j.y:0;Qe.setTexture2D(R,0),F.copyTexSubImage2D(F.TEXTURE_2D,ne,0,0,Ie,He,K,ge),Be.unbindTexture()};const Bn=F.createFramebuffer(),fa=F.createFramebuffer();this.copyTextureToTexture=function(R,j,ne=null,ie=null,K=0,ge=null){ge===null&&(K!==0?(ea("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ge=K,K=0):ge=0);let Ie,He,Ee,tt,rt,Ke,dt,bt,Gt;const Dt=R.isCompressedTexture?R.mipmaps[ge]:R.image;if(ne!==null)Ie=ne.max.x-ne.min.x,He=ne.max.y-ne.min.y,Ee=ne.isBox3?ne.max.z-ne.min.z:1,tt=ne.min.x,rt=ne.min.y,Ke=ne.isBox3?ne.min.z:0;else{const Kt=Math.pow(2,-K);Ie=Math.floor(Dt.width*Kt),He=Math.floor(Dt.height*Kt),R.isDataArrayTexture?Ee=Dt.depth:R.isData3DTexture?Ee=Math.floor(Dt.depth*Kt):Ee=1,tt=0,rt=0,Ke=0}ie!==null?(dt=ie.x,bt=ie.y,Gt=ie.z):(dt=0,bt=0,Gt=0);const At=$e.convert(j.format),De=$e.convert(j.type);let wt;j.isData3DTexture?(Qe.setTexture3D(j,0),wt=F.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(Qe.setTexture2DArray(j,0),wt=F.TEXTURE_2D_ARRAY):(Qe.setTexture2D(j,0),wt=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,j.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,j.unpackAlignment);const yt=F.getParameter(F.UNPACK_ROW_LENGTH),tn=F.getParameter(F.UNPACK_IMAGE_HEIGHT),li=F.getParameter(F.UNPACK_SKIP_PIXELS),cn=F.getParameter(F.UNPACK_SKIP_ROWS),Yi=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Dt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Dt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,tt),F.pixelStorei(F.UNPACK_SKIP_ROWS,rt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Ke);const Ut=R.isDataArrayTexture||R.isData3DTexture,Yt=j.isDataArrayTexture||j.isData3DTexture;if(R.isDepthTexture){const Kt=ze.get(R),$t=ze.get(j),ln=ze.get(Kt.__renderTarget),yr=ze.get($t.__renderTarget);Be.bindFramebuffer(F.READ_FRAMEBUFFER,ln.__webglFramebuffer),Be.bindFramebuffer(F.DRAW_FRAMEBUFFER,yr.__webglFramebuffer);for(let hi=0;hi<Ee;hi++)Ut&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ze.get(R).__webglTexture,K,Ke+hi),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ze.get(j).__webglTexture,ge,Gt+hi)),F.blitFramebuffer(tt,rt,Ie,He,dt,bt,Ie,He,F.DEPTH_BUFFER_BIT,F.NEAREST);Be.bindFramebuffer(F.READ_FRAMEBUFFER,null),Be.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(K!==0||R.isRenderTargetTexture||ze.has(R)){const Kt=ze.get(R),$t=ze.get(j);Be.bindFramebuffer(F.READ_FRAMEBUFFER,Bn),Be.bindFramebuffer(F.DRAW_FRAMEBUFFER,fa);for(let ln=0;ln<Ee;ln++)Ut?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Kt.__webglTexture,K,Ke+ln):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Kt.__webglTexture,K),Yt?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,$t.__webglTexture,ge,Gt+ln):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,$t.__webglTexture,ge),K!==0?F.blitFramebuffer(tt,rt,Ie,He,dt,bt,Ie,He,F.COLOR_BUFFER_BIT,F.NEAREST):Yt?F.copyTexSubImage3D(wt,ge,dt,bt,Gt+ln,tt,rt,Ie,He):F.copyTexSubImage2D(wt,ge,dt,bt,tt,rt,Ie,He);Be.bindFramebuffer(F.READ_FRAMEBUFFER,null),Be.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Yt?R.isDataTexture||R.isData3DTexture?F.texSubImage3D(wt,ge,dt,bt,Gt,Ie,He,Ee,At,De,Dt.data):j.isCompressedArrayTexture?F.compressedTexSubImage3D(wt,ge,dt,bt,Gt,Ie,He,Ee,At,Dt.data):F.texSubImage3D(wt,ge,dt,bt,Gt,Ie,He,Ee,At,De,Dt):R.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ge,dt,bt,Ie,He,At,De,Dt.data):R.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ge,dt,bt,Dt.width,Dt.height,At,Dt.data):F.texSubImage2D(F.TEXTURE_2D,ge,dt,bt,Ie,He,At,De,Dt);F.pixelStorei(F.UNPACK_ROW_LENGTH,yt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,tn),F.pixelStorei(F.UNPACK_SKIP_PIXELS,li),F.pixelStorei(F.UNPACK_SKIP_ROWS,cn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Yi),ge===0&&j.generateMipmaps&&F.generateMipmap(wt),Be.unbindTexture()},this.initRenderTarget=function(R){ze.get(R).__webglFramebuffer===void 0&&Qe.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?Qe.setTextureCube(R,0):R.isData3DTexture?Qe.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?Qe.setTexture2DArray(R,0):Qe.setTexture2D(R,0),Be.unbindTexture()},this.resetState=function(){O=0,N=0,P=null,Be.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=St._getDrawingBufferColorSpace(e),t.unpackColorSpace=St._getUnpackColorSpace()}}const so={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class mr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const sS=new ph(-1,1,1,-1,0,1);class rS extends qt{constructor(){super(),this.setAttribute("position",new Mt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Mt([0,2,0,0,2,0],2))}}const aS=new rS;class gh{constructor(e){this._mesh=new Et(aS,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,sS)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class oS extends mr{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof _n?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ta.clone(e.uniforms),this.material=new _n({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new gh(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class yd extends mr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class cS extends mr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class lS{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Te);this._width=n.width,this._height=n.height,t=new qn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:wi}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new oS(so),this.copyPass.material.blending=Mi,this.clock=new mp}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}yd!==void 0&&(a instanceof yd?n=!0:a instanceof cS&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const Ka={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class hS extends mr{constructor(){super(),this.uniforms=ta.clone(Ka.uniforms),this.material=new dv({name:Ka.name,uniforms:this.uniforms,vertexShader:Ka.vertexShader,fragmentShader:Ka.fragmentShader}),this._fsQuad=new gh(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},St.getTransfer(this._outputColorSpace)===Pt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ff?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Bf?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===zf?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===jl?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Vf?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Gf?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Hf&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class uS extends mr{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ze}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const dS={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ze(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class ur extends mr{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Te(e.x,e.y):new Te(256,256),this.clearColor=new Ze(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new qn(r,a,{type:wi}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new qn(r,a,{type:wi});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const m=new qn(r,a,{type:wi});m.texture.name="UnrealBloomPass.v"+d,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),r=Math.round(r/2),a=Math.round(a/2)}const o=dS;this.highPassUniforms=ta.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new _n({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Te(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new k(1,1,1),new k(1,1,1),new k(1,1,1),new k(1,1,1),new k(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ta.clone(so.uniforms),this.blendMaterial=new _n({uniforms:this.copyUniforms,vertexShader:so.vertexShader,fragmentShader:so.fragmentShader,blending:rr,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ze,this._oldClearAlpha=1,this._basic=new On,this._fsQuad=new gh(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Te(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=ur.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=ur.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new _n({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Te(.5,.5)},direction:{value:new Te(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new _n({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}ur.BlurDirectionX=new Te(1,0);ur.BlurDirectionY=new Te(0,1);const fS={move:{color:3846399,opacity:.35},dest:{color:8378623,opacity:.75},attack:{color:16726843,opacity:.6,pulse:!0},attackFar:{color:16742971,opacity:.3},deploy:{color:4259792,opacity:.4,pulse:!0},friendly:{color:5308272,opacity:.55,pulse:!0},enemy:{color:16728160,opacity:.6,pulse:!0},selected:{color:16769126,opacity:.7},hover:{color:16777215,opacity:.25}},Ks=3841023,Js=16727386,qs=11963647,kr=0,Zn={linear:i=>i,outCubic:i=>1-Math.pow(1-i,3),inOutQuad:i=>i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2,outBack:i=>1+2.70158*Math.pow(i-1,3)+1.70158*Math.pow(i-1,2)},xd=new Map;function pS(i){let e=xd.get(i);if(e)return e;const t=document.createElement("canvas");t.width=t.height=128;const n=t.getContext("2d");return n.font='96px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',n.textAlign="center",n.textBaseline="middle",n.shadowColor="rgba(0,0,0,0.6)",n.shadowBlur=8,n.fillText(i,64,72),e=new gs(t),e.colorSpace=on,xd.set(i,e),e}function Lc(i,e,t=64,n="#000"){const s=document.createElement("canvas");s.width=256,s.height=128;const r=s.getContext("2d");r.font=`900 ${t}px Inter, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.lineWidth=10,r.strokeStyle=n,r.strokeText(i,128,64),r.fillStyle=e,r.fillText(i,128,64);const a=new gs(s);a.colorSpace=on;const o=new Ys(new ds({map:a,transparent:!0,depthTest:!1}));return o.scale.set(2,1,1),o.renderOrder=10,o}function mS(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}const Dr=5,Oc=.64,gS=["guardian","firstStrike","deadly","flying","barrier","drain","regenerate","siege","swift"],vS={guardian:"#7fb2ff",firstStrike:"#ffd76a",deadly:"#b07cff",flying:"#bfe9ff",barrier:"#ffe9a0",drain:"#ff5a6e",regenerate:"#7ddc6a",siege:"#ff9a4d",swift:"#9ff5ff"};class Uc{constructor(e,t){this.group=new zi,this.body=new zi,this.statCanvas=document.createElement("canvas"),this.statusCanvas=document.createElement("canvas"),this.rangeMarks=new zi,this.rangeBadge=null,this.kwCanvas=document.createElement("canvas"),this.flyHeight=0,this.canActNow=!1,this.data=structuredClone(e),this.mine=t;const n=Ye(e.cardId),s=new Ze(vn[n.color].hex),r=t?Ks:Js;this.base=new Et(new Hi(.62,.7,.22,32),new Un({color:1711398,metalness:.6,roughness:.35,emissive:r,emissiveIntensity:.25})),this.base.position.y=.11,this.base.castShadow=!0,this.base.userData.uid=e.uid;const a=new Et(new Io(.66,.05,8,48),new Un({color:r,emissive:r,emissiveIntensity:1.4}));a.rotation.x=Math.PI/2,a.position.y=.2;const o=new Et(new Hi(.52,.52,.06,32),new Un({color:s,emissive:s,emissiveIntensity:.35,metalness:.3,roughness:.4}));o.position.y=.25,this.body.add(this.base,a,o),this.icon=new Ys(new ds({map:pS(n.icon),transparent:!0,alphaTest:.1})),this.icon.scale.set(1.25,1.25,1),this.icon.position.y=.95,this.body.add(this.icon),this.statCanvas.width=256,this.statCanvas.height=96,this.statTex=new gs(this.statCanvas),this.statTex.colorSpace=on,this.stats=new Ys(new ds({map:this.statTex,transparent:!0,depthTest:!1})),this.stats.scale.set(1.5,.56,1),this.stats.position.set(0,.42,0),this.stats.renderOrder=5,this.group.add(this.stats),this.ring=new Et(new na(.72,.86,48),new On({color:16769126,transparent:!0,opacity:0,side:Pn})),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=.03,this.group.add(this.ring),this.bubble=new Et(new ia(.85,24,16),new Un({color:16771488,emissive:16763213,emissiveIntensity:.6,transparent:!0,opacity:.22,depthWrite:!1})),this.bubble.position.y=.7,this.body.add(this.bubble),this.ice=new Et(new hh(.75,0),new Un({color:11462911,emissive:7327999,emissiveIntensity:.5,transparent:!0,opacity:.35,depthWrite:!1,flatShading:!0})),this.ice.position.y=.75,this.ice.scale.set(1,1.25,1),this.body.add(this.ice),this.roots=new Et(new uh(.5,.06,64,6,2,5),new Un({color:6000430,emissive:3103250,roughness:.9})),this.roots.rotation.x=Math.PI/2,this.roots.position.y=.3,this.roots.scale.set(1.1,1.1,.6),this.body.add(this.roots),this.kwCanvas.width=80*Dr,this.kwCanvas.height=80,this.kwTex=new gs(this.kwCanvas),this.kwTex.colorSpace=on,this.kwBadges=new Ys(new ds({map:this.kwTex,transparent:!0,depthTest:!1})),this.kwBadges.scale.set(Oc*Dr,Oc,1),this.kwBadges.position.set(0,.42-.28-Oc*.42,0),this.kwBadges.renderOrder=6,this.group.add(this.kwBadges),this.statusCanvas.width=256,this.statusCanvas.height=72,this.statusTex=new gs(this.statusCanvas),this.statusTex.colorSpace=on,this.status=new Ys(new ds({map:this.statusTex,transparent:!0,depthTest:!1})),this.status.scale.set(2.2,.62,1),this.status.position.y=1.95,this.status.renderOrder=6,this.body.add(this.status),((n.range??1)>1||e.range>1)&&this.addRangeMarks(e.range),this.group.add(this.body),this.flyHeight=e.kw.includes("flying")?.45:0,this.place(e),this.refresh(e,!1,0)}addRangeMarks(e){const t=new On({color:7325951});for(let a=0;a<10;a++){const o=a/10*Math.PI*2,c=new Et(new fr(.16,.05,.07),t);c.position.set(Math.cos(o)*.86,.06,Math.sin(o)*.86),c.rotation.y=-o+Math.PI/2,this.rangeMarks.add(c)}this.body.add(this.rangeMarks);const n=document.createElement("canvas");n.width=n.height=96;const s=n.getContext("2d");s.fillStyle="#1b5fb8",s.beginPath(),s.arc(48,48,44,0,Math.PI*2),s.fill(),s.lineWidth=6,s.strokeStyle="#bfe4ff",s.stroke(),s.font='40px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',s.textAlign="center",s.textBaseline="middle",s.fillText("🏹",40,44),s.font="900 30px Inter, sans-serif",s.fillStyle="#fff",s.strokeStyle="#000",s.lineWidth=5,s.strokeText(String(e),70,70),s.fillText(String(e),70,70);const r=new gs(n);r.colorSpace=on,this.rangeBadge=new Ys(new ds({map:r,transparent:!0,depthTest:!1})),this.rangeBadge.scale.set(.72,.72,1),this.rangeBadge.position.set(-.7,1.35,0),this.rangeBadge.renderOrder=6,this.body.add(this.rangeBadge)}place(e){const t=as(e);this.group.position.set(t.x,kr,t.z)}refresh(e,t,n){this.data=structuredClone(e);const s=Ye(e.cardId);this.canActNow=t,this.bubble.visible=e.kw.includes("barrier");const r=e.frozenUntil>=n;this.ice.visible=r,this.roots.visible=e.rootedUntil>=n,this.flyHeight=e.kw.includes("flying")?.45:0;const a=e.summonedRound===n&&!e.kw.includes("swift")&&!e.exhausted,o=e.exhausted||a;this.icon.material.color.set(r?10476799:o?7304068:16777215),this.icon.material.rotation=e.exhausted&&!r?-.35:0;const c=this.statusCanvas.getContext("2d");c.clearRect(0,0,256,72);const h=[];r?h.push(["❄️","#6fd0ff"]):a?h.push(["💤","#b9a8ff"]):e.exhausted&&h.push(["✓","#9aa0b4"]),e.rootedUntil>=n&&h.push(["🕸️","#8fd05a"]),e.tempAtk>0&&h.push(["🔥","#ffb04d"]);const d=64;h.forEach(([y,x],_)=>{const g=128-h.length*d/2+_*d+d/2;c.fillStyle="rgba(10,8,20,0.8)",c.beginPath(),c.arc(g,36,30,0,Math.PI*2),c.fill(),c.lineWidth=4,c.strokeStyle=x,c.stroke(),c.font=y==="✓"?"900 34px Inter, sans-serif":'34px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',c.textAlign="center",c.textBaseline="middle",c.fillStyle=x,c.fillText(y,g,38)}),this.statusTex.needsUpdate=!0,e.range>1&&!this.rangeBadge&&this.addRangeMarks(e.range),this.drawKeywords(e,a||e.summonedRound===n);const u=this.statCanvas.getContext("2d");u.clearRect(0,0,256,96);const m=Math.max(0,e.atk+e.tempAtk),p=(y,x,_,g)=>{u.fillStyle=_,mS(u,y,14,84,68,22),u.fill(),u.lineWidth=5,u.strokeStyle="rgba(0,0,0,0.7)",u.stroke(),u.font="900 54px Inter, sans-serif",u.textAlign="center",u.textBaseline="middle",u.lineWidth=8,u.strokeStyle="#000",u.strokeText(String(x),y+42,50),u.fillStyle=g,u.fillText(String(x),y+42,50)};p(14,m,"#d9822b",m>(s.atk??0)?"#b6ff9a":m<(s.atk??0)?"#ffb0b0":"#fff"),p(158,e.hp,"#c22d43",e.hp<e.maxHp?"#ffb0b0":e.hp>(s.hp??0)?"#b6ff9a":"#fff"),this.statTex.needsUpdate=!0}drawKeywords(e,t){const n=gS.filter(r=>e.kw.includes(r)&&(r!=="swift"||t)).slice(0,Dr),s=this.kwCanvas.getContext("2d");s.clearRect(0,0,80*Dr,80),n.forEach((r,a)=>{const o=40*Dr-n.length*80/2+40+a*80;s.fillStyle="rgba(12,10,24,0.85)",s.beginPath(),s.arc(o,40,34,0,Math.PI*2),s.fill(),s.lineWidth=5,s.strokeStyle=vS[r]??"#ffd76a",s.stroke(),s.font='38px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',s.textAlign="center",s.textBaseline="middle",s.fillText(_s[r].icon,o,43)}),this.kwTex.needsUpdate=!0}tick(e,t){const n=this.flyHeight;this.body.position.y=n+(n?Math.sin(e*2+this.data.uid)*.08:0),this.icon.position.y=.95+Math.sin(e*1.6+this.data.uid*1.3)*.04;const s=this.ring.material;s.color.setHex(this.mine?16769126:16742973),s.opacity=this.canActNow?this.mine&&t?.6+Math.sin(e*4)*.3:.35:0,this.bubble.rotation.y=e}}class _S{constructor(e,t,n,s,r,a,o=1,c=1){this.maxLife=e,this.life=0;const h=new qt,d=new Float32Array(s*3);this.vel=new Float32Array(s*3);for(let u=0;u<s;u++){d[u*3]=t.x+(Math.random()-.5)*.3*c,d[u*3+1]=t.y+Math.random()*.3,d[u*3+2]=t.z+(Math.random()-.5)*.3*c;const m=Math.random()*Math.PI*2,p=(.3+Math.random())*r;this.vel[u*3]=Math.cos(m)*p*c,this.vel[u*3+1]=(.5+Math.random())*r*o,this.vel[u*3+2]=Math.sin(m)*p*c}h.setAttribute("position",new wn(d,3)),this.points=new Il(h,new _o({color:n,size:a,transparent:!0,opacity:1,blending:rr,depthWrite:!1,map:bp()}))}update(e){this.life+=e;const t=this.points.geometry.getAttribute("position"),n=t.array;for(let s=0;s<n.length;s+=3)n[s]+=this.vel[s]*e,n[s+1]+=this.vel[s+1]*e,n[s+2]+=this.vel[s+2]*e,this.vel[s+1]-=3*e,this.vel[s]*=.97,this.vel[s+2]*=.97;return t.needsUpdate=!0,this.points.material.opacity=Math.max(0,1-this.life/this.maxLife),this.life<this.maxLife}}let Ja=null;function bp(){if(Ja)return Ja;const i=document.createElement("canvas");i.width=i.height=64;const e=i.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.3,"rgba(255,255,255,0.6)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),Ja=new gs(i),Ja}const yS={fire:16738842,explosion:16747050,frost:9430015,lightning:16773994,holy:16769658,shadow:11754751,poison:8257370,roots:8240954,wave:3848447,start:16777215,summon:16777215};class xS{constructor(e){this.scene=new X0,this.clock=new mp,this.tiles=new Map,this.units=new Map,this.orbs=[],this.sanctums=[],this.tweens=[],this.bursts=[],this.floaters=[],this.raycaster=new xv,this.mouse=new Te(-10,-10),this.seat=0,this.menuMode=!0,this.myTurn=!1,this.shake=0,this.camBase=new k,this.camTarget=new k,this.hoverKey=null,this.hoverSanctum=null,this.speed=1,this.guide=null,this.onHexClick=()=>{},this.onHexHover=()=>{},this.onSanctumClick=()=>{},this.onSanctumHover=()=>{},this.onRightClick=()=>{},this.renderer=new iS({canvas:e,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Nf,this.renderer.toneMapping=jl,this.renderer.toneMappingExposure=1.05,this.camera=new Cn(42,1,.1,200),this.composer=new lS(this.renderer),this.composer.addPass(new uS(this.scene,this.camera)),this.composer.addPass(new ur(new Te(512,512),.7,.5,.82)),this.composer.addPass(new hS),this.buildWorld(),this.setSeat(0),this.resize(),window.addEventListener("resize",()=>this.resize()),e.addEventListener("pointermove",t=>this.pointerMove(t)),e.addEventListener("click",t=>this.click(t)),e.addEventListener("contextmenu",t=>{t.preventDefault(),this.onRightClick()}),this.renderer.setAnimationLoop(()=>this.frame())}buildWorld(){const e=this.scene;e.background=new Ze(460303),e.fog=new rh(460303,26,60),e.add(new gv(10466559,1707818,.9));const t=new $u(16773597,1.6);t.position.set(-6,14,6),t.castShadow=!0,t.shadow.mapSize.set(2048,2048);const n=t.shadow.camera;n.left=-12,n.right=12,n.top=12,n.bottom=-12,e.add(t);const s=new $u(9067775,.6);s.position.set(6,6,-10),e.add(s);const r=new Et(new Hi(10.5,6,3.2,6,1),new Un({color:2366515,roughness:.95,flatShading:!0}));r.rotation.y=Math.PI/6,r.position.y=-1.95,r.scale.set(1.15,1,1.35),r.receiveShadow=!0,e.add(r);const a=new Et(new na(11,15,6),new On({color:5909503,transparent:!0,opacity:.08,side:Pn}));a.rotation.x=-Math.PI/2,a.rotation.z=Math.PI/6,a.position.y=-.4,a.scale.set(1,1.2,1),e.add(a);const o=new Hi(.94,.98,.3,6),c=new oh(.9,6);c.rotateX(-Math.PI/2),c.rotateY(Math.PI/6*0),c.rotateY(Math.PI/2);for(const p of $r){const y=as(p),x=.85+Math.random()*.2,_=new Ze(3880274).multiplyScalar(x),g=new Et(o,new Un({color:_,roughness:.8,metalness:.15}));g.position.set(y.x,kr-.15,y.z),g.receiveShadow=!0,g.userData.hex=p;const T=new Et(c,new On({color:16777215,transparent:!0,opacity:0,depthWrite:!1}));T.position.set(y.x,kr+.012,y.z),T.renderOrder=1,e.add(g,T),this.tiles.set(rn(p),{mesh:g,overlay:T,hl:null})}for(const p of sa){const y=as(p),x=new Et(new na(.62,.8,6),new On({color:qs,transparent:!0,opacity:.7,side:Pn}));x.rotation.x=-Math.PI/2,x.rotation.z=Math.PI/2,x.position.set(y.x,kr+.02,y.z);const _=new Et(new yo(.3,2),new Un({color:qs,emissive:qs,emissiveIntensity:2.2}));_.position.set(y.x,2.3,y.z);const g=new Tc(qs,6,5,1.5);g.position.set(y.x,1.6,y.z);const T=new Et(new Hi(.05,.25,2.3,12,1,!0),new On({color:qs,transparent:!0,opacity:.18,blending:rr,depthWrite:!1,side:Pn}));T.position.set(y.x,1.15,y.z),e.add(x,_,g,T),this.orbs.push({hex:p,orb:_,light:g,beam:T,ring:x,owner:null})}for(let p=0;p<2;p++){const y=new zi,x=p===0?7.35:-7.35;y.position.set(0,0,x);const _=new Et(new Hi(1,1.4,.8,8),new Un({color:2761792,metalness:.5,roughness:.5,flatShading:!0}));_.position.y=0,_.castShadow=!0,_.receiveShadow=!0;const g=new Et(new ia(1.15,48,32),new fv({color:16777215,transparent:!0,opacity:.25,roughness:.05,metalness:.1,clearcoat:1,depthWrite:!1}));g.position.y=1.75,g.userData.sanctum=p;const T=new Et(new yo(.6,3),new Un({color:16777215,emissive:16777215,emissiveIntensity:2}));T.position.y=1.75,T.userData.sanctum=p;const C=new Et(new Io(1.45,.04,8,64),new On({color:16777215,transparent:!0,opacity:.6}));C.position.y=1.75,C.rotation.x=Math.PI/2.4;const S=new Tc(16777215,18,9,1.6);S.position.y=1.8;const U=Lc("20","#fff",72);U.position.y=3.5,U.scale.set(2.2,1.1,1),y.add(_,g,T,C,S,U),e.add(y),this.sanctums.push({group:y,core:T,shell:g,label:U,hp:20,light:S,hl:!1,ring:C})}const h=new qt,d=new Float32Array(1500*3);for(let p=0;p<1500;p++){const y=new k().randomDirection().multiplyScalar(70+Math.random()*30);y.y<-10&&(y.y=-y.y),d.set([y.x,y.y,y.z],p*3)}h.setAttribute("position",new wn(d,3)),e.add(new Il(h,new _o({color:13616895,size:.35,sizeAttenuation:!0,fog:!1})));const u=new qt,m=new Float32Array(480);for(let p=0;p<160;p++)m.set([(Math.random()-.5)*24,Math.random()*8,(Math.random()-.5)*22],p*3);u.setAttribute("position",new wn(m,3)),this.motes=new Il(u,new _o({color:11832575,size:.12,transparent:!0,opacity:.7,blending:rr,depthWrite:!1,map:bp()})),e.add(this.motes)}setSeat(e){this.seat=e;const t=e===0?1:-1;this.camBase.set(0,20.5,12.5*t),this.camTarget.set(0,0,1.2*t);for(let n=0;n<2;n++)this.colorSanctum(n);this.recolorTiles()}recolorTiles(){for(const e of $r){const n=this.tiles.get(rn(e)).mesh.material,s=new Ze(3880274).multiplyScalar(.85+(e.c*7+e.r*13)%5*.05);vs(this.seat).includes(e.r)&&s.lerp(new Ze(Ks),.12),vs(1-this.seat).includes(e.r)&&s.lerp(new Ze(Js),.11),n.color.copy(s)}}colorSanctum(e){const t=this.sanctums[e],n=new Ze(e===this.seat?Ks:Js);t.core.material.color.copy(n),t.core.material.emissive.copy(n),t.ring.material.color.copy(n),t.light.color.copy(n)}setMenuMode(e){this.menuMode=e;for(const t of this.sanctums)t.label.visible=!e;if(e){for(const t of this.units.values())this.scene.remove(t.group);this.units.clear(),this.clearHighlights()}}resize(){const e=window.innerWidth,t=window.innerHeight;this.renderer.setSize(e,t,!1),this.composer.setSize(e,t),this.camera.aspect=e/t,this.camera.fov=Math.min(80,Math.max(42,x0.radToDeg(2*Math.atan(.37/(e/t))))),this.camera.updateProjectionMatrix()}sync(e,t,n,s){this.myTurn=n;const r=new Set;for(const a of e.units){r.add(a.uid);let o=this.units.get(a.uid);o||(o=new Uc(a,a.owner===t),this.units.set(a.uid,o),this.scene.add(o.group)),o.place(a),o.group.scale.setScalar(1),o.refresh(a,s(a),e.round)}for(const[a,o]of this.units)r.has(a)||(this.scene.remove(o.group),this.units.delete(a));for(const a of this.orbs){const o=e.units.find(c=>c.c===a.hex.c&&c.r===a.hex.r);this.setOrbOwner(a,o?o.owner:null)}for(let a=0;a<2;a++)this.setSanctumHP(a,e.players[a].sanctum)}setOrbOwner(e,t){e.owner=t;const n=new Ze(t===null?qs:t===this.seat?Ks:Js),s=e.orb.material;s.color.copy(n),s.emissive.copy(n),e.light.color.copy(n),e.beam.material.color.copy(n),e.ring.material.color.copy(n)}setSanctumHP(e,t){const n=this.sanctums[e];if(n.hp===t&&n.label.userData.set)return;n.hp=t;const s=n.label,r=t>12?"#ffffff":t>6?"#ffd76a":"#ff6b6b",a=Lc(String(Math.max(0,t)),r,72);a.position.copy(s.position),a.scale.copy(s.scale),a.userData.set=!0,a.visible=s.visible,n.group.remove(s),n.group.add(a),n.label=a;const o=Math.max(0,t)/20;n.core.material.emissiveIntensity=.6+o*2,n.core.scale.setScalar(.6+o*.4)}clearHighlights(){for(const e of this.tiles.values())e.hl=null;for(const e of this.sanctums)e.hl=!1}setHighlights(e,t){for(const[n,s]of this.tiles)s.hl=e.get(n)??null;this.sanctums.forEach((n,s)=>n.hl=s===t)}showGuide(e,t){if(this.guide&&(this.scene.remove(this.guide),this.guide.geometry.dispose(),this.guide=null),!e||e.length<2&&!t)return;const n=e.map(a=>this.hexPos(a,.18));if(t){const a=n[n.length-1],o=a.clone().lerp(t,.5);o.y+=1.2;const c=new lh(a.clone().setY(.6),o,t.clone());n.push(...c.getPoints(12).slice(1))}if(n.length<2)return;const s=new fp(n,!1,"catmullrom",.1),r=new dh(s,Math.max(8,n.length*6),.06,6,!1);this.guide=new Et(r,new On({color:t?16734810:8378623,transparent:!0,opacity:.85,depthTest:!1})),this.guide.renderOrder=4,this.scene.add(this.guide)}pick(e){const t=this.renderer.domElement.getBoundingClientRect();this.mouse.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1),this.raycaster.setFromCamera(this.mouse,this.camera);const n=[];for(const r of this.sanctums)n.push(r.shell);for(const r of this.units.values())n.push(r.base,r.icon);for(const r of this.tiles.values())n.push(r.mesh);const s=this.raycaster.intersectObjects(n,!1);for(const r of s){if(r.object.userData.sanctum!==void 0)return{sanctum:r.object.userData.sanctum};if(r.object.userData.hex)return{hex:r.object.userData.hex};for(const a of this.units.values())if(a.base===r.object||a.icon===r.object)return{hex:{c:a.data.c,r:a.data.r}}}return{}}pointerMove(e){if(this.menuMode)return;const t=this.pick(e),n=t.hex?rn(t.hex):null;n!==this.hoverKey&&(this.hoverKey=n,this.onHexHover(t.hex??null));const s=t.sanctum??null;s!==this.hoverSanctum&&(this.hoverSanctum=s,this.onSanctumHover(s)),this.renderer.domElement.style.cursor=t.hex||t.sanctum!==void 0?"pointer":"default"}click(e){if(this.menuMode)return;const t=this.pick(e);t.sanctum!==void 0?this.onSanctumClick(t.sanctum):t.hex?this.onHexClick(t.hex):this.onRightClick()}screenPos(e,t=1.5){const n=as(e),s=new k(n.x,t,n.z).project(this.camera);return{x:(s.x+1)/2*window.innerWidth,y:(1-s.y)/2*window.innerHeight}}tween(e,t,n=Zn.outCubic){return new Promise(s=>this.tweens.push({start:this.clock.elapsedTime,dur:e/this.speed,fn:t,ease:n,resolve:s}))}wait(e){return this.tween(e/1e3,()=>{})}burst(e,t,n=30,s=2.5,r=.25,a=.8,o=1,c=1){const h=new _S(a,e,new Ze(t),n,s,r,o,c);this.bursts.push(h),this.scene.add(h.points)}floatText(e,t,n,s=!1){const r=Lc(t,n,s?84:64);r.position.copy(e),r.scale.multiplyScalar(s?1.3:1),this.scene.add(r),this.floaters.push({sp:r,life:0,vy:1.4})}hexPos(e,t=.8){const n=as(e);return new k(n.x,t,n.z)}sanctumPos(e){return new k(0,1.75,e===0?7.35:-7.35)}unitPos(e,t=.8){const n=this.units.get(e);return n?new k(n.group.position.x,t,n.group.position.z):new k}async projectile(e,t,n,s=.32,r=.18){const a=new Et(new ia(r,12,8),new On({color:n})),o=new Tc(n,4,3);a.add(o),this.scene.add(a);const c=e.clone().lerp(t,.5);c.y+=1.2+e.distanceTo(t)*.12,await this.tween(s,h=>{const d=e.clone().lerp(c,h),u=c.clone().lerp(t,h);a.position.copy(d.lerp(u,h)),Math.random()<.6&&this.burst(a.position.clone(),n,2,.4,.15,.4)},Zn.linear),this.scene.remove(a),this.burst(t,n,18,2,.22,.5)}async play(e,t,n){switch(e.t){case"summon":{const s=new Uc(e.unit,e.unit.owner===n);this.units.get(e.uid)&&this.scene.remove(this.units.get(e.uid).group),this.units.set(e.uid,s),this.scene.add(s.group),s.group.scale.setScalar(.01);const r=new Ze(vn[Ye(e.unit.cardId).color].hex).getHex();this.burst(this.hexPos(e.unit,.3),r,40,3,.25,.9,1.4),Je.summon(),await this.tween(.38,a=>s.group.scale.setScalar(Math.max(.01,a)),Zn.outBack);break}case"move":{const s=this.units.get(e.uid);if(!s)break;Je.move();for(let r=1;r<e.path.length;r++){const a=as(e.path[r-1]),o=as(e.path[r]);await this.tween(.16,c=>{s.group.position.set(a.x+(o.x-a.x)*c,kr+Math.sin(c*Math.PI)*.35,a.z+(o.z-a.z)*c)},Zn.inOutQuad)}s.data.c=e.path[e.path.length-1].c,s.data.r=e.path[e.path.length-1].r;break}case"teleport":{const s=this.units.get(e.uid);if(!s)break;this.burst(s.group.position.clone().setY(.6),3848447,20,2),await this.tween(.15,r=>s.group.scale.setScalar(1-r*.99)),s.place(e.to),s.data.c=e.to.c,s.data.r=e.to.r,this.burst(this.hexPos(e.to,.6),3848447,20,2),await this.tween(.2,r=>s.group.scale.setScalar(.01+r),Zn.outBack);break}case"attack":{const s=this.units.get(e.uid);if(!s)break;const r="uid"in e.target?this.unitPos(e.target.uid):this.sanctumPos(e.target.sanctum),a=new Ze(vn[Ye(s.data.cardId).color].hex).getHex();if(e.ranged)await this.projectile(this.unitPos(e.uid,1),r,a);else{const o=s.group.position.clone(),c=r.clone().setY(0).sub(o.clone().setY(0)),h=Math.min(.7,c.length()*.55);c.normalize(),await this.tween(.13,d=>s.group.position.copy(o).addScaledVector(c,-.15*d),Zn.outCubic),await this.tween(.1,d=>s.group.position.copy(o).addScaledVector(c,-.15+(h+.15)*d),Zn.linear),this.burst(r.clone(),16777215,12,2.5,.2,.35),this.tween(.22,d=>s.group.position.copy(o).addScaledVector(c,h*(1-d)),Zn.outCubic)}break}case"damage":{const s=this.units.get(e.uid);if(!s)break;Je.hit(),s.data.hp-=e.amount,s.refresh(s.data,!1,t.round),this.floatText(this.unitPos(e.uid,1.6),`-${e.amount}`,"#ff5a5a",e.amount>=4),this.burst(this.unitPos(e.uid,.8),16724016,14,2,.2,.5);const r=s.body.position.x;await this.tween(.25,a=>{s.body.position.x=r+Math.sin(a*30)*.08*(1-a)}),s.body.position.x=r;break}case"sanctumDamage":{const s=this.sanctums[e.p];e.amount>=3?Je.bigHit():Je.hit(),this.setSanctumHP(e.p,s.hp-e.amount),this.floatText(this.sanctumPos(e.p).add(new k(0,1.6,0)),`-${e.amount}`,"#ff4d4d",!0),this.burst(this.sanctumPos(e.p),e.p===n?Ks:Js,50,4,.3,.9),this.shake=Math.min(.6,.12+e.amount*.06);const r=s.group;await this.tween(.35,a=>{r.position.x=Math.sin(a*40)*.15*(1-a)}),r.position.x=0;break}case"sanctumHeal":{Je.heal(),this.setSanctumHP(e.p,this.sanctums[e.p].hp+e.amount),this.floatText(this.sanctumPos(e.p).add(new k(0,1.6,0)),`+${e.amount}`,"#7dff8a",!0),this.burst(this.sanctumPos(e.p),8257418,30,2,.25,.8,1.5),await this.wait(250);break}case"heal":{const s=this.units.get(e.uid);if(!s)break;Je.heal(),s.data.hp+=e.amount,s.refresh(s.data,!1,t.round),this.floatText(this.unitPos(e.uid,1.6),`+${e.amount}`,"#7dff8a"),this.burst(this.unitPos(e.uid,.5),8257418,16,1.5,.2,.7,1.5),await this.wait(200);break}case"barrier":{const s=this.units.get(e.uid);if(!s)break;Je.barrier(),s.data.kw=s.data.kw.filter(r=>r!=="barrier"),s.refresh(s.data,!1,t.round),this.floatText(this.unitPos(e.uid,1.6),"Blocked!","#ffe27a"),this.burst(this.unitPos(e.uid,.8),16769658,30,3,.22,.6),await this.wait(250);break}case"death":{const s=this.units.get(e.uid);if(!s)break;Je.death(),this.burst(s.group.position.clone().setY(.6),9067775,35,2.2,.28,1,1.2);const r=s.group;await this.tween(.4,a=>{r.scale.setScalar(Math.max(.01,1-a)),r.position.y=-a*.4,r.rotation.y=a*3},Zn.inOutQuad),this.scene.remove(r),this.units.delete(e.uid);break}case"levelUp":{const s=this.units.get(e.uid);s&&this.scene.remove(s.group);const r=new Uc(e.unit,e.unit.owner===n);this.units.set(e.uid,r),this.scene.add(r.group),Je.levelUp();const a=r.group.position.clone().setY(.8);this.burst(a,16766826,80,4,.35,1.2,1.6),this.burst(a,16777215,40,2.5,.25,.9,2),this.floatText(a.clone().setY(2.2),"LEVEL UP!","#ffd76a",!0),this.shake=.3,await this.tween(.6,o=>r.group.scale.setScalar(1.8-.8*o),Zn.outBack);break}case"bounce":{const s=this.units.get(e.uid);if(!s)break;Je.spell();const r=s.group;this.burst(r.position.clone().setY(.6),3848447,25,2.5),await this.tween(.35,a=>{r.position.y=a*3,r.scale.setScalar(Math.max(.01,1-a))}),this.scene.remove(r),this.units.delete(e.uid);break}case"buff":{const s=this.units.get(e.uid);if(!s)break;const r=t.units.find(a=>a.uid===e.uid);e.atk||e.hp?(Je.buff(),s.data.atk+=e.atk,s.data.hp+=e.hp,s.data.maxHp+=e.hp,this.floatText(this.unitPos(e.uid,1.7),`${e.atk>=0?"+":""}${e.atk}/${e.hp>=0?"+":""}${e.hp}`,"#ffd76a")):r&&(s.data.kw=[...r.kw]),s.refresh(s.data,!1,t.round),this.burst(this.unitPos(e.uid,.3),16766826,18,1.5,.18,.8,2),await this.wait(180);break}case"freeze":{const s=this.units.get(e.uid);if(!s)break;Je.freeze(),s.data.frozenUntil=Math.max(s.data.frozenUntil,t.round),s.data.exhausted=!0,s.refresh(s.data,!1,t.round),this.burst(this.unitPos(e.uid,.8),10479871,24,2,.2,.7),await this.wait(180);break}case"ready":{const s=this.units.get(e.uid);if(!s)break;Je.buff(),s.data.exhausted=!1,s.data.frozenUntil=0,s.refresh(s.data,!0,t.round),this.burst(this.unitPos(e.uid,.2),16769126,20,1.2,.2,.8,2.5),await this.wait(150);break}case"orbPulse":{Je.orb();const s=this.orbs.find(a=>a.hex.c===e.orb.c&&a.hex.r===e.orb.r);if(!s)break;const r=e.p===n?Ks:Js;this.burst(s.orb.position.clone(),r,30,2.5,.25,.7),await this.projectile(s.orb.position.clone(),this.sanctumPos(1-e.p),r,.45,.14);break}case"fx":{const s=yS[e.kind]??16777215;if(e.kind==="start")break;if(e.at){const r=this.hexPos(e.at,.6);e.kind==="explosion"?(Je.bigHit(),this.burst(r,16751162,60,4.5,.32,.8),this.burst(r,16769162,30,2.5,.25,.6),this.shake=.25):e.kind==="lightning"?(Je.bigHit(),await this.projectile(r.clone().setY(8),r,s,.15,.12)):e.kind==="fire"?(Je.spell(),await this.projectile(this.sanctumPos(n).setY(3),r,s,.3)):(Je.spell(),this.burst(r,s,40,2.8,.26,.8,1.3))}else{Je.spell();for(let r=0;r<6;r++)this.burst(new k((Math.random()-.5)*12,.5,(Math.random()-.5)*8),s,25,2.5,.28,.9)}await this.wait(200);break}}}frame(){const e=Math.min(.05,this.clock.getDelta()),t=this.clock.elapsedTime,n=[];for(const a of this.tweens){const o=Math.min(1,(t-a.start)/a.dur);a.fn(a.ease(o)),o>=1&&n.push(a)}n.length&&(this.tweens=this.tweens.filter(a=>!n.includes(a)),n.forEach(a=>a.resolve())),this.bursts=this.bursts.filter(a=>{const o=a.update(e);return o||(this.scene.remove(a.points),a.points.geometry.dispose()),o}),this.floaters=this.floaters.filter(a=>(a.life+=e,a.sp.position.y+=a.vy*e,a.vy*=.96,a.sp.material.opacity=Math.max(0,1-Math.max(0,a.life-.6)/.5),a.life>1.1?(this.scene.remove(a.sp),!1):!0));for(const a of this.units.values())a.tick(t,this.myTurn);for(const[,a]of this.tiles){const o=a.overlay.material;if(!a.hl){o.opacity=0;continue}const c=fS[a.hl];o.color.setHex(c.color),o.opacity=c.pulse?c.opacity*(.7+.3*Math.sin(t*5)):c.opacity}if(this.hoverKey&&!this.menuMode){const a=this.tiles.get(this.hoverKey);if(a){const o=a.overlay.material;o.opacity=Math.max(o.opacity,.22)+.15,a.hl||o.color.setHex(16777215)}}for(const a of this.orbs)a.orb.position.y=2.3+Math.sin(t*1.5+a.hex.c)*.12,a.orb.rotation.y=t*.8,a.beam.material.opacity=a.owner===null?.06:.22+Math.sin(t*3)*.06,a.ring.rotation.z=Math.PI/2+t*.3;this.sanctums.forEach((a,o)=>{a.core.rotation.y=t*.6,a.core.rotation.x=t*.3,a.ring.rotation.z=t*(o?-.5:.5),a.core.position.y=a.shell.position.y=1.75+Math.sin(t*1.2+o)*.08;const c=a.hl?1.5+Math.sin(t*8)*.8:1;a.light.intensity=14*c,a.shell.material.opacity=a.hl?.45:.22});const s=this.motes.geometry.getAttribute("position"),r=s.array;for(let a=1;a<r.length;a+=3)r[a]+=e*.25,r[a]>8&&(r[a]=0);if(s.needsUpdate=!0,this.menuMode){const a=t*.06;this.camera.position.set(Math.sin(a)*19,11+Math.sin(t*.2)*1.5,Math.cos(a)*19),this.camera.lookAt(0,0,0)}else{const a=this.camBase.clone();this.shake>0&&(a.add(new k((Math.random()-.5)*this.shake,(Math.random()-.5)*this.shake,0)),this.shake=Math.max(0,this.shake-e*1.5)),this.camera.position.lerp(a,this.shake>0?1:1-Math.exp(-e*4)),this.camera.lookAt(this.camTarget)}this.composer.render()}}const yi=document.getElementById("ui"),vh=new xS(document.getElementById("scene"));let Zs=null;const Fi={get(i,e){try{return localStorage.getItem(i)??e}catch{return e}},set(i,e){try{localStorage.setItem(i,e)}catch{}}},bd=["Arcanist","Spellwright","Orbkeeper","Starweaver","Runesmith","Hexblade","Mistcaller","Emberheart"];let Lr=Fi.get("oom-name",`${bd[Math.floor(Math.random()*bd.length)]}${Math.floor(Math.random()*90+10)}`),Qn=Fi.get("oom-deck",kn[0].id),Or=Fi.get("oom-aideck","random");function Sd(i){return i.map(e=>`<i class="dot" style="--c:${vn[e].hex}" title="${vn[e].name}"></i>`).join("")}function Wr(){vh.setMenuMode(!0),ti.play("menu");const i=Fl(),e=Bl(Qn);Qn=e.id;const t=i.map(o=>`
    <button class="deck-tile ${o.id===Qn?"sel":""} ${o.custom?"custom":""}" data-id="${o.id}" style="--c1:${vn[o.colors[0]??"neutral"].hex};--c2:${vn[o.colors[o.colors.length-1]??"neutral"].hex}">
      <span class="deck-icon">${o.icon}</span>
      <span class="deck-name">${ot(o.name)}</span>
      <span class="deck-arch">${Sd(o.colors)} ${ot(o.archetype)}</span>
    </button>`).join("");yi.innerHTML=`
  <div class="menu">
    <div class="title"><h1>Orbs <span>of</span> Magic</h1><div class="subtitle">A tactical card battle for the five Orbs</div></div>
    <div class="menu-body">
      <div class="panel deck-picker">
        <h3>Choose your deck</h3>
        <div class="deck-grid">${t}</div>
        <div class="deck-detail">
          <div class="dd-head"><b>${ot(e.name)}</b> <span class="tag">${ot(e.archetype)}</span> ${Sd(e.colors)}</div>
          <p>${ot(e.blurb)}</p>
          <p class="dim">${ot(e.howToPlay)}</p>
          <div class="row left">
            <button class="btn ghost small btn-view-deck">View decklist</button>
            <button class="btn ghost small btn-edit-deck">${e.custom?"Edit deck":"Copy &amp; edit"}</button>
            ${e.custom?'<button class="btn ghost small btn-del-deck">Delete</button>':""}
          </div>
        </div>
      </div>
      <div class="panel play-panel">
        <div class="play-head"><h3>Play</h3><label>Wizard name <input class="name-input" maxlength="20" value="${ot(Lr)}"></label></div>
        <button class="btn big btn-ai">🤖 Battle the AI</button>
        <label class="ai-deck">AI deck <select class="ai-deck-sel"><option value="random">Random</option>${kn.map(o=>`<option value="${o.id}" ${Or===o.id?"selected":""}>${ot(o.name)} (${o.archetype})</option>`).join("")}</select></label>
        <div class="sep">Online</div>
        <p class="dim offline-note">Online play needs a game server. This version runs entirely in your browser, so you can battle the AI. See the README to host a server for friends.</p>
        <div class="sep">Learn</div>
        <div class="row"><button class="btn ghost btn-howto">How to Play</button><button class="btn ghost btn-library">Card Library</button><button class="btn ghost btn-orbs">The Five Orbs</button></div>
        <div class="sep">Settings</div>
        <div class="row"><button class="btn ghost new-deck">＋ New Deck</button><button class="btn ghost btn-music-menu">🎵 Music: ${ti.isOn()?"On":"Off"}</button></div>
        <div class="status dim"></div>
      </div>
    </div>
    <div class="modal hidden"></div>
  </div>`;const n=o=>yi.querySelector(o);n(".name-input").oninput=o=>{Lr=o.target.value.trim()||"Wizard",Fi.set("oom-name",Lr)},yi.querySelectorAll(".deck-tile[data-id]").forEach(o=>o.onclick=()=>{Qn=o.dataset.id,Fi.set("oom-deck",Qn),Je.click(),Wr()});const s=o=>{o&&(Qn=o,Fi.set("oom-deck",o)),Wr()};n(".new-deck").onclick=()=>bh(yi,null,s),n(".btn-edit-deck").onclick=()=>bh(yi,e.custom?{id:e.id,name:e.name,cards:e.cards}:{id:`custom_${Date.now()}`,name:`${e.name} Remix`,cards:e.cards.map(([o,c])=>[o,c])},s);const r=yi.querySelector(".btn-del-deck");r&&(r.onclick=()=>{confirm(`Delete "${e.name}"?`)&&(Jp(e.id),Qn=kn[0].id,Fi.set("oom-deck",Qn),Wr())}),n(".ai-deck-sel").onchange=o=>{Or=o.target.value,Fi.set("oom-aideck",Or)};const a=Nd(Qn);n(".btn-ai").onclick=()=>MS(async()=>{const o=Or==="random"?void 0:Or;return wg||!fu?new fm({name:Lr,...a,aiDeckId:o}):fu.create("duel",{name:Lr,...a,vsAI:!0,aiDeckId:o})}),n(".btn-howto").onclick=()=>Lo(`<div class="help">${Fd}</div>`),n(".btn-library").onclick=()=>Sp("all"),n(".btn-orbs").onclick=()=>SS(),n(".btn-music-menu").onclick=o=>{o.target.textContent=`🎵 Music: ${ti.toggle()?"On":"Off"}`},n(".btn-view-deck").onclick=()=>bS(e.id)}function Lo(i){const e=yi.querySelector(".modal");return e.innerHTML=`<div class="panel modal-panel"><button class="close">✕</button>${i}</div>`,e.classList.remove("hidden"),e.querySelector(".close").onclick=()=>e.classList.add("hidden"),e.onclick=t=>{t.target===e&&e.classList.add("hidden")},e}function Sp(i){const e=["all","ember","tide","grove","dawn","dusk"],t=r=>r.levelOf?Ye(r.levelOf).cost+.5:r.cost,n=Ad.filter(r=>(!r.token||r.levelOf)&&(i==="all"||r.color===i)).sort((r,a)=>t(r)-t(a)||(r.levelOf??r.id).localeCompare(a.levelOf??a.id)||(r.levelOf?1:-1));Lo(`<h2>Card Library</h2>
    <div class="filters">${e.map(r=>`<button class="btn small ${r===i?"":"ghost"}" data-c="${r}">${r==="all"?"All":vn[r].name}</button>`).join("")}</div>
    <div class="card-grid">${n.map(r=>Sn(r)).join("")}</div>`).querySelectorAll(".filters button").forEach(r=>r.onclick=()=>Sp(r.dataset.c))}function bS(i){const e=Bl(i),t=e.cards.map(([n,s])=>({c:Ye(n),n:s})).sort((n,s)=>n.c.cost-s.c.cost);Lo(`<h2>${ot(e.name)} <span class="tag">${ot(e.archetype)}</span></h2><p>${ot(e.howToPlay)}</p>
    <div class="card-grid">${t.map(({c:n,n:s})=>`<div class="deck-card">${Sn(n)}<span class="count">×${s}</span></div>`).join("")}</div>`)}function SS(){Lo(`<h2>The Five Orbs</h2><p class="dim">Long ago the world's magic was split into five Orbs. Every wizard draws on one or two of them, and each Orb shapes how its followers fight.</p>
    <div class="orb-list">${["ember","tide","grove","dawn","dusk"].map(e=>{const t=vn[e],n=kn.filter(s=>s.colors.includes(e)).map(s=>s.name).join(", ");return`<div class="orb-row" style="--c:${t.hex}"><div class="orb-ball"></div><div><h3>${t.name} <span class="dim">· ${t.orb}</span></h3><p><b>${ot(t.ideals)}</b> ${ot(t.style)}</p><p class="dim">Decks: ${ot(n)}</p></div></div>`}).join("")}</div>`)}async function MS(i){const e=yi.querySelector(".status");e&&(e.textContent="Connecting…"),Je.select();try{const t=await i();wS(t)}catch(t){console.error(t),e&&(e.textContent=`Couldn't connect: ${t.message??t}`),Je.error()}}function wS(i){Zs==null||Zs.dispose(),Zs=new im(i,vh,yi,()=>{Zs=null,Wr()},()=>Qn)}for(const i of["pointerdown","keydown"])window.addEventListener(i,()=>ti.unlock(),{capture:!0});async function ES(){let i=null;try{i=sessionStorage.getItem("oom-reconnect")}catch{}Wr()}ES();window.oom={scene:vh,cardDef:Ye,music:ti,renderOffline:zp,get game(){return Zs}};
