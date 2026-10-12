/**
 * Script exécuté avant le premier rendu (aucun flash) :
 * - résout la préférence d'animation (choix enregistré > préférence système) ;
 * - décide si l'intro doit être jouée (page d'accueil, première visite de la
 *   session, animations non réduites) ;
 * - choisit la devise d'affichage (choix enregistré, sinon CHF pour les
 *   visiteurs en Suisse — langue « -CH » ou fuseau Europe/Zurich —, sinon EUR).
 * Il ne lit que localStorage / sessionStorage : aucun cookie, aucun traceur.
 */
const code = `(function(){var d=document.documentElement;try{var s=localStorage.getItem('pv-motion');var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var reduced=s==='reduced'||(s!=='full'&&r);d.dataset.motion=reduced?'reduced':'full';var seen=sessionStorage.getItem('pv-intro');d.dataset.intro=(!reduced&&!seen&&location.pathname==='/')?'on':'off';var c=localStorage.getItem('pv-currency');if(c!=='EUR'&&c!=='CHF'){var l=(navigator.languages&&navigator.languages[0])||navigator.language||'';var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}c=(/-CH$/i.test(l)||tz==='Europe/Zurich')?'CHF':'EUR';}d.dataset.currency=c;}catch(e){d.dataset.intro='off';}})();`;

export function BootScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
