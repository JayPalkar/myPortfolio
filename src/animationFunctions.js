import gsap from "gsap";

// export const showModal = (modal) => {
//   modal.style.display = "block";

//   gsap.set(modal, { opacity: 0 });
//   gsap.to(modal, { opacity: 1, duration: 0.5 });
// };

// export const hideModal = (modal) => {
//   gsap.to(modal, {
//     opacity: 0,
//     duration: 0.5,
//     onComplete: () => {
//       modal.style.display = "none";
//     },
//   });
// };

// export const playHoverAnimation = (object, isHovering) => {
//   gsap.killTweensOf(object.scale);
//   gsap.killTweensOf(object.position);
//   gsap.killTweensOf(object.rotation);

//   if (object.name.includes("_hover_3")) {
//     if (isHovering) {
//       gsap.to(object.scale, {
//         x: object.userData.initialScale.x,
//         y: object.userData.initialScale.y,
//         z: object.userData.initialScale.z,
//         duration: 0.2,
//         ease: "bounce.out(1.8)",
//       });
//     } else {
//       gsap.to(object.scale, {
//         x: object.userData.initialScale.x,
//         y: object.userData.initialScale.y,
//         z: object.userData.initialScale.z,
//         duration: 0.2,
//         ease: "bounce.out(1.8)",
//       });
//     }
//     return; // exit early so default animation doesn’t run
//   }

//   if (isHovering) {
//     gsap.to(object.scale, {
//       x: object.userData.initialScale.x * 1.2,
//       y: object.userData.initialScale.y * 1.2,
//       z: object.userData.initialScale.z * 1.2,
//       duration: 0.5,
//       ease: "bounce.out(1.8)",
//     });
//   } else {
//     gsap.to(object.scale, {
//       x: object.userData.initialScale.x,
//       y: object.userData.initialScale.y,
//       z: object.userData.initialScale.z,
//       duration: 0.2,
//       ease: "bounce.out(1.8)",
//     });
//   }
// };
