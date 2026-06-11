function e(e,t,r,s){var o,n=arguments.length,i=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,r):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,r,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(i=(n<3?o(i):n>3?o(t,r,i):o(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,r=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(r&&void 0===e){const r=void 0!==t&&1===t.length;r&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&o.set(t,e))}return e}toString(){return this.cssText}};const i=(e,...t)=>{const r=1===e.length?e[0]:t.reduce((t,r,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[s+1],e[0]);return new n(r,e,s)},a=r?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:A}=Object,f=globalThis,h=f.trustedTypes,m=h?h.emptyScript:"",g=f.reactiveElementPolyfillSupport,b=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},x=(e,t)=>!l(e,t),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let z=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(e,r,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){const{get:s,set:o}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const n=s?.call(this);o?.call(this,t),this.requestUpdate(e,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=A(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...p(e),...u(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const r=this._$Eu(e,t);void 0!==r&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(r)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const r of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=r.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(void 0!==s&&!0===r.reflect){const o=(void 0!==r.converter?.toAttribute?r.converter:v).toAttribute(t,r.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const r=this.constructor,s=r._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=r.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=s;const n=o.fromAttribute(t,e.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(e,t,r,s=!1,o){if(void 0!==e){const n=this.constructor;if(!1===s&&(o=this[e]),r??=n.getPropertyOptions(e),!((r.hasChanged??x)(o,t)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:o},n){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,r,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};z.elementStyles=[],z.shadowRootOptions={mode:"open"},z[b("elementProperties")]=new Map,z[b("finalized")]=new Map,g?.({ReactiveElement:z}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=e=>e,S=w.trustedTypes,E=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,W="$lit$",V=`lit$${Math.random().toFixed(9).slice(2)}$`,R="?"+V,Z=`<${R}>`,N=document,C=()=>N.createComment(""),q=e=>null===e||"object"!=typeof e&&"function"!=typeof e,O=Array.isArray,I="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,j=/>/g,X=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,T=/"/g,F=/^(?:script|style|textarea|title)$/i,D=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),G=D(1),L=D(2),Q=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),J=new WeakMap,Y=N.createTreeWalker(N,129);function K(e,t){if(!O(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}const U=(e,t)=>{const r=e.length-1,s=[];let o,n=2===t?"<svg>":3===t?"<math>":"",i=P;for(let t=0;t<r;t++){const r=e[t];let a,l,c=-1,d=0;for(;d<r.length&&(i.lastIndex=d,l=i.exec(r),null!==l);)d=i.lastIndex,i===P?"!--"===l[1]?i=M:void 0!==l[1]?i=j:void 0!==l[2]?(F.test(l[2])&&(o=RegExp("</"+l[2],"g")),i=X):void 0!==l[3]&&(i=X):i===X?">"===l[0]?(i=o??P,c=-1):void 0===l[1]?c=-2:(c=i.lastIndex-l[2].length,a=l[1],i=void 0===l[3]?X:'"'===l[3]?T:H):i===T||i===H?i=X:i===M||i===j?i=P:(i=X,o=void 0);const p=i===X&&e[t+1].startsWith("/>")?" ":"";n+=i===P?r+Z:c>=0?(s.push(a),r.slice(0,c)+W+r.slice(c)+V+p):r+V+(-2===c?t:p)}return[K(e,n+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class _{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let o=0,n=0;const i=e.length-1,a=this.parts,[l,c]=U(e,t);if(this.el=_.createElement(l,r),Y.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=Y.nextNode())&&a.length<i;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(W)){const t=c[n++],r=s.getAttribute(e).split(V),i=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:i[2],strings:r,ctor:"."===i[1]?se:"?"===i[1]?oe:"@"===i[1]?ne:re}),s.removeAttribute(e)}else e.startsWith(V)&&(a.push({type:6,index:o}),s.removeAttribute(e));if(F.test(s.tagName)){const e=s.textContent.split(V),t=e.length-1;if(t>0){s.textContent=S?S.emptyScript:"";for(let r=0;r<t;r++)s.append(e[r],C()),Y.nextNode(),a.push({type:2,index:++o});s.append(e[t],C())}}}else if(8===s.nodeType)if(s.data===R)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(V,e+1));)a.push({type:7,index:o}),e+=V.length-1}o++}}static createElement(e,t){const r=N.createElement("template");return r.innerHTML=e,r}}function $(e,t,r=e,s){if(t===Q)return t;let o=void 0!==s?r._$Co?.[s]:r._$Cl;const n=q(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,r,s)),void 0!==s?(r._$Co??=[])[s]=o:r._$Cl=o),void 0!==o&&(t=$(e,o._$AS(e,t.values),o,s)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??N).importNode(t,!0);Y.currentNode=s;let o=Y.nextNode(),n=0,i=0,a=r[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new te(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new ie(o,this,e)),this._$AV.push(t),a=r[++i]}n!==a?.index&&(o=Y.nextNode(),n++)}return Y.currentNode=N,s}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=$(this,e,t),q(e)?e===B||null==e||""===e?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==Q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>O(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==B&&q(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,s="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=_.createElement(K(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=J.get(e.strings);return void 0===t&&J.set(e.strings,t=new _(e)),t}k(e){O(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,s=0;for(const o of e)s===t.length?t.push(r=new te(this.O(C()),this.O(C()),this,this.options)):r=t[s],r._$AI(o),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class re{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,o){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=B}_$AI(e,t=this,r,s){const o=this.strings;let n=!1;if(void 0===o)e=$(this,e,t,0),n=!q(e)||e!==this._$AH&&e!==Q,n&&(this._$AH=e);else{const s=e;let i,a;for(e=o[0],i=0;i<o.length-1;i++)a=$(this,s[r+i],t,i),a===Q&&(a=this._$AH[i]),n||=!q(a)||a!==this._$AH[i],a===B?e=B:e!==B&&(e+=(a??"")+o[i+1]),this._$AH[i]=a}n&&!s&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends re{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}class oe extends re{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==B)}}class ne extends re{constructor(e,t,r,s,o){super(e,t,r,s,o),this.type=5}_$AI(e,t=this){if((e=$(this,e,t,0)??B)===Q)return;const r=this._$AH,s=e===B&&r!==B||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==B&&(r===B||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){$(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(_,te),(w.litHtmlVersions??=[]).push("3.3.3");const le=globalThis;class ce extends z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const s=r?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=r?.renderBefore??null;s._$litPart$=o=new te(t.insertBefore(C(),e),e,void 0,r??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Q}}ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const pe=e=>(t,r)=>{void 0!==r?r.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ue={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:x},Ae=(e=ue,t,r)=>{const{kind:s,metadata:o}=r;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),n.set(r.name,e),"accessor"===s){const{name:s}=r;return{set(r){const o=t.get.call(this);t.set.call(this,r),this.requestUpdate(s,o,e,!0,r)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=r;return function(r){const o=this[s];t.call(this,r),this.requestUpdate(s,o,e,!0,r)}}throw Error("Unsupported decorator location: "+s)};function fe(e){return(t,r)=>"object"==typeof r?Ae(e,t,r):((e,t,r)=>{const s=t.hasOwnProperty(r);return t.constructor.createProperty(r,e),s?Object.getOwnPropertyDescriptor(t,r):void 0})(e,t,r)}function he(e){return fe({...e,state:!0,attribute:!1})}function me(e,t,r){const s=new CustomEvent(t,{detail:r,bubbles:!0,composed:!0});e.dispatchEvent(s)}const ge=i`
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

  .setup-save-reminder {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--primary-text-color);
    margin: -4px 0 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(255, 152, 0, 0.15);
    border: 1px solid rgba(255, 152, 0, 0.35);
    line-height: 1.4;
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

  .top-strip {
    display: flex;
    gap: 16px;
    margin-bottom: 18px;
  }

  .top-strip .weather-strip {
    flex: 1;
    margin-bottom: 0;
  }

  .top-strip .floor-system {
    flex: 1;
    margin-bottom: 0;
  }

  .weather-strip {
    display: flex;
    flex-wrap: wrap;
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

  .weather-forecast {
    display: flex;
    gap: 0;
    width: 100%;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    justify-content: space-around;
  }

  .forecast-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 40px;
  }

  .forecast-day-name {
    font-size: 0.65rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
  }

  .forecast-condition {
    font-size: 1.2rem;
    line-height: 1;
  }

  .forecast-temps {
    display: flex;
    gap: 4px;
    font-size: 0.72rem;
  }

  .forecast-hi {
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .forecast-lo {
    color: var(--secondary-text-color);
    opacity: 0.7;
  }

  .forecast-precip {
    font-size: 0.6rem;
    color: #64b5f6;
    opacity: 0.85;
  }

  .floor-system {
    padding: 14px 18px;
    margin-bottom: 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(255, 152, 0, 0.12), rgba(255, 112, 67, 0.08));
    border: 1px solid rgba(255, 152, 0, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .floor-system.tankless-visual {
    padding: 8px;
    background: linear-gradient(135deg, rgba(40, 40, 60, 0.95), rgba(30, 30, 50, 0.9));
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .tankless-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .floor-system-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .floor-system-icon {
    font-size: 1.4rem;
    line-height: 1;
  }

  .floor-system-title {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #ffb74d;
  }

  .floor-system-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .floor-system-metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 64px;
    padding: 8px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .floor-system-metric-label {
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-text-color);
    margin-bottom: 4px;
  }

  .floor-system-metric-value {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .floor-system-metric.supply {
    background: rgba(255, 152, 0, 0.12);
    border-color: rgba(255, 152, 0, 0.25);
  }

  .floor-system-metric.supply .floor-system-metric-value {
    color: #ffb74d;
  }

  .floor-system-metric.return {
    background: rgba(66, 165, 245, 0.12);
    border-color: rgba(66, 165, 245, 0.25);
  }

  .floor-system-metric.return .floor-system-metric-value {
    color: #64b5f6;
  }

  .floor-system-metric.delta .floor-system-metric-value {
    color: #26a69a;
  }

  .floor-system-metric.flow .floor-system-metric-value {
    color: var(--primary-text-color);
  }

  .floor-system-metric.pump.active {
    background: rgba(255, 112, 67, 0.15);
    border-color: rgba(255, 112, 67, 0.3);
  }

  .floor-system-metric.pump.active .floor-system-metric-value {
    color: #ff7043;
  }

  .floor-system-metric.pump.inactive .floor-system-metric-value {
    color: var(--secondary-text-color);
    opacity: 0.75;
  }

  .floor-system-extra {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 10px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .floor-system-extra-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 0.72rem;
  }

  .floor-system-extra-name {
    color: var(--secondary-text-color);
  }

  .floor-system-extra-value {
    color: var(--primary-text-color);
    font-weight: 600;
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

  /* ── Zone kind setup ── */
  .zone-kind-setup {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    padding: 6px 8px;
    border-radius: 8px;
    background: rgba(2, 136, 209, 0.06);
    border: 1px solid rgba(2, 136, 209, 0.15);
  }

  .zone-kind-setup-label {
    font-size: 0.68rem;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }

  .zone-kind-toggle {
    display: flex;
    gap: 0;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    overflow: hidden;
  }

  .zone-kind-btn {
    padding: 3px 10px;
    font-size: 0.68rem;
    font-weight: 500;
    background: transparent;
    border: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    transition: all 0.15s;
  }

  .zone-kind-btn:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .zone-kind-btn.active.floor {
    background: #ff7043;
    color: white;
  }

  .zone-kind-btn.active.hvac {
    background: #42a5f5;
    color: white;
  }

  /* ── Floor system setup ── */
  .floor-system-setup {
    margin: 0 0 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(2, 136, 209, 0.06);
    border: 1px solid rgba(2, 136, 209, 0.15);
  }

  .floor-system-setup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }

  .floor-system-setup-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .floor-system-setup-status {
    font-size: 0.68rem;
    color: var(--secondary-text-color);
    padding: 2px 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
  }

  .floor-system-setup-fields {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 6px 12px;
  }

  .floor-system-field {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.68rem;
    color: var(--secondary-text-color);
  }

  .floor-system-field-label {
    white-space: nowrap;
    min-width: 72px;
  }

  .floor-system-field select,
  .floor-system-field input[type='text'] {
    flex: 1;
    min-width: 0;
    max-width: 100%;
    padding: 3px 6px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: var(--card-background-color, rgba(0, 0, 0, 0.2));
    color: var(--primary-text-color, #fff);
    font-size: 0.68rem;
    -webkit-appearance: auto;
    appearance: auto;
  }
  .floor-system-field select option {
    background: var(--card-background-color, #1e1e2e);
    color: var(--primary-text-color, #fff);
  }

  .floor-system-field-text {
    grid-column: 1 / -1;
  }

  .floor-system-disable {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    font-size: 0.68rem;
    color: var(--secondary-text-color);
    cursor: pointer;
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

  .valve-line {
    padding: 2px 12px 4px;
  }

  .valve-svg {
    width: 100%;
    height: 20px;
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

  /* \u2500\u2500 View toggle \u2500\u2500 */
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

  /* \u2500\u2500 Floor Plan \u2500\u2500 */
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

  /* Floor plan \u2014 full-width mode */
  :host {
    --fp-active: 0;
  }

  /* Floor plan \u2014 embedded image with sensor overlays */
  .fp-map {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .fp-map.placing {
    cursor: crosshair;
  }

  .fp-img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .fp-tstat-select.compact {
    min-width: 100px;
    font-size: 0.65rem;
    padding: 2px 4px;
  }

  .fp-area-detail-empty {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    padding: 4px 0;
    font-style: italic;
  }

  /* Sensor markers overlaid on the plan */
  .fp-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    gap: 4px;
    pointer-events: none;
    z-index: 10;
  }

  .fp-marker-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }

  .fp-marker.wall .fp-marker-dot {
    background: rgba(76, 175, 80, 0.8);
    border: 2px solid #4caf50;
  }

  .fp-marker.floor .fp-marker-dot {
    background: rgba(255, 152, 0, 0.8);
    border: 2px solid #ff9800;
  }

  .fp-marker-info {
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 4px;
    padding: 2px 6px;
    white-space: nowrap;
  }

  .fp-marker-label {
    font-size: 0.55rem;
    color: var(--secondary-text-color, #aaa);
  }

  .fp-marker-temp {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--primary-text-color, #fff);
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

  .fp-swatch-wall {
    background: rgba(76, 175, 80, 0.5);
    border-color: #4caf50;
    border-radius: 50%;
  }

  .fp-swatch-floor {
    background: rgba(255, 152, 0, 0.5);
    border-color: #ff9800;
    border-radius: 50%;
  }

  .fp-swatch-heated {
    background: rgba(255, 152, 0, 0.1);
    border-color: #ff9800;
  }

  /* ── Sun Tracker ── */
  .sun-tracker {
    margin-bottom: 18px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .sun-tracker-svg {
    display: block;
    width: 100%;
    height: auto;
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

    .floor-system-metrics {
      justify-content: flex-start;
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
`;function be(e,t,r){const s=t.sensor_heights?.[e];return null==s||Number.isNaN(s)?r?.isFloor?0:r?.isRoom?5:void 0:s}function ve(e,t,r){const s=t.reference_height_ft??5,o=function(e,t,r){const s=[],o=t.sensor_heights??{},n=t.zone_heights??{},i=(e,r,n,i)=>{if(null==r)return;const a=(n?o[n]:void 0)??be(n??"",t,i);null!=a&&s.push({label:e,temp:r,height_ft:a})};if(null!=e.sensors.floor&&i("Floor",e.sensors.floor,e.linked_sensor_ids?.floor,{isFloor:!0}),null!=e.sensors.room&&i("Room",e.sensors.room,e.linked_sensor_ids?.room,{isRoom:!0}),null!=r){const o=n[e.climate_entity]??t.reference_height_ft??5;s.push({label:"Thermostat",temp:r,height_ft:o})}for(const t of e.roomSensors)null!=t.value&&null!=t.height_ft&&s.push({label:t.name,temp:t.value,height_ft:t.height_ft});return s}(e,t,r);if(!o.length)return null;const n=Math.round(o.reduce((e,t)=>e+t.temp,0)/o.length*10)/10,{value:i,gradient:a}=function(e,t){if(!e.length)return{};if(1===e.length)return{value:e[0].temp};const r=e.length,s=e.reduce((e,t)=>e+t.height_ft,0),o=e.reduce((e,t)=>e+t.temp,0),n=e.reduce((e,t)=>e+t.height_ft*t.temp,0),i=e.reduce((e,t)=>e+t.height_ft*t.height_ft,0),a=r*i-s*s;if(Math.abs(a)<1e-6){const e=o/r;return{value:Math.round(10*e)/10}}const l=(r*n-s*o)/a,c=l*t+(o-l*s)/r;return{value:Math.round(10*c)/10,gradient:Math.round(100*l)/100}}(o,s);return{reference_height_ft:s,point_count:o.length,simple_average:n,estimated_at_reference:i,gradient_per_ft:a}}const xe=["deye","sunsynk","sol-ark","battery","oven","cavity","inverter","outdoor","outside","exterior","sensorlinx","ubiquiti","unifi","udm","usg","usw","uap","uxg","udr","unvr","unifi_","dream machine","dream router","ultra switch","ap ","ap_backyard","ap_","xgs","_poe","port_","clients","wlan","speedtest","wan ","lan ","firmware","device tracker","poe temperature","switch temperature","cpu","memory","utilization","uptime","signal level","cloud connection","access point","printer","toner","cartridge"," ink","officejet","laserjet","envy","deskjet","tankless","water heater","hot water","inlet temp","outlet temp","weather","tempest","weatherflow","wet bulb","dew point","feels like","heat index","wind chill","wind speed","wind gust","wind bearing","wind direction","barometric","sea level pressure","air density","solar radiation","uv index","lightning","precipitation","rain rate","rain accumulation","visibility","cloud base","beaufort"],ye=["outlet","plug","switch","hallway","flex","unifi","usw","uap","udm","signal level","cloud connection","network","uptime","cpu","memory","mac","energy","power","voltage","current","consumption","co2","voc","aqi","auto-off","auto-update","led","overheated","smooth on","smooth off"],ze=[{name:"Main Floor",zones:["Laundry","Living Room","Main Area","Main Office","Redmond Thermostat"],room_sensors:["Family Room","Kitchen","Hallway","Stairs","Entryway","Primary Bath","Primary Bedroom"]},{name:"Upper Floor",zones:[],room_sensors:["Hunters","Sydney","Upstair Office","Upstairs Office"]}],we={office:"Main Floor","Main Office":"Main Floor",upstairs_office:"Upper Floor",upstairs_hallway:"Upper Floor",hunters_room:"Upper Floor",sidney_s_room:"Upper Floor","Upstairs Office":"Upper Floor","Upstairs Hallway":"Upper Floor","Hunters Room":"Upper Floor","Sidney's Room":"Upper Floor"},ke={};function Se(e,t){const r=Ne(e),s=Ne(t);if(r===s)return!0;const o=r.split(" "),n=s.split(" ");return o[0]===n[0]&&o.length>1&&n.length>1&&"main"===o[0]?o.slice(1).join(" ")===n.slice(1).join(" "):r.includes(s)||s.includes(r)}function Ee(e){const t=e.areas;return t?Object.entries(t).map(([e,t])=>({area_id:e,name:t.name??e})).filter(e=>!["weather","whole_house_energy"].includes(e.area_id)).sort((e,t)=>e.name.localeCompare(t.name)):[]}function We(e){return(e.floors??ze).map(e=>e.name)}function Ve(e,t,r){const s=function(e){return{...we,...e.area_floor_map??{}}}(r);return e&&s[e]?s[e]:t&&s[t]?s[t]:void 0}function Re(e,t,r=t.floors??ze){const s=function(e){return{...ke,...e.zone_floors??{}}}(t);if(s[e.climate_entity])return s[e.climate_entity];for(const t of r)if(t.zones?.some(t=>Se(e.name,t)))return t.name;const o=Ve(e.area_id,e.area,t);return o||(e.floor?e.floor:Ke(e.name,e.area,r))}function Ze(e){const t=e.trim().split(/\s+/);if(t.length>=2&&t.length%2==0){const e=t.length/2;if(t.slice(0,e).join(" ")===t.slice(e).join(" "))return t.slice(0,e).join(" ")}return e}function Ne(e){return e.toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function Ce(e){return e.attributes.friendly_name??e.entity_id}function qe(e,t){const r=e.entities?.[t];if(r?.area_id)return r.area_id;const s=r?.device_id;if(s){const t=e.devices?.[s]?.area_id;if(t)return t}}function Oe(e,t){if(!t)return;const r=e.areas;return r?.[t]?.name}function Ie(e){if(!e||"unavailable"===e.state||"unknown"===e.state)return;const t=parseFloat(e.state);return isNaN(t)?void 0:Math.round(10*t)/10}function Pe(e,t){if(t)return e.states[t]}function Me(e){const t=new Set(e.exclude_entities??[]);for(const r of e.sensor_assignments??[])r.hidden&&t.add(r.entity_id);return t}function je(e){const t=new Map(Object.entries(e.sensor_map??{}));for(const r of e.sensor_assignments??[])r.zone&&!r.hidden&&t.set(r.entity_id,r.zone);return t}function Xe(e,t,r=[]){const s=`${Ne(e)} ${Ne(t)}`;return[...xe,...r].some(e=>s.includes(Ne(e)))}function He(e){const t=e.replace(/^climate\./,""),r=t.split("_");if(r.length>=2&&r.length%2==0){const e=r.length/2,t=r.slice(0,e).join("_");if(t===r.slice(e).join("_"))return t}return t}function Te(e,t,r){if(r.has(e))return!0;const s=Ne(t);return s.includes("current temperature")&&s.includes("thermostat")}function Fe(e){const t=e.attributes.device_class;if("temperature"===t||"humidity"===t)return!0;const r=e.attributes.state_class,s=e.attributes.unit_of_measurement;if("measurement"===r&&s){if("%"===s)return!0;if(/°|deg/i.test(s))return!0}return!1}function De(e,t,r,s){return function(e,t,r){const s=`${Ne(e)} ${Ne(t)}`;return r.some(e=>s.includes(Ne(e)))}(e,t,s)?"other":"temperature"===r||"humidity"===r?"room":"other"}function Ge(e,t,r,s){const o=Ne(e),n=Ne(r),i=Ne(t),a=Ne(s);let l=0;return(o.includes(n)||i.includes(n.replace(/\s+/g,"_")))&&(l+=3),o.includes(a)&&(l+=4),"humidity"===a&&(e.includes("%")||t.includes("humidity"))&&(l+=2),l}function Le(e,t,r,s,o){const n=o?qe(e,o):void 0;let i;for(const o of Object.values(e.states)){if(!o.entity_id.startsWith("sensor."))continue;if(o.attributes.device_class!==s)continue;const a=Ce(o);if(Xe(a,o.entity_id))continue;let l=Ge(a,o.entity_id,t,r);n&&qe(e,o.entity_id)===n&&(l+=6),l>=5&&(!i||l>i.score)&&(i={id:o.entity_id,score:l})}return i?.id}function Qe(e,t){const r="on"===t;return{entity_id:e,position:r?100:0,active:r}}function Be(e,t){const r=parseFloat(t);if(!isNaN(r))return{entity_id:e,position:r,active:r>0}}function Je(e,t){return{floor:t.floor_sensor??Le(e,t.name,"floor temperature","temperature",t.climate_entity),room:t.room_sensor??Le(e,t.name,"room temperature","temperature",t.climate_entity),humidity:t.humidity_sensor??Le(e,t.name,"humidity","humidity",t.climate_entity)}}function Ye(e,t,r,s){const o=s?.zone_kinds?.[t.climate_entity];if(o)return o;if(null!=r.floor)return"floor_heat";if(Ne(t.name).includes("thermostat"))return"thermostat";const n=Pe(e,t.climate_entity);return(n?.attributes.hvac_modes??[]).includes("heat_cool")?"thermostat":"floor_heat"}function Ke(e,t,r){const s=Ne(`${e} ${t??""}`);for(const e of r){const t=e.zones?.some(e=>s.includes(Ne(e))),r=e.room_sensors?.some(e=>s.includes(Ne(e)));if(t||r)return e.name}return/hunter|sydney|upstair/.test(s)?"Upper Floor":"Main Floor"}function Ue(e,t){let r=Ze(e.replace(/\s+(temperature|humidity|temp)$/i,""));const s=`${Ne(e)} ${Ne(t)}`;if(s.includes("outdoor reset")){const t=e.match(/:\s*(.+)$/);return t?`Outdoor reset target (${t[1].trim()})`:"Outdoor reset target"}return s.includes("ecobee")&&s.includes("remote")&&(r=r.replace(/\s*ecobee\s*/i," ").trim(),/remote/i.test(r)||(r=`${r} (Remote)`)),r}function _e(e,t,r,s){const o=Pe(e,t);if(!o)return;const n=o.attributes.device_class,i=Ce(o),a=Ue(i,t),l=o.attributes.unit_of_measurement??("humidity"===n?"%":"°"),c=De(i,t,n,r),d=/floor/i.test(i)||/floor/i.test(t),p=qe(e,t);return{name:a,entity_id:t,area:Oe(e,p),area_id:p,value:Ie(o),unit:l,kind:c,height_ft:be(t,s,{isFloor:d,isRoom:"room"===c&&!d})}}function $e(e,t,r){if(t.room_sensors?.length)return[...t.room_sensors];const s=function(e,t,r){const s=new Set;for(const e of t.zones??[])e.floor_sensor&&s.add(e.floor_sensor),e.room_sensor&&s.add(e.room_sensor),e.humidity_sensor&&s.add(e.humidity_sensor);for(const o of r){const r=t.zones?.find(e=>e.climate_entity===o.climate_entity)??{name:o.name,climate_entity:o.climate_entity};for(const t of[r.floor_sensor??Le(e,o.name,"floor temperature","temperature",o.climate_entity),r.room_sensor??Le(e,o.name,"room temperature","temperature",o.climate_entity),r.humidity_sensor??Le(e,o.name,"humidity","humidity",o.climate_entity)])t&&s.add(t)}return s}(e,t,r),o=function(e){const t=new Set;for(const r of Object.values(e.states)){if(!r.entity_id.startsWith("climate."))continue;const e=He(r.entity_id);t.add(`sensor.${e}_floor_temperature`),t.add(`sensor.${e}_room_temperature`)}return t}(e),n=[];for(const t of Object.values(e.states)){if(!t.entity_id.startsWith("sensor."))continue;if(!Fe(t))continue;if(s.has(t.entity_id))continue;const e=Ce(t);Xe(e,t.entity_id)||(Te(t.entity_id,e,o)||n.push(t.entity_id))}for(const e of je(t).keys())n.includes(e)||n.push(e);return n.sort()}function et(e,t){if(e.area_id){const r=t.find(t=>t.area_id&&t.area_id===e.area_id);if(r)return r}const r=t.find(t=>function(e,t){return!(!e||!t)&&Ne(e)===Ne(t)}(e.area,t.area));return r||t.find(t=>function(e,t){const r=Ne(e),s=Ne(t.name);return r.includes(s)||s.includes(r)}(e.name,t))}function tt(e,t,r){const s=je(r).get(e.entity_id);return s?function(e,t){return t.find(t=>t.climate_entity===e||Ne(t.name)===Ne(e)||Ne(t.climate_entity)===Ne(e))}(s,t):et(e,t)}function rt(e,t){const r=t.zones?.length?t.zones:t.auto_discover?function(e){return Object.values(e.states).filter(e=>e.entity_id.startsWith("climate.")).map(t=>{const r=t.attributes.friendly_name??t.entity_id.replace("climate.","").replace(/_/g," "),s=qe(e,t.entity_id);return{name:Ze(r),climate_entity:t.entity_id,area:Oe(e,s),area_id:s}}).sort((e,t)=>e.name.localeCompare(t.name))}(e):[];return r.map(r=>{const s=function(e,t){const r=Je(e,t)??{},s=Pe(e,r.floor),o=Pe(e,r.room),n=Pe(e,r.humidity);return{floor:Ie(s),room:Ie(o),humidity:Ie(n)}}(e,r),o=r.area_id??qe(e,r.climate_entity),n=r.area??Oe(e,o),i=Je(e,r),a=function(e,t,r){const s=He(t),o=s.split("_").filter(e=>e.length>2),n=Ne(s.replace(/_/g," ")),i=e.states;if(r?.valve_entity){const e=i[r.valve_entity];if(e){const t=Be(r.valve_entity,e.state);return t?[t]:[Qe(r.valve_entity,e.state)]}}const a=[];for(const[e,t]of Object.entries(i))if(e.includes(s)&&e.includes("valve"))if(e.startsWith("number.")||e.startsWith("sensor.")){const r=Be(e,t.state);r&&a.push(r)}else(e.startsWith("switch.")||e.startsWith("binary_sensor."))&&a.push(Qe(e,t.state));if(a.length)return a;for(const[e,t]of Object.entries(i)){if(!e.startsWith("switch.")||!e.includes("floor_control_mode"))continue;const r=e.split("floor_control_mode_").pop()??"",o=Ne(r.replace(/_/g," "));if(o===n||Ne(r)===Ne(s)||o===Ne(s.replace(/_/g," ")))return[Qe(e,t.state)]}const l=Object.entries(i).filter(([e])=>e.startsWith("binary_sensor.")&&e.includes("redawghome_zone"));if(l.length){const e=i[t],r=Ne(e?.attributes?.friendly_name??"").replace(/thm|climate|thermostat/g,"").trim().split(/\s+/).filter(e=>e.length>2),s=Object.entries(i).filter(([e])=>e.startsWith("number.")&&e.includes("valve_count")).map(([e,t])=>({eid:e,state:t,idNorm:Ne(e)})).sort((e,t)=>e.idNorm.localeCompare(t.idNorm));let a,c=0;for(const e of s){const t=parseFloat(e.state.state),s=e.idNorm.includes(n)||o.every(t=>e.idNorm.includes(Ne(t))),i=r.some(t=>e.idNorm.includes(t));if(s||i){!isNaN(t)&&t>0&&(a=t);break}!isNaN(t)&&t>0&&(c+=t)}const d=l.map(([e,t])=>{const r=parseInt(e.match(/zone_(\d+)/)?.[1]??"",10);return{eid:e,state:t,zoneNum:r}}).filter(e=>!isNaN(e.zoneNum)).sort((e,t)=>e.zoneNum-t.zoneNum),p=null!=a&&a>0?d.slice(c,c+a):d.filter(({eid:e})=>{const t=Ne(e);return o.some(e=>t.includes(Ne(e)))});if(p.length)return p.map(({eid:e,state:t})=>Qe(e,t.state))}const c=qe(e,t);if(c){const t=[];for(const[r,s]of Object.entries(i)){if(!r.startsWith("binary_sensor."))continue;const o=s.attributes,n=o.device_class;if("running"!==n&&"heat"!==n)continue;const i=o.icon,a=i?.includes("valve")||i?.includes("pipe"),l=`${o.friendly_name??""} ${r}`.toLowerCase();(a||l.includes("valve")||l.includes("relay")||l.includes("zone")||r.includes("redawghome_zone"))&&(qe(e,r)===c&&t.push(Qe(r,s.state)))}if(t.length)return t}const d=i[t],p=Ne(d?.attributes?.friendly_name??"");if(p){const e=[];for(const[t,r]of Object.entries(i)){if(!t.startsWith("binary_sensor."))continue;const s=r.attributes,o=s.device_class;if("running"!==o&&"heat"!==o)continue;const n=Ne(s.friendly_name??""),i=p.replace(/thm|climate|thermostat/g,"").trim().split(/\s+/).filter(e=>e.length>2);i.some(e=>n.includes(e))&&e.push(Qe(t,r.state))}if(e.length)return e}return[]}(e,r.climate_entity,r),l=a[0];return{name:r.name,climate_entity:r.climate_entity,area:n,area_id:o,floor:r.floor,kind:Ye(e,r,s,t),sensors:s,roomSensors:[],otherSensors:[],linked_sensor_ids:i,valves:a.length?a:void 0,valve_entity:l?.entity_id,valve_position:l?.position,valve_active:l?.active}})}function st(e,t){const r=t.floors??ze,s=rt(e,t),{zones:o,unassigned:n}=function(e,t,r){if(!1===t.show_room_sensors)return{zones:r,unassigned:[]};const s=Me(t),o=t.other_sensor_patterns??ye,n=[],i=r.map(e=>({...e,roomSensors:[],otherSensors:[]}));for(const a of $e(e,t,r)){if(s.has(a))continue;const r=_e(e,a,o,t);if(!r||null==r.value)continue;const l=tt(r,i,t);if(!l){n.push(r);continue}const c=i.find(e=>e.climate_entity===l.climate_entity);"other"===r.kind?c.otherSensors.push(r):c.roomSensors.push(r)}for(const e of i)e.roomSensors.sort((e,t)=>e.name.localeCompare(t.name)),e.otherSensors.sort((e,t)=>e.name.localeCompare(t.name));return n.sort((e,t)=>e.name.localeCompare(t.name)),{zones:i,unassigned:n}}(e,t,s);if(!(!1!==t.group_by_floor))return[{name:"Climate Zones",zones:o,unassignedSensors:n}];const i=new Map;for(const e of r)i.set(e.name,{name:e.name,zones:[],unassignedSensors:[]});const a={name:"Other",zones:[],unassignedSensors:[]},l=e=>Re(e,t,r);for(const e of o){const t=l(e),r=i.get(t);r?r.zones.push(e):a.zones.push(e)}for(const e of n){const s=Ve(e.area_id,e.area,t)??Ke(e.name,e.area,r),o=i.get(s);o?o.unassignedSensors.push(e):a.unassignedSensors.push(e)}const c=r.map(e=>i.get(e.name)).filter(e=>e.zones.length||e.unassignedSensors.length);return(a.zones.length||a.unassignedSensors.length)&&c.push(a),c}const ot=["supply","return","flow","manifold","boiler","water_temp","pump","optimal","inlet","outlet","water heater","tankless","hot water"],nt=["supply","supply temp","supply water","supply temperature","outlet","outlet temp","hot water","outgoing"],it=["return","return temp","return water","return temperature","inlet","inlet temp","cold water","incoming"],at=["flow rate","flow","water flow"],lt=["pump","boiler","circulator","manifold pump"],ct=["power","watt","consumption","current consumption","energy usage","power draw"];function dt(e,t){const r=`${Ne(e)} ${Ne(t)}`;return ot.some(e=>r.includes(Ne(e)))}function pt(e,t,r){const s=`${Ne(e)} ${Ne(t)}`;return r.some(e=>s.includes(Ne(e)))}function ut(e,t){const r=Pe(e,t);if(!r)return;const s=Ie(r);if(null==s)return;return{entity_id:t,value:s,unit:r.attributes.unit_of_measurement??("humidity"===r.attributes.device_class?"%":"°")}}function At(e,t,r){const s=`${Ne(t)} ${Ne(r)}`,o=s.includes("inlet"),n=s.includes("outlet");let i=0;return"supply"===e?(n&&(i+=10),o&&!n&&(i-=12),(r.includes("outlet_temp")||r.endsWith("outlet_temperature"))&&(i+=6)):(o&&(i+=10),n&&!o&&(i-=12),(r.includes("inlet_temp")||r.endsWith("inlet_temperature"))&&(i+=6)),i}function ft(e,t){const r=t.floor_system;if(!1===r)return null;const s=r||{auto_discover:!0},o=s.supply_temp||s.return_temp||s.flow_rate||s.pump_status||s.power||(s.extra_sensors?.length??0)>0,n=s.auto_discover||!o,i=new Set,a={},l=(t,r)=>t||(n?function(e,t,r){const s={supply:nt,return:it,flow:at,pump:lt,power:ct}[t];let o;for(const n of Object.values(e.states)){if(r.has(n.entity_id))continue;const e=Ce(n);if(!dt(e,n.entity_id))continue;if("pump"===t){if(!n.entity_id.startsWith("binary_sensor.")&&!n.entity_id.startsWith("switch."))continue}else if(!n.entity_id.startsWith("sensor."))continue;if(!pt(e,n.entity_id,s))continue;let i=0;if((Ne(e).includes("optimal")||Ne(n.entity_id).includes("optimal"))&&(i+=2),"supply"!==t&&"return"!==t||(i+=At(t,e,n.entity_id)),"supply"===t&&Ne(e).includes("supply")&&(i+=2),"return"===t&&Ne(e).includes("return")&&(i+=2),"flow"===t&&Ne(e).includes("flow")&&(i+=4),"pump"===t&&(Ne(e).includes("pump")||Ne(e).includes("boiler")||Ne(e).includes("heating"))&&(i+=4),"power"===t){const t=(n.attributes.unit_of_measurement??"").toLowerCase();"w"!==t&&"kw"!==t||(i+=4),(Ne(e).includes("power")||Ne(e).includes("watt"))&&(i+=3),Ne(e).includes("consumption")&&(i+=2)}i<0||(!o||i>o.score)&&(o={id:n.entity_id,score:i})}return o?.id}(e,r,i):void 0),c=l(s.supply_temp,"supply");c&&(i.add(c),a.supply_temp=ut(e,c));const d=l(s.return_temp,"return");d&&(i.add(d),a.return_temp=ut(e,d)),null!=a.supply_temp?.value&&null!=a.return_temp?.value&&(a.delta_t=Math.round(10*(a.supply_temp.value-a.return_temp.value))/10);const p=l(s.flow_rate,"flow");p&&(i.add(p),a.flow_rate=ut(e,p));const u=l(s.pump_status,"pump");if(u){i.add(u);const t=Pe(e,u);t&&(a.pump_entity=u,a.pump_active=function(e){const t=e.state;return"unavailable"!==t&&"unknown"!==t&&(e.entity_id.startsWith("binary_sensor.")||e.entity_id.startsWith("switch.")?"on"===t:"on"===t||"running"===t||"heat"===t||"heating"===t)}(t))}const A=l(s.power,"power");A&&(i.add(A),a.power=ut(e,A));const f=Object.values(e.states).find(e=>e.entity_id.startsWith("water_heater."));if(f){a.heater_entity=f.entity_id;const e=f.attributes.temperature;null!=e&&(a.set_temp=e,a.set_temp_unit=f.attributes.unit_of_measurement??f.attributes.temperature_unit??"°")}const h=s.extra_sensors??[],m=[];for(const t of h){if(i.has(t))continue;const r=Pe(e,t);if(!r)continue;const s=Ie(r);if(null==s)continue;const o=Ue(Ce(r),t),n=r.attributes.unit_of_measurement??("humidity"===r.attributes.device_class?"%":"");m.push({entity_id:t,name:o,value:s,unit:n}),i.add(t)}m.length&&(a.extra=m);return a.supply_temp||a.return_temp||a.flow_rate||a.pump_entity||a.power||(a.extra?.length??0)>0?a:null}let ht=class extends ce{setConfig(e){this._config={auto_discover:!0,show_weather:!0,show_room_sensors:!0,group_by_floor:!0,allow_sensor_reassign:!0,reference_height_ft:5,...e}}_valueChanged(e,t){const r=new CustomEvent("config-changed",{detail:{config:{...this._config,[e]:t}}});this.dispatchEvent(r)}_zoneChanged(e,t,r){const s=[...this._config.zones??[]];s[e]={...s[e],[t]:r},this._valueChanged("zones",s),this._valueChanged("auto_discover",!1)}_addZone(){const e=[...this._config.zones??[],{name:"New Zone",climate_entity:""}];this._valueChanged("zones",e),this._valueChanged("auto_discover",!1)}_removeZone(e){const t=(this._config.zones??[]).filter((t,r)=>r!==e);this._valueChanged("zones",t)}_sensorAssignmentChanged(e,t){const r={...this._config.sensor_map??{}},s=new Set(this._config.exclude_entities??[]);"__hidden__"===t?(s.add(e),delete r[e]):"__auto__"===t?(s.delete(e),delete r[e]):(s.delete(e),r[e]=t),this._valueChanged("sensor_map",r),this._valueChanged("exclude_entities",[...s])}_climateEntities(){return Object.keys(this.hass.states).filter(e=>e.startsWith("climate."))}_sensorEntities(){return Object.keys(this.hass.states).filter(e=>e.startsWith("sensor."))}_zoneOptions(){return rt(this.hass,this._config).map(e=>({id:e.climate_entity,name:`${e.name}${e.area?` (${e.area})`:""}`}))}_sensorHeightChanged(e,t){const r={...this._config.sensor_heights??{}},s=t.trim();if(s){const t=parseFloat(s);if(Number.isNaN(t)||t<0)return;r[e]=t}else delete r[e];this._valueChanged("sensor_heights",r)}_referenceHeightChanged(e){const t=parseFloat(e);Number.isNaN(t)||t<0||this._valueChanged("reference_height_ft",t)}_zoneFloorChanged(e,t){const r={...this._config.zone_floors??{}};"__default__"===t?delete r[e]:r[e]=t,this._valueChanged("zone_floors",r)}render(){if(!this.hass)return G``;const e=function(e,t){const r=rt(e,t),s=Me(t),o=je(t),n=t.other_sensor_patterns??ye;return $e(e,t,r).map(i=>{const a=_e(e,i,n,t),l=o.get(i),c=a?et(a,r):void 0;return{entity_id:i,name:a?.name??i,area:a?.area,area_id:a?.area_id,value:a?.value,unit:a?.unit,kind:a?.kind??"other",assigned_zone:l,auto_zone:c?.climate_entity,auto_zone_name:c?.name,hidden:s.has(i),height_ft:a?.height_ft}})}(this.hass,this._config),t=rt(this.hass,this._config),r=Ee(this.hass),s=We(this._config);return G`
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
          ${e.map(e=>{const t=e.hidden?"__hidden__":e.assigned_zone??"__auto__",s=e.area?`Auto (HA: ${e.area}${e.auto_zone_name?` → ${e.auto_zone_name}`:""})`:e.auto_zone_name?`Auto (→ ${e.auto_zone_name})`:"Auto (by HA area)";return G`
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
                    <option value="__auto__">${s}</option>
                    <optgroup label="HA Areas (set on dashboard)">
                      ${r.map(e=>G`<option disabled value=${`area:${e.area_id}`}>${e.name}</option>`)}
                    </optgroup>
                    <optgroup label="Climate zones">
                      ${this._zoneOptions().map(e=>G`<option value=${e.id}>${e.name}</option>`)}
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
          ${t.map(e=>G`
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
                  ${s.map(e=>G`<option value=${e}>${e}</option>`)}
                </select>
              </div>
            `)}
        </div>

        ${this._config.auto_discover??1?"":G`
              <div class="zones-section">
                <div class="section-header">
                  <span>Zones</span>
                  <button @click=${this._addZone}>+ Add Zone</button>
                </div>
                ${(this._config.zones??[]).map((e,t)=>G`
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
                        ${this._climateEntities().map(e=>G`<option value=${e}>${e}</option>`)}
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
    `}};e([fe({attribute:!1})],ht.prototype,"hass",void 0),e([he()],ht.prototype,"_config",void 0),ht=e([pe("climate-command-center-editor")],ht);let mt=class extends ce{constructor(){super(...arguments),this._expandedZone=null,this._editSensors=!1,this._setupMode=!1,this._setupSaveReminder=!1,this._view="cards",this._placingThermostat=null,this._forecast=null}static get styles(){return ge}setConfig(e){if(!e.zones?.length&&!e.auto_discover)throw new Error("Configure zones or enable auto_discover");this._config={title:"Climate Command Center",auto_discover:!0,show_weather:!0,show_room_sensors:!0,group_by_floor:!0,allow_sensor_reassign:!0,reference_height_ft:5,...e,floors:e.floors?.length?e.floors:ze}}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),this._subscribeForecast()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeForecast()}updated(e){e.has("hass")&&!this._forecastUnsub&&this._subscribeForecast()}async _subscribeForecast(){if(this._unsubscribeForecast(),!this.hass)return;const e=this._config.weather_entity??Object.keys(this.hass.states).find(e=>e.startsWith("weather.")&&(e.includes("weatherflow")||e.includes("tempest")))??Object.keys(this.hass.states).find(e=>e.startsWith("weather."));if(e)try{this._forecastUnsub=await this.hass.connection.subscribeMessage(e=>{e.forecast&&(this._forecast=e.forecast.slice(0,8))},{type:"weather/subscribe_forecast",forecast_type:"hourly",entity_id:e})}catch{}}_unsubscribeForecast(){this._forecastUnsub&&(this._forecastUnsub(),this._forecastUnsub=void 0)}get sections(){return st(this.hass,this._config)}get weather(){if(!this._config.show_weather)return null;const e=function(e,t){const r=t.weather_entity??Object.keys(e.states).find(e=>e.startsWith("weather.")&&(e.includes("weatherflow")||e.includes("tempest")))??Object.keys(e.states).find(e=>e.startsWith("weather.")),s=r?Pe(e,r):null,o=s?.attributes??{},n=(t,r,s=[])=>Object.values(e.states).find(e=>{if(!e.entity_id.startsWith("sensor."))return!1;const o=Ne(Ce(e)),n=`${Ne(e.entity_id)} ${o}`;if(r&&e.attributes.device_class!==r)return!1;if(!(n.includes("weather")||n.includes("tempest")||n.includes("weatherflow")))return!1;const i=t.some(e=>n.includes(Ne(e))),a=s.some(e=>n.includes(Ne(e)));return i&&!a})?.entity_id,i=o.temperature??Ie(Pe(e,t.weather_temperature??n(["temperature"],"temperature",["wet bulb","dew","feels","heat index","wind chill"])));if(null==i&&!s)return null;const a={label:s?Ce(s).replace(/\s*(Weather|Forecast|Cloud)$/i,"")||"Weather":"Outside",temperature:i,condition:s?.state,humidity:o.humidity??Ie(Pe(e,t.weather_humidity??n(["humidity"],"humidity"))),feels_like:Ie(Pe(e,t.weather_feels_like??n(["feels like","apparent"],"temperature"))),dew_point:Ie(Pe(e,t.weather_dew_point??n(["dew point"],"temperature"))),wind_speed:o.wind_speed??Ie(Pe(e,n(["wind speed","wind avg"],void 0))),wind_bearing:o.wind_bearing,wind_gust:Ie(Pe(e,n(["wind gust","gust"],void 0))),pressure:o.pressure??Ie(Pe(e,n(["pressure","barometric"],"pressure"))),uv_index:Ie(Pe(e,n(["uv","ultraviolet"],void 0,["solar"]))),visibility:o.visibility,precipitation:Ie(Pe(e,n(["precipitation","rain"],void 0,["probability","lightning"])))};if(r&&s){const e=o.forecast;e?.length&&(a.forecast=e.slice(0,8))}return a}(this.hass,this._config);return e&&this._forecast?.length&&!e.forecast?.length&&(e.forecast=this._forecast),e}get floorSystem(){return ft(this.hass,this._config)}get sunData(){return function(e){const t=Pe(e,"sun.sun");if(!t)return null;const r=t.attributes.elevation??0,s=t.attributes.azimuth??180,o=t.state,n=t.attributes.next_rising,i=t.attributes.next_setting;if(!n||!i)return null;let a=new Date(n),l=new Date(i);const c=new Date;if("above_horizon"===o){const e=new Date(a.getTime()-864e5);a=e}else{const e=new Date(l.getTime()-864e5);l=e;const t=new Date(a.getTime()-864e5);a=t}const d=l.getTime()-a.getTime(),p=c.getTime()-a.getTime(),u=d>0?p/d:0,A=Math.round(d/6e4),f=Math.max(0,Math.round((l.getTime()-c.getTime())/6e4));return{state:o,elevation:r,azimuth:s,rising:a,setting:l,progress:u,daylight_minutes:A,remaining_minutes:f}}(this.hass)}get totalZones(){return this.sections.reduce((e,t)=>e+t.zones.length,0)}get zoneOptions(){return rt(this.hass,this._config)}get haAreas(){return Ee(this.hass)}get floorOptions(){return We(this._config)}async setEntityHaArea(e,t){const r=this.hass;r.callWS&&await r.callWS({type:"config/entity_registry/update",entity_id:e,area_id:t})}async updateSensorAssignment(e,t){if(t.startsWith("area:")){const r=t.slice(5);try{await this.setEntityHaArea(e,r)}catch(t){console.error("Failed to set HA area",e,r,t)}return void this.updateSensorMap(e,"__auto__")}this.updateSensorMap(e,t)}updateZoneFloor(e,t){const r={...this._config.zone_floors??{}};"__default__"===t?delete r[e]:r[e]=t;const s={...this._config,zone_floors:r};this._config=s,me(this,"config-changed",{config:s})}updateZoneKind(e,t){const r={...this._config.zone_kinds??{}};r[e]=t;const s={...this._config,zone_kinds:r};this._config=s,me(this,"config-changed",{config:s})}toggleSetupMode(){this._setupMode?(this._setupMode=!1,this._setupSaveReminder=!0):(this._setupMode=!0,this._editSensors=!1,this._setupSaveReminder=!1)}updateFloorSystem(e,t){if("disabled"===e){const e="true"===t?{...this._config,floor_system:!1}:{...this._config,floor_system:void 0};return this._config=e,void me(this,"config-changed",{config:e})}if(!1===this._config.floor_system)return;const r={...this._config.floor_system??{}};""===t||"__auto__"===t?delete r[e]:r[e]=t;const s=r.supply_temp||r.return_temp||r.flow_rate||r.pump_status||r.heater_image||(r.extra_sensors?.length??0)>0,o={...this._config,floor_system:s?r:void 0};this._config=o,me(this,"config-changed",{config:o})}floorSystemEntityOptions(e){const t=Object.values(this.hass.states),r=(e,t)=>t.some(t=>e.includes(t)),s=e=>{const t=(e.attributes.friendly_name??"").toLowerCase();return`${e.entity_id.toLowerCase()} ${t}`};switch(e){case"supply_temp":case"return_temp":{const o="supply_temp"===e?["supply","hot","outlet","output"]:["return","cold","inlet","input"];return t.filter(e=>{if(!e.entity_id.startsWith("sensor."))return!1;const t=s(e);return!("temperature"!==e.attributes.device_class&&"°F"!==e.attributes.unit_of_measurement&&"°C"!==e.attributes.unit_of_measurement&&!t.includes("temperature")&&!t.includes("temp"))&&(!!r(t,o)||!(!t.includes("water")||!t.includes("heater")))}).map(e=>e.entity_id).sort()}case"flow_rate":return t.filter(e=>{if(!e.entity_id.startsWith("sensor."))return!1;const t=s(e);return r(t,["flow","gpm","gallons","flow_rate"])}).map(e=>e.entity_id).sort();case"pump_status":return t.filter(e=>{const t=e.entity_id.toLowerCase();if(!t.startsWith("switch.")&&!t.startsWith("binary_sensor.")&&!t.startsWith("input_boolean."))return!1;const o=s(e);return r(o,["pump","boiler","circulator","heater","water_heater"])}).map(e=>e.entity_id).sort();default:return[]}}floorSystemFieldValue(e){if(!1===this._config.floor_system)return"__auto__";const t=this._config.floor_system;return t?t[e]??"__auto__":"__auto__"}floorSystemStatusLabel(){if(!1===this._config.floor_system)return"Disabled";const e=this._config.floor_system;if(!e)return"Auto-discovered";return e.supply_temp||e.return_temp||e.flow_rate||e.pump_status?"Configured":"Auto-discovered"}entityOptionLabel(e){const t=this.hass.states[e];return`${t?.attributes?.friendly_name??e} (${e})`}renderFloorSystemFieldSelect(e,t){const r=this.floorSystemEntityOptions(t),s=this.floorSystemFieldValue(t),o=!1===this._config.floor_system;return G`
      <label class="floor-system-field">
        <span class="floor-system-field-label">${e}</span>
        <select
          .value=${s}
          ?disabled=${o}
          @change=${e=>this.updateFloorSystem(t,e.target.value)}
        >
          <option value="__auto__">Auto-discover</option>
          ${r.map(e=>G`<option value=${e}>${this.entityOptionLabel(e)}</option>`)}
        </select>
      </label>
    `}renderFloorSystemSetup(){const e=!1===this._config.floor_system;return G`
      <div class="floor-system-setup" @click=${e=>e.stopPropagation()}>
        <div class="floor-system-setup-header">
          <span class="floor-system-setup-title">Floor System Setup</span>
          <span class="floor-system-setup-status">${this.floorSystemStatusLabel()}</span>
        </div>
        <div class="floor-system-setup-fields">
          ${this.renderFloorSystemFieldSelect("Supply Temp","supply_temp")}
          ${this.renderFloorSystemFieldSelect("Return Temp","return_temp")}
          ${this.renderFloorSystemFieldSelect("Flow Rate","flow_rate")}
          ${this.renderFloorSystemFieldSelect("Pump Status","pump_status")}
          <label class="floor-system-field floor-system-field-text">
            <span class="floor-system-field-label">Heater Image URL</span>
            <input
              type="text"
              .value=${!1!==this._config.floor_system?this._config.floor_system?.heater_image??"":""}
              placeholder="https://... or /local/heater.png"
              ?disabled=${e}
              @input=${e=>this.updateFloorSystem("heater_image",e.target.value)}
            />
          </label>
        </div>
        <label class="floor-system-disable">
          <input
            type="checkbox"
            .checked=${e}
            @change=${e=>this.updateFloorSystem("disabled",e.target.checked?"true":"false")}
          />
          Disable floor system
        </label>
      </div>
    `}async updateZoneHaArea(e,t){if(t)try{await this.setEntityHaArea(e,t)}catch(r){console.error("Failed to set zone HA area",e,t,r)}}callService(e,t,r){this.hass.callService(e,t,r)}setClimate(e,t){this.callService("climate","set_temperature",{entity_id:e,...t})}setHvacMode(e,t){this.callService("climate","set_hvac_mode",{entity_id:e,hvac_mode:t})}adjustSetpoint(e,t,r){const s=t??70;this.setClimate(e,{temperature:Math.round(s+r)})}toggleExpand(e){this._expandedZone=this._expandedZone===e?null:e}updateSensorMap(e,t){const r={...this._config.sensor_map??{}},s=new Set(this._config.exclude_entities??[]);"__hidden__"===t?(s.add(e),delete r[e]):"__auto__"===t?(s.delete(e),delete r[e]):(s.delete(e),r[e]=t);const o={...this._config,sensor_map:r,exclude_entities:[...s]};this._config=o,me(this,"config-changed",{config:o})}updateSensorHeight(e,t){const r={...this._config.sensor_heights??{}},s=t.trim();if(s){const t=parseFloat(s);if(Number.isNaN(t)||t<0)return;r[e]=t}else delete r[e];const o={...this._config,sensor_heights:r};this._config=o,me(this,"config-changed",{config:o})}updateZoneHeight(e,t){const r={...this._config.zone_heights??{}},s=t.trim();if(s){const t=parseFloat(s);if(Number.isNaN(t)||t<0)return;r[e]=t}else delete r[e];const o={...this._config,zone_heights:r};this._config=o,me(this,"config-changed",{config:o})}renderHeightEditor(e,t){return this._editSensors?G`
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
    `:null}renderHeightBadge(e){return null==e?null:G`<span class="height-badge">${e} ft</span>`}renderZoneHeightStats(e,t){const r=ve(e,this._config,t);return r?G`
      <div class="height-stats">
        <span>Avg ${r.simple_average??"—"}\u00B0</span>
        <span>
          Est. @ ${r.reference_height_ft} ft:
          ${r.estimated_at_reference??"—"}\u00B0
        </span>
        ${null!=r.gradient_per_ft?G`<span>${r.gradient_per_ft>0?"+":""}${r.gradient_per_ft}\u00B0/ft</span>`:""}
        <span class="height-stats-meta">${r.point_count} height points</span>
      </div>
    `:null}modeClass(e){return"heat"===e?"mode-heat":"cool"===e?"mode-cool":"heat_cool"===e?"mode-auto":"off"===e?"mode-off":""}actionLabel(e){return e&&"off"!==e?"heating"===e?"Heating":"cooling"===e?"Cooling":"idle"===e?"Idle":"drying"===e?"Drying":"fan"===e?"Fan":e:"Off"}actionClass(e){return"heating"===e?"action-heating":"cooling"===e?"action-cooling":"idle"===e?"action-idle":"action-off"}tempDelta(e,t){if(null!=e&&null!=t)return Math.round(10*(e-t))/10}renderValveLine(e){const t=e.valves?.length?e.valves:e.valve_entity?[{entity_id:e.valve_entity,position:e.valve_position??0,active:!0===e.valve_active}]:[];if(!t.length)return null;const r=e.sensors.floor,s=this.tempToColor(r),o=e.climate_entity.replace(/\./g,"-");return G`
      ${t.map((e,t)=>{const r=e.active,n=e.position,i=e.entity_id.replace(/\./g,"-"),a=`valve-flow-${o}-${i}-${t}`,l=r?s.replace("rgb(","rgba(").replace(")",",0.1)"):"rgba(100,100,120,0.15)";return G`
          <div class="valve-line">
            <svg class="valve-svg" viewBox="0 0 280 20" preserveAspectRatio="xMidYMid meet">
              <defs>
                ${r?G`
                      <pattern
                        id="${a}"
                        x="0"
                        y="0"
                        width="20"
                        height="12"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle r="2" cx="5" cy="6" fill="${s}" opacity="0.7">
                          <animate
                            attributeName="cx"
                            from="-5"
                            to="25"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle r="1.5" cx="15" cy="6" fill="${s}" opacity="0.5">
                          <animate
                            attributeName="cx"
                            from="5"
                            to="35"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </pattern>
                    `:""}
              </defs>
              <rect
                x="10"
                y="4"
                width="200"
                height="12"
                rx="6"
                fill="${l}"
                stroke="${r?s:"rgba(150,150,170,0.3)"}"
                stroke-width="1"
              />
              <rect
                x="12"
                y="6"
                width="196"
                height="8"
                rx="4"
                fill="${r?`url(#${a})`:"rgba(100,130,160,0.2)"}"
              />
              <text
                x="225"
                y="14"
                font-size="10"
                fill="${r?s:"rgba(150,150,170,0.5)"}"
                font-family="sans-serif"
                font-weight="600"
              >
                ${r?"🔓":"🔒"}
              </text>
              <text
                x="250"
                y="14"
                font-size="9"
                fill="${r?s:"rgba(150,150,170,0.5)"}"
                font-family="sans-serif"
                font-weight="600"
              >
                ${n}%
              </text>
            </svg>
          </div>
        `})}
    `}tempToColor(e){if(null==e)return"#64b5f6";const t=(Math.max(50,Math.min(140,e))-50)/90;if(t<.33){return`rgb(${Math.round(30+3*t*70)},${Math.round(130+3*t*70)},${Math.round(245-3*t*50)})`}if(t<.66){const e=(t-.33)/.33;return`rgb(${Math.round(100+155*e)},${Math.round(200-50*e)},${Math.round(195-145*e)})`}{const e=(t-.66)/.34;return`rgb(${Math.round(255)},${Math.round(150-80*e)},${Math.round(50-30*e)})`}}renderFloorSystem(){const e=this.floorSystem;if(!e)return null;const t=e.return_temp?.value,r=e.supply_temp?.value,s=this.tempToColor(t),o=this.tempToColor(r),n=e.return_temp?.unit??"°",i=e.supply_temp?.unit??"°",a=this._config.floor_system,l=(!1!==a&&a?.heater_image?.trim()?a.heater_image.trim():void 0)??"data:image/png;base64,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OjY2NgrZKyfPzC/eMBwF1mPliu+D+lCAUipo/ELhrqCMiUkhQkO1cEskVY21uYGaVVabe2ekAkOauT1WG1Gq0wQAwDl82513X32OljOakW0HSNb36BcHQqhWq4k3NBqNSqViIqAoHZfNGEsGyFYBTarUr1cR0mCPDgFDyp2bE3j0KhVSJoytvnJWZzqV9vq+7/s+58xx5ImzsAKlNH78cXIkXpRSCGGv1zt58mQURdVq9bHHHvv5z39eqVTCMKSUxh+hlKakO+M/CXMUKUmz2azX61bxlqGyjUNFzM3Cirf0WM0xMOSSGLgV6FjScVNXY4zV63XGGCGk1WqJH+r1eqvVajQazWYTY7y8vPzwww9PTEwghOr1uu/7nuc1Go2JiQnxkWq12m63Pc9j7KpbqlarjUZD9MHVarVHH3305Zdfxhh/61vfevrpp33fN5SazS7r3NJ1LrRhqPBp5X5MhlxknZ8VB0l1thoJJ02VbLdKOrFfqVarX/va155++ulGo/HBD37w/vvvf/TRRweDwdbW1okTJ+65556HHnqIENLtdr/0pS995CMfWVxcrFarr7322vr6+unTp9vt9nvf+96XX375hReef8c73rm4uDgYDOr1+iuvvNLtdm+99dZut1upVH784x/XarUgCBYWFtbW1l577bWbbrppMBgghPRzuXOFrA2n0zgMKXYoZptciwlNHthTekxGirjUCh12QMbY2NjYY4899uSTT/7BH/xBv9//yle+cuDAge3t7a9+9auf/OQnH3roob/+678Ow/Dee+9ljLXb7Xq9/sgjjxw9ehQA8OUvf/m3fuu3fvKTp5966qnt7e3x8db3vvfk5z73uUOHDj/88MPPPPPM2NjYd77znU6n85nPfGZqaqparVJK5+fnKaVbW1sYY9tIOdf4zLWKHSZJa2p/VrOus6CaYWXaJIwuV8SBuLFthMf62c9+9qlPferYsWOe5125cuUHP/gBIeS+++779Kc/PRgMFhcX/+zP/uzw4cNjY2Mf//jHq9UqxrhSqWxubv7mb/7mn/zJnxw/fvwzn/nMZz/72Y9+9KNf/OIXn3zyH8OQvvDCC5///OenpqYeeeSRr371qwghxlgYhvfdd983vvENCOF73vOefr+fJQ6opOv0rssEC5WOK7cdV5k76RloxWSlayBOg/Tjrg1JY+U2uSDnakC/32eMTU5O9vv9TqczPz/f6XRGo9Hi4mKv11tZWWm321NTUxsbG57nbWxsRFEURRGlNAiCubm59fX1SqVy8ODBmZmZtbW1I0eODAaDF1544X3ve9/MzMzW1tYHP/jBxcXFra2t4XDY7/er1eqDDz744Q9/2Pf9ODeULjKRRaqUbfRZkh5XS6WlbjCVFMZLAn6a8pdhPqtRwnUQurZFEwsZFqW0UqlMT08//fTTs7Ozc3Nzzz//fL1er9VqzzzzDGNsYWFhOBxubW21Wi3P89rtNiFEZIKc89FoBADAGPu+jzFGCI1GI8YYxjiKIoSQSDY9z4uiSDxLxlgURUEQpO6y/taoNruUz5CGt9muhCyUpTm+FDpWnbYUPsid9mu1IxuiJ6qRKtdDH0ss+uFw+LGPfeyll1760z/90y984QtPPfXU+9//fgjA0pmzX/z8F578hye++PkvHDl8+I477uh2u48//ni32xVgaRiGURRBCBFCGGNCiLitnU7n2LFjTzzxxIULF+bm5p599tnl5eVmsyneIK3VaBaxISqhWtZSXrVei8sN91fpjekn/Kb6E7PJbIz8mUi9m4SntlQAx1k6Ygz15OTkH//xH3//+9/vdrt/9Ed/tGfPnrW1tQceeGDP3r1//93v3nX33Q9+6EGE0Cc+8Ym//du/3b9//549e1qt1nA4jPcUz/NiIC4Igptvvvmee+753Oc+t7CwwBibmpqKoigMQ+HhUnNKTdinGgaOFeNZWkzUSASYkBz1tOBczLaIrqIqk0111RYJtqA5fi2cyksvvRRFkYDUxXbWaDQAAJubm81m8+E/fxgC8B//8A83tzYF0MA5r1QqYrMTG1wYhowxz/MIIcPhUOyGg8Gg1+uNjY3VarUTJ04sLS3dddddV65cabfbS0tL7XZ7//79ws/lRp0i3tcMlMt9Tqlux9QdNxnUJuVFScNw23YmK5yi3+8vLy/Pzc1J82jDPlgI4Wg0OnTo0D333BMX5Uo2rG63++KLL4ZhKKwqLgXG7md1dRVj3G63gyAAAIhdLBnwxo9c/J8QIqIusTOKEKparfq+PxgMMMaUUt/3KaXD4TClG6aRZzEh3EknsOXuShphCEN12tzoR5+dGVYnBbzc6XSWl5fn5+cJIVmHlGUrSdeecArCsCymfznsgzEyGVcDxTkJqAlCGASB53lxdpYMIzDGyVsThmG8sTLGhLMZDofCjIRrTDrIgkQxPWndpA6tomLmUsEM9QdVtpur/GGu0JTbY60BcXZ3EKaqAgohDMNQFZBKSxPZvVwYrknoIw2eTCIDzbgH/a03ZzcYDqbT8GyzN0fKUc6KwqUWc67iq+omxyCZW0mnBD5WCtpJ+dsshSN1uibNAibFliJD+vRDnaR7ZW4J0lzCRC85pO8kk7o0q64FDb7g1o7rmBVmK3R6xpmVYzDZxfTtb+YD9fTyOCU2wmfV25wlN0rpSLiuMkbmrxixjO1MKvSWDImyyRSlVDQUUc45Y1wEiRDyqwI2gMfHFDIj15YvTFh+quTLJK/UKw9qTkOFQJrvmLaTDTWglHk4oR9rajKUNGcQZm7DbrVarVQqq6urqlPX7Cbi9xhh4pFaoxZFURQyBgDC2CcEYgI4B5xzwCljEHAAIOOcMw7BG1LSqppMbOuqmNeEravplyzYXa2SEHMgH9vmKyrxnNwrSvkI905oo3cTcuedd8aVmWTtTPyTUipYe+JnUYcRvxS1QsY5p9EPv/fYjW/ZOzk1tb6+ur3d63aD7iD0PVKr1arViu97EeWUA+xVqtU6REQAYMnZO9lYLUUeyr4tmRPokdIYE0lhJakVXGT6gZ5hbBhOSR1tHAKKFDs7wl4Vzsdpe/wn8chGo1EURTMzM7vObsAYqwA3k1cYjv7+kf92ZuuFubtuGZw9c/rU6y++ev7E2Qs0inyMp9pjU+3x0YhFAKxvDd75Gx/493/4nymllFFOWbhjpsJqBRM1tub497FZx5VjaawtLlrcAM6vGl/CRoXWF4IQAdk4U+kILn0t2aq7Vc3q4TEAqTrg1W9kb7BzpeWKOPEUpTax/oV5VSqVer3eaDQajcbs7Oz+/fut7ISUOFY0t4IhbspwOAScrl65uLpSo/1VGHbGKnS+Xe12RzTi4XDQ32aNKvFrHh0FUxON2dlZh5NJ+tSkqdE3XozSiNIwisTvr74ndrGcU/GjMEvhfQX6n3QDmgFB2Zw/+0M2F5OaGqOMc8qFQ+UAcHrVcDkAEECwo7CAOAIYxLgDeMO4k1lX8krFnzDG1Wq12WyOjY212+3x8XFRBQEFp38VHHliqLMAIWScAcAx9nClPj5eq+LmKBhtb3fX10GEcScMI8Z9v+pXUKPqb3khJIRSCiEAEEHZOs4Cp+I04ooTAGVq5sYeMTbW5CumBsXeNNp5JYOEZG9I7E01hB8OQK1Sq1Sqg9GQsYAx4HsVz8MIE4QQ4zQKIxZR4XLF1QPAOaPinEUNLQ5gIISe59Vqtenp6fGdV7PZrNVqqgTfAcoi12Ey4jVLkANOGYTQ9zy/UgW0Va10KgQBCCjgEeM1jDDmjFIAUcggQvGuBN2ED3OTmlxl3lQNqkQzTdqoSLdp5iX2pud++uOfPveTt9/71oqHNzY3z2/21zc7jCO/UkcIegS3xpoI4YpXgb7PAQHY4wx0O51erzc+Pj4xMTE2NjYxMSF+kJpREpKUetbrJLzmbGMYo9GgP9WoT03NDyqrG1fWGECDEETc8zxUr1XGGlWEeMTAMOK9/pBSSghWFbPKGpFtqNuZShU1rIRcoWgIoXm02t++9NjffKlFT++bb2+sr506v/bKa+eurHdGEeccTLYbB2/YMz3RPLR/fmW9u7zt/Yf/9F/a0zM0iiBCzWazWq3qZQRVY6ELbYWgbI11jYYs49yvNqYXD14+/8yJ8xthb/P1la0zFzbOnluPQoAwqHnNTo8gQtY6w84ALe45hDHiHIgdz6E9K1c/XQPh5JYjNZ+1gmo1vZaihEowYBysXl7bO+37fFQDw2YNdGs+GzDOQQ3zJhnONOtj1egy7flofHp2cqI9pddYy6aHJc6eIbu08Sn/CqDneb/77z578pUXBv2tQW9rur72rn1bd24PIOeI4FazOTY2Vm+2/Gpzem7xlltvgxBxwEsZf+cGTLvN/DFvLo+zUU2pg0aUUTY2Vt270N7y2JX1DQ5AEFLGEIKs4uPxMX9qslav+aOADoaj0XDIOWecIYisZra/maN7iz1IAACt11u3v+2dFk8IQIeeyTfxZasCmvsKghAA0GzVa/V60Oj5vhdFACBMAUWQ+x6s+7BR9XwfEw/6HsGYAACQgb4m2L1h49c5zAIA7+zuYmeJTYcDeE3TbZaiY+4DrrNXA8XGC+Y+fky8RpWMN6rV+niv02UcQYgIxr7HKx7wKxhChDGemBifnZzohJBxsRez4t7aLbQlb8qCzlKwSzSF3CPbft2urmyDrwYAgOm5PdVW+/JG78zFta3VzfUuHQRs2O0wAIMIbGziC6sBqnYD0r28Plg8dGd7cppzDiEqeFHO4TzMFndLVMM2tHcNfGzCGdfXlVNTUtyIDNLB8eYDf1T1mWyCKX2bgOtOvfrCq8ef7W9t9Tqb3UFvu9MddnohZYyxWq0yvzhfb46NT7Sn52648ea3Tc/MMhZBiFUrTarBqZ8paXXf/i8XotwOR4oQawAAAABJRU5ErkJggg==",c=136,d=136,p=132,u=12,A=14,f=183.68,h=206.8;return G`
      <div class="floor-system tankless-visual">
        <svg class="tankless-svg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="heaterClip">
              <rect x="${p}" y="${u}" width="${c}" height="${d}" rx="8"/>
            </clipPath>
            <!-- CFD-style flow: left-pointing arrows for inlet (cold return, flows RIGHT to LEFT toward tank) -->
            <pattern id="inletFlow" x="0" y="0" width="28" height="16" patternUnits="userSpaceOnUse">
              <rect width="28" height="16" fill="${s}" opacity="0.2"/>
              <polygon points="18,8 28,5 28,11" fill="${s}" opacity="0.9">
                <animate attributeName="points" values="18,8 28,5 28,11;-10,8 0,5 0,11" dur="1.1s" repeatCount="indefinite"/>
              </polygon>
              <polygon points="6,8 14,6 14,10" fill="${s}" opacity="0.75">
                <animate attributeName="points" values="6,8 14,6 14,10;-22,8 -14,6 -14,10" dur="1.1s" repeatCount="indefinite"/>
              </polygon>
              <polygon points="19,3 25,1.5 25,4.5" fill="${s}" opacity="0.5">
                <animate attributeName="points" values="19,3 25,1.5 25,4.5;-9,3 -3,1.5 -3,4.5" dur="1.4s" repeatCount="indefinite"/>
              </polygon>
              <polygon points="4,13 10,11.5 10,14.5" fill="${s}" opacity="0.5">
                <animate attributeName="points" values="4,13 10,11.5 10,14.5;-24,13 -18,11.5 -18,14.5" dur="1.4s" repeatCount="indefinite"/>
              </polygon>
              <circle r="1.8" cx="22" cy="5" fill="${s}" opacity="0.6">
                <animate attributeName="cx" from="32" to="4" dur="1.1s" repeatCount="indefinite"/>
              </circle>
              <circle r="1.5" cx="8" cy="12" fill="${s}" opacity="0.55">
                <animate attributeName="cx" from="30" to="2" dur="1.3s" repeatCount="indefinite"/>
              </circle>
            </pattern>
            <pattern id="outletFlow" x="0" y="0" width="28" height="16" patternUnits="userSpaceOnUse">
              <rect width="28" height="16" fill="${o}" opacity="0.25"/>
              <polygon points="28,8 18,5 18,11" fill="${o}" opacity="0.95">
                <animate attributeName="points" values="28,8 18,5 18,11;0,8 -10,5 -10,11" dur="0.8s" repeatCount="indefinite"/>
              </polygon>
              <polygon points="14,8 6,6 6,10" fill="${o}" opacity="0.8">
                <animate attributeName="points" values="14,8 6,6 6,10;-14,8 -22,6 -22,10" dur="0.8s" repeatCount="indefinite"/>
              </polygon>
              <polygon points="25,3 19,1.5 19,4.5" fill="${o}" opacity="0.55">
                <animate attributeName="points" values="25,3 19,1.5 19,4.5;-3,3 -9,1.5 -9,4.5" dur="1s" repeatCount="indefinite"/>
              </polygon>
              <polygon points="10,13 4,11.5 4,14.5" fill="${o}" opacity="0.55">
                <animate attributeName="points" values="10,13 4,11.5 4,14.5;-18,13 -24,11.5 -24,14.5" dur="1s" repeatCount="indefinite"/>
              </polygon>
              <circle r="1.8" cx="22" cy="5" fill="${o}" opacity="0.65">
                <animate attributeName="cx" from="32" to="4" dur="0.8s" repeatCount="indefinite"/>
              </circle>
              <circle r="1.5" cx="8" cy="12" fill="${o}" opacity="0.6">
                <animate attributeName="cx" from="30" to="2" dur="1s" repeatCount="indefinite"/>
              </circle>
            </pattern>
          </defs>

          <!-- Pump status indicator (top right) -->
          ${null!=e.pump_entity?G`
                <circle cx="385" cy="18" r="5" fill="${e.pump_active?"#4caf50":"#616161"}"/>
                <text x="385" y="32" font-size="6" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="sans-serif">PUMP</text>
              `:""}

          <!-- Unit shadow -->
          <ellipse cx="200" cy="${151}" rx="92" ry="4" fill="rgba(0,0,0,0.28)"/>

          <!-- Heater unit image -->
          <image
            href="${l}"
            x="${p}"
            y="${u}"
            width="${c}"
            height="${d}"
            clip-path="url(#heaterClip)"
            preserveAspectRatio="xMidYMid meet"
          />
          <rect x="${p}" y="${u}" width="${c}" height="${d}" rx="8"
            fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
          <!-- Set temp overlay on the display area -->
          <circle cx="${p+92.48}" cy="${46}" r="14" fill="rgba(0,0,0,0.55)"/>
          <text x="${p+92.48}" y="${null!=e.set_temp?"43.28":"50.080000000000005"}" font-size="10" text-anchor="middle"
            fill="#ffb74d" font-family="sans-serif" font-weight="700"
          >${null!=e.set_temp?`${e.set_temp}°`:null!=r?`${r}${i}`:"—"}</text>
          ${null!=e.set_temp?G`
            <text x="${p+92.48}" y="${56.88}" font-size="5" text-anchor="middle" fill="rgba(255,255,255,0.5)"
              font-family="sans-serif" font-weight="600">SET</text>
          `:""}

          <!-- Copper connection stubs at bottom of heater -->
          <rect x="${176.68}" y="${146}" width="14" height="10" rx="2" fill="#b87333" stroke="#8b5a2b" stroke-width="0.5"/>
          <rect x="${199.8}" y="${146}" width="14" height="10" rx="2" fill="#b87333" stroke="#8b5a2b" stroke-width="0.5"/>

          <!-- Outlet pipe (hot supply) — sweeps from left edge down and curves up into heater stub -->
          <path d="M 0,${169} L ${143.68},${169} Q ${f},${169} ${f},${156}"
            fill="none" stroke="rgba(200,200,210,0.35)" stroke-width="${A}" stroke-linecap="round"/>
          <path d="M 0,${169} L ${143.68},${169} Q ${f},${169} ${f},${156}"
            fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="${12}" stroke-linecap="round"/>
          <path d="M 3,${169} L ${143.68},${169} Q ${f},${169} ${f},${156}"
            fill="none" stroke="url(#outletFlow)" stroke-width="${10}" stroke-linecap="round"/>
          <!-- Glass highlight on horizontal section -->
          <path d="M 6,${164} L ${139.68},${164}"
            fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2" stroke-linecap="round"/>

          <!-- Inlet pipe (cold return) — sweeps from right edge down and curves up into heater stub -->
          <path d="M 400,${169} L ${246.8},${169} Q ${h},${169} ${h},${156}"
            fill="none" stroke="rgba(200,200,210,0.35)" stroke-width="${A}" stroke-linecap="round"/>
          <path d="M 400,${169} L ${246.8},${169} Q ${h},${169} ${h},${156}"
            fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="${12}" stroke-linecap="round"/>
          <path d="M 397,${169} L ${246.8},${169} Q ${h},${169} ${h},${156}"
            fill="none" stroke="url(#inletFlow)" stroke-width="${10}" stroke-linecap="round"/>
          <!-- Glass highlight on horizontal section -->
          <path d="M ${250.8},${164} L 394,${164}"
            fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2" stroke-linecap="round"/>

          <!-- Hot output temp label (left) -->
          <text x="42" y="${158}" font-size="11" text-anchor="middle" fill="${o}" font-family="sans-serif" font-weight="700">${null!=r?`${r}${i}`:"—"}</text>
          <text x="42" y="${188}" font-size="7" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-family="sans-serif" font-weight="600">HOT OUTPUT</text>

          <!-- Cold input temp label (right) -->
          <text x="358" y="${158}" font-size="11" text-anchor="middle" fill="${s}" font-family="sans-serif" font-weight="700">${null!=t?`${t}${n}`:"—"}</text>
          <text x="358" y="${188}" font-size="7" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-family="sans-serif" font-weight="600">COLD INPUT</text>

          <!-- Stats row below pipes -->
          ${(()=>{const t=[];if(e.flow_rate&&t.push({label:"FLOW",value:`${e.flow_rate.value} ${e.flow_rate.unit}`,color:"#64b5f6"}),null!=e.delta_t&&t.push({label:"ΔT",value:`${e.delta_t}°`,color:"rgba(255,255,255,0.7)"}),e.power&&t.push({label:"POWER",value:`${e.power.value} ${e.power.unit}`,color:"#ffb74d"}),!t.length)return"";const r=400/(t.length+1);return t.map((e,t)=>{const s=r*(t+1);return L`
                <rect x="${s-36}" y="${194}" width="72" height="20" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="0.6"/>
                <text x="${s}" y="${204}" font-size="8" text-anchor="middle" fill="${e.color}" font-family="sans-serif" font-weight="700">${e.value}</text>
                <text x="${s}" y="${211}" font-size="5" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="sans-serif" font-weight="600">${e.label}</text>
              `})})()}
        </svg>
      </div>
    `}conditionIcon(e){return{"clear-night":"🌙",sunny:"☀️",partlycloudy:"⛅",cloudy:"☁️",rainy:"🌧️",snowy:"❄️","snowy-rainy":"🌨️",hail:"🌨️",lightning:"⚡","lightning-rainy":"⛈️",fog:"🌫️",windy:"💨","windy-variant":"💨",exceptional:"⚠️",pouring:"🌧️"}[e??""]??"🌤️"}renderWeatherStrip(){const e=this.weather;return e?G`
      <div class="weather-strip">
        <div class="weather-main">
          <span class="weather-icon">${this.conditionIcon(e.condition)}</span>
          <div>
            <div class="weather-temp">${e.temperature??"—"}\u00B0</div>
            <div class="weather-label">${e.label}</div>
          </div>
        </div>
        <div class="weather-stats">
          ${null!=e.humidity?G`<span>\uD83D\uDCA7 ${Math.round(e.humidity)}%</span>`:""}
          ${null!=e.feels_like?G`<span>Feels ${Math.round(e.feels_like)}\u00B0</span>`:""}
          ${null!=e.dew_point?G`<span>Dew ${Math.round(e.dew_point)}\u00B0</span>`:""}
          ${null!=e.wind_speed?G`<span>\uD83D\uDCA8 ${Math.round(e.wind_speed)}${e.wind_gust?` (${Math.round(e.wind_gust)})`:""} mph</span>`:""}
          ${null!=e.pressure?G`<span>\uD83D\uDCCA ${Math.round(e.pressure)} mb</span>`:""}
          ${null!=e.uv_index?G`<span>\u2600\uFE0F UV ${e.uv_index}</span>`:""}
        </div>
        ${e.forecast?.length?G`
              <div class="weather-forecast">
                ${e.forecast.map(e=>{const t=new Date(e.datetime).toLocaleTimeString("en-US",{hour:"numeric",hour12:!0});return G`
                    <div class="forecast-day">
                      <span class="forecast-day-name">${t}</span>
                      <span class="forecast-condition">${this.conditionIcon(e.condition)}</span>
                      <span class="forecast-temps">
                        <span class="forecast-hi">${e.temperature??"—"}\u00B0</span>
                        <span class="forecast-lo">${e.templow??""}${null!=e.templow?"°":""}</span>
                      </span>
                      ${null!=e.precipitation_probability?G`<span class="forecast-precip">\uD83D\uDCA7${e.precipitation_probability}%</span>`:""}
                    </div>
                  `})}
              </div>
            `:""}
      </div>
    `:null}renderSunTracker(){if(!1===this._config.show_sun_tracker)return null;const e=this.sunData;if(!e)return null;const t="above_horizon"===e.state,r=200,s=95,o=[];for(let e=0;e<=120;e++){const t=Math.PI+e/120*Math.PI;o.push({x:r+170*Math.cos(t),y:s+75*Math.sin(t)})}const n=`M ${o.map(e=>`${e.x},${e.y}`).join(" L ")}`,i=Math.max(0,Math.min(1,(e.azimuth-60)/240)),a=Math.PI+i*Math.PI,l=r+170*Math.cos(a),c=s+75*Math.sin(a),d=o.length-1,p=o[0],u=o[d],A=Math.round(120*i),f=`M ${o.slice(0,Math.min(A+1,o.length)).map(e=>`${e.x},${e.y}`).join(" L ")}`,h=e=>e.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0}),m=h(e.rising),g=h(e.setting),b=(new Date).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0}),v=Math.floor(e.remaining_minutes/60),x=e.remaining_minutes%60,y=t?`${v}h ${x}m`:"";return G`
      <div class="sun-tracker">
        <svg class="sun-tracker-svg" viewBox="0 0 400 110">
          <defs>
            <radialGradient id="sunG" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(255,235,59,0.95)"/>
              <stop offset="40%" stop-color="rgba(255,193,7,0.4)"/>
              <stop offset="100%" stop-color="rgba(255,193,7,0)"/>
            </radialGradient>
            <linearGradient id="arcTraveled" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="rgba(255,183,77,0.7)"/>
              <stop offset="50%" stop-color="rgba(255,235,59,0.9)"/>
              <stop offset="100%" stop-color="rgba(255,183,77,0.7)"/>
            </linearGradient>
          </defs>

          <!-- Horizon line -->
          <line x1="20" y1="${s}" x2="380" y2="${s}" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>

          <!-- Full arc path (dashed) -->
          <path d="${n}" fill="none" stroke="rgba(255,235,59,0.15)" stroke-width="1" stroke-dasharray="4,3"/>

          <!-- Traveled arc (solid golden) -->
          ${t&&A>0?G`
            <path d="${f}" fill="none" stroke="url(#arcTraveled)" stroke-width="1.8"/>
          `:""}

          <!-- Sunrise marker -->
          <circle cx="${p.x}" cy="${p.y}" r="3" fill="#FFB74D" opacity="0.8"/>
          <text x="${p.x}" y="${p.y+12}" font-size="7" fill="#FFB74D" font-family="sans-serif" font-weight="600" text-anchor="middle">${m}</text>

          <!-- Sunset marker -->
          <circle cx="${u.x}" cy="${u.y}" r="3" fill="#FF8A50" opacity="0.8"/>
          <text x="${u.x}" y="${u.y+12}" font-size="7" fill="#FF8A50" font-family="sans-serif" font-weight="600" text-anchor="middle">${g}</text>

          <!-- Sun glow + sun disc -->
          ${t?G`
            <circle cx="${l}" cy="${c}" r="16" fill="url(#sunG)"/>
            <circle cx="${l}" cy="${c}" r="5.5" fill="#FFD54F" stroke="#FFF59D" stroke-width="0.8"/>
            <!-- Time label near sun -->
            <text x="${l}" y="${c-12}" font-size="7.5" fill="white" font-family="sans-serif" font-weight="700" text-anchor="middle">${b}</text>
          `:G`
            <circle cx="${r}" cy="${65}" r="4" fill="rgba(200,200,220,0.6)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
          `}

          <!-- Compass labels -->
          <text x="18" y="${93}" font-size="8" fill="rgba(255,255,255,0.4)" font-family="sans-serif" font-weight="700">E</text>
          <text x="${r}" y="10" font-size="8" fill="rgba(255,255,255,0.3)" font-family="sans-serif" font-weight="700" text-anchor="middle">S</text>
          <text x="382" y="${93}" font-size="8" fill="rgba(255,255,255,0.4)" font-family="sans-serif" font-weight="700" text-anchor="end">W</text>

          <!-- Elevation + remaining -->
          <text x="${r}" y="${107}" font-size="7.5" fill="rgba(255,255,255,0.5)" font-family="sans-serif" text-anchor="middle">
            ${t?`Elev ${Math.round(e.elevation)}°${y?` · ${y} left`:""}`:"Below horizon"}
          </text>
        </svg>
      </div>
    `}renderSensorRow(e,t,r="°"){return G`
      <div class="sensor-row">
        <span class="sensor-label">${e}</span>
        <span class="sensor-value">${null!=t?`${t}${r}`:"—"}</span>
      </div>
    `}renderSensorAssign(e){if(!this._editSensors)return null;const t=this._config.sensor_map?.[e.entity_id]??(this._config.exclude_entities?.includes(e.entity_id)?"__hidden__":"__auto__"),r=et(e,this.zoneOptions),s=e.area?`Auto (HA: ${e.area}${r?` → ${r.name}`:""})`:r?`Auto (→ ${r.name})`:"Auto (by HA area)";return G`
      <select
        class="sensor-assign-select"
        .value=${t}
        @change=${t=>{this.updateSensorAssignment(e.entity_id,t.target.value)}}
        @click=${e=>e.stopPropagation()}
      >
        <option value="__auto__">${s}</option>
        <optgroup label="HA Areas (updates Home Assistant)">
          ${this.haAreas.map(e=>G`<option value=${`area:${e.area_id}`}>${e.name}</option>`)}
        </optgroup>
        <optgroup label="Climate zones">
          ${this.zoneOptions.map(e=>G`<option value=${e.climate_entity}>${e.name}${e.area?` (${e.area})`:""}</option>`)}
        </optgroup>
        <option value="__hidden__">Hide</option>
      </select>
    `}renderZoneFloorEdit(e){if(!this._editSensors)return null;const t=this._config.zone_floors?.[e.climate_entity]??"__default__";return G`
      <label class="zone-floor-edit" @click=${e=>e.stopPropagation()}>
        Floor
        <select
          .value=${t}
          @change=${t=>this.updateZoneFloor(e.climate_entity,t.target.value)}
        >
          <option value="__default__">Auto (from HA area)</option>
          ${this.floorOptions.map(e=>G`<option value=${e}>${e}</option>`)}
        </select>
      </label>
    `}renderZoneKindSetup(e){const t=this._config.zone_kinds?.[e.climate_entity]??e.kind,r=!!this._config.zone_kinds?.[e.climate_entity];return G`
      <div class="zone-kind-setup" @click=${e=>e.stopPropagation()}>
        <span class="zone-kind-setup-label">Heating type${r?"":" (auto)"}</span>
        <div class="zone-kind-toggle">
          <button
            class="zone-kind-btn ${"floor_heat"===t?"active floor":""}"
            @click=${()=>this.updateZoneKind(e.climate_entity,"floor_heat")}
          >Floor Heat</button>
          <button
            class="zone-kind-btn ${"thermostat"===t?"active hvac":""}"
            @click=${()=>this.updateZoneKind(e.climate_entity,"thermostat")}
          >HVAC</button>
        </div>
      </div>
    `}renderZoneAreaEdit(e){return this._editSensors?G`
      <label class="zone-area-edit" @click=${e=>e.stopPropagation()}>
        HA area
        <select
          .value=${e.area_id??""}
          @change=${t=>{this.updateZoneHaArea(e.climate_entity,t.target.value)}}
        >
          <option value="">\u2014</option>
          ${this.haAreas.map(e=>G`<option value=${e.area_id}>${e.name}</option>`)}
        </select>
      </label>
    `:null}renderAreaLabel(e){return e.area?G`<div class="room-sensor-area">${e.area}</div>`:null}renderRoomSensorChip(e){return G`
      <div class="room-sensor-chip">
        <div class="room-sensor-name">${e.name} ${this.renderHeightBadge(e.height_ft)}</div>
        ${this.renderAreaLabel(e)}
        <div class="room-sensor-temp">${e.value??"—"}${e.unit??"°"}</div>
        ${this.renderSensorAssign(e)}
        ${this.renderHeightEditor(e.entity_id,e.height_ft)}
      </div>
    `}renderOtherSensorChip(e){return G`
      <div class="other-sensor-chip">
        <span class="other-sensor-name">${e.name}</span>
        <span class="other-sensor-value">${e.value??"—"}${e.unit??""}</span>
        ${this.renderHeightBadge(e.height_ft)}
        ${this.renderSensorAssign(e)}
        ${this.renderHeightEditor(e.entity_id,e.height_ft)}
      </div>
    `}renderZoneSensorsBlock(e){const t=e.roomSensors.length>0,r=e.otherSensors.length>0;return t||r?G`
      <div class="zone-area-sensors">
        ${t?G`
              <div class="room-sensors-grid">
                ${e.roomSensors.map(e=>this.renderRoomSensorChip(e))}
              </div>
            `:""}
        ${r?G`
              <div class="other-sensors-box">
                <div class="other-sensors-label">Other sensors</div>
                <div class="other-sensors-list">
                  ${e.otherSensors.map(e=>this.renderOtherSensorChip(e))}
                </div>
              </div>
            `:""}
      </div>
    `:G``}renderZone(e){const t=this.hass.states[e.climate_entity];if(!t)return G``;const r=t.attributes,s=r.current_temperature,o=r.temperature,n=r.humidity,i=r.hvac_action,a=t.state,l=this._expandedZone===e.climate_entity,c=e.sensors,d=r.hvac_modes??["heat","off"],p="floor_heat"===e.kind?d.filter(e=>"heat"===e||"off"===e):d;return G`
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
            ${e.area?G`<div class="zone-area-label">${e.area}</div>`:""}
            ${this._setupMode?this.renderZoneKindSetup(e):""}
            ${this.renderZoneFloorEdit(e)}
            ${this.renderZoneAreaEdit(e)}
          </div>
          <div class="zone-temps">
            <div class="temp-target-row">
              <span class="target-label">Set to</span>
              <span class="target-temp">${o??"—"}\u00B0</span>
            </div>
          </div>
        </div>

        <div class="zone-temp-grid">
          ${null!=c.floor?G`
                <div class="temp-cell">
                  <span class="temp-cell-label">Floor</span>
                  <span class="temp-cell-value">${c.floor}\u00B0</span>
                </div>
              `:""}
          ${null!=c.room?G`
                <div class="temp-cell">
                  <span class="temp-cell-label">Room</span>
                  <span class="temp-cell-value">${c.room}\u00B0</span>
                </div>
              `:""}
          ${null!=s&&null==c.floor&&null==c.room?G`
                <div class="temp-cell">
                  <span class="temp-cell-label">Current</span>
                  <span class="temp-cell-value">${s}\u00B0</span>
                </div>
              `:""}
          ${null==s||null==c.floor&&null==c.room?"":G`
                <div class="temp-cell">
                  <span class="temp-cell-label">Thermostat</span>
                  <span class="temp-cell-value">${s}\u00B0</span>
                </div>
              `}
          <div class="temp-cell temp-cell-target">
            <span class="temp-cell-label">Target</span>
            <span class="temp-cell-value">${o??"—"}\u00B0</span>
          </div>
          ${null!=n?G`
                <div class="temp-cell">
                  <span class="temp-cell-label">Humidity</span>
                  <span class="temp-cell-value">${n}%</span>
                </div>
              `:null!=c.humidity?G`
                  <div class="temp-cell">
                    <span class="temp-cell-label">Humidity</span>
                    <span class="temp-cell-value">${c.humidity}%</span>
                  </div>
                `:""}
        </div>

        ${this.renderValveLine(e)}

        ${this.renderZoneHeightStats(e,s)}

        ${this.renderZoneSensorsBlock(e)}

        ${l?G`
              <div class="zone-controls">
                ${this._editSensors?G`
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
                  ${p.map(t=>G`
                      <button
                        class="mode-btn ${a===t?"active":""} ${this.modeClass(t)}"
                        @click=${r=>{r.stopPropagation(),this.setHvacMode(e.climate_entity,t)}}
                      >
                        ${t.replace("_","/")}
                      </button>
                    `)}
                </div>
                <div class="setpoint-controls">
                  <button
                    class="step-btn"
                    @click=${t=>{t.stopPropagation(),this.adjustSetpoint(e.climate_entity,o,-1)}}
                  >
                    \u2212
                  </button>
                  <span class="setpoint-display">${o??"—"}\u00B0</span>
                  <button
                    class="step-btn"
                    @click=${t=>{t.stopPropagation(),this.adjustSetpoint(e.climate_entity,o,1)}}
                  >
                    +
                  </button>
                </div>
              </div>
            `:""}
      </div>
    `}get fpThermostats(){return this._config.floor_plan?.thermostats??[]}fpEntityData(e){const t=this.hass.states[e];if(!t)return null;const r=t.attributes??{},s=e.startsWith("climate.");return{state:t.state,action:s?r.hvac_action:void 0,current:s?r.current_temperature:parseFloat(t.state)||void 0,target:s?r.temperature:void 0,name:r.friendly_name??e,unit:r.unit_of_measurement??""}}handleFpClick(e){if(!this._placingThermostat)return;const t=e.currentTarget.getBoundingClientRect(),r=Math.round((e.clientX-t.left)/t.width*100),s=Math.round((e.clientY-t.top)/t.height*100),o={entity_id:"",label:"wall"===this._placingThermostat?"Wall Thermostat":"Floor Sensor",kind:this._placingThermostat,x:Math.max(0,Math.min(100,r)),y:Math.max(0,Math.min(100,s))},n=[...this.fpThermostats];n.push(o);const i={...this._config,floor_plan:{...this._config.floor_plan,thermostats:n}};this._config=i,me(this,"config-changed",{config:i}),this._placingThermostat=null}removeFpThermostat(e){const t=[...this.fpThermostats];t.splice(e,1);const r={...this._config,floor_plan:{...this._config.floor_plan,thermostats:t}};this._config=r,me(this,"config-changed",{config:r})}updateFpThermostat(e,t,r){const s=this.fpThermostats.map((s,o)=>o===e?{...s,[t]:r}:s),o={...this._config,floor_plan:{...this._config.floor_plan,thermostats:s}};this._config=o,me(this,"config-changed",{config:o})}renderFloorPlan(){const e=this.fpThermostats,t=this._placingThermostat,r=Object.keys(this.hass.states).filter(e=>e.startsWith("climate.")||e.startsWith("sensor.")).sort();return G`
      <div class="floor-plan-container">
        <div class="fp-toolbar">
          <span class="fp-toolbar-title">Heated Floor Plan</span>
          <div class="fp-toolbar-actions">
            <button class="fp-place-btn ${"wall"===t?"active":""}"
              @click=${()=>this._placingThermostat="wall"===t?null:"wall"}>
              + Wall Thermostat
            </button>
            <button class="fp-place-btn ${"floor"===t?"active":""}"
              @click=${()=>this._placingThermostat="floor"===t?null:"floor"}>
              + Floor Sensor
            </button>
          </div>
        </div>
        ${t?G`<div class="fp-placing-hint">Click on the floor plan to place a ${"wall"===t?"wall thermostat":"floor sensor"}</div>`:""}

        <div class="fp-map ${t?"placing":""}"
             @click=${e=>this.handleFpClick(e)}>
          <img class="fp-img" src="${"data:image/png;base64,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"}" alt="Floor Plan"/>

          ${e.map(e=>{const t=e.entity_id?this.fpEntityData(e.entity_id):null,r="wall"===e.kind;return G`
              <div class="fp-marker ${r?"wall":"floor"}"
                   style="left:${e.x}%;top:${e.y}%">
                <div class="fp-marker-dot">${r?"T":"F"}</div>
                <div class="fp-marker-info">
                  <span class="fp-marker-label">${e.label}</span>
                  ${t?G`<span class="fp-marker-temp">${t.current??"—"}${t.unit||"°"}</span>`:""}
                </div>
              </div>
            `})}
        </div>

        ${e.length?G`
          <div class="fp-tstat-list">
            <div class="fp-tstat-list-title">Sensors on Plan</div>
            ${e.map((e,t)=>G`
              <div class="fp-tstat-row">
                <span class="fp-tstat-badge ${e.kind}">${"wall"===e.kind?"Wall":"Floor"}</span>
                <input class="fp-tstat-input" type="text" .value=${e.label}
                       placeholder="Label"
                       @change=${e=>this.updateFpThermostat(t,"label",e.target.value)}/>
                <select class="fp-tstat-select"
                        @change=${e=>this.updateFpThermostat(t,"entity_id",e.target.value)}>
                  <option value="" ?selected=${!e.entity_id}>Pick entity...</option>
                  ${r.map(t=>G`
                    <option value="${t}" ?selected=${e.entity_id===t}>
                      ${this.hass.states[t]?.attributes?.friendly_name??t}
                    </option>
                  `)}
                </select>
                <button class="fp-tstat-del" @click=${()=>this.removeFpThermostat(t)}>\u2715</button>
              </div>
            `)}
          </div>
        `:""}

        <div class="fp-legend-bar">
          <div class="fp-legend-item"><span class="fp-legend-swatch fp-swatch-wall"></span>Wall Thermostat</div>
          <div class="fp-legend-item"><span class="fp-legend-swatch fp-swatch-floor"></span>Floor Sensor</div>
        </div>
      </div>
    `}renderUnassigned(e){return e.unassignedSensors.length?G`
      <div class="unassigned-block">
        <div class="unassigned-label">Unassigned sensors</div>
        <div class="other-sensors-list">
          ${e.unassignedSensors.map(e=>"other"===e.kind?this.renderOtherSensorChip(e):this.renderRoomSensorChip(e))}
        </div>
      </div>
    `:null}renderFloorSection(e){return G`
      <section class="floor-section">
        <div class="floor-header">
          <span class="floor-name">${e.name}</span>
          <span class="floor-meta">${e.zones.length} zones</span>
        </div>

        ${e.zones.length?G`<div class="zones-grid">${e.zones.map(e=>this.renderZone(e))}</div>`:""}
        ${this.renderUnassigned(e)}
      </section>
    `}render(){const e=this.sections,t=!1!==this._config.allow_sensor_reassign,r="floorplan"===this._view;return G`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title}</span>
          <div class="header-actions">
            <div class="view-toggle">
              <button class="view-btn ${r?"":"active"}" @click=${()=>this._view="cards"}>Cards</button>
              <button class="view-btn ${r?"active":""}" @click=${()=>this._view="floorplan"}>Floor Plan</button>
            </div>
            ${r?"":G`
                  <button
                    class="edit-sensors-btn ${this._setupMode?"active":""}"
                    @click=${()=>this.toggleSetupMode()}
                  >
                    ${this._setupMode?"Done":"Setup"}
                  </button>
                `}
            ${r||!t||this._setupMode?"":G`
                  <button
                    class="edit-sensors-btn ${this._editSensors?"active":""}"
                    @click=${()=>this._editSensors=!this._editSensors}
                  >
                    ${this._editSensors?"Done":"Assign sensors"}
                  </button>
                `}
            <span class="zone-count">${this.totalZones} zones</span>
          </div>
        </div>
        ${r?G`
              <div class="top-strip">
                ${this.renderWeatherStrip()}
                ${this.renderFloorSystem()}
              </div>
              ${this.renderSunTracker()}
              ${this.renderFloorPlan()}
            `:G`
              ${this._setupSaveReminder&&!this._setupMode?G`
                    <div class="setup-save-reminder">
                      Setup changes (zone heating types and floor system entities) are queued for
                      persistence. Storage-mode dashboards save automatically; YAML-mode dashboards
                      require editing the dashboard YAML manually.
                    </div>
                  `:""}
              ${this._setupMode?G`
                    <div class="edit-hint">
                      Set each zone's heating type (Floor Heat or HVAC) and configure floor system
                      sensors below. Changes persist automatically on storage-mode dashboards. YAML-mode
                      dashboards must be edited manually.
                    </div>
                    ${this.renderFloorSystemSetup()}
                  `:this._editSensors?G`<div class="edit-hint">Assign sensors to HA areas or zones, set floor per zone, or hide. Save the dashboard to keep layout changes.</div>`:""}
              <div class="top-strip">
                ${this.renderWeatherStrip()}
                ${this.renderFloorSystem()}
              </div>
              ${this.renderSunTracker()}
              ${e.length?e.map(e=>this.renderFloorSection(e)):G`<div class="empty">No climate zones found. Check your configuration.</div>`}
            `}
      </ha-card>
    `}};e([fe({attribute:!1})],mt.prototype,"hass",void 0),e([fe({attribute:!1})],mt.prototype,"_config",void 0),e([he()],mt.prototype,"_expandedZone",void 0),e([he()],mt.prototype,"_editSensors",void 0),e([he()],mt.prototype,"_setupMode",void 0),e([he()],mt.prototype,"_setupSaveReminder",void 0),e([he()],mt.prototype,"_view",void 0),e([he()],mt.prototype,"_placingThermostat",void 0),e([he()],mt.prototype,"_forecast",void 0),mt=e([pe("climate-command-center")],mt),window.customCards=window.customCards??[],window.customCards.push({type:"climate-command-center",name:"Climate Command Center",description:"Unified dashboard for thermostats, heated floors, and weather sensors",preview:!0}),console.info("%c CLIMATE-COMMAND-CENTER %c v0.5.1 ","color: white; background: #0288d1; font-weight: 700;","color: #0288d1; background: white; font-weight: 700;");const gt=()=>mt,bt=()=>document.createElement("climate-command-center-editor");export{mt as ClimateCommandCenterCard,gt as getCard,bt as getCardEditor};
