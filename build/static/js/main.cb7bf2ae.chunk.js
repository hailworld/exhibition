(this.webpackJsonpexhibition=this.webpackJsonpexhibition||[]).push([[0],{22:function(e,t,n){},26:function(e,t,n){"use strict";n.r(t);var i=n(6),o=n.n(i),r=n(16),a=n.n(r),s=(n(22),n(9)),c=n(10),f=n(4),u=(n(17),n(8)),p=n(12),d=Math.PI,j=function(){var e=Object(i.useRef)(),t=Object(i.useState)(!1),n=Object(c.a)(t,2),o=n[0],r=n[1],a=Object(i.useReducer)((function(e,t){return Object(s.a)(Object(s.a)({},e),t)}),{}),j=Object(c.a)(a,2),b=j[0],v=j[1],w=Object(i.useReducer)((function(e,t){return Object(s.a)(Object(s.a)({},e),t)}),{}),h=Object(c.a)(w,2),x=h[0];h[1];Object(i.useEffect)((function(){if(!o){var t=e.current,n=t.offsetWidth,i=t.offsetHeight,a=new f.o,s=new f.k(75,n/i,.1,1e3);s.position.set(0,0,12),s.rotation.set(d/2,0,0);var c=new f.u({antialias:!0});c.setSize(n,i),c.setClearColor(2238530,1),t.appendChild(c.domElement),v({scene:a,camera:s,renderer:c}),r(!0),window.scene=a,window.camera=s,window.renderer=c}}),[o]);var g=b.scene,l=b.camera,E=b.renderer;return Object(i.useEffect)((function(){if(l&&E){var t=function(){var t=e.current,n=t.offsetWidth,i=t.offsetHeight;l.aspect=n/i,l.updateProjectionMatrix(),E.setSize(n,i)};return window.addEventListener("resize",t),function(){window.removeEventListener("resize",t)}}}),[l,E]),Object(i.useEffect)((function(){}),[g]),Object(i.useEffect)((function(){if(g){var e=new f.a(16777215,.5);g.add(e);var t=new f.l(16777215,1,80);t.position.set(0,0,19),g.add(t)}}),[g]),Object(i.useEffect)((function(){}),[l,E]),Object(i.useEffect)((function(){if(l&&E){var e=E.domElement,t=function(t){var n=e.offsetWidth,i=e.offsetHeight,o=l.rotation,r=o.x,a=o.y,s=t.offsetX,c=t.offsetY,f=function(e){var t=e.offsetX,o=e.offsetY,f=r+(o-c)/(i/2)*d,u=a+(t-s)/(n/2)*(2*d);l.rotation.y=u,console.info(f,u)};e.addEventListener("pointermove",f),e.addEventListener("pointerup",(function t(){e.removeEventListener("pointermove",f),e.removeEventListener("pointerup",t)}))};return e.addEventListener("pointerdown",t),function(){e.removeEventListener("pointerdown",t)}}}),[l,E]),Object(i.useEffect)((function(){if(g&&l&&E){var e=E.domElement,t=function(t){var n=t.offsetX,i=t.offsetY,o=Date.now();e.addEventListener("pointerup",(function t(r){e.removeEventListener("pointerup",t);var a=r.offsetX,s=r.offsetY,u=Date.now();if(!(Math.abs(n-a)>5||Math.abs(i-s)>5||u-o>1e3)){var p=e.offsetWidth,d=e.offsetHeight,j=new f.n,b=a/p*2-1,v=-s/d*2+1,w=new f.s(b,v);j.setFromCamera(w,l);var h=j.intersectObjects(g.children,!0),x=Object(c.a)(h,1)[0];x&&x.object&&x.object.onClick&&x.object.onClick(x)}}))};return e.addEventListener("pointerdown",t),function(){e.removeEventListener("pointerdown",t)}}}),[g,l,E]),Object(i.useEffect)((function(){if(g&&l){var e=new f.d(100,100,1),t=new f.j({color:3355443}),n=new f.i(e,t);n.position.z=-.5,n.onClick=function(e){var t=e.point,n=t.x,i=t.y;Math.abs(n)>30&&(n=n>0?30:-30),Math.abs(i)>30&&(i=i>0?30:-30),new u.a.Tween(l.position).to({x:n,y:i},200).interpolation(u.a.Interpolation.Bezier).easing(u.a.Easing.Linear.None).start()},g.add(n)}}),[g,l]),Object(i.useEffect)((function(){if(g&&l){var e=new f.d(100,100,1),t=new f.j({color:16777215}),n=new f.i(e,t);n.position.z=20.5,g.add(n)}}),[g,l]),Object(i.useEffect)((function(){if(g&&l){var e=function(e,t){var n=new f.d(100,20,1),i=new f.j({color:14540253}),o=new f.i(n,i);o.position.z=10,o.rotation.x=d/2;var r=new f.g;r.add(o);return e.forEach((function(e,n){(function(e,t){return new Promise((function(n,i){var o=new Image;o.src=e,o.onload=function(){var i=o.width,r=o.height,a=i/16,s=r/9,c=Math.max(a,s),p=i/c,j=r/c,b=(new f.r).load(e),v=new f.d(p,j,.4),w=[new f.j({color:16777215}),new f.j({color:16777215}),new f.j({color:16777215}),new f.j({color:16777215}),new f.j({color:16777215}),new f.j({map:b})],h=new f.i(v,w);h.position.z=.3,h.rotation.x=d/2,h.onClick=function(){var e=new f.c;e.setFromObject(h);var n=e.min,i=e.max,o=n.x+(i.x-n.x),r=n.y+(i.y-n.y);n.z,i.z,n.z,new u.a.Tween(l.position).to({x:o+t.position.x,y:r+t.position.y},500).interpolation(u.a.Interpolation.Bezier).easing(u.a.Easing.Linear.None).start(),new u.a.Tween(l.rotation).to({y:function(e,t){var n=e%(2*d),i=t-(n=n>0?n:n+2*d);return Math.abs(i)>d?i>0?e+(2*d-i):e+(2*d+i):e+i}(l.rotation.y,t.rotation.y)},500).interpolation(u.a.Interpolation.Bezier).easing(u.a.Easing.Linear.None).start()};var x=new f.g;x.add(h),n(x)},o.onerror=function(){return i()}}))})(e,t).then((function(e){var t=20*n-40;e.position.set(t,.5,12),r.add(e)}))})),r},t=e(["./exhibits/1-1.jpg","./exhibits/1-2.jpg","./exhibits/1-3.jpg","./exhibits/1-4.jpg","./exhibits/1-5.jpg"],{position:{x:0,y:-20},rotation:{y:0}});t.position.set(0,50,0),t.rotation.set(0,0,d);var n=e(["./exhibits/2-1.jpg","./exhibits/2-2.jpg","./exhibits/2-3.jpg","./exhibits/2-4.jpg","./exhibits/2-5.jpg"],{position:{x:0,y:20},rotation:{y:d}});n.position.set(0,-50,0);var i=e(["./exhibits/3-1.jpg","./exhibits/3-2.jpg","./exhibits/3-3.jpg","./exhibits/3-4.jpg","./exhibits/3-5.jpg"],{position:{x:20,y:0},rotation:{y:d/2}});i.position.set(-50,0,0),i.rotation.set(0,0,d/2*3);var o=e(["./exhibits/4-1.jpg","./exhibits/4-2.jpg","./exhibits/4-3.jpg","./exhibits/4-4.jpg","./exhibits/4-5.jpg"],{position:{x:-20,y:0},rotation:{y:d/2*3}});o.position.set(50,0,0),o.rotation.set(0,0,d/2),g.add(t,n,i,o)}}),[g,l]),Object(i.useEffect)((function(){if(g&&l&&E){var e=!1;return function t(){e||(requestAnimationFrame(t),u.a.update(),Object.values(x).forEach((function(e){return e()})),E.render(g,l))}(),function(){return e=!0}}}),[g,l,E,x]),Object(p.jsx)("div",{ref:e,style:{width:"100vw",height:"100vh"}})};a.a.render(Object(p.jsx)(o.a.StrictMode,{children:Object(p.jsx)(j,{})}),document.getElementById("root"))}},[[26,1,2]]]);
//# sourceMappingURL=main.cb7bf2ae.chunk.js.map