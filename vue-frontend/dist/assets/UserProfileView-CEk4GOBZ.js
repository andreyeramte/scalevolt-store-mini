import{_ as B,C as $,i as w,S as H,k as K,F as q}from"./index-Cov9520u.js";import"./auth-DJKOFJE4.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F="firebasestorage.googleapis.com",G="storageBucket",j=2*60*1e3,W=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f extends q{constructor(e,s,n=0){super(U(e),`Firebase Storage: ${s} (${U(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,f.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return U(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var p;(function(t){t.UNKNOWN="unknown",t.OBJECT_NOT_FOUND="object-not-found",t.BUCKET_NOT_FOUND="bucket-not-found",t.PROJECT_NOT_FOUND="project-not-found",t.QUOTA_EXCEEDED="quota-exceeded",t.UNAUTHENTICATED="unauthenticated",t.UNAUTHORIZED="unauthorized",t.UNAUTHORIZED_APP="unauthorized-app",t.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",t.INVALID_CHECKSUM="invalid-checksum",t.CANCELED="canceled",t.INVALID_EVENT_NAME="invalid-event-name",t.INVALID_URL="invalid-url",t.INVALID_DEFAULT_BUCKET="invalid-default-bucket",t.NO_DEFAULT_BUCKET="no-default-bucket",t.CANNOT_SLICE_BLOB="cannot-slice-blob",t.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",t.NO_DOWNLOAD_URL="no-download-url",t.INVALID_ARGUMENT="invalid-argument",t.INVALID_ARGUMENT_COUNT="invalid-argument-count",t.APP_DELETED="app-deleted",t.INVALID_ROOT_OPERATION="invalid-root-operation",t.INVALID_FORMAT="invalid-format",t.INTERNAL_ERROR="internal-error",t.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(p||(p={}));function U(t){return"storage/"+t}function X(){const t="An unknown error occurred, please check the error payload for server response.";return new f(p.UNKNOWN,t)}function Y(){return new f(p.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function z(){return new f(p.CANCELED,"User canceled the upload/download.")}function Z(t){return new f(p.INVALID_URL,"Invalid URL '"+t+"'.")}function J(t){return new f(p.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+t+"'.")}function y(t){return new f(p.INVALID_ARGUMENT,t)}function M(){return new f(p.APP_DELETED,"The Firebase app was deleted.")}function Q(t){return new f(p.INVALID_ROOT_OPERATION,"The operation '"+t+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d{constructor(e,s){this.bucket=e,this.path_=s}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,s){let n;try{n=d.makeFromUrl(e,s)}catch{return new d(e,"")}if(n.path==="")return n;throw J(e)}static makeFromUrl(e,s){let n=null;const i="([A-Za-z0-9.\\-_]+)";function o(_){_.path.charAt(_.path.length-1)==="/"&&(_.path_=_.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+i+a,"i"),r={bucket:1,path:3};function l(_){_.path_=decodeURIComponent(_.path)}const u="v[A-Za-z0-9_]+",g=s.replace(/[.]/g,"\\."),m="(/([^?#]*).*)?$",b=new RegExp(`^https?://${g}/${u}/b/${i}/o${m}`,"i"),R={bucket:1,path:3},T=s===F?"(?:storage.googleapis.com|storage.cloud.google.com)":s,h="([^?#]*)",I=new RegExp(`^https?://${T}/${i}/${h}`,"i"),k=[{regex:c,indices:r,postModify:o},{regex:b,indices:R,postModify:l},{regex:I,indices:{bucket:1,path:2},postModify:l}];for(let _=0;_<k.length;_++){const O=k[_],v=O.regex.exec(e);if(v){const V=v[O.indices.bucket];let D=v[O.indices.path];D||(D=""),n=new d(V,D),O.postModify(n);break}}if(n==null)throw Z(e);return n}}class ee{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function te(t,e,s){let n=1,i=null,o=null,a=!1,c=0;function r(){return c===2}let l=!1;function u(...h){l||(l=!0,e.apply(null,h))}function g(h){i=setTimeout(()=>{i=null,t(b,r())},h)}function m(){o&&clearTimeout(o)}function b(h,...I){if(l){m();return}if(h){m(),u.call(null,h,...I);return}if(r()||a){m(),u.call(null,h,...I);return}n<64&&(n*=2);let k;c===1?(c=2,k=0):k=(n+Math.random())*1e3,g(k)}let R=!1;function T(h){R||(R=!0,m(),!l&&(i!==null?(h||(c=2),clearTimeout(i),g(0)):h||(c=1)))}return g(0),o=setTimeout(()=>{a=!0,T(!0)},s),T}function se(t){t(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ne(t){return t!==void 0}function P(t,e,s,n){if(n<e)throw y(`Invalid value for '${t}'. Expected ${e} or greater.`);if(n>s)throw y(`Invalid value for '${t}'. Expected ${s} or less.`)}function ie(t){const e=encodeURIComponent;let s="?";for(const n in t)if(t.hasOwnProperty(n)){const i=e(n)+"="+e(t[n]);s=s+i+"&"}return s=s.slice(0,-1),s}var N;(function(t){t[t.NO_ERROR=0]="NO_ERROR",t[t.NETWORK_ERROR=1]="NETWORK_ERROR",t[t.ABORT=2]="ABORT"})(N||(N={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oe(t,e){const s=t>=500&&t<600,i=[408,429].indexOf(t)!==-1,o=e.indexOf(t)!==-1;return s||i||o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e,s,n,i,o,a,c,r,l,u,g,m=!0,b=!1){this.url_=e,this.method_=s,this.headers_=n,this.body_=i,this.successCodes_=o,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=r,this.timeout_=l,this.progressCallback_=u,this.connectionFactory_=g,this.retry=m,this.isUsingEmulator=b,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((R,T)=>{this.resolve_=R,this.reject_=T,this.start_()})}start_(){const e=(n,i)=>{if(i){n(!1,new E(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const a=c=>{const r=c.loaded,l=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(r,l)};this.progressCallback_!==null&&o.addUploadProgressListener(a),o.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(a),this.pendingConnection_=null;const c=o.getErrorCode()===N.NO_ERROR,r=o.getStatus();if(!c||oe(r,this.additionalRetryCodes_)&&this.retry){const u=o.getErrorCode()===N.ABORT;n(!1,new E(!1,null,u));return}const l=this.successCodes_.indexOf(r)!==-1;n(!0,new E(l,o))})},s=(n,i)=>{const o=this.resolve_,a=this.reject_,c=i.connection;if(i.wasSuccessCode)try{const r=this.callback_(c,c.getResponse());ne(r)?o(r):o()}catch(r){a(r)}else if(c!==null){const r=X();r.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,r)):a(r)}else if(i.canceled){const r=this.appDelete_?M():z();a(r)}else{const r=Y();a(r)}};this.canceled_?s(!1,new E(!1,null,!0)):this.backoffId_=te(e,s,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&se(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class E{constructor(e,s,n){this.wasSuccessCode=e,this.connection=s,this.canceled=!!n}}function ae(t,e){e!==null&&e.length>0&&(t.Authorization="Firebase "+e)}function ce(t,e){t["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function le(t,e){e&&(t["X-Firebase-GMPID"]=e)}function ue(t,e){e!==null&&(t["X-Firebase-AppCheck"]=e)}function he(t,e,s,n,i,o,a=!0,c=!1){const r=ie(t.urlParams),l=t.url+r,u=Object.assign({},t.headers);return le(u,e),ae(u,s),ce(u,o),ue(u,n),new re(l,t.method,u,t.body,t.successCodes,t.additionalRetryCodes,t.handler,t.errorHandler,t.timeout,t.progressCallback,i,a,c)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _e(t){if(t.length===0)return null;const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function de(t){const e=t.lastIndexOf("/",t.length-2);return e===-1?t:t.slice(e+1)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(e,s){this._service=e,s instanceof d?this._location=s:this._location=d.makeFromUrl(s,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,s){return new A(e,s)}get root(){const e=new d(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return de(this._location.path)}get storage(){return this._service}get parent(){const e=_e(this._location.path);if(e===null)return null;const s=new d(this._location.bucket,e);return new A(this._service,s)}_throwIfRoot(e){if(this._location.path==="")throw Q(e)}}function C(t,e){const s=e==null?void 0:e[G];return s==null?null:d.makeFromBucketSpec(s,t)}class pe{constructor(e,s,n,i,o,a=!1){this.app=e,this._authProvider=s,this._appCheckProvider=n,this._url=i,this._firebaseVersion=o,this._isUsingEmulator=a,this._bucket=null,this._host=F,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=j,this._maxUploadRetryTime=W,this._requests=new Set,i!=null?this._bucket=d.makeFromBucketSpec(i,this._host):this._bucket=C(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=d.makeFromBucketSpec(this._url,e):this._bucket=C(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){P("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){P("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const s=await e.getToken();if(s!==null)return s.accessToken}return null}async _getAppCheckToken(){if(K(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new A(this,e)}_makeRequest(e,s,n,i,o=!0){if(this._deleted)return new ee(M());{const a=he(e,this._appId,n,i,s,this._firebaseVersion,o,this._isUsingEmulator);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,s){const[n,i]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,s,n,i).getPromise()}}const x="@firebase/storage",L="0.13.12";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fe="storage";function me(t,{instanceIdentifier:e}){const s=t.getProvider("app").getImmediate(),n=t.getProvider("auth-internal"),i=t.getProvider("app-check-internal");return new pe(s,n,i,e,H)}function ge(){B(new $(fe,me,"PUBLIC").setMultipleInstances(!0)),w(x,L,""),w(x,L,"esm2017")}ge();
