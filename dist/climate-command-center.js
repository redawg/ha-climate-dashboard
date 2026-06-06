function e(e,t,o,s){var r,i=arguments.length,n=i<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,o):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(i<3?r(n):i>3?r(t,o,n):r(t,o))||n);return i>3&&n&&Object.defineProperty(t,o,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,o=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let i=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const o=void 0!==t&&1===t.length;o&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&r.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,o,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[s+1],e[0]);return new i(o,e,s)},a=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return(e=>new i("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",_=m.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},b=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),s=this.getPropertyDescriptor(e,o,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,o){const{get:s,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const i=s?.call(this);r?.call(this,t),this.requestUpdate(e,i,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(o)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const o of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=o.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,o);if(void 0!==s&&!0===o.reflect){const r=(void 0!==o.converter?.toAttribute?o.converter:y).toAttribute(t,o.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const o=this.constructor,s=o._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=o.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=s;const i=r.fromAttribute(t,e.type);this[s]=i??this._$Ej?.get(s)??i,this._$Em=null}}requestUpdate(e,t,o,s=!1,r){if(void 0!==e){const i=this.constructor;if(!1===s&&(r=this[e]),o??=i.getPropertyOptions(e),!((o.hasChanged??b)(r,t)||o.useDefault&&o.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:s,wrapped:r},i){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,i??t??this[e]),!0!==r||void 0!==i)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,o,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,_?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=e=>e,S=w.trustedTypes,z=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+C,P=`<${k}>`,O=document,M=()=>O.createComment(""),U=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,H="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,N=/>/g,D=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),Z=/'/g,L=/"/g,W=/^(?:script|style|textarea|title)$/i,B=(e=>(t,...o)=>({_$litType$:e,strings:t,values:o}))(1),I=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),q=new WeakMap,V=O.createTreeWalker(O,129);function K(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==z?z.createHTML(t):t}const J=(e,t)=>{const o=e.length-1,s=[];let r,i=2===t?"<svg>":3===t?"<math>":"",n=j;for(let t=0;t<o;t++){const o=e[t];let a,l,c=-1,d=0;for(;d<o.length&&(n.lastIndex=d,l=n.exec(o),null!==l);)d=n.lastIndex,n===j?"!--"===l[1]?n=T:void 0!==l[1]?n=N:void 0!==l[2]?(W.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=D):void 0!==l[3]&&(n=D):n===D?">"===l[0]?(n=r??j,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?D:'"'===l[3]?L:Z):n===L||n===Z?n=D:n===T||n===N?n=j:(n=D,r=void 0);const h=n===D&&e[t+1].startsWith("/>")?" ":"";i+=n===j?o+P:c>=0?(s.push(a),o.slice(0,c)+E+o.slice(c)+C+h):o+C+(-2===c?t:h)}return[K(e,i+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class G{constructor({strings:e,_$litType$:t},o){let s;this.parts=[];let r=0,i=0;const n=e.length-1,a=this.parts,[l,c]=J(e,t);if(this.el=G.createElement(l,o),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=V.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(E)){const t=c[i++],o=s.getAttribute(e).split(C),n=/([.?@])?(.*)/.exec(t);a.push({type:1,index:r,name:n[2],strings:o,ctor:"."===n[1]?te:"?"===n[1]?oe:"@"===n[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(C)&&(a.push({type:6,index:r}),s.removeAttribute(e));if(W.test(s.tagName)){const e=s.textContent.split(C),t=e.length-1;if(t>0){s.textContent=S?S.emptyScript:"";for(let o=0;o<t;o++)s.append(e[o],M()),V.nextNode(),a.push({type:2,index:++r});s.append(e[t],M())}}}else if(8===s.nodeType)if(s.data===k)a.push({type:2,index:r});else{let e=-1;for(;-1!==(e=s.data.indexOf(C,e+1));)a.push({type:7,index:r}),e+=C.length-1}r++}}static createElement(e,t){const o=O.createElement("template");return o.innerHTML=e,o}}function Y(e,t,o=e,s){if(t===I)return t;let r=void 0!==s?o._$Co?.[s]:o._$Cl;const i=U(t)?void 0:t._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),void 0===i?r=void 0:(r=new i(e),r._$AT(e,o,s)),void 0!==s?(o._$Co??=[])[s]=r:o._$Cl=r),void 0!==r&&(t=Y(e,r._$AS(e,t.values),r,s)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,s=(e?.creationScope??O).importNode(t,!0);V.currentNode=s;let r=V.nextNode(),i=0,n=0,a=o[0];for(;void 0!==a;){if(i===a.index){let t;2===a.type?t=new X(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new re(r,this,e)),this._$AV.push(t),a=o[++n]}i!==a?.index&&(r=V.nextNode(),i++)}return V.currentNode=O,s}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),U(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==I&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>R(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&U(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,s="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=G.createElement(K(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Q(s,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new G(e)),t}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,s=0;for(const r of e)s===t.length?t.push(o=new X(this.O(M()),this.O(M()),this,this.options)):o=t[s],o._$AI(r),s++;s<t.length&&(this._$AR(o&&o._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,s,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=F}_$AI(e,t=this,o,s){const r=this.strings;let i=!1;if(void 0===r)e=Y(this,e,t,0),i=!U(e)||e!==this._$AH&&e!==I,i&&(this._$AH=e);else{const s=e;let n,a;for(e=r[0],n=0;n<r.length-1;n++)a=Y(this,s[o+n],t,n),a===I&&(a=this._$AH[n]),i||=!U(a)||a!==this._$AH[n],a===F?e=F:e!==F&&(e+=(a??"")+r[n+1]),this._$AH[n]=a}i&&!s&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class oe extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class se extends ee{constructor(e,t,o,s,r){super(e,t,o,s,r),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??F)===I)return;const o=this._$AH,s=e===F&&o!==F||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,r=e!==F&&(o===F||s);s&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const ie=w.litHtmlPolyfillSupport;ie?.(G,X),(w.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;class ae extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const s=o?.renderBefore??t;let r=s._$litPart$;if(void 0===r){const e=o?.renderBefore??null;s._$litPart$=r=new X(t.insertBefore(M(),e),e,void 0,o??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}ae._$litElement$=!0,ae.finalized=!0,ne.litElementHydrateSupport?.({LitElement:ae});const le=ne.litElementPolyfillSupport;le?.({LitElement:ae}),(ne.litElementVersions??=[]).push("4.2.2");const ce=e=>(t,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},de={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},he=(e=de,t,o)=>{const{kind:s,metadata:r}=o;let i=globalThis.litPropertyMetadata.get(r);if(void 0===i&&globalThis.litPropertyMetadata.set(r,i=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),i.set(o.name,e),"accessor"===s){const{name:s}=o;return{set(o){const r=t.get.call(this);t.set.call(this,o),this.requestUpdate(s,r,e,!0,o)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=o;return function(o){const r=this[s];t.call(this,o),this.requestUpdate(s,r,e,!0,o)}}throw Error("Unsupported decorator location: "+s)};function pe(e){return(t,o)=>"object"==typeof o?he(e,t,o):((e,t,o)=>{const s=t.hasOwnProperty(o);return t.constructor.createProperty(o,e),s?Object.getOwnPropertyDescriptor(t,o):void 0})(e,t,o)}function ue(e){return pe({...e,state:!0,attribute:!1})}const me=n`
  :host {
    display: block;
  }

  ha-card {
    padding: 16px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .card-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .zone-count {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    opacity: 0.7;
  }

  .weather-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    margin-bottom: 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(2, 136, 209, 0.28), rgba(0, 150, 136, 0.18));
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .weather-main {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .weather-icon {
    font-size: 2rem;
  }

  .weather-temp {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--primary-text-color);
    line-height: 1.1;
  }

  .weather-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .weather-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.82rem;
    color: var(--secondary-text-color);
    text-align: right;
  }

  .floor-section {
    margin-bottom: 20px;
  }

  .floor-section:last-child {
    margin-bottom: 0;
  }

  .floor-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .floor-name {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--primary-color, #0288d1);
  }

  .floor-meta {
    font-size: 0.72rem;
    color: var(--secondary-text-color);
  }

  .zones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
    margin-bottom: 12px;
  }

  .zone-card {
    padding: 14px;
    border-radius: 14px;
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-left: 3px solid var(--primary-color, #0288d1);
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
    cursor: pointer;
  }

  .zone-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  }

  .zone-card.expanded {
    border-color: var(--primary-color, #0288d1);
    box-shadow: 0 0 0 1px var(--primary-color, #0288d1);
  }

  .zone-card.floor_heat {
    border-left-color: #ff7043;
  }

  .zone-card.thermostat {
    border-left-color: #42a5f5;
  }

  .zone-card.mode-heat {
    background: linear-gradient(180deg, rgba(255, 112, 67, 0.08), transparent 60%);
  }

  .zone-card.mode-cool {
    background: linear-gradient(180deg, rgba(66, 165, 245, 0.08), transparent 60%);
  }

  .zone-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .zone-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .zone-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--primary-text-color);
  }

  .zone-kind-badge {
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.08);
    color: var(--secondary-text-color);
  }

  .zone-mode {
    font-size: 0.7rem;
    text-transform: uppercase;
    margin-top: 4px;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
  }

  .zone-mode.mode-heat { color: #ff7043; }
  .zone-mode.mode-cool { color: #42a5f5; }
  .zone-mode.mode-auto { color: #26a69a; }

  .zone-temps {
    text-align: right;
  }

  .current-temp {
    font-size: 1.45rem;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .target-temp {
    display: block;
    font-size: 0.8rem;
    color: var(--secondary-text-color);
  }

  .temp-delta {
    display: inline-block;
    margin-top: 4px;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 999px;
  }

  .temp-delta.above {
    background: rgba(255, 112, 67, 0.18);
    color: #ff7043;
  }

  .temp-delta.below {
    background: rgba(66, 165, 245, 0.18);
    color: #42a5f5;
  }

  .temp-delta.at {
    background: rgba(38, 166, 154, 0.18);
    color: #26a69a;
  }

  .zone-sensors {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    margin-bottom: 4px;
  }

  .sensor-row {
    display: flex;
    gap: 6px;
    font-size: 0.78rem;
  }

  .sensor-label {
    color: var(--secondary-text-color);
  }

  .sensor-value {
    color: var(--primary-text-color);
    font-weight: 500;
  }

  .room-sensors-block {
    margin-top: 4px;
  }

  .room-sensors-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }

  .room-sensors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
  }

  .room-sensor-chip {
    padding: 10px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .room-sensor-name {
    font-size: 0.78rem;
    color: var(--secondary-text-color);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .room-sensor-temp {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .room-sensor-area {
    font-size: 0.65rem;
    color: var(--secondary-text-color);
    opacity: 0.75;
    margin-top: 2px;
  }

  .zone-controls {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .mode-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }

  .mode-btn {
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: transparent;
    color: var(--secondary-text-color);
    font-size: 0.72rem;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
  }

  .mode-btn:hover {
    border-color: var(--primary-color, #0288d1);
    color: var(--primary-text-color);
  }

  .mode-btn.active {
    color: white;
  }

  .mode-btn.active.mode-heat { background: #ff7043; border-color: #ff7043; }
  .mode-btn.active.mode-cool { background: #42a5f5; border-color: #42a5f5; }
  .mode-btn.active.mode-auto { background: #26a69a; border-color: #26a69a; }
  .mode-btn.active.mode-off { background: #616161; border-color: #616161; }

  .setpoint-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .step-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    color: var(--primary-text-color);
    font-size: 1.2rem;
    cursor: pointer;
    transition: background 0.15s;
  }

  .step-btn:hover {
    background: var(--primary-color, #0288d1);
    border-color: var(--primary-color, #0288d1);
    color: white;
  }

  .setpoint-display {
    font-size: 1.2rem;
    font-weight: 600;
    min-width: 48px;
    text-align: center;
    color: var(--primary-text-color);
  }

  .empty {
    text-align: center;
    padding: 24px;
    color: var(--secondary-text-color);
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    .weather-strip {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .weather-stats {
      flex-direction: row;
      gap: 12px;
      text-align: left;
    }

    .zones-grid,
    .room-sensors-grid {
      grid-template-columns: 1fr;
    }
  }
`,fe=["deye","sunsynk","sol-ark","battery","oven","cavity","inverter","weather","tempest","wet bulb","dew point","feels like"],ge=[{name:"Main Floor",zones:["Laundry","Living Room","Main Area","Redmond Thermostat"],room_sensors:["Family Room","Kitchen","Hallway","Stairs","Entryway","Primary Bath","Primary Bedroom"]},{name:"Upper Floor",zones:["Main Office"],room_sensors:["Hunters","Sydney","Upstair Office","Upstairs Office"]}];function _e(e){const t=e.trim().split(/\s+/);if(t.length>=2&&t.length%2==0){const e=t.length/2;if(t.slice(0,e).join(" ")===t.slice(e).join(" "))return t.slice(0,e).join(" ")}return e}function ve(e){return e.toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function ye(e){return e.attributes.friendly_name??e.entity_id}function be(e,t){const o=e.entities?.[t];if(!o?.area_id)return;const s=e.areas;return s?.[o.area_id]?.name}function $e(e){if(!e||"unavailable"===e.state||"unknown"===e.state)return;const t=parseFloat(e.state);return isNaN(t)?void 0:Math.round(10*t)/10}function xe(e,t){if(t)return e.states[t]}function we(e,t,o=[]){const s=`${ve(e)} ${ve(t)}`;return[...fe,...o].some(e=>s.includes(ve(e)))}function Ae(e,t,o,s){const r=ve(e),i=ve(o),n=ve(t),a=ve(s);let l=0;return(r.includes(i)||n.includes(i.replace(/\s+/g,"_")))&&(l+=3),r.includes(a)&&(l+=4),"humidity"===a&&(e.includes("%")||t.includes("humidity"))&&(l+=2),l}function Se(e,t,o,s){let r;for(const i of Object.values(e.states)){if(!i.entity_id.startsWith("sensor."))continue;if(i.attributes.device_class!==s)continue;const e=ye(i);if(we(e,i.entity_id))continue;const n=Ae(e,i.entity_id,t,o);n>=5&&(!r||n>r.score)&&(r={id:i.entity_id,score:n})}return r?.id}function ze(e,t,o){if(null!=o.floor)return"floor_heat";if(ve(t.name).includes("thermostat"))return"thermostat";const s=xe(e,t.climate_entity);return(s?.attributes.hvac_modes??[]).includes("heat_cool")?"thermostat":"floor_heat"}function Ee(e,t){const o=t.zones?.length?t.zones:t.auto_discover?function(e){return Object.values(e.states).filter(e=>e.entity_id.startsWith("climate.")).map(e=>({name:_e(e.attributes.friendly_name??e.entity_id.replace("climate.","").replace(/_/g," ")),climate_entity:e.entity_id})).sort((e,t)=>e.name.localeCompare(t.name))}(e):[];return o.map(t=>{const o=function(e,t){const o=xe(e,t.floor_sensor??Se(e,t.name,"floor temperature","temperature")),s=xe(e,t.room_sensor??Se(e,t.name,"room temperature","temperature")),r=xe(e,t.humidity_sensor??Se(e,t.name,"humidity","humidity"));return{floor:$e(o),room:$e(s),humidity:$e(r)}}(e,t);return{name:t.name,climate_entity:t.climate_entity,floor:t.floor,kind:ze(e,t,o),sensors:o}})}function Ce(e,t,o){const s=ve(`${e} ${t??""}`);for(const e of o){const t=e.zones?.some(e=>s.includes(ve(e))),o=e.room_sensors?.some(e=>s.includes(ve(e)));if(t||o)return e.name}return/office|hunter|sydney|upstair|primary bed|primary bath/.test(s)?"Upper Floor":"Main Floor"}function ke(e,t){const o=ve(e);return!o.includes("floor temperature")&&!o.includes("room temperature")&&((!o.includes("current temperature")||!o.includes("thermostat"))&&!(!o.includes("temperature")&&!t.includes("temperature")))}function Pe(e,t){const o=t.floors??ge,s=Ee(e,t),r=function(e,t,o){if(!1===t.show_room_sensors)return[];if(t.room_sensors?.length){const o=[];for(const s of t.room_sensors){const r=xe(e,s);if(!r)continue;const i=t.floors??ge,n=be(e,s),a=_e(ye(r).replace(/\s+temperature$/i,""));o.push({name:a,entity_id:s,area:n,floor:Ce(a,n,i),temperature:$e(r)})}return o}const s=new Set;for(const e of t.zones??[])e.floor_sensor&&s.add(e.floor_sensor),e.room_sensor&&s.add(e.room_sensor),e.humidity_sensor&&s.add(e.humidity_sensor);for(const t of Object.values(e.states))if(t.entity_id.startsWith("sensor.")&&"temperature"===t.attributes.device_class&&o.find(e=>ve(ye(t)).includes(ve(e.name)))){const e=ve(ye(t));(e.includes("floor temperature")||e.includes("room temperature")||e.includes("humidity"))&&s.add(t.entity_id)}const r=t.floors??ge,i=[];for(const t of Object.values(e.states)){if(!t.entity_id.startsWith("sensor."))continue;if("temperature"!==t.attributes.device_class)continue;if(s.has(t.entity_id))continue;const o=ye(t);if(we(o,t.entity_id))continue;if(!ke(o,t.entity_id))continue;const n=_e(o.replace(/\s+temperature$/i,"")),a=be(e,t.entity_id);i.push({name:n,entity_id:t.entity_id,area:a,floor:Ce(n,a,r),temperature:$e(t)})}return i.sort((e,t)=>e.name.localeCompare(t.name))}(e,t,s);if(!(!1!==t.group_by_floor))return[{name:"Climate Zones",zones:s,roomSensors:r}];const i=new Map;for(const e of o)i.set(e.name,{name:e.name,zones:[],roomSensors:[]});const n={name:"Other",zones:[],roomSensors:[]},a=t=>{if(t.floor)return t.floor;for(const e of o)if(e.zones?.some(e=>ve(t.name).includes(ve(e))||ve(e).includes(ve(t.name))))return e.name;return Ce(t.name,be(e,t.climate_entity),o)};for(const e of s){const t=a(e),o=i.get(t);o?o.zones.push(e):n.zones.push(e)}for(const e of r){const t=i.get(e.floor??"");t?t.roomSensors.push(e):n.roomSensors.push(e)}const l=o.map(e=>i.get(e.name)).filter(e=>e.zones.length||e.roomSensors.length);return(n.zones.length||n.roomSensors.length)&&l.push(n),l}let Oe=class extends ae{setConfig(e){this._config={auto_discover:!0,show_weather:!0,...e}}_valueChanged(e,t){const o=new CustomEvent("config-changed",{detail:{config:{...this._config,[e]:t}}});this.dispatchEvent(o)}_zoneChanged(e,t,o){const s=[...this._config.zones??[]];s[e]={...s[e],[t]:o},this._valueChanged("zones",s),this._valueChanged("auto_discover",!1)}_addZone(){const e=[...this._config.zones??[],{name:"New Zone",climate_entity:""}];this._valueChanged("zones",e),this._valueChanged("auto_discover",!1)}_removeZone(e){const t=(this._config.zones??[]).filter((t,o)=>o!==e);this._valueChanged("zones",t)}_climateEntities(){return Object.keys(this.hass.states).filter(e=>e.startsWith("climate."))}_sensorEntities(){return Object.keys(this.hass.states).filter(e=>e.startsWith("sensor."))}render(){return this.hass?B`
      <div class="editor">
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            .value=${this._config.title??"Climate Command Center"}
            @change=${e=>this._valueChanged("title",e.target.value)}
          />
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.auto_discover??!0}
              @change=${e=>this._valueChanged("auto_discover",e.target.checked)}
            />
            Auto-discover climate entities
          </label>
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.show_weather??!0}
              @change=${e=>this._valueChanged("show_weather",e.target.checked)}
            />
            Show weather strip
          </label>
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.show_room_sensors??!0}
              @change=${e=>this._valueChanged("show_room_sensors",e.target.checked)}
            />
            Show room sensors
          </label>
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.group_by_floor??!0}
              @change=${e=>this._valueChanged("group_by_floor",e.target.checked)}
            />
            Group by floor
          </label>
        </div>

        ${this._config.auto_discover??1?"":B`
              <div class="zones-section">
                <div class="section-header">
                  <span>Zones</span>
                  <button @click=${this._addZone}>+ Add Zone</button>
                </div>
                ${(this._config.zones??[]).map((e,t)=>B`
                    <div class="zone-editor">
                      <input
                        type="text"
                        placeholder="Zone name"
                        .value=${e.name}
                        @change=${e=>this._zoneChanged(t,"name",e.target.value)}
                      />
                      <select
                        .value=${e.climate_entity}
                        @change=${e=>this._zoneChanged(t,"climate_entity",e.target.value)}
                      >
                        <option value="">Select climate entity</option>
                        ${this._climateEntities().map(e=>B`<option value=${e}>${e}</option>`)}
                      </select>
                      <select
                        .value=${e.floor_sensor??""}
                        @change=${e=>this._zoneChanged(t,"floor_sensor",e.target.value)}
                      >
                        <option value="">Floor sensor (auto)</option>
                        ${this._sensorEntities().map(e=>B`<option value=${e}>${e}</option>`)}
                      </select>
                      <button class="remove" @click=${()=>this._removeZone(t)}>Remove</button>
                    </div>
                  `)}
              </div>
            `}
      </div>
    `:B``}static get styles(){return[n`
        .editor {
          padding: 8px;
        }
        .field {
          margin-bottom: 12px;
        }
        .field label {
          display: block;
          font-size: 0.85rem;
          margin-bottom: 4px;
          color: var(--primary-text-color);
        }
        .field input[type='text'] {
          width: 100%;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid var(--divider-color);
          background: var(--card-background-color);
          color: var(--primary-text-color);
        }
        .checkbox label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 16px 0 8px;
          font-weight: 600;
        }
        .section-header button {
          padding: 4px 12px;
          border-radius: 4px;
          border: none;
          background: var(--primary-color);
          color: white;
          cursor: pointer;
        }
        .zone-editor {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px;
          margin-bottom: 8px;
          border-radius: 8px;
          background: var(--secondary-background-color);
        }
        .zone-editor select,
        .zone-editor input {
          padding: 6px;
          border-radius: 4px;
          border: 1px solid var(--divider-color);
          background: var(--card-background-color);
          color: var(--primary-text-color);
        }
        .remove {
          align-self: flex-end;
          padding: 4px 10px;
          border: none;
          border-radius: 4px;
          background: #c62828;
          color: white;
          cursor: pointer;
          font-size: 0.8rem;
        }
      `]}};e([pe({attribute:!1})],Oe.prototype,"hass",void 0),e([ue()],Oe.prototype,"_config",void 0),Oe=e([ce("climate-command-center-editor")],Oe);let Me=class extends ae{constructor(){super(...arguments),this._expandedZone=null}static get styles(){return me}setConfig(e){if(!e.zones?.length&&!e.auto_discover)throw new Error("Configure zones or enable auto_discover");this._config={title:"Climate Command Center",auto_discover:!0,show_weather:!0,show_room_sensors:!0,group_by_floor:!0,...e}}getCardSize(){return 6}get sections(){return Pe(this.hass,this._config)}get weather(){return this._config.show_weather?function(e,t){const o=(t,o="temperature")=>Object.values(e.states).find(e=>{const s=ve(ye(e));return e.entity_id.startsWith("sensor.")&&e.attributes.device_class===o&&(s.includes("weather")||s.includes("tempest"))&&s.includes(ve(t))})?.entity_id,s=xe(e,t.weather_temperature??o("temperature")??Object.values(e.states).find(e=>{const t=ve(ye(e));return e.entity_id.startsWith("sensor.")&&"temperature"===e.attributes.device_class&&t.includes("weather station")&&t.includes("temperature")&&!t.includes("wet bulb")&&!t.includes("dew")&&!t.includes("feels")})?.entity_id);return s?{label:ye(s).replace(/\s+(Temperature|Temp)$/i,"")||"Outside",temperature:$e(s),humidity:$e(xe(e,t.weather_humidity??o("humidity","humidity"))),feels_like:$e(xe(e,t.weather_feels_like??Object.values(e.states).find(e=>ve(ye(e)).includes("feels like"))?.entity_id)),dew_point:$e(xe(e,t.weather_dew_point??Object.values(e.states).find(e=>ve(ye(e)).includes("dew point"))?.entity_id))}:null}(this.hass,this._config):null}get totalZones(){return this.sections.reduce((e,t)=>e+t.zones.length,0)}callService(e,t,o){this.hass.callService(e,t,o)}setClimate(e,t){this.callService("climate","set_temperature",{entity_id:e,...t})}setHvacMode(e,t){this.callService("climate","set_hvac_mode",{entity_id:e,hvac_mode:t})}adjustSetpoint(e,t,o){const s=t??70;this.setClimate(e,{temperature:Math.round(s+o)})}toggleExpand(e){this._expandedZone=this._expandedZone===e?null:e}modeClass(e){return"heat"===e?"mode-heat":"cool"===e?"mode-cool":"heat_cool"===e?"mode-auto":"off"===e?"mode-off":""}tempDelta(e,t){if(null!=e&&null!=t)return Math.round(10*(e-t))/10}renderWeatherStrip(){const e=this.weather;return e?B`
      <div class="weather-strip">
        <div class="weather-main">
          <span class="weather-icon">🌤</span>
          <div>
            <div class="weather-temp">${e.temperature??"—"}°</div>
            <div class="weather-label">${e.label}</div>
          </div>
        </div>
        <div class="weather-stats">
          ${null!=e.humidity?B`<span>💧 ${Math.round(e.humidity)}%</span>`:""}
          ${null!=e.feels_like?B`<span>Feels ${Math.round(e.feels_like)}°</span>`:""}
          ${null!=e.dew_point?B`<span>Dew ${Math.round(e.dew_point)}°</span>`:""}
        </div>
      </div>
    `:null}renderSensorRow(e,t,o="°"){return B`
      <div class="sensor-row">
        <span class="sensor-label">${e}</span>
        <span class="sensor-value">${null!=t?`${t}${o}`:"—"}</span>
      </div>
    `}renderRoomSensor(e){return B`
      <div class="room-sensor-chip">
        <div class="room-sensor-name">${e.name}</div>
        <div class="room-sensor-temp">${e.temperature??"—"}°</div>
        ${e.area?B`<div class="room-sensor-area">${e.area}</div>`:""}
      </div>
    `}renderZone(e){const t=this.hass.states[e.climate_entity];if(!t)return B``;const o=t.attributes,s=o.current_temperature,r=o.temperature,i=o.humidity,n=t.state,a=this._expandedZone===e.climate_entity,l=e.sensors,c=this.tempDelta(s,r),d=o.hvac_modes??["heat","cool","heat_cool","off"];return B`
      <div class="zone-card ${a?"expanded":""} ${e.kind} ${this.modeClass(n)}">
        <div class="zone-header" @click=${()=>this.toggleExpand(e.climate_entity)}>
          <div class="zone-info">
            <div class="zone-name-row">
              <span class="zone-name">${e.name}</span>
              <span class="zone-kind-badge">${"floor_heat"===e.kind?"Floor":"HVAC"}</span>
            </div>
            <div class="zone-mode ${this.modeClass(n)}">${n.replace("_"," ")}</div>
          </div>
          <div class="zone-temps">
            <span class="current-temp">${s??"—"}°</span>
            <span class="target-temp">→ ${r??"—"}°</span>
            ${null!=c?B`<span class="temp-delta ${c>0?"above":c<0?"below":"at"}">
                  ${c>0?"+":""}${c}°
                </span>`:""}
          </div>
        </div>

        <div class="zone-sensors">
          ${null!=l.floor?this.renderSensorRow("Floor",l.floor):""}
          ${null!=l.room?this.renderSensorRow("Room",l.room):""}
          ${null!=i?this.renderSensorRow("Humidity",i,"%"):""}
          ${null!=l.humidity&&null==i?this.renderSensorRow("Humidity",l.humidity,"%"):""}
        </div>

        ${a?B`
              <div class="zone-controls">
                <div class="mode-buttons">
                  ${d.map(t=>B`
                      <button
                        class="mode-btn ${n===t?"active":""} ${this.modeClass(t)}"
                        @click=${o=>{o.stopPropagation(),this.setHvacMode(e.climate_entity,t)}}
                      >
                        ${t.replace("_","/")}
                      </button>
                    `)}
                </div>
                <div class="setpoint-controls">
                  <button
                    class="step-btn"
                    @click=${t=>{t.stopPropagation(),this.adjustSetpoint(e.climate_entity,r,-1)}}
                  >
                    −
                  </button>
                  <span class="setpoint-display">${r??"—"}°</span>
                  <button
                    class="step-btn"
                    @click=${t=>{t.stopPropagation(),this.adjustSetpoint(e.climate_entity,r,1)}}
                  >
                    +
                  </button>
                </div>
              </div>
            `:""}
      </div>
    `}renderFloorSection(e){return B`
      <section class="floor-section">
        <div class="floor-header">
          <span class="floor-name">${e.name}</span>
          <span class="floor-meta">
            ${e.zones.length?`${e.zones.length} zones`:""}
            ${e.zones.length&&e.roomSensors.length?" · ":""}
            ${e.roomSensors.length?`${e.roomSensors.length} sensors`:""}
          </span>
        </div>

        ${e.zones.length?B`<div class="zones-grid">${e.zones.map(e=>this.renderZone(e))}</div>`:""}

        ${e.roomSensors.length?B`
              <div class="room-sensors-block">
                <div class="room-sensors-label">Room Sensors</div>
                <div class="room-sensors-grid">
                  ${e.roomSensors.map(e=>this.renderRoomSensor(e))}
                </div>
              </div>
            `:""}
      </section>
    `}render(){const e=this.sections;return B`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title}</span>
          <span class="zone-count">${this.totalZones} zones</span>
        </div>
        ${this.renderWeatherStrip()}
        ${e.length?e.map(e=>this.renderFloorSection(e)):B`<div class="empty">No climate zones found. Check your configuration.</div>`}
      </ha-card>
    `}};e([pe({attribute:!1})],Me.prototype,"hass",void 0),e([pe({attribute:!1})],Me.prototype,"_config",void 0),e([ue()],Me.prototype,"_expandedZone",void 0),Me=e([ce("climate-command-center")],Me),window.customCards=window.customCards??[],window.customCards.push({type:"climate-command-center",name:"Climate Command Center",description:"Unified dashboard for thermostats, heated floors, and weather sensors",preview:!0}),console.info("%c CLIMATE-COMMAND-CENTER %c v0.2.0 ","color: white; background: #0288d1; font-weight: 700;","color: #0288d1; background: white; font-weight: 700;");const Ue=()=>Me,Re=()=>document.createElement("climate-command-center-editor");export{Me as ClimateCommandCenterCard,Ue as getCard,Re as getCardEditor};
