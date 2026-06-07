function e(e,t,o,r){var s,n=arguments.length,i=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,o,i):s(t,o))||i);return n>3&&i&&Object.defineProperty(t,o,i),i}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,o=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;let n=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const o=void 0!==t&&1===t.length;o&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&s.set(t,e))}return e}toString(){return this.cssText}};const i=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,o,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[r+1],e[0]);return new n(o,e,r)},a=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,r))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,f=globalThis,m=f.trustedTypes,g=m?m.emptyScript:"",_=f.reactiveElementPolyfillSupport,b=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},x=(e,t)=>!l(e,t),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),r=this.getPropertyDescriptor(e,o,t);void 0!==r&&c(this.prototype,e,r)}}static getPropertyDescriptor(e,t,o){const{get:r,set:s}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){const n=r?.call(this);s?.call(this,t),this.requestUpdate(e,n,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...p(e),...h(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,r)=>{if(o)e.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const o of r){const r=document.createElement("style"),s=t.litNonce;void 0!==s&&r.setAttribute("nonce",s),r.textContent=o.cssText,e.appendChild(r)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,o);if(void 0!==r&&!0===o.reflect){const s=(void 0!==o.converter?.toAttribute?o.converter:v).toAttribute(t,o.type);this._$Em=e,null==s?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(e,t){const o=this.constructor,r=o._$Eh.get(e);if(void 0!==r&&this._$Em!==r){const e=o.getPropertyOptions(r),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=r;const n=s.fromAttribute(t,e.type);this[r]=n??this._$Ej?.get(r)??n,this._$Em=null}}requestUpdate(e,t,o,r=!1,s){if(void 0!==e){const n=this.constructor;if(!1===r&&(s=this[e]),o??=n.getPropertyOptions(e),!((o.hasChanged??x)(s,t)||o.useDefault&&o.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:r,wrapped:s},n){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==s||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,r=this[t];!0!==e||this._$AL.has(t)||void 0===r||this.C(t,void 0,o,r)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[b("elementProperties")]=new Map,$[b("finalized")]=new Map,_?.({ReactiveElement:$}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,z=e=>e,k=w.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+C,H=`<${E}>`,O=document,P=()=>O.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,F="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,N=/>/g,j=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),Z=/'/g,L=/"/g,D=/^(?:script|style|textarea|title)$/i,W=(e=>(t,...o)=>({_$litType$:e,strings:t,values:o}))(1),B=Symbol.for("lit-noChange"),I=Symbol.for("lit-nothing"),q=new WeakMap,V=O.createTreeWalker(O,129);function K(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const G=(e,t)=>{const o=e.length-1,r=[];let s,n=2===t?"<svg>":3===t?"<math>":"",i=U;for(let t=0;t<o;t++){const o=e[t];let a,l,c=-1,d=0;for(;d<o.length&&(i.lastIndex=d,l=i.exec(o),null!==l);)d=i.lastIndex,i===U?"!--"===l[1]?i=R:void 0!==l[1]?i=N:void 0!==l[2]?(D.test(l[2])&&(s=RegExp("</"+l[2],"g")),i=j):void 0!==l[3]&&(i=j):i===j?">"===l[0]?(i=s??U,c=-1):void 0===l[1]?c=-2:(c=i.lastIndex-l[2].length,a=l[1],i=void 0===l[3]?j:'"'===l[3]?L:Z):i===L||i===Z?i=j:i===R||i===N?i=U:(i=j,s=void 0);const p=i===j&&e[t+1].startsWith("/>")?" ":"";n+=i===U?o+H:c>=0?(r.push(a),o.slice(0,c)+S+o.slice(c)+C+p):o+C+(-2===c?t:p)}return[K(e,n+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),r]};class J{constructor({strings:e,_$litType$:t},o){let r;this.parts=[];let s=0,n=0;const i=e.length-1,a=this.parts,[l,c]=G(e,t);if(this.el=J.createElement(l,o),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(r=V.nextNode())&&a.length<i;){if(1===r.nodeType){if(r.hasAttributes())for(const e of r.getAttributeNames())if(e.endsWith(S)){const t=c[n++],o=r.getAttribute(e).split(C),i=/([.?@])?(.*)/.exec(t);a.push({type:1,index:s,name:i[2],strings:o,ctor:"."===i[1]?te:"?"===i[1]?oe:"@"===i[1]?re:ee}),r.removeAttribute(e)}else e.startsWith(C)&&(a.push({type:6,index:s}),r.removeAttribute(e));if(D.test(r.tagName)){const e=r.textContent.split(C),t=e.length-1;if(t>0){r.textContent=k?k.emptyScript:"";for(let o=0;o<t;o++)r.append(e[o],P()),V.nextNode(),a.push({type:2,index:++s});r.append(e[t],P())}}}else if(8===r.nodeType)if(r.data===E)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=r.data.indexOf(C,e+1));)a.push({type:7,index:s}),e+=C.length-1}s++}}static createElement(e,t){const o=O.createElement("template");return o.innerHTML=e,o}}function X(e,t,o=e,r){if(t===B)return t;let s=void 0!==r?o._$Co?.[r]:o._$Cl;const n=T(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(e),s._$AT(e,o,r)),void 0!==r?(o._$Co??=[])[r]=s:o._$Cl=s),void 0!==s&&(t=X(e,s._$AS(e,t.values),s,r)),t}class Y{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,r=(e?.creationScope??O).importNode(t,!0);V.currentNode=r;let s=V.nextNode(),n=0,i=0,a=o[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new Q(s,s.nextSibling,this,e):1===a.type?t=new a.ctor(s,a.name,a.strings,this,e):6===a.type&&(t=new se(s,this,e)),this._$AV.push(t),a=o[++i]}n!==a?.index&&(s=V.nextNode(),n++)}return V.currentNode=O,r}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,r){this.type=2,this._$AH=I,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),T(e)?e===I||null==e||""===e?(this._$AH!==I&&this._$AR(),this._$AH=I):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==I&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,r="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=J.createElement(K(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===r)this._$AH.p(t);else{const e=new Y(r,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new J(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,r=0;for(const s of e)r===t.length?t.push(o=new Q(this.O(P()),this.O(P()),this,this.options)):o=t[r],o._$AI(s),r++;r<t.length&&(this._$AR(o&&o._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=z(e).nextSibling;z(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,r,s){this.type=1,this._$AH=I,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=s,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=I}_$AI(e,t=this,o,r){const s=this.strings;let n=!1;if(void 0===s)e=X(this,e,t,0),n=!T(e)||e!==this._$AH&&e!==B,n&&(this._$AH=e);else{const r=e;let i,a;for(e=s[0],i=0;i<s.length-1;i++)a=X(this,r[o+i],t,i),a===B&&(a=this._$AH[i]),n||=!T(a)||a!==this._$AH[i],a===I?e=I:e!==I&&(e+=(a??"")+s[i+1]),this._$AH[i]=a}n&&!r&&this.j(e)}j(e){e===I?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===I?void 0:e}}class oe extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==I)}}class re extends ee{constructor(e,t,o,r,s){super(e,t,o,r,s),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??I)===B)return;const o=this._$AH,r=e===I&&o!==I||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==I&&(o===I||r);r&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const ne=w.litHtmlPolyfillSupport;ne?.(J,Q),(w.litHtmlVersions??=[]).push("3.3.3");const ie=globalThis;class ae extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const r=o?.renderBefore??t;let s=r._$litPart$;if(void 0===s){const e=o?.renderBefore??null;r._$litPart$=s=new Q(t.insertBefore(P(),e),e,void 0,o??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}ae._$litElement$=!0,ae.finalized=!0,ie.litElementHydrateSupport?.({LitElement:ae});const le=ie.litElementPolyfillSupport;le?.({LitElement:ae}),(ie.litElementVersions??=[]).push("4.2.2");const ce=e=>(t,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},de={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:x},pe=(e=de,t,o)=>{const{kind:r,metadata:s}=o;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===r&&((e=Object.create(e)).wrapped=!0),n.set(o.name,e),"accessor"===r){const{name:r}=o;return{set(o){const s=t.get.call(this);t.set.call(this,o),this.requestUpdate(r,s,e,!0,o)},init(t){return void 0!==t&&this.C(r,void 0,e,t),t}}}if("setter"===r){const{name:r}=o;return function(o){const s=this[r];t.call(this,o),this.requestUpdate(r,s,e,!0,o)}}throw Error("Unsupported decorator location: "+r)};function he(e){return(t,o)=>"object"==typeof o?pe(e,t,o):((e,t,o)=>{const r=t.hasOwnProperty(o);return t.constructor.createProperty(o,e),r?Object.getOwnPropertyDescriptor(t,o):void 0})(e,t,o)}function ue(e){return he({...e,state:!0,attribute:!1})}var fe,me;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(fe||(fe={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(me||(me={}));var ge=function(e,t,o,r){r=r||{},o=null==o?{}:o;var s=new Event(t,{bubbles:void 0===r.bubbles||r.bubbles,cancelable:Boolean(r.cancelable),composed:void 0===r.composed||r.composed});return s.detail=o,e.dispatchEvent(s),s};const _e=i`
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

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .edit-sensors-btn {
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    color: var(--secondary-text-color);
    font-size: 0.72rem;
    cursor: pointer;
  }

  .edit-sensors-btn.active {
    background: var(--primary-color, #0288d1);
    border-color: var(--primary-color, #0288d1);
    color: white;
  }

  .edit-hint {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    margin: -4px 0 12px;
    padding: 8px 10px;
    border-radius: 8px;
    background: rgba(2, 136, 209, 0.1);
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

  .zone-status-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
    flex-wrap: wrap;
  }

  .zone-mode {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
  }

  .zone-mode.mode-heat { color: #ff7043; }
  .zone-mode.mode-cool { color: #42a5f5; }
  .zone-mode.mode-auto { color: #26a69a; }

  .zone-action {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 1px 6px;
    border-radius: 4px;
  }

  .zone-action.action-heating {
    background: rgba(255, 112, 67, 0.18);
    color: #ff7043;
  }

  .zone-action.action-cooling {
    background: rgba(66, 165, 245, 0.18);
    color: #42a5f5;
  }

  .zone-action.action-idle {
    background: rgba(255, 255, 255, 0.06);
    color: var(--secondary-text-color);
  }

  .zone-action.action-off {
    background: rgba(255, 255, 255, 0.04);
    color: var(--secondary-text-color);
    opacity: 0.7;
  }

  .zone-card.action-heating {
    border-left-color: #ff7043;
    border-left-width: 4px;
  }

  .zone-card.action-cooling {
    border-left-color: #42a5f5;
    border-left-width: 4px;
  }

  .zone-area-label {
    font-size: 0.68rem;
    color: var(--secondary-text-color);
    margin-top: 2px;
    opacity: 0.85;
  }

  .zone-floor-edit,
  .zone-area-edit {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 0.68rem;
    color: var(--secondary-text-color);
  }

  .zone-floor-edit select,
  .zone-area-edit select {
    max-width: 160px;
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-size: 0.68rem;
  }

  .zone-area-sensors {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .zone-temps {
    text-align: right;
  }

  .temp-target-row {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .target-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
    opacity: 0.8;
  }

  .target-temp {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .zone-temp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 6px;
    margin: 8px 0;
    padding: 8px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .temp-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 4px;
    border-radius: 6px;
  }

  .temp-cell-label {
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-text-color);
    margin-bottom: 2px;
  }

  .temp-cell-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .temp-cell-target {
    background: rgba(255, 255, 255, 0.05);
    border: 1px dashed rgba(255, 255, 255, 0.1);
  }

  .temp-cell-target .temp-cell-value {
    color: var(--secondary-text-color);
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

  .height-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    margin: 6px 0 8px;
    padding: 6px 8px;
    border-radius: 8px;
    background: rgba(2, 136, 209, 0.08);
    border: 1px solid rgba(2, 136, 209, 0.15);
    font-size: 0.72rem;
    color: var(--secondary-text-color);
  }

  .height-stats-meta {
    opacity: 0.7;
  }

  .height-badge {
    display: inline-block;
    margin-left: 4px;
    padding: 0 4px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
    font-size: 0.58rem;
    color: var(--secondary-text-color);
    vertical-align: middle;
  }

  .height-edit,
  .zone-height-edit {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    font-size: 0.68rem;
    color: var(--secondary-text-color);
  }

  .height-edit input,
  .zone-height-edit input {
    width: 52px;
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-size: 0.72rem;
  }

  .zone-height-edit {
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    margin-bottom: 8px;
  }

  .room-sensor-chip {
    padding: 8px 10px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .other-sensors-box {
    margin-top: 6px;
    padding: 6px 8px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.12);
    border: 1px dashed rgba(255, 255, 255, 0.08);
  }

  .other-sensors-label,
  .unassigned-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--secondary-text-color);
    opacity: 0.75;
    margin-bottom: 4px;
  }

  .other-sensors-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
  }

  .other-sensor-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.03);
    font-size: 0.62rem;
    line-height: 1.2;
    max-width: 100%;
  }

  .other-sensor-name {
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }

  .other-sensor-value {
    color: var(--primary-text-color);
    font-weight: 600;
    white-space: nowrap;
  }

  .sensor-assign-select {
    width: 100%;
    margin-top: 4px;
    font-size: 0.65rem;
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color);
    color: var(--primary-text-color);
  }

  .other-sensor-chip .sensor-assign-select {
    margin-top: 2px;
    font-size: 0.58rem;
    min-width: 100px;
  }

  .unassigned-block {
    margin-top: 10px;
    padding: 8px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.02);
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

  /* ── View toggle ── */
  .view-toggle {
    display: flex;
    gap: 0;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    overflow: hidden;
  }

  .view-btn {
    padding: 4px 12px;
    font-size: 0.75rem;
    font-weight: 500;
    background: transparent;
    border: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    transition: all 0.15s;
  }

  .view-btn.active {
    background: var(--primary-color, #0288d1);
    color: white;
  }

  .view-btn:hover:not(.active) {
    background: rgba(255, 255, 255, 0.05);
  }

  /* ── Floor Plan ── */
  .floor-plan-container {
    padding: 12px;
  }

  .fp-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .fp-toolbar-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .fp-toolbar-actions {
    display: flex;
    gap: 6px;
  }

  .fp-place-btn {
    padding: 4px 10px;
    font-size: 0.7rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
    transition: all 0.15s;
  }

  .fp-place-btn:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .fp-place-btn.active {
    background: var(--primary-color, #0288d1);
    color: white;
    border-color: var(--primary-color, #0288d1);
  }

  .fp-placing-hint {
    font-size: 0.75rem;
    color: var(--primary-color, #0288d1);
    text-align: center;
    padding: 4px 8px;
    margin-bottom: 6px;
    background: rgba(2, 136, 209, 0.08);
    border-radius: 6px;
  }

  .floor-plan-svg {
    width: 100%;
    height: auto;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .floor-plan-svg.placing {
    cursor: crosshair;
  }

  .fp-room-label {
    font-size: 12px;
    font-weight: 600;
    fill: var(--primary-text-color, #fff);
  }

  .fp-zone-tag {
    font-size: 8px;
    fill: var(--secondary-text-color, #aaa);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .fp-status {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .fp-heat { fill: #ff7043; }
  .fp-idle { fill: var(--secondary-text-color, #999); }
  .fp-off  { fill: #616161; }

  .fp-t-lbl {
    font-size: 7px;
    fill: var(--secondary-text-color, #999);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .fp-t-val {
    font-size: 13px;
    font-weight: 600;
    fill: var(--primary-text-color, #fff);
  }

  .fp-manifold-label {
    font-size: 7px;
    font-weight: 600;
    fill: #42a5f5;
    letter-spacing: 0.5px;
  }

  .fp-vent-label {
    font-size: 7px;
    fill: rgba(255, 255, 255, 0.3);
  }

  /* Thermostat markers on plan */
  .fp-thermostat {
    cursor: default;
  }

  .fp-tstat-icon {
    font-size: 10px;
    font-weight: 700;
    fill: white;
  }

  .fp-tstat-temp {
    font-size: 11px;
    font-weight: 600;
    fill: var(--primary-text-color, #fff);
  }

  .fp-tstat-name {
    font-size: 8px;
    fill: var(--secondary-text-color, #aaa);
  }

  /* Thermostat editor list */
  .fp-tstat-list {
    margin-top: 12px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .fp-tstat-list-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .fp-tstat-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .fp-tstat-row:last-child {
    border-bottom: none;
  }

  .fp-tstat-badge {
    font-size: 0.65rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    flex-shrink: 0;
  }

  .fp-tstat-badge.wall {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  .fp-tstat-badge.floor {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
  }

  .fp-tstat-input {
    flex: 1;
    min-width: 80px;
    padding: 4px 8px;
    font-size: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    color: var(--primary-text-color);
  }

  .fp-tstat-select {
    flex: 1;
    min-width: 120px;
    padding: 4px 6px;
    font-size: 0.7rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    color: var(--primary-text-color);
  }

  .fp-tstat-pos {
    font-size: 0.65rem;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  .fp-tstat-del {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 82, 82, 0.1);
    color: #ff5252;
    font-size: 0.7rem;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .fp-tstat-del:hover {
    background: rgba(255, 82, 82, 0.3);
  }

  /* Legend bar */
  .fp-legend-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 10px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.12);
    border-radius: 6px;
  }

  .fp-legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.7rem;
    color: var(--secondary-text-color);
  }

  .fp-legend-swatch {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    border: 1.5px solid;
    flex-shrink: 0;
  }

  .fp-legend-circle {
    border-radius: 50%;
    background: transparent !important;
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

    .floor-plan-svg {
      min-height: 280px;
    }

    .fp-summary {
      flex-direction: column;
    }
  }
`;function be(e,t,o){const r=t.sensor_heights?.[e];return null==r||Number.isNaN(r)?o?.isFloor?0:o?.isRoom?5:void 0:r}function ve(e,t,o){const r=t.reference_height_ft??5,s=function(e,t,o){const r=[],s=t.sensor_heights??{},n=t.zone_heights??{},i=(e,o,n,i)=>{if(null==o)return;const a=(n?s[n]:void 0)??be(n??"",t,i);null!=a&&r.push({label:e,temp:o,height_ft:a})};if(null!=e.sensors.floor&&i("Floor",e.sensors.floor,e.linked_sensor_ids?.floor,{isFloor:!0}),null!=e.sensors.room&&i("Room",e.sensors.room,e.linked_sensor_ids?.room,{isRoom:!0}),null!=o){const s=n[e.climate_entity]??t.reference_height_ft??5;r.push({label:"Thermostat",temp:o,height_ft:s})}for(const t of e.roomSensors)null!=t.value&&null!=t.height_ft&&r.push({label:t.name,temp:t.value,height_ft:t.height_ft});return r}(e,t,o);if(!s.length)return null;const n=Math.round(s.reduce((e,t)=>e+t.temp,0)/s.length*10)/10,{value:i,gradient:a}=function(e,t){if(!e.length)return{};if(1===e.length)return{value:e[0].temp};const o=e.length,r=e.reduce((e,t)=>e+t.height_ft,0),s=e.reduce((e,t)=>e+t.temp,0),n=e.reduce((e,t)=>e+t.height_ft*t.temp,0),i=e.reduce((e,t)=>e+t.height_ft*t.height_ft,0),a=o*i-r*r;if(Math.abs(a)<1e-6){const e=s/o;return{value:Math.round(10*e)/10}}const l=(o*n-r*s)/a,c=l*t+(s-l*r)/o;return{value:Math.round(10*c)/10,gradient:Math.round(100*l)/100}}(s,r);return{reference_height_ft:r,point_count:s.length,simple_average:n,estimated_at_reference:i,gradient_per_ft:a}}const xe=["deye","sunsynk","sol-ark","battery","oven","cavity","inverter","weather","tempest","wet bulb","dew point","feels like"],ye=["outlet","plug","switch","hallway","flex","unifi","usw","uap","udm","signal level","cloud connection","network","uptime","cpu","memory","mac","energy","power","voltage","current","consumption","co2","voc","aqi","auto-off","auto-update","led","overheated","smooth on","smooth off"],$e=[{name:"Main Floor",zones:["Laundry","Living Room","Main Area","Main Office","Redmond Thermostat"],room_sensors:["Family Room","Kitchen","Hallway","Stairs","Entryway","Primary Bath","Primary Bedroom"]},{name:"Upper Floor",zones:[],room_sensors:["Hunters","Sydney","Upstair Office","Upstairs Office"]}],we={office:"Main Floor","Main Office":"Main Floor",upstairs_office:"Upper Floor",upstairs_hallway:"Upper Floor",hunters_room:"Upper Floor",sidney_s_room:"Upper Floor","Upstairs Office":"Upper Floor","Upstairs Hallway":"Upper Floor","Hunters Room":"Upper Floor","Sidney's Room":"Upper Floor"},ze={};function ke(e,t){const o=Oe(e),r=Oe(t);if(o===r)return!0;const s=o.split(" "),n=r.split(" ");return s[0]===n[0]&&s.length>1&&n.length>1&&"main"===s[0]?s.slice(1).join(" ")===n.slice(1).join(" "):o.includes(r)||r.includes(o)}function Ae(e){const t=e.areas;return t?Object.entries(t).map(([e,t])=>({area_id:e,name:t.name??e})).filter(e=>!["weather","whole_house_energy"].includes(e.area_id)).sort((e,t)=>e.name.localeCompare(t.name)):[]}function Se(e){return(e.floors??$e).map(e=>e.name)}function Ce(e,t,o){const r=function(e){return{...we,...e.area_floor_map??{}}}(o);return e&&r[e]?r[e]:t&&r[t]?r[t]:void 0}function Ee(e,t,o=t.floors??$e){const r=function(e){return{...ze,...e.zone_floors??{}}}(t);if(r[e.climate_entity])return r[e.climate_entity];for(const t of o)if(t.zones?.some(t=>ke(e.name,t)))return t.name;const s=Ce(e.area_id,e.area,t);return s||(e.floor?e.floor:qe(e.name,e.area,o))}function He(e){const t=e.trim().split(/\s+/);if(t.length>=2&&t.length%2==0){const e=t.length/2;if(t.slice(0,e).join(" ")===t.slice(e).join(" "))return t.slice(0,e).join(" ")}return e}function Oe(e){return e.toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function Pe(e){return e.attributes.friendly_name??e.entity_id}function Te(e,t){const o=e.entities?.[t];if(o?.area_id)return o.area_id;const r=o?.device_id;if(r){const t=e.devices?.[r]?.area_id;if(t)return t}}function Me(e,t){if(!t)return;const o=e.areas;return o?.[t]?.name}function Fe(e){if(!e||"unavailable"===e.state||"unknown"===e.state)return;const t=parseFloat(e.state);return isNaN(t)?void 0:Math.round(10*t)/10}function Ue(e,t){if(t)return e.states[t]}function Re(e){const t=new Set(e.exclude_entities??[]);for(const o of e.sensor_assignments??[])o.hidden&&t.add(o.entity_id);return t}function Ne(e){const t=new Map(Object.entries(e.sensor_map??{}));for(const o of e.sensor_assignments??[])o.zone&&!o.hidden&&t.set(o.entity_id,o.zone);return t}function je(e,t,o=[]){const r=`${Oe(e)} ${Oe(t)}`;return[...xe,...o].some(e=>r.includes(Oe(e)))}function Ze(e){const t=Oe(e);return t.includes("floor temperature")||t.includes("room temperature")||t.includes("current temperature")&&t.includes("thermostat")}function Le(e,t,o,r){return function(e,t,o){const r=`${Oe(e)} ${Oe(t)}`;return o.some(e=>r.includes(Oe(e)))}(e,t,r)?"other":"temperature"===o||"humidity"===o?"room":"other"}function De(e,t,o,r){const s=Oe(e),n=Oe(o),i=Oe(t),a=Oe(r);let l=0;return(s.includes(n)||i.includes(n.replace(/\s+/g,"_")))&&(l+=3),s.includes(a)&&(l+=4),"humidity"===a&&(e.includes("%")||t.includes("humidity"))&&(l+=2),l}function We(e,t,o,r,s){const n=s?Te(e,s):void 0;let i;for(const s of Object.values(e.states)){if(!s.entity_id.startsWith("sensor."))continue;if(s.attributes.device_class!==r)continue;const a=Pe(s);if(je(a,s.entity_id))continue;let l=De(a,s.entity_id,t,o);n&&Te(e,s.entity_id)===n&&(l+=6),l>=5&&(!i||l>i.score)&&(i={id:s.entity_id,score:l})}return i?.id}function Be(e,t){return{floor:t.floor_sensor??We(e,t.name,"floor temperature","temperature",t.climate_entity),room:t.room_sensor??We(e,t.name,"room temperature","temperature",t.climate_entity),humidity:t.humidity_sensor??We(e,t.name,"humidity","humidity",t.climate_entity)}}function Ie(e,t,o){if(null!=o.floor)return"floor_heat";if(Oe(t.name).includes("thermostat"))return"thermostat";const r=Ue(e,t.climate_entity);return(r?.attributes.hvac_modes??[]).includes("heat_cool")?"thermostat":"floor_heat"}function qe(e,t,o){const r=Oe(`${e} ${t??""}`);for(const e of o){const t=e.zones?.some(e=>r.includes(Oe(e))),o=e.room_sensors?.some(e=>r.includes(Oe(e)));if(t||o)return e.name}return/hunter|sydney|upstair/.test(r)?"Upper Floor":"Main Floor"}function Ve(e,t,o,r){const s=Ue(e,t);if(!s)return;const n=s.attributes.device_class,i=Pe(s),a=He(i.replace(/\s+(temperature|humidity|temp)$/i,"")),l=s.attributes.unit_of_measurement??("humidity"===n?"%":"°"),c=Le(i,t,n,o),d=/floor/i.test(i)||/floor/i.test(t),p=Te(e,t);return{name:a,entity_id:t,area:Me(e,p),area_id:p,value:Fe(s),unit:l,kind:c,height_ft:be(t,r,{isFloor:d,isRoom:"room"===c&&!d})}}function Ke(e,t,o){if(t.room_sensors?.length)return[...t.room_sensors];const r=function(e,t,o){const r=new Set;for(const e of t.zones??[])e.floor_sensor&&r.add(e.floor_sensor),e.room_sensor&&r.add(e.room_sensor),e.humidity_sensor&&r.add(e.humidity_sensor);for(const s of o){const o=t.zones?.find(e=>e.climate_entity===s.climate_entity)??{name:s.name,climate_entity:s.climate_entity};for(const t of[o.floor_sensor??We(e,s.name,"floor temperature","temperature",s.climate_entity),o.room_sensor??We(e,s.name,"room temperature","temperature",s.climate_entity),o.humidity_sensor??We(e,s.name,"humidity","humidity",s.climate_entity)])t&&r.add(t)}return r}(e,t,o),s=[];for(const t of Object.values(e.states)){if(!t.entity_id.startsWith("sensor."))continue;const e=t.attributes.device_class;if("temperature"!==e&&"humidity"!==e)continue;if(r.has(t.entity_id))continue;const o=Pe(t);je(o,t.entity_id)||(Ze(o)||s.push(t.entity_id))}for(const e of Ne(t).keys())s.includes(e)||s.push(e);return s.sort()}function Ge(e,t){if(e.area_id){const o=t.find(t=>t.area_id&&t.area_id===e.area_id);if(o)return o}const o=t.find(t=>function(e,t){return!(!e||!t)&&Oe(e)===Oe(t)}(e.area,t.area));return o||t.find(t=>function(e,t){const o=Oe(e),r=Oe(t.name);return o.includes(r)||r.includes(o)}(e.name,t))}function Je(e,t,o){const r=Ne(o).get(e.entity_id);return r?function(e,t){return t.find(t=>t.climate_entity===e||Oe(t.name)===Oe(e)||Oe(t.climate_entity)===Oe(e))}(r,t):Ge(e,t)}function Xe(e,t){const o=t.zones?.length?t.zones:t.auto_discover?function(e){return Object.values(e.states).filter(e=>e.entity_id.startsWith("climate.")).map(t=>{const o=t.attributes.friendly_name??t.entity_id.replace("climate.","").replace(/_/g," "),r=Te(e,t.entity_id);return{name:He(o),climate_entity:t.entity_id,area:Me(e,r),area_id:r}}).sort((e,t)=>e.name.localeCompare(t.name))}(e):[];return o.map(t=>{const o=function(e,t){const o=Be(e,t),r=Ue(e,o.floor),s=Ue(e,o.room),n=Ue(e,o.humidity);return{floor:Fe(r),room:Fe(s),humidity:Fe(n)}}(e,t),r=t.area_id??Te(e,t.climate_entity),s=t.area??Me(e,r),n=Be(e,t);return{name:t.name,climate_entity:t.climate_entity,area:s,area_id:r,floor:t.floor,kind:Ie(e,t,o),sensors:o,roomSensors:[],otherSensors:[],linked_sensor_ids:n}})}function Ye(e,t){const o=t.floors??$e,r=Xe(e,t),{zones:s,unassigned:n}=function(e,t,o){if(!1===t.show_room_sensors)return{zones:o,unassigned:[]};const r=Re(t),s=t.other_sensor_patterns??ye,n=[],i=o.map(e=>({...e,roomSensors:[],otherSensors:[]}));for(const a of Ke(e,t,o)){if(r.has(a))continue;const o=Ve(e,a,s,t);if(!o||null==o.value)continue;const l=Je(o,i,t);if(!l){n.push(o);continue}const c=i.find(e=>e.climate_entity===l.climate_entity);"other"===o.kind?c.otherSensors.push(o):c.roomSensors.push(o)}for(const e of i)e.roomSensors.sort((e,t)=>e.name.localeCompare(t.name)),e.otherSensors.sort((e,t)=>e.name.localeCompare(t.name));return n.sort((e,t)=>e.name.localeCompare(t.name)),{zones:i,unassigned:n}}(e,t,r);if(!(!1!==t.group_by_floor))return[{name:"Climate Zones",zones:s,unassignedSensors:n}];const i=new Map;for(const e of o)i.set(e.name,{name:e.name,zones:[],unassignedSensors:[]});const a={name:"Other",zones:[],unassignedSensors:[]},l=e=>Ee(e,t,o);for(const e of s){const t=l(e),o=i.get(t);o?o.zones.push(e):a.zones.push(e)}for(const e of n){const r=Ce(e.area_id,e.area,t)??qe(e.name,e.area,o),s=i.get(r);s?s.unassignedSensors.push(e):a.unassignedSensors.push(e)}const c=o.map(e=>i.get(e.name)).filter(e=>e.zones.length||e.unassignedSensors.length);return(a.zones.length||a.unassignedSensors.length)&&c.push(a),c}let Qe=class extends ae{setConfig(e){this._config={auto_discover:!0,show_weather:!0,show_room_sensors:!0,group_by_floor:!0,allow_sensor_reassign:!0,reference_height_ft:5,...e}}_valueChanged(e,t){const o=new CustomEvent("config-changed",{detail:{config:{...this._config,[e]:t}}});this.dispatchEvent(o)}_zoneChanged(e,t,o){const r=[...this._config.zones??[]];r[e]={...r[e],[t]:o},this._valueChanged("zones",r),this._valueChanged("auto_discover",!1)}_addZone(){const e=[...this._config.zones??[],{name:"New Zone",climate_entity:""}];this._valueChanged("zones",e),this._valueChanged("auto_discover",!1)}_removeZone(e){const t=(this._config.zones??[]).filter((t,o)=>o!==e);this._valueChanged("zones",t)}_sensorAssignmentChanged(e,t){const o={...this._config.sensor_map??{}},r=new Set(this._config.exclude_entities??[]);"__hidden__"===t?(r.add(e),delete o[e]):"__auto__"===t?(r.delete(e),delete o[e]):(r.delete(e),o[e]=t),this._valueChanged("sensor_map",o),this._valueChanged("exclude_entities",[...r])}_climateEntities(){return Object.keys(this.hass.states).filter(e=>e.startsWith("climate."))}_sensorEntities(){return Object.keys(this.hass.states).filter(e=>e.startsWith("sensor."))}_zoneOptions(){return Xe(this.hass,this._config).map(e=>({id:e.climate_entity,name:`${e.name}${e.area?` (${e.area})`:""}`}))}_sensorHeightChanged(e,t){const o={...this._config.sensor_heights??{}},r=t.trim();if(r){const t=parseFloat(r);if(Number.isNaN(t)||t<0)return;o[e]=t}else delete o[e];this._valueChanged("sensor_heights",o)}_referenceHeightChanged(e){const t=parseFloat(e);Number.isNaN(t)||t<0||this._valueChanged("reference_height_ft",t)}_zoneFloorChanged(e,t){const o={...this._config.zone_floors??{}};"__default__"===t?delete o[e]:o[e]=t,this._valueChanged("zone_floors",o)}render(){if(!this.hass)return W``;const e=function(e,t){const o=Xe(e,t),r=Re(t),s=Ne(t),n=t.other_sensor_patterns??ye;return Ke(e,t,o).map(i=>{const a=Ve(e,i,n,t),l=s.get(i),c=a?Ge(a,o):void 0;return{entity_id:i,name:a?.name??i,area:a?.area,area_id:a?.area_id,value:a?.value,unit:a?.unit,kind:a?.kind??"other",assigned_zone:l,auto_zone:c?.climate_entity,auto_zone_name:c?.name,hidden:r.has(i),height_ft:a?.height_ft}})}(this.hass,this._config),t=Xe(this.hass,this._config),o=Ae(this.hass),r=Se(this._config);return W`
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
            Show area sensors with thermostats
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

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.allow_sensor_reassign??!0}
              @change=${e=>this._valueChanged("allow_sensor_reassign",e.target.checked)}
            />
            Allow sensor reassignment on dashboard
          </label>
        </div>

        <div class="field">
          <label>Reference height for averages (feet from floor)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            .value=${String(this._config.reference_height_ft??5)}
            @change=${e=>this._referenceHeightChanged(e.target.value)}
          />
        </div>

        <div class="sensors-section">
          <div class="section-header">
            <span>Sensor assignments</span>
            <span class="section-meta">${e.length} sensors</span>
          </div>
          <p class="help">
            Auto uses HA areas. Use the dashboard Assign mode to set HA areas on entities. Override zone or hide below.
          </p>
          ${e.map(e=>{const t=e.hidden?"__hidden__":e.assigned_zone??"__auto__",r=e.area?`Auto (HA: ${e.area}${e.auto_zone_name?` → ${e.auto_zone_name}`:""})`:e.auto_zone_name?`Auto (→ ${e.auto_zone_name})`:"Auto (by HA area)";return W`
              <div class="sensor-row-editor ${e.kind}">
                <div class="sensor-row-info">
                  <strong>${e.name}</strong>
                  <span class="sensor-meta">${e.entity_id}${e.area?` · HA area: ${e.area}`:" · no HA area"}</span>
                  <span class="sensor-kind">${"other"===e.kind?"gear/misc":"room"}</span>
                </div>
                <div class="sensor-row-controls">
                  <label class="height-field">
                    <span>Height</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="ft"
                      .value=${null!=e.height_ft?String(e.height_ft):""}
                      @change=${t=>this._sensorHeightChanged(e.entity_id,t.target.value)}
                    />
                  </label>
                  <select
                    .value=${t}
                    @change=${t=>this._sensorAssignmentChanged(e.entity_id,t.target.value)}
                  >
                    <option value="__auto__">${r}</option>
                    <optgroup label="HA Areas (set on dashboard)">
                      ${o.map(e=>W`<option disabled value=${`area:${e.area_id}`}>${e.name}</option>`)}
                    </optgroup>
                    <optgroup label="Climate zones">
                      ${this._zoneOptions().map(e=>W`<option value=${e.id}>${e.name}</option>`)}
                    </optgroup>
                    <option value="__hidden__">Hide</option>
                  </select>
                </div>
              </div>
            `})}
        </div>

        <div class="zones-section">
          <div class="section-header">
            <span>Zone floors</span>
            <span class="section-meta">${t.length} zones</span>
          </div>
          <p class="help">Override which floor section a climate zone appears in. Auto uses HA area mapping.</p>
          ${t.map(e=>W`
              <div class="zone-floor-row">
                <div>
                  <strong>${e.name}</strong>
                  <span class="sensor-meta">${e.area??"no HA area"}</span>
                </div>
                <select
                  .value=${this._config.zone_floors?.[e.climate_entity]??"__default__"}
                  @change=${t=>this._zoneFloorChanged(e.climate_entity,t.target.value)}
                >
                  <option value="__default__">Auto (from HA area)</option>
                  ${r.map(e=>W`<option value=${e}>${e}</option>`)}
                </select>
              </div>
            `)}
        </div>

        ${this._config.auto_discover??1?"":W`
              <div class="zones-section">
                <div class="section-header">
                  <span>Zones</span>
                  <button @click=${this._addZone}>+ Add Zone</button>
                </div>
                ${(this._config.zones??[]).map((e,t)=>W`
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
                        ${this._climateEntities().map(e=>W`<option value=${e}>${e}</option>`)}
                      </select>
                      <button class="remove" @click=${()=>this._removeZone(t)}>Remove</button>
                    </div>
                  `)}
              </div>
            `}
      </div>
    `}static get styles(){return i`
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
      .section-meta {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        font-weight: 400;
      }
      .help {
        font-size: 0.78rem;
        color: var(--secondary-text-color);
        margin: 0 0 8px;
      }
      .sensors-section {
        max-height: 320px;
        overflow-y: auto;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px;
        margin-bottom: 12px;
      }
      .sensor-row-editor {
        display: grid;
        grid-template-columns: 1fr 200px;
        gap: 8px;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      .sensor-row-controls {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .height-field {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.68rem;
        color: var(--secondary-text-color);
      }
      .height-field input {
        width: 56px;
        padding: 4px 6px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 0.72rem;
      }
      .field input[type='number'] {
        width: 100%;
        max-width: 120px;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }
      .sensor-row-editor.other {
        opacity: 0.85;
      }
      .sensor-row-info strong {
        display: block;
        font-size: 0.82rem;
      }
      .sensor-meta {
        display: block;
        font-size: 0.68rem;
        color: var(--secondary-text-color);
      }
      .sensor-kind {
        font-size: 0.62rem;
        text-transform: uppercase;
        color: var(--primary-color);
      }
      .sensor-row-editor select {
        padding: 6px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 0.75rem;
      }
      .zone-floor-row {
        display: grid;
        grid-template-columns: 1fr 160px;
        gap: 8px;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      .zone-floor-row select {
        padding: 6px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 0.75rem;
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
    `}};var et;e([he({attribute:!1})],Qe.prototype,"hass",void 0),e([ue()],Qe.prototype,"_config",void 0),Qe=e([ce("climate-command-center-editor")],Qe);let tt=et=class extends ae{constructor(){super(...arguments),this._expandedZone=null,this._editSensors=!1,this._view="floorplan",this._placingThermostat=null}static get styles(){return _e}setConfig(e){if(!e.zones?.length&&!e.auto_discover)throw new Error("Configure zones or enable auto_discover");this._config={title:"Climate Command Center",auto_discover:!0,show_weather:!0,show_room_sensors:!0,group_by_floor:!0,allow_sensor_reassign:!0,reference_height_ft:5,...e,floors:e.floors?.length?e.floors:$e}}getCardSize(){return 6}get sections(){return Ye(this.hass,this._config)}get weather(){return this._config.show_weather?function(e,t){const o=(t,o="temperature")=>Object.values(e.states).find(e=>{const r=Oe(Pe(e));return e.entity_id.startsWith("sensor.")&&e.attributes.device_class===o&&(r.includes("weather")||r.includes("tempest"))&&r.includes(Oe(t))})?.entity_id,r=Ue(e,t.weather_temperature??o("temperature")??Object.values(e.states).find(e=>{const t=Oe(Pe(e));return e.entity_id.startsWith("sensor.")&&"temperature"===e.attributes.device_class&&t.includes("weather station")&&t.includes("temperature")&&!t.includes("wet bulb")&&!t.includes("dew")&&!t.includes("feels")})?.entity_id);return r?{label:Pe(r).replace(/\s+(Temperature|Temp)$/i,"")||"Outside",temperature:Fe(r),humidity:Fe(Ue(e,t.weather_humidity??o("humidity","humidity"))),feels_like:Fe(Ue(e,t.weather_feels_like??Object.values(e.states).find(e=>Oe(Pe(e)).includes("feels like"))?.entity_id)),dew_point:Fe(Ue(e,t.weather_dew_point??Object.values(e.states).find(e=>Oe(Pe(e)).includes("dew point"))?.entity_id))}:null}(this.hass,this._config):null}get totalZones(){return this.sections.reduce((e,t)=>e+t.zones.length,0)}get zoneOptions(){return Xe(this.hass,this._config)}get haAreas(){return Ae(this.hass)}get floorOptions(){return Se(this._config)}async setEntityHaArea(e,t){const o=this.hass;o.callWS&&await o.callWS({type:"config/entity_registry/update",entity_id:e,area_id:t})}async updateSensorAssignment(e,t){if(t.startsWith("area:")){const o=t.slice(5);try{await this.setEntityHaArea(e,o)}catch(t){console.error("Failed to set HA area",e,o,t)}return void this.updateSensorMap(e,"__auto__")}this.updateSensorMap(e,t)}updateZoneFloor(e,t){const o={...this._config.zone_floors??{}};"__default__"===t?delete o[e]:o[e]=t;const r={...this._config,zone_floors:o};this._config=r,ge(this,"config-changed",{config:r})}async updateZoneHaArea(e,t){if(t)try{await this.setEntityHaArea(e,t)}catch(o){console.error("Failed to set zone HA area",e,t,o)}}callService(e,t,o){this.hass.callService(e,t,o)}setClimate(e,t){this.callService("climate","set_temperature",{entity_id:e,...t})}setHvacMode(e,t){this.callService("climate","set_hvac_mode",{entity_id:e,hvac_mode:t})}adjustSetpoint(e,t,o){const r=t??70;this.setClimate(e,{temperature:Math.round(r+o)})}toggleExpand(e){this._expandedZone=this._expandedZone===e?null:e}updateSensorMap(e,t){const o={...this._config.sensor_map??{}},r=new Set(this._config.exclude_entities??[]);"__hidden__"===t?(r.add(e),delete o[e]):"__auto__"===t?(r.delete(e),delete o[e]):(r.delete(e),o[e]=t);const s={...this._config,sensor_map:o,exclude_entities:[...r]};this._config=s,ge(this,"config-changed",{config:s})}updateSensorHeight(e,t){const o={...this._config.sensor_heights??{}},r=t.trim();if(r){const t=parseFloat(r);if(Number.isNaN(t)||t<0)return;o[e]=t}else delete o[e];const s={...this._config,sensor_heights:o};this._config=s,ge(this,"config-changed",{config:s})}updateZoneHeight(e,t){const o={...this._config.zone_heights??{}},r=t.trim();if(r){const t=parseFloat(r);if(Number.isNaN(t)||t<0)return;o[e]=t}else delete o[e];const s={...this._config,zone_heights:o};this._config=s,ge(this,"config-changed",{config:s})}renderHeightEditor(e,t){return this._editSensors?W`
      <label class="height-edit" @click=${e=>e.stopPropagation()}>
        <span>Height</span>
        <input
          type="number"
          min="0"
          step="0.5"
          placeholder="ft"
          .value=${null!=t?String(t):""}
          @change=${t=>this.updateSensorHeight(e,t.target.value)}
        />
        <span>ft</span>
      </label>
    `:null}renderHeightBadge(e){return null==e?null:W`<span class="height-badge">${e} ft</span>`}renderZoneHeightStats(e,t){const o=ve(e,this._config,t);return o?W`
      <div class="height-stats">
        <span>Avg ${o.simple_average??"—"}°</span>
        <span>
          Est. @ ${o.reference_height_ft} ft:
          ${o.estimated_at_reference??"—"}°
        </span>
        ${null!=o.gradient_per_ft?W`<span>${o.gradient_per_ft>0?"+":""}${o.gradient_per_ft}°/ft</span>`:""}
        <span class="height-stats-meta">${o.point_count} height points</span>
      </div>
    `:null}modeClass(e){return"heat"===e?"mode-heat":"cool"===e?"mode-cool":"heat_cool"===e?"mode-auto":"off"===e?"mode-off":""}actionLabel(e){return e&&"off"!==e?"heating"===e?"Heating":"cooling"===e?"Cooling":"idle"===e?"Idle":"drying"===e?"Drying":"fan"===e?"Fan":e:"Off"}actionClass(e){return"heating"===e?"action-heating":"cooling"===e?"action-cooling":"idle"===e?"action-idle":"action-off"}tempDelta(e,t){if(null!=e&&null!=t)return Math.round(10*(e-t))/10}renderWeatherStrip(){const e=this.weather;return e?W`
      <div class="weather-strip">
        <div class="weather-main">
          <span class="weather-icon">🌤</span>
          <div>
            <div class="weather-temp">${e.temperature??"—"}°</div>
            <div class="weather-label">${e.label}</div>
          </div>
        </div>
        <div class="weather-stats">
          ${null!=e.humidity?W`<span>💧 ${Math.round(e.humidity)}%</span>`:""}
          ${null!=e.feels_like?W`<span>Feels ${Math.round(e.feels_like)}°</span>`:""}
          ${null!=e.dew_point?W`<span>Dew ${Math.round(e.dew_point)}°</span>`:""}
        </div>
      </div>
    `:null}renderSensorRow(e,t,o="°"){return W`
      <div class="sensor-row">
        <span class="sensor-label">${e}</span>
        <span class="sensor-value">${null!=t?`${t}${o}`:"—"}</span>
      </div>
    `}renderSensorAssign(e){if(!this._editSensors)return null;const t=this._config.sensor_map?.[e.entity_id]??(this._config.exclude_entities?.includes(e.entity_id)?"__hidden__":"__auto__"),o=Ge(e,this.zoneOptions),r=e.area?`Auto (HA: ${e.area}${o?` → ${o.name}`:""})`:o?`Auto (→ ${o.name})`:"Auto (by HA area)";return W`
      <select
        class="sensor-assign-select"
        .value=${t}
        @change=${t=>{this.updateSensorAssignment(e.entity_id,t.target.value)}}
        @click=${e=>e.stopPropagation()}
      >
        <option value="__auto__">${r}</option>
        <optgroup label="HA Areas (updates Home Assistant)">
          ${this.haAreas.map(e=>W`<option value=${`area:${e.area_id}`}>${e.name}</option>`)}
        </optgroup>
        <optgroup label="Climate zones">
          ${this.zoneOptions.map(e=>W`<option value=${e.climate_entity}>${e.name}${e.area?` (${e.area})`:""}</option>`)}
        </optgroup>
        <option value="__hidden__">Hide</option>
      </select>
    `}renderZoneFloorEdit(e){if(!this._editSensors)return null;const t=this._config.zone_floors?.[e.climate_entity]??"__default__";return W`
      <label class="zone-floor-edit" @click=${e=>e.stopPropagation()}>
        Floor
        <select
          .value=${t}
          @change=${t=>this.updateZoneFloor(e.climate_entity,t.target.value)}
        >
          <option value="__default__">Auto (from HA area)</option>
          ${this.floorOptions.map(e=>W`<option value=${e}>${e}</option>`)}
        </select>
      </label>
    `}renderZoneAreaEdit(e){return this._editSensors?W`
      <label class="zone-area-edit" @click=${e=>e.stopPropagation()}>
        HA area
        <select
          .value=${e.area_id??""}
          @change=${t=>{this.updateZoneHaArea(e.climate_entity,t.target.value)}}
        >
          <option value="">—</option>
          ${this.haAreas.map(e=>W`<option value=${e.area_id}>${e.name}</option>`)}
        </select>
      </label>
    `:null}renderAreaLabel(e){return e.area?W`<div class="room-sensor-area">${e.area}</div>`:null}renderRoomSensorChip(e){return W`
      <div class="room-sensor-chip">
        <div class="room-sensor-name">${e.name} ${this.renderHeightBadge(e.height_ft)}</div>
        ${this.renderAreaLabel(e)}
        <div class="room-sensor-temp">${e.value??"—"}${e.unit??"°"}</div>
        ${this.renderSensorAssign(e)}
        ${this.renderHeightEditor(e.entity_id,e.height_ft)}
      </div>
    `}renderOtherSensorChip(e){return W`
      <div class="other-sensor-chip">
        <span class="other-sensor-name">${e.name}</span>
        <span class="other-sensor-value">${e.value??"—"}${e.unit??""}</span>
        ${this.renderHeightBadge(e.height_ft)}
        ${this.renderSensorAssign(e)}
        ${this.renderHeightEditor(e.entity_id,e.height_ft)}
      </div>
    `}renderZoneSensorsBlock(e){const t=e.roomSensors.length>0,o=e.otherSensors.length>0;return t||o?W`
      <div class="zone-area-sensors">
        ${t?W`
              <div class="room-sensors-grid">
                ${e.roomSensors.map(e=>this.renderRoomSensorChip(e))}
              </div>
            `:""}
        ${o?W`
              <div class="other-sensors-box">
                <div class="other-sensors-label">Other sensors</div>
                <div class="other-sensors-list">
                  ${e.otherSensors.map(e=>this.renderOtherSensorChip(e))}
                </div>
              </div>
            `:""}
      </div>
    `:W``}renderZone(e){const t=this.hass.states[e.climate_entity];if(!t)return W``;const o=t.attributes,r=o.current_temperature,s=o.temperature,n=o.humidity,i=o.hvac_action,a=t.state,l=this._expandedZone===e.climate_entity,c=e.sensors,d=o.hvac_modes??["heat","off"],p="floor_heat"===e.kind?d.filter(e=>"heat"===e||"off"===e):d;return W`
      <div class="zone-card ${l?"expanded":""} ${e.kind} ${this.modeClass(a)} ${this.actionClass(i)}">
        <div class="zone-header" @click=${()=>this.toggleExpand(e.climate_entity)}>
          <div class="zone-info">
            <div class="zone-name-row">
              <span class="zone-name">${e.name}</span>
              <span class="zone-kind-badge">${"floor_heat"===e.kind?"Floor":"HVAC"}</span>
            </div>
            <div class="zone-status-row">
              <span class="zone-mode ${this.modeClass(a)}">${a.replace("_"," ")}</span>
              <span class="zone-action ${this.actionClass(i)}">
                ${"heating"===i?"🔥 ":"cooling"===i?"❄️ ":""}${this.actionLabel(i)}
              </span>
            </div>
            ${e.area?W`<div class="zone-area-label">${e.area}</div>`:""}
            ${this.renderZoneFloorEdit(e)}
            ${this.renderZoneAreaEdit(e)}
          </div>
          <div class="zone-temps">
            <div class="temp-target-row">
              <span class="target-label">Set to</span>
              <span class="target-temp">${s??"—"}°</span>
            </div>
          </div>
        </div>

        <div class="zone-temp-grid">
          ${null!=c.floor?W`
                <div class="temp-cell">
                  <span class="temp-cell-label">Floor</span>
                  <span class="temp-cell-value">${c.floor}°</span>
                </div>
              `:""}
          ${null!=c.room?W`
                <div class="temp-cell">
                  <span class="temp-cell-label">Room</span>
                  <span class="temp-cell-value">${c.room}°</span>
                </div>
              `:""}
          ${null!=r&&null==c.floor&&null==c.room?W`
                <div class="temp-cell">
                  <span class="temp-cell-label">Current</span>
                  <span class="temp-cell-value">${r}°</span>
                </div>
              `:""}
          ${null==r||null==c.floor&&null==c.room?"":W`
                <div class="temp-cell">
                  <span class="temp-cell-label">Thermostat</span>
                  <span class="temp-cell-value">${r}°</span>
                </div>
              `}
          <div class="temp-cell temp-cell-target">
            <span class="temp-cell-label">Target</span>
            <span class="temp-cell-value">${s??"—"}°</span>
          </div>
          ${null!=n?W`
                <div class="temp-cell">
                  <span class="temp-cell-label">Humidity</span>
                  <span class="temp-cell-value">${n}%</span>
                </div>
              `:null!=c.humidity?W`
                  <div class="temp-cell">
                    <span class="temp-cell-label">Humidity</span>
                    <span class="temp-cell-value">${c.humidity}%</span>
                  </div>
                `:""}
        </div>

        ${this.renderZoneHeightStats(e,r)}

        ${this.renderZoneSensorsBlock(e)}

        ${l?W`
              <div class="zone-controls">
                ${this._editSensors?W`
                      <label class="zone-height-edit" @click=${e=>e.stopPropagation()}>
                        Thermostat height
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="${this._config.reference_height_ft??5}"
                          .value=${String(this._config.zone_heights?.[e.climate_entity]??this._config.reference_height_ft??5)}
                          @change=${t=>this.updateZoneHeight(e.climate_entity,t.target.value)}
                        />
                        ft
                      </label>
                    `:""}
                <div class="mode-buttons">
                  ${p.map(t=>W`
                      <button
                        class="mode-btn ${a===t?"active":""} ${this.modeClass(t)}"
                        @click=${o=>{o.stopPropagation(),this.setHvacMode(e.climate_entity,t)}}
                      >
                        ${t.replace("_","/")}
                      </button>
                    `)}
                </div>
                <div class="setpoint-controls">
                  <button
                    class="step-btn"
                    @click=${t=>{t.stopPropagation(),this.adjustSetpoint(e.climate_entity,s,-1)}}
                  >
                    −
                  </button>
                  <span class="setpoint-display">${s??"—"}°</span>
                  <button
                    class="step-btn"
                    @click=${t=>{t.stopPropagation(),this.adjustSetpoint(e.climate_entity,s,1)}}
                  >
                    +
                  </button>
                </div>
              </div>
            `:""}
      </div>
    `}get fpRooms(){return this._config.floor_plan?.rooms?.length?this._config.floor_plan.rooms:et.DEFAULT_FP_ROOMS}get fpThermostats(){return this._config.floor_plan?.thermostats??[]}fpZoneData(e){const t=et.FP_ZONE_MAP.find(t=>t.zone===e);if(!t)return null;const o=this.hass.states[t.climate_entity],r=o?.attributes??{},s=this.zoneOptions.find(e=>e.climate_entity===t.climate_entity);return{...t,state:o?.state,action:r.hvac_action,current:r.current_temperature,target:r.temperature,floor_temp:s?.sensors.floor,room_temp:s?.sensors.room}}fpZoneColor(e,t){return"off"===t?"rgba(97,97,97,0.18)":"heating"===e?"rgba(255,112,67,0.28)":"cooling"===e?"rgba(66,165,245,0.28)":"rgba(255,152,0,0.10)"}fpZoneStroke(e,t){return"off"===t?"#616161":"heating"===e?"#ff7043":"cooling"===e?"#42a5f5":"#ff9800"}fpThermostatData(e){const t=this.hass.states[e];if(!t)return null;const o=t.attributes??{},r=e.startsWith("climate.");return{state:t.state,action:r?o.hvac_action:void 0,current:r?o.current_temperature:parseFloat(t.state)||void 0,target:r?o.temperature:void 0,name:o.friendly_name??e,unit:o.unit_of_measurement??(r?"°":"")}}handleFpClick(e){if(!this._placingThermostat)return;const t=e.currentTarget,o=t.createSVGPoint();o.x=e.clientX,o.y=e.clientY;const r=t.getScreenCTM();if(!r)return;const s=o.matrixTransform(r.inverse()),n=Math.round(s.x/7),i=Math.round(s.y/5),a={entity_id:"",label:"wall"===this._placingThermostat?"Wall Thermostat":"Floor Sensor",kind:this._placingThermostat,x:Math.max(0,Math.min(100,n)),y:Math.max(0,Math.min(100,i))},l=[...this.fpThermostats];l.push(a);const c={...this._config,floor_plan:{...this._config.floor_plan,thermostats:l}};this._config=c,ge(this,"config-changed",{config:c}),this._placingThermostat=null}removeFpThermostat(e){const t=[...this.fpThermostats];t.splice(e,1);const o={...this._config,floor_plan:{...this._config.floor_plan,thermostats:t}};this._config=o,ge(this,"config-changed",{config:o})}updateFpThermostat(e,t,o){const r=this.fpThermostats.map((r,s)=>s===e?{...r,[t]:o}:r),s={...this._config,floor_plan:{...this._config.floor_plan,thermostats:r}};this._config=s,ge(this,"config-changed",{config:s})}renderFpManifold(e,t,o,r){const s=e.find(e=>"pantry"===e.id);if(!s)return"";const n=r+(s.x+s.w/2)/100*(t-2*r),i=r+(s.y+s.h/2)/100*(o-2*r);return W`
      <rect x="${n-30}" y="${i+4}" width="60" height="18" rx="3"
            fill="rgba(2,136,209,0.25)" stroke="#0288d1" stroke-width="1.5"/>
      <text x="${n}" y="${i+17}" class="fp-manifold-label" text-anchor="middle">MANIFOLD</text>
      <text x="${n}" y="${i+32}" class="fp-vent-label" text-anchor="middle">10 loops</text>
    `}renderFpPexRuns(e,t,o,r){const s=e.find(e=>"pantry"===e.id);if(!s)return[];const n=r+(s.x+s.w/2)/100*(t-2*r),i=r+(s.y+s.h/2)/100*(o-2*r);return e.filter(e=>e.heated).map(e=>{const s=r+(e.x+e.w/2)/100*(t-2*r),a=r+(e.y+e.h/2)/100*(o-2*r);return W`<line x1="${n}" y1="${i}" x2="${s}" y2="${a}"
                        stroke="#0288d1" stroke-width="1" stroke-dasharray="4" opacity="0.3"/>`})}renderFpVents(e,t,o){return[{rx:45,ry:30},{rx:55,ry:45},{rx:25,ry:25},{rx:80,ry:20},{rx:80,ry:35}].map(r=>{const s=o+r.rx/100*(e-2*o),n=o+r.ry/100*(t-2*o);return W`<circle cx="${s}" cy="${n}" r="4" fill="none"
                          stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`})}renderFloorPlan(){const e=this.fpRooms,t=this.fpThermostats,o=this._placingThermostat,r=Object.keys(this.hass.states).filter(e=>e.startsWith("climate.")||e.startsWith("sensor.")),s=700,n=500,i=15;return W`
      <div class="floor-plan-container">
        <!-- Toolbar -->
        <div class="fp-toolbar">
          <span class="fp-toolbar-title">Heated Floor Plan</span>
          <div class="fp-toolbar-actions">
            <button class="fp-place-btn ${"wall"===o?"active":""}"
              @click=${()=>this._placingThermostat="wall"===o?null:"wall"}>
              + Wall Thermostat
            </button>
            <button class="fp-place-btn ${"floor"===o?"active":""}"
              @click=${()=>this._placingThermostat="floor"===o?null:"floor"}>
              + Floor Sensor
            </button>
          </div>
        </div>
        ${o?W`<div class="fp-placing-hint">Click on the floor plan to place the ${"wall"===o?"wall thermostat":"floor sensor"}</div>`:""}

        <svg viewBox="0 0 ${s} ${n}" class="floor-plan-svg ${o?"placing":""}"
             xmlns="http://www.w3.org/2000/svg"
             @click=${e=>this.handleFpClick(e)}>
          <defs>
            <pattern id="fp-grid" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M 14 0 L 0 0 0 14" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="${s}" height="${n}" fill="url(#fp-grid)" rx="8"/>

          <!-- House outer walls -->
          <rect x="${i}" y="${i}" width="${670}" height="${470}" rx="3"
                fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2.5"/>

          <!-- Rooms -->
          ${e.map(e=>{const t=i+e.x/100*670,o=i+e.y/100*470,r=e.w/100*670,s=e.h/100*470,n=null!=e.zone?this.fpZoneData(e.zone):null,a=e.heated&&n?this.fpZoneColor(n.action,n.state):"rgba(255,255,255,0.02)",l=e.heated&&n?this.fpZoneStroke(n.action,n.state):"rgba(255,255,255,0.10)",c=e.heated?"2":"1",d=t+r/2,p=o+s/2;return W`
              <g class="fp-room">
                <rect x="${t}" y="${o}" width="${r}" height="${s}" rx="2"
                      fill="${a}" stroke="${l}" stroke-width="${c}"/>
                <text x="${d}" y="${p-(n?14:4)}" class="fp-room-label" text-anchor="middle">${e.label}</text>
                ${null!=e.zone?W`
                  <text x="${d}" y="${p}" class="fp-zone-tag" text-anchor="middle">Zone ${e.zone}</text>
                `:""}
                ${n&&e.heated?W`
                  ${"heating"===n.action?W`<text x="${d}" y="${p+14}" class="fp-status fp-heat" text-anchor="middle">HEATING</text>`:"off"===n.state?W`<text x="${d}" y="${p+14}" class="fp-status fp-off" text-anchor="middle">OFF</text>`:W`<text x="${d}" y="${p+14}" class="fp-status fp-idle" text-anchor="middle">IDLE</text>`}
                  <!-- Temps row -->
                  ${r>100?W`
                    ${null!=n.floor_temp?W`
                      <text x="${d-40}" y="${p+32}" class="fp-t-lbl" text-anchor="middle">FLR</text>
                      <text x="${d-40}" y="${p+46}" class="fp-t-val" text-anchor="middle">${n.floor_temp}°</text>
                    `:""}
                    ${null!=n.room_temp?W`
                      <text x="${d}" y="${p+32}" class="fp-t-lbl" text-anchor="middle">ROOM</text>
                      <text x="${d}" y="${p+46}" class="fp-t-val" text-anchor="middle">${n.room_temp}°</text>
                    `:""}
                    <text x="${d+40}" y="${p+32}" class="fp-t-lbl" text-anchor="middle">TGT</text>
                    <text x="${d+40}" y="${p+46}" class="fp-t-val" text-anchor="middle">${n.target??"—"}°</text>
                  `:W`
                    <text x="${d}" y="${p+30}" class="fp-t-val" text-anchor="middle">${n.target??"—"}°</text>
                  `}
                `:""}
              </g>
            `})}

          <!-- Manifold marker in Pantry area -->
          ${this.renderFpManifold(e,s,n,i)}

          <!-- PEX runs from manifold -->
          ${this.renderFpPexRuns(e,s,n,i)}

          <!-- Floor vents -->
          ${this.renderFpVents(s,n,i)}

          <!-- Placed thermostats -->
          ${t.map((e,t)=>{const o=i+e.x/100*670,r=i+e.y/100*470,s=e.entity_id?this.fpThermostatData(e.entity_id):null,n="wall"===e.kind;return W`
              <g class="fp-thermostat" transform="translate(${o}, ${r})">
                <circle r="12" fill="${n?"rgba(76,175,80,0.3)":"rgba(255,152,0,0.3)"}"
                        stroke="${n?"#4caf50":"#ff9800"}" stroke-width="1.5"/>
                <text y="1" class="fp-tstat-icon" text-anchor="middle">${n?"T":"F"}</text>
                ${s?W`
                  <text x="16" y="-4" class="fp-tstat-temp" text-anchor="start">${s.current??"—"}°</text>
                  <text x="16" y="8" class="fp-tstat-name" text-anchor="start">${e.label}</text>
                `:W`
                  <text x="16" y="4" class="fp-tstat-name" text-anchor="start">${e.label}</text>
                `}
              </g>
            `})}
        </svg>

        <!-- Thermostat list / editor below the plan -->
        ${t.length?W`
          <div class="fp-tstat-list">
            <div class="fp-tstat-list-title">Thermostats on Plan</div>
            ${t.map((e,t)=>W`
              <div class="fp-tstat-row">
                <span class="fp-tstat-badge ${e.kind}">${"wall"===e.kind?"Wall":"Floor"}</span>
                <input class="fp-tstat-input" type="text" .value=${e.label}
                       placeholder="Label"
                       @change=${e=>this.updateFpThermostat(t,"label",e.target.value)}/>
                <select class="fp-tstat-select"
                        @change=${e=>this.updateFpThermostat(t,"entity_id",e.target.value)}>
                  <option value="" ?selected=${!e.entity_id}>Pick entity...</option>
                  ${r.map(t=>W`
                    <option value="${t}" ?selected=${e.entity_id===t}>
                      ${this.hass.states[t]?.attributes?.friendly_name??t}
                    </option>
                  `)}
                </select>
                <span class="fp-tstat-pos">(${e.x}, ${e.y})</span>
                <button class="fp-tstat-del" @click=${()=>this.removeFpThermostat(t)}>✕</button>
              </div>
            `)}
          </div>
        `:""}

        <!-- Legend -->
        <div class="fp-legend-bar">
          <div class="fp-legend-item"><span class="fp-legend-swatch" style="background:rgba(255,112,67,0.28);border-color:#ff7043"></span>Heating</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch" style="background:rgba(255,152,0,0.10);border-color:#ff9800"></span>Idle</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch" style="background:rgba(97,97,97,0.18);border-color:#616161"></span>Off</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch fp-legend-circle" style="border-color:rgba(255,255,255,0.2)"></span>Vent</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch" style="background:rgba(76,175,80,0.3);border-color:#4caf50;border-radius:50%"></span>Wall T-stat</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch" style="background:rgba(255,152,0,0.3);border-color:#ff9800;border-radius:50%"></span>Floor Sensor</div>
        </div>
      </div>
    `}renderUnassigned(e){return e.unassignedSensors.length?W`
      <div class="unassigned-block">
        <div class="unassigned-label">Unassigned sensors</div>
        <div class="other-sensors-list">
          ${e.unassignedSensors.map(e=>"other"===e.kind?this.renderOtherSensorChip(e):this.renderRoomSensorChip(e))}
        </div>
      </div>
    `:null}renderFloorSection(e){return W`
      <section class="floor-section">
        <div class="floor-header">
          <span class="floor-name">${e.name}</span>
          <span class="floor-meta">${e.zones.length} zones</span>
        </div>

        ${e.zones.length?W`<div class="zones-grid">${e.zones.map(e=>this.renderZone(e))}</div>`:""}
        ${this.renderUnassigned(e)}
      </section>
    `}render(){const e=this.sections,t=!1!==this._config.allow_sensor_reassign,o="floorplan"===this._view;return W`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title}</span>
          <div class="header-actions">
            <div class="view-toggle">
              <button class="view-btn ${o?"":"active"}" @click=${()=>this._view="cards"}>Cards</button>
              <button class="view-btn ${o?"active":""}" @click=${()=>this._view="floorplan"}>Floor Plan</button>
            </div>
            ${!o&&t?W`
                  <button
                    class="edit-sensors-btn ${this._editSensors?"active":""}"
                    @click=${()=>this._editSensors=!this._editSensors}
                  >
                    ${this._editSensors?"Done":"Assign sensors"}
                  </button>
                `:""}
            <span class="zone-count">${this.totalZones} zones</span>
          </div>
        </div>
        ${o?W`
              ${this.renderWeatherStrip()}
              ${this.renderFloorPlan()}
            `:W`
              ${this._editSensors?W`<div class="edit-hint">Assign sensors to HA areas or zones, set floor per zone, or hide. Save the dashboard to keep layout changes.</div>`:""}
              ${this.renderWeatherStrip()}
              ${e.length?e.map(e=>this.renderFloorSection(e)):W`<div class="empty">No climate zones found. Check your configuration.</div>`}
            `}
      </ha-card>
    `}};tt.FP_ZONE_MAP=[{zone:1,label:"Laundry",sqft:54,climate_entity:"climate.laundry_laundry"},{zone:2,label:"Main Area",sqft:577,climate_entity:"climate.main_area_main_area"},{zone:3,label:"Kitchen",sqft:187,climate_entity:"climate.main_floor"},{zone:4,label:"Living Room",sqft:98,climate_entity:"climate.living_room_living_room"}],tt.DEFAULT_FP_ROOMS=[{id:"entry",label:"Entry",x:0,y:0,w:15,h:35,heated:!1},{id:"living",label:"Living Room",x:15,y:0,w:22,h:55,zone:4,heated:!0},{id:"family",label:"Family Room",x:37,y:0,w:33,h:55,zone:2,heated:!0},{id:"kitchen",label:"Kitchen",x:70,y:0,w:30,h:40,zone:3,heated:!0},{id:"pantry",label:"Pantry",x:70,y:40,w:15,h:20,heated:!1},{id:"laundry",label:"Laundry",x:0,y:55,w:15,h:25,zone:1,heated:!0},{id:"hall",label:"Hallway",x:15,y:55,w:15,h:25,zone:2,heated:!0},{id:"office",label:"Main Office",x:30,y:55,w:25,h:25,heated:!1},{id:"stairs",label:"Stairs",x:0,y:35,w:15,h:20,heated:!1},{id:"half_bath",label:"1/2 Bath",x:55,y:55,w:15,h:25,heated:!1},{id:"dining",label:"Dining",x:85,y:40,w:15,h:20,heated:!1}],e([he({attribute:!1})],tt.prototype,"hass",void 0),e([he({attribute:!1})],tt.prototype,"_config",void 0),e([ue()],tt.prototype,"_expandedZone",void 0),e([ue()],tt.prototype,"_editSensors",void 0),e([ue()],tt.prototype,"_view",void 0),e([ue()],tt.prototype,"_placingThermostat",void 0),tt=et=e([ce("climate-command-center")],tt),window.customCards=window.customCards??[],window.customCards.push({type:"climate-command-center",name:"Climate Command Center",description:"Unified dashboard for thermostats, heated floors, and weather sensors",preview:!0}),console.info("%c CLIMATE-COMMAND-CENTER %c v0.5.1 ","color: white; background: #0288d1; font-weight: 700;","color: #0288d1; background: white; font-weight: 700;");const ot=()=>tt,rt=()=>document.createElement("climate-command-center-editor");export{tt as ClimateCommandCenterCard,ot as getCard,rt as getCardEditor};
